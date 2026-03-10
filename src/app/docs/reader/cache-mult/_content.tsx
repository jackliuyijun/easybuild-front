"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "组件概述" },
  { id: "sec-quickstart", label: "快速开始" },
  { id: "sec-config", label: "配置详解" },
  { id: "sec-arch", label: "架构原理" },
  { id: "sec-api", label: "核心 API 使用" },
  { id: "sec-scenarios", label: "典型使用场景" },
  { id: "sec-notes", label: "注意事项" },
  { id: "sec-perf", label: "性能优化指南" },
  { id: "sec-faq", label: "FAQ 常见问题" },
]

export default function CacheMultDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="多级缓存"
      title="Cache-Mult 多级缓存组件"
      subtitle="L1 本地 + L2 分布式多级缓存架构"
      readingTime="~15 min"
    >

              {/* ============== 一、组件概述 ============== */}
              <H2 id="sec-overview">一、组件概述</H2>
              <P>
                基于 XXL-CACHE 的 Spring Boot 多级缓存（L1 本地 + L2 分布式）自动配置组件，一行配置即可获得<Strong>高命中率 + 低延迟 + 强一致性</Strong>的多级缓存能力。
              </P>
              <P>
                <InlineCode>cache-mult</InlineCode> 组件基于 XXL-CACHE 实现<Strong>多级缓存</Strong>架构，将本地缓存（L1）与分布式缓存（L2）透明组合：
              </P>
              <BulletList items={[
                <><Strong>L1（一级缓存）</Strong>：默认使用 Caffeine，进程内本地缓存，读取延迟纳秒级</>,
                <><Strong>L2（二级缓存）</Strong>：默认使用 Redisson（Redis），分布式共享缓存，跨节点一致</>,
              ]} />
              <P>
                两级缓存协同工作：读请求优先命中本地 L1，未命中则穿透到 L2，再未命中才查询数据源。写操作会同时更新/失效两级缓存，通过 Redis Pub/Sub 通知其他节点同步失效 L1。
              </P>
              <H4>适用场景</H4>
              <BulletList items={[
                "高并发读多写少的热点数据（用户信息、配置项、字典数据等）",
                "需要兼顾读性能和多节点数据一致性的分布式系统",
                "希望用最小配置获得多级缓存收益，不想手动管理两级缓存协调",
              ]} />

              {/* ============== 二、快速开始 ============== */}
              <H2 id="sec-quickstart">二、快速开始</H2>

              <H3>2.1 引入依赖</H3>
              <H4>Gradle 方式</H4>
              <CodeBlock lang="groovy">{`dependencies {
    implementation("com.mcst:cache-mult")
}`}</CodeBlock>
              <H4>Maven 方式</H4>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>cache-mult</artifactId>
</dependency>`}</CodeBlock>
              <TipBox>
                版本由 EasyFK BOM（<InlineCode>com.mcst:easyfk-dependencies</InlineCode>）统一管理，无需手动指定版本号。
              </TipBox>

              <H3>2.2 基础配置</H3>
              <P>在 <InlineCode>application.yml</InlineCode> 中配置：</P>
              <CodeBlock lang="yaml">{`xxl:
  cache:
    l1:
      provider: caffeine
      maxSize: 10000
      expireAfterWrite: 600
    l2:
      provider: redisson
      serializer: java
      nodes: redis://127.0.0.1:6379
      password: your-password`}</CodeBlock>

              <H3>2.3 使用示例</H3>
              <CodeBlock lang="java">{`import com.xxl.cache.core.XxlCacheHelper;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;

        User user = XxlCacheHelper.get(cacheKey);
        if (user != null) {
            return user;
        }

        user = queryFromDB(userId);

        XxlCacheHelper.set(cacheKey, user);
        return user;
    }
}`}</CodeBlock>

              {/* ============== 三、配置详解 ============== */}
              <H2 id="sec-config">三、配置详解</H2>

              <H3>3.1 完整配置项</H3>
              <DocTable
                headers={["配置项", "默认值", "说明"]}
                rows={[
                  ["xxl.cache.l1.provider", "caffeine", "L1 缓存提供者"],
                  ["xxl.cache.l1.maxSize", "10000", "L1 最大缓存条目数"],
                  ["xxl.cache.l1.expireAfterWrite", "600", "L1 写入后过期时间（秒）"],
                  ["xxl.cache.l2.provider", "redisson", "L2 缓存提供者"],
                  ["xxl.cache.l2.serializer", "java", "L2 序列化方式"],
                  ["xxl.cache.l2.nodes", "（空）", "Redis 节点地址"],
                  ["xxl.cache.l2.user", "（空）", "Redis 用户名（ACL 认证时使用）"],
                  ["xxl.cache.l2.password", "（空）", "Redis 密码"],
                ]}
              />

              <H3>3.2 L1 一级缓存配置</H3>
              <P>L1 基于 Caffeine 实现进程内高速缓存：</P>

              <H4>maxSize — 最大条目数</H4>
              <P>控制本地缓存可存储的最大条目数，超出后按 LRU（最近最少使用）策略淘汰。</P>
              <CodeBlock lang="yaml">{`xxl:
  cache:
    l1:
      maxSize: 10000`}</CodeBlock>
              <P>选型建议：</P>
              <BulletList items={[
                <>热点数据较少（如配置项）：<InlineCode>1000 ~ 5000</InlineCode></>,
                <>通用业务场景：<InlineCode>10000</InlineCode>（默认）</>,
                <>热点数据较多（如商品详情）：<InlineCode>50000 ~ 100000</InlineCode></>,
                "注意：每增加 1 万条约额外占用 10~50MB 内存（取决于对象大小）",
              ]} />

              <H4>expireAfterWrite — 写入后过期时间</H4>
              <P>控制 L1 缓存条目的存活时间（秒），到期后自动失效。这是 L1 与 L2 数据一致性的保底机制。</P>
              <CodeBlock lang="yaml">{`xxl:
  cache:
    l1:
      expireAfterWrite: 600`}</CodeBlock>
              <P>选型建议：</P>
              <BulletList items={[
                <>数据变更频繁：<InlineCode>60 ~ 300</InlineCode>（1~5 分钟）</>,
                <>通用场景：<InlineCode>600</InlineCode>（默认 10 分钟）</>,
                <>几乎不变的数据（如枚举字典）：<InlineCode>3600 ~ 86400</InlineCode>（1 小时~1 天）</>,
              ]} />

              <H3>3.3 L2 二级缓存配置</H3>

              <H4>nodes — Redis 连接地址</H4>
              <P>支持单机和集群模式：</P>
              <CodeBlock lang="yaml">{`# 单机模式
xxl:
  cache:
    l2:
      nodes: redis://127.0.0.1:6379

# 集群模式（逗号分隔多个节点）
xxl:
  cache:
    l2:
      nodes: redis://node1:6379,redis://node2:6379,redis://node3:6379

# 带 SSL
xxl:
  cache:
    l2:
      nodes: rediss://127.0.0.1:6379`}</CodeBlock>

              <H4>serializer — 序列化方式</H4>
              <DocTable
                headers={["值", "说明", "适用场景"]}
                rows={[
                  ["java", "Java 原生序列化", "默认选项，兼容性好"],
                  ["json", "JSON 序列化", "可读性好，跨语言场景"],
                  ["kryo", "Kryo 序列化", "高性能，体积小"],
                ]}
              />

              {/* ============== 四、架构原理 ============== */}
              <H2 id="sec-arch">四、架构原理</H2>

              <H3>4.1 多级缓存架构</H3>
              <CodeBlock lang="plaintext">{`┌─────────────────────────────────────────────────────────────┐
│                      应用节点 A                               │
│  ┌─────────┐    未命中    ┌─────────┐    未命中    ┌────────┐ │
│  │ L1 本地  │ ──────────→ │ L2 Redis │ ──────────→ │ 数据源  │ │
│  │ Caffeine │ ←────────── │ 分布式   │ ←────────── │ DB/API │ │
│  └─────────┘   回填 L1    └─────────┘   回填 L2    └────────┘ │
└────────┬────────────────────────┬───────────────────────────┘
         │                        │
         │  Redis Pub/Sub 失效通知  │
         │                        │
┌────────▼────────────────────────▼───────────────────────────┐
│                      应用节点 B                               │
│  ┌─────────┐              ┌─────────┐              ┌────────┐ │
│  │ L1 本地  │              │ L2 Redis │              │ 数据源  │ │
│  │ Caffeine │              │ 共享同一  │              │        │ │
│  └─────────┘              │ Redis    │              └────────┘ │
└─────────────────────────────────────────────────────────────┘`}</CodeBlock>

              <H3>4.2 缓存查找流程</H3>
              <CodeBlock lang="plaintext">{`请求 → 查 L1（本地 Caffeine）
          ├── 命中 → 直接返回（纳秒级）
          └── 未命中 → 查 L2（Redis）
                         ├── 命中 → 回填 L1 → 返回（毫秒级）
                         └── 未命中 → 查数据源 → 回填 L2 + L1 → 返回`}</CodeBlock>

              <H3>4.3 缓存一致性机制</H3>
              <P><InlineCode>cache-mult</InlineCode> 通过以下机制保证多节点间 L1 数据的一致性：</P>
              <NumberList items={[
                <><Strong>写入/更新时</Strong>：同时写入 L1 和 L2，并通过 Redis Pub/Sub 通知其他节点失效对应 L1 条目</>,
                <><Strong>删除时</Strong>：同时删除 L1 和 L2，并广播失效通知</>,
                <><Strong>过期兜底</Strong>：L1 的 <InlineCode>expireAfterWrite</InlineCode> 作为兜底机制，即使 Pub/Sub 消息丢失，过期后也会从 L2 重新加载</>,
              ]} />
              <WarnBox>
                这是<Strong>最终一致性</Strong>模型，在 Pub/Sub 消息传播的极短窗口内（通常 &lt; 10ms），其他节点的 L1 可能存在旧数据。
              </WarnBox>

              {/* ============== 五、核心 API 使用 ============== */}
              <H2 id="sec-api">五、核心 API 使用</H2>

              <H3>5.1 注解方式（推荐）</H3>
              <P><InlineCode>cache-mult</InlineCode> 兼容 Spring Cache 注解体系，可直接使用标准注解：</P>
              <CodeBlock lang="java">{`@Service
public class ProductService {

    @Cacheable(value = "products", key = "#productId")
    public Product getProduct(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    @CachePut(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", key = "#productId")
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @CacheEvict(value = "products", allEntries = true)
    public void clearAllProductCache() {
        // 清空 products 缓存空间所有条目
    }
}`}</CodeBlock>

              <H3>5.2 编程式操作</H3>
              <P>通过 <InlineCode>XxlCacheHelper</InlineCode> 直接操作多级缓存：</P>
              <CodeBlock lang="java">{`import com.xxl.cache.core.XxlCacheHelper;

XxlCacheHelper.set("user:10001", userObject);

User user = XxlCacheHelper.get("user:10001");

XxlCacheHelper.remove("user:10001");`}</CodeBlock>

              {/* ============== 六、典型使用场景 ============== */}
              <H2 id="sec-scenarios">六、典型使用场景</H2>

              <H3>场景一：用户信息缓存</H3>
              <CodeBlock lang="java">{`@Service
public class UserService {

    @Cacheable(value = "users", key = "#userId")
    public UserDTO getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void updateUser(Long userId, UserDTO userDTO) {
        userMapper.updateById(userDTO);
    }
}`}</CodeBlock>
              <P>配置：</P>
              <CodeBlock lang="yaml">{`xxl:
  cache:
    l1:
      maxSize: 5000
      expireAfterWrite: 300`}</CodeBlock>

              <H3>场景二：字典/配置数据缓存</H3>
              <CodeBlock lang="java">{`@Service
public class DictService {

    @Cacheable(value = "dict", key = "#dictType + ':' + #dictCode")
    public String getDictLabel(String dictType, String dictCode) {
        return dictMapper.selectLabel(dictType, dictCode);
    }
}`}</CodeBlock>
              <P>配置：</P>
              <CodeBlock lang="yaml">{`xxl:
  cache:
    l1:
      maxSize: 50000
      expireAfterWrite: 3600`}</CodeBlock>

              <H3>场景三：高并发商品详情</H3>
              <CodeBlock lang="java">{`@Service
public class ProductService {

    @Cacheable(value = "product-detail", key = "#productId")
    public ProductDetailVO getProductDetail(Long productId) {
        return assembleProductDetail(productId);
    }
}`}</CodeBlock>
              <P>配置：</P>
              <CodeBlock lang="yaml">{`xxl:
  cache:
    l1:
      maxSize: 100000
      expireAfterWrite: 120`}</CodeBlock>

              {/* ============== 七、注意事项 ============== */}
              <H2 id="sec-notes">七、注意事项</H2>

              <H3>7.1 缓存对象必须可序列化</H3>
              <P>存入多级缓存的对象<Strong>必须实现 <InlineCode>Serializable</InlineCode> 接口</Strong>（使用 Java 序列化时），否则 L2 写入会失败：</P>
              <CodeBlock lang="java">{`// 正确：实现 Serializable
public class UserDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String name;
}

// 错误：未实现 Serializable，L2 写入异常
public class UserDTO {
    private Long id;
    private String name;
}`}</CodeBlock>

              <H3>7.2 避免缓存大对象</H3>
              <BulletList items={[
                "L1 是本地内存，大对象会快速占满堆内存",
                <><Strong>单个缓存值建议控制在 1KB~100KB</Strong></>,
                "如果缓存对象包含大集合，考虑拆分或只缓存关键字段",
              ]} />

              <H3>7.3 缓存穿透防护</H3>
              <P><InlineCode>cache-mult</InlineCode> 默认不缓存 <InlineCode>null</InlineCode> 值。高并发下如果大量请求查询不存在的数据，会反复穿透到数据源。建议在业务层处理：</P>
              <CodeBlock lang="java">{`@Cacheable(value = "users", key = "#userId", unless = "#result == null")
public UserDTO getUserById(Long userId) {
    UserDTO user = userMapper.selectById(userId);
    return user != null ? user : UserDTO.EMPTY;
}`}</CodeBlock>

              <H3>7.4 缓存雪崩防护</H3>
              <P>大量缓存同时过期会导致瞬间压力全部打到数据源。建议：</P>
              <BulletList items={[
                <>对不同业务数据设置<Strong>差异化的过期时间</Strong></>,
                "在过期时间上增加随机偏移量",
              ]} />

              <H3>7.5 L1 与 L2 过期时间的关系</H3>
              <BulletList items={[
                <>L1 过期时间应<Strong>小于等于</Strong> L2 过期时间</>,
                "L1 过期时间越短，数据一致性越好，但缓存命中率越低",
                "推荐 L1 过期时间为 L2 的 1/6 ~ 1/3",
              ]} />

              <H3>7.6 与其他缓存组件的关系</H3>
              <DocTable
                headers={["组件", "定位", "与 cache-mult 的关系"]}
                rows={[
                  ["cache-caffeine", "纯本地缓存", "cache-mult 的 L1 层使用 Caffeine"],
                  ["cache-redis", "纯 Redis 缓存", "cache-mult 的 L2 层使用 Redis"],
                  ["cache-mult", "多级缓存", "自动组合 L1 + L2，无需单独引入上述两个"],
                ]}
              />
              <WarnBox>
                <InlineCode>cache-mult</InlineCode> 自带 Caffeine 和 Redisson 依赖，<Strong>不需要</Strong>额外引入 <InlineCode>cache-caffeine</InlineCode> 或 <InlineCode>cache-redis</InlineCode>。同时使用可能导致 Bean 冲突。
              </WarnBox>

              {/* ============== 八、性能优化指南 ============== */}
              <H2 id="sec-perf">八、性能优化指南</H2>

              <H3>8.1 合理设置 L1 maxSize</H3>
              <CodeBlock lang="plaintext">{`maxSize 过小 → L1 命中率低 → 频繁穿透到 L2 → 网络开销增大
maxSize 过大 → 本地内存占用高 → 可能触发 GC → 影响应用稳定性`}</CodeBlock>
              <H4>估算公式</H4>
              <CodeBlock lang="plaintext">{`推荐 maxSize = 热点数据总量 × 1.2（留 20% 余量）
内存占用估算 = maxSize × 平均对象大小`}</CodeBlock>

              <H3>8.2 L1 过期时间调优</H3>
              <DocTable
                headers={["数据特征", "推荐 expireAfterWrite", "命中率", "一致性"]}
                rows={[
                  ["几乎不变", "1800 ~ 3600 秒", "极高", "较弱"],
                  ["偶尔变更", "300 ~ 600 秒", "高", "较好"],
                  ["频繁变更", "30 ~ 120 秒", "中等", "强"],
                  ["实时性要求极高", "不建议使用 L1", "—", "—"],
                ]}
              />

              <H3>8.3 Redis 连接优化</H3>
              <BulletList items={[
                "使用 Redis 集群模式提高 L2 可用性",
                "确保应用节点与 Redis 在同一内网，减少网络延迟",
                <>合理配置 Redis 的 maxmemory 和淘汰策略（推荐 <InlineCode>allkeys-lru</InlineCode>）</>,
              ]} />

              <H3>8.4 序列化选择</H3>
              <DocTable
                headers={["序列化方式", "速度", "体积", "可读性", "推荐场景"]}
                rows={[
                  ["java", "中等", "较大", "不可读", "默认选项，兼容性好"],
                  ["json", "中等", "中等", "可读", "调试友好，跨语言"],
                  ["kryo", "快", "小", "不可读", "追求极致性能"],
                ]}
              />

              {/* ============== 九、FAQ 常见问题 ============== */}
              <H2 id="sec-faq">九、FAQ 常见问题</H2>

              <H3>Q1: L1 和 L2 数据不一致怎么办？</H3>
              <P>短暂的不一致是正常的（最终一致性模型）。如果发现长时间不一致：</P>
              <NumberList items={[
                "检查 Redis Pub/Sub 是否正常工作",
                <>检查 L1 的 <InlineCode>expireAfterWrite</InlineCode> 是否合理</>,
                "确认写操作是否正确触发了缓存失效",
              ]} />

              <H3>Q2: Redis 宕机后 L1 还能用吗？</H3>
              <P>L1 是独立的本地缓存，Redis 宕机后 L1 中已有的数据仍然可用。但新的缓存未命中无法穿透到 L2，会直接访问数据源。Redis 恢复后多级缓存自动恢复正常。</P>

              <H3>Q3: 多个服务共享同一个 Redis，缓存 key 会冲突吗？</H3>
              <P>建议在 key 中加入服务名前缀以避免冲突，例如 <InlineCode>order-service:user:10001</InlineCode>。</P>

              <H3>Q4: cache-mult 和 Spring Cache 注解兼容吗？</H3>
              <P>兼容。<InlineCode>cache-mult</InlineCode> 底层集成了 XXL-CACHE，支持 Spring Cache 标准注解（<InlineCode>@Cacheable</InlineCode>、<InlineCode>@CachePut</InlineCode>、<InlineCode>@CacheEvict</InlineCode>）。</P>

              <H3>Q5: 什么时候应该用 cache-mult，什么时候用单层缓存？</H3>
              <DocTable
                headers={["场景", "推荐方案"]}
                rows={[
                  ["单机应用，数据量小", "cache-caffeine（纯本地缓存）"],
                  ["分布式应用，一致性要求高", "cache-redis（纯 Redis 缓存）"],
                  ["分布式应用，高并发读 + 兼顾一致性", "cache-mult（多级缓存）"],
                ]}
              />

              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  cache-mult — L1 本地 + L2 分布式，多级缓存加速数据访问。
                </p>
              </div>

    </DocLayout>
  )
}
