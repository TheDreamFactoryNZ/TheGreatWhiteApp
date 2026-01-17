// Lightweight registry to manage map.on/map.off handlers per map instance and layer/event.
// Uses a WeakMap keyed by the map instance so handlers are garbage collected with the map.
const registry = new WeakMap();

function ensure(map) {
  if (!registry.has(map)) registry.set(map, new Map());
  return registry.get(map);
}

// key is a combination of layerOrId (may be null for global events) and event name
function makeKey(layerOrId, event) {
  const lid = layerOrId || '(global)';
  return `${lid}::${event}`;
}

function add(map, layerOrId, event, handler) {
  if (!map || typeof map.on !== 'function') return;
  const mapReg = ensure(map);
  const key = makeKey(layerOrId, event);
  if (!mapReg.has(key)) mapReg.set(key, new Set());
  const set = mapReg.get(key);
  if (set.has(handler)) return; // already registered
  try {
    if (layerOrId) map.on(event, layerOrId, handler);
    else map.on(event, handler);
    set.add(handler);
  } catch (err) {
    // Best effort: try the other signature (some mapbox versions differ)
    try {
      map.on(event, handler);
      set.add(handler);
    } catch (e) {
      // give up silently — caller should handle interop
      console.warn('mapHandlerRegistry.add: failed to register handler', err, e);
    }
  }
}

function removeLayer(map, layerOrId) {
  if (!map) return;
  const mapReg = registry.get(map);
  if (!mapReg) return;
  const prefix = `${layerOrId}::`;
  // collect keys to remove to avoid mutation while iterating
  const keys = [];
  for (const key of mapReg.keys()) {
    if (key.indexOf(prefix) === 0) keys.push(key);
  }
  keys.forEach((key) => {
    const set = mapReg.get(key);
    if (!set) return;
    const [, event] = key.split('::');
    for (const handler of Array.from(set)) {
      try {
        map.off(event, layerOrId, handler);
      } catch (err) {
        try { map.off(event, handler); } catch (e) {}
      }
      set.delete(handler);
    }
    mapReg.delete(key);
  });
}

function removeAll(map) {
  if (!map) return;
  const mapReg = registry.get(map);
  if (!mapReg) return;
  for (const [key, set] of mapReg.entries()) {
    const [layerOrId, event] = key.split('::');
    for (const handler of Array.from(set)) {
      try {
        if (layerOrId && layerOrId !== '(global)') map.off(event, layerOrId, handler);
        else map.off(event, handler);
      } catch (err) {
        // ignore
      }
    }
  }
  registry.delete(map);
}

export default {
  add,
  removeLayer,
  removeAll
};
