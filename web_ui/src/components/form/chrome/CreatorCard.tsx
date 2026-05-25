import { Github, Linkedin, Mail, Star } from "lucide-react"

const SOCIAL_LINKS = [
  { href: "https://github.com/NotHarshhaa", icon: Github, label: "GitHub", cls: "hover:bg-gray-100 dark:hover:bg-white/10 hover:text-foreground" },
  { href: "https://linkedin.com/in/harsh-vaghela", icon: Linkedin, label: "LinkedIn", cls: "hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400" },
  { href: "mailto:harshvaghela@example.com", icon: Mail, label: "Email", cls: "hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400" },
] as const

export function CreatorCard() {
  return (
    <>
      <div className="glass-card rounded-3xl overflow-hidden mt-8">
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300 hover:scale-105">
                <img
                  src="https://avatars.githubusercontent.com/NotHarshhaa"
                  alt="Harshhaa Reddy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg text-white text-xs font-black">
                HR
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h4 className="text-lg font-bold text-foreground">HARSHHAA</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  Creator
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">MLOps Engineer · Open Source Contributor</p>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5 max-w-lg">
                Passionate about building scalable ML systems and developer tools.
                Creating innovative solutions for the MLOps community.
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                {SOCIAL_LINKS.map(({ href, icon: Icon, label, cls }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/70 bg-card/50 text-muted-foreground text-sm font-medium transition-all duration-200 ${cls}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 mb-4">
        Built with ❤️ for the MLOps community · <span className="text-primary font-semibold">MLOps Project Generator</span>
      </p>
    </>
  )
}
