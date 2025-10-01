// import { defineConfig } from "vite";
// import { fileURLToPath } from "url";
// import react from "@vitejs/plugin-react";
// import path, { dirname, resolve } from "path";
// import dts from "vite-plugin-dts";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({ jsxRuntime: "automatic" }),
//     dts({ tsconfigPath: "./tsconfig.json", rollupTypes: true }),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     lib: {
//       entry: resolve(__dirname, "src/index.ts"),
//       name: "BCHConnect",
//       fileName: "bch-connect",
//       formats: ["es"],
//     },
//     rollupOptions: {
//       external: ["react", "react-dom"],
//       output: {
//         format: "es",
//         esModule: true,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path, { dirname, resolve } from "path";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    dts({ tsconfigPath: "./tsconfig.json", rollupTypes: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BCHConnect",
      fileName: "bch-connect",
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => {
        if (id.includes("react") || id.includes("jsx-runtime")) {
          return true;
        }
        return false;
      },
      output: {
        format: "esm",
      },
    },
  },
  esbuild: {
    format: "esm",
  },
});
