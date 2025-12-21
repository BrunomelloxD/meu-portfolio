import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeToggleProps {
  isMobile?: boolean
  showLabel?: boolean
  isMenuOpen?: boolean
}

export function ThemeToggle({ isMobile = false, showLabel = false, isMenuOpen = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  if (isMobile) {
    return (
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground md:hidden"
        aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center p-3 rounded-lg text-foreground hover:bg-muted transition-all duration-300 group/theme"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? <Sun size={20} className="flex-shrink-0" /> : <Moon size={20} className="flex-shrink-0" />}
      {showLabel && (
        <span
          className={`ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden ${
            isMenuOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto"
          }`}
        >
          {isDark ? "Tema Claro" : "Tema Escuro"}
        </span>
      )}
    </button>
  )
}
