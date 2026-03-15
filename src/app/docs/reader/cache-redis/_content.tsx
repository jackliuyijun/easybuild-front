"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "组件概述" },
  { id: "sec-quickstart", label: "快速开始" },
  { id: "sec-config", label: "配置详解" },
  { id: "sec-components", label: "核心组件详解" },
  { id: "sec-scenarios", label: "典型使用场景" },
  { id: "sec-notes", label: "注意事项" },
  { id: "sec-performance", label: "性能优化指南" },
  { id: "sec-faq", label: "FAQ 常见问题" },
]

export default function CacheRedisDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Redis 缓存"
      title="Cache-Redis 分布式缓存组件"
      subtitle="Spring Cache + Redis 注解驱动与编程式双模式"
      readingTime="~20 min"
    >

              {/* ============== 一、组件概述 ============== */}
              <H2 id="sec-overview">一、组件概述</H2>
              <P>
                <InlineCode>cache-redis</InlineCode> 组件是 EasyFK 框架的<Strong>分布式 Redis 缓存</Strong>方案，提供两种使用模式：
              </P>
              <NumberList items={[
                <><Strong>注解驱动模式</Strong>：通过 <InlineCode>@Cacheable</InlineCode>、<InlineCode>@CachePut</InlineCode>、<InlineCode>@CacheEvict</InlineCode> 等 Spring Cache 标准注解声明式管理缓存</>,
                <><Strong>编程式模式</Strong>：通过 <InlineCode>ICacheService</InlineCode> 接口直接进行缓存的增删查改操作</>,
              ]} />
              <P>核心特性：</P>
              <BulletList items={[
                <>自动配置 <InlineCode>RedisCacheManager</InlineCode>，引入即用</>,
                <>支持为<Strong>不同缓存空间</Strong>配置独立的 TTL（过期时间）</>,
                <>基于 EasyFK <InlineCode>db-redis</InlineCode> 组件的多数据源连接管理，支持指定缓存使用的 Redis 数据源</>,
                <>Key 使用 <InlineCode>StringRedisSerializer</InlineCode> 序列化，Value 序列化方式跟随 <InlineCode>db-redis</InlineCode> 全局配置</>,
                <>默认禁止缓存 <InlineCode>null</InlineCode> 值，避免缓存穿透</>,
              ]} />
              <H4>依赖关系</H4>
              <CodeBlock lang="plaintext">{`cache-redis
├── easyfk-cache（缓存接口层，定义 ICacheService）
└── db-redis（Redis 连接管理，提供 RedisConnectionManager、RedisOptManager 等）`}</CodeBlock>

              {/* ============== 二、快速开始 ============== */}
              <H2 id="sec-quickstart">二、快速开始</H2>

              <H3>2.1 引入依赖</H3>
              <H4>Gradle 方式</H4>
              <CodeBlock lang="groovy">{`dependencies {
    implementation("com.mcst:cache-redis")
}`}</CodeBlock>
              <H4>Maven 方式</H4>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>cache-redis</artifactId>
</dependency>`}</CodeBlock>
              <TipBox>
                版本由 EasyFK BOM 统一管理，无需手动指定版本号。
              </TipBox>

              <H3>2.2 基础配置</H3>
              <P>默认情况下，使用 Spring Boot 标准的 Redis 配置即可：</P>
              <CodeBlock lang="yaml">{`# Spring Redis 标准配置
spring:
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      password: your-password
      database: 0

# cache-redis 缓存配置
easyfk:
  config:
    cache:
      redis:
        time-to-live: 30m                  # 全局默认 TTL`}</CodeBlock>
              <TipBox>
                如需多数据源支持，可通过 <InlineCode>db-redis</InlineCode> 组件的自定义配置指定缓存使用的数据源，详见多数据源场景。
              </TipBox>

              <H3>2.3 使用示例</H3>
              <H4>注解方式</H4>
              <CodeBlock lang="java">{`@Service
public class UserService {

    @Cacheable(value = "users", key = "#userId")
    public UserDTO getUserById(Long userId) {
        return userMapper.selectById(userId);
    }
}`}</CodeBlock>
              <H4>编程方式</H4>
              <CodeBlock lang="java">{`@Service
public class UserService {

    @Resource
    private ICacheService cacheService;

    public UserDTO getUserById(Long userId) {
        String key = "user:" + userId;

        // 查询缓存
        UserDTO user = cacheService.queryByKey(key, "user-ns");
        if (user != null) {
            return user;
        }

        // 缓存未命中，查询数据库
        user = userMapper.selectById(userId);
        if (user != null) {
            cacheService.cacheObject(key, user, Duration.ofMinutes(30), "user-ns");
        }
        return user;
    }
}`}</CodeBlock>

              {/* ============== 三、配置详解 ============== */}
              <H2 id="sec-config">三、配置详解</H2>

              <H3>3.1 全局配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.cache.redis</InlineCode></P>
              <P>对应属性类：<InlineCode>RedisCacheProperties</InlineCode></P>
              <DocTable
                headers={["配置项", "类型", "默认值", "说明"]}
                rows={[
                  [<InlineCode>datasource</InlineCode>, "String", <InlineCode>default</InlineCode>, "Redis 数据源名称（对应 db-redis 中配置的数据源）"],
                  [<InlineCode>database-name</InlineCode>, "String", <InlineCode>default</InlineCode>, "Redis 数据库名称（对应数据源下的库配置）"],
                  [<InlineCode>time-to-live</InlineCode>, "Duration", <InlineCode>0</InlineCode>, "全局默认缓存过期时间（0 表示永不过期）"],
                  [<InlineCode>caches</InlineCode>, "List", "（空）", "自定义缓存空间配置列表"],
                ]}
              />
              <H4>Duration 格式示例</H4>
              <BulletList items={[
                <><InlineCode>30m</InlineCode> — 30 分钟</>,
                <><InlineCode>2h</InlineCode> — 2 小时</>,
                <><InlineCode>1d</InlineCode> — 1 天</>,
                <><InlineCode>PT30S</InlineCode> — 30 秒（ISO-8601 格式）</>,
                <><InlineCode>0</InlineCode> — 永不过期</>,
              ]} />

              <H3>3.2 多缓存空间独立 TTL</H3>
              <P>不同的业务数据通常需要不同的过期时间。通过 <InlineCode>caches</InlineCode> 配置为每个缓存空间（<InlineCode>cacheName</InlineCode>）设置独立的 TTL：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    cache:
      redis:
        time-to-live: 30m
        caches:
          - cache-name: users
            time-to-live: 2h
          - cache-name: verify-code
            time-to-live: 5m
          - cache-name: dict
            time-to-live: 1d`}</CodeBlock>
              <H4>字段说明</H4>
              <DocTable
                headers={["字段", "类型", "必填", "默认值", "说明"]}
                rows={[
                  [<InlineCode>cache-name</InlineCode>, "String", "是", "—", "缓存空间名称，对应 @Cacheable(value = \"xxx\")"],
                  [<InlineCode>time-to-live</InlineCode>, "Duration", "否", <InlineCode>30m</InlineCode>, "该缓存空间的过期时间"],
                ]}
              />

              <H3>3.3 caches 配置与未配置的行为差异</H3>
              <WarnBox>
                <Strong>配置了 <InlineCode>caches</InlineCode> 列表时</Strong>：<InlineCode>RedisCacheManager</InlineCode> 仅对列表中声明的缓存空间应用自定义 TTL 和序列化配置。<Strong>未在列表中声明的缓存空间将使用 Spring Cache 的默认行为（无 TTL，允许缓存 null 值）</Strong>。
              </WarnBox>
              <TipBox>
                <Strong>未配置 <InlineCode>caches</InlineCode> 时</Strong>：全局配置（包含 <InlineCode>time-to-live</InlineCode>、序列化器、禁止缓存 null 值）将通过 <InlineCode>cacheDefaults</InlineCode> 应用到所有缓存空间，并启用事务感知（<InlineCode>transactionAware</InlineCode>）。
              </TipBox>
              <P>如果需要让所有缓存空间都使用全局配置，<Strong>不要配置 <InlineCode>caches</InlineCode> 列表</Strong>，仅设置全局 <InlineCode>time-to-live</InlineCode> 即可。</P>

              <H3>3.4 多数据源场景（进阶）</H3>
              <P>默认情况下，使用 Spring Boot 标准 Redis 配置（<InlineCode>spring.data.redis.*</InlineCode>）即可，无需额外配置数据源。当需要多 Redis 数据源时，可通过 <InlineCode>db-redis</InlineCode> 组件管理多个数据源，并在 <InlineCode>cache-redis</InlineCode> 中通过 <InlineCode>datasource</InlineCode> + <InlineCode>database-name</InlineCode> 指定缓存使用哪个数据源和数据库：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    db:
      redis:
        redis-serializer: FastJSON           # 序列化器，可选：DEFAULT / FastJSON / KRYO
        default-data-source: default
        datasource:
          default:
            host: 127.0.0.1
            port: 6379
            password: your-password
            database: 0
            databases:
              default: 0
              cache-db: 1                    # 数据库别名 cache-db → 索引 1

    cache:
      redis:
        datasource: default                  # 指定使用 db-redis 中的数据源名称
        database-name: cache-db              # 指定使用数据源中别名为 cache-db 的库（索引 1）
        time-to-live: 30m
        caches:
          - cache-name: users
            time-to-live: 2h
          - cache-name: verify-code
            time-to-live: 5m`}</CodeBlock>
              <BulletList items={[
                <><InlineCode>datasource</InlineCode> 和 <InlineCode>database-name</InlineCode> 的默认值均为 <InlineCode>default</InlineCode>，单数据源场景下无需配置</>,
                <><InlineCode>database-name</InlineCode> 对应数据源配置中 <InlineCode>databases</InlineCode> Map 的 key（别名），而不是 Redis 数据库索引数字</>,
              ]} />
              <TipBox>
                <Strong>建议</Strong>：在生产环境中，如果缓存数据量大，建议使用独立的 Redis 实例，避免与业务数据争抢资源。
              </TipBox>

              {/* ============== 四、核心组件详解 ============== */}
              <H2 id="sec-components">四、核心组件详解</H2>

              <H3>4.1 RedisCacheManager（注解驱动）</H3>
              <P>组件自动配置的 <InlineCode>RedisCacheManager</InlineCode> 作为 Spring Cache 的缓存管理器，支持 <InlineCode>@Cacheable</InlineCode>、<InlineCode>@CachePut</InlineCode>、<InlineCode>@CacheEvict</InlineCode> 等标准注解。</P>
              <H4>关键行为</H4>
              <BulletList items={[
                <>Key 序列化：<InlineCode>StringRedisSerializer</InlineCode>（字符串格式，便于在 Redis 客户端查看）</>,
                <>Value 序列化：跟随 <InlineCode>db-redis</InlineCode> 组件的 <InlineCode>redis-serializer</InlineCode> 全局配置</>,
                <>禁止缓存 <InlineCode>null</InlineCode> 值（<InlineCode>disableCachingNullValues</InlineCode>）</>,
                <>使用 <InlineCode>@Primary</InlineCode> 标记，当存在多个 <InlineCode>CacheManager</InlineCode> 时默认使用此实例</>,
                <>使用 <InlineCode>@Lazy</InlineCode> 延迟初始化，确保 Redis 连接工厂在初始化时已就绪</>,
              ]} />

              <H3>4.2 ICacheService（编程式操作）</H3>
              <P><InlineCode>ICacheService</InlineCode> 是 EasyFK 缓存抽象接口，<InlineCode>RedisCacheServiceImpl</InlineCode> 为其 Redis 实现。</P>

              <H4>API 一览</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>cacheObject(key, value, namespace)</InlineCode>, "键, 值, 命名空间", <InlineCode>{"BaseResult<?>"}</InlineCode>, "写入缓存（永不过期）"],
                  [<InlineCode>cacheObject(key, value, times, namespace)</InlineCode>, "键, 值, 过期时间, 命名空间", <InlineCode>{"BaseResult<?>"}</InlineCode>, "写入缓存（指定过期时间）"],
                  [<InlineCode>queryByKey(key, namespace)</InlineCode>, "键, 命名空间", <InlineCode>T</InlineCode>, "查询缓存值"],
                  [<InlineCode>existKey(key, namespace)</InlineCode>, "键, 命名空间", <InlineCode>boolean</InlineCode>, "判断 Key 是否存在"],
                  [<InlineCode>removeKey(key, namespace)</InlineCode>, "键, 命名空间", <InlineCode>{"BaseResult<?>"}</InlineCode>, "删除缓存"],
                  [<InlineCode>expireKey(key, times, namespace)</InlineCode>, "键, 过期时间, 命名空间", <InlineCode>void</InlineCode>, "设置过期时间"],
                  [<InlineCode>expireKeyAt(key, date, namespace)</InlineCode>, "键, 到期日期, 命名空间", <InlineCode>void</InlineCode>, "设置到期时间点"],
                  [<InlineCode>getKeyExpire(key, namespace)</InlineCode>, "键, 命名空间", <InlineCode>long</InlineCode>, "获取剩余过期时间"],
                  [<InlineCode>getSetCountByKey(pattern, namespace)</InlineCode>, "模式, 命名空间", <InlineCode>Long</InlineCode>, "获取 Set 集合大小"],
                ]}
              />
              <H4>参数说明</H4>
              <BulletList items={[
                <><InlineCode>key</InlineCode>：缓存键，由业务自行定义</>,
                <><InlineCode>namespace</InlineCode>：命名空间，用于 Key 前缀隔离不同业务的数据</>,
                <><InlineCode>times</InlineCode>：<InlineCode>java.time.Duration</InlineCode> 类型的过期时间</>,
                <>所有操作自动路由到配置的 <InlineCode>datasource</InlineCode> + <InlineCode>databaseName</InlineCode> 指定的 Redis 实例</>,
              ]} />

              {/* ============== 五、典型使用场景 ============== */}
              <H2 id="sec-scenarios">五、典型使用场景</H2>

              <H3>5.1 Spring Cache 注解方式</H3>
              <H4>基础查询缓存</H4>
              <CodeBlock lang="java">{`@Service
public class ProductService {

    @Cacheable(value = "products", key = "#productId")
    public ProductDTO getProduct(Long productId) {
        return productMapper.selectById(productId);
    }

    @CachePut(value = "products", key = "#product.id")
    public ProductDTO updateProduct(ProductDTO product) {
        productMapper.updateById(product);
        return product;
    }

    @CacheEvict(value = "products", key = "#productId")
    public void deleteProduct(Long productId) {
        productMapper.deleteById(productId);
    }

    @CacheEvict(value = "products", allEntries = true)
    public void refreshAllProducts() {
        // 触发全量刷新
    }
}`}</CodeBlock>

              <H4>组合键</H4>
              <CodeBlock lang="java">{`@Cacheable(value = "user-roles", key = "#userId + ':' + #appId")
public List<RoleDTO> getUserRoles(Long userId, String appId) {
    return roleMapper.selectByUserAndApp(userId, appId);
}`}</CodeBlock>

              <H4>条件缓存</H4>
              <CodeBlock lang="java">{`@Cacheable(value = "users", key = "#userId", unless = "#result == null")
public UserDTO getUser(Long userId) {
    return userMapper.selectById(userId);
}

@Cacheable(value = "users", key = "#userId", condition = "#userId > 0")
public UserDTO getUser(Long userId) {
    return userMapper.selectById(userId);
}`}</CodeBlock>

              <H3>5.2 编程式缓存操作</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private ICacheService cacheService;

    private static final String NS = "order";

    public OrderDTO getOrder(String orderId) {
        OrderDTO order = cacheService.queryByKey(orderId, NS);
        if (order != null) {
            return order;
        }

        order = orderMapper.selectById(orderId);
        if (order != null) {
            cacheService.cacheObject(orderId, order, NS);
        }
        return order;
    }
}`}</CodeBlock>

              <H3>5.3 带过期时间的缓存</H3>
              <CodeBlock lang="java">{`public void cacheVerifyCode(String phone, String code) {
    cacheService.cacheObject("verify:" + phone, code, Duration.ofMinutes(5), "auth");
}

public void cacheToken(String token, UserSession session) {
    cacheService.cacheObject(token, session, Duration.ofHours(2), "session");
}`}</CodeBlock>

              <H3>5.4 缓存键判断与删除</H3>
              <CodeBlock lang="java">{`boolean exists = cacheService.existKey("user:10001", "user");

cacheService.removeKey("user:10001", "user");`}</CodeBlock>

              <H3>5.5 过期时间管理</H3>
              <CodeBlock lang="java">{`cacheService.expireKey("token:abc123", Duration.ofHours(2), "session");

Date activityEndTime = parseDate("2026-12-31 23:59:59");
cacheService.expireKeyAt("activity:config", activityEndTime, "activity");

long ttl = cacheService.getKeyExpire("token:abc123", "session");
log.info("Token 剩余有效期: {} 秒", ttl);`}</CodeBlock>

              {/* ============== 六、注意事项 ============== */}
              <H2 id="sec-notes">六、注意事项</H2>

              <H3>6.1 Redis 连接配置</H3>
              <P>默认情况下使用 Spring Boot 标准 Redis 配置（<InlineCode>spring.data.redis.*</InlineCode>）。如果需要多数据源，通过 <InlineCode>db-redis</InlineCode> 组件的自定义配置（<InlineCode>easyfk.config.db.redis</InlineCode>）管理，详见多数据源场景。</P>

              <H3>6.2 null 值不会被缓存</H3>
              <P>组件默认配置了 <InlineCode>disableCachingNullValues()</InlineCode>，这意味着：</P>
              <BulletList items={[
                <><InlineCode>@Cacheable</InlineCode> 方法返回 <InlineCode>null</InlineCode> 时<Strong>不会</Strong>写入缓存</>,
                "下次相同参数仍会穿透到实际方法执行",
                <>如果需要防止缓存穿透，请在业务层返回空对象代替 <InlineCode>null</InlineCode></>,
              ]} />

              <H3>6.3 @Cacheable 的 value 与 caches 配置的对应关系</H3>
              <P><InlineCode>{`@Cacheable(value = "users")`}</InlineCode> 中的 <InlineCode>value</InlineCode> 对应 YAML 配置中 <InlineCode>caches</InlineCode> 列表里的 <InlineCode>cache-name</InlineCode>：</P>
              <CodeBlock lang="yaml">{`caches:
  - cache-name: users
    time-to-live: 2h`}</CodeBlock>
              <WarnBox>
                如果使用了未在 <InlineCode>caches</InlineCode> 中声明的缓存名称，该缓存空间将使用 <Strong>Spring Cache 的默认行为（无 TTL，允许缓存 null 值）</Strong>，而非全局 <InlineCode>time-to-live</InlineCode>。
              </WarnBox>

              <H3>6.4 注解方式与编程方式的 Key 格式不同</H3>
              <BulletList items={[
                <><Strong>注解方式</Strong>：Key 格式为 <InlineCode>cacheName::key</InlineCode>（Spring Cache 默认的 <InlineCode>::</InlineCode> 分隔）</>,
                <><Strong>编程方式</Strong>：Key 格式为 <InlineCode>namespace::key</InlineCode>（由 <InlineCode>RedisUtil.wrapKey()</InlineCode> 拼接）</>,
              ]} />
              <WarnBox>
                两种方式的 Key <Strong>不互通</Strong>，不要混用来读写同一个缓存数据。选择一种方式并保持统一。
              </WarnBox>

              <H3>6.5 序列化器配置</H3>
              <P>Value 序列化器由 <InlineCode>db-redis</InlineCode> 的 <InlineCode>easyfk.config.db.redisson.redis-serializer</InlineCode> 全局控制，可选值为 <InlineCode>RedisValueSerializer</InlineCode> 枚举：</P>
              <DocTable
                headers={["值", "说明"]}
                rows={[
                  [<InlineCode>DEFAULT</InlineCode>, "默认序列化器（SmartRedisSerializer）"],
                  [<InlineCode>FastJSON</InlineCode>, "FastJSON 序列化"],
                  [<InlineCode>KRYO</InlineCode>, "Kryo 序列化"],
                ]}
              />
              <P><Strong>确保缓存对象可被配置的序列化器正确序列化/反序列化。</Strong></P>

              <H3>6.6 缓存空间名称（cacheName）命名规范</H3>
              <P>建议使用<Strong>小写字母 + 短横线</Strong>的命名规范：</P>
              <CodeBlock lang="plaintext">{`✅ 推荐: users, order-details, verify-code, sys-config
❌ 避免: Users, orderDetails, VERIFY_CODE, sys.config`}</CodeBlock>

              {/* ============== 七、性能优化指南 ============== */}
              <H2 id="sec-performance">七、性能优化指南</H2>

              <H3>7.1 合理设置 TTL</H3>
              <CodeBlock lang="plaintext">{`TTL 过短 → 缓存命中率低 → Redis 压力小，数据源压力大
TTL 过长 → 缓存命中率高 → 数据一致性差，内存占用大`}</CodeBlock>
              <H4>推荐 TTL 配置</H4>
              <DocTable
                headers={["数据类型", "推荐 TTL", "说明"]}
                rows={[
                  ["验证码", "5m", "短时效"],
                  ["登录 Token / Session", "2h ~ 24h", "根据安全策略"],
                  ["用户信息", "30m ~ 2h", "变更后主动失效"],
                  ["商品详情", "15m ~ 1h", "取决于更新频率"],
                  ["字典/配置数据", "6h ~ 24h", "几乎不变"],
                  ["统计数据", "5m ~ 30m", "允许短暂延迟"],
                ]}
              />

              <H3>7.2 避免大 Key / 大 Value</H3>
              <BulletList items={[
                <>单个缓存 Value 建议不超过 <Strong>10KB</Strong>，最大不超过 <Strong>1MB</Strong></>,
                "避免将大集合（如 10000+ 条记录的 List）整体缓存",
                "大对象考虑拆分为多个小 Key，或使用 Redis Hash 结构",
              ]} />

              <H3>7.3 批量操作</H3>
              <P>对于需要批量查询的场景，避免循环调用单个 Key 查询，考虑使用 <InlineCode>db-redis</InlineCode> 组件的 Pipeline 或 Multi 操作。</P>

              <H3>7.4 缓存预热</H3>
              <P>对于冷启动后短时间大量请求的场景，建议在应用启动时主动预加载热点数据到缓存：</P>
              <CodeBlock lang="java">{`@Component
public class CacheWarmer implements CommandLineRunner {

    @Resource
    private ICacheService cacheService;

    @Resource
    private DictMapper dictMapper;

    @Override
    public void run(String... args) {
        List<DictDTO> dictList = dictMapper.selectAll();
        dictList.forEach(dict ->
            cacheService.cacheObject(
                dict.getType() + ":" + dict.getCode(),
                dict,
                Duration.ofHours(24),
                "dict"
            )
        );
        log.info("字典缓存预热完成，共 {} 条", dictList.size());
    }
}`}</CodeBlock>

              <H3>7.5 使用独立 Redis 实例</H3>
              <P>生产环境建议缓存使用独立的 Redis 实例（与业务数据分离），通过 <InlineCode>datasource</InlineCode> 配置指向专用实例：</P>
              <BulletList items={[
                "避免缓存淘汰影响业务数据",
                <>缓存 Redis 可使用 <InlineCode>allkeys-lru</InlineCode> 淘汰策略</>,
                <>业务 Redis 使用 <InlineCode>noeviction</InlineCode> 策略保证数据不丢失</>,
              ]} />

              {/* ============== 八、FAQ 常见问题 ============== */}
              <H2 id="sec-faq">八、FAQ 常见问题</H2>

              <H3>Q1: 报错 No qualifying bean of type &lsquo;RedisConnectionManager&rsquo;</H3>
              <P>原因：未配置 <InlineCode>db-redis</InlineCode> 组件的 Redis 数据源。<InlineCode>cache-redis</InlineCode> 依赖 <InlineCode>db-redis</InlineCode> 提供连接管理。</P>
              <P>解决：在 <InlineCode>application.yml</InlineCode> 中添加 <InlineCode>easyfk.config.db.redis.datasource</InlineCode> 配置。</P>

              <H3>Q2: @Cacheable 不生效？</H3>
              <P>常见原因：</P>
              <NumberList items={[
                <><Strong>自调用问题</Strong>：同一个类内部方法 A 调用方法 B，B 上的 <InlineCode>@Cacheable</InlineCode> 不生效（Spring AOP 代理限制）</>,
                <>方法不是 <InlineCode>public</InlineCode> 的</>,
                "方法参数未正确参与 Key 生成",
              ]} />
              <CodeBlock lang="java">{`// 错误：自调用不走代理
@Service
public class UserService {
    public void process() {
        getUserById(1L); // ← 不会走缓存！
    }

    @Cacheable(value = "users", key = "#userId")
    public UserDTO getUserById(Long userId) { ... }
}

// 正确：通过注入自身或拆分到不同 Service
@Service
public class UserService {
    @Resource
    private UserCacheService userCacheService;

    public void process() {
        userCacheService.getUserById(1L); // ← 正常走缓存
    }
}`}</CodeBlock>

              <H3>Q3: 缓存数据更新后还是读到旧数据？</H3>
              <NumberList items={[
                <>确认更新操作是否使用了 <InlineCode>@CachePut</InlineCode> 或 <InlineCode>@CacheEvict</InlineCode></>,
                <>确认注解的 <InlineCode>value</InlineCode> 和 <InlineCode>key</InlineCode> 与查询时一致</>,
                <>如果使用编程式缓存，确认更新后调用了 <InlineCode>removeKey</InlineCode> 或重新 <InlineCode>cacheObject</InlineCode></>,
              ]} />

              <H3>Q4: 如何查看 Redis 中实际的缓存数据？</H3>
              <P>使用 Redis 客户端工具（如 Redis Insight、redis-cli）连接对应实例：</P>
              <CodeBlock lang="bash">{`redis-cli> keys users::*
redis-cli> get users::10001
redis-cli> keys *order*`}</CodeBlock>

              <H3>Q5: 全局 time-to-live 设为 0 是什么效果？</H3>
              <P><InlineCode>time-to-live: 0</InlineCode> 表示<Strong>缓存永不过期</Strong>（需手动失效或等 Redis 内存淘汰），不建议在生产环境使用。建议至少配置一个合理的全局默认值。</P>

              <H3>Q6: cache-redis 和 cache-mult 能同时使用吗？</H3>
              <P>不建议同时引入。两者都会注册 <InlineCode>CacheManager</InlineCode> Bean，可能导致冲突。选择其一：</P>
              <BulletList items={[
                <>只需要 Redis 缓存 → 使用 <InlineCode>cache-redis</InlineCode></>,
                <>需要本地 + Redis 多级缓存 → 使用 <InlineCode>cache-mult</InlineCode></>,
              ]} />

              <H3>Q7: 如何在不同方法中使用不同的缓存空间？</H3>
              <P>直接在注解的 <InlineCode>value</InlineCode> 参数中指定不同的缓存空间名称：</P>
              <CodeBlock lang="java">{`@Cacheable(value = "users", key = "#userId")
public UserDTO getUser(Long userId) { ... }

@Cacheable(value = "products", key = "#productId")
public ProductDTO getProduct(Long productId) { ... }`}</CodeBlock>
              <P>每个缓存空间的 TTL 在 YAML 的 <InlineCode>caches</InlineCode> 列表中独立配置。</P>

              {/* Footer */}
              <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  cache-redis — 分布式缓存，加速数据访问。
                </p>
              </div>

    </DocLayout>
  )
}
