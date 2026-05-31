/// <reference types="node" />
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const rawBase = process.env.BASE_PATH ?? "/";
const base = rawBase === "/" ? "/" : rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

/** Vendored SPAs: deep client routes must serve their index.html (mirrors Netlify rules in netlify.toml). */
function vendoredSpaFallback(mountPath: string, pluginName: string, staticDirName: string): Plugin {
  const mount = mountPath.replace(/\/$/, "");
  return {
    name: pluginName,
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? "";
        const pathname = raw.split(/[?#]/)[0] ?? "";
        const under =
          pathname === mount || pathname === `${mount}/` || pathname.startsWith(`${mount}/`);
        if (!under) return next();

        const staticPrefix = `${mount}/${staticDirName}/`;
        if (pathname.startsWith(staticPrefix) || pathname.endsWith("/index.html")) {
          return next();
        }

        const leaf = pathname.split("/").pop() ?? "";
        if (leaf.includes(".") && !leaf.endsWith("/")) {
          return next();
        }
        const q = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
        req.url = `${mount}/index.html${q}`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    vendoredSpaFallback("/rhacs-ux-prototypes/saved-filters", "rhacs-saved-filters-spa-fallback", "static"),
    vendoredSpaFallback("/ocp5-cluster-update-experience", "ocp5-cluster-update-spa-fallback", "assets"),
    vendoredSpaFallback("/hpux-prototypes", "hpux-prototypes-spa-fallback", "assets"),
  ],
  base,
  server: {
    /** Listen on all interfaces so `localhost` and `127.0.0.1` both work (embed + browser variance). */
    host: true,
    port: 5173,
    open: true,
  },
});
