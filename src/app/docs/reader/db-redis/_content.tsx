"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, H4, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "参数对象体系" },
  { id: "sec-4", label: "数据操作 API" },
  { id: "sec-5", label: "发布订阅" },
  { id: "sec-6", label: "实战示例" },
  { id: "sec-7", label: "自动配置机制" },
  { id: "sec-8", label: "包结构" },
  { id: "sec-9", label: "最佳实践" },
]

export default function DbRedisDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Redis"
      title="easyfk-db-redis Redis"
      subtitle="Redis 数据库 — 高性能键值存储"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>db-redis</InlineCode> 是 EasyFK 框架中面向 Redis 的高级数据访问组件。该模块基于 Spring Data Redis，提供动态多数据源管理、多种部署模式（单机/集群/哨兵）、可插拔序列化策略、完整的五大数据结构操作（K-V、Hash、List、Set、ZSet）、Pipeline/事务/Lua 脚本执行，以及带重试机制的发布订阅能力，是 EasyFK 框架 Redis 集成的核心基础设施。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>db-redis</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:db-redis'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-boot-starter-data-redis` — Spring Data Redis 数据访问支持", "`easyfk-core` — EasyFK 框架核心工具类和 DTO", "`easyfk-thread` — EasyFK 线程池管理", "`kryo` — 高性能二进制序列化", "`commons-pool2` — 连接池支持", "`jackson-datatype-jsr310` — Java 8 时间类型序列化"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 配置模式</H3>
              <P>模块支持两种配置模式，通过 <InlineCode>enable-dynamic</InlineCode> 属性切换：</P>

              <DocTable
                headers={["模式", "属性值", "说明"]}
                rows={[
                  ["简单模式", <InlineCode>false</InlineCode>, "使用 Spring Boot 默认 Redis 配置，适合单数据源场景"],
                  ["动态模式", <InlineCode>true</InlineCode>, "支持多数据源、多数据库隔离配置，适合复杂业务场景"],
                ]}
              />

              <H3>3.2 简单模式配置</H3>
              <P>简单模式下使用 Spring Boot 标准 Redis 配置：</P>
              <CodeBlock lang="yaml">{`spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: your_password
      database: 0

easyfk:
  config:
    db:
      redis:
        enable-dynamic: false
        redis-serializer: DEFAULT`}</CodeBlock>

              <H3>3.3 动态多数据源配置</H3>
              <P>动态模式下通过 <InlineCode>easyfk.config.db.redis</InlineCode> 前缀进行配置：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    db:
      redis:
        enable-dynamic: true
        default-data-source: primary
        redis-serializer: DEFAULT
        datasource:
          primary:
            host: 192.168.1.100
            port: 6379
            password: password1
            database: 0
            databases:
              cache: 1
              session: 2
              business: 0
            pool:
              max-active: 32
              max-idle: 16
              min-idle: 4
              max-wait: 1s
          secondary:
            host: 192.168.1.200
            port: 6379
            password: password2
            database: 0`}</CodeBlock>

              <H3>3.4 集群模式配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    db:
      redis:
        enable-dynamic: true
        default-data-source: cluster
        datasource:
          cluster:
            password: password
            cluster:
              nodes:
                - 192.168.1.100:7000
                - 192.168.1.100:7001
                - 192.168.1.100:7002
                - 192.168.1.101:7000
                - 192.168.1.101:7001
                - 192.168.1.101:7002
              max-redirects: 3
              topology-refresh: true
              topology-refresh-period: 30s
              adaptive-refresh: true`}</CodeBlock>
              <P>&gt; 集群模式仅支持 database 0，<InlineCode>databases</InlineCode> 配置项无效。</P>

              <H3>3.5 哨兵模式配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    db:
      redis:
        enable-dynamic: true
        default-data-source: sentinel
        datasource:
          sentinel:
            password: password
            database: 0
            sentinel:
              master: mymaster
              nodes:
                - 192.168.1.100:26379
                - 192.168.1.101:26379
                - 192.168.1.102:26379
              sentinel-password: sentinel_password`}</CodeBlock>

              <H3>3.6 配置属性参考</H3>
              <H4>{'数据源配置（`datasource.{name}`）'}</H4>

              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  [<InlineCode>host</InlineCode>, "String", <InlineCode>localhost</InlineCode>, "Redis 服务器地址"],
                  [<InlineCode>port</InlineCode>, "Integer", <InlineCode>6379</InlineCode>, "Redis 服务器端口"],
                  [<InlineCode>database</InlineCode>, "Integer", <InlineCode>0</InlineCode>, "默认数据库索引（0-15）"],
                  [<InlineCode>databases</InlineCode>, "Map", "—", "多数据库配置（别名 → 索引），如 cache: 1"],
                  [<InlineCode>password</InlineCode>, "String", "—", "连接密码"],
                  [<InlineCode>timeout</InlineCode>, "Duration", <InlineCode>2000ms</InlineCode>, "连接超时时间"],
                  [<InlineCode>ssl</InlineCode>, "Boolean", <InlineCode>false</InlineCode>, "是否启用 SSL"],
                ]}
              />
              <H4>{'连接池配置（`datasource.{name}.pool`）'}</H4>

              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  [<InlineCode>max-active</InlineCode>, "Integer", <InlineCode>32</InlineCode>, "最大连接数"],
                  [<InlineCode>max-idle</InlineCode>, "Integer", <InlineCode>16</InlineCode>, "最大空闲连接数"],
                  [<InlineCode>min-idle</InlineCode>, "Integer", <InlineCode>4</InlineCode>, "最小空闲连接数"],
                  [<InlineCode>max-wait</InlineCode>, "Duration", <InlineCode>1s</InlineCode>, "获取连接最大等待时间"],
                  [<InlineCode>test-on-borrow</InlineCode>, "Boolean", <InlineCode>false</InlineCode>, "获取连接时是否验证"],
                  [<InlineCode>test-while-idle</InlineCode>, "Boolean", <InlineCode>true</InlineCode>, "空闲时是否验证连接"],
                  [<InlineCode>time-between-eviction-runs</InlineCode>, "Duration", <InlineCode>30s</InlineCode>, "空闲连接检测间隔"],
                ]}
              />

              <H3>3.7 序列化器选择</H3>
              <P>通过 <InlineCode>redis-serializer</InlineCode> 配置序列化策略：</P>

              <DocTable
                headers={["值", "说明", "适用场景"]}
                rows={[
                  [<InlineCode>DEFAULT</InlineCode>, "Jackson 序列化（含多态类型和 Java 8 时间支持）", "通用场景，可读性好"],
                  [<InlineCode>FastJSON</InlineCode>, "Alibaba FastJSON2 序列化", "追求序列化速度"],
                  [<InlineCode>KRYO</InlineCode>, "Kryo 高性能二进制序列化", "追求极致性能，不关心可读性"],
                ]}
              />
              <P>&gt; 模块内置 <InlineCode>SmartRedisSerializer</InlineCode> 智能序列化器，自动检测数据格式（字符串/JSON/二进制），兼容历史数据。</P>

              {/* ============== 4. 参数对象体系 ============== */}
              <H2 id="sec-3">4. 参数对象体系</H2>
              <P>所有 Redis 操作通过类型安全的参数对象传递上下文，通过 <InlineCode>RedisArgsHelper</InlineCode> 统一创建：</P>

              <H3>4.1 参数对象层级</H3>
              <CodeBlock lang="plaintext">{`DsAndDbArgs          — 数据源 + 数据库名称
  └─ NamespaceArgs   — + 命名空间
      └─ KeyArgs     — + 键名`}</CodeBlock>

              <DocTable
                headers={["参数类型", "包含信息", "使用场景"]}
                rows={[
                  [<InlineCode>DsAndDbArgs</InlineCode>, "datasource, databaseName", "Pipeline、事务等不指定 key 的操作"],
                  [<InlineCode>NamespaceArgs</InlineCode>, "datasource, databaseName, namespace", "批量操作、事务、Lua 脚本等"],
                  [<InlineCode>KeyArgs</InlineCode>, "datasource, databaseName, namespace, key", "单键 K-V、Hash、List、Set、ZSet 操作"],
                ]}
              />

              <H3>4.2 创建参数对象</H3>
              <CodeBlock lang="java">{`@Resource
private RedisArgsHelper redisArgsHelper;

// 方式一：通过业务名称创建（自动查找配置的数据源和数据库）
KeyArgs args = redisArgsHelper.createKeyArgs("bizName", "myKey", "myNamespace");

// 方式二：直接指定数据源、数据库、命名空间和键
KeyArgs args = redisArgsHelper.createKeyArgs("primary", "cache", "myKey", "myNamespace");

// 创建命名空间参数
NamespaceArgs nsArgs = redisArgsHelper.createNamespaceArgs("primary", "cache", "myNamespace");

// 创建数据源参数
DsAndDbArgs dsArgs = redisArgsHelper.createDsAndDbArgs("primary", "cache");`}</CodeBlock>

              <H3>4.3 命名空间机制</H3>
              <P>所有 key 操作自动添加命名空间前缀，格式为 <InlineCode>{'{namespace}:{key}'}</InlineCode>，实现 key 隔离，避免业务间冲突。</P>

              {/* ============== 5. 数据操作 API ============== */}
              <H2 id="sec-4">5. 数据操作 API</H2>

              <H3>5.1 注入 RedisOptManager</H3>
              <CodeBlock lang="java">{`@Service
public class MyService {

    @Resource
    private RedisOptManager redisOptManager;

    @Resource
    private RedisArgsHelper redisArgsHelper;
}`}</CodeBlock>

              <H3>5.2 全局键操作</H3>

              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>getKeys(pattern, args)</InlineCode>, "模式, KeyArgs", <InlineCode>{"Set<String>"}</InlineCode>, "按模式匹配获取所有键"],
                  [<InlineCode>existKey(args)</InlineCode>, "KeyArgs", <InlineCode>boolean</InlineCode>, "检查键是否存在"],
                  [<InlineCode>deleteKey(args)</InlineCode>, "KeyArgs", <InlineCode>{"BaseResult<?>"}</InlineCode>, "删除键"],
                  [<InlineCode>expireKey(args, duration)</InlineCode>, "KeyArgs, Duration", <InlineCode>void</InlineCode>, "设置过期时间"],
                  [<InlineCode>expireKeyAt(args, date)</InlineCode>, "KeyArgs, Date", <InlineCode>void</InlineCode>, "设置在指定时间点过期"],
                  [<InlineCode>getKeyExpire(args)</InlineCode>, "KeyArgs", <InlineCode>long</InlineCode>, "获取过期时间（秒）"],
                  [<InlineCode>autoId(args)</InlineCode>, "KeyArgs", <InlineCode>Long</InlineCode>, "自动递增 ID"],
                  [<InlineCode>autoIdByExpire(args, duration)</InlineCode>, "KeyArgs, Duration", <InlineCode>Long</InlineCode>, "带过期时间的自动递增 ID"],
                ]}
              />

              <H3>5.3 K-V 操作</H3>

              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>putObject(args, value)</InlineCode>, "KeyArgs, Object", <InlineCode>{"BaseResult<?>"}</InlineCode>, "存储对象"],
                  [<InlineCode>putObject(args, value, duration)</InlineCode>, "KeyArgs, Object, Duration", <InlineCode>{"BaseResult<?>"}</InlineCode>, "存储对象并设过期时间"],
                  [<InlineCode>getObject(args)</InlineCode>, "KeyArgs", <InlineCode>{"<T>"}</InlineCode>, "获取对象"],
                  [<InlineCode>multiSetForValue(map, args)</InlineCode>, "Map, NamespaceArgs", <InlineCode>{"BaseResult<?>"}</InlineCode>, "批量设置"],
                  [<InlineCode>multiSetIfNotExistsForValue(map, args)</InlineCode>, "Map, NamespaceArgs", <InlineCode>{"BaseResult<?>"}</InlineCode>, "批量设置（仅全部不存在时，原子操作）"],
                  [<InlineCode>multiGetForValue(keys, args)</InlineCode>, "List, NamespaceArgs", <InlineCode>{"List<T>"}</InlineCode>, "批量获取"],
                ]}
              />

              <H3>5.4 Hash 操作</H3>

              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>putValueToHash(args, hashKey, obj)</InlineCode>, "KeyArgs, String, Object", <InlineCode>{"BaseResult<?>"}</InlineCode>, "存储单个字段值"],
                  [<InlineCode>putObjectToHash(args, obj)</InlineCode>, "KeyArgs, Object", <InlineCode>{"BaseResult<?>"}</InlineCode>, "将 Java 对象存储为 Hash"],
                  [<InlineCode>putMapToHash(args, map)</InlineCode>, "KeyArgs, Map", <InlineCode>{"BaseResult<?>"}</InlineCode>, "将 Map 存储为 Hash"],
                  [<InlineCode>getValueFromHash(args, hashKey)</InlineCode>, "KeyArgs, String", <InlineCode>{"<T>"}</InlineCode>, "获取单个字段值"],
                  [<InlineCode>getMapFromHash(args)</InlineCode>, "KeyArgs", <InlineCode>{"Map<String, Object>"}</InlineCode>, "获取整个 Hash 为 Map"],
                  [<InlineCode>getObjectFromHash(args, clazz)</InlineCode>, "KeyArgs, Class", <InlineCode>{"<T>"}</InlineCode>, "获取 Hash 并转为 Java 对象"],
                  [<InlineCode>getAllValuesFromHash(args)</InlineCode>, "KeyArgs", <InlineCode>{"List<Object>"}</InlineCode>, "获取所有字段值"],
                  [<InlineCode>getValuesFromHash(args, hashKeys)</InlineCode>, "KeyArgs, List", <InlineCode>{"List<Object>"}</InlineCode>, "批量获取指定字段值"],
                  [<InlineCode>getHashSize(args)</InlineCode>, "KeyArgs", <InlineCode>Long</InlineCode>, "获取字段数量"],
                  [<InlineCode>existHashKey(args, hashKey)</InlineCode>, "KeyArgs, String", <InlineCode>boolean</InlineCode>, "检查字段是否存在"],
                  [<InlineCode>deleteObjectFromHash(args, hashKeys...)</InlineCode>, "KeyArgs, String...", <InlineCode>{"BaseResult<?>"}</InlineCode>, "删除指定字段"],
                ]}
              />

              <H3>5.5 List 操作</H3>

              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>putObjectToList(args, value)</InlineCode>, "KeyArgs, Object", <InlineCode>{"BaseResult<?>"}</InlineCode>, "尾部添加元素"],
                  [<InlineCode>putObjectsToList(args, values)</InlineCode>, "KeyArgs, List", <InlineCode>{"BaseResult<?>"}</InlineCode>, "批量尾部添加"],
                  [<InlineCode>putObjectToListAtIndex(args, value, index)</InlineCode>, "KeyArgs, Object, long", <InlineCode>{"BaseResult<?>"}</InlineCode>, "指定索引位置设置"],
                  [<InlineCode>getObjectFromList(args, index)</InlineCode>, "KeyArgs, long", <InlineCode>{"<T>"}</InlineCode>, "获取指定索引元素"],
                  [<InlineCode>getAllObjectFromList(args)</InlineCode>, "KeyArgs", <InlineCode>{"List<T>"}</InlineCode>, "获取所有元素"],
                  [<InlineCode>getRangeFromList(args, start, end)</InlineCode>, "KeyArgs, long, long", <InlineCode>{"List<T>"}</InlineCode>, "获取指定范围元素"],
                  [<InlineCode>getPageFromList(args, page, pageSize)</InlineCode>, "KeyArgs, int, int", <InlineCode>{"List<T>"}</InlineCode>, "分页获取"],
                  [<InlineCode>getAndRemoveFirstObjectFromList(args)</InlineCode>, "KeyArgs", <InlineCode>{"<T>"}</InlineCode>, "左端弹出"],
                  [<InlineCode>getAndRemoveLastObjectFromList(args)</InlineCode>, "KeyArgs", <InlineCode>{"<T>"}</InlineCode>, "右端弹出"],
                  [<InlineCode>deleteObjectFromList(args, value)</InlineCode>, "KeyArgs, Object", <InlineCode>{"BaseResult<?>"}</InlineCode>, "删除指定值元素"],
                  [<InlineCode>getListSize(args)</InlineCode>, "KeyArgs", <InlineCode>Long</InlineCode>, "获取列表长度"],
                ]}
              />

              <H3>5.6 Set 操作</H3>

              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>putObjectToSet(args, value)</InlineCode>, "KeyArgs, Object", <InlineCode>{"BaseResult<?>"}</InlineCode>, "添加元素"],
                  [<InlineCode>putObjectsToSet(args, values)</InlineCode>, "KeyArgs, Set", <InlineCode>{"BaseResult<?>"}</InlineCode>, "批量添加"],
                  [<InlineCode>getAllObjectFromSet(args)</InlineCode>, "KeyArgs", <InlineCode>{"Set<T>"}</InlineCode>, "获取所有元素"],
                  [<InlineCode>getSetSize(args)</InlineCode>, "KeyArgs", <InlineCode>Long</InlineCode>, "获取元素数量"],
                  [<InlineCode>objectIsSetMember(args, value)</InlineCode>, "KeyArgs, Object", <InlineCode>Boolean</InlineCode>, "检查元素是否存在"],
                  [<InlineCode>deleteObjectFromSet(args, value...)</InlineCode>, "KeyArgs, Object...", <InlineCode>{"BaseResult<?>"}</InlineCode>, "删除指定元素"],
                ]}
              />

              <H3>5.7 ZSet（有序集合）操作</H3>

              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  [<InlineCode>putObjectToZSet(args, value, score)</InlineCode>, "KeyArgs, Object, double", <InlineCode>{"BaseResult<?>"}</InlineCode>, "添加带分数的元素"],
                  [<InlineCode>{"putObjectsToZSet(args, values)"}</InlineCode>, "KeyArgs, Set<TypedTuple>", <InlineCode>{"BaseResult<?>"}</InlineCode>, "批量添加"],
                  [<InlineCode>getAllObjectFromZSet(args)</InlineCode>, "KeyArgs", <InlineCode>{"Set<T>"}</InlineCode>, "获取所有元素（分数升序）"],
                  [<InlineCode>getZSetSize(args)</InlineCode>, "KeyArgs", <InlineCode>Long</InlineCode>, "获取元素数量"],
                  [<InlineCode>objectIsZSetMember(args, value)</InlineCode>, "KeyArgs, Object", <InlineCode>Boolean</InlineCode>, "检查元素是否存在"],
                  [<InlineCode>getPageFromZSet(args, page, pageSize)</InlineCode>, "KeyArgs, int, int", <InlineCode>{"Set<T>"}</InlineCode>, "分页获取"],
                  [<InlineCode>getRangeFromZSet(args, min, max)</InlineCode>, "KeyArgs, double, double", <InlineCode>{"Set<T>"}</InlineCode>, "按分数范围获取"],
                  [<InlineCode>getRangeFromZSet(args, min, max, page, pageSize)</InlineCode>, "KeyArgs, double, double, int, int", <InlineCode>{"Set<T>"}</InlineCode>, "分数范围+分页获取"],
                  [<InlineCode>deleteObjectFromZSet(args, value...)</InlineCode>, "KeyArgs, Object...", <InlineCode>{"BaseResult<?>"}</InlineCode>, "删除指定元素"],
                ]}
              />

              <H3>5.8 Pipeline 操作</H3>
              <CodeBlock lang="java">{`// 管道批量操作，减少网络往返
List<Object> results = redisOptManager.executePipelined(connection -> {
    connection.stringCommands().set("key1".getBytes(), "value1".getBytes());
    connection.stringCommands().set("key2".getBytes(), "value2".getBytes());
    return null;
}, dsArgs);

// 简化版本
List<Object> results = redisOptManager.executePipelinedSimple(connection -> {
    connection.stringCommands().get("key1".getBytes());
    connection.stringCommands().get("key2".getBytes());
}, dsArgs);`}</CodeBlock>

              <H3>5.9 事务操作</H3>
              <CodeBlock lang="java">{`// 基本事务
List<Object> results = redisOptManager.executeTransaction(operations -> {
    operations.opsForValue().set("key1", "value1");
    operations.opsForValue().set("key2", "value2");
}, nsArgs);

// 带 WATCH 的乐观锁事务
List<Object> results = redisOptManager.executeTransactionWithWatch(
    List.of("watchKey1", "watchKey2"),
    operations -> {
        operations.opsForValue().increment("counter");
    },
    nsArgs
);`}</CodeBlock>

              <H3>5.10 Lua 脚本执行</H3>
              <CodeBlock lang="java">{`// 通用 Lua 脚本执行
String script = "return redis.call('SET', KEYS[1], ARGV[1])";
Object result = redisOptManager.executeLuaScript(
    script,
    List.of("myKey"),
    List.of("myValue"),
    nsArgs
);

// 指定返回类型的 Lua 脚本
Long count = redisOptManager.executeLuaScript(
    "return redis.call('INCR', KEYS[1])",
    Long.class,
    List.of("counter"),
    List.of(),
    nsArgs
);`}</CodeBlock>
              <P>&gt; Lua 脚本中的 KEYS 参数会自动添加命名空间前缀。</P>

              {/* ============== 6. 发布订阅 ============== */}
              <H2 id="sec-5">6. 发布订阅</H2>

              <H3>6.1 注入服务</H3>
              <CodeBlock lang="java">{`@Resource
private IPublishSubscribe publishSubscribe;`}</CodeBlock>

              <H3>6.2 发布消息</H3>
              <CodeBlock lang="java">{`// 发布字符串消息
publishSubscribe.publish("order:created", "orderId:12345");

// 发布对象消息
OrderEvent event = new OrderEvent("12345", "CREATED");
publishSubscribe.publishObject("order:events", event);

// 指定数据源发布
publishSubscribe.publish("order:created", "orderId:12345", "primary");`}</CodeBlock>

              <H3>6.3 订阅消息</H3>
              <CodeBlock lang="java">{`// 订阅频道（字符串消息）
String subId = publishSubscribe.subscribe("order:created", (channel, message) -> {
    log.info("收到消息：channel={}, message={}", channel, message);
});

// 订阅频道（对象消息）
String subId = publishSubscribe.subscribeObject("order:events", (channel, message) -> {
    OrderEvent event = (OrderEvent) message;
    log.info("收到事件：{}", event);
});

// 模式订阅（通配符）
String subId = publishSubscribe.psubscribe("order:*", (channel, message) -> {
    log.info("匹配频道：channel={}, message={}", channel, message);
});

// 取消订阅
publishSubscribe.unsubscribe(subId);
publishSubscribe.unsubscribeChannel("order:created");
publishSubscribe.punsubscribe("order:*");`}</CodeBlock>

              <H3>6.4 消息重试机制</H3>
              <P>发布订阅内置消息重试机制，支持指数退避策略：</P>

              <DocTable
                headers={["配置项", "默认值", "说明"]}
                rows={[
                  [<InlineCode>enabled</InlineCode>, <InlineCode>true</InlineCode>, "是否启用重试"],
                  [<InlineCode>maxRetries</InlineCode>, <InlineCode>3</InlineCode>, "最大重试次数"],
                  [<InlineCode>initialDelay</InlineCode>, <InlineCode>1s</InlineCode>, "初始重试间隔"],
                  [<InlineCode>maxDelay</InlineCode>, <InlineCode>60s</InlineCode>, "最大重试间隔"],
                  [<InlineCode>multiplier</InlineCode>, <InlineCode>2.0</InlineCode>, "间隔倍数（指数退避）"],
                  [<InlineCode>queueSize</InlineCode>, <InlineCode>1000</InlineCode>, "重试队列大小"],
                  [<InlineCode>deadLetterQueueSize</InlineCode>, <InlineCode>100</InlineCode>, "死信队列大小"],
                ]}
              />
              <P>内置三种预设配置：</P>

              <DocTable
                headers={["配置", "说明"]}
                rows={[
                  [<InlineCode>RetryConfig.defaultConfig()</InlineCode>, "默认配置"],
                  [<InlineCode>RetryConfig.highReliabilityConfig()</InlineCode>, "高可靠性（5 次重试，500ms 起步，4 线程）"],
                  [<InlineCode>RetryConfig.fastFailConfig()</InlineCode>, "快速失败（1 次重试，100ms）"],
                ]}
              />

              {/* ============== 7. 实战示例 ============== */}
              <H2 id="sec-6">7. 实战示例</H2>

              <H3>7.1 缓存对象</H3>
              <CodeBlock lang="java">{`@Service
public class UserCacheService {

    @Resource
    private RedisOptManager redisOptManager;

    @Resource
    private RedisArgsHelper redisArgsHelper;

    public void cacheUser(UserDTO user) {
        KeyArgs args = redisArgsHelper.createKeyArgs("primary", "cache", "UserCache", user.getId());
        redisOptManager.putObject(args, user, Duration.ofHours(1));
    }

    public UserDTO getUser(String userId) {
        KeyArgs args = redisArgsHelper.createKeyArgs("primary", "cache", "UserCache", userId);
        return redisOptManager.getObject(args);
    }
}`}</CodeBlock>

              <H3>7.2 Hash 存储实体</H3>
              <CodeBlock lang="java">{`KeyArgs args = redisArgsHelper.createKeyArgs("primary", "cache", "Product", "prod_001");

// 存储对象为 Hash
ProductDTO product = new ProductDTO();
product.setName("iPhone 15");
product.setPrice(7999.0);
redisOptManager.putObjectToHash(args, product);

// 读取 Hash 为对象
ProductDTO result = redisOptManager.getObjectFromHash(args, ProductDTO.class);

// 读取单个字段
Double price = redisOptManager.getValueFromHash(args, "price");`}</CodeBlock>

              <H3>7.3 List 实现消息队列</H3>
              <CodeBlock lang="java">{`KeyArgs args = redisArgsHelper.createKeyArgs("primary", "business", "TaskQueue", "pending");

// 生产者：添加任务
redisOptManager.putObjectToList(args, new Task("task_001", "处理订单"));

// 消费者：弹出任务
Task task = redisOptManager.getAndRemoveFirstObjectFromList(args);`}</CodeBlock>

              <H3>7.4 ZSet 实现排行榜</H3>
              <CodeBlock lang="java">{`KeyArgs args = redisArgsHelper.createKeyArgs("primary", "business", "Leaderboard", "daily");

// 添加分数
redisOptManager.putObjectToZSet(args, "player_001", 1500.0);
redisOptManager.putObjectToZSet(args, "player_002", 2200.0);
redisOptManager.putObjectToZSet(args, "player_003", 1800.0);

// 获取 Top 10
Set<Object> top10 = redisOptManager.getPageFromZSet(args, 1, 10);

// 按分数范围查询
Set<Object> range = redisOptManager.getRangeFromZSet(args, 1000.0, 2000.0);`}</CodeBlock>

              <H3>7.5 Lua 脚本实现分布式锁</H3>
              <CodeBlock lang="java">{`NamespaceArgs nsArgs = redisArgsHelper.createNamespaceArgs("primary", "cache", "Lock");

// 加锁
String lockScript = """
    if redis.call('SETNX', KEYS[1], ARGV[1]) == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[2])
        return 1
    end
    return 0
    """;
Long acquired = redisOptManager.executeLuaScript(
    lockScript, Long.class,
    List.of("order:lock"),
    List.of("requestId_123", "30"),
    nsArgs
);

// 释放锁
String unlockScript = """
    if redis.call('GET', KEYS[1]) == ARGV[1] then
        return redis.call('DEL', KEYS[1])
    end
    return 0
    """;
redisOptManager.executeLuaScript(
    unlockScript, Long.class,
    List.of("order:lock"),
    List.of("requestId_123"),
    nsArgs
);`}</CodeBlock>

              {/* ============== 8. 自动配置机制 ============== */}
              <H2 id="sec-7">8. 自动配置机制</H2>

              <DocTable
                headers={["配置类", "条件", "说明"]}
                rows={[
                  [<InlineCode>RedisDbConfig</InlineCode>, "—", "自动配置入口，注册 RedisConnectionManager、RedisOptManager、RedisArgsHelper"],
                  [<InlineCode>DynamicRedisConfig</InlineCode>, <InlineCode>enable-dynamic = true</InlineCode>, "动态多数据源模式配置"],
                  [<InlineCode>SimpleRedisConfig</InlineCode>, <InlineCode>enable-dynamic = false</InlineCode>, "简单模式，使用 Spring Boot 默认配置"],
                  [<InlineCode>PubSubConfig</InlineCode>, "—", "发布订阅基础设施和重试机制配置"],
                ]}
              />
              <BulletList items={["通过 Spring Boot `AutoConfiguration.imports` 声明自动配置入口", "动态模式下自动阻止 Spring Boot 默认 Redis 自动配置，避免数据源冲突", "简单模式下复用 Spring Boot 默认 `RedisConnectionFactory`，应用自定义序列化策略"]} />

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-8">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.db.redis
├── config
│   ├── DynamicRedisConfig.java           # 动态多数据源配置
│   ├── SimpleRedisConfig.java            # 简单模式配置
│   ├── PubSubConfig.java                 # 发布订阅配置
│   └── RedisDbConfig.java               # 配置入口
├── constants
│   ├── RedisConstants.java               # 常量定义
│   └── RedisValueSerializer.java         # 序列化器类型枚举
├── factory
│   └── ConnectionFactoryBuilder.java     # 连接工厂构建器（单机/集群/哨兵）
├── helper
│   ├── RedisConfigHelper.java            # 配置辅助类
│   └── RedisConfigValidator.java         # 配置验证器
├── manager
│   ├── RedisConnectionManager.java       # 连接与模板管理器
│   └── RedisOptManager.java             # Redis 操作管理器（核心 API）
├── param
│   ├── DsAndDbArgs.java                  # 数据源+数据库参数
│   ├── NamespaceArgs.java                # 命名空间参数
│   ├── KeyArgs.java                      # 键参数
│   └── RedisArgsHelper.java             # 参数创建辅助类
├── properties
│   ├── RedisProperties.java              # Redis 配置属性（含连接池/集群/哨兵/SSL）
│   ├── BizDbProperties.java              # 业务数据库映射属性
│   └── PushSubProperties.java            # 发布订阅属性
├── pubsub
│   ├── IPublishSubscribe.java            # 发布订阅接口
│   ├── IMessageListener.java             # 消息监听器接口
│   ├── PublishSubscribeImpl.java          # 发布订阅实现
│   ├── SubscriptionManager.java          # 订阅管理器
│   └── retry
│       ├── RetryConfig.java              # 重试配置
│       ├── RetryableMessage.java          # 可重试消息
│       ├── MessageRetryManager.java       # 消息重试管理器
│       ├── DeadLetterCleanupConfig.java   # 死信队列清理配置
│       └── DeadLetterCleanupManager.java  # 死信队列清理管理器
├── serializer
│   ├── SmartRedisSerializer.java          # 智能序列化器（自适应格式检测）
│   ├── FastJson2RedisSerializer.java      # FastJSON2 序列化器
│   └── KryoRedisSerializer.java           # Kryo 序列化器
└── util
    └── RedisUtil.java                    # Redis 工具类（key 包装、模板创建）`}</CodeBlock>

              {/* ============== 10. 最佳实践 ============== */}
              <H2 id="sec-9">10. 最佳实践</H2>
              <P>1. <Strong>合理选择配置模式</Strong>：单数据源用简单模式，多数据源/多数据库用动态模式。动态模式下不要配置 <InlineCode>spring.data.redis.*</InlineCode>，统一使用 <InlineCode>easyfk.config.db.redis.datasource.*</InlineCode>。</P>
              <P>2. <Strong>使用命名空间隔离 key</Strong>：不同业务模块使用不同的 namespace，避免 key 冲突。</P>
              <P>3. <Strong>选择合适的序列化器</Strong>：通用场景用 Jackson（DEFAULT），追求速度用 FastJSON，追求极致性能用 KRYO。</P>
              <P>4. <Strong>善用批量操作</Strong>：<InlineCode>multiSet</InlineCode>/<InlineCode>multiGet</InlineCode> 和 Pipeline 大幅减少网络往返，提升吞吐。</P>
              <P>5. <Strong>事务谨慎使用</Strong>：事务操作使用独立的连接模板，避免在高频场景大量使用。需要乐观锁时使用 <InlineCode>executeTransactionWithWatch</InlineCode>。</P>
              <P>6. <Strong>Lua 脚本保原子性</Strong>：复杂的原子操作（如分布式锁、CAS）使用 Lua 脚本，避免竞态条件。</P>
              <P>7. <Strong>连接池调优</Strong>：根据并发量调整 <InlineCode>max-active</InlineCode>、<InlineCode>max-idle</InlineCode>，默认值（32/16/4）适合中等并发场景。</P>
              <P>8. <Strong>集群模式注意事项</Strong>：集群模式仅支持 database 0，多 key 操作需确保 key 分布在同一 slot。</P>
              <P>9. <Strong>发布订阅可靠性</Strong>：生产环境建议启用消息重试机制，关键业务可使用 <InlineCode>highReliabilityConfig</InlineCode> 预设。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-db-redis — 高性能 Redis 键值存储集成方案。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
