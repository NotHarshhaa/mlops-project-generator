import { Github, Linkedin, Mail, Star } from "lucide-react"

const SOCIAL_LINKS = [
  { href: "https://github.com/NotHarshhaa", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/harsh-vaghela", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:harshvaghela@example.com", icon: Mail, label: "Email" },
] as const

export function CreatorCard() {
  return (
    <footer className="mt-6 sm:mt-12 mb-4 sm:mb-6">
      <div className="panel p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden ring-2 ring-primary/25 hover:ring-primary/50 transition-all">
              <img
                src="https://avatars.githubusercontent.com/NotHarshhaa"
                alt="Harshhaa Reddy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-[9px] sm:text-[10px] font-black font-mono">
              HR
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <h4 className="font-display text-base sm:text-lg font-bold">Harshhaa</h4>
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-[9px] sm:text-[10px] font-mono-label">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Creator
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">MLOps Engineer · Open Source</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-5 max-w-lg">
              Building scalable ML systems and tools for the MLOps community.
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-panel inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center font-mono-label text-muted-foreground mt-4 sm:mt-6 text-[10px] sm:text-[inherit]">
        MLOps Project Generator · Built for practitioners
      </p>
    </footer>
  )
}
