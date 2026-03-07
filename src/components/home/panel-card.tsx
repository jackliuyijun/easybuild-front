import type { HTMLAttributes } from "react"

import { Card } from "@/components/ui/card"
import { siteTheme } from "@/lib/site-theme"
import { cn } from "@/lib/utils"

export function PanelCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <Card className={cn(siteTheme.panel, className)} {...props} />
}
