"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-quickstart", label: "快速开始" },
  { id: "sec-config", label: "配置详解" },
  { id: "sec-api", label: "核心 API 详解" },
  { id: "sec-strategy", label: "消费策略详解" },
  { id: "sec-scenarios", label: "典型使用场景" },
  { id: "sec-pitfalls", label: "注意事项与常见陷阱" },
  { id: "sec-performance", label: "性能优化指南" },
  { id: "sec-ops", label: "运维与监控" },
  { id: "sec-faq", label: "FAQ 常见问题" },
  { id: "sec-appendix", label: "附录" },
]

export default function ChronicleQueueContent() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Chronicle Queue"
      title="Chronicle Queue 组件开发手册"
      subtitle="高性能持久化消息队列 · 零 GC · 微秒级延迟"
      readingTime="~25 min"
    >

              <P>
                本手册面向使用 EasyFK 框架的开发人员，详细介绍 <InlineCode>chronicle-queue</InlineCode> 组件的接入方式、配置说明、API 用法、最佳实践及常见问题。
              </P>

              {/* ============== 一、快速开始 ============== */}
              <H2 id="sec-quickstart">一、快速开始</H2>

              <H3>1.1 引入依赖</H3>
              <P><Strong>Gradle 方式</Strong>（在业务模块的 <InlineCode>build.gradle</InlineCode> 中添加）：</P>
              <CodeBlock lang="groovy">{`dependencies {
    implementation("com.mcst:chronicle-queue")
}`}</CodeBlock>
              <P><Strong>Maven 方式</Strong>（在业务模块的 <InlineCode>pom.xml</InlineCode> 中添加）：</P>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>chronicle-queue</artifactId>
</dependency>`}</CodeBlock>
              <TipBox>
                版本由 EasyFK BOM（<InlineCode>com.mcst:easyfk-dependencies</InlineCode>）统一管理，无需手动指定版本号。如果项目未引入 BOM，需在 Maven 中先声明：
              </TipBox>
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

              <H3>1.2 最小化配置</H3>
              <P><Strong>零配置即可使用</Strong>。组件提供了合理的默认值：</P>
              <DocTable
                headers={["配置项", "默认值", "说明"]}
                rows={[
                  ["存储路径", "./chronicle-queues", "队列文件存储根目录"],
                  ["滚动周期", "FAST_DAILY", "每天滚动生成新文件"],
                  ["块大小", "0（使用 Chronicle 默认）", "内存映射文件块大小"],
                ]}
              />
              <P>如果默认值满足需求，不需要任何 YAML 配置，直接注入 <InlineCode>ChronicleQueueTemplate</InlineCode> 即可开始使用。</P>

              <H3>1.3 第一个示例</H3>
              <CodeBlock lang="java">{`import com.easyfk.chronicle.queue.template.ChronicleQueueTemplate;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    @Resource
    private ChronicleQueueTemplate chronicleQueueTemplate;

    public void demo() {
        long index = chronicleQueueTemplate.writeText("my-queue", "Hello Chronicle Queue!");
        String message = chronicleQueueTemplate.readText("my-queue", "my-consumer");
        System.out.println("写入索引: " + index);
        System.out.println("读取到: " + message);
    }
}`}</CodeBlock>
              <TipBox>
                <Strong>关键点</Strong>：队列 <InlineCode>my-queue</InlineCode> 不需要预先创建，首次使用时会自动创建并初始化。
              </TipBox>

              {/* ============== 二、配置详解 ============== */}
              <H2 id="sec-config">二、配置详解</H2>

              <H3>2.1 全局默认配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    storage:
      queue:
        default-path: ./chronicle-queues
        default-roll-cycle: FAST_DAILY
        default-block-size: 0
        create-directories-on-startup: true`}</CodeBlock>

              <H3>2.2 多队列预定义</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    storage:
      queue:
        default-path: /data/chronicle-queues
        default-roll-cycle: FAST_DAILY
        queues:
          - queue-name: order-events
            path: /data/chronicle-queues/orders
            roll-cycle: FAST_HOURLY
            block-size: 67108864
          - queue-name: log-buffer
            roll-cycle: FIVE_MINUTELY
          - queue-name: metrics
            roll-cycle: TEN_MINUTELY`}</CodeBlock>
              <P><Strong>字段说明：</Strong></P>
              <DocTable
                headers={["字段", "必填", "说明"]}
                rows={[
                  ["queue-name", "是", "队列唯一标识，用于后续 API 调用"],
                  ["path", "否", "自定义存储路径，不配置则为 defaultPath/queueName"],
                  ["roll-cycle", "否", "覆盖全局默认滚动周期"],
                  ["block-size", "否", "覆盖全局默认块大小，0 表示使用全局默认"],
                ]}
              />

              <H3>2.3 配置优先级</H3>
              <CodeBlock lang="plaintext">{`队列定义中的 path / rollCycle / blockSize
        ↓ 未配置则使用
全局默认 defaultPath / defaultRollCycle / defaultBlockSize
        ↓ 未配置则使用
内置默认值 (./chronicle-queues / FAST_DAILY / Chronicle 内部默认)`}</CodeBlock>

              <H3>2.4 滚动周期说明</H3>
              <DocTable
                headers={["滚动周期", "切割频率", "适用场景"]}
                rows={[
                  ["FAST_DAILY", "每天", "默认推荐，适合大多数场景"],
                  ["FAST_HOURLY", "每小时", "高吞吐场景，便于按小时归档清理"],
                  ["FIVE_MINUTELY", "每 5 分钟", "超高吞吐，需要更细粒度文件切割"],
                  ["TEN_MINUTELY", "每 10 分钟", "高吞吐场景"],
                  ["TWENTY_MINUTELY", "每 20 分钟", "中高吞吐场景"],
                  ["HALF_HOURLY", "每 30 分钟", "中等吞吐场景"],
                  ["WEEKLY", "每周", "低吞吐场景，减少文件数量"],
                ]}
              />
              <TipBox>
                <Strong>选型建议</Strong>：写入频率越高，应选择越短的滚动周期，以避免单个文件过大。大多数场景使用默认的 <InlineCode>FAST_DAILY</InlineCode> 即可。
              </TipBox>

              {/* ============== 三、核心 API 详解 ============== */}
              <H2 id="sec-api">三、核心 API 详解</H2>
              <P>组件提供两个核心类，推荐优先使用 <InlineCode>ChronicleQueueTemplate</InlineCode>：</P>

              <H3>3.1 ChronicleQueueTemplate（推荐）</H3>
              <CodeBlock lang="java">{`@Resource
private ChronicleQueueTemplate chronicleQueueTemplate;`}</CodeBlock>

              <H4>3.1.1 写入方法</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["writeText(queueName, text)", "队列名, 文本", "long（索引）", "写入纯文本消息"],
                  ["writeDocument(queueName, writer)", "队列名, Consumer<WireOut>", "long（索引）", "写入结构化数据"],
                  ["writeKeyValue(queueName, key, value)", "队列名, 键, 值", "long（索引）", "写入键值对"],
                ]}
              />

              <H4>3.1.2 读取方法（命名 Tailer，自动记录位置）</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["readText(queueName, tailerId)", "队列名, 消费者ID", "String 或 null", "读取下一条文本（RESUME 策略）"],
                  ["readText(queueName, tailerId, strategy)", "队列名, 消费者ID, 策略", "String 或 null", "指定策略读取文本"],
                  ["readDocument(queueName, tailerId, reader)", "队列名, 消费者ID, 读取函数", "T 或 null", "读取结构化数据（RESUME 策略）"],
                  ["readDocument(queueName, tailerId, strategy, reader)", "队列名, 消费者ID, 策略, 读取函数", "T 或 null", "指定策略读取结构化数据"],
                  ["readTextBatch(queueName, tailerId, maxCount)", "队列名, 消费者ID, 最大条数", "List<String>", "批量读取文本（RESUME 策略）"],
                  ["readTextBatch(queueName, tailerId, maxCount, strategy)", "队列名, 消费者ID, 最大条数, 策略", "List<String>", "指定策略批量读取"],
                  ["readDocumentBatch(queueName, tailerId, maxCount, reader)", "队列名, 消费者ID, 最大条数, 读取函数", "List<T>", "批量读取结构化数据"],
                  ["readDocumentBatch(queueName, tailerId, maxCount, strategy, reader)", "全部参数", "List<T>", "指定策略批量读取结构化数据"],
                ]}
              />

              <H4>3.1.3 查看方法（不影响消费位置）</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["peekLastText(queueName)", "队列名", "String 或 null", "查看最后一条消息"],
                  ["peekFirstText(queueName)", "队列名", "String 或 null", "查看第一条消息"],
                  ["peekTextAtIndex(queueName, index)", "队列名, 索引", "String 或 null", "查看指定索引消息"],
                ]}
              />

              <H4>3.1.4 位置控制方法</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["toEnd(queueName, tailerId)", "队列名, 消费者ID", "void", "跳到队列末尾"],
                  ["toStart(queueName, tailerId)", "队列名, 消费者ID", "void", "跳到队列开头"],
                  ["moveToIndex(queueName, tailerId, index)", "队列名, 消费者ID, 索引", "boolean", "移动到指定索引"],
                  ["getTailerIndex(queueName, tailerId)", "队列名, 消费者ID", "long", "获取当前位置索引"],
                ]}
              />

              <H4>3.1.5 队列信息方法</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["queueExists(queueName)", "队列名", "boolean", "检查队列是否存在"],
                  ["getAllQueueNames()", "无", "Set<String>", "获取所有队列名称"],
                ]}
              />

              <H4>3.1.6 原生对象访问（高级）</H4>
              <DocTable
                headers={["方法", "参数", "返回值", "说明"]}
                rows={[
                  ["getAppender(queueName)", "队列名", "ExcerptAppender", "获取原生写入器"],
                  ["createTailer(queueName)", "队列名", "ExcerptTailer", "创建匿名读取器"],
                  ["createTailer(queueName, tailerId)", "队列名, 消费者ID", "ExcerptTailer", "创建命名读取器"],
                  ["getQueue(queueName)", "队列名", "ChronicleQueue", "获取底层队列实例"],
                ]}
              />

              <H3>3.2 ChronicleQueueManager（高级）</H3>
              <CodeBlock lang="java">{`@Resource
private ChronicleQueueManager chronicleQueueManager;`}</CodeBlock>
              <DocTable
                headers={["方法", "说明"]}
                rows={[
                  ["getOrCreateQueue(queueName)", "获取或创建队列（默认配置）"],
                  ["getOrCreateQueue(queueName, path, rollCycle, blockSize)", "获取或创建队列（自定义配置）"],
                  ["registerQueue(queueName, queue)", "注册外部创建的队列实例"],
                  ["getQueue(queueName)", "获取已有队列，不存在返回 null"],
                  ["removeQueue(queueName)", "移除并关闭队列"],
                  ["containsQueue(queueName)", "检查队列是否存在"],
                  ["getQueueNames()", "获取所有队列名称"],
                  ["getAppender(queueName)", "获取写入器"],
                  ["createTailer(queueName)", "创建匿名读取器"],
                  ["createTailer(queueName, tailerId)", "创建命名读取器"],
                  ["closeAll()", "关闭所有队列"],
                ]}
              />

              {/* ============== 四、消费策略详解 ============== */}
              <H2 id="sec-strategy">四、消费策略详解</H2>

              <H3>4.1 四种消费策略</H3>
              <P><InlineCode>TailerStartStrategy</InlineCode> 枚举控制命名 Tailer 的起始读取位置，概念类似于 Kafka 的 <InlineCode>auto.offset.reset</InlineCode>：</P>

              <H4>START — 每次从头开始</H4>
              <CodeBlock lang="java">{`String msg = template.readText("my-queue", "replay-consumer", TailerStartStrategy.START);`}</CodeBlock>
              <P><Strong>使用场景</Strong>：数据重放、全量统计、测试验证。</P>

              <H4>END — 每次从尾开始</H4>
              <CodeBlock lang="java">{`String msg = template.readText("my-queue", "realtime-consumer", TailerStartStrategy.END);`}</CodeBlock>
              <P><Strong>使用场景</Strong>：实时监控面板、只关注增量数据。</P>

              <H4>RESUME — 恢复位置，首次从头（默认）</H4>
              <CodeBlock lang="java">{`String msg = template.readText("my-queue", "normal-consumer");
// 等价于
String msg = template.readText("my-queue", "normal-consumer", TailerStartStrategy.RESUME);`}</CodeBlock>
              <P><Strong>使用场景</Strong>：常规业务消费，确保不丢消息，类似 Kafka <InlineCode>auto.offset.reset=earliest</InlineCode>。</P>

              <H4>RESUME_LATEST — 恢复位置，首次从尾</H4>
              <CodeBlock lang="java">{`String msg = template.readText("my-queue", "new-consumer", TailerStartStrategy.RESUME_LATEST);`}</CodeBlock>
              <P><Strong>使用场景</Strong>：新上线的监控服务，不需要处理历史积压，只关心新消息。类似 Kafka <InlineCode>auto.offset.reset=latest</InlineCode>。</P>

              <H3>4.2 策略选型指南</H3>
              <CodeBlock lang="plaintext">{`是否需要回溯历史数据？
├── 是 → 每次都需要全量重放吗？
│   ├── 是 → START
│   └── 否 → RESUME（首次从头，之后续读）
└── 否 → 是新消费者还是已有消费者？
    ├── 新消费者，不关心历史 → RESUME_LATEST
    └── 只要实时数据，不需要续读 → END`}</CodeBlock>

              <H3>4.3 多消费者模式</H3>
              <CodeBlock lang="java">{`// 消费者 A：处理订单
String orderMsg = template.readText("events", "order-processor");

// 消费者 B：记录审计日志（独立进度）
String auditMsg = template.readText("events", "audit-logger");

// 消费者 C：实时统计（只关注新数据）
String statMsg = template.readText("events", "stat-collector", TailerStartStrategy.RESUME_LATEST);`}</CodeBlock>
              <WarnBox>
                <Strong>重要</Strong>：<InlineCode>tailerId</InlineCode> 是消费位置的唯一标识。相同的 <InlineCode>tailerId</InlineCode> 共享同一个读取位置，不同 <InlineCode>tailerId</InlineCode> 完全独立。
              </WarnBox>

              {/* ============== 五、典型使用场景 ============== */}
              <H2 id="sec-scenarios">五、典型使用场景</H2>

              <H3>5.1 写入文本消息</H3>
              <CodeBlock lang="java">{`long index = template.writeText("order-events", "ORDER_CREATED:12345");
log.info("消息已写入，索引: {}", index);`}</CodeBlock>

              <H3>5.2 写入结构化数据</H3>
              <CodeBlock lang="java">{`long index = template.writeDocument("user-events", (WireOut wire) -> {
    wire.write("eventType").text("USER_LOGIN");
    wire.write("userId").int64(10001L);
    wire.write("username").text("zhangsan");
    wire.write("loginTime").int64(System.currentTimeMillis());
    wire.write("ip").text("192.168.1.100");
});`}</CodeBlock>

              <H3>5.3 写入键值对</H3>
              <CodeBlock lang="java">{`template.writeKeyValue("config-changes", "db.maxPoolSize", "50");
template.writeKeyValue("config-changes", "cache.ttl", "3600");`}</CodeBlock>

              <H3>5.4 单条消费</H3>
              <CodeBlock lang="java">{`String msg = template.readText("order-events", "order-handler");
if (msg != null) {
    processOrder(msg);
}`}</CodeBlock>

              <H3>5.5 批量消费</H3>
              <CodeBlock lang="java">{`List<String> messages = template.readTextBatch("order-events", "batch-handler", 100);
if (!messages.isEmpty()) {
    log.info("本批次读取 {} 条消息", messages.size());
    messages.forEach(this::processOrder);
}`}</CodeBlock>
              <P><Strong>结合定时任务实现持续消费：</Strong></P>
              <CodeBlock lang="java">{`@Scheduled(fixedDelay = 100)
public void consumeOrders() {
    List<String> batch = template.readTextBatch("order-events", "scheduled-consumer", 200);
    batch.forEach(this::processOrder);
}`}</CodeBlock>

              <H3>5.6 结构化数据消费</H3>
              <CodeBlock lang="java">{`UserLoginEvent event = template.readDocument("user-events", "event-handler", wire -> {
    String eventType = wire.read("eventType").text();
    long userId = wire.read("userId").int64();
    String username = wire.read("username").text();
    long loginTime = wire.read("loginTime").int64();
    String ip = wire.read("ip").text();
    return new UserLoginEvent(eventType, userId, username, loginTime, ip);
});

List<UserLoginEvent> events = template.readDocumentBatch(
    "user-events", "batch-event-handler", 50,
    wire -> {
        return new UserLoginEvent(
            wire.read("eventType").text(),
            wire.read("userId").int64(),
            wire.read("username").text(),
            wire.read("loginTime").int64(),
            wire.read("ip").text()
        );
    }
);`}</CodeBlock>

              <H3>5.7 查看消息（不移动消费位置）</H3>
              <CodeBlock lang="java">{`String latest = template.peekLastText("order-events");
String earliest = template.peekFirstText("order-events");
String specific = template.peekTextAtIndex("order-events", 86400000000001L);`}</CodeBlock>
              <TipBox>
                <Strong>典型用途</Strong>：管理后台展示队列最新/最早消息、调试时检查特定消息内容。
              </TipBox>

              <H3>5.8 消费位置控制</H3>
              <CodeBlock lang="java">{`template.toEnd("order-events", "my-consumer");
template.toStart("order-events", "my-consumer");
boolean success = template.moveToIndex("order-events", "my-consumer", targetIndex);
long currentIndex = template.getTailerIndex("order-events", "my-consumer");`}</CodeBlock>

              <H3>5.9 高级用法：直接操作原生对象</H3>
              <CodeBlock lang="java">{`ExcerptAppender appender = template.getAppender("high-freq-queue");
for (int i = 0; i < 1_000_000; i++) {
    appender.writeText("message-" + i);
}

ExcerptTailer tailer = template.createTailer("high-freq-queue", "raw-consumer");
while (true) {
    String text = tailer.readText();
    if (text == null) break;
}

ChronicleQueue queue = template.getQueue("my-queue");
long lastIndex = queue.lastIndex();`}</CodeBlock>

              {/* ============== 六、注意事项与常见陷阱 ============== */}
              <H2 id="sec-pitfalls">六、注意事项与常见陷阱</H2>

              <H3>6.1 队列名称必须唯一且稳定</H3>
              <BulletList items={[
                <>队列名称（<InlineCode>queueName</InlineCode>）是队列的唯一标识，映射到磁盘上的目录</>,
                <><Strong>不要在运行时动态修改队列名称</Strong>，否则会导致创建新队列、丢失旧数据</>,
              ]} />

              <H3>6.2 tailerId 命名规范</H3>
              <BulletList items={[
                <><InlineCode>tailerId</InlineCode> 决定了消费位置的持久化键，<Strong>不同业务逻辑必须使用不同的 tailerId</Strong></>,
                <>推荐命名格式：<InlineCode>{"{服务名}-{业务功能}"}</InlineCode>，例如 <InlineCode>order-service-handler</InlineCode>、<InlineCode>audit-logger</InlineCode></>,
                <><Strong>相同 tailerId 的多个调用共享同一个读取位置</Strong></>,
              ]} />

              <H3>6.3 readText / readDocument 返回 null 的含义</H3>
              <P>返回 <InlineCode>null</InlineCode> 表示<Strong>当前没有更多消息可读</Strong>，并非错误：</P>
              <CodeBlock lang="java">{`String msg = template.readText("my-queue", "consumer");
if (msg == null) {
    return;
}

// 错误：不检查 null 直接使用
processMessage(template.readText("my-queue", "consumer")); // 可能 NPE！`}</CodeBlock>

              <H3>6.4 结构化数据读写字段顺序</H3>
              <P>使用 Wire 协议读写时，<Strong>读取字段的顺序必须与写入顺序一致</Strong>：</P>
              <CodeBlock lang="java">{`// 写入
template.writeDocument("queue", wire -> {
    wire.write("name").text("张三");
    wire.write("age").int32(25);
    wire.write("email").text("a@b.com");
});

// 读取 — 字段顺序必须一致
template.readDocument("queue", "consumer", wire -> {
    String name = wire.read("name").text();
    int age = wire.read("age").int32();
    String email = wire.read("email").text();
    return new User(name, age, email);
});`}</CodeBlock>

              <H3>6.5 不要手动关闭 Template 获取的对象</H3>
              <BulletList items={[
                <><Strong>不要手动调用</Strong> <InlineCode>queue.close()</InlineCode> 或 <InlineCode>appender.close()</InlineCode></>,
                "队列关闭由 Spring 容器销毁时自动处理",
              ]} />

              <H3>6.6 存储路径权限</H3>
              <BulletList items={[
                "确保应用进程对配置的存储路径有读写权限",
                <><Strong>避免将存储路径指向临时目录（如 <InlineCode>/tmp</InlineCode>）</Strong></>,
              ]} />

              <H3>6.7 文件数据不可手动编辑</H3>
              <BulletList items={[
                <>Chronicle Queue 的数据文件是二进制格式，<Strong>禁止手动编辑或截断</Strong></>,
                "如需清理历史数据，应在队列关闭后删除整个目录",
              ]} />

              <H3>6.8 懒加载行为</H3>
              <BulletList items={[
                <><InlineCode>ChronicleQueueManager</InlineCode> 的 Bean 使用 <InlineCode>@Lazy</InlineCode> 注解，只有在首次被使用时才会初始化</>,
                <>配置了 <InlineCode>queues</InlineCode> 预定义列表的队列会在 Manager 初始化时创建</>,
                "未预定义的队列在首次调用时自动创建",
              ]} />

              {/* ============== 七、性能优化指南 ============== */}
              <H2 id="sec-performance">七、性能优化指南</H2>

              <H3>7.1 批量操作优于单条操作</H3>
              <CodeBlock lang="java">{`// 低效
for (int i = 0; i < 100; i++) {
    String msg = template.readText("queue", "consumer");
    if (msg != null) process(msg);
}

// 高效
List<String> batch = template.readTextBatch("queue", "consumer", 100);
batch.forEach(this::process);`}</CodeBlock>

              <H3>7.2 高频写入使用原生 Appender</H3>
              <CodeBlock lang="java">{`ExcerptAppender appender = template.getAppender("high-freq-queue");
for (String data : largeDataSet) {
    appender.writeText(data);
}`}</CodeBlock>

              <H3>7.3 合理选择滚动周期</H3>
              <DocTable
                headers={["写入频率", "推荐滚动周期", "原因"]}
                rows={[
                  ["< 1000 条/天", "FAST_DAILY 或 WEEKLY", "减少文件数量"],
                  ["1K ~ 100K 条/天", "FAST_DAILY", "默认推荐"],
                  ["100K ~ 1M 条/天", "FAST_HOURLY", "单文件不会过大"],
                  ["> 1M 条/天", "FIVE_MINUTELY / TEN_MINUTELY", "控制单文件大小"],
                ]}
              />

              <H3>7.4 块大小调优</H3>
              <BulletList items={[
                "默认块大小由 Chronicle Queue 内部决定（通常为 64MB）",
                <>写入消息体较大时可适当增大 <InlineCode>blockSize</InlineCode></>,
                "内存受限环境可减小 blockSize（最小建议 16MB）",
              ]} />

              <H3>7.5 磁盘选型</H3>
              <BulletList items={[
                <><Strong>强烈推荐使用 SSD</Strong></>,
                "HDD 在高吞吐场景下会成为瓶颈",
                "网络存储（NFS/CIFS）需评估延迟影响",
              ]} />

              <H3>7.6 消费线程模型建议</H3>
              <CodeBlock lang="java">{`// 方案 A：定时任务拉取
@Scheduled(fixedDelay = 50)
public void consume() {
    List<String> batch = template.readTextBatch("queue", "consumer", 500);
    batch.forEach(this::process);
}

// 方案 B：独立线程轮询
@PostConstruct
public void startConsumer() {
    Thread consumer = new Thread(() -> {
        while (!Thread.currentThread().isInterrupted()) {
            String msg = template.readText("queue", "consumer");
            if (msg != null) {
                process(msg);
            } else {
                LockSupport.parkNanos(1_000_000);
            }
        }
    }, "chronicle-consumer");
    consumer.setDaemon(true);
    consumer.start();
}`}</CodeBlock>

              <H3>7.7 JVM 参数配置（重要）</H3>
              <P>Chronicle Queue 底层大量使用 <InlineCode>sun.misc.Unsafe</InlineCode>、堆外内存（mmap）和 JDK 内部 API。在 Java 21 的强封装模块系统下，<Strong>必须正确配置 JVM 参数</Strong>。</P>

              <H4>7.7.1 必需参数：Java 模块系统开放（Java 9+）</H4>
              <CodeBlock lang="plaintext">{`--add-exports=java.base/jdk.internal.ref=ALL-UNNAMED
--add-exports=java.base/sun.nio.ch=ALL-UNNAMED
--add-exports=java.base/jdk.internal.misc=ALL-UNNAMED
--add-exports=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED
--add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED

--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.lang.reflect=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
--add-opens=java.base/sun.nio.ch=ALL-UNNAMED
--add-opens=java.base/java.util=ALL-UNNAMED`}</CodeBlock>
              <P><Strong>在 Gradle 中配置：</Strong></P>
              <CodeBlock lang="groovy">{`tasks.withType(JavaExec).configureEach {
    jvmArgs(
        '--add-exports', 'java.base/jdk.internal.ref=ALL-UNNAMED',
        '--add-exports', 'java.base/sun.nio.ch=ALL-UNNAMED',
        '--add-exports', 'java.base/jdk.internal.misc=ALL-UNNAMED',
        '--add-exports', 'jdk.unsupported/sun.misc=ALL-UNNAMED',
        '--add-opens', 'java.base/java.lang=ALL-UNNAMED',
        '--add-opens', 'java.base/java.lang.reflect=ALL-UNNAMED',
        '--add-opens', 'java.base/java.io=ALL-UNNAMED',
        '--add-opens', 'java.base/sun.nio.ch=ALL-UNNAMED',
        '--add-opens', 'java.base/java.util=ALL-UNNAMED'
    )
}

tasks.withType(Test).configureEach {
    jvmArgs(
        '--add-exports', 'java.base/jdk.internal.ref=ALL-UNNAMED',
        '--add-exports', 'java.base/sun.nio.ch=ALL-UNNAMED',
        '--add-opens', 'java.base/java.lang=ALL-UNNAMED',
        '--add-opens', 'java.base/java.lang.reflect=ALL-UNNAMED',
        '--add-opens', 'java.base/java.io=ALL-UNNAMED',
        '--add-opens', 'java.base/sun.nio.ch=ALL-UNNAMED'
    )
}`}</CodeBlock>
              <P><Strong>在 Spring Boot 打包后运行（生产环境）：</Strong></P>
              <CodeBlock lang="bash">{`java \\
  --add-exports=java.base/jdk.internal.ref=ALL-UNNAMED \\
  --add-exports=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-exports=java.base/jdk.internal.misc=ALL-UNNAMED \\
  --add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED \\
  --add-opens=java.base/java.lang=ALL-UNNAMED \\
  --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \\
  --add-opens=java.base/java.io=ALL-UNNAMED \\
  --add-opens=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-opens=java.base/java.util=ALL-UNNAMED \\
  -jar your-application.jar`}</CodeBlock>
              <P><Strong>推荐做法</Strong>：将参数写入启动脚本或 Dockerfile：</P>
              <CodeBlock lang="bash">{`# start.sh
export JAVA_OPTS="--add-exports=java.base/jdk.internal.ref=ALL-UNNAMED \\
  --add-exports=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-exports=java.base/jdk.internal.misc=ALL-UNNAMED \\
  --add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED \\
  --add-opens=java.base/java.lang=ALL-UNNAMED \\
  --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \\
  --add-opens=java.base/java.io=ALL-UNNAMED \\
  --add-opens=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-opens=java.base/java.util=ALL-UNNAMED"

java $JAVA_OPTS -jar your-application.jar`}</CodeBlock>
              <CodeBlock lang="dockerfile">{`# Dockerfile
ENV JAVA_OPTS="--add-exports=java.base/jdk.internal.ref=ALL-UNNAMED \\
  --add-exports=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-exports=java.base/jdk.internal.misc=ALL-UNNAMED \\
  --add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED \\
  --add-opens=java.base/java.lang=ALL-UNNAMED \\
  --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \\
  --add-opens=java.base/java.io=ALL-UNNAMED \\
  --add-opens=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-opens=java.base/java.util=ALL-UNNAMED"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]`}</CodeBlock>

              <H4>7.7.2 内存相关参数</H4>
              <CodeBlock lang="plaintext">{`-Xms512m -Xmx2g
-XX:MaxDirectMemorySize=4g`}</CodeBlock>
              <P><Strong>关于 mmap 内存的误区</Strong>：</P>
              <BulletList items={[
                <>mmap 使用的是<Strong>操作系统页缓存</Strong>，不计入 Java 堆和直接内存</>,
                "操作系统会自动管理 mmap 的内存映射",
                <><Strong>不需要刻意为 mmap 预留 Java 内存</Strong></>,
                <>经验公式：<InlineCode>物理内存 &gt; Xmx + MaxDirectMemorySize + 活跃队列总数据量 + 操作系统开销</InlineCode></>,
              ]} />

              <H4>7.7.3 GC 调优建议</H4>
              <CodeBlock lang="plaintext">{`-XX:+UseZGC

# 或
-XX:+UseG1GC
-XX:MaxGCPauseMillis=50

# 或对延迟极度敏感
-XX:+UseShenandoahGC`}</CodeBlock>
              <TipBox>
                即使使用了 Chronicle Queue 的零 GC 写入，消费端反序列化仍会产生堆内存分配。
              </TipBox>

              <H4>7.7.4 操作系统级参数（Linux 生产环境）</H4>
              <CodeBlock lang="bash">{`ulimit -n 65536
sysctl -w vm.max_map_count=262144
sysctl -w vm.dirty_ratio=10
sysctl -w vm.dirty_background_ratio=5
swapoff -a`}</CodeBlock>

              <H4>7.7.5 大页内存（可选，高级优化）</H4>
              <CodeBlock lang="bash">{`echo 2048 > /proc/sys/vm/nr_hugepages`}</CodeBlock>
              <P>JVM 参数：</P>
              <CodeBlock lang="plaintext">{`-XX:+UseLargePages
-XX:LargePageSizeInBytes=2m`}</CodeBlock>

              <H4>7.7.6 完整 JVM 参数参考（生产环境推荐）</H4>
              <CodeBlock lang="bash">{`java \\
  --add-exports=java.base/jdk.internal.ref=ALL-UNNAMED \\
  --add-exports=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-exports=java.base/jdk.internal.misc=ALL-UNNAMED \\
  --add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED \\
  --add-opens=java.base/java.lang=ALL-UNNAMED \\
  --add-opens=java.base/java.lang.reflect=ALL-UNNAMED \\
  --add-opens=java.base/java.io=ALL-UNNAMED \\
  --add-opens=java.base/sun.nio.ch=ALL-UNNAMED \\
  --add-opens=java.base/java.util=ALL-UNNAMED \\
  -Xms1g -Xmx2g \\
  -XX:MaxDirectMemorySize=4g \\
  -XX:+UseZGC \\
  -jar your-application.jar`}</CodeBlock>

              <H4>7.7.7 常见 JVM 相关启动报错速查</H4>
              <DocTable
                headers={["报错信息", "原因", "解决方案"]}
                rows={[
                  ["InaccessibleObjectException", "缺少 --add-opens 参数", "添加 7.7.1 节的模块开放参数"],
                  ["IllegalAccessError: module java.base does not opens/exports", "缺少 --add-exports 参数", "添加 7.7.1 节的模块开放参数"],
                  ["java.io.IOException: Map failed", "vm.max_map_count 不够或内存不足", "sysctl -w vm.max_map_count=262144"],
                  ["Cannot allocate memory", "物理内存不足", "增加内存或减少队列数量/块大小"],
                  ["Too many open files", "文件描述符不够", "ulimit -n 65536"],
                  ["OutOfMemoryError: Direct buffer memory", "MaxDirectMemorySize 过小", "增大 -XX:MaxDirectMemorySize"],
                  ["java.lang.UnsatisfiedLinkError", "JNI 库缺失或架构不匹配", "确保 OS 架构与 JDK 一致"],
                ]}
              />

              {/* ============== 八、运维与监控 ============== */}
              <H2 id="sec-ops">八、运维与监控</H2>

              <H3>8.1 磁盘空间监控</H3>
              <BulletList items={[
                <>数据文件位于配置的 <InlineCode>path</InlineCode> 目录下</>,
                <>每个滚动周期生成一个 <InlineCode>.cq4</InlineCode> 文件</>,
                <>可通过定时任务删除过期的 <InlineCode>.cq4</InlineCode> 文件来释放空间</>,
              ]} />

              <H3>8.2 队列状态查看</H3>
              <CodeBlock lang="java">{`Set<String> names = template.getAllQueueNames();
log.info("当前活跃队列: {}", names);

long consumerIndex = template.getTailerIndex("order-events", "my-consumer");
log.info("消费者当前位置: {}", consumerIndex);

String latestMsg = template.peekLastText("order-events");`}</CodeBlock>

              <H3>8.3 优雅停机</H3>
              <P>组件内置了双重关闭机制：</P>
              <NumberList items={[
                <><Strong>Spring DisposableBean</Strong>：Spring 容器关闭时自动调用 <InlineCode>destroy()</InlineCode> 关闭所有队列</>,
                <><Strong>JVM ShutdownHook</Strong>：作为兜底机制</>,
              ]} />

              <H3>8.4 数据清理策略</H3>
              <CodeBlock lang="java">{`@Scheduled(cron = "0 0 3 * * ?")
public void cleanOldData() {
    File queueDir = new File("/data/chronicle-queues/order-events");
    File[] files = queueDir.listFiles((dir, name) -> name.endsWith(".cq4"));
    if (files == null) return;

    long cutoffTime = System.currentTimeMillis() - TimeUnit.DAYS.toMillis(7);
    for (File file : files) {
        if (file.lastModified() < cutoffTime) {
            if (file.delete()) {
                log.info("已清理过期队列文件: {}", file.getName());
            }
        }
    }
}`}</CodeBlock>
              <WarnBox>
                清理文件时确保对应时间段的消息已被所有消费者消费完毕。
              </WarnBox>

              {/* ============== 九、FAQ 常见问题 ============== */}
              <H2 id="sec-faq">九、FAQ 常见问题</H2>

              <H3>Q1: 队列是否支持分布式/多进程访问？</H3>
              <P>Chronicle Queue 支持<Strong>单写多读</Strong>的跨进程访问模式。<Strong>写入端建议只有一个进程</Strong>。如果需要分布式消息队列，请使用 Kafka 等专业方案。</P>

              <H3>Q2: 进程重启后消费位置会丢失吗？</H3>
              <P>不会。命名 Tailer 的读取位置由 Chronicle Queue 自动持久化到队列目录中。匿名 Tailer 的位置不会持久化。</P>

              <H3>Q3: 写入失败会抛异常吗？</H3>
              <P>会。磁盘空间不足、路径权限不足或 mmap 分配失败时会抛出异常。建议在关键业务路径中添加异常捕获。</P>

              <H3>Q4: 消息有大小限制吗？</H3>
              <P>单条消息受限于 <InlineCode>blockSize</InlineCode>，不建议超过块大小的 1/4。一般建议控制在 <Strong>1MB 以内</Strong>。</P>

              <H3>Q5: 如何实现消息的顺序消费？</H3>
              <P>Chronicle Queue 天然保证<Strong>写入顺序 = 读取顺序</Strong>（FIFO）。无需额外处理。</P>

              <H3>Q6: 可以删除队列中的某条消息吗？</H3>
              <P>不可以。Chronicle Queue 是<Strong>追加写入（Append-Only）</Strong>的数据结构。如需逻辑删除，写入&ldquo;删除标记&rdquo;消息。</P>

              <H3>Q7: 如何估算磁盘用量？</H3>
              <CodeBlock lang="plaintext">{`每日磁盘用量 ≈ 每日消息条数 × 平均消息大小 × 1.1（元数据开销约 10%）`}</CodeBlock>

              <H3>Q8: 队列可以动态创建吗？</H3>
              <P>可以。首次调用 <InlineCode>{`writeText("new-queue", "msg")`}</InlineCode> 时自动创建。也可通过 <InlineCode>ChronicleQueueManager.getOrCreateQueue()</InlineCode> 手动创建。</P>

              <H3>Q9: 与 chronicle-map 组件有什么区别？</H3>
              <DocTable
                headers={["维度", "chronicle-queue", "chronicle-map"]}
                rows={[
                  ["数据模型", "有序消息队列（FIFO）", "键值存储（Key-Value）"],
                  ["使用场景", "消息传递、事件溯源", "缓存、共享状态"],
                  ["读取方式", "顺序消费（Tailer）", "随机访问（Key 查找）"],
                  ["数据保留", "追加写入，不可删除", "可更新、可删除"],
                ]}
              />

              {/* ============== 附录 ============== */}
              <H2 id="sec-appendix">附录：完整配置示例</H2>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    storage:
      queue:
        default-path: /data/app/chronicle-queues
        default-roll-cycle: FAST_DAILY
        default-block-size: 0
        create-directories-on-startup: true
        queues:
          - queue-name: order-events
            path: /data/app/chronicle-queues/orders
            roll-cycle: FAST_HOURLY
            block-size: 134217728
          - queue-name: log-buffer
            roll-cycle: FIVE_MINUTELY
          - queue-name: metrics
            roll-cycle: TEN_MINUTELY
          - queue-name: audit-events`}</CodeBlock>

    </DocLayout>
  )
}
