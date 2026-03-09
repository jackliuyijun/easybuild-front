"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, H4, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "实体基类" },
  { id: "sec-4", label: "自动填充机制" },
  { id: "sec-5", label: "Repository 层" },
  { id: "sec-6", label: "SearchCondition 查询条件" },
  { id: "sec-7", label: "实战示例" },
  { id: "sec-8", label: "DTO / PO 自动转换" },
  { id: "sec-9", label: "安全防护" },
  { id: "sec-10", label: "包结构" },
  { id: "sec-11", label: "最佳实践" },
]

export default function OrmMybatisDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="MyBatis"
      title="easyfk-orm-mybatis MyBatis"
      subtitle="MyBatis 集成 — 灵活的 SQL 映射框架"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>orm-mybatis</InlineCode> 是 EasyFK 框架中基于 MyBatis-Plus 的 ORM 组件。该模块实现了框架统一的 <InlineCode>IBaseRepository</InlineCode> 接口，提供完整的 CRUD、分页查询、条件构建、逻辑删除、自动填充、DTO/PO 自动转换、数据库类型自动识别等能力，同时集成了 MyBatis-Plus 的 <InlineCode>ServiceImpl</InlineCode> 能力，是框架默认推荐的 ORM 实现。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>orm-mybatis</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:orm-mybatis'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`mybatis-plus-spring-boot3-starter` — MyBatis-Plus Spring Boot 3 集成", "`mybatis-plus-jsqlparser` (3.5.14) — SQL 解析器", "`spring-boot-starter-jdbc` — Spring JDBC 支持"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 数据源配置</H3>
              <CodeBlock lang="yaml">{`spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver`}</CodeBlock>

              <H3>3.2 自动配置</H3>
              <P>模块无需额外开关，引入依赖后自动生效，自动完成以下配置：</P>

                            <DocTable
                headers={["分页插件", "`PaginationInnerInterceptor`，自动识别数据库类型"]}
                rows={[
                  ["自动填充", "`AutoSetValueHandler`，插入/更新时自动填充时间字段"],
                  ["逻辑删除", "`@TableLogic` 注解驱动"],
                  ["Mapper 扫描", "自动扫描 `com.mcst.**.persistence.mapper` 包"],
                  ["数据库类型", "从 DataSource JDBC URL 自动识别（MySQL/Oracle/PostgreSQL 等）"],
                ]}
              />

              <H3>3.3 MyBatis-Plus 可选配置</H3>
              <CodeBlock lang="yaml">{`mybatis-plus:
  mapper-locations: classpath*:mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 开发环境打印 SQL
  global-config:
    db-config:
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0`}</CodeBlock>

              {/* ============== 4. 实体基类 ============== */}
              <H2 id="sec-3">4. 实体基类</H2>

              <H3>4.1 BaseMyBatisPlusEntity（完整版）</H3>
              <P>包含创建时间、更新时间和逻辑删除字段，适用于大多数业务表。</P>
              <CodeBlock lang="java">{`@Data
@TableName("t_order")
@EqualsAndHashCode(callSuper = true)
public class OrderPO extends BaseMyBatisPlusEntity<OrderPO> {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;
    private BigDecimal amount;
    private Integer status;

    // 继承字段：insertTime、lastUpdateTime、deleted
}`}</CodeBlock>

                            <DocTable
                headers={["`insertTime`", "LocalDateTime", "`@TableField(fill = FieldFill.INSERT)`", "插入时自动填充"]}
                rows={[
                  ["`deleted`", "Integer", "`@TableLogic` + `@TableField(fill = FieldFill.INSERT, select = false)`", "逻辑删除，查询时不返回"],
                ]}
              />

              <H3>4.2 BaseMyBatisPlusSimpleEntity（简化版）</H3>
              <P>不包含逻辑删除字段，适用于日志表、记录表等。</P>
              <CodeBlock lang="java">{`@Data
@TableName("t_operation_log")
@EqualsAndHashCode(callSuper = true)
public class OperationLogPO extends BaseMyBatisPlusSimpleEntity<OperationLogPO> {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String operationType;
    private String content;

    // 继承字段：insertTime、lastUpdateTime
}`}</CodeBlock>

              {/* ============== 5. 自动填充机制 ============== */}
              <H2 id="sec-4">5. 自动填充机制</H2>
              <P><InlineCode>AutoSetValueHandler</InlineCode> 实现 MyBatis-Plus 的 <InlineCode>MetaObjectHandler</InlineCode> 接口：</P>

              <H3>插入时填充</H3>

                            <DocTable
                headers={["`createTime`", "`LocalDateTime.now()`", "创建时间"]}
                rows={[
                  ["`lastUpdateTime`", "`LocalDateTime.now()`", "最后更新时间"],
                  ["`modifyTime`", "`LocalDateTime.now()`", "修改时间"],
                  ["`updateTime`", "`LocalDateTime.now()`", "更新时间"],
                  ["`version`", "`1L`", "乐观锁版本号"],
                  ["`deleted`", "`0`", "逻辑删除标志（正常）"],
                ]}
              />

              <H3>更新时填充</H3>

                            <DocTable
                headers={["`modifyTime`", "`LocalDateTime.now()`", "修改时间"]}
                rows={[
                  ["`lastUpdateTime`", "`LocalDateTime.now()`", "最后更新时间"],
                ]}
              />
              <P>&gt; 使用 MyBatis-Plus 原生 <InlineCode>fillStrategy</InlineCode>，仅当字段值为 <InlineCode>null</InlineCode> 时填充。</P>

              {/* ============== 6. Repository 层 ============== */}
              <H2 id="sec-5">6. Repository 层</H2>

              <H3>6.1 定义 Mapper</H3>
              <CodeBlock lang="java">{`public interface OrderMapper extends BaseMapper<OrderPO> {
}`}</CodeBlock>

              <H3>6.2 定义 Repository</H3>
              <CodeBlock lang="java">{`@Repository
public class OrderRepository extends BaseMyBatisRepositoryImpl<OrderMapper, OrderDTO, OrderPO, Long> {
}`}</CodeBlock>
              <P>泛型参数说明：</P>

                            <DocTable
                headers={["`M`", "`OrderMapper`", "Mapper 接口（继承 `BaseMapper`）"]}
                rows={[
                  ["`P`", "`OrderPO`", "PO 实体类型（持久层）"],
                  ["`PK`", "`Long`", "主键类型"],
                ]}
              />
              <P>&gt; <InlineCode>BaseMyBatisRepositoryImpl</InlineCode> 同时继承了 <InlineCode>ServiceImpl&lt;M, P&gt;</InlineCode>，因此也拥有 MyBatis-Plus <InlineCode>IService</InlineCode> 的所有能力（如 <InlineCode>saveBatch</InlineCode>、<InlineCode>lambdaQuery</InlineCode> 等）。</P>

              <H3>6.3 IBaseRepository 完整 API</H3>
              <H4>查询方法</H4>

                            <DocTable
                headers={["`queryById(id, selectColumns...)`", "`T`", "按主键查询（可选字段筛选）"]}
                rows={[
                  ["`queryOneByCondition(condition)`", "`T`", "按条件查询单条"],
                  ["`queryByField(field, value, selectFields...)`", "`List&lt;T&gt;`", "按字段查询列表"],
                  ["`queryOneByField(field, value, selectFields...)`", "`T`", "按字段查询单条"],
                  ["`queryByPage(condition)`", "`PageResult&lt;T&gt;`", "分页查询"],
                  ["`exists(field, value)`", "`boolean`", "按字段判断是否存在"],
                  ["`exists(condition)`", "`boolean`", "按条件判断是否存在"],
                  ["`countByCondition(condition)`", "`long`", "按条件统计数量"],
                ]}
              />
              <H4>插入方法</H4>

                            <DocTable
                headers={["`insert(param)`", "`BaseResult&lt;?&gt;`", "插入单条记录"]}
                rows={[
                  ["`insertAndReturnId(param)`", "`PK`", "插入并返回主键"],
                ]}
              />
              <H4>更新方法</H4>

                            <DocTable
                headers={["`updateBySelective(param, nullProperties...)`", "`BaseResult&lt;?&gt;`", "选择性更新（非空字段）"]}
                rows={[
                  ["`saveOrUpdateBySelective(param, nullProperties...)`", "`BaseResult&lt;?&gt;`", "有主键且存在则更新，否则插入"],
                ]}
              />
              <H4>删除方法</H4>

                            <DocTable
                headers={["`deleteById(id)`", "`BaseResult&lt;?&gt;`", "按主键删除（支持单个/逗号分隔/集合）"]}
                rows={[]}
              />

              {/* ============== 7. SearchCondition 查询条件 ============== */}
              <H2 id="sec-6">7. SearchCondition 查询条件</H2>
              <P><InlineCode>SearchCondition</InlineCode> 是框架统一的查询条件构建器：</P>

              <H3>7.1 条件类型</H3>

                            <DocTable
                headers={["等值", "`setEqualsConditions(map)`", "`field = value`"]}
                rows={[
                  ["模糊", "`setLikeConditions(map)`", "`field LIKE '%value%'`"],
                  ["IN", "`setInConditions(map)`", "`field IN (v1, v2, ...)`"],
                  ["区间", "`setRangeConditions(list)`", "`field &gt; / &gt;= / &lt; / &lt;= / BETWEEN`"],
                  ["NULL", "`setNullFields(fields)`", "`field IS NULL`"],
                  ["自定义 SQL", "`setCustomConditionSql(sql)`", "原生 SQL 条件拼接（`apply`）"],
                ]}
              />

              <H3>7.2 排序、分组、字段选择</H3>

                            <DocTable
                headers={["`setAscFields(fields)`", "升序排序字段"]}
                rows={[
                  ["`setDescFirst(true)`", "降序优先"],
                  ["`setGroupFields(fields)`", "分组字段"],
                  ["`setSelectFields(fields)`", "查询字段"],
                  ["`setChange(true)`", "是否驼峰转下划线（默认 `true`）"],
                ]}
              />

              <H3>7.3 分页</H3>

                            <DocTable
                headers={["`setPageSearch(new PageSearch(page, limit))`", "设置分页参数"]}
                rows={[
                  ["`setTop(n)`", "查询前 N 条"],
                ]}
              />

              <H3>7.4 区间条件类型（RangeConditionType）</H3>

                            <DocTable
                headers={["`GreaterThan`", "`field &gt; value`"]}
                rows={[
                  ["`LessThan`", "`field &lt; value`"],
                  ["`LessThanOrEqual`", "`field &lt;= value`"],
                  ["`Equal`", "`field = value`"],
                  ["`Between`", "`field BETWEEN start AND end`"],
                ]}
              />

              {/* ============== 8. 实战示例 ============== */}
              <H2 id="sec-7">8. 实战示例</H2>

              <H3>8.1 按主键查询</H3>
              <CodeBlock lang="java">{`@Resource
private OrderRepository orderRepository;

// 查询全部字段
OrderDTO order = orderRepository.queryById(1L);

// 查询指定字段
OrderDTO order = orderRepository.queryById(1L, "orderNo", "amount", "status");`}</CodeBlock>

              <H3>8.2 条件查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();

// 等值条件
Map<String, Object> eqMap = new HashMap<>();
eqMap.put("status", 1);
eqMap.put("userId", 100L);
condition.setEqualsConditions(eqMap);

// 模糊查询
Map<String, String> likeMap = new HashMap<>();
likeMap.put("orderNo", "ORD2024");
condition.setLikeConditions(likeMap);

// 排序
condition.setDescFields(new String[]{"insertTime"});

List<OrderDTO> orders = orderRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>8.3 区间查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();

List<RangeCondition> ranges = new ArrayList<>();
ranges.add(new RangeCondition("amount", RangeConditionType.GreaterThan, 100, null));
ranges.add(new RangeCondition("insertTime", RangeConditionType.Between, "2024-01-01", "2024-12-31"));
condition.setRangeConditions(ranges);

List<OrderDTO> orders = orderRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>8.4 IN 查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();

Map<String, List<?>> inMap = new HashMap<>();
inMap.put("status", List.of(1, 2, 3));
condition.setInConditions(inMap);

List<OrderDTO> orders = orderRepository.queryByCondition(condition);`}</CodeBlock>

              <H3>8.5 分页查询</H3>
              <CodeBlock lang="java">{`SearchCondition condition = new SearchCondition();
condition.setPageSearch(new PageSearch(1, 20));
condition.setDescFields(new String[]{"insertTime"});

PageResult<OrderDTO> pageResult = orderRepository.queryByPage(condition);
long total = pageResult.getTotal();
List<OrderDTO> rows = pageResult.getRows();`}</CodeBlock>

              <H3>8.6 插入与更新</H3>
              <CodeBlock lang="java">{`// 插入
OrderDTO order = new OrderDTO();
order.setOrderNo("ORD_001");
order.setAmount(new BigDecimal("99.99"));
order.setStatus(0);
orderRepository.insert(order);

// 插入并返回主键
Long id = orderRepository.insertAndReturnId(order);

// 批量插入（使用 MyBatis-Plus saveBatch）
List<OrderDTO> orders = List.of(order1, order2, order3);
orderRepository.insertBatch(orders);

// 选择性更新
OrderDTO updateDTO = new OrderDTO();
updateDTO.setId(1L);
updateDTO.setStatus(2);
orderRepository.updateBySelective(updateDTO);

// 选择性更新 + 指定置空字段
orderRepository.updateBySelective(updateDTO, "remark", "memo");

// 保存或更新
orderRepository.saveOrUpdateBySelective(order);`}</CodeBlock>

              <H3>8.7 删除</H3>
              <CodeBlock lang="java">{`// 单个删除
orderRepository.deleteById(1L);

// 批量删除（逗号分隔）
orderRepository.deleteById("1,2,3");

// 批量删除（集合）
orderRepository.deleteById(List.of(1L, 2L, 3L));

// 按条件删除
SearchCondition condition = new SearchCondition();
condition.setEqualsConditions(Map.of("status", 0));
orderRepository.deleteByCondition(condition);`}</CodeBlock>

              <H3>8.8 使用 MyBatis-Plus 原生能力</H3>
              <P>由于 <InlineCode>BaseMyBatisRepositoryImpl</InlineCode> 继承了 <InlineCode>ServiceImpl</InlineCode>，可直接使用 MyBatis-Plus 的全部能力：</P>
              <CodeBlock lang="java">{`// Lambda 查询
List<OrderPO> list = orderRepository.lambdaQuery()
    .eq(OrderPO::getStatus, 1)
    .ge(OrderPO::getAmount, 100)
    .orderByDesc(OrderPO::getInsertTime)
    .list();

// Lambda 更新
orderRepository.lambdaUpdate()
    .set(OrderPO::getStatus, 2)
    .eq(OrderPO::getId, 1L)
    .update();

// 批量保存（分批提交）
orderRepository.saveBatch(poList, 500);`}</CodeBlock>

              {/* ============== 9. DTO / PO 自动转换 ============== */}
              <H2 id="sec-8">9. DTO / PO 自动转换</H2>
              <P><InlineCode>BaseMyBatisRepositoryImpl</InlineCode> 内部自动完成 DTO 和 PO 之间的转换：</P>
              <BulletList items={["**查询**：PO → DTO（通过 `TransformUtil.transformObj`）", "**插入/更新**：DTO → PO（通过 `TransformUtil.transformObj`）", "**列表转换**：`TransformUtil.transformList`"]} />

              {/* ============== 10. 安全防护 ============== */}
              <H2 id="sec-9">10. 安全防护</H2>

              <H3>防全表操作</H3>
              <P><InlineCode>BlockAttackInnerInterceptor</InlineCode> 拦截器自动阻止以下危险操作：</P>
              <BulletList items={["全表更新（`UPDATE` 无 `WHERE` 条件）", "全表删除（`DELETE` 无 `WHERE` 条件）"]} />

              <H3>数据库类型自动识别</H3>
              <P><InlineCode>MybatisPlusConfigure</InlineCode> 通过 DataSource 的 JDBC URL 自动识别数据库类型，无需手动配置分页方言：</P>
              <BulletList items={["MySQL → `DbType.MYSQL`", "Oracle → `DbType.ORACLE`", "PostgreSQL → `DbType.POSTGRE_SQL`", "识别失败时默认使用 `DbType.MYSQL`"]} />

              {/* ============== 11. 包结构 ============== */}
              <H2 id="sec-10">11. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.service.mybatisplus
├── ApplicationStarter.java                    # 启动入口（集成 Mapper 扫描）
├── MybatisPlusServiceScanner.java             # Mapper 包扫描配置
├── annotation
│   └── Column.java                            # 字段注解
├── config
│   └── MybatisPlusConfigure.java              # 自动配置（分页/防攻击/填充/数据库类型识别）
├── handler
│   └── AutoSetValueHandler.java               # MetaObjectHandler 自动填充
├── impl
│   └── BaseMyBatisRepositoryImpl.java         # IBaseRepository + ServiceImpl 实现
├── persistence
│   ├── BaseMyBatisPlusEntity.java             # 实体基类（完整版：时间 + 逻辑删除）
│   └── BaseMyBatisPlusSimpleEntity.java       # 实体基类（简化版：仅时间）
└── util
    ├── EqualConditionUtil.java                # 等值条件构建
    ├── InConditionUtil.java                   # IN 条件构建
    ├── LikeConditionUtil.java                 # 模糊查询条件构建
    ├── MyBatisPlusWrapperUtil.java            # QueryWrapper 核心构建器
    ├── MybatisPlusUtil.java                   # 通用工具（ID 查询/删除/分页/保存更新）
    ├── NullConditionUtil.java                 # NULL 条件构建
    └── RangeConditionUtil.java                # 区间条件构建`}</CodeBlock>

              {/* ============== 12. 最佳实践 ============== */}
              <H2 id="sec-11">12. 最佳实践</H2>
              <P>1. <Strong>实体基类选择</Strong>：有逻辑删除需求用 <InlineCode>BaseMyBatisPlusEntity</InlineCode>，无需逻辑删除用 <InlineCode>BaseMyBatisPlusSimpleEntity</InlineCode>。</P>
              <P>2. <Strong>DTO 与 PO 分离</Strong>：PO 对应数据库表结构，DTO 对外暴露，Repository 自动完成转换。</P>
              <P>3. <Strong>字段命名</Strong>：Java 层使用驼峰命名，框架自动转换为下划线列名。</P>
              <P>4. <Strong>选择性更新</Strong>：<InlineCode>updateBySelective</InlineCode> 仅更新非空字段；需要置空时通过 <InlineCode>nullProperties</InlineCode> 参数指定。</P>
              <P>5. <Strong>分页默认值</Strong>：未设置分页参数时，默认查询第 1 页、每页 10 条。</P>
              <P>6. <Strong>默认排序</Strong>：未设置排序条件时，如果实体包含 <InlineCode>insertTime</InlineCode> 字段，自动按 <InlineCode>insert_time DESC</InlineCode> 排序。</P>
              <P>7. <Strong>条件优先级</Strong>：同一字段同时出现在多种条件中时，等值条件自动让位，避免冲突。</P>
              <P>8. <Strong>批量操作</Strong>：<InlineCode>insertBatch</InlineCode> 使用 MyBatis-Plus 的 <InlineCode>saveBatch</InlineCode>，支持分批提交。</P>
              <P>9. <Strong>与 orm-flex 迁移</Strong>：<InlineCode>IBaseRepository</InlineCode> 接口完全一致，迁移只需更换 Repository 基类和实体注解。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-orm-mybatis — 灵活高效的 SQL 映射数据访问层。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
