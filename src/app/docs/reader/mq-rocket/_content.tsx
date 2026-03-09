"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "消息发送" },
  { id: "sec-4", label: "实战示例" },
  { id: "sec-5", label: "RocketProducerHelper API" },
  { id: "sec-6", label: "RocketMessageUtil 工具类" },
  { id: "sec-7", label: "消息类型决策流程" },
  { id: "sec-8", label: "自动配置机制" },
  { id: "sec-9", label: "包结构" },
  { id: "sec-10", label: "最佳实践" },
]

export default function MqRocketDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="RocketMQ"
      title="easyfk-mq-rocket RocketMQ"
      subtitle="RocketMQ 消息队列 — 高可靠分布式消息"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>mq-rocket</InlineCode> 是 EasyFK 框架中基于 Apache RocketMQ 的消息队列组件。该模块基于 RocketMQ Spring Boot Starter，提供统一的消息发送 API（同步/异步）、三种消息类型（普通消息、延迟消息、顺序消息）、Tag 消息过滤、消息头自动注入，并与框架内 Kafka、RabbitMQ 组件共享 <InlineCode>CommonMessage</InlineCode> 消息模型，适用于高可靠消息传递、顺序消费、延迟任务、事件驱动等场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>mq-rocket</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:mq-rocket'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`rocketmq-spring-boot-starter` — RocketMQ Spring Boot 集成", "`mq-common` — EasyFK 通用消息模型（`CommonMessage`、`BaseMessage`）"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 启用模块</H3>

              

              <H3>3.2 基础配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      rocket:
        enable-rocket: true

rocketmq:
  name-server: 192.168.1.100:9876
  producer:
    group: my-producer-group
    send-message-timeout: 3000
    retry-times-when-send-failed: 2
    retry-times-when-send-async-failed: 2`}</CodeBlock>

              <H3>3.3 集群配置示例</H3>
              <CodeBlock lang="yaml">{`rocketmq:
  name-server: 192.168.1.100:9876;192.168.1.101:9876
  producer:
    group: order-producer-group
    send-message-timeout: 5000
    retry-times-when-send-failed: 3
    retry-times-when-send-async-failed: 3
    max-message-size: 4194304
    compress-message-body-threshold: 4096`}</CodeBlock>

              <H3>3.4 生产者配置参考</H3>

                            <DocTable
                headers={["`rocketmq.name-server`", "NameServer 地址（多个用 `;` 分隔）"]}
                rows={[
                  ["`rocketmq.producer.send-message-timeout`", "发送超时时间（毫秒）"],
                  ["`rocketmq.producer.retry-times-when-send-failed`", "同步发送失败重试次数"],
                  ["`rocketmq.producer.retry-times-when-send-async-failed`", "异步发送失败重试次数"],
                  ["`rocketmq.producer.max-message-size`", "最大消息体大小（字节）"],
                  ["`rocketmq.producer.compress-message-body-threshold`", "消息压缩阈值（字节）"],
                ]}
              />

              {/* ============== 4. 消息发送 ============== */}
              <H2 id="sec-3">4. 消息发送</H2>

              <H3>4.1 注入 RocketProducer</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RocketProducer rocketProducer;
}`}</CodeBlock>

              <H3>4.2 发送 API</H3>

                            <DocTable
                headers={["`syncSendMessage(message)`", "同步发送（阻塞等待 Broker 确认）"]}
                rows={[]}
              />
              <P>两个方法均根据 <InlineCode>CommonMessage</InlineCode> 字段自动识别消息类型：</P>

                            <DocTable
                headers={["`delayTime &gt; 0`", "延迟消息", "延迟指定毫秒后投递"]}
                rows={[
                  ["其他", "普通消息", "标准投递"],
                ]}
              />

              <H3>4.3 CommonMessage 消息结构</H3>
              <P><InlineCode>CommonMessage&lt;T&gt;</InlineCode> 是消息载体，继承自 <InlineCode>BaseMessage</InlineCode>：</P>

                            <DocTable
                headers={["`topic`", "String", "Topic", "目标 Topic"]}
                rows={[
                  ["`messageId`", "String", "Header: messageId", "消息 ID（为空时自动生成雪花 ID）"],
                  ["`messageKey`", "String", "hashKey（顺序消息）", "顺序消息路由键"],
                  ["`tags`", "String", "Topic 后缀（`topic:tags`）", "消息标签，用于消费端过滤"],
                  ["`sendTimestamp`", "Long", "Header: sendTimestamp", "发送时间戳（为空时自动填充）"],
                  ["`delayTime`", "Long", "延迟时间（毫秒）", "&gt; 0 时自动发送延迟消息"],
                ]}
              />

              <H3>4.4 Topic 与 Tag 映射规则</H3>
              <P>当设置了 <InlineCode>tags</InlineCode> 时，实际发送的 destination 为 <InlineCode>topic:tags</InlineCode> 格式：</P>
              <CodeBlock lang="plaintext">{`topic = "order-topic", tags = "ORDER_CREATED"
→ 实际 destination = "order-topic:ORDER_CREATED"`}</CodeBlock>
              <P>消费端可通过 Tag 进行消息过滤，只接收指定 Tag 的消息。</P>

              {/* ============== 5. 实战示例 ============== */}
              <H2 id="sec-4">5. 实战示例</H2>

              <H3>5.1 同步发送普通消息</H3>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setTopic("order-topic");
message.setData(orderDTO);

rocketProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.2 异步发送普通消息</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("notification-topic");
message.setData("用户注册成功");

rocketProducer.asyncSendMessage(message);`}</CodeBlock>

              <H3>5.3 发送带 Tag 的消息</H3>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setTopic("order-topic");
message.setData(orderDTO);
message.setTags("ORDER_CREATED");  // 消费端可按 Tag 过滤

rocketProducer.syncSendMessage(message);
// 实际 destination: order-topic:ORDER_CREATED`}</CodeBlock>

              <H3>5.4 发送延迟消息</H3>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setTopic("order-topic");
message.setData(orderDTO);
message.setDelayTime(30 * 60 * 1000L);  // 30 分钟后投递

rocketProducer.syncSendMessage(message);
// 自动识别 delayTime > 0，调用 syncSendDelayTimeMills`}</CodeBlock>

              <H3>5.5 发送顺序消息</H3>
              <P>相同 <InlineCode>messageKey</InlineCode> 的消息会被发送到同一个队列，保证消费顺序。</P>
              <CodeBlock lang="java">{`String orderId = "ORD_001";

// 消息 1：创建订单
CommonMessage<String> msg1 = new CommonMessage<>();
msg1.setTopic("order-topic");
msg1.setData("订单创建");
msg1.setMessageKey(orderId);
rocketProducer.syncSendMessage(msg1);

// 消息 2：支付成功
CommonMessage<String> msg2 = new CommonMessage<>();
msg2.setTopic("order-topic");
msg2.setData("支付成功");
msg2.setMessageKey(orderId);
rocketProducer.syncSendMessage(msg2);

// 消息 3：发货完成
CommonMessage<String> msg3 = new CommonMessage<>();
msg3.setTopic("order-topic");
msg3.setData("发货完成");
msg3.setMessageKey(orderId);
rocketProducer.syncSendMessage(msg3);

// 三条消息按顺序消费：创建订单 → 支付成功 → 发货完成`}</CodeBlock>

              <H3>5.6 消费普通消息</H3>
              <CodeBlock lang="java">{`@Component
@RocketMQMessageListener(
    topic = "order-topic",
    consumerGroup = "order-consumer-group"
)
public class OrderConsumer implements RocketMQListener<OrderDTO> {

    @Override
    public void onMessage(OrderDTO order) {
        // 处理订单
    }
}`}</CodeBlock>

              <H3>5.7 消费带 Tag 过滤的消息</H3>
              <CodeBlock lang="java">{`@Component
@RocketMQMessageListener(
    topic = "order-topic",
    consumerGroup = "order-created-consumer-group",
    selectorExpression = "ORDER_CREATED || ORDER_PAID"  // 只消费指定 Tag
)
public class OrderCreatedConsumer implements RocketMQListener<OrderDTO> {

    @Override
    public void onMessage(OrderDTO order) {
        // 只处理 ORDER_CREATED 和 ORDER_PAID 标签的消息
    }
}`}</CodeBlock>

              <H3>5.8 消费顺序消息</H3>
              <CodeBlock lang="java">{`@Component
@RocketMQMessageListener(
    topic = "order-topic",
    consumerGroup = "order-orderly-consumer-group",
    consumeMode = ConsumeMode.ORDERLY  // 顺序消费模式
)
public class OrderOrderlyConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String message) {
        // 按顺序消费消息
    }
}`}</CodeBlock>

              <H3>5.9 使用 RocketMessageUtil 获取消息头</H3>
              <CodeBlock lang="java">{`@Component
@RocketMQMessageListener(
    topic = "order-topic",
    consumerGroup = "order-consumer-group"
)
public class OrderConsumer implements RocketMQListener<Message<OrderDTO>> {

    @Override
    public void onMessage(Message<OrderDTO> message) {
        // 获取消息头
        String messageId = RocketMessageUtil.getHeaderValue(message, "messageId", String.class);
        Long timestamp = RocketMessageUtil.getHeaderValue(message, "sendTimestamp", Long.class);

        // 获取消息体
        OrderDTO order = message.getPayload();
    }
}`}</CodeBlock>

              <H3>5.10 使用 RocketProducerHelper（底层 API）</H3>
              <CodeBlock lang="java">{`@Resource
private RocketProducerHelper rocketProducerHelper;

Message<OrderDTO> message = MessageBuilder.withPayload(orderDTO)
    .setHeader("customKey", "customValue")
    .build();

// 同步发送
rocketProducerHelper.syncSendMessage("order-topic", message);

// 异步发送
rocketProducerHelper.asyncSendMessage("order-topic", message);

// 延迟消息
rocketProducerHelper.sendDelayMessage("order-topic", message, 60000L);

// 同步顺序消息
rocketProducerHelper.syncSendOrderlyMessage("order-topic", message, "orderId-001");

// 异步顺序消息
rocketProducerHelper.asyncSendOrderlyMessage("order-topic", message, "orderId-001");`}</CodeBlock>

              {/* ============== 6. RocketProducerHelper API ============== */}
              <H2 id="sec-5">6. RocketProducerHelper API</H2>

                            <DocTable
                headers={["`syncSendMessage(topic, message)`", "同步发送普通消息"]}
                rows={[
                  ["`sendDelayMessage(topic, message, delayTime)`", "发送延迟消息（毫秒级精度）"],
                  ["`syncSendOrderlyMessage(topic, message, hashKey)`", "同步发送顺序消息"],
                  ["`asyncSendOrderlyMessage(topic, message, hashKey)`", "异步发送顺序消息"],
                ]}
              />

              {/* ============== 7. RocketMessageUtil 工具类 ============== */}
              <H2 id="sec-6">7. RocketMessageUtil 工具类</H2>

              

              {/* ============== 8. 消息类型决策流程 ============== */}
              <H2 id="sec-7">8. 消息类型决策流程</H2>
              <CodeBlock lang="plaintext">{`CommonMessage 传入
       │
       ├── delayTime > 0 ？
       │       └── 是 → 发送延迟消息（syncSendDelayTimeMills）
       │
       ├── messageKey 不为空 ？
       │       └── 是 → 发送顺序消息（syncSendOrderly / asyncSendOrderly）
       │
       └── 其他 → 发送普通消息（syncSend / asyncSend）`}</CodeBlock>
              <P>&gt; 延迟消息优先级最高。当同时设置了 <InlineCode>delayTime</InlineCode> 和 <InlineCode>messageKey</InlineCode> 时，按延迟消息处理。</P>

              {/* ============== 9. 自动配置机制 ============== */}
              <H2 id="sec-8">9. 自动配置机制</H2>

              
              <P>自动注册的 Bean：</P>

                            <DocTable
                headers={["`rocketMQProducer`", "`RocketProducer`", "消息生产者（核心 API）"]}
                rows={[]}
              />
              <P>所有 Bean 均支持 <InlineCode>@ConditionalOnMissingBean</InlineCode>，可自定义覆盖。<InlineCode>RocketMQTemplate</InlineCode> 由 <InlineCode>rocketmq-spring-boot-starter</InlineCode> 自动配置提供。</P>

              {/* ============== 10. 包结构 ============== */}
              <H2 id="sec-9">10. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.mq.rocket
├── config
│   └── RocketMqConfig.java              # 自动配置（注册 Producer Bean）
├── producer
│   ├── RocketProducer.java              # 消息生产者（核心 API：普通/延迟/顺序，同步/异步）
│   └── RocketProducerHelper.java        # 生产者辅助类（底层 RocketMQTemplate 封装）
├── properties
│   └── KafkaMqProperties.java           # 配置属性类（enable-rocket 开关）
└── util
    └── RocketMessageUtil.java           # 消息工具类（Header 获取）`}</CodeBlock>

              {/* ============== 11. 最佳实践 ============== */}
              <H2 id="sec-10">11. 最佳实践</H2>
              <P>1. <Strong>合理使用消息类型</Strong>：</P>
              <BulletList items={["**普通消息**：无顺序要求的场景（通知、日志）", "**顺序消息**：状态流转有先后关系的场景（订单状态变更）", "**延迟消息**：需要定时触发的场景（订单超时取消）"]} />
              <P>2. <Strong>Tag 过滤</Strong>：同一 Topic 下使用 Tag 区分消息类别，消费端通过 <InlineCode>selectorExpression</InlineCode> 过滤，减少无效消费。</P>
              <P>3. <Strong>顺序消息的 messageKey</Strong>：使用业务 ID（如订单号）作为 messageKey，确保同一业务的消息路由到同一队列。</P>
              <P>4. <Strong>生产者组命名</Strong>：每个应用使用唯一的 producer group，避免冲突。</P>
              <P>5. <Strong>消费者组命名</Strong>：每个消费场景使用独立的 consumer group。</P>
              <P>6. <Strong>重试与超时</Strong>：生产环境建议适当增大 <InlineCode>send-message-timeout</InlineCode> 和重试次数。</P>
              <P>7. <Strong>统一消息模型</Strong>：使用 <InlineCode>CommonMessage</InlineCode> 发送，便于在 Kafka / RabbitMQ 之间切换。</P>
              <P>8. <Strong>消息幂等</Strong>：消费端必须做幂等处理，RocketMQ 默认 <InlineCode>at-least-once</InlineCode> 语义，可能重复投递。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-mq-rocket — 高可靠分布式消息队列集成方案。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
