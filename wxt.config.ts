import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "Apora Browser",
    version: "0.0.1",
    description: "Browser extension for using Apora on browsers.",
    host_permissions: ["https://apora.sumku.cc"], // Always allow Apora website
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    developmentIndicator: "overlay",
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
