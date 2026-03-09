"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "工作原理" },
  { id: "sec-3", label: "配置说明" },
  { id: "sec-4", label: "常用分片算法" },
  { id: "sec-5", label: "主键生成策略" },
  { id: "sec-6", label: "与 ORM 组件配合使用" },
  { id: "sec-7", label: "常用属性配置" },
  { id: "sec-8", label: "最佳实践" },
]

export default function OrmShardingDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="ShardingSphere"
      title="easyfk-orm-sharding ShardingSphere"
      subtitle="ShardingSphere — 分库分表与读写分离"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>orm-sharding</InlineCode> 是 EasyFK 框架中基于 Apache ShardingSphere JDBC 的分库分表组件。该模块作为依赖传递层，将 ShardingSphere JDBC Spring Boot Starter 集成到框架体系中，配合 <InlineCode>orm-mybatis</InlineCode> 或 <InlineCode>orm-flex</InlineCode> 使用，为应用提供<Strong>透明化的分库分表、读写分离、数据加密和分布式事务</Strong>能力，业务代码无需任何改动。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>orm-sharding</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:orm-sharding'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`shardingsphere-jdbc-core-spring-boot-starter` — Apache ShardingSphere JDBC 核心"]} />
              <P>&gt; <Strong>注意</Strong>：<InlineCode>orm-sharding</InlineCode> 通常与 <InlineCode>orm-mybatis</InlineCode> 或 <InlineCode>orm-flex</InlineCode> 配合使用，需同时引入 ORM 组件。</P>

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-2">3. 工作原理</H2>
              <P>ShardingSphere JDBC 作为 JDBC 增强驱动，工作在应用层与数据库之间：</P>
              <CodeBlock lang="plaintext">{`应用代码 → MyBatis-Plus / MyBatis-Flex → ShardingSphere JDBC → 实际数据源`}</CodeBlock>
              <BulletList items={["对上层应用完全透明，无需修改 SQL 或业务代码", "通过 YAML 配置即可实现分库分表、读写分离等能力", "与框架的 `BaseMyBatisRepositoryImpl` / `BaseFlexRepositoryImpl` 无缝兼容"]} />

              {/* ============== 4. 配置说明 ============== */}
              <H2 id="sec-3">4. 配置说明</H2>

              <H3>4.1 分库分表配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    mode:
      type: Standalone
      repository:
        type: JDBC
    datasource:
      names: ds0,ds1
      ds0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.100:3306/db_order_0
        username: root
        password: root
      ds1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.101:3306/db_order_1
        username: root
        password: root
    rules:
      sharding:
        tables:
          t_order:
            actual-data-nodes: ds$->{0..1}.t_order_$->{0..3}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: db-hash-mod
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table-hash-mod
            key-generate-strategy:
              column: order_id
              key-generator-name: snowflake
        sharding-algorithms:
          db-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 2
          table-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 4
        key-generators:
          snowflake:
            type: SNOWFLAKE
    props:
      sql-show: true  # 开发环境显示路由后的 SQL`}</CodeBlock>

              <H3>4.2 读写分离配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    datasource:
      names: master,slave0,slave1
      master:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.100:3306/mydb
        username: root
        password: root
      slave0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.101:3306/mydb
        username: root
        password: root
      slave1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://192.168.1.102:3306/mydb
        username: root
        password: root
    rules:
      readwrite-splitting:
        data-sources:
          readwrite_ds:
            write-data-source-name: master
            read-data-source-names:
              - slave0
              - slave1
            load-balancer-name: round-robin
        load-balancers:
          round-robin:
            type: ROUND_ROBIN`}</CodeBlock>

              <H3>4.3 分库分表 + 读写分离组合配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    datasource:
      names: master0,master1,slave0_0,slave0_1,slave1_0,slave1_1
      # ... 数据源配置省略
    rules:
      sharding:
        tables:
          t_order:
            actual-data-nodes: readwrite_ds_$->{0..1}.t_order_$->{0..3}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: db-hash-mod
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table-hash-mod
        sharding-algorithms:
          db-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 2
          table-hash-mod:
            type: HASH_MOD
            props:
              sharding-count: 4
      readwrite-splitting:
        data-sources:
          readwrite_ds_0:
            write-data-source-name: master0
            read-data-source-names: [slave0_0, slave0_1]
            load-balancer-name: round-robin
          readwrite_ds_1:
            write-data-source-name: master1
            read-data-source-names: [slave1_0, slave1_1]
            load-balancer-name: round-robin
        load-balancers:
          round-robin:
            type: ROUND_ROBIN`}</CodeBlock>

              <H3>4.4 数据加密配置</H3>
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    rules:
      encrypt:
        tables:
          t_user:
            columns:
              phone:
                cipher-column: phone_cipher
                encryptor-name: aes-encryptor
              id_card:
                cipher-column: id_card_cipher
                encryptor-name: aes-encryptor
        encryptors:
          aes-encryptor:
            type: AES
            props:
              aes-key-value: my-secret-key-1234`}</CodeBlock>

              {/* ============== 5. 常用分片算法 ============== */}
              <H2 id="sec-4">5. 常用分片算法</H2>

                            <DocTable
                headers={["`HASH_MOD`", "哈希取模", "均匀分布，推荐"]}
                rows={[
                  ["`VOLUME_RANGE`", "基于容量的范围分片", "按数据量分片"],
                  ["`BOUNDARY_RANGE`", "基于边界的范围分片", "按 ID 范围分片"],
                  ["`AUTO_INTERVAL`", "自动间隔分片", "按时间分片"],
                  ["`INLINE`", "行表达式", "灵活自定义"],
                ]}
              />

              <H3>行表达式示例</H3>
              <CodeBlock lang="yaml">{`sharding-algorithms:
  inline-order:
    type: INLINE
    props:
      algorithm-expression: t_order_$->{order_id % 4}`}</CodeBlock>

              {/* ============== 6. 主键生成策略 ============== */}
              <H2 id="sec-5">6. 主键生成策略</H2>

                            <DocTable
                headers={["`SNOWFLAKE`", "雪花算法（推荐），分布式唯一 ID"]}
                rows={[
                  ["`NANOID`", "NanoID"],
                ]}
              />
              <CodeBlock lang="yaml">{`key-generators:
  snowflake:
    type: SNOWFLAKE
    props:
      worker-id: 1`}</CodeBlock>

              {/* ============== 7. 与 ORM 组件配合使用 ============== */}
              <H2 id="sec-6">7. 与 ORM 组件配合使用</H2>

              <H3>7.1 与 orm-mybatis 配合</H3>
              <CodeBlock lang="java">{`// 实体类无需任何修改
@Data
@TableName("t_order")
@EqualsAndHashCode(callSuper = true)
public class OrderPO extends BaseMyBatisPlusEntity<OrderPO> {
    @TableId(type = IdType.ASSIGN_ID)  // 使用 ShardingSphere 分配 ID
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
}

// Repository 无需任何修改
@Repository
public class OrderRepository extends BaseMyBatisRepositoryImpl<OrderMapper, OrderDTO, OrderPO, Long> {
}

// 使用方式完全不变
OrderDTO order = orderRepository.queryById(1L);
orderRepository.insert(orderDTO);
// ShardingSphere 自动路由到正确的库和表`}</CodeBlock>

              <H3>7.2 与 orm-flex 配合</H3>
              <CodeBlock lang="java">{`@Data
@Table("t_order")
@EqualsAndHashCode(callSuper = true)
public class OrderPO extends BaseFlexEntity<OrderPO> {
    @Id(keyType = KeyType.None)  // 由 ShardingSphere 生成 ID
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
}

@Repository
public class OrderRepository extends BaseFlexRepositoryImpl<OrderMapper, OrderDTO, OrderPO, Long> {
}`}</CodeBlock>

              {/* ============== 8. 常用属性配置 ============== */}
              <H2 id="sec-7">8. 常用属性配置</H2>

                            <DocTable
                headers={["`sql-show`", "`false`", "是否打印路由后的 SQL（开发环境推荐开启）"]}
                rows={[
                  ["`max-connections-size-per-query`", "`1`", "每个查询最大连接数"],
                  ["`check-table-metadata-enabled`", "`false`", "是否检查表元数据一致性"],
                  ["`kernel-executor-size`", "`infinite`", "内核执行器线程数"],
                ]}
              />
              <CodeBlock lang="yaml">{`spring:
  shardingsphere:
    props:
      sql-show: true
      max-connections-size-per-query: 2
      check-table-metadata-enabled: true`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>分片键选择</Strong>：选择高基数、查询频率高的字段作为分片键（如 <InlineCode>user_id</InlineCode>、<InlineCode>order_id</InlineCode>），避免使用更新频繁的字段。</P>
              <P>2. <Strong>分片算法</Strong>：推荐使用 <InlineCode>HASH_MOD</InlineCode>，数据分布均匀；范围查询多时可考虑 <InlineCode>BOUNDARY_RANGE</InlineCode>。</P>
              <P>3. <Strong>主键策略</Strong>：分库分表场景推荐使用 <InlineCode>SNOWFLAKE</InlineCode> 雪花算法生成全局唯一 ID。</P>
              <P>4. <Strong>避免跨片查询</Strong>：查询条件尽量包含分片键，避免全库扫描。</P>
              <P>5. <Strong>绑定表</Strong>：有关联关系的表使用相同的分片策略和分片键，避免跨片 JOIN。</P>
              <P>6. <Strong>读写分离</Strong>：生产环境建议配合读写分离，分散读压力。</P>
              <P>7. <Strong>开发调试</Strong>：开发环境开启 <InlineCode>sql-show: true</InlineCode>，查看实际路由的 SQL。</P>
              <P>8. <Strong>ID 类型</Strong>：使用 ShardingSphere 主键生成时，MyBatis-Plus 的 <InlineCode>@TableId</InlineCode> 设为 <InlineCode>IdType.ASSIGN_ID</InlineCode> 或 <InlineCode>IdType.INPUT</InlineCode>。</P>
              <P>9. <Strong>事务注意</Strong>：跨库事务需要分布式事务支持，ShardingSphere 支持 XA 和 BASE 两种模式。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-orm-sharding — 分库分表与读写分离，构建弹性数据架构。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
