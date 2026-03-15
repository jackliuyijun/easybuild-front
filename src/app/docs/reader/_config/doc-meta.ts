export type DocMetaItem = {
  title: string
  description: string
  keywords: string[]
}

export const docMeta: Record<string, DocMetaItem> = {
  "dev-env": {
    title: "开发环境配置 — EasyBuild 环境搭建指南",
    description:
      "EasyBuild 开发环境配置说明，涵盖 JDK、Maven、Gradle 环境准备与项目初始化配置。",
    keywords: ["开发环境", "环境配置", "Maven", "Gradle", "JDK"],
  },
  "core": {
    title: "基础核心模块 easyfk-core",
    description:
      "EasyBuild 基础核心模块，提供全局工具、统一响应封装、异常处理、上下文管理、DTO 等底层支撑能力。",
    keywords: ["easyfk-core", "核心模块", "统一响应", "异常处理"],
  },
  "bom": {
    title: "统一依赖管理 easyfk-dependencies BOM",
    description:
      "EasyBuild BOM 统一依赖版本管理，一个依赖解决所有版本冲突，升级一处全局生效。",
    keywords: ["BOM", "依赖管理", "版本治理", "Maven"],
  },
  "auth": {
    title: "认证鉴权模块 easyfk-auth",
    description:
      "EasyBuild 统一认证鉴权模块，提供 JWT 认证、RBAC 权限管理、多租户安全体系等能力。",
    keywords: ["认证鉴权", "JWT", "RBAC", "权限管理"],
  },
  "gateway": {
    title: "网关模块 easyfk-gateway",
    description:
      "EasyBuild 网关过滤层模块，统一流量入口、安全防护、接口签名验证与防重放攻击。",
    keywords: ["网关", "Gateway", "流量入口", "安全防护"],
  },
  "reader": {
    title: "代码生成器 EasyFK Generator 使用手册",
    description:
      "EasyFK Generator 代码生成器，一张表自动产出完整业务代码，支持 22 种数据库与三种架构模式一键切换。",
    keywords: ["代码生成器", "Generator", "代码生成", "CRUD"],
  },
  "web-prd": {
    title: "Web 应用开发 easyfk-web-prd",
    description:
      "EasyBuild 企业级 Web 应用基础设施，提供统一拦截器、参数校验、接口文档、跨域配置等开箱即用能力。",
    keywords: ["Web应用", "Spring MVC", "拦截器", "接口文档"],
  },
  "web-micro": {
    title: "微服务 Web 开发 easyfk-web-micro",
    description:
      "EasyBuild 轻量级微服务 Web 支撑模块，适用于微服务架构下的 Web 层配置与统一处理。",
    keywords: ["微服务", "Web", "Microservice", "Spring Cloud"],
  },
  "websocket": {
    title: "WebSocket 通信 easyfk-websocket",
    description:
      "EasyBuild WebSocket 实时双向消息推送模块，支持点对点、广播、群组消息等多种通信模式。",
    keywords: ["WebSocket", "实时通信", "消息推送", "双向通信"],
  },
  "orm-hibernate": {
    title: "Hibernate ORM easyfk-orm-hibernate",
    description:
      "EasyBuild Hibernate JPA 数据持久化模块，统一 CRUD 接口，开箱即用的 JPA 最佳实践。",
    keywords: ["Hibernate", "JPA", "ORM", "数据持久化"],
  },
  "orm-mybatis": {
    title: "MyBatis 集成 easyfk-orm-mybatis",
    description:
      "EasyBuild MyBatis 集成模块，灵活的 SQL 映射框架，统一 CRUD 与分页查询能力。",
    keywords: ["MyBatis", "MyBatis-Plus", "SQL映射", "ORM"],
  },
  "orm-flex": {
    title: "MyBatis-Flex easyfk-orm-flex",
    description:
      "EasyBuild MyBatis-Flex 增强模块，优雅的链式查询 API，轻量高性能的 MyBatis 增强方案。",
    keywords: ["MyBatis-Flex", "链式查询", "ORM", "增强框架"],
  },
  "orm-sharding": {
    title: "ShardingSphere 分库分表 easyfk-orm-sharding",
    description:
      "EasyBuild ShardingSphere 分库分表与读写分离模块，透明化数据分片，业务代码零侵入。",
    keywords: ["ShardingSphere", "分库分表", "读写分离", "数据分片"],
  },
  "db-redis": {
    title: "Redis 数据库 easyfk-db-redis",
    description:
      "EasyBuild Redis 高性能键值存储模块，提供缓存、分布式锁、消息发布订阅等能力封装。",
    keywords: ["Redis", "缓存", "键值存储", "分布式"],
  },
  "db-mongo": {
    title: "MongoDB 文档数据库 easyfk-db-mongo",
    description:
      "EasyBuild MongoDB 文档型 NoSQL 数据库集成模块，统一 CRUD 封装与灵活的文档查询。",
    keywords: ["MongoDB", "NoSQL", "文档数据库", "数据存储"],
  },
  "db-clickhouse": {
    title: "ClickHouse 分析数据库 easyfk-db-clickhouse",
    description:
      "EasyBuild ClickHouse 高性能列式分析数据库集成，适用于大规模 OLAP 实时分析场景。",
    keywords: ["ClickHouse", "列式数据库", "OLAP", "数据分析"],
  },
  "cache-redis": {
    title: "Redis 分布式缓存 cache-redis",
    description:
      "EasyBuild Redis 分布式缓存组件，基于 Spring Cache + Redis，注解驱动 + 编程式双模式，支持多数据源与独立 TTL。",
    keywords: ["Redis缓存", "分布式缓存", "Spring Cache", "TTL"],
  },
  "cache-mult": {
    title: "多级缓存 cache-mult",
    description:
      "EasyBuild 多级缓存组件，基于 XXL-CACHE 实现 L1 本地 + L2 Redis 多级缓存架构，高命中率与强一致性。",
    keywords: ["多级缓存", "L1", "L2", "Caffeine", "Redis"],
  },
  "cache-caffeine": {
    title: "Caffeine 本地缓存 easyfk-cache-caffeine",
    description:
      "EasyBuild Caffeine 高性能进程内本地缓存方案，毫秒级响应，支持多种淘汰策略。",
    keywords: ["Caffeine", "本地缓存", "进程内缓存", "高性能"],
  },
  "autoid-redis": {
    title: "Redis 自增ID easyfk-autoid-redis",
    description:
      "EasyBuild 基于 Redis 的分布式全局唯一 ID 生成方案，高性能、高可用、趋势递增。",
    keywords: ["自增ID", "分布式ID", "Redis", "唯一ID"],
  },
  "mq-rocket": {
    title: "RocketMQ 消息队列 easyfk-mq-rocket",
    description:
      "EasyBuild RocketMQ 高可靠分布式消息队列模块，支持顺序消息、延迟消息、事务消息。",
    keywords: ["RocketMQ", "消息队列", "分布式消息", "MQ"],
  },
  "mq-rabbit": {
    title: "RabbitMQ 消息队列 easyfk-mq-rabbit",
    description:
      "EasyBuild RabbitMQ 轻量级消息中间件模块，灵活路由、可靠投递、开箱即用。",
    keywords: ["RabbitMQ", "消息队列", "AMQP", "消息中间件"],
  },
  "mq-kafka": {
    title: "Kafka 消息队列 easyfk-mq-kafka",
    description:
      "EasyBuild Kafka 高吞吐流式数据平台集成，百万级 TPS 消息处理能力。",
    keywords: ["Kafka", "消息队列", "流式数据", "高吞吐"],
  },
  "rpc-dubbo": {
    title: "Dubbo RPC easyfk-rpc-dubbo",
    description:
      "EasyBuild Dubbo 高性能远程服务调用模块，支持多协议、多注册中心、负载均衡策略。",
    keywords: ["Dubbo", "RPC", "远程调用", "微服务"],
  },
  "rpc-cloud": {
    title: "Spring Cloud 微服务 easyfk-rpc-cloud",
    description:
      "EasyBuild Spring Cloud 云原生服务治理模块，集成 Nacos、Sentinel、OpenFeign 等组件。",
    keywords: ["Spring Cloud", "微服务", "Nacos", "Sentinel"],
  },
  "lock-redisson": {
    title: "Redisson 分布式锁 easyfk-lock-redisson",
    description:
      "EasyBuild Redisson 高可用分布式互斥锁方案，支持可重入锁、公平锁、红锁等多种模式。",
    keywords: ["Redisson", "分布式锁", "互斥锁", "Redis"],
  },
  "thread": {
    title: "线程池管理 easyfk-thread",
    description:
      "EasyBuild 线程池管理模块，高性能并发任务调度，动态参数调优，全链路监控。",
    keywords: ["线程池", "并发", "任务调度", "ThreadPool"],
  },
  "disruptor": {
    title: "Disruptor 高性能队列 easyfk-disruptor",
    description:
      "EasyBuild Disruptor 无锁高性能队列模块，适用于超高吞吐量的内存消息传递场景。",
    keywords: ["Disruptor", "无锁队列", "高性能", "并发"],
  },
  "fory": {
    title: "Fory 序列化 easyfk-fory",
    description:
      "EasyBuild Fory 高性能对象序列化框架，比 JSON 快数十倍，适用于 RPC、缓存等场景。",
    keywords: ["Fory", "序列化", "高性能", "RPC"],
  },
  "chronicle-queue": {
    title: "Chronicle Queue 高性能队列 easyfk-chronicle-queue",
    description:
      "EasyBuild Chronicle Queue 高性能持久化消息队列组件，基于内存映射文件，零 GC 压力，微秒级延迟。",
    keywords: ["Chronicle Queue", "消息队列", "高性能", "内存映射", "零GC"],
  },
  "oss": {
    title: "OSS 文件存储服务 easyfk-oss",
    description:
      "EasyBuild 统一文件存储服务，支持多种云存储平台、大文件分片上传、断点续传、秒传等功能。",
    keywords: ["OSS", "文件存储", "分片上传", "断点续传", "MinIO", "对象存储"],
  },
  "chronicle-map": {
    title: "Chronicle Map 堆外存储 easyfk-chronicle-map",
    description:
      "EasyBuild Chronicle Map 堆外高性能键值存储模块，零 GC 压力，适用于超大数据集缓存。",
    keywords: ["Chronicle Map", "堆外存储", "零GC", "高性能缓存"],
  },
  "admin": {
    title: "EasyBuild Admin 中后台开发文档",
    description:
      "EasyBuild Admin (易构) 中后台前端项目开发文档，涵盖架构设计、技术栈选型、开发规范及核心逻辑实现细节。",
    keywords: ["EasyBuild Admin", "中后台", "Next.js", "React", "Shadcn/ui", "前端脚手架"],
  },
}
