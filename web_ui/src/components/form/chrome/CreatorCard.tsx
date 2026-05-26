import { Github, Linkedin, Mail, Star } from "lucide-react"

const SOCIAL_LINKS = [
  { href: "https://github.com/NotHarshhaa", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/harsh-vaghela", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:harshvaghela@example.com", icon: Mail, label: "Email" },
] as const

export function CreatorCard() {
  return (
    <footer className="mt-12 mb-6">
      <div className="panel p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-primary/25 hover:ring-primary/50 transition-all">
              <img
                src="https://avatars.githubusercontent.com/NotHarshhaa"
                alt="Harshhaa Reddy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-black font-mono">
              HR
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h4 className="font-display text-lg font-bold">Harshhaa</h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-[10px] font-mono-label">
                <Star className="w-3 h-3" />
                Creator
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">MLOps Engineer · Open Source</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-lg">
              Building scalable ML systems and tools for the MLOps community.
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-panel inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center font-mono-label text-muted-foreground mt-6">
        MLOps Project Generator · Built for practitioners
      </p>
    </footer>
  )
}
