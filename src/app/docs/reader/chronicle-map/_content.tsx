"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong, Highlight } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-dep", label: "依赖引入" },
  { id: "sec-principle", label: "工作原理" },
  { id: "sec-autoconfig", label: "自动配置" },
  { id: "sec-config", label: "配置说明" },
  { id: "sec-usage", label: "使用指南" },
  { id: "sec-capacity", label: "容量规划" },
  { id: "sec-persistence", label: "持久化与恢复" },
  { id: "sec-best", label: "最佳实践" },
]

export default function ChronicleMapDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Chronicle Map"
      title="easyfk-chronicle-map Chronicle Map"
      subtitle="Chronicle Map — 堆外高性能键值存储"
      readingTime="~10 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>chronicle-map</InlineCode> 是 EasyFK 框架中基于 Chronicle Map 的高性能堆外键值存储组件。Chronicle Map 是一个开源的嵌入式键值存储引擎，数据存储在堆外内存（Off-Heap），不受 JVM GC 影响，同时支持<Strong>文件持久化</Strong>，进程重启后数据可自动恢复。
              </P>
              <P>
                该模块提供了完整的自动配置、类型安全的 Map 管理器和便捷的操作模板，开发者只需通过 YAML 配置即可创建和使用高性能键值存储，适用于本地缓存、会话存储、配置中心、计数器等场景。
              </P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-dep">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>chronicle-map</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:chronicle-map'
}`}</CodeBlock>

              <TipBox>
                版本号由框架统一 BOM 管理，无需手动指定。
              </TipBox>

              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={[
                <><InlineCode key="cm">net.openhft:chronicle-map</InlineCode> — Chronicle Map 核心库</>,
              ]} />

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-principle">3. 工作原理</H2>
              <P>Chronicle Map 基于内存映射文件（Memory-Mapped File）技术，将数据存储在堆外内存中：</P>
              <CodeBlock lang="plaintext">{`┌─────────────────────────────────────────────────┐
│                  应用业务层                       │
│  ChronicleMapTemplate.put / get / remove         │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  ChronicleMapManager（Map 管理器）                │
│  · 类型安全校验 · 读写锁优化 · 懒加载创建        │
│  · 类型验证缓存 · 类型化包装器缓存               │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  Chronicle Map（堆外键值存储引擎）                │
│  · 堆外内存（Off-Heap）· 零 GC 影响             │
│  · 内存映射文件 · 持久化 / 恢复                  │
│  · 多线程并发安全 · 亚微秒级读写                 │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  文件系统（可选持久化）                           │
│  ./chronicle-maps/mapName.dat                    │
└─────────────────────────────────────────────────┘`}</CodeBlock>
              <BulletList items={[
                <><Strong>堆外存储</Strong>：数据不在 JVM 堆内，不会触发 GC，适合大容量缓存</>,
                <><Strong>内存映射文件</Strong>：通过 <InlineCode>mmap</InlineCode> 将文件映射到内存，读写性能接近内存操作</>,
                <><Strong>持久化支持</Strong>：数据可持久化到文件，进程重启后通过 <InlineCode>recoverPersistedTo</InlineCode> 自动恢复</>,
                <><Strong>多线程安全</Strong>：Chronicle Map 内部保证线程安全，无需外部加锁</>,
              ]} />

              {/* ============== 4. 自动配置 ============== */}
              <H2 id="sec-autoconfig">4. 自动配置</H2>
              <P>模块通过 Spring Boot 自动配置机制注册以下 Bean：</P>
              <DocTable
                headers={["Bean", "类型", "条件", "说明"]}
                rows={[
                  ["ChronicleMapManager", "Manager", "@ConditionalOnMissingBean + @Lazy", "Map 管理器，懒加载初始化"],
                  ["ChronicleMapTemplate", "Template", "@ConditionalOnMissingBean", "操作模板，依赖 Manager"],
                ]}
              />
              <TipBox>
                <Strong>懒加载</Strong>：<InlineCode>ChronicleMapManager</InlineCode> 使用 <InlineCode>@Lazy</InlineCode> 注解，只在首次使用时初始化，避免启动时不必要的资源消耗。
              </TipBox>
              <H4>自动配置流程</H4>
              <NumberList items={[
                <>读取 <InlineCode>easyfk.config.chronicle.map</InlineCode> 前缀的配置属性</>,
                <>创建 <InlineCode>ChronicleMapManager</InlineCode> 实例</>,
                <>遍历 <InlineCode>maps</InlineCode> 配置列表，为每个预定义的 Map 创建 Chronicle Map 实例并注册</>,
                <>创建 <InlineCode>ChronicleMapTemplate</InlineCode> 实例</>,
              ]} />

              {/* ============== 5. 配置说明 ============== */}
              <H2 id="sec-config">5. 配置说明</H2>

              <H3>5.1 全局配置属性</H3>
              <P>配置前缀：<InlineCode>easyfk.config.chronicle.map</InlineCode></P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["default-path", "String", "./chronicle-maps", "默认存储目录"],
                  ["default-max-entries", "long", "100000", "默认最大条目数"],
                  ["default-average-key-size", "double", "64.0", "默认平均键大小（字节）"],
                  ["default-average-value-size", "double", "1024.0", "默认平均值大小（字节）"],
                  ["default-file-extension", "String", ".dat", "默认持久化文件扩展名"],
                  ["persistence-enabled", "boolean", "true", "是否启用持久化"],
                  ["recover-on-startup", "boolean", "true", "启动时是否恢复数据"],
                  ["compression-enabled", "boolean", "false", "是否启用压缩"],
                  ["apply-average-sizes", "boolean", "true", "是否应用平均大小参数"],
                  ["fixed-size-optimization-enabled", "boolean", "true", "是否启用固定尺寸类型优化"],
                ]}
              />

              <H3>5.2 预定义 Map 配置</H3>
              <P>通过 <InlineCode>maps</InlineCode> 列表预定义需要在启动时创建的 Chronicle Map：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        default-path: ./chronicle-maps
        default-max-entries: 100000
        default-average-key-size: 64
        default-average-value-size: 1024
        persistence-enabled: true
        maps:
          - map-name: userCache
            max-entries: 50000
            average-key-size: 32
            average-value-size: 512
            persistence-enabled: true
            key-type: java.lang.String
            value-type: java.lang.Object
          - map-name: sessionStore
            max-entries: 10000
            average-key-size: 64
            average-value-size: 2048
            persistence-enabled: true
          - map-name: counterMap
            max-entries: 1000
            key-type: java.lang.String
            value-type: java.lang.Long
            persistence-enabled: false`}</CodeBlock>

              <H3>5.3 单个 Map 配置项</H3>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["map-name", "String", "必填", "Map 名称，全局唯一标识"],
                  ["file-path", "String", "自动生成", "持久化文件路径，未配置时按 defaultPath/mapName.ext 生成"],
                  ["max-entries", "Long", "使用全局默认", "最大条目数"],
                  ["average-key-size", "Double", "使用全局默认", "平均键大小（字节）"],
                  ["average-value-size", "Double", "使用全局默认", "平均值大小（字节）"],
                  ["persistence-enabled", "boolean", "true", "是否启用持久化"],
                  ["compression-enabled", "boolean", "false", "是否启用压缩"],
                  ["key-type", "Class", "String.class", "键的 Java 类型"],
                  ["value-type", "Class", "Object.class", "值的 Java 类型"],
                  ["file-extension", "String", "使用全局默认", "文件扩展名"],
                  ["apply-average-sizes", "Boolean", "使用全局默认", "是否应用平均大小参数"],
                  ["fixed-size-optimization-enabled", "Boolean", "使用全局默认", "是否启用固定尺寸类型优化"],
                ]}
              />
              <TipBox>
                <Strong>固定尺寸类型优化</Strong>：当 key 或 value 类型为 <InlineCode>Long</InlineCode>、<InlineCode>Integer</InlineCode>、<InlineCode>Double</InlineCode> 等基本类型包装类时，Chronicle Map 已知其精确大小，无需设置 <InlineCode>averageKeySize</InlineCode> / <InlineCode>averageValueSize</InlineCode>，启用该优化可自动跳过。
              </TipBox>

              {/* ============== 6. 使用指南 ============== */}
              <H2 id="sec-usage">6. 使用指南</H2>

              <H3>6.1 使用 ChronicleMapTemplate（推荐）</H3>
              <P><InlineCode>ChronicleMapTemplate</InlineCode> 提供简洁的 API，适合大部分使用场景：</P>
              <CodeBlock lang="java">{`@Service
public class UserCacheService {

    @Autowired
    private ChronicleMapTemplate chronicleMapTemplate;

    private static final String MAP_NAME = "userCache";

    // 存储
    public void cacheUser(String userId, UserDTO user) {
        chronicleMapTemplate.put(MAP_NAME, userId, user);
    }

    // 获取
    public UserDTO getUser(String userId) {
        return (UserDTO) chronicleMapTemplate.get(MAP_NAME, userId);
    }

    // 获取（带默认值）
    public UserDTO getUserOrDefault(String userId, UserDTO defaultUser) {
        return (UserDTO) chronicleMapTemplate.getOrDefault(MAP_NAME, userId, defaultUser);
    }

    // 不存在时才存储
    public void cacheIfAbsent(String userId, UserDTO user) {
        chronicleMapTemplate.putIfAbsent(MAP_NAME, userId, user);
    }

    // 删除
    public void removeUser(String userId) {
        chronicleMapTemplate.remove(MAP_NAME, userId);
    }

    // 检查是否存在
    public boolean exists(String userId) {
        return chronicleMapTemplate.containsKey(MAP_NAME, userId);
    }

    // 获取缓存大小
    public long cacheSize() {
        return chronicleMapTemplate.size(MAP_NAME);
    }
}`}</CodeBlock>

              <H3>6.2 批量操作</H3>
              <CodeBlock lang="java">{`// 批量存储
Map<String, Object> batch = new HashMap<>();
batch.put("user:1001", user1);
batch.put("user:1002", user2);
batch.put("user:1003", user3);
chronicleMapTemplate.putAll("userCache", batch);

// 获取所有键
Set<String> keys = chronicleMapTemplate.keySet("userCache");

// 获取所有值
Collection<Object> values = chronicleMapTemplate.values("userCache");

// 获取所有键值对
Set<Map.Entry<String, Object>> entries = chronicleMapTemplate.entrySet("userCache");

// 清空
chronicleMapTemplate.clear("userCache");`}</CodeBlock>

              <H3>6.3 计算操作</H3>
              <CodeBlock lang="java">{`// 如果键不存在，计算并存储
Object value = chronicleMapTemplate.computeIfAbsent("configCache", "db.url",
    key -> loadConfigFromDB(key));

// 如果键存在，重新计算
chronicleMapTemplate.computeIfPresent("counterMap", "loginCount",
    (key, oldValue) -> (Long) oldValue + 1);`}</CodeBlock>

              <H3>6.4 强类型操作</H3>
              <P>对于已知类型的 Map，使用强类型 API 避免类型转换：</P>
              <CodeBlock lang="java">{`@Service
public class CounterService {

    @Autowired
    private ChronicleMapTemplate chronicleMapTemplate;

    private static final String MAP_NAME = "counterMap";

    // 强类型存储
    public void setCounter(String name, Long value) {
        chronicleMapTemplate.put(MAP_NAME, String.class, Long.class, name, value);
    }

    // 强类型获取
    public Long getCounter(String name) {
        return chronicleMapTemplate.get(MAP_NAME, String.class, Long.class, name);
    }

    // 强类型批量存储
    public void setCounters(Map<String, Long> counters) {
        chronicleMapTemplate.putAll(MAP_NAME, String.class, Long.class, counters);
    }

    // 强类型原子计算
    public Long incrementCounter(String name) {
        return chronicleMapTemplate.computeIfPresent(MAP_NAME, String.class, Long.class,
            name, (k, v) -> v + 1);
    }
}`}</CodeBlock>

              <H3>6.5 使用 ChronicleMapManager（高级）</H3>
              <P>需要更精细控制时，可直接使用 <InlineCode>ChronicleMapManager</InlineCode>：</P>
              <CodeBlock lang="java">{`@Service
public class DynamicMapService {

    @Autowired
    private ChronicleMapManager chronicleMapManager;

    // 动态创建 Map
    public void createMap(String mapName) {
        chronicleMapManager.getOrCreateMap(mapName, String.class, String.class);
    }

    // 带自定义配置创建
    public void createCustomMap(String mapName) {
        chronicleMapManager.getOrCreateMap(mapName,
            50000,   // maxEntries
            32.0,    // avgKeySize
            256.0,   // avgValueSize
            "./data/" + mapName + ".dat"  // filePath
        );
    }

    // 检查 Map 是否存在
    public boolean mapExists(String mapName) {
        return chronicleMapManager.containsMap(mapName);
    }

    // 获取所有 Map 名称
    public Set<String> listMaps() {
        return chronicleMapManager.getMapNames();
    }

    // 获取统计信息
    public String getStats(String mapName) {
        return chronicleMapManager.getMapStats(mapName);
    }

    // 移除并关闭 Map
    public void removeMap(String mapName) {
        chronicleMapManager.removeMap(mapName);
    }

    // 关闭所有 Map（应用关闭时）
    public void shutdown() {
        chronicleMapManager.closeAll();
    }
}`}</CodeBlock>

              <H3>6.6 Map 管理操作</H3>
              <CodeBlock lang="java">{`// 检查 Map 是否存在
boolean exists = chronicleMapTemplate.mapExists("userCache");

// 获取所有 Map 名称
Set<String> mapNames = chronicleMapTemplate.getAllMapNames();

// 获取统计信息
String stats = chronicleMapTemplate.getStats("userCache");`}</CodeBlock>

              {/* ============== 7. 容量规划 ============== */}
              <H2 id="sec-capacity">7. 容量规划</H2>
              <P>Chronicle Map 需要在创建时预估数据规模，合理的容量规划对性能至关重要：</P>

              <H3>7.1 maxEntries（最大条目数）</H3>
              <BulletList items={[
                "设置预期的最大键值对数量",
                <><Highlight>建议按预期峰值的 1.5 ~ 2 倍配置</Highlight>，留有余量</>,
                "超过 maxEntries 后仍可写入，但性能会下降",
              ]} />

              <H3>7.2 averageKeySize / averageValueSize（平均大小）</H3>
              <BulletList items={[
                <>对于 <InlineCode>String</InlineCode> 类型的 key，按平均字符串长度估算字节数</>,
                "对于序列化对象的 value，按序列化后的平均字节数估算",
                "估算偏小会导致频繁 resize，估算偏大会浪费内存",
              ]} />

              <H3>7.3 示例</H3>
              <DocTable
                headers={["场景", "maxEntries", "avgKeySize", "avgValueSize"]}
                rows={[
                  ["用户信息缓存", "100,000", "32", "512"],
                  ["会话存储", "10,000", "64", "2048"],
                  ["配置中心", "1,000", "64", "256"],
                  ["计数器", "10,000", "32", "8（Long）"],
                  ["限流令牌桶", "50,000", "64", "128"],
                ]}
              />

              {/* ============== 8. 持久化与恢复 ============== */}
              <H2 id="sec-persistence">8. 持久化与恢复</H2>

              <H3>8.1 持久化模式</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        persistence-enabled: true    # 全局启用持久化
        default-path: ./chronicle-maps`}</CodeBlock>
              <BulletList items={[
                "启用持久化后，数据自动写入磁盘文件",
                <>进程重启时通过 <InlineCode>recoverPersistedTo</InlineCode> 自动恢复数据</>,
                <>数据文件默认存储在 <InlineCode>./chronicle-maps/</InlineCode> 目录下</>,
              ]} />

              <H3>8.2 纯内存模式</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        persistence-enabled: false   # 纯内存模式`}</CodeBlock>
              <BulletList items={[
                "纯内存模式下不创建持久化文件",
                "进程重启后数据丢失",
                "适合临时缓存、计数器等不需要持久化的场景",
              ]} />

              <H3>8.3 混合模式</H3>
              <P>可以为不同的 Map 分别设置持久化策略：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    chronicle:
      map:
        persistence-enabled: true
        maps:
          - map-name: importantData
            persistence-enabled: true    # 重要数据持久化
          - map-name: tempCache
            persistence-enabled: false   # 临时缓存不持久化`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-best">9. 最佳实践</H2>
              <NumberList items={[
                <><Strong>容量预估</Strong>：创建 Map 时合理估算 <InlineCode>maxEntries</InlineCode>、<InlineCode>averageKeySize</InlineCode>、<InlineCode>averageValueSize</InlineCode>，避免频繁 resize 或内存浪费。</>,
                <><Strong>类型安全</Strong>：使用强类型 API（传入 <InlineCode>keyType</InlineCode> / <InlineCode>valueType</InlineCode>），避免运行时类型转换错误。</>,
                <><Strong>预定义 Map</Strong>：常用的 Map 通过 YAML 配置预定义，应用启动时自动创建，避免首次访问时的创建延迟。</>,
                <><Strong>持久化策略</Strong>：重要数据启用持久化，临时缓存使用纯内存模式，按需选择。</>,
                <><Strong>Serializable</Strong>：存储的对象需实现 <InlineCode>Serializable</InlineCode> 接口，确保可序列化。</>,
                <><Strong>资源清理</Strong>：应用关闭时调用 <InlineCode>ChronicleMapManager.closeAll()</InlineCode> 关闭所有 Map，释放堆外内存。</>,
                <><Strong>固定尺寸优化</Strong>：对于 <InlineCode>Long</InlineCode>、<InlineCode>Integer</InlineCode> 等基本类型，启用 <InlineCode>fixed-size-optimization-enabled</InlineCode> 可跳过不必要的平均大小设置。</>,
                <><Strong>避免超大 Value</Strong>：Chronicle Map 适合存储中小型数据，超大对象（&gt;1MB）建议使用文件存储或对象存储。</>,
                <><Strong>监控统计</Strong>：通过 <InlineCode>getStats()</InlineCode> 定期监控 Map 的大小和健康状态。</>,
                <><Strong>动态创建</Strong>：运行时通过 <InlineCode>ChronicleMapManager.getOrCreateMap()</InlineCode> 动态创建 Map，自动处理持久化文件和类型注册。</>,
              ]} /><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-chronicle-map — 堆外高性能键值存储，突破 JVM 内存限制。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
