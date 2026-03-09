"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, P, InlineCode, Strong, Highlight } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-deps", label: "依赖引入" },
  { id: "sec-config", label: "配置说明" },
  { id: "sec-usage", label: "使用方式" },
  { id: "sec-api", label: "API 参考" },
  { id: "sec-autoconfig", label: "自动配置" },
  { id: "sec-internal", label: "内部实现" },
  { id: "sec-examples", label: "实战示例" },
  { id: "sec-best", label: "最佳实践" },
  { id: "sec-packages", label: "包结构" },
]

export default function AutoidRedisDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Redis 自增ID"
      title="easyfk-autoid-redis Redis 自增ID"
      subtitle="Redis 自增ID — 分布式全局唯一ID生成"
      readingTime="~8 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>autoId-redis</InlineCode> 是 EasyFK 框架中基于 Redis 的<Strong>分布式自增 ID 生成组件</Strong>。该模块利用 Redis 的<Highlight>原子自增（INCR）</Highlight>特性，提供全局唯一、有序递增的 ID 生成能力，支持纯数字自增 ID、日期前缀自增 ID、日期小时前缀自增 ID 三种生成模式，适用于订单号、流水号、业务编码等场景。
              </P>
              <TipBox>
                该模块依赖 <InlineCode>autoId-api</InlineCode>（接口定义）和 <InlineCode>db-redis</InlineCode>（Redis 操作组件），引入 <InlineCode>autoId-redis</InlineCode> 后会自动传递引入这些依赖。
              </TipBox>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-deps">2. 依赖引入</H2>
              <P>在项目的 <InlineCode>build.gradle</InlineCode> 中添加依赖：</P>
              <CodeBlock lang="gradle">{`dependencies {
    implementation project(':component-autoId:autoId-redis')
}`}</CodeBlock>
              <DocTable
                headers={["传递依赖", "说明"]}
                rows={[
                  ["autoId-api", "自增 ID 服务接口定义"],
                  ["db-redis", "EasyFK Redis 操作组件"],
                ]}
              />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-config">3. 配置说明</H2>
              <P>所有配置项统一在 <InlineCode>easyfk.config.autoid.redisson</InlineCode> 前缀下。</P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["datasource", "String", "RedisConstants.DEFAULT_DATASOURCE", "Redis 数据源名称"],
                  ["database", "String", "RedisConstants.DEFAULT_DATABASE", "Redis 数据库名称"],
                ]}
              />
              <CodeBlock lang="yaml">{`easyfk:
  config:
    autoid:
      redisson:
        datasource: default
        database: default`}</CodeBlock>
              <TipBox>
                大多数场景下，使用默认配置即可，无需额外配置。
              </TipBox>

              {/* ============== 4. 使用方式 ============== */}
              <H2 id="sec-usage">4. 使用方式</H2>
              <H3>4.1 注入服务</H3>
              <P>
                引入依赖后，<InlineCode>IAutoIdService</InlineCode> 会通过 Spring Boot 自动配置自动注册为 Bean，直接注入即可使用。
              </P>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private IAutoIdService autoIdService;
}`}</CodeBlock>

              <H3>4.2 模式一：纯数字自增 ID</H3>
              <P>生成全局递增的纯数字 ID，默认 6 位，不足前补零。</P>
              <CodeBlock lang="java">{`// 生成默认6位自增ID，如：000001、000002、000110
String id = autoIdService.createIncrementId();

// 按分类生成自增ID（不同分类独立计数）
String orderId = autoIdService.createIncrementId("order");
String userId = autoIdService.createIncrementId("user");

// 指定ID长度，如8位：00000001
String id = autoIdService.createIncrementId(8);

// 按分类 + 指定长度
String orderId = autoIdService.createIncrementId("order", 10);`}</CodeBlock>
              <DocTable
                headers={["调用", "输出"]}
                rows={[
                  ["createIncrementId()", "000001"],
                  ["createIncrementId()", "000002"],
                  ["createIncrementId(\"order\")", "000001"],
                  ["createIncrementId(8)", "00000001"],
                ]}
              />

              <H3>4.3 模式二：日期 + 自增 ID</H3>
              <P>
                生成 <InlineCode>yyyyMMdd</InlineCode> 日期前缀 + 自增序号的 ID，每日自动归零重新计数，缓存有效期 25 小时。
              </P>
              <CodeBlock lang="java">{`// 默认6位序号：20260227000001
String id = autoIdService.createDateIncrementId();

// 按分类生成
String orderId = autoIdService.createDateIncrementId("order");

// 指定序号长度，如8位：2026022700000001
String id = autoIdService.createDateIncrementId(8);

// 按分类 + 指定长度
String orderId = autoIdService.createDateIncrementId("order", 10);`}</CodeBlock>
              <DocTable
                headers={["调用", "输出格式", "示例"]}
                rows={[
                  ["createDateIncrementId()", "yyyyMMdd + 6位序号", "20260227000001"],
                  ["createDateIncrementId(8)", "yyyyMMdd + 8位序号", "2026022700000001"],
                ]}
              />

              <H3>4.4 模式三：日期小时 + 自增 ID</H3>
              <P>
                生成 <InlineCode>yyyyMMddHH</InlineCode> 日期小时前缀 + 自增序号的 ID，每小时自动归零重新计数，缓存有效期 65 分钟。
              </P>
              <CodeBlock lang="java">{`// 默认6位序号：2026022714000001
String id = autoIdService.createDateHourIncrementId();

// 按分类生成
String orderId = autoIdService.createDateHourIncrementId("order");

// 指定序号长度
String id = autoIdService.createDateHourIncrementId(8);

// 按分类 + 指定长度
String orderId = autoIdService.createDateHourIncrementId("order", 10);`}</CodeBlock>
              <DocTable
                headers={["调用", "输出格式", "示例"]}
                rows={[
                  ["createDateHourIncrementId()", "yyyyMMddHH + 6位序号", "2026022714000001"],
                  ["createDateHourIncrementId(8)", "yyyyMMddHH + 8位序号", "202602271400000001"],
                ]}
              />

              {/* ============== 5. API 参考 ============== */}
              <H2 id="sec-api">5. API 参考</H2>
              <H3>IAutoIdService 接口方法</H3>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["createIncrementId()", "—", "6位自增ID", "全局自增 ID"],
                  ["createIncrementId(category)", "分类名称", "6位自增ID", "按分类独立计数"],
                  ["createIncrementId(length)", "ID长度", "指定长度自增ID", "自定义位数"],
                  ["createIncrementId(category, length)", "分类名称, ID长度", "指定长度自增ID", "分类 + 自定义位数"],
                  ["createDateIncrementId()", "—", "日期+6位序号", "每日归零"],
                  ["createDateIncrementId(category)", "分类名称", "日期+6位序号", "按分类每日归零"],
                  ["createDateIncrementId(length)", "序号长度", "日期+指定长度序号", "自定义序号位数"],
                  ["createDateIncrementId(category, length)", "分类名称, 序号长度", "日期+指定长度序号", "分类 + 自定义序号位数"],
                  ["createDateHourIncrementId()", "—", "日期小时+6位序号", "每小时归零"],
                  ["createDateHourIncrementId(category)", "分类名称", "日期小时+6位序号", "按分类每小时归零"],
                  ["createDateHourIncrementId(length)", "序号长度", "日期小时+指定长度序号", "自定义序号位数"],
                  ["createDateHourIncrementId(category, length)", "分类名称, 序号长度", "日期小时+指定长度序号", "分类 + 自定义序号位数"],
                ]}
              />

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-autoconfig">6. 自动配置机制</H2>
              <DocTable
                headers={["配置类", "说明"]}
                rows={[
                  ["RedisAutoIdConfig", "自动注册 IAutoIdService Bean（实现类 AutoIdRedisServiceImpl）"],
                ]}
              />
              <P>
                通过 Spring Boot <InlineCode>AutoConfiguration.imports</InlineCode> 声明自动配置入口，使用 <InlineCode>@EnableConfigurationProperties</InlineCode> 自动绑定配置属性。引入依赖即生效，无需手动注册 Bean。
              </P>

              {/* ============== 7. 内部实现 ============== */}
              <H2 id="sec-internal">7. 内部实现说明</H2>
              <H3>7.1 Redis Key 结构</H3>
              <DocTable
                headers={["类型", "Key 格式", "过期时间"]}
                rows={[
                  ["纯自增", "{namespace}:{database}:{category}", "不过期（永久递增）"],
                  ["日期自增", "{namespace}:{database}:{category}_yyyyMMdd", "25 小时"],
                  ["日期小时自增", "{namespace}:{database}:{category}_yyyyMMddHH", "65 分钟"],
                ]}
              />
              <P>
                命名空间固定为 <InlineCode>AutoIdCache</InlineCode>，默认 category 为 <InlineCode>AutoIdKey</InlineCode>。日期/小时类型的 Key 包含时间戳后缀，过期后自动清理。
              </P>

              <H3>7.2 ID 补零规则</H3>
              <P>
                所有生成的序号部分均会左补零到指定位数。例如序号值为 <InlineCode>110</InlineCode>，指定长度为 6，则输出 <InlineCode>000110</InlineCode>。
              </P>

              {/* ============== 8. 实战示例 ============== */}
              <H2 id="sec-examples">8. 实战示例</H2>
              <H3>8.1 订单号生成</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private IAutoIdService autoIdService;

    public String generateOrderNo() {
        // 生成格式：ORD20260227000001
        return "ORD" + autoIdService.createDateIncrementId("order");
    }

    public String generateRefundNo() {
        // 生成格式：REF2026022714000001
        return "REF" + autoIdService.createDateHourIncrementId("refund");
    }
}`}</CodeBlock>

              <H3>8.2 多业务独立编号</H3>
              <CodeBlock lang="java">{`@Service
public class CodeGenerator {

    @Resource
    private IAutoIdService autoIdService;

    public String generateUserCode() {
        // 用户编码：U000001（全局递增，不归零）
        return "U" + autoIdService.createIncrementId("user");
    }

    public String generateInvoiceNo() {
        // 发票号：INV20260227-00000001（日期+8位序号，每日归零）
        String dateId = autoIdService.createDateIncrementId("invoice", 8);
        return "INV" + dateId.substring(0, 8) + "-" + dateId.substring(8);
    }
}`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-best">9. 最佳实践</H2>
              <TipBox title="BEST PRACTICE">
                <Strong>合理使用分类（category）</Strong>：不同业务使用不同分类名，避免 ID 序号空间冲突，如 <InlineCode>{'"order"'}</InlineCode>、<InlineCode>{'"user"'}</InlineCode>、<InlineCode>{'"payment"'}</InlineCode> 等。
              </TipBox>
              <P>
                <Strong>选择合适的 ID 模式：</Strong>
              </P>
              <DocTable
                headers={["场景", "推荐模式"]}
                rows={[
                  ["需要全局唯一递增", "createIncrementId"],
                  ["需要按日区分且可读性强", "createDateIncrementId"],
                  ["高频业务需要更细粒度归零", "createDateHourIncrementId"],
                ]}
              />
              <WarnBox>
                根据业务量预估日/小时最大 ID 数，设置足够的 <InlineCode>length</InlineCode>，避免溢出指定位数。默认 6 位最多支持 999999 条/周期。该组件依赖 Redis <Highlight>原子操作</Highlight>，请确保 Redis 服务高可用，避免 ID 生成中断。
              </WarnBox>

              {/* ============== 10. 包结构 ============== */}
              <H2 id="sec-packages">10. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.autoId.redis
├── config
│   └── RedisAutoIdConfig.java            # Spring Boot 自动配置类
├── properties
│   └── RedisAutoIdProperties.java        # 配置属性绑定类
└── AutoIdRedisServiceImpl.java           # IAutoIdService 接口的 Redis 实现

com.mcst.eayfk.autoId.api
└── IAutoIdService.java                   # 自增 ID 服务接口定义（autoId-api 模块）`}</CodeBlock><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-autoid-redis — 基于 Redis 的分布式自增ID生成方案。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
