import type { Metadata } from "next"
import { docMeta } from "../_config/doc-meta"
import Content from "./_content"

const meta = docMeta["db-mongo"]

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
}

export default function DbMongoDocPage() {
  return <Content />
}
