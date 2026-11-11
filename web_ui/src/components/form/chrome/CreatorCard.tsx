import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"

const SOCIAL_LINKS = [
  { href: "https://github.com/NotHarshhaa", label: "GitHub", handle: "@NotHarshhaa" },
  { href: "https://linkedin.com/in/NotHarshhaa", label: "LinkedIn", handle: "NotHarshhaa" },
  { href: "mailto:harshvaghela@example.com", label: "Email", handle: "Direct Dispatch" },
] as const

export function CreatorCard() {
  return (
    <footer className="mt-16 sm:mt-24 pt-8 pb-12 border-t border-black/15">
      <div className="bg-white border border-black/15 p-6 sm:p-10 mb-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Architectural Square Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 border border-black/30 overflow-hidden shrink-0 bg-[#e8e6e0]">
              <img
                src="https://avatars.githubusercontent.com/NotHarshhaa"
                alt="HARSHHAA"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1925aa]" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#1925aa] font-bold">
                  COLOPHON // LEAD ARCHITECT
                </p>
              </div>
              <h4 className="font-display text-2xl font-normal text-black uppercase">
                HARSHHAA
              </h4>
              <p className="font-mono text-xs text-black/60">
                Machine Learning Operations & Scalable Systems Engineering
              </p>
              <p className="font-editorial text-xs sm:text-sm text-black/80 max-w-xl leading-relaxed pt-1">
                Constructing reproducible infrastructure patterns and developer tooling for the global MLOps engineering community.
              </p>
            </div>
          </div>

          {/* Social Links as Editorial Bracketed Links */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 font-mono text-xs shrink-0 self-start">
            {SOCIAL_LINKS.map(({ href, label, handle }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-4 px-3 py-1.5 border border-black/20 bg-white hover:border-[#1925aa] hover:text-[#1925aa] transition-colors"
              >
                <span>[ {label.toUpperCase()} ]</span>
                <span className="text-[10px] text-black/50">{handle} ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Broadsheet Colophon Line */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left font-mono text-[10px] text-black/50 uppercase tracking-wider">
        <p>
          MLOps Project Generator Inc. · Monograph Edition · Bone & Indigo System
        </p>
        <p>
          Standardized Architectural Scaffolder · 2026.01 Specification
        </p>
      </div>
    </footer>
  )
}
