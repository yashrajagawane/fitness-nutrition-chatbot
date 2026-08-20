import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(resolve(root, file), "utf8");
const requiredFiles = [
  "app/offline/page.tsx",
  "app/manifest.webmanifest",
  "app/components/PwaRegister.tsx",
  "public/sw.js",
  "public/icons/icon-192.svg",
  "public/icons/icon-512.svg",
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length > 0) {
  throw new Error(`Missing PWA files: ${missing.join(", ")}`);
}

const manifest = JSON.parse(read("app/manifest.webmanifest"));
const requiredManifestValues = [
  ["name", manifest.name],
  ["short_name", manifest.short_name],
  ["start_url", manifest.start_url],
  ["scope", manifest.scope],
  ["display", manifest.display],
  ["theme_color", manifest.theme_color],
];
const missingManifestValues = requiredManifestValues
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingManifestValues.length > 0 || manifest.display !== "standalone") {
  throw new Error("Manifest is missing required install metadata.");
}

const serviceWorker = read("public/sw.js");
const offlinePage = read("app/offline/page.tsx");
const layout = read("app/layout.tsx");

if (!serviceWorker.includes('"/offline"') || !serviceWorker.includes("/api/")) {
  throw new Error("Service worker must include the offline fallback and API bypass.");
}

if (!offlinePage.includes("You are offline") || !layout.includes("PwaRegister")) {
  throw new Error("Offline fallback or service-worker registration is not wired.");
}

console.log(`PWA verification passed: ${requiredFiles.length} files and install metadata are ready.`);
