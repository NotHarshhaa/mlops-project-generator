import { toTitle } from "./helpers"
import type { TemplateContext } from "../types"

/**
 * Tiny Jinja2-compatible template engine.
 * Supports: {{ var }}, {{ var|title }}, {{ var|upper }}, {{ var|lower }}
 * {% if expr %} … {% elif expr %} … {% else %} … {% endif %}
 */
export function renderTemplate(template: string, ctx: TemplateContext): string {
  let result = processBlocks(template, ctx)
  result = result.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, expr) => evalExpr(expr.trim(), ctx))
  return result
}

function evalExpr(expr: string, ctx: TemplateContext): string {
  const [rawVar, ...filters] = expr.split("|").map(s => s.trim())
  let val = resolveVar(rawVar, ctx)
  for (const f of filters) {
    if (f === "title") val = toTitle(String(val))
    else if (f === "upper") val = String(val).toUpperCase()
    else if (f === "lower") val = String(val).toLowerCase()
  }
  return val === undefined || val === null ? "" : String(val)
}

function resolveVar(expr: string, ctx: TemplateContext): string {
  try {
    const parts = expr.split(".")
    const base = ctx[parts[0]]
    if (parts.length === 1) return String(base ?? "")

    let val = String(base ?? "")
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      if (part === "lower()") val = val.toLowerCase()
      else if (part === "upper()") val = val.toUpperCase()
      else if (part === "title()") val = toTitle(val)
      else if (part.startsWith("replace(")) {
        const m = part.match(/replace\(['"](.+?)['"],\s*['"](.+?)['"]\)/)
        if (m) val = val.split(m[1]).join(m[2])
      }
    }
    return val
  } catch {
    return ""
  }
}

type Token = { type: "text" | "tag"; value: string }

function processBlocks(tmpl: string, ctx: TemplateContext): string {
  const tokenRe = /\{%[-\s]*([\s\S]*?)[-\s]*%\}/g
  const tokens: Token[] = []
  let last = 0

  for (const match of tmpl.matchAll(tokenRe)) {
    if (match.index! > last) tokens.push({ type: "text", value: tmpl.slice(last, match.index) })
    tokens.push({ type: "tag", value: match[1].trim() })
    last = match.index! + match[0].length
  }
  if (last < tmpl.length) tokens.push({ type: "text", value: tmpl.slice(last) })

  return processTokens(tokens, 0, ctx).result
}

function processTokens(
  tokens: Token[],
  start: number,
  ctx: TemplateContext,
): { result: string; nextIndex: number } {
  let out = ""
  let i = start

  while (i < tokens.length) {
    const tok = tokens[i]

    if (tok.type === "text") {
      out += tok.value
      i++
      continue
    }

    if (tok.value.startsWith("if ")) {
      const cond = tok.value.slice(3).trim()
      i++
      const branches: Array<{ cond: string | null; body: string }> = []
      let currentCond: string | null = cond
      let bodyTokens: Token[] = []

      while (i < tokens.length) {
        const t = tokens[i]
        if (t.type === "tag" && t.value === "endif") {
          branches.push({ cond: currentCond, body: processTokens(bodyTokens, 0, ctx).result })
          i++
          break
        }
        if (t.type === "tag" && (t.value.startsWith("elif ") || t.value === "else")) {
          branches.push({ cond: currentCond, body: processTokens(bodyTokens, 0, ctx).result })
          currentCond = t.value.startsWith("elif ") ? t.value.slice(5).trim() : null
          bodyTokens = []
          i++
        } else {
          bodyTokens.push(t)
          i++
        }
      }

      for (const branch of branches) {
        if (branch.cond === null || evalCondition(branch.cond, ctx)) {
          out += branch.body
          break
        }
      }
      continue
    }

    if (tok.value === "endif" || tok.value.startsWith("elif ") || tok.value === "else") {
      break
    }

    i++
  }

  return { result: out, nextIndex: i }
}

function evalCondition(cond: string, ctx: TemplateContext): boolean {
  const inMatch = cond.match(/^(\w+)\s+in\s+\[([^\]]+)\]$/)
  if (inMatch) {
    const val = String(ctx[inMatch[1]] ?? "")
    const list = inMatch[2].split(",").map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    return list.includes(val)
  }

  const notInMatch = cond.match(/^(\w+)\s+not\s+in\s+\[([^\]]+)\]$/)
  if (notInMatch) {
    const val = String(ctx[notInMatch[1]] ?? "")
    const list = notInMatch[2].split(",").map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    return !list.includes(val)
  }

  const eqMatch = cond.match(/^(\w+)\s*==\s*['"]([^'"]+)['"]$/)
  if (eqMatch) return String(ctx[eqMatch[1]] ?? "") === eqMatch[2]

  const neMatch = cond.match(/^(\w+)\s*!=\s*['"]([^'"]+)['"]$/)
  if (neMatch) return String(ctx[neMatch[1]] ?? "") !== neMatch[2]

  const val = ctx[cond.trim()]
  return Boolean(val && val !== "none" && val !== "")
}
