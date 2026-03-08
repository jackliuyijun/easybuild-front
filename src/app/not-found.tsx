import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#0B0C0E] text-white">
      <h2 className="font-display text-4xl font-bold">404 - Page Not Found</h2>
      <p className="text-[#9CA3AF]">Could not find requested resource</p>
      <Button asChild className="bg-[#00FF88] text-[#0B0C0E] hover:bg-[#31ff9d]">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
