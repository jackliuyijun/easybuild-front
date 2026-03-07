import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { accentTheme, type AccentTone, siteTheme } from "@/lib/site-theme"

type SectionHeaderProps = {
  tag: string
  title: string
  description?: string
  tone: AccentTone
  className?: string
}

export function SectionHeader({
  tag,
  title,
  description,
  tone,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mx-auto flex max-w-3xl flex-col items-center gap-3 text-center", className)}>
      <Badge
        variant="ghost"
        className={cn(
          siteTheme.mono,
          "h-auto rounded-md px-0 py-0 text-xs hover:bg-transparent",
          accentTheme[tone].text
        )}
      >
        {tag}
      </Badge>
      <h2 className={cn(siteTheme.title, "text-3xl md:text-5xl")}>{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-7 text-[#9CA3AF] md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}
