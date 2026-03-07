"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks } from "@/lib/home-content"
import { siteTheme } from "@/lib/site-theme"
import { useAppStore } from "@/store/app-store"
import { cn } from "@/lib/utils"
import { SiteLogo } from "@/components/site-logo"

export function SiteHeader() {
  const mobileMenuOpen = useAppStore((state) => state.mobileMenuOpen)
  const setMobileMenuOpen = useAppStore((state) => state.setMobileMenuOpen)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0C0E]/80 backdrop-blur-xl">
      <div className={cn(siteTheme.container, "flex h-[72px] items-center justify-between gap-6")}>
        <SiteLogo />
        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList className="gap-3">
            {navLinks.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  asChild
                  className="bg-transparent px-2 py-1.5 text-sm font-medium text-[#9CA3AF] hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white"
                >
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[#9CA3AF] hover:bg-white/5 hover:text-white lg:hidden"
              aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-white/10 bg-[#0B0C0E] text-white"
          >
            <SheetHeader className="px-0 pb-2">
              <SheetTitle className="text-left text-white">导航</SheetTitle>
              <SheetDescription className="text-left text-[#9CA3AF]">
                选择你要查看的 EasyBuild 页面。
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 px-0">
              {navLinks.map((item) => (
                <Button
                  key={item.label}
                  asChild
                  variant="ghost"
                  className="h-auto justify-start rounded-xl px-3 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-white/5 hover:text-white"
                >
                  <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
