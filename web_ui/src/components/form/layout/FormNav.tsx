"use client"

import { useState } from "react"
import { X, ArrowUpRight } from "lucide-react"

const NAV_LINKS = [
  { href: "#thesis", label: "01 // THESIS", target: "System Intent" },
  { href: "#capabilities", label: "02 // CAPABILITIES", target: "Architecture Accordion" },
  { href: "#workflow", label: "03 // PIPELINE", target: "Execution Sequence" },
  { href: "#generator", label: "04 // GENERATOR", target: "Stack Matrix" },
] as const

export function FormNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#e8e6e0] hairline-b">
        <div className="w-full px-4 sm:px-8 h-12 flex items-center justify-between gap-4">
          {/* Brand Wordmark & Mark */}
          <a
            href="#"
            className="flex items-center gap-2.5 group select-none cursor-pointer"
            title="MLOps Project Generator — Home"
          >
            <div className="w-3 h-3 bg-[#0d1355] flex-shrink-0" aria-hidden />
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] tracking-[0.02em] font-bold text-[#0d1355] uppercase">
                MLOps Project Generator Inc.
              </span>
              <span className="hidden md:inline font-mono text-[9px] tracking-[0.04em] text-black/50">
                / SPECIFICATION 2026.01
              </span>
            </div>
          </a>

          {/* Desktop Direct Nav Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Monograph Sections">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[10px] tracking-[0.02em] text-[#000000] hover:text-[#1925aa] transition-colors uppercase"
              >
                [{label}]
              </a>
            ))}
          </nav>

          {/* Right Action / Menu Toggle Button */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[10px] text-black/60 uppercase">
              STATUS: READY
            </span>

            {/* Signature Menu Toggle Button from DESIGN.md */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="menu-toggle-btn h-9 border border-black/15 hover:border-black/30 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span className="text-[10px] font-mono tracking-[0.02em] uppercase font-semibold">
                {menuOpen ? "CLOSE" : "MENU"}
              </span>
              <span className="menu-toggle-icon w-9 h-9 ml-2.5 text-sm font-mono flex items-center justify-center bg-[#1925aa] text-white">
                {menuOpen ? "×" : "/"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Broadsheet Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-12 z-50 bg-[#e8e6e0]/98 backdrop-blur-xs flex flex-col justify-between p-6 sm:p-12 animate-monograph-in hairline-b">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-start hairline-b pb-4 mb-8">
              <p className="font-mono text-[10px] uppercase text-[#1925aa] tracking-widest">
                [ INDEX // ARCHITECTURAL MONOGRAPH NAVIGATION ]
              </p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[10px] text-[#000000] hover:text-[#1925aa] flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> ESC
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-black/40">Sections</p>
                <ul className="space-y-3 font-display text-2xl sm:text-3xl text-[#000000]">
                  {NAV_LINKS.map(({ href, label, target }) => (
                    <li key={href} className="hairline-b pb-2">
                      <a
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-between hover:text-[#1925aa] transition-colors"
                      >
                        <span className="font-editorial">{target}</span>
                        <span className="font-mono text-xs text-black/40 group-hover:text-[#1925aa] transition-colors">
                          {label} ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 md:border-l md:border-black/10 md:pl-8">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-black/40 mb-2">
                    System Parameters
                  </p>
                  <dl className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between hairline-b pb-1">
                      <dt className="text-black/60">Execution Runtime:</dt>
                      <dd className="font-bold text-[#1925aa]">In-Browser WASM / Node</dd>
                    </div>
                    <div className="flex justify-between hairline-b pb-1">
                      <dt className="text-black/60">Scaffold Profiles:</dt>
                      <dd className="font-bold">8 Curated Presets</dd>
                    </div>
                    <div className="flex justify-between hairline-b pb-1">
                      <dt className="text-black/60">Output Format:</dt>
                      <dd className="font-bold">ZIP Archive</dd>
                    </div>
                    <div className="flex justify-between hairline-b pb-1">
                      <dt className="text-black/60">Telemetry / Tracking:</dt>
                      <dd className="font-bold">Zero Remote Persistence</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-black/40 mb-2">
                    Quick Commands
                  </p>
                  <pre className="p-3 bg-white border border-black/15 font-mono text-[11px] text-[#000000] overflow-x-auto">
                    <code>python -m mlops_generator --help</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full pt-8 hairline-t flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="font-mono text-[10px] text-black/50 uppercase">
              MLOps Project Generator Inc. · Printed in Architecture Plate Aesthetics · All Rights Reserved
            </p>
            <a
              href="#generator"
              onClick={() => setMenuOpen(false)}
              className="btn-monograph text-[10px] py-2 px-4"
            >
              Jump to Compiler ↓
            </a>
          </div>
        </div>
      )}
    </>
  )
}
