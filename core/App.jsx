import React, { createContext, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import SubjectPopupContent from './components/SubjectPopupContent';
import Popup from './components/Popup';
import Legend from './components/Legend';
import HelpButton from './components/HelpButton';
import Partners from './components/Partners';
import mapHandlerRegistry from './utils/mapHandlerRegistry';

import 'mapbox-gl/dist/mapbox-gl.css'; // Mapbox default styles
import './assets/mapstyle.css'; // Overrides for mapbox default styles
import './assets/main.css'; // Global styles for map - under construction

import med from './assets/images/med.png';

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

window.GlobalMap = null;

export const TrackContext = createContext({});

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
  const [legendOpen, setLegendOpen] = useState(false);

  const toggleLegendState = () => {
    setLegendOpen(!legendOpen);
  };

  function initMap() {

    window.GlobalMap = new mapboxgl.Map({
      container: 'map-container', // container ID
      style: !config.map || !config.map.style ? 'mapbox://styles/vjoelm/cktdex96919t117p3rkq7c7yu' : config.map.style, // Specify a mapbox style
      center: !config.map || !config.map.center ? [173.497498, -40.043578] : config.map.center, // starting position [lng, lat]
      zoom: !config.map || !config.map.zoom ? 5 : config.map.zoom, // starting zoom,
      pitch: !config.map || !config.map.pitch ? 1 : config.map.pitch
    });

    var nav = new mapboxgl.NavigationControl({ visualizePitch: true });
    window.GlobalMap.addControl(nav, 'top-left');

    window.GlobalMap.on('load', function () {
      // console.log(process.env.PUBLIC_URL); - This will not function in Ionic/Capacitor
      window.GlobalMap.loadImage(med, (_error, img) => {
        window.GlobalMap.addImage('subject-popup-box', img, { sdf: true });
      });

      // fetch call for subjects
      const url = `https://${config.server}/${config.public_name}/api/v1.0/subjects?subject_group=${config.subject_group}`;
      fetch(url)
        .then(resp => {
          if (resp.ok) {
            return resp;
          }
          throw Error('Error in request:' + resp.statusText);
        })
        .then(resp => resp.json()) // returns a json object
        .then(resp => {
          let index = 0;
          resp.data.data.map((subject) => {
            if (subject.last_position !== undefined) {
              // override subject name if provided in config
              if (config.subjects && config.subjects[subject.id] && config.subjects[subject.id].name) {
                subject.name = config.subjects[subject.id].name;
              }
              drawIcon(subject).then();
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

            // Use functional update to avoid mutating state directly
            setSubjectColor(prev => ({ ...prev, [subject.id]: subject.color }));
          }); // looping through array of subjects

          // Sets a display_story to be true if subject has images or description
          //   associated with it (more info to show in legend story)
          for (let i = 0; i < resp.data.data.length; i++) {
            const id = resp.data.data[i].id;
            resp.data.data[i].display_story = config.subjects && config.subjects[id] && (config.subjects[id].pictures || config.subjects[id].detail_description);
          }
          setSubjects(resp.data.data);
        })
        .catch(console.error);

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

      // attach handlers so map adjusts when viewport changes (orientation, resize)
      const __gw_onResize = () => { try { window.GlobalMap && window.GlobalMap.resize(); } catch (e) {} };
      window.addEventListener('resize', __gw_onResize);
      window.addEventListener('orientationchange', __gw_onResize);

      // remember handlers so they can be removed on unmount
      window.__gw_map_resize_handlers = window.__gw_map_resize_handlers || [];
      window.__gw_map_resize_handlers.push(__gw_onResize);
    });
  }

  useEffect(() => {
    let isSubscribed = true;
    // load configuration data
    fetch(props.configFile, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (isSubscribed) {
          config = json;
          initMap();
        }
      });
    // Cancel the subscription to useEffect().
    return function cleanup() {
      isSubscribed = false;
      try {
        if (window.__gw_map_resize_handlers && window.__gw_map_resize_handlers.length) {
          window.__gw_map_resize_handlers.forEach(h => {
            try { window.removeEventListener('resize', h); } catch (e) {}
            try { window.removeEventListener('orientationchange', h); } catch (e) {}
          });
          window.__gw_map_resize_handlers = [];
        }
      } catch (err) {
        // ignore
      }
      // Optionally destroy the map instance when component unmounts to free resources
      try {
        if (window.GlobalMap && typeof window.GlobalMap.remove === 'function') {
          window.GlobalMap.remove();
          window.GlobalMap = null;
        }
      } catch (e) {
        // ignore
      }
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
    fetch(url)
      .then(resp => {
        if (resp.ok) {
          return resp;
        }
        throw Error('Error in request:' + resp.statusText);
      })
      .then(resp => resp.json()) // returns a json object
      .then(resp => {
        drawTrack(resp.data, subjectId);
      })
      .catch(console.error);
  }

  function drawTrack(json, subjectId) {
    const geojson = fixAntimeridianCrossing(json);

    window.GlobalMap.addSource(geojson.features[0].geometry.type + ' ' + geojson.features[0].properties.id, {
      type: 'geojson',
      data: geojson
    });

    window.GlobalMap.addLayer({
      id: geojson.features[0].geometry.type + ' ' + geojson.features[0].properties.id,
      type: 'line',
      source: geojson.features[0].geometry.type + ' ' + geojson.features[0].properties.id,
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
        window.GlobalMap.addSource(pointsSourceId, {
          type: 'geojson',
          data: pointsGeojson
        });

        // determine circle color: prefer valid config.point_colour; otherwise fallback to literal '#1bb159'
        let pointCircleColor = '#1bb159'; // default
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

        window.GlobalMap.addLayer({
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
            const top = window.GlobalMap.queryRenderedFeatures(e.point, { layers: undefined });
            if (top && top.length > 0) {
              const topLayerId = top[0].layer && top[0].layer.id;
              if (typeof topLayerId === 'string' && topLayerId.startsWith('points')) {
                return; // subject icon has priority
              }
            }
          } catch (err) {
            // ignore query errors and continue
          }
          // Prefer pre-split fields if available (time_date, time_time, time_timezone).
          const props = f.properties || {};
          const date = props.time_date || null;
          const time = props.time_time || null;
          const timezone = props.time_timezone || null;
          const raw = props.time || null; // original ISO string

          const timeHtml = date || time || timezone || raw
            ? `<div>${date ? `${date}` : ''}${date && time ? ' ' : ''}${time ? `${time}` : ''}${(date || time) && timezone ? ' ' : ''}${timezone ? `${timezone}` : ''}${(!date && !time && raw) ? raw : ''}</div>`
            : '<div>Time: unknown</div>';

          const html = `<div><h2>Location #${props.idx}</h2><p><strong>Date: </strong>${date}<br/><strong>Time: </strong>${time} ${timezone}</div>`;

          new mapboxgl.Popup()
            .setLngLat(f.geometry.coordinates)
            .setHTML(html)
            .addTo(window.GlobalMap);
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
        window.GlobalMap.getSource(pointsSourceId).setData(pointsGeojson);
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
    if (config.subjects && config.subjects[json.id] && config.subjects[json.id].icon) {
      imgURL = config.subjects[json.id].icon;
    } else if (json.common_name !== null && await fileExists(`public/images/animal_icons/${json.common_name}.png`)) {
      imgURL = `public/images/animal_icons/${json.common_name}.png`;
    } else {
      imgURL = json.last_position.properties.image;
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
        window.GlobalMap.addImage(json.subject_subtype + json.id, image);
        window.GlobalMap.addSource('point' + json.id, {
          type: 'geojson',
          data: json.last_position
        });

        // Animal Icon
        const iconSize = 0.5;
        const iconSizeLayout = ['interpolate', ['linear'], ['zoom'], 1, (iconSize / MAP_ICON_SCALE), 10, (iconSize / MAP_ICON_SCALE), 16, iconSize];
        window.GlobalMap.addLayer({
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

        // Subject Nametag Icon
        const iconSizeSubjectNametagText = ['step', ['zoom'], 12, 10, 16];
        window.GlobalMap.addLayer({
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
      center: !config.map || !config.map.center ? [-109.3666652, -27.1166662] : config.map.center, // starting position [lng, lat]
      zoom: !config.map || !config.map.zoom ? 11 : config.map.zoom, // starting zoom,
      pitch: !config.map || !config.map.pitch ? 75 : config.map.pitch,
      essential: true,
      bearing: 0
    });
    // toggle off all tracks??
  };

  return (
    <>
      <TrackContext.Provider value={{ displayTracks, setTracks, tracks }}>
        <div id='app-container'>
          <div id='map-container' onKeyDown={logKey} onKeyUp={logKey}>
            <HelpButton />

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
              tracks={tracks}
            />
          </div>
          <Partners />
        </div>
        {subjectPopups.map(({ properties, geometry }) =>
          <Popup
            key={`${properties.id}-popup`}
            onClose={() => {
              setSubjectPopups(prev => prev.filter(({ properties: { id } }) => id !== properties.id));
            }}
            coordinates={geometry.coordinates.slice()}
          >
            <TrackContext.Provider value={{ displayTracks, setTracks, tracks }}>
              <SubjectPopupContent
                subject={properties} subjectData={config.subjects[properties.id]}
                onStoryClick={(subject) => setLegSub(subject)} legendOpen={legendOpen}
                onLegendStateToggle={toggleLegendState} {...props}
              />
            </TrackContext.Provider>
          </Popup>
        )}
      </TrackContext.Provider> {/* eslint-disable-line react/jsx-closing-tag-location */}
    </>
  );
};

export default App;
