"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-intro", label: "简介" },
  { id: "sec-quickstart", label: "快速接入" },
  { id: "sec-scope", label: "BOM 管控范围" },
  { id: "sec-scenarios", label: "典型使用场景" },
  { id: "sec-override", label: "版本覆盖" },
  { id: "sec-group", label: "依赖分组速查" },
  { id: "sec-faq", label: "常见问题" },
]

export default function BomDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="BOM"
      title="easyfk-dependencies 使用手册"
      subtitle="统一依赖版本管理平台（BOM）"
      readingTime="~15 min"
    >
{/* ============== 1. 简介 ============== */}
              <H2 id="sec-intro">1. 简介</H2>
              <P>
                <InlineCode>easyfk-dependencies</InlineCode> 是 EasyFK 体系的<Strong>统一依赖版本管理平台</Strong>（BOM），发布坐标为：
              </P>
              <CodeBlock lang="plaintext">{`com.mcst:easyfk-dependencies`}</CodeBlock>
              <P>引入该 BOM 后，下游业务项目无需逐一声明依赖版本号，即可获得经过验证的、一致的依赖版本基线，避免多项目间版本漂移与冲突。</P>
              <H4>核心价值</H4>
              <BulletList items={[
                "统一管控 EasyFK 内部模块、Spring 生态及常用第三方库的版本。",
                "下游项目只需引入一个 BOM 坐标，按需声明依赖即可，无需关心版本号。",
                "升级时只需更新 BOM 版本，所有受管依赖自动对齐。",
              ]} />
              <WarnBox>
                <Strong>JDK 要求</Strong>：Spring Boot 3.x 要求 JDK 17+，请确保项目编译与运行环境满足此要求。
              </WarnBox>

              {/* ============== 2. 快速接入 ============== */}
              <H2 id="sec-quickstart">2. 快速接入</H2>
              <TipBox>
                以下示例中 <InlineCode>{'${easyfk.version}'}</InlineCode> 代表实际使用的 BOM 版本号，请替换为项目所需的具体版本。
              </TipBox>

              <H3>2.1 Gradle 项目</H3>
              <P>在 <InlineCode>build.gradle</InlineCode> 中通过 <InlineCode>platform</InlineCode> 引入 BOM：</P>
              <CodeBlock lang="gradle">{`repositories {
    // 配置公司私服地址（根据实际情况修改）
    maven { url 'https://your-nexus-host/repository/maven-public/' }
}

dependencies {
    // 引入 BOM，统一版本管理
    implementation platform('com.mcst:easyfk-dependencies:\${easyfk.version}')

    // 之后引入依赖无需写版本号
    implementation 'com.mcst:easyfk-core'
    implementation 'com.mcst:service-base'
    implementation 'com.mcst:web-common'
}`}</CodeBlock>
              <P>如果需要强制所有传递依赖也受 BOM 约束，可使用 <InlineCode>enforcedPlatform</InlineCode>：</P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation enforcedPlatform('com.mcst:easyfk-dependencies:\${easyfk.version}')
}`}</CodeBlock>
              <P><Strong>Gradle Kotlin DSL</Strong> 写法：</P>
              <CodeBlock lang="kotlin">{`dependencies {
    implementation(platform("com.mcst:easyfk-dependencies:\${easyfk.version}"))

    implementation("com.mcst:easyfk-core")
    implementation("com.mcst:service-base")
}`}</CodeBlock>

              <H3>2.2 Maven 项目</H3>
              <P>在 <InlineCode>pom.xml</InlineCode> 的 <InlineCode>{'<dependencyManagement>'}</InlineCode> 中以 BOM 方式引入：</P>
              <CodeBlock lang="xml">{`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mcst</groupId>
            <artifactId>easyfk-dependencies</artifactId>
            <version>\${easyfk.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>`}</CodeBlock>
              <P>之后在 <InlineCode>{'<dependencies>'}</InlineCode> 中引入具体依赖时无需声明版本号：</P>
              <CodeBlock lang="xml">{`<dependencies>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>easyfk-core</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>service-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>web-common</artifactId>
    </dependency>
</dependencies>`}</CodeBlock>

              {/* ============== 3. BOM 管控范围 ============== */}
              <H2 id="sec-scope">3. BOM 管控范围</H2>

              <H3>3.1 框架级 BOM</H3>
              <P>本 BOM 内部已引入以下框架级 BOM，下游项目<Strong>无需重复引入</Strong>：</P>
              <BulletList items={[
                <InlineCode key="sb">spring-boot-dependencies</InlineCode>,
                <InlineCode key="sc">spring-cloud-dependencies</InlineCode>,
                <InlineCode key="sca">spring-cloud-alibaba-dependencies</InlineCode>,
              ]} />

              <H3>3.2 EasyFK 核心模块</H3>
              <DocTable
                headers={["坐标（artifactId）", "说明"]}
                rows={[
                  ["easyfk-core", "核心基础模块"],
                  ["easyfk-authority", "权限模块"],
                  ["easyfk-thread", "线程管理模块"],
                  ["easyfk-cache", "缓存抽象模块"],
                  ["easyfk-doc", "文档模块"],
                  ["easyfk-lock", "分布式锁抽象模块"],
                  ["easyfk-mq", "消息队列抽象模块"],
                  ["easyfk-repository", "数据仓储模块"],
                  ["easyfk-resource", "资源模块"],
                ]}
              />

              <H3>3.3 EasyFK 服务模块</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["service-api", "服务 API 定义"],
                  ["service-base", "服务基础模块"],
                ]}
              />

              <H3>3.4 EasyFK Web 模块</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["web-common", "Web 公共模块"],
                  ["web-micro", "微服务 Web 模块"],
                  ["web-prd", "生产环境 Web 模块"],
                  ["web-base", "Web 基础模块"],
                  ["web-simple", "简单 Web 模块"],
                ]}
              />

              <H3>3.5 数据库与数据源</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:db-mysql", "EasyFK MySQL 封装"],
                  ["com.mcst:db-postgresql", "EasyFK PostgreSQL 封装"],
                  ["com.mcst:db-redis", "EasyFK Redis 封装"],
                  ["com.mcst:db-mongo", "EasyFK MongoDB 封装"],
                  ["com.mcst:db-influx", "EasyFK InfluxDB 封装"],
                  ["com.mysql:mysql-connector-j", "MySQL 驱动"],
                  ["org.postgresql:postgresql", "PostgreSQL 驱动"],
                  ["org.mongodb:mongo-java-driver", "MongoDB 驱动"],
                  ["com.influxdb:influxdb-client-java", "InfluxDB 客户端"],
                  ["com.alibaba:druid-spring-boot-starter", "Druid 连接池"],
                  ["com.mcst:datasource-druid", "EasyFK Druid 封装"],
                  ["shardingsphere-jdbc-core-spring-boot-starter", "ShardingSphere 分库分表"],
                ]}
              />

              <H3>3.6 ORM 框架</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:orm-mybatis", "EasyFK MyBatis 封装"],
                  ["com.mcst:orm-flex", "EasyFK MyBatis-Flex 封装"],
                  ["com.mcst:orm-hibernate", "EasyFK Hibernate 封装"],
                  ["com.mcst:orm-sharding", "EasyFK 分片 ORM 封装"],
                  ["mybatis-plus-spring-boot3-starter", "MyBatis-Plus"],
                  ["dynamic-datasource-spring-boot3-starter", "动态数据源"],
                ]}
              />

              <H3>3.7 缓存</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:cache-redis", "Redis 缓存实现"],
                  ["com.mcst:cache-caffeine", "Caffeine 缓存实现"],
                  ["com.mcst:cache-mult", "多级缓存实现"],
                  ["com.github.ben-manes.caffeine:caffeine", "Caffeine"],
                  ["org.redisson:redisson", "Redisson"],
                ]}
              />

              <H3>3.8 分布式锁</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:lock-redisson", "Redisson 分布式锁"],
                  ["com.mcst:lock-zk", "ZooKeeper 分布式锁"],
                ]}
              />

              <H3>3.9 消息队列</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:mq-common", "MQ 公共模块"],
                  ["com.mcst:mq-kafka", "Kafka 实现"],
                  ["com.mcst:mq-rocket", "RocketMQ 实现"],
                  ["com.mcst:mq-rabbit", "RabbitMQ 实现"],
                  ["com.mcst:mq-xxl", "XXL-MQ 实现"],
                  ["rocketmq-spring-boot-starter", "RocketMQ Starter"],
                ]}
              />

              <H3>3.10 微服务组件</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:registry-nacos", "Nacos 注册中心"],
                  ["com.mcst:config-nacos", "Nacos 配置中心"],
                  ["com.mcst:protect-sentinel", "Sentinel 流量防护"],
                  ["com.mcst:gateway-gateway", "网关模块"],
                  ["com.mcst:rpc-cloud", "Spring Cloud RPC"],
                  ["com.mcst:rpc-dubbo", "Dubbo RPC"],
                  ["com.mcst:remote-cloud", "Cloud 远程调用"],
                  ["com.mcst:remote-dubbo", "Dubbo 远程调用"],
                  ["com.mcst:transaction-seata", "Seata 分布式事务"],
                  ["dubbo-spring-boot-starter", "Dubbo Starter"],
                  ["dubbo-registry-nacos", "Dubbo Nacos 注册"],
                ]}
              />

              <H3>3.11 日志</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:log-log4j2", "EasyFK Log4j2 封装"],
                  ["com.mcst:log-logback", "EasyFK Logback 封装"],
                  ["logstash-logback-encoder", "Logstash 日志编码器"],
                  ["apm-toolkit-log4j-2.x", "SkyWalking Log4j2"],
                  ["apm-toolkit-logback-1.x", "SkyWalking Logback"],
                ]}
              />

              <H3>3.12 文档 / API</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:doc-knife4j", "EasyFK Knife4j 封装"],
                  ["com.mcst:doc-micro", "微服务文档模块"],
                  ["knife4j-openapi3-jakarta-spring-boot-starter", "Knife4j OpenAPI3"],
                  ["io.swagger.core.v3:swagger-annotations", "Swagger 注解"],
                ]}
              />

              <H3>3.13 工具与扩展</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:tool-http", "HTTP 工具"],
                  ["com.mcst:tool-excel", "Excel 工具"],
                  ["com.mcst:component-autoId", "自增 ID 组件"],
                  ["com.mcst:job-xxl", "XXL-Job 封装"],
                  ["com.xuxueli:xxl-job-core", "XXL-Job"],
                  ["com.xuxueli:xxl-mq-core", "XXL-MQ"],
                  ["com.xuxueli:xxl-cache-core", "XXL-Cache"],
                  ["mapstruct-plus-spring-boot-starter", "MapStruct Plus"],
                  ["com.alibaba:easyexcel", "EasyExcel"],
                  ["com.squareup.okhttp3:okhttp", "OkHttp"],
                ]}
              />

              <H3>3.14 第三方基础库</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.alibaba.fastjson2:fastjson2", "FastJSON2"],
                  ["com.esotericsoftware:kryo", "Kryo 序列化"],
                  ["org.slf4j:slf4j-api", "SLF4J API"],
                  ["org.projectlombok:lombok", "Lombok"],
                  ["cn.hutool:hutool-all", "Hutool 工具集"],
                  ["jasypt-spring-boot-starter", "Jasypt 配置加密"],
                ]}
              />

              <H3>3.15 WebSocket</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:websocket-api", "WebSocket API"],
                  ["com.mcst:websocket-server", "WebSocket 服务端"],
                ]}
              />

              <H3>3.16 存储组件</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:queue-disruptor", "Disruptor 队列"],
                  ["com.mcst:storage-chronicle", "Chronicle 存储"],
                  ["com.mcst:chronicle-map", "Chronicle Map 封装"],
                  ["com.mcst:chronicle-queue", "Chronicle Queue 封装"],
                  ["net.openhft:chronicle-map", "Chronicle Map"],
                  ["net.openhft:chronicle-queue", "Chronicle Queue"],
                ]}
              />

              <H3>3.17 微信开发</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["wx-java-miniapp-spring-boot-starter", "小程序"],
                  ["wx-java-mp-spring-boot-starter", "公众号"],
                  ["wx-java-pay-spring-boot-starter", "微信支付"],
                  ["wx-java-cp-spring-boot-starter", "企业微信"],
                ]}
              />

              <H3>3.18 ClickHouse</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.clickhouse:clickhouse-jdbc", "ClickHouse JDBC"],
                  ["httpcomponents.client5:httpclient5", "HttpClient5"],
                  ["httpcomponents.core5:httpcore5", "HttpCore5"],
                ]}
              />

              <H3>3.19 资源服务</H3>
              <DocTable
                headers={["坐标", "说明"]}
                rows={[
                  ["com.mcst:resource-server", "资源服务端"],
                  ["com.mcst:resource-repository-api", "资源仓库 API"],
                  ["com.mcst:resource-repository-mybatis", "资源仓库 MyBatis 实现"],
                  ["com.mcst:resource-sc-client", "资源 SC 客户端"],
                  ["com.mcst:resource-sc-provider", "资源 SC 服务端"],
                ]}
              />

              {/* ============== 4. 典型使用场景 ============== */}
              <H2 id="sec-scenarios">4. 典型使用场景</H2>

              <H3>4.1 单体 Web 应用</H3>
              <P><Strong>Gradle：</Strong></P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation platform('com.mcst:easyfk-dependencies:\${easyfk.version}')

    implementation 'com.mcst:easyfk-core'
    implementation 'com.mcst:web-base'
    implementation 'com.mcst:orm-mybatis'
    implementation 'com.mcst:db-mysql'
    implementation 'com.mcst:cache-redis'
    implementation 'com.mcst:log-logback'

    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}`}</CodeBlock>
              <P><Strong>Maven：</Strong></P>
              <CodeBlock lang="xml">{`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mcst</groupId>
            <artifactId>easyfk-dependencies</artifactId>
            <version>\${easyfk.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>easyfk-core</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>web-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>orm-mybatis</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>db-mysql</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>cache-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>log-logback</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>`}</CodeBlock>

              <H3>4.2 微服务应用（Nacos + Dubbo）</H3>
              <P><Strong>Gradle：</Strong></P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation platform('com.mcst:easyfk-dependencies:\${easyfk.version}')

    implementation 'com.mcst:easyfk-core'
    implementation 'com.mcst:web-micro'
    implementation 'com.mcst:service-base'
    implementation 'com.mcst:registry-nacos'
    implementation 'com.mcst:config-nacos'
    implementation 'com.mcst:rpc-dubbo'
    implementation 'com.mcst:protect-sentinel'
    implementation 'com.mcst:orm-mybatis'
    implementation 'com.mcst:db-mysql'
    implementation 'com.mcst:cache-redis'
    implementation 'com.mcst:doc-knife4j'
}`}</CodeBlock>
              <P><Strong>Maven：</Strong></P>
              <CodeBlock lang="xml">{`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mcst</groupId>
            <artifactId>easyfk-dependencies</artifactId>
            <version>\${easyfk.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>easyfk-core</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>web-micro</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>service-base</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>registry-nacos</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>config-nacos</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>rpc-dubbo</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>protect-sentinel</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>orm-mybatis</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>db-mysql</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>cache-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>doc-knife4j</artifactId>
    </dependency>
</dependencies>`}</CodeBlock>

              <H3>4.3 网关服务</H3>
              <P><Strong>Gradle：</Strong></P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation platform('com.mcst:easyfk-dependencies:\${easyfk.version}')

    implementation 'com.mcst:gateway-gateway'
    implementation 'com.mcst:registry-nacos'
    implementation 'com.mcst:config-nacos'
    implementation 'com.mcst:protect-sentinel'
}`}</CodeBlock>
              <P><Strong>Maven：</Strong></P>
              <CodeBlock lang="xml">{`<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mcst</groupId>
            <artifactId>easyfk-dependencies</artifactId>
            <version>\${easyfk.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>gateway-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>registry-nacos</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>config-nacos</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>protect-sentinel</artifactId>
    </dependency>
</dependencies>`}</CodeBlock>

              <H3>4.4 仅使用第三方库（不依赖 EasyFK 封装）</H3>
              <P>BOM 同样管控了大量第三方依赖版本，即使不使用 EasyFK 模块也可以直接引用：</P>
              <P><Strong>Gradle：</Strong></P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation platform('com.mcst:easyfk-dependencies:\${easyfk.version}')

    implementation 'com.baomidou:mybatis-plus-spring-boot3-starter'
    implementation 'com.alibaba:druid-spring-boot-starter'
    implementation 'com.mysql:mysql-connector-j'
    implementation 'org.redisson:redisson'
    implementation 'cn.hutool:hutool-all'
}`}</CodeBlock>
              <P><Strong>Maven：</Strong></P>
              <CodeBlock lang="xml">{`<dependencies>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
    <dependency>
        <groupId>org.redisson</groupId>
        <artifactId>redisson</artifactId>
    </dependency>
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
    </dependency>
</dependencies>`}</CodeBlock>

              {/* ============== 5. 版本覆盖 ============== */}
              <H2 id="sec-override">5. 版本覆盖</H2>
              <P>如果下游项目需要使用与 BOM 不同的版本，可以显式声明版本号进行覆盖。</P>
              <P><Strong>Gradle：</Strong></P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation platform('com.mcst:easyfk-dependencies:\${easyfk.version}')

    // 显式覆盖版本
    implementation 'cn.hutool:hutool-all:5.x.x'
}`}</CodeBlock>
              <P><Strong>Maven：</Strong></P>
              <CodeBlock lang="xml">{`<dependencies>
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>5.x.x</version>
    </dependency>
</dependencies>`}</CodeBlock>
              <WarnBox>
                非必要不建议覆盖 BOM 版本，以保持团队依赖一致性。如确需覆盖，请验证兼容性。
              </WarnBox>

              {/* ============== 6. 依赖分组速查 ============== */}
              <H2 id="sec-group">6. 依赖分组速查</H2>
              <P>BOM 内部将依赖按领域进行了分组，以下列出各分组及其包含的主要依赖，便于按需选择：</P>
              <DocTable
                headers={["分组", "包含的主要依赖"]}
                rows={[
                  ["base", "fastjson2、caffeine、kryo、slf4j-api、jasypt、lombok、hutool、swagger-annotations"],
                  ["logging", "log-log4j2、log-logback、logstash-logback-encoder"],
                  ["skywalking", "skywalking-log4j2、skywalking-logback"],
                  ["database", "db-influx、db-redis、db-mongo、db-mysql、db-postgresql、influxdb-client、shardingsphere"],
                  ["datasource", "druid-starter、datasource-druid、mongo-driver"],
                  ["orm", "orm-flex、orm-hibernate、orm-mybatis、orm-sharding"],
                  ["mybatis", "mybatis-plus-starter、mysql-connector、dynamic-datasource"],
                  ["cache", "cache-redis、cache-mult、cache-caffeine"],
                  ["lock", "lock-redisson、lock-zk"],
                  ["mq", "mq-kafka、mq-rocket、mq-rabbit、mq-xxl、mq-common、rocketmq-starter"],
                  ["microservice", "registry-nacos、config-nacos、protect-sentinel、gateway-gateway、doc-micro"],
                  ["rpc", "rpc-cloud、rpc-dubbo、dubbo-starter、dubbo-registry-nacos、remote-cloud、remote-dubbo"],
                  ["transaction", "transaction-seata"],
                  ["xxl", "xxl-cache、xxl-job、xxl-mq、job-xxl"],
                  ["tools", "tool-http、tool-excel、component-autoId"],
                  ["doc", "doc-knife4j、knife4j-starter"],
                  ["easyfkCore", "easyfk-authority、easyfk-core、easyfk-cache、easyfk-doc、easyfk-lock、easyfk-mq、easyfk-thread、easyfk-repository、easyfk-resource"],
                  ["easyfkService", "service-api、service-base"],
                  ["easyfkWeb", "web-common、web-micro、web-prd、web-base、web-simple"],
                  ["mapstruct", "mapstruct-plus-starter"],
                  ["wxJava", "wx-java-miniapp、wx-java-mp、wx-java-pay、wx-java-cp"],
                  ["clickhouse", "clickhouse-jdbc、httpclient5、httpcore5"],
                  ["websocket", "websocket-api、websocket-server"],
                  ["storage", "queue-disruptor、storage-chronicle、chronicle-map、chronicle-queue"],
                ]}
              />

              {/* ============== 7. 常见问题 ============== */}
              <H2 id="sec-faq">7. 常见问题</H2>

              <H3>Q1：引入 BOM 后是否会把所有依赖都加到项目中？</H3>
              <P>不会。BOM 只声明版本约束，不引入实际依赖。只有在 <InlineCode>dependencies</InlineCode> 中显式声明的依赖才会被加入项目，BOM 仅负责提供版本号。</P>

              <H3>Q2：BOM 中已包含 Spring Boot / Cloud BOM，项目还需要单独引入吗？</H3>
              <P>不需要。<InlineCode>easyfk-dependencies</InlineCode> 内部已引入 <InlineCode>spring-boot-dependencies</InlineCode>、<InlineCode>spring-cloud-dependencies</InlineCode> 和 <InlineCode>spring-cloud-alibaba-dependencies</InlineCode>，下游项目引入本 BOM 即可获得这些框架的版本管控。</P>

              <H3>Q3：Gradle 中 platform 和 enforcedPlatform 有什么区别？</H3>
              <BulletList items={[
                <><InlineCode>platform</InlineCode>：声明版本建议，下游仍可通过显式声明或传递依赖覆盖版本。</>,
                <><InlineCode>enforcedPlatform</InlineCode>：强制使用 BOM 中的版本，即使传递依赖带来了更高版本也会被降级。</>,
              ]} />

              <H3>Q4：Maven 项目中如何同时使用 Spring Boot parent 和本 BOM？</H3>
              <P>使用 Spring Boot 作为 parent 时，将本 BOM 放在 <InlineCode>{'<dependencyManagement>'}</InlineCode> 中以 <InlineCode>import</InlineCode> 方式引入即可。对于同一依赖，<InlineCode>{'<dependencyManagement>'}</InlineCode> 中先声明的优先生效，可根据需要调整 BOM 的声明顺序。</P>

              <H3>Q5：如何查看当前 BOM 管控的具体版本号？</H3>
              <BulletList items={[
                <><Strong>Gradle 项目</Strong>：执行 <InlineCode>./gradlew dependencies</InlineCode> 查看解析后的完整依赖树及版本。</>,
                <><Strong>Maven 项目</Strong>：执行 <InlineCode>mvn dependency:tree</InlineCode> 或 <InlineCode>mvn help:effective-pom</InlineCode> 查看实际生效的版本。</>,
              ]} />

              <H3>Q6：私服地址如何配置？</H3>
              <P>本 BOM 发布在公司私服中，需要在构建配置中添加私服仓库地址：</P>
              <P><Strong>Gradle</Strong>（<InlineCode>build.gradle</InlineCode> 或 <InlineCode>settings.gradle</InlineCode>）：</P>
              <CodeBlock lang="gradle">{`repositories {
    maven { url 'https://your-nexus-host/repository/maven-public/' }
}`}</CodeBlock>
              <P><Strong>Maven</Strong>（<InlineCode>pom.xml</InlineCode> 或 <InlineCode>settings.xml</InlineCode>）：</P>
              <CodeBlock lang="xml">{`<repositories>
    <repository>
        <id>company-nexus</id>
        <url>https://your-nexus-host/repository/maven-public/</url>
    </repository>
</repositories>`}</CodeBlock><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-dependencies — 一个 BOM 坐标，统管所有依赖版本。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
