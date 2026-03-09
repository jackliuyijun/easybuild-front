"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, NumberList, InlineCode, Strong, Highlight } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-deps", label: "依赖引入" },
  { id: "sec-config", label: "配置说明" },
  { id: "sec-usage", label: "使用方式" },
  { id: "sec-autoconfig", label: "自动配置" },
  { id: "sec-expiry", label: "过期策略" },
  { id: "sec-api", label: "API 参考" },
  { id: "sec-practices", label: "最佳实践" },
  { id: "sec-packages", label: "包结构" },
]

export default function CacheCaffeineDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Caffeine 缓存"
      title="easyfk-cache-caffeine 本地缓存"
      subtitle="Caffeine 本地缓存 — 高性能进程内缓存方案"
      readingTime="~12 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>cache-caffeine</InlineCode> 是 EasyFK 框架中基于 <InlineCode>Caffeine</InlineCode> 的<Strong>高性能本地缓存组件</Strong>。该模块封装了 Caffeine 缓存库，提供统一的缓存管理能力，并与 Spring Boot 自动配置机制深度集成，支持<Highlight>编程式缓存操作</Highlight>和 <Highlight>Spring Cache 注解</Highlight>两种使用方式。
              </P>
              <TipBox>
                引入依赖后 <InlineCode>LocalCacheManager</InlineCode> 会自动注册为 Spring Bean，<Strong>无需任何配置</Strong>即可使用编程式缓存。
              </TipBox>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-deps">2. 依赖引入</H2>
              <P>在项目的 <InlineCode>build.gradle</InlineCode> 中添加依赖：</P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:cache-caffeine'
}`}</CodeBlock>
              <P>该模块会自动传递引入以下依赖：</P>
              <DocTable
                headers={["依赖", "说明"]}
                rows={[
                  ["com.github.ben-manes.caffeine:caffeine", "Caffeine 缓存核心库"],
                  ["com.mcst:easyfk-core", "EasyFK 核心模块"],
                  ["spring-boot-starter-cache", "Spring Boot 缓存 Starter"],
                ]}
              />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-config">3. 配置说明</H2>

              <H3>3.1 配置属性</H3>
              <P>所有配置项统一在 <InlineCode>easyfk.config.cache.caffeine</InlineCode> 前缀下，可在 <InlineCode>application.yml</InlineCode> 或 <InlineCode>application.properties</InlineCode> 中配置。</P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["create-spring-cache-manager", "Boolean", "false", "是否创建 Spring CacheManager，设为 true 后可使用 @Cacheable 等注解"],
                  ["default-cache-name", "String", '"default"', "默认缓存名称"],
                  ["time-to-live", "Duration", "0（不过期）", "默认缓存过期时间"],
                  ["maximum-size", "Long", "10000", "默认最大缓存条目数"],
                  ["caches", "List", "—", "自定义缓存配置列表"],
                ]}
              />

              <H3>3.2 自定义缓存配置（caches 列表项）</H3>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["cache-name", "String", "—", "缓存名称（必填）"],
                  ["time-to-live", "Duration", "30m", "缓存过期时间"],
                  ["maximum-size", "Long", "10000", "最大缓存条目数"],
                ]}
              />

              <H3>3.3 配置示例</H3>

              <H4>仅使用编程式缓存（默认模式）</H4>
              <P>无需任何配置，引入依赖后 <InlineCode>LocalCacheManager</InlineCode> 会自动注册为 Spring Bean。</P>

              <H4>启用 Spring Cache 注解支持</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    cache:
      caffeine:
        create-spring-cache-manager: true
        default-cache-name: default
        time-to-live: 10m
        maximum-size: 5000
        caches:
          - cache-name: userCache
            time-to-live: 30m
            maximum-size: 2000
          - cache-name: configCache
            time-to-live: 1h
            maximum-size: 500`}</CodeBlock>

              {/* ============== 4. 使用方式 ============== */}
              <H2 id="sec-usage">4. 使用方式</H2>

              <H3>4.1 编程式缓存 — LocalCacheManager</H3>
              <P><InlineCode>LocalCacheManager</InlineCode> 是核心缓存管理器，引入依赖后自动注入即可使用。它统一管理四种 Caffeine 缓存类型的创建和访问。</P>

              <H4>注入 LocalCacheManager</H4>
              <CodeBlock lang="java">{`@Service
public class MyService {

    @Resource
    private LocalCacheManager localCacheManager;
}`}</CodeBlock>

              <H4>基础缓存（Cache）</H4>
              <P><Strong>创建缓存：</Strong></P>
              <CodeBlock lang="java">{`// 创建一个写后10分钟过期、最多缓存1000条的缓存
Cache<String, User> userCache = localCacheManager.getOrCreateCache("userCache", Duration.ofMinutes(10), 1000);

// 仅指定最大数量（不过期）
Cache<String, Config> configCache = localCacheManager.getOrCreateCache("configCache", 5000);

// 指定过期类型：0=写后过期，1=读后过期
Cache<String, Token> tokenCache = localCacheManager.getOrCreateCache("tokenCache", Duration.ofHours(1), 1, 2000);`}</CodeBlock>

              <P><Strong>CRUD 操作：</Strong></P>
              <CodeBlock lang="java">{`// 写入
localCacheManager.put("userCache", "user:1001", userObj);

// 读取
User user = localCacheManager.get("userCache", "user:1001");

// 读取（缓存未命中时自动加载）
User user = localCacheManager.get("userCache", "user:1001", key -> userService.findById(key));

// 删除
localCacheManager.evict("userCache", "user:1001");

// 清空整个缓存
localCacheManager.clear("userCache");`}</CodeBlock>

              <P><Strong>批量操作：</Strong></P>
              <CodeBlock lang="java">{`// 批量读取
Set<String> keys = Set.of("user:1001", "user:1002", "user:1003");
Map<String, User> users = localCacheManager.getAll("userCache", keys);

// 批量写入
Map<String, Object> entries = Map.of("user:1001", user1, "user:1002", user2);
localCacheManager.putAll("userCache", entries);

// 批量删除
localCacheManager.evictAll("userCache", keys);`}</CodeBlock>

              <P><Strong>缓存信息与维护：</Strong></P>
              <CodeBlock lang="java">{`// 获取缓存预估大小
long size = localCacheManager.estimatedSize("userCache");

// 手动触发缓存清理（触发过期条目回收）
localCacheManager.cleanUp("userCache");

// 删除已管理的缓存实例
localCacheManager.removeCache("userCache");`}</CodeBlock>

              <H4>自动加载缓存（LoadingCache）</H4>
              <P>适用于缓存未命中时需要自动从数据源加载的场景。</P>
              <CodeBlock lang="java">{`// 创建自动加载缓存
LoadingCache<String, User> cache = localCacheManager.getOrCreateLoadingCache(
    "userCache",
    Duration.ofMinutes(10),
    1000,
    key -> userService.findById(key)  // CacheLoader
);

// 获取值（缓存未命中时自动调用 loader）
User user = localCacheManager.getFromLoadingCache("userCache", "user:1001");

// 批量获取（自动加载缺失的键）
Map<String, User> users = localCacheManager.getAllFromLoadingCache("userCache", Set.of("user:1001", "user:1002"));

// 手动刷新某个键
localCacheManager.refreshLoadingCache("userCache", "user:1001");`}</CodeBlock>

              <P><Strong>支持写后自动刷新：</Strong></P>
              <CodeBlock lang="java">{`// 写后10分钟过期，写后5分钟触发异步刷新
LoadingCache<String, Config> cache = localCacheManager.getOrCreateLoadingCache(
    "configCache",
    Duration.ofMinutes(10),    // 过期时间
    Duration.ofMinutes(5),     // 刷新时间
    5000,
    key -> configService.load(key)
);`}</CodeBlock>

              <P><Strong>带统计功能的 LoadingCache：</Strong></P>
              <CodeBlock lang="java">{`LoadingCache<String, User> cache = localCacheManager.getOrCreateLoadingCacheWithStats(
    "userCache",
    Duration.ofMinutes(10),
    1000,
    key -> userService.findById(key)
);

// 获取统计信息
CacheStats stats = cache.stats();
// stats.hitRate(), stats.missRate(), stats.loadCount() 等`}</CodeBlock>

              <H4>异步缓存（AsyncCache）</H4>
              <P>适用于需要非阻塞式缓存操作的场景。</P>
              <CodeBlock lang="java">{`// 创建异步缓存
AsyncCache<String, User> asyncCache = localCacheManager.getOrCreateAsyncCache(
    "asyncUserCache",
    Duration.ofMinutes(10),
    1000
);

// 异步获取（未命中时通过函数加载）
CompletableFuture<User> future = localCacheManager.getFromAsyncCache(
    "asyncUserCache",
    "user:1001",
    key -> userService.findById(key)
);

// 异步放入
localCacheManager.putToAsyncCache(
    "asyncUserCache",
    "user:1001",
    CompletableFuture.supplyAsync(() -> userService.findById("user:1001"))
);`}</CodeBlock>

              <H4>异步自动加载缓存（AsyncLoadingCache）</H4>
              <P>结合自动加载与异步处理的缓存类型。</P>
              <CodeBlock lang="java">{`// 使用同步 loader（Caffeine 自动包装为异步执行）
AsyncLoadingCache<String, User> cache = localCacheManager.getOrCreateAsyncLoadingCache(
    "asyncUserCache",
    Duration.ofMinutes(10),
    1000,
    (CacheLoader<String, User>) key -> userService.findById(key)
);

// 使用异步 loader
AsyncLoadingCache<String, User> cache = localCacheManager.getOrCreateAsyncLoadingCache(
    "asyncUserCache",
    Duration.ofMinutes(10),
    1000,
    (AsyncCacheLoader<String, User>) (key, executor) ->
        CompletableFuture.supplyAsync(() -> userService.findById(key), executor)
);

// 异步获取
CompletableFuture<User> future = localCacheManager.getFromAsyncLoadingCache("asyncUserCache", "user:1001");

// 异步批量获取
CompletableFuture<Map<String, User>> futures = localCacheManager.getAllFromAsyncLoadingCache(
    "asyncUserCache",
    Set.of("user:1001", "user:1002")
);`}</CodeBlock>

              <H4>特殊引用类型缓存</H4>
              <CodeBlock lang="java">{`// 弱引用值缓存 — 值无强引用时可被 GC 回收
Cache<String, User> weakCache = localCacheManager.getOrCreateWeakValuesCache("weakCache", Duration.ofMinutes(10), 1000);

// 软引用值缓存 — 内存不足时值可被 GC 回收
Cache<String, User> softCache = localCacheManager.getOrCreateSoftValuesCache("softCache", Duration.ofMinutes(10), 1000);

// 弱引用键缓存 — 键无强引用时可被 GC 回收
Cache<String, User> weakKeyCache = localCacheManager.getOrCreateWeakKeysCache("weakKeyCache", Duration.ofMinutes(10), 1000);

// 带统计功能的缓存
Cache<String, User> statsCache = localCacheManager.getOrCreateCacheWithStats("statsCache", Duration.ofMinutes(10), 1000);`}</CodeBlock>

              <H3>4.2 Spring Cache 注解方式</H3>
              <P>启用 <InlineCode>create-spring-cache-manager: true</InlineCode> 后，可直接使用 Spring Cache 注解。</P>
              <CodeBlock lang="java">{`@Service
public class UserService {

    @Cacheable(value = "userCache", key = "#id")
    public User findById(String id) {
        return userRepository.findById(id);
    }

    @CachePut(value = "userCache", key = "#user.id")
    public User update(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = "userCache", key = "#id")
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    @CacheEvict(value = "userCache", allEntries = true)
    public void clearAll() {
        // 清空 userCache 所有条目
    }
}`}</CodeBlock>

              {/* ============== 5. 自动配置机制 ============== */}
              <H2 id="sec-autoconfig">5. 自动配置机制</H2>
              <P>本模块利用 Spring Boot 自动配置实现<Highlight>零配置启动</Highlight>：</P>
              <DocTable
                headers={["配置类", "条件", "说明"]}
                rows={[
                  ["CaffeineSimpleConfig", "无条件（@ConditionalOnMissingBean）", "自动注册 LocalCacheManager Bean"],
                  ["CaffeineCacheConfig", "create_spring_cache_manager=true", "创建 Spring CacheManager 并启用 @EnableCaching"],
                ]}
              />
              <NumberList items={[
                <><InlineCode>CaffeineSimpleConfig</InlineCode> 始终生效，确保 <InlineCode>LocalCacheManager</InlineCode> 可用</>,
                <><InlineCode>CaffeineCacheConfig</InlineCode> 仅在开启配置时生效，创建 <InlineCode>CaffeineCacheManager</InlineCode> 并标记为 <InlineCode>@Primary</InlineCode></>,
              ]} />

              {/* ============== 6. 缓存过期策略说明 ============== */}
              <H2 id="sec-expiry">6. 缓存过期策略</H2>
              <DocTable
                headers={["策略", "参数", "说明"]}
                rows={[
                  ["写后过期（expireAfterWrite）", "expireType=0（默认）", "写入后经过指定时间自动过期"],
                  ["读后过期（expireAfterAccess）", "expireType=1", "最后一次访问后经过指定时间过期，适合热点数据"],
                  ["写后刷新（refreshAfterWrite）", "LoadingCache 专用", "写入后经过指定时间，下次访问触发异步刷新，刷新期间返回旧值"],
                  ["不过期", "Duration.ZERO 或不设置", "仅受 maximumSize 控制，满时按 LRU/LFU 策略淘汰"],
                ]}
              />
              <TipBox>
                对于<Strong>热点数据</Strong>推荐使用 <InlineCode>expireAfterAccess</InlineCode>（读后过期），对于<Strong>配置类数据</Strong>推荐使用 <InlineCode>refreshAfterWrite</InlineCode>（写后刷新），在保证数据较新的同时避免请求阻塞。
              </TipBox>

              {/* ============== 7. API 快速参考 ============== */}
              <H2 id="sec-api">7. API 快速参考</H2>
              <H3>LocalCacheManager 方法列表</H3>
              <DocTable
                headers={["方法", "说明"]}
                rows={[
                  ["getOrCreateCache(name, expire, maxSize)", "创建/获取基础缓存"],
                  ["getOrCreateCache(name, expire, expireType, maxSize)", "创建/获取基础缓存（可选过期类型）"],
                  ["getOrCreateCache(name, maxSize)", "创建/获取不过期缓存"],
                  ["get(name, key)", "获取缓存值"],
                  ["get(name, key, mappingFunction)", "获取缓存值（未命中时加载）"],
                  ["put(name, key, value)", "放入缓存"],
                  ["evict(name, key)", "删除单个缓存项"],
                  ["getAll(name, keys)", "批量获取"],
                  ["putAll(name, map)", "批量放入"],
                  ["evictAll(name, keys)", "批量删除"],
                  ["clear(name)", "清空缓存"],
                  ["estimatedSize(name)", "获取预估大小"],
                  ["cleanUp(name)", "手动触发清理"],
                  ["removeCache(name)", "移除缓存实例"],
                  ["getOrCreateLoadingCache(...)", "创建自动加载缓存（多种重载）"],
                  ["getOrCreateLoadingCacheWithStats(...)", "创建带统计的自动加载缓存"],
                  ["getFromLoadingCache(name, key)", "从 LoadingCache 获取值"],
                  ["getAllFromLoadingCache(name, keys)", "从 LoadingCache 批量获取"],
                  ["refreshLoadingCache(name, key)", "刷新 LoadingCache 指定键"],
                  ["getOrCreateAsyncCache(...)", "创建异步缓存"],
                  ["getFromAsyncCache(name, key, fn)", "异步获取缓存值"],
                  ["putToAsyncCache(name, key, future)", "异步放入缓存值"],
                  ["getOrCreateAsyncLoadingCache(...)", "创建异步自动加载缓存（多种重载）"],
                  ["getFromAsyncLoadingCache(name, key)", "异步获取自动加载缓存值"],
                  ["getAllFromAsyncLoadingCache(name, keys)", "异步批量获取自动加载缓存值"],
                  ["getOrCreateCacheWithStats(...)", "创建带统计的缓存"],
                  ["getOrCreateWeakValuesCache(...)", "创建弱引用值缓存"],
                  ["getOrCreateSoftValuesCache(...)", "创建软引用值缓存"],
                  ["getOrCreateWeakKeysCache(...)", "创建弱引用键缓存"],
                ]}
              />

              {/* ============== 8. 最佳实践 ============== */}
              <H2 id="sec-practices">8. 最佳实践</H2>
              <NumberList items={[
                <><Strong>缓存命名规范</Strong>：建议使用 <InlineCode>模块:实体</InlineCode> 格式命名，如 <InlineCode>user:info</InlineCode>、<InlineCode>config:system</InlineCode>，避免缓存名称冲突。</>,
                <><Strong>合理设置过期时间</Strong>：根据数据更新频率设置过期时间，频繁变更的数据设置较短过期，配置类数据可适当延长。</>,
                <><Strong>控制缓存大小</Strong>：通过 <InlineCode>maximumSize</InlineCode> 限制缓存条目数，防止内存溢出。</>,
                <><Strong>优先使用 LoadingCache</Strong>：对需要自动加载的场景使用 LoadingCache，避免<Highlight>缓存穿透</Highlight>。</>,
                <><Strong>善用刷新策略</Strong>：对配置类数据使用 <InlineCode>refreshAfterWrite</InlineCode>，在保证数据较新的同时避免请求阻塞。</>,
                <><Strong>内存敏感场景</Strong>：使用弱引用/软引用缓存，让 GC 能在内存压力时自动回收缓存条目。</>,
                <><Strong>监控缓存命中率</Strong>：使用带统计功能的缓存（<InlineCode>WithStats</InlineCode> 系列方法）来观察缓存效果，及时调整策略。</>,
              ]} />
              <WarnBox>
                过大的 <InlineCode>maximumSize</InlineCode> 可能导致 JVM 内存压力，建议根据实际业务数据量和服务器内存合理规划，并配合 <InlineCode>WithStats</InlineCode> 监控缓存命中率进行调优。
              </WarnBox>

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-packages">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.cache.caffeine
├── config
│   ├── CaffeineCacheConfig.java        # Spring Cache 管理器配置（条件激活）
│   ├── CaffeineDefinedInfo.java        # 缓存定义信息实体
│   └── CaffeineSimpleConfig.java       # LocalCacheManager 自动配置
├── manager
│   └── LocalCacheManager.java          # 核心缓存管理器
└── properties
    └── CaffeineCacheProperties.java    # 配置属性绑定类`}</CodeBlock><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-cache-caffeine — 高性能本地缓存，加速数据访问。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
