import Image from "next/image"
import { ChevronRight } from "lucide-react"
import ProfileImage from "@/public/images/profile-img.jpg"
import { PERSONAL_INFO, NAVIGATION_ITEMS } from "@/lib/constants"
import { ThemeToggle } from "./ThemeToggle"

interface SideNavigationProps {
  isMenuOpen: boolean
  activeSection: string
  onNavigate: (sectionId: string) => void
}

export function SideNavigation({ isMenuOpen, activeSection, onNavigate }: SideNavigationProps) {
  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-card border-r border-border text-card-foreground z-40 transition-all duration-300 ease-in-out shadow-xl group ${
        isMenuOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-20 md:hover:w-64"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center py-8 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
            <Image
              src={ProfileImage.src}
              alt={PERSONAL_INFO.name}
              className="w-full h-full rounded-full object-cover"
              width={48}
              height={48}
            />
          </div>
          <h1
            className={`ml-3 font-bold text-xl text-foreground transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isMenuOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto md:group-hover:ml-3"
            }`}
          >
            {PERSONAL_INFO.name}
          </h1>
        </div>

        <div className="mt-8 flex-1 space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-left group/item ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <ChevronRight
                size={20}
                className={`transition-transform duration-200 flex-shrink-0 ${activeSection === item.id ? "rotate-90" : ""}`}
              />
              <span
                className={`ml-2 transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isMenuOpen ? "opacity-100 w-auto" : "opacity-0 w-0 md:group-hover:opacity-100 md:group-hover:w-auto"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-border">
          <ThemeToggle showLabel isMenuOpen={isMenuOpen} />
        </div>
      </div>
    </nav>
  )
}
