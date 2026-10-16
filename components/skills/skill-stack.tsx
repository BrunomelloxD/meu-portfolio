import type { ReactNode } from "react"
import Image from "next/image"
import { SkillGroup } from "@/components/skills/skill-group"
import { SECTION_IDS } from "@/lib/constants"
import { skillCategories } from "@/lib/content"

interface SkillStackProps {
  children?: ReactNode
}

/** Stepped skill cards (inspiration's About block) beside the portrait; `children` sit under the portrait. */
export function SkillStack({ children }: SkillStackProps) {
  const [frontend, backend, devops] = skillCategories

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-[84px]">
      <div id={SECTION_IDS.SKILLS} className="flex scroll-mt-28 flex-col gap-3 lg:w-[760px] lg:shrink-0 lg:gap-5">
        <SkillGroup category={frontend} inverse className="lg:w-[640px]" />
        <SkillGroup category={backend} className="lg:w-[640px]" />
        <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-center lg:gap-10">
          <SkillGroup category={devops} className="lg:w-[480px] lg:shrink-0" />
          <p className="text-sm text-ink-soft lg:w-[220px]">
            A stack que uso <em className="text-ink">todos os dias</em> para construir produtos completos, do banco de dados à
            interface.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-10">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-image md:max-w-[420px]">
          <Image
            src="/images/profile-img.jpg"
            alt="Retrato de Bruno Mello"
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover grayscale"
          />
        </div>
        {children}
      </div>
    </div>
  )
}
