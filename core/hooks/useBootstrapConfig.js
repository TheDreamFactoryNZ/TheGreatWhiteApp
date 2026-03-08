import { useEffect, useState } from "react";

const BOOTSTRAP_URL = "https://map.sustainableoceansociety.co.nz/public/bootstrap.json";
const FALLBACK_CONFIG_URL = "https://map.sustainableoceansociety.co.nz/public/configs/config.json";

/**
 * Resolves the config URL via bootstrap.json.
 * Falls back to a default config URL if bootstrap fails.
 * @returns {string | null} The resolved config URL, or null while loading.
 */
export function useBootstrapConfig() {
  const [configUrl, setConfigUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      let url = FALLBACK_CONFIG_URL;
      try {
        const resp = await fetch(BOOTSTRAP_URL, { cache: "no-store" });
        if (resp.ok) {
          const bootstrap = await resp.json();
          if (bootstrap.configUrl) {
            url = bootstrap.configUrl;
          }
        }
      } catch (err) {
        console.warn("Bootstrap fetch failed, using fallback:", err);
      }
      if (!cancelled) setConfigUrl(url);
    }

    resolve();
    return () => { cancelled = true; };
  }, []);

  return configUrl;
}