import type { MetadataRoute } from "next"

const BASE_URL = "https://easybuild.pro"

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
    "reader/admin",
    "reader/auth",
    "reader/autoid-redis",
    "reader/bom",
    "reader/cache-caffeine",
    "reader/cache-mult",
    "reader/cache-redis",
    "reader/chronicle-map",
    "reader/chronicle-queue",
    "reader/core",
    "reader/db-clickhouse",
    "reader/db-mongo",
    "reader/db-redis",
    "reader/dev-env",
    "reader/disruptor",
    "reader/fory",
    "reader/gateway",
    "reader/lock-redisson",
    "reader/mq-kafka",
    "reader/mq-rabbit",
    "reader/mq-rocket",
    "reader/orm-flex",
    "reader/orm-hibernate",
    "reader/orm-mybatis",
    "reader/orm-sharding",
    "reader/oss",
    "reader/rpc-cloud",
    "reader/rpc-dubbo",
    "reader/thread",
    "reader/web-micro",
    "reader/web-prd",
    "reader/websocket",
  ]

  const docPages: MetadataRoute.Sitemap = docSlugs.map((slug) => ({
    url: `${BASE_URL}/docs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...mainPages, ...docPages]
}
