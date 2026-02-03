import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import SubjectPopupContent from './components/SubjectPopupContent';
import PointPopupContent from './components/PointPopupContent';
import Popup from './components/Popup';
import Legend from './components/Legend';
import HelpButton from './components/HelpButton';
import RefreshMapButton from './components/RefreshMapButton';
import Partners from './components/Partners';
import mapHandlerRegistry from './utils/mapHandlerRegistry';
import TrackContext from './context/TrackContext.js';

import 'mapbox-gl/dist/mapbox-gl.css'; // Mapbox default styles
import './assets/mapstyle.css'; // Overrides for mapbox default styles
import './assets/main.css'; // Global styles for map - under construction

import med from './assets/images/med.png';
import sharkIconActive from './assets/images/animal_icons/shark-icon-active.svg';
import sharkIconInactive from './assets/images/animal_icons/shark-icon-inactive.svg';
import sharkIconDeactivated from './assets/images/animal_icons/shark-icon-deactivated.svg';

// instantiate the Map
mapboxgl.accessToken = 'pk.eyJ1IjoidmpvZWxtIiwiYSI6ImNra2hiZXNpMzA1bTcybnA3OXlycnN2ZjcifQ.gH6Nls61WTMVutUH57jMJQ'; // development token

let config;
const keymap = {}; // alt, r
const aquatic = ['#003744', '#005B70', '#219DB8', '#05C1EA', '#60E1FF',
  '#2E8E96', '#47C6B1', '#91E8DA'];
const earthtones = ['#511913', '#711E17', '#961F1A', '#DB2222', '#E5632E',
  '#E67931', '#E69E39', '#D2B541', '#BFBD48'];

const MAP_ICON_SIZE = 30;
const MAP_ICON_SCALE = 2;

// Map subject status to local icon assets
const STATUS_ICON_MAP = {
  active: sharkIconActive,
  inactive: sharkIconInactive,
  deactivated: sharkIconDeactivated
};

window.GlobalMap = null;

// Safe guard helpers to prevent duplicate Mapbox resource additions
function safeAddImage(map, id, image, options) {
  try {
    if (typeof map?.hasImage === 'function' && map.hasImage(id)) {
      return; // image already present
    }
    map.addImage(id, image, options || {});
  } catch (e) { /* ignore */ }
}

function safeAddSource(map, id, sourceSpec) {
  try {
    const existing = typeof map?.getSource === 'function' ? map.getSource(id) : null;
    if (existing) {
      // If source exists and it's geojson, update its data
      if (sourceSpec && sourceSpec.type === 'geojson' && sourceSpec.data) {
        try { existing.setData(sourceSpec.data); } catch (_) {}
      }
      return;
    }
    map.addSource(id, sourceSpec);
  } catch (e) { /* ignore */ }
}

function safeAddLayer(map, layerSpec) {
  try {
    const id = layerSpec && layerSpec.id;
    if (!id) return;
    const exists = typeof map?.getLayer === 'function' ? map.getLayer(id) : null;
    if (exists) {
      // Layer already exists; optionally ensure ordering
      try { map.moveLayer(id); } catch (_) {}
      return;
    }
    map.addLayer(layerSpec);
  } catch (e) { /* ignore */ }
}

// Simple debounce utility for global resize/visibility handlers
function debounce(fn, wait) {
  let t = null;
  return function (...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      try { fn.apply(this, args); } catch (e) { /* ignore */ }
    }, wait);
  };
}

// Attach global, debounced map resize handlers once
function attachGlobalResizeHandlers() {
  try {
    if (window.__gw_global_resize_attached) return;
    const handler = debounce(() => {
      try { window.GlobalMap && window.GlobalMap.resize(); } catch (e) {}
    }, 150);

    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') handler();
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.__gw_global_resize_attached = true;
    window.__gw_global_resize_handler = handler;
    window.__gw_global_visibility_handler = onVisibility;
  } catch (e) { /* ignore */ }
}

// Observe the map container for size changes and trigger a resize with logging
function attachContainerResizeObserver() {
  try {
    if (window.__gw_map_resize_observer) return;
    const container = document.getElementById('map-container');
    if (!container) return;

    const handler = debounce(() => {
      try {
        const rect = container.getBoundingClientRect();
        const canvas = window.GlobalMap && typeof window.GlobalMap.getCanvas === 'function' ? window.GlobalMap.getCanvas() : null;
        const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
        console.info('[GW] Map container resize', {
          container: { width: Math.round(rect.width), height: Math.round(rect.height) },
          canvas: canvasRect ? { width: Math.round(canvasRect.width), height: Math.round(canvasRect.height) } : null,
          dpr: window.devicePixelRatio || 1
        });
        window.GlobalMap && window.GlobalMap.resize();
      } catch (e) { /* ignore */ }
    }, 120);

    const ro = new ResizeObserver(() => handler());
    ro.observe(container);
    window.__gw_map_resize_observer = ro;
    window.__gw_map_container_resize_handler = handler;
  } catch (e) { /* ignore */ }
}

const imgElFromSrc = (src, width = MAP_ICON_SIZE, height = null) => new Promise((resolve, reject) => {
  const img = new Image();
  img.setAttribute('crossorigin', 'anonymous');

  img.addEventListener('load', () => {
    if (width && height) {
      img.width = width;
      img.height = height;
    } else {
      const baseUnit = width || height;
      const { naturalHeight, naturalWidth } = img;
      const largest = Math.max(naturalHeight, naturalWidth) || baseUnit;
      const smallest = Math.min(naturalHeight, naturalWidth) || baseUnit;
      const widthIsLarger = largest === naturalWidth;
      const aspectRatio = smallest / largest;
      if (widthIsLarger) {
        img.width = baseUnit;
        img.height = baseUnit * aspectRatio;
      } else {
        img.height = baseUnit;
        img.width = baseUnit * aspectRatio;
      }
    }
    resolve(img);
  }, { once: true });

  img.onerror = (e) => {
    console.log('image error', src, e);
    reject(new Error('could not load image'));
  };
  img.src = src;
});

// Fetch with retry, timeout, and abort chaining
async function fetchWithRetry(url, options = {}, retryCfg = {}) {
  const {
    retries = 2,
    backoff = 700,
    factor = 2,
    timeout = 15000,
    retryOn = (resp) => (resp && (resp.status === 429 || (resp.status >= 500 && resp.status < 600)))
  } = retryCfg;

  let attempt = 0;
  let delay = backoff;
  const parentSignal = options.signal;

  while (true) {
    const ctrl = new AbortController();
    let onParentAbort;
    let timeoutId;
    let abortReason = null;
    try {
      if (parentSignal) {
        if (parentSignal.aborted) throw new DOMException('Aborted', 'AbortError');
        onParentAbort = () => { abortReason = 'parent'; ctrl.abort(); };
        parentSignal.addEventListener('abort', onParentAbort, { once: true });
      }
      timeoutId = setTimeout(() => { abortReason = 'timeout'; ctrl.abort(); }, timeout);
      const resp = await fetch(url, { ...options, signal: ctrl.signal });
      clearTimeout(timeoutId);
      if (onParentAbort) parentSignal.removeEventListener('abort', onParentAbort);
      if (!resp.ok) {
        if (attempt < retries && retryOn(resp)) {
          await new Promise(r => setTimeout(r, delay));
          attempt += 1;
          delay *= factor;
          continue;
        }
        throw new Error(`Request failed with status ${resp.status}`);
      }
      return resp;
    } catch (err) {
      clearTimeout(timeoutId);
      if (onParentAbort) try { parentSignal.removeEventListener('abort', onParentAbort); } catch (_) {}
      const isAbort = err && (err.name === 'AbortError');
      const isNetwork = err instanceof TypeError;
      if (isAbort) {
        try { err.__gwAbortReason = abortReason || 'unknown'; } catch (_) {}
        throw err;
      };
      if (attempt < retries && isNetwork) {
        await new Promise(r => setTimeout(r, delay));
        attempt += 1;
        delay *= factor;
        continue;
      }
      throw err;
    }
  }
}

const fixAntimeridianCrossing = (featCollection) => {
  if (!featCollection?.features?.length) return featCollection;

  const MAX_ABSOLUTE_LONGITUDE = 180;
  const WORLD_TOTAL_LONGITUDE = 360;

  const adjustCoordinatesForCrossing = (coordinates) => {
    return coordinates.reduce((accumulator, coordinate, index) => {
      let fixedCoordinate = coordinate;
      if (index !== 0) {
        const longitudeDifference = coordinate[0] - accumulator.at(-1)[0];

        if (longitudeDifference > MAX_ABSOLUTE_LONGITUDE) {
          fixedCoordinate = [coordinate[0] - WORLD_TOTAL_LONGITUDE, coordinate[1]];
        }

        if (longitudeDifference < -MAX_ABSOLUTE_LONGITUDE) {
          fixedCoordinate = [coordinate[0] + WORLD_TOTAL_LONGITUDE, coordinate[1]];
        }
      }

      accumulator.push(fixedCoordinate);
      return accumulator;
    }, []);
  };

  const processGeometry = (geometry) => {
    if (!geometry || !geometry.coordinates) return geometry;

    const { type, coordinates } = geometry;


    switch (type) {
      case 'LineString':
        return {
          ...geometry,
          coordinates: adjustCoordinatesForCrossing(coordinates)
        };

      case 'Polygon':
        return {
          ...geometry,
          coordinates: coordinates.map(ring => adjustCoordinatesForCrossing(ring))
        };

      case 'MultiLineString':
        return {
          ...geometry,
          coordinates: coordinates.map(lineString => adjustCoordinatesForCrossing(lineString))
        };

      case 'MultiPolygon':
        return {
          ...geometry,
          coordinates: coordinates.map(polygon =>
            polygon.map(ring => adjustCoordinatesForCrossing(ring))
          )
        };

      default:
        return geometry;
    }
  };

  featCollection.features = featCollection.features.map((feature) => {
    if (!feature?.geometry) return feature;

    return {
      ...feature,
      geometry: processGeometry(feature.geometry)
    };
  });

  return featCollection;
};


/* eslint-disable react/prop-types */
const App = (props) => {
  var [subjects, setSubjects] = useState([]);
  var [tracks, setTracks] = useState({});
  var [subjectColor, setSubjectColor] = useState({});
  var [legSub, setLegSub] = useState(undefined);
  const [subjectPopups, setSubjectPopups] = useState([]);
  const [pointPopups, setPointPopups] = useState([]);
  const [legendOpen, setLegendOpen] = useState(false);
  const configFetchCtlRef = useRef(null);
  const subjectsFetchCtlRef = useRef(null);
  const tracksFetchCtlMapRef = useRef(new Map());
  // Track subject icon layers to scope feature queries and resolve overlaps
  const subjectIconLayerIdsRef = useRef(new Set());

  const registerSubjectIconLayer = (id) => {
    try { subjectIconLayerIdsRef.current.add(id); } catch (e) { /* ignore */ }
  };
  const getSubjectIconLayerIds = () => Array.from(subjectIconLayerIdsRef.current);

  const toggleLegendState = () => {
    setLegendOpen(!legendOpen);
  };

  // Fetch subjects and draw initial icons; sets up colors and subject stories
  function loadSubjectsAndIcons() {
    if (!config) return;
    const url = `https://${config.server}/${config.public_name}/api/v1.0/subjects?subject_group=${config.subject_group}`;
    try {
      if (subjectsFetchCtlRef.current) { try { subjectsFetchCtlRef.current.abort(); } catch (_) {} }
      const ctl = new AbortController();
      subjectsFetchCtlRef.current = ctl;
      fetchWithRetry(url, { signal: ctl.signal }, { retries: 2, backoff: 700, factor: 2, timeout: 15000 })
        .then(resp => resp.json())
        .then(resp => {
        let index = 0;
        resp.data.data.map((subject) => {
          if (subject.last_position !== undefined) {
            // override subject name if provided in config
            if (config.subjects && config.subjects[subject.id] && config.subjects[subject.id].name) {
              subject.name = config.subjects[subject.id].name;
            }
            // Avoid duplicate icon/layers if they already exist
            try {
              const subjLayerId = 'points' + subject.id;
              if (!window.GlobalMap || !window.GlobalMap.getLayer || !window.GlobalMap.getLayer(subjLayerId)) {
                drawIcon(subject).then();
              }
            } catch (e) {
              // fallback to drawing
              drawIcon(subject).then();
            }
          }

          let colors = earthtones;
          if (Array.isArray(config.color_scheme)) {
            colors = config.color_scheme;
          } else if (config.color_scheme === 'earthtones') {
            colors = earthtones;
          } else if (config.color_scheme === 'aquatic') {
            colors = aquatic;
          } else if (config.color_scheme === 'custom' && Array.isArray(config.custom_colors)) {
            colors = config.custom_colors;
          } else {
            console.warn('Invalid color scheme, falling back to earthtones.');
            colors = earthtones;
          }
          subject.color = colors[index % colors.length];
          index++;

          setSubjectColor(prev => ({ ...prev, [subject.id]: subject.color }));
        });

        for (let i = 0; i < resp.data.data.length; i++) {
          const id = resp.data.data[i].id;
          resp.data.data[i].display_story = config.subjects && config.subjects[id] && (config.subjects[id].pictures || config.subjects[id].detail_description);
        }
        setSubjects(resp.data.data);
        try { if (window.GlobalMap) window.GlobalMap.__gw_subjects_loaded = true; } catch (e) {}
        })
        .catch((e) => { console.error(e); })
        .finally(() => { if (subjectsFetchCtlRef.current === ctl) subjectsFetchCtlRef.current = null; });
    } catch (e) { /* ignore */ }
  }

  function initMap() {
    // If a map already exists, preserve it and just ensure proper sizing and visibility hooks
    if (window.GlobalMap && typeof window.GlobalMap.resize === 'function') {
      try { window.GlobalMap.resize(); } catch (err) {}
      setTimeout(() => { try { window.GlobalMap.resize(); } catch (e) {} }, 200);
      // Attach debounced global handlers once
      attachGlobalResizeHandlers();
      // Observe container for subsequent size changes
      attachContainerResizeObserver();
      // If the map's style is loaded, ensure subjects are loaded; otherwise, attach a one-time load hook
      try {
        const styleLoaded = typeof window.GlobalMap.isStyleLoaded === 'function'
          ? window.GlobalMap.isStyleLoaded()
          : (typeof window.GlobalMap.loaded === 'function' ? window.GlobalMap.loaded() : true);
        if (styleLoaded) {
          if (!window.GlobalMap.__gw_subjects_loaded) {
            loadSubjectsAndIcons();
          }
        } else if (!window.GlobalMap.__gw_subjects_load_hook_attached) {
          window.GlobalMap.__gw_subjects_load_hook_attached = true;
          window.GlobalMap.on('load', () => {
            try {
              if (!window.GlobalMap.__gw_subjects_loaded) {
                loadSubjectsAndIcons();
              }
            } catch (e) {}
          });
        }
      } catch (e) {}
      return;
    }

    window.GlobalMap = new mapboxgl.Map({
      container: 'map-container',
      style: !config.map || !config.map.style ? 'mapbox://styles/vjoelm/cktdex96919t117p3rkq7c7yu' : config.map.style,
      center: !config.map || !Array.isArray(config.map.center) ? [173.497498, -40.043578] : config.map.center,
      zoom: !config.map || typeof config.map.zoom !== 'number' ? 5 : config.map.zoom,
      pitch: !config.map || typeof config.map.pitch !== 'number' ? 1 : config.map.pitch
    });

    var nav = new mapboxgl.NavigationControl({ visualizePitch: true });
    window.GlobalMap.addControl(nav, 'top-left');

    window.GlobalMap.on('load', function () {
      // console.log(process.env.PUBLIC_URL); - This will not function in Ionic/Capacitor
      window.GlobalMap.loadImage(med, (_error, img) => {
        safeAddImage(window.GlobalMap, 'subject-popup-box', img, { sdf: true });
      });
      // Fetch and draw subjects/icons
      loadSubjectsAndIcons();

      // Ensure the map canvas sizes to its container right after load.
      // Sometimes on mobile or in embedded webviews the container size isn't
      // final when the map is created — trigger a resize (immediately and
      // after a short delay) and wire window resize/orientation events.
      try {
        window.GlobalMap.resize();
      } catch (err) {
        // ignore
      }
      // second pass after layout settles
      setTimeout(() => {
        try { window.GlobalMap.resize(); } catch (e) { /* ignore */ }
      }, 200);

      // Attach debounced global resize/visibility handlers once
      attachGlobalResizeHandlers();
      // Observe container for subsequent size changes
      attachContainerResizeObserver();
    });
  }

  useEffect(() => {
    let isSubscribed = true;
    // load configuration data with retry, timeout and abort
    try {
      if (configFetchCtlRef.current) { try { configFetchCtlRef.current.abort(); } catch (_) {} }
      const ctl = new AbortController();
      configFetchCtlRef.current = ctl;
      fetchWithRetry(props.configFile, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        signal: ctl.signal
      }, { retries: 2, backoff: 700, factor: 2, timeout: 15000 })
        .then((response) => response.json())
        .then((json) => {
          if (!isSubscribed) return;
          try {
            config = validateAndNormalizeConfig(json);
          } catch (e) {
            console.warn('Invalid config, using defaults:', e);
            config = validateAndNormalizeConfig({});
          }
          initMap();
        })
        .catch((e) => {
          // Ignore aborts caused by effect cleanup (StrictMode double-invoke)
          if (e?.name === 'AbortError' && e.__gwAbortReason === 'parent') {
            return;
          }
          console.error('Failed to load config:', e);
          try { config = validateAndNormalizeConfig({}); } catch (_) {}
          if (isSubscribed) initMap();
        })
        .finally(() => { if (configFetchCtlRef.current === ctl) configFetchCtlRef.current = null; });
    } catch (e) { /* ignore */ }
    // Cancel the subscription to useEffect().
    return function cleanup() {
      // Keep the map instance and global handlers alive across screen changes.
      isSubscribed = false;
      try { if (configFetchCtlRef.current) configFetchCtlRef.current.abort(); } catch (_) {}
    };
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  function displayTracks(updatedTrack) {
    const id = updatedTrack[0];
    const displayed = updatedTrack[1];

    const lineLayerId = 'LineString ' + id;
    const pointsLayerId = 'track-points-layer-' + id;

    const layer = window.GlobalMap.getLayer(lineLayerId);

    if (displayed) {
      if (layer === undefined) {
        // layer (and its points) don't exist yet — fetch and draw them
        fetchTrack(id);
      } else {
        // show both the line and its points (if points layer exists)
        window.GlobalMap.setLayoutProperty(lineLayerId, 'visibility', 'visible'); // turn on visibility
        if (window.GlobalMap.getLayer(pointsLayerId)) {
          window.GlobalMap.setLayoutProperty(pointsLayerId, 'visibility', 'visible');
        }
        
      }
    } else {
      // hide both line and points when toggled off
      if (window.GlobalMap.getLayer(lineLayerId)) {
        window.GlobalMap.setLayoutProperty(lineLayerId, 'visibility', 'none'); // turn off visibility
      }
      if (window.GlobalMap.getLayer(pointsLayerId)) {
        window.GlobalMap.setLayoutProperty(pointsLayerId, 'visibility', 'none');
      }
      
    }
  }

  // Draw tracks and add button component to display tracks
  function fetchTrack(subjectId) {
    const url = `https://${config.server}/${config.public_name}/api/v1.0/subject/` + subjectId + '/tracks';
    try {
      const mapRef = tracksFetchCtlMapRef.current;
      const prev = mapRef.get(subjectId);
      if (prev) { try { prev.abort(); } catch (_) {} }
      const ctl = new AbortController();
      mapRef.set(subjectId, ctl);
      fetchWithRetry(url, { signal: ctl.signal }, { retries: 2, backoff: 700, factor: 2, timeout: 20000 })
        .then(resp => resp.json())
        .then(resp => { drawTrack(resp.data, subjectId); })
        .catch((e) => { console.error(e); })
        .finally(() => { if (mapRef.get(subjectId) === ctl) mapRef.delete(subjectId); });
    } catch (e) { /* ignore */ }
  }

  function drawTrack(json, subjectId) {
    const geojson = fixAntimeridianCrossing(json);

    const lineSourceId = geojson.features[0].geometry.type + ' ' + geojson.features[0].properties.id;
    safeAddSource(window.GlobalMap, lineSourceId, {
      type: 'geojson',
      data: geojson
    });

    safeAddLayer(window.GlobalMap, {
      id: geojson.features[0].geometry.type + ' ' + geojson.features[0].properties.id,
      type: 'line',
      source: lineSourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': subjectColor[subjectId],
        'line-width': 4
      }
    });

    // --- Points for each coordinate (dots) ---
    try {
      const feature = geojson.features[0];
      const coords = feature.geometry.coordinates || [];
      const times = feature.properties?.coordinateProperties?.times || [];

      // determine index of most recent point (if times available) so we can omit it
      let recentIdx = -1;
      if (Array.isArray(times) && times.length === coords.length && times.length > 0) {
        try {
          const timeMillis = times.map(t => {
            const m = Date.parse(t);
            return Number.isFinite(m) ? m : NaN;
          });
          const max = Math.max(...timeMillis.filter(Number.isFinite));
          if (Number.isFinite(max)) {
            recentIdx = timeMillis.indexOf(max);
          }
        } catch (e) {
          recentIdx = -1;
        }
      }

      // Build index mapping so oldest location is labelled 1, increasing for newer points.
      // If valid times are available we rank by timestamp (oldest first). Otherwise
      // we assume coords are ordered newest->oldest and reverse the numbering.
      const n = coords.length;
      const idxMap = new Array(n).fill(0);
      const hasValidTimes = Array.isArray(times) && times.length === n && times.some(t => !Number.isNaN(Date.parse(t)));
      if (hasValidTimes) {
        const timePairs = times.map((t, i) => ({ i, tParsed: Number.isFinite(Date.parse(t)) ? Date.parse(t) : NaN }));
        timePairs.sort((a, b) => {
          const ta = Number.isFinite(a.tParsed) ? a.tParsed : Infinity;
          const tb = Number.isFinite(b.tParsed) ? b.tParsed : Infinity;
          return ta - tb; // ascending => oldest first
        });
        timePairs.forEach((item, rank) => { idxMap[item.i] = rank + 1; });
      } else {
        // fallback: assume coords are newest-first, so oldest should be highest index
        for (let i = 0; i < n; i++) idxMap[i] = n - i;
      }

      const pointsGeojson = {
        type: 'FeatureCollection',
        features: coords
          .map((coord, i) => {
            const rawTime = times[i] || null;
            let time_date = null;
            let time_time = null;
            let time_timezone = null;
            let time_epoch = null;
            if (rawTime && typeof rawTime === 'string') {
              // match ISO 8601 like 2026-01-13T06:16:57+00:00 or with Z
              const m = rawTime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(Z|[+-]\d{2}:\d{2})$/);
              if (m) {
                time_date = m[1];
                time_time = m[2];
                time_timezone = (m[3] === 'Z') ? '+00:00' : m[3];
              }
              const parsed = Date.parse(rawTime);
              if (Number.isFinite(parsed)) time_epoch = parsed;
            }

            return {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: coord },
              properties: {
                // keep the raw ISO string for later conversions
                time: rawTime,
                // split fields (date, time, timezone) for UI and future timezone conversion
                time_date,
                time_time,
                time_timezone,
                time_epoch,
                idx: idxMap[i] || (i + 1),
                stroke: feature.properties?.stroke || subjectColor[subjectId] || '#000'
              }
            };
          })
          // remove the most recent point so it doesn't duplicate the subject icon
          .filter((f, i) => i !== recentIdx)
      };

      const pointsSourceId = `track-points-${feature.properties.id}`;
      const pointsLayerId = `track-points-layer-${feature.properties.id}`;

      if (!window.GlobalMap.getSource(pointsSourceId)) {
        // ensure any previous handlers for this points layer are removed before re-adding
        try { mapHandlerRegistry.removeLayer(window.GlobalMap, pointsLayerId); } catch (e) { /* ignore */ }
        safeAddSource(window.GlobalMap, pointsSourceId, {
          type: 'geojson',
          data: pointsGeojson
        });

        // determine circle color: prefer valid config.point_colour; otherwise fallback to literal '#4CBE23'
        let pointCircleColor = '#4CBE23'; // default
        try {
          const raw = config && config.point_colour;
          if (typeof raw === 'string') {
            const candidate = raw.trim();
            // accept #RGB or #RRGGBB (case-insensitive)
            const isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(candidate);
            if (isHex) pointCircleColor = candidate;
          }
        } catch (err) {
          // keep default
        }

        safeAddLayer(window.GlobalMap, {
          id: pointsLayerId,
          type: 'circle',
          source: pointsSourceId,
          paint: {
            'circle-color': pointCircleColor,
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 4, 12, 10, 16, 14],
            'circle-stroke-color': '#eeeffc',
            'circle-stroke-width': 4,
            'circle-opacity': 0.95
          }
        });

        mapHandlerRegistry.add(window.GlobalMap, pointsLayerId, 'click', (e) => {
          const f = e.features && e.features[0];
          if (!f) return;
          // If a subject icon is rendered above this point at the click location,
          // prefer the subject icon (do not show the point popup). Query the
          // topmost rendered feature at the point and skip if it's a subject layer.
          try {
          const iconLayers = getSubjectIconLayerIds();
          const top = iconLayers && iconLayers.length
            ? window.GlobalMap.queryRenderedFeatures(e.point, { layers: iconLayers })
            : [];
          if (top && top.length > 0) {
            const topLayerId = top[0]?.layer?.id;
            if (typeof topLayerId === 'string' && topLayerId.startsWith('points')) return;
          }
        } catch (_) {}
          // Prefer pre-split fields if available (time_date, time_time, time_timezone).
          const props = f.properties || {};
        const coordinates = Array.isArray(f.geometry?.coordinates)
          ? f.geometry.coordinates.slice()
          : f.geometry?.coordinates;

        const key = `${subjectId}-${props.idx}-${Date.now()}`;
        setPointPopups(prev => [
          ...prev,
          { key, coordinates, props: {
            idx: props.idx,
            date: props.time_date || null,
            time: props.time_time || null,
            timezone: props.time_timezone || null
          } }
        ]);
        });

        // Ensure the subject's icon and name layers render above the points layer
        // so the subject icon visually and interactively takes priority.
        try {
          const subjPointsLayer = 'points' + subjectId;
          const subjBoxLayer = 'box' + subjectId;
          if (window.GlobalMap.getLayer(subjBoxLayer)) {
            window.GlobalMap.moveLayer(subjBoxLayer);
          }
          if (window.GlobalMap.getLayer(subjPointsLayer)) {
            window.GlobalMap.moveLayer(subjPointsLayer);
          }
        } catch (err) {
          // ignore if moveLayer is not available or fails
        }
        mapHandlerRegistry.add(window.GlobalMap, pointsLayerId, 'mouseenter', () => {
          try { window.GlobalMap.getCanvas().style.cursor = 'pointer'; } catch (e) {}
        });
        mapHandlerRegistry.add(window.GlobalMap, pointsLayerId, 'mouseleave', () => {
          try { window.GlobalMap.getCanvas().style.cursor = ''; } catch (e) {}
        });
      } else {
        // Update the source data if it already exists
        try { window.GlobalMap.getSource(pointsSourceId).setData(pointsGeojson); } catch (e) {}
      }
    } catch (e) {
      console.warn('drawTrack: unable to add track points', e);
    }
  }

  async function fileExists(file) {
    try {
      var img = await fetch(file);
      if (img.status === 404) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async function drawIcon(json) {
    let imgURL = null;
    const subjCfg = (config && config.subjects && config.subjects[json.id]) ? config.subjects[json.id] : null;
    const rawStatus = subjCfg && typeof subjCfg.status === 'string' ? subjCfg.status.trim().toLowerCase() : null;

    // If a valid status is present, prefer the corresponding local icon
    if (rawStatus) {
      if (STATUS_ICON_MAP[rawStatus]) {
        imgURL = STATUS_ICON_MAP[rawStatus];
      } else {
        // Invalid status: warn and fall back to the configured icon
        console.warn(`Unknown subject status "${rawStatus}" for subject ${json.id}; falling back to configured icon.`);
        if (subjCfg && typeof subjCfg.icon === 'string' && subjCfg.icon) {
          imgURL = subjCfg.icon;
        }
      }
    }

    // If no status override applied, follow existing precedence
    if (!imgURL) {
      if (subjCfg && typeof subjCfg.icon === 'string' && subjCfg.icon) {
        imgURL = subjCfg.icon;
      } else if (json.common_name !== null && await fileExists(`public/images/animal_icons/${json.common_name}.png`)) {
        imgURL = `public/images/animal_icons/${json.common_name}.png`;
      } else {
        imgURL = json.last_position.properties.image;
      }
    }
    addImage(json, imgURL);
  }

  function addImage(json, imgURL) {
    const width = !config.map || !config.map.map_icon_size ? MAP_ICON_SIZE : config.map.map_icon_size; const height = undefined;
    imgElFromSrc(
      imgURL,
      width * MAP_ICON_SCALE,
      (height ? (height * MAP_ICON_SCALE) : undefined)
    )
      .then((image) => {
        safeAddImage(window.GlobalMap, json.subject_subtype + json.id, image);
        safeAddSource(window.GlobalMap, 'point' + json.id, {
          type: 'geojson',
          data: json.last_position
        });

        // Animal Icon
        const iconSize = 0.5;
        const iconSizeLayout = ['interpolate', ['linear'], ['zoom'], 1, (iconSize / MAP_ICON_SCALE), 10, (iconSize / MAP_ICON_SCALE), 16, iconSize];
        safeAddLayer(window.GlobalMap, {
          id: 'points' + json.id,
          type: 'symbol',
          source: 'point' + json.id,
          layout: {
            'icon-image': json.subject_subtype + json.id,
            'icon-size': iconSizeLayout,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
          }
        });

        // Register subject icon layer id for scoped queries
        try { registerSubjectIconLayer('points' + json.id); } catch (e) { /* ignore */ }

        // Subject Nametag Icon
        const iconSizeSubjectNametagText = ['step', ['zoom'], 12, 10, 16];
        safeAddLayer(window.GlobalMap, {
          id: 'box' + json.id,
          type: 'symbol',
          source: 'point' + json.id,
          layout: {
            'text-anchor': 'top',
            'text-offset': [0, 0.5],
            'text-allow-overlap': true,
            'text-field': json.name,
            'text-size': iconSizeSubjectNametagText,
            visibility: (!config.map || config.map.show_subject_names) ? 'visible' : 'none'
          },
          paint: {
            'text-color': 'white',
            'text-halo-color': 'rgba(0, 0, 0, 0.5)',
            'text-halo-blur': 3,
            'text-halo-width': 1
          }
        });

        // bind popup to subject — use registry so handlers can be removed if layer is replaced
        const subjLayerId = 'points' + json.id;
        // remove any previous handlers for this subject layer before adding.
        try { mapHandlerRegistry.removeLayer(window.GlobalMap, subjLayerId); } catch (e) { /* ignore */ }

        mapHandlerRegistry.add(window.GlobalMap, subjLayerId, 'click', (e) => {
          // defensive: ensure features exist (sometimes map events fire without features)
          const feat = e && e.features && e.features[0];
          if (!feat) return;

          // Overlap guard: only allow the topmost subject icon to handle the click
          try {
            const iconLayers = getSubjectIconLayerIds();
            const top = iconLayers && iconLayers.length
              ? window.GlobalMap.queryRenderedFeatures(e.point, { layers: iconLayers })
              : [];
            const topLayerId = top && top[0] && top[0].layer && top[0].layer.id;
            if (typeof topLayerId === 'string' && topLayerId !== subjLayerId) {
              return; // another subject icon is visually topmost; ignore
            }
          } catch (err) {
            // ignore query errors
          }

          // copy coords/geometry so we don't hold a reference to the (mutating) event object
          const coordinates = Array.isArray(feat.geometry.coordinates) ? feat.geometry.coordinates.slice() : feat.geometry.coordinates;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const geometryCopy = {
            type: feat.geometry.type,
            coordinates
          };

          setSubjectPopups(prev => [
            ...prev,
            {
              geometry: geometryCopy,
              properties: json
            }
          ]);
        });

        mapHandlerRegistry.add(window.GlobalMap, subjLayerId, 'mouseenter', () => {
          try { window.GlobalMap.getCanvas().style.cursor = 'pointer'; } catch (e) {}
        });
        mapHandlerRegistry.add(window.GlobalMap, subjLayerId, 'mouseleave', () => {
          try { window.GlobalMap.getCanvas().style.cursor = ''; } catch (e) {}
        });
      })
      .catch((error) => {
        console.warn('imgElFromSrc error', error);
      });
  }

  function goToLoc(coords) {
    window.GlobalMap.flyTo({
      center: coords,
      zoom: 15,
      essential: true
    });
  }

  // hot key to reset map (alt + r)
  const logKey = (e) => {
    if (e.keyCode === 82 || e.keyCode === 18) { // 'r' = 82, alt = 18
      keymap[e.keyCode] = (e.type === 'keydown');
      if (keymap[82] && keymap[18]) {
        resetMap();
      }
    }
  };

  const resetMap = () => {
    window.GlobalMap.flyTo({
      center: !config.map || !Array.isArray(config.map.center) ? [-109.3666652, -27.1166662] : config.map.center, // starting position [lng, lat]
      zoom: !config.map || typeof config.map.zoom !== 'number' ? 11 : config.map.zoom, // starting zoom,
      pitch: !config.map || typeof config.map.pitch !== 'number' ? 75 : config.map.pitch,
      essential: true,
      bearing: 0
    });
    // toggle off all tracks??
  };

  return (
    <>
      <TrackContext.Provider value={{ displayTracks, setTracks, tracks }}>
        <div id='gw-map'>
          <div id='app-container'>
            <div id='map-container' onKeyDown={logKey} onKeyUp={logKey}>
              <HelpButton />
              <RefreshMapButton onClick={resetMap} />

              <Legend
                title={config !== undefined ? config.map_title : null}
                subs={subjects}
                subjectData={config}
                onLocClick={(coords) => goToLoc(coords)}
                legendOpen={legendOpen}
                onLegendStateToggle={toggleLegendState}
                legSub={legSub}
                onReturnClick={(subject) => setLegSub(subject)}
                onStoryClick={(subject) => setLegSub(subject)}
              />
            </div>
            <Partners />
          </div>
          {subjectPopups.map(({ properties, geometry }) => (
          <Popup
            key={`${properties.id}-popup`}
            coordinates={geometry.coordinates.slice()}
            onClose={() => {
              setSubjectPopups(prev => prev.filter(({ properties: { id } }) => id !== properties.id));
            }}
          >
            <SubjectPopupContent
              subject={properties}
              subjectData={config.subjects[properties.id]}
              onStoryClick={(subject) => setLegSub(subject)}
              legendOpen={legendOpen}
              onLegendStateToggle={toggleLegendState}
              {...props}
            />
          </Popup>
        ))}

        {/* Track-point popups (siblings, not nested) */}
        {pointPopups.map(({ key, coordinates, props: p }) => (
          <Popup
            key={key}
            coordinates={coordinates}
            onClose={() => setPointPopups(prev => prev.filter(pp => pp.key !== key))}
          >
            <PointPopupContent idx={p.idx} date={p.date} time={p.time} timezone={p.timezone} />
          </Popup>
        ))}
        </div>
      </TrackContext.Provider> {/* eslint-disable-line react/jsx-closing-tag-location */}
    </>
  );
};

export default App;

// Validate and normalize configuration, applying safe defaults
function validateAndNormalizeConfig(raw) {
  const safe = typeof raw === 'object' && raw ? { ...raw } : {};

  // Basic required fields
  if (typeof safe.server !== 'string') {
    console.warn('config.server missing or invalid; network calls may fail');
    safe.server = safe.server || '';
  }
  if (typeof safe.public_name !== 'string') {
    console.warn('config.public_name missing or invalid');
    safe.public_name = safe.public_name || '';
  }
  if (typeof safe.subject_group !== 'string') {
    console.warn('config.subject_group missing or invalid');
    safe.subject_group = safe.subject_group || '';
  }

  // Map config defaults and validation
  const map = typeof safe.map === 'object' && safe.map ? { ...safe.map } : {};
  if (typeof map.style !== 'string' || !map.style) {
    map.style = 'mapbox://styles/vjoelm/cktdex96919t117p3rkq7c7yu';
  }
  // center: [lng, lat]
  const center = Array.isArray(map.center) ? map.center.slice(0, 2) : [173.497498, -40.043578];
  const lng = Number(center[0]);
  const lat = Number(center[1]);
  map.center = (
    Number.isFinite(lng) && Number.isFinite(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
  ) ? [lng, lat] : [173.497498, -40.043578];

  const zoom = Number(map.zoom);
  map.zoom = Number.isFinite(zoom) ? zoom : 5;
  const pitch = Number(map.pitch);
  map.pitch = Number.isFinite(pitch) ? pitch : 1;

  // show_subject_names boolean
  map.show_subject_names = !!map.show_subject_names;
  // map_icon_size numeric
  const iconSize = Number(map.map_icon_size);
  map.map_icon_size = Number.isFinite(iconSize) ? iconSize : MAP_ICON_SIZE;
  safe.map = map;

  // color scheme validation
  if (safe.color_scheme === 'custom' && Array.isArray(safe.custom_colors)) {
    // accept as-is
  } else if (safe.color_scheme === 'earthtones' || safe.color_scheme === 'aquatic') {
    // accept
  } else if (Array.isArray(safe.color_scheme)) {
    // accept provided array
  } else if (safe.color_scheme) {
    console.warn('Invalid color_scheme; falling back to earthtones');
    safe.color_scheme = 'earthtones';
  }

  // point_colour hex validation (used elsewhere)
  if (typeof safe.point_colour === 'string') {
    const cand = safe.point_colour.trim();
    const isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(cand);
    if (!isHex) {
      console.warn('config.point_colour invalid hex; ignoring');
      delete safe.point_colour;
    } else {
      safe.point_colour = cand;
    }
  }

  // subjects map optional
  if (typeof safe.subjects !== 'object' || !safe.subjects) {
    safe.subjects = {};
  }

  return safe;
}
