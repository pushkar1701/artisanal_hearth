/**
 * Fetches Stitch screen HTML + screenshot URLs via @google/stitch-sdk, then downloads
 * assets with curl -L (per Stitch workflow docs).
 *
 * Auth: `STITCH_API_KEY`, or the same key Cursor stores for the Stitch MCP in
 * `~/.cursor/mcp.json` under `mcpServers.stitch.headers["X-Goog-Api-Key"]` (auto-loaded if env unset).
 * See https://github.com/google-labs-code/stitch-sdk
 *
 * Usage: npm run fetch-stitch
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { stitch } from "@google/stitch-sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "stitch-exports", "15301878803397327439");

const PROJECT_ID = "15301878803397327439";

/** @type {{ title: string; slug: string; id: string; kind?: "screen" | "designSystem" }[]} */
const SCREENS = [
  {
    title: "Design System",
    slug: "01-design-system",
    id: "asset-stub-assets-7621a7147b66481fbe4b326095265e62-1775676815977",
    kind: "designSystem",
  },
  { title: "Updated Admin Dashboard - Dietary Tags", slug: "02-admin-dashboard-dietary-tags", id: "f36ec84a3c494943b321ee6283ea4336" },
  { title: "Updated Home Page - Indian Food & INR", slug: "03-home-indian-food-inr", id: "902950ae103b44e6a68ac9e8c0ecbb28" },
  { title: "Subscription Meal Plans", slug: "04-subscription-meal-plans", id: "90aa0a2f534d40bfb1a0a75f1518178e" },
  { title: "Admin Menu Dashboard", slug: "05-admin-menu-dashboard", id: "3f549208ec2947e5a90c9ad8419f0d43" },
  { title: "Secure Checkout", slug: "06-secure-checkout", id: "a203036c88a54b7a97327aca8d1636c1" },
  { title: "Bulk & Party Orders", slug: "07-bulk-party-orders", id: "2c8802f0b68048d2901d554db6a01bdb" },
  { title: "Meal Plans - Simple & Bilingual", slug: "08-meal-plans-bilingual", id: "e5b8537b8ab949c3a963c1951119555f" },
  { title: "Party Orders - Simple & Bilingual", slug: "09-party-orders-bilingual", id: "61f7b244bf41422ea6aad6582294be3c" },
  { title: "Home Page - Indian Cuisine & Bilingual", slug: "10-home-indian-cuisine-bilingual", id: "e56098b9a27a4edeb1a35eba60b4a50c" },
  { title: "Checkout - Simple & Accessible", slug: "11-checkout-accessible", id: "d0074f668395403c92b1c5b05619e8af" },
  { title: "Admin Dashboard - Simplified", slug: "12-admin-dashboard-simplified", id: "1f9db86c459d474dab455e28edcd336e" },
];

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

/** Same API key the Cursor Stitch MCP uses (if configured). */
function loadStitchKeyFromCursorMcp() {
  const p = join(homedir(), ".cursor", "mcp.json");
  if (!existsSync(p)) return null;
  try {
    const j = JSON.parse(readFileSync(p, "utf8"));
    const k = j?.mcpServers?.stitch?.headers?.["X-Goog-Api-Key"];
    return typeof k === "string" && k.length > 0 ? k : null;
  } catch {
    return null;
  }
}

function curlDownload(url, destPath) {
  if (!url) throw new Error("empty URL");
  execFileSync("curl", ["-fsSL", url, "-o", destPath], { stdio: "inherit" });
}

async function fetchDesignSystem(project, screenId) {
  const rawList = await stitch.callTool("list_design_systems", { projectId: PROJECT_ID });
  const pathMeta = join(OUT, "01-design-system", "list_design_systems.json");
  ensureDir(dirname(pathMeta));
  writeFileSync(pathMeta, JSON.stringify(rawList, null, 2), "utf8");

  const systems = rawList?.designSystems ?? [];
  const match =
    systems.find((d) => d?.name?.includes(screenId) || d?.id === screenId) ||
    systems.find((d) => String(d?.name || "").includes("7621a7147b66481f"));

  if (match) {
    writeFileSync(join(OUT, "01-design-system", "matched-design-system.json"), JSON.stringify(match, null, 2), "utf8");
    const md = match?.designSystem?.theme?.designMd;
    if (typeof md === "string" && md.length > 0) {
      writeFileSync(join(OUT, "01-design-system", "design-system.md"), md, "utf8");
    }
    if (match?.designSystem?.theme) {
      writeFileSync(
        join(OUT, "01-design-system", "design-theme.json"),
        JSON.stringify(match.designSystem.theme, null, 2),
        "utf8"
      );
    }
  }

  // Design system assets are not screens; get_screen usually fails. HTML/screenshots only if API adds them.
  try {
    const s = await project.getScreen(screenId);
    const htmlUrl = await s.getHtml();
    const imgUrl = await s.getImage();
    return { htmlUrl, imgUrl, screen: s, designSystemMatched: Boolean(match) };
  } catch {
    return {
      htmlUrl: match?.htmlCode?.downloadUrl ?? "",
      imgUrl: match?.screenshot?.downloadUrl ?? "",
      screen: null,
      designSystemMatched: Boolean(match),
    };
  }
}

async function main() {
  if (!process.env.STITCH_API_KEY && !process.env.STITCH_ACCESS_TOKEN) {
    const fromCursor = loadStitchKeyFromCursorMcp();
    if (fromCursor) {
      process.env.STITCH_API_KEY = fromCursor;
    }
  }
  if (!process.env.STITCH_API_KEY && !process.env.STITCH_ACCESS_TOKEN) {
    console.error(
      "Missing STITCH_API_KEY (or STITCH_ACCESS_TOKEN + GOOGLE_CLOUD_PROJECT). Optionally add Stitch to ~/.cursor/mcp.json with X-Goog-Api-Key."
    );
    process.exit(1);
  }

  ensureDir(OUT);
  try {
    const projMeta = await stitch.callTool("get_project", { name: `projects/${PROJECT_ID}` });
    writeFileSync(join(OUT, "get_project.json"), JSON.stringify(projMeta, null, 2), "utf8");
  } catch (e) {
    console.warn("get_project (optional):", e instanceof Error ? e.message : e);
  }

  const project = stitch.project(PROJECT_ID);
  const manifest = { projectId: PROJECT_ID, screens: [] };

  for (const item of SCREENS) {
    const dir = join(OUT, item.slug);
    ensureDir(dir);
    const entry = {
      title: item.title,
      slug: item.slug,
      id: item.id,
      ok: false,
      error: null,
      htmlUrl: null,
      imageUrl: null,
      note: null,
    };

    try {
      let htmlUrl;
      let imageUrl;

      if (item.kind === "designSystem") {
        const ds = await fetchDesignSystem(project, item.id);
        htmlUrl = ds.htmlUrl;
        imageUrl = ds.imgUrl;
        if (ds.screen?.data) {
          writeFileSync(join(dir, "get_screen-raw.json"), JSON.stringify(ds.screen.data, null, 2), "utf8");
        }
        if (ds.designSystemMatched && !htmlUrl && !imageUrl) {
          entry.note =
            "Design system asset: exported as design-system.md, design-theme.json, list_design_systems.json (no screen HTML/screenshot in API).";
        }
      } else {
        const screen = await project.getScreen(item.id);
        htmlUrl = await screen.getHtml();
        imageUrl = await screen.getImage();
        if (screen.data) {
          writeFileSync(join(dir, "get_screen-raw.json"), JSON.stringify(screen.data, null, 2), "utf8");
        }
      }

      entry.htmlUrl = htmlUrl || null;
      entry.imageUrl = imageUrl || null;

      if (htmlUrl) {
        curlDownload(htmlUrl, join(dir, "screen.html"));
      }
      if (imageUrl) {
        const ext = imageUrl.includes(".png") ? "png" : imageUrl.includes(".webp") ? "webp" : "jpg";
        curlDownload(imageUrl, join(dir, `screen.${ext}`));
      }

      entry.ok = Boolean(htmlUrl || imageUrl || entry.note);
      writeFileSync(join(dir, "urls.json"), JSON.stringify({ htmlUrl, imageUrl }, null, 2), "utf8");
    } catch (e) {
      entry.error = e instanceof Error ? e.message : String(e);
      console.error(`[fail] ${item.slug}:`, entry.error);
    }

    manifest.screens.push(entry);
  }

  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log("Done. Output:", OUT);
  if (typeof stitch.close === "function") {
    await stitch.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
