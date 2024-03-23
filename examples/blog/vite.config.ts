import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (source, id) => {
            return !id.includes("node_modules/foundation-sites/scss/") ? source : ""
          },
          includePaths: ["node_modules/foundation-sites/scss"],
          verbose: true,
        },
      },
    }
  };
});
