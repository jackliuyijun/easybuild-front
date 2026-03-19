"use client"

import { useState } from "react"
import { Copy, Check, Lightbulb, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function CodeBlock({ lang, children }: { lang: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#1F2937] bg-[#161B22]">
      <div className="flex h-9 items-center justify-between border-b border-[#1F2937] px-4">
        <span className="font-mono text-[11px] font-medium text-[#525252]">{lang}</span>
        <button type="button" onClick={handleCopy} className={cn("flex items-center gap-1.5 transition-colors", copied ? "text-[#00FF88]" : "text-[#525252] hover:text-[#9CA3AF]")}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span className="text-[11px]">{copied ? "已复制" : "复制"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4">
        <code className="whitespace-pre font-mono text-[13px] leading-[1.7] text-[#E5E5E5]">{children}</code>
      </pre>
    </div>
  )
}

export function DocTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-[#1F2937]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#1F2937] bg-[#161B22]">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 font-mono text-[11px] font-semibold tracking-wide text-[#9CA3AF]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[#1F2937] last:border-b-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-[13px] leading-[1.6] text-[#9CA3AF]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TipBox({ title = "TIP", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border-l-[3px] border-[#00FF8830] bg-[#00FF880A] px-5 py-4">
      <Lightbulb className="mt-0.5 size-[18px] shrink-0 text-[#00FF88]" />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#00FF88]">{title}</span>
        <div className="text-[13px] leading-[1.6] text-[#9CA3AF]">{children}</div>
      </div>
    </div>
  )
}

export function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border-l-[3px] border-[#FBBF2430] bg-[#FBBF240A] px-5 py-4">
      <AlertTriangle className="mt-0.5 size-[18px] shrink-0 text-[#FBBF24]" />
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] font-semibold tracking-[1px] text-[#FBBF24]">注意</span>
        <div className="text-[13px] leading-[1.6] text-[#9CA3AF]">{children}</div>
      </div>
    </div>
  )
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="flex items-center gap-3 scroll-mt-4">
      <h2 className="font-display text-[24px] font-bold text-white">{children}</h2>
      <span className="text-[14px] text-[#00FF8860]">✨</span>
    </div>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-[18px] font-bold text-white">{children}</h3>
}

export function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="font-display text-[15px] font-semibold text-[#E5E5E5]">{children}</h4>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-[1.8] text-[#9CA3AF]">{children}</p>
}

export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc text-[15px] leading-[1.8] text-[#9CA3AF]">{item}</li>
      ))}
    </ul>
  )
}

export function NumberList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-decimal text-[15px] leading-[1.8] text-[#9CA3AF]">{item}</li>
      ))}
    </ol>
  )
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[#1F2937] px-1.5 py-0.5 font-mono text-[13px] text-[#00FF88]">{children}</code>
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#E5E5E5]">{children}</span>
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-[#00FF8820] px-1 py-0.5 text-[#00FF88]">{children}</span>
}

export function CopyText({ text, children }: { text: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group/copy inline-flex items-center gap-1.5 rounded bg-[#1F2937] px-1.5 py-0.5 font-mono text-[13px] text-[#00FF88] transition-colors hover:bg-[#2A3444]"
    >
      {children ?? text}
      {copied ? <Check className="size-3 text-[#00FF88]" /> : <Copy className="size-3 text-[#525252] group-hover/copy:text-[#9CA3AF]" />}
    </button>
  )
}
