import type { MetadataRoute } from "next"

const BASE_URL = "https://easybuild.mcst.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const mainPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/easyfk`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/modules`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/admin`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/mobile`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/ai`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/cooperation`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ]

  const docSlugs = [
    "reader",
    "reader/core",
    "reader/bom",
    "reader/auth",
    "reader/gateway",
    "reader/web-prd",
    "reader/web-micro",
    "reader/websocket",
    "reader/orm-hibernate",
    "reader/orm-mybatis",
    "reader/orm-flex",
    "reader/orm-sharding",
    "reader/db-redis",
    "reader/db-mongo",
    "reader/db-clickhouse",
    "reader/cache-caffeine",
    "reader/autoid-redis",
    "reader/mq-rocket",
    "reader/mq-rabbit",
    "reader/mq-kafka",
    "reader/rpc-dubbo",
    "reader/rpc-cloud",
    "reader/lock-redisson",
    "reader/thread",
    "reader/disruptor",
    "reader/fory",
    "reader/chronicle-map",
  ]

  const docPages: MetadataRoute.Sitemap = docSlugs.map((slug) => ({
    url: `${BASE_URL}/docs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...mainPages, ...docPages]
}
