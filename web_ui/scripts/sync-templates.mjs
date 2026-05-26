import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webUiRoot = path.join(__dirname, "..")
const source = path.join(webUiRoot, "..", "templates")
const target = path.join(webUiRoot, "templates")

if (!fs.existsSync(source)) {
  console.warn("[sync-templates] Source not found:", source)
  process.exit(0)
}

fs.cpSync(source, target, { recursive: true, force: true })
console.log("[sync-templates] Synced templates to", target)
