"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, H4, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "注解说明" },
  { id: "sec-4", label: "使用方式" },
  { id: "sec-5", label: "API 参考" },
  { id: "sec-6", label: "查询条件详解" },
  { id: "sec-7", label: "实战示例" },
  { id: "sec-8", label: "自动配置机制" },
  { id: "sec-9", label: "安全特性" },
  { id: "sec-10", label: "包结构" },
  { id: "sec-11", label: "最佳实践" },
]

export default function DbClickhouseDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="ClickHouse"
      title="easyfk-db-clickhouse ClickHouse"
      subtitle="ClickHouse — 高性能列式分析数据库"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>db-clickhouse</InlineCode> 是 EasyFK 框架中面向 ClickHouse 列式数据库的数据访问组件。该模块基于 Spring Boot 自动配置和 HikariCP 高性能连接池，提供注解驱动的实体映射、通用 CRUD 操作、灵活的条件查询构建以及原生 SQL 执行能力，适用于日志分析、时序数据存储、实时报表统计等大数据量场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>db-clickhouse</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:db-clickhouse'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`clickhouse-jdbc` — ClickHouse JDBC 驱动", "`httpclient5` / `httpcore5` — HTTP Client 5（ClickHouse HTTP 协议通信）", "`guava` — Google Guava 工具库", "`easyfk-core` — EasyFK 框架核心", "`service-base` — EasyFK 服务基础模块", "`spring-boot-starter-jdbc` — Spring Boot JDBC 支持"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 配置属性</H3>
              <P>所有配置项统一在 <InlineCode>easyfk.config.db.clickhouse</InlineCode> 前缀下。</P>

                            <DocTable
                headers={["`url`", "String", "—", "JDBC 连接地址（**必填**，配置后模块自动生效）"]}
                rows={[
                  ["`password`", "String", "—", "连接密码"],
                  ["`database`", "String", "—", "默认数据库名称"],
                  ["`minPoolSize`", "Integer", "`5`", "连接池最小空闲连接数"],
                  ["`maxPoolSize`", "Integer", "`20`", "连接池最大连接数"],
                  ["`connectionTimeout`", "Integer", "`30000`", "连接超时时间（毫秒）"],
                  ["`socketTimeout`", "Integer", "`300000`", "Socket 超时时间（毫秒）"],
                ]}
              />

              <H3>3.2 配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    db:
      clickhouse:
        url: jdbc:clickhouse://localhost:8123/default
        username: default
        password: your_password
        database: default
        minPoolSize: 5
        maxPoolSize: 20
        connectionTimeout: 30000
        socketTimeout: 300000`}</CodeBlock>

              <H3>3.3 连接池参数</H3>
              <P>模块内置 HikariCP 连接池，已预设以下优化参数：</P>

                            <DocTable
                headers={["连接池名称", "`ClickHouseHikariPool`", "便于监控和日志区分"]}
                rows={[
                  ["连接最大生命周期", "30 分钟", "防止连接长期持有导致资源泄漏"],
                  ["空闲连接超时", "10 分钟", "及时回收空闲连接"],
                ]}
              />

              {/* ============== 4. 注解说明 ============== */}
              <H2 id="sec-3">4. 注解说明</H2>

              <H3>4.1 @ClickHouseTable</H3>
              <P>标记实体类对应的 ClickHouse 表名，作用于类级别。</P>

                            <DocTable
                headers={["`name`", "String", "是", "表名"]}
                rows={[]}
              />

              <H3>4.2 @ClickHouseColumn</H3>
              <P>标记实体类字段对应的 ClickHouse 列名及属性，作用于字段级别。</P>

                            <DocTable
                headers={["`name`", "String", '`""`', "列名（为空则自动将驼峰字段名转为下划线格式）"]}
                rows={[
                  ["`timestamp`", "boolean", "`false`", "是否为时间戳字段（用于时间范围查询）"],
                  ["`partitionKey`", "boolean", "`false`", "是否为分区键"],
                  ["`ignore`", "boolean", "`false`", "是否忽略该字段（不参与数据库操作）"],
                ]}
              />

              {/* ============== 5. 使用方式 ============== */}
              <H2 id="sec-4">5. 使用方式</H2>

              <H3>5.1 定义实体类</H3>
              <CodeBlock lang="java">{`@Data
@ClickHouseTable(name = "user_event_log")
public class UserEventLog {

    @ClickHouseColumn(name = "event_id", primaryKey = true)
    private String eventId;

    @ClickHouseColumn(name = "user_id")
    private Long userId;

    @ClickHouseColumn(name = "event_type")
    private String eventType;

    @ClickHouseColumn(name = "event_data")
    private String eventData;

    @ClickHouseColumn(name = "create_time", timestamp = true)
    private LocalDateTime createTime;

    @ClickHouseColumn(ignore = true)
    private String tempField;
}`}</CodeBlock>
              <P>&gt; 未添加 <InlineCode>@ClickHouseColumn</InlineCode> 注解的字段，默认自动将驼峰命名转换为下划线命名参与数据库操作。标记 <InlineCode>ignore = true</InlineCode> 的字段将被排除。</P>

              <H3>5.2 创建 Repository</H3>
              <P>继承 <InlineCode>BaseClickHouseRepositoryImpl</InlineCode>，即可获得全部基础 CRUD 能力：</P>
              <CodeBlock lang="java">{`@Repository
public class UserEventLogRepository extends BaseClickHouseRepositoryImpl<UserEventLog> {

    // 可在此添加自定义查询方法
}`}</CodeBlock>

              <H3>5.3 注入使用</H3>
              <CodeBlock lang="java">{`@Service
public class EventService {

    @Resource
    private UserEventLogRepository eventLogRepository;
}`}</CodeBlock>

              {/* ============== 6. API 参考 ============== */}
              <H2 id="sec-5">6. API 参考</H2>

              <H3>6.1 IBaseClickHouseRepository 接口方法</H3>
              <H4>插入操作</H4>

                            <DocTable
                headers={["`insert(entity)`", "实体对象", "单条数据插入"]}
                rows={[
                  ["`insertBatch(entities, batchSize)`", "实体列表, 批次大小", "批量插入（指定批次大小）"],
                ]}
              />
              <H4>查询操作</H4>

                            <DocTable
                headers={["`queryList(condition)`", "查询条件", "`List&lt;T&gt;`", "条件查询列表"]}
                rows={[
                  ["`count(condition)`", "查询条件", "`long`", "查询总数"],
                  ["`aggregate(condition)`", "查询条件", "`List&lt;Map&gt;`", "聚合查询（需设置聚合函数和分组字段）"],
                ]}
              />
              <H4>删除操作</H4>

                            <DocTable
                headers={["`delete(condition)`", "查询条件", "条件删除（ALTER TABLE DELETE，**必须包含 WHERE 条件**）"]}
                rows={[]}
              />
              <H4>更新操作</H4>

              
              <H4>原生 SQL 操作</H4>

                            <DocTable
                headers={["`executeQuery(sql)`", "SQL 语句", "`List&lt;T&gt;`", "原生 SQL 查询，结果映射为实体"]}
                rows={[
                  ["`executeUpdate(sql)`", "SQL 语句", "`int`", "原生 SQL 执行（INSERT/UPDATE/DELETE）"],
                ]}
              />
              <H4>工具方法</H4>

                            <DocTable
                headers={["`tableExists()`", "`boolean`", "检查实体对应的表是否存在（查询 system.tables）"]}
                rows={[]}
              />

              {/* ============== 7. 查询条件详解 ============== */}
              <H2 id="sec-6">7. 查询条件详解</H2>

              <H3>7.1 ClickHouseSearchCondition 属性</H3>
              <P><InlineCode>ClickHouseSearchCondition</InlineCode> 支持链式调用（<InlineCode>@Accessors(chain = true)</InlineCode>）。</P>
              <H4>时间范围</H4>

                            <DocTable
                headers={["`start`", "String", "—", "开始时间（支持绝对时间和相对时间）"]}
                rows={[
                  ["`timeField`", "String", "`create_time`", "时间字段名"],
                ]}
              />
              <H4>条件查询</H4>

                            <DocTable
                headers={["`equalsConditions`", "`Map&lt;String, Object&gt;`", "等于条件"]}
                rows={[
                  ["`likeConditions`", "`Map&lt;String, String&gt;`", "模糊查询条件（LIKE）"],
                  ["`inConditions`", "`Map&lt;String, List&lt;?&gt;&gt;`", "IN 查询条件"],
                  ["`gtConditions`", "`Map&lt;String, Object&gt;`", "大于条件"],
                  ["`gteConditions`", "`Map&lt;String, Object&gt;`", "大于等于条件"],
                  ["`ltConditions`", "`Map&lt;String, Object&gt;`", "小于条件"],
                  ["`lteConditions`", "`Map&lt;String, Object&gt;`", "小于等于条件"],
                  ["`betweenConditions`", "`Map&lt;String, Object[]&gt;`", "BETWEEN 条件（value 为 `[min, max]` 数组）"],
                ]}
              />
              <H4>聚合与分组</H4>

                            <DocTable
                headers={["`aggregationFunctions`", "`String[]`", "聚合函数，如 `count(*)`, `sum(amount)`, `avg(price)`"]}
                rows={[
                  ["`selectFields`", "`String[]`", "自定义查询字段"],
                ]}
              />
              <H4>排序</H4>

                            <DocTable
                headers={["`descFields`", "`String[]`", "—", "降序排序字段"]}
                rows={[
                  ["`defaultDesc`", "Boolean", "`true`", "默认按时间字段降序排列"],
                ]}
              />
              <H4>分页与限制</H4>

                            <DocTable
                headers={["`pageSearch`", "`PageSearch`", "分页查询（包含 page 和 limit）"]}
                rows={[]}
              />
              <H4>高级选项</H4>

                            <DocTable
                headers={["`customWhere`", "String", "—", "自定义 WHERE 条件（直接拼接到 SQL）"]}
                rows={[
                  ["`useFinal`", "Boolean", "`false`", "是否使用 FINAL 关键字（用于 ReplacingMergeTree 等表引擎）"],
                ]}
              />

              <H3>7.2 相对时间表达式</H3>
              <P>时间字段支持相对时间表达式，格式为 <InlineCode>[+-]数字单位</InlineCode>：</P>

                            <DocTable
                headers={["`-1d`", "1 天前", "`now() - INTERVAL 1 DAY`"]}
                rows={[
                  ["`-30m`", "30 分钟前", "`now() - INTERVAL 30 MINUTE`"],
                  ["`+1h`", "1 小时后", "`now() + INTERVAL 1 HOUR`"],
                  ["`-1w`", "1 周前", "`now() - INTERVAL 1 WEEK`"],
                  ["`-1y`", "1 年前", "`now() - INTERVAL 1 YEAR`"],
                  ["`now` / `now()`", "当前时间", "`now()`"],
                ]}
              />
              <P>支持的时间单位：<InlineCode>s</InlineCode>（秒）、<InlineCode>m</InlineCode>（分）、<InlineCode>h</InlineCode>（时）、<InlineCode>d</InlineCode>（天）、<InlineCode>w</InlineCode>（周）、<InlineCode>y</InlineCode>（年）。</P>

              <H3>7.3 SearchRequest 自动转换</H3>
              <P><InlineCode>ClickHouseSearchConditionUtil.createSearchCondition()</InlineCode> 可将框架通用的 <InlineCode>SearchRequest</InlineCode> 自动转换为 <InlineCode>ClickHouseSearchCondition</InlineCode>，自动处理：</P>
              <BulletList items={["参数对象非空字段 → 等于条件", "`BasicParam` 中的分页、Top、时间范围、排序参数", "驼峰字段名自动转下划线"]} />
              <CodeBlock lang="java">{`@PostMapping("/search")
public List<UserEventLog> search(@RequestBody SearchRequest<UserEventParam> request) {
    ClickHouseSearchCondition condition =
        ClickHouseSearchConditionUtil.createSearchCondition(request, UserEventLog.class);
    return eventLogRepository.queryList(condition);
}`}</CodeBlock>

              {/* ============== 8. 实战示例 ============== */}
              <H2 id="sec-7">8. 实战示例</H2>

              <H3>8.1 单条插入</H3>
              <CodeBlock lang="java">{`UserEventLog log = new UserEventLog();
log.setEventId("evt_001");
log.setUserId(10086L);
log.setEventType("LOGIN");
log.setCreateTime(LocalDateTime.now());

eventLogRepository.insert(log);`}</CodeBlock>

              <H3>8.2 批量插入</H3>
              <CodeBlock lang="java">{`List<UserEventLog> logs = new ArrayList<>();
for (int i = 0; i < 5000; i++) {
    UserEventLog log = new UserEventLog();
    log.setEventId("evt_" + i);
    log.setUserId((long) (i % 100));
    log.setEventType("PAGE_VIEW");
    log.setCreateTime(LocalDateTime.now());
    logs.add(log);
}

// 默认每批 1000 条
eventLogRepository.insertBatch(logs);

// 自定义批次大小
eventLogRepository.insertBatch(logs, 2000);`}</CodeBlock>

              <H3>8.3 条件查询</H3>
              <CodeBlock lang="java">{`ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setEqualsConditions(Map.of("event_type", "LOGIN"))
    .setStart("-7d")
    .setStop("now")
    .setDescFields(new String[]{"create_time"})
    .setTop(100);

List<UserEventLog> logs = eventLogRepository.queryList(condition);`}</CodeBlock>

              <H3>8.4 分页查询</H3>
              <CodeBlock lang="java">{`ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setEqualsConditions(Map.of("user_id", 10086L))
    .setPageSearch(new PageSearch(1, 20));

List<UserEventLog> list = eventLogRepository.queryList(condition);
long total = eventLogRepository.count(condition);`}</CodeBlock>

              <H3>8.5 聚合查询</H3>
              <CodeBlock lang="java">{`ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setAggregationFunctions(new String[]{"event_type", "count(*) as cnt"})
    .setGroupByFields(new String[]{"event_type"})
    .setStart("-30d")
    .setDescFields(new String[]{"cnt"})
    .setTop(10);

List<Map<String, Object>> result = eventLogRepository.aggregate(condition);
// 结果示例：[{event_type=LOGIN, cnt=12345}, {event_type=PAGE_VIEW, cnt=98765}]`}</CodeBlock>

              <H3>8.6 BETWEEN 查询</H3>
              <CodeBlock lang="java">{`ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setBetweenConditions(Map.of("user_id", new Object[]{100L, 200L}));

List<UserEventLog> logs = eventLogRepository.queryList(condition);`}</CodeBlock>

              <H3>8.7 IN 查询</H3>
              <CodeBlock lang="java">{`ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setInConditions(Map.of("event_type", List.of("LOGIN", "LOGOUT", "REGISTER")));

List<UserEventLog> logs = eventLogRepository.queryList(condition);`}</CodeBlock>

              <H3>8.8 条件删除</H3>
              <CodeBlock lang="java">{`// 按时间范围删除
eventLogRepository.deleteByTimeRange("2025-01-01 00:00:00", "2025-06-30 23:59:59");

// 按条件删除
ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setEqualsConditions(Map.of("event_type", "TEST"));
eventLogRepository.delete(condition);`}</CodeBlock>

              <H3>8.9 条件更新</H3>
              <CodeBlock lang="java">{`UserEventLog updateEntity = new UserEventLog();
updateEntity.setEventType("UPDATED_TYPE");

ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setEqualsConditions(Map.of("event_id", "evt_001"));

eventLogRepository.update(updateEntity, condition);`}</CodeBlock>

              <H3>8.10 使用 FINAL 关键字</H3>
              <P>对于 <InlineCode>ReplacingMergeTree</InlineCode> 引擎的表，查询时可启用 FINAL 以获取去重后的最新数据：</P>
              <CodeBlock lang="java">{`ClickHouseSearchCondition condition = new ClickHouseSearchCondition()
    .setUseFinal(true)
    .setEqualsConditions(Map.of("user_id", 10086L));

List<UserEventLog> logs = eventLogRepository.queryList(condition);
// 生成 SQL: SELECT * FROM user_event_log FINAL WHERE user_id = 10086 ORDER BY create_time DESC`}</CodeBlock>

              <H3>8.11 原生 SQL 查询</H3>
              <CodeBlock lang="java">{`// 返回实体列表
List<UserEventLog> logs = eventLogRepository.executeQuery(
    "SELECT * FROM user_event_log WHERE event_type = 'LOGIN' LIMIT 10"
);

// 返回 Map 列表
List<Map<String, Object>> result = eventLogRepository.executeQueryForMap(
    "SELECT event_type, count(*) as cnt FROM user_event_log GROUP BY event_type"
);

// 执行 DDL / DML
eventLogRepository.executeUpdate(
    "ALTER TABLE user_event_log DELETE WHERE create_time < '2025-01-01'"
);`}</CodeBlock>

              {/* ============== 9. 自动配置机制 ============== */}
              <H2 id="sec-8">9. 自动配置机制</H2>

              
              <BulletList items={["通过 Spring Boot `AutoConfiguration.imports` 声明自动配置入口", "使用 `@EnableConfigurationProperties` 自动绑定 `ClickHouseProperties`", "仅当配置了 `easyfk.config.db.clickhouse.url` 时才会激活", "使用 `@Lazy` 延迟初始化，不影响主数据源启动", "在 `DataSourceAutoConfiguration` 之后配置，避免数据源冲突", '注入时使用 `@Resource(name = "clickHouseJdbcTemplate")` 指定 Bean 名称']} />

              {/* ============== 10. 安全特性 ============== */}
              <H2 id="sec-9">10. 安全特性</H2>

              <H3>10.1 SQL 注入防护</H3>
              <BulletList items={["所有字符串值自动进行转义处理（反斜杠、单引号）", "值格式化统一通过 `ClickHouseSqlUtil.formatValue()` 处理"]} />

              <H3>10.2 误操作保护</H3>
              <BulletList items={["删除操作（`delete`）**强制要求** WHERE 条件，防止全表删除", "更新操作（`update`）**强制要求** WHERE 条件，防止全表更新", "空实体插入抛出 `IllegalArgumentException`", "空更新条件抛出 `IllegalArgumentException`"]} />

              {/* ============== 11. 包结构 ============== */}
              <H2 id="sec-10">11. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.db.clickhouse
├── annotation
│   ├── ClickHouseTable.java              # 表名注解
│   └── ClickHouseColumn.java             # 列名注解
├── config
│   └── ClickHouseConfig.java             # Spring Boot 自动配置类
├── properties
│   └── ClickHouseProperties.java         # 配置属性绑定类
├── repository
│   ├── IBaseClickHouseRepository.java    # 通用仓库接口
│   └── BaseClickHouseRepositoryImpl.java # 通用仓库实现
├── search
│   └── ClickHouseSearchCondition.java    # 查询条件封装类
└── utils
    ├── ClickHouseSearchConditionUtil.java # 查询条件转换工具类
    └── ClickHouseSqlUtil.java            # SQL 构建工具类`}</CodeBlock>

              {/* ============== 12. 最佳实践 ============== */}
              <H2 id="sec-11">12. 最佳实践</H2>
              <P>1. <Strong>合理设置连接池大小</Strong>：ClickHouse 适合少量长连接，不建议 <InlineCode>maxPoolSize</InlineCode> 设置过大。一般 10~30 即可满足需求。</P>
              <P>2. <Strong>批量写入优先</Strong>：ClickHouse 对高频小量写入不友好，请尽量使用 <InlineCode>insertBatch()</InlineCode> 积攒数据后批量写入，建议单批次 1000~5000 条。</P>
              <P>3. <Strong>善用相对时间</Strong>：查询近期数据时，使用相对时间表达式（如 <InlineCode>-1d</InlineCode>、<InlineCode>-7d</InlineCode>）比拼接绝对时间字符串更简洁，且自动适配服务端时间。</P>
              <P>4. <Strong>ReplacingMergeTree 配合 FINAL</Strong>：若表引擎为 <InlineCode>ReplacingMergeTree</InlineCode>，查询时设置 <InlineCode>useFinal = true</InlineCode> 确保获取去重后的最新数据。</P>
              <P>5. <Strong>避免频繁 DELETE / UPDATE</Strong>：ClickHouse 的删除和更新是 <InlineCode>ALTER TABLE</InlineCode> 异步操作，不适合高频使用，应以追加写入为主。</P>
              <P>6. <Strong>原生 SQL 兜底</Strong>：对于复杂查询（如子查询、JOIN、窗口函数），使用 <InlineCode>executeQuery()</InlineCode> 或 <InlineCode>executeQueryForMap()</InlineCode> 执行原生 SQL。</P>
              <P>7. <Strong>注解映射简化代码</Strong>：为实体类添加 <InlineCode>@ClickHouseTable</InlineCode> 和 <InlineCode>@ClickHouseColumn</InlineCode> 注解，可免去手写 SQL 中表名和列名的映射工作。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-db-clickhouse — 高性能列式分析数据库集成方案。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
