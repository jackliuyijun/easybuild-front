"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "消息发送" },
  { id: "sec-4", label: "实战示例" },
  { id: "sec-5", label: "RabbitMessageUtil 工具类" },
  { id: "sec-6", label: "发布确认与返回回调" },
  { id: "sec-7", label: "自动配置机制" },
  { id: "sec-8", label: "包结构" },
  { id: "sec-9", label: "最佳实践" },
]

export default function MqRabbitDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="RabbitMQ"
      title="easyfk-mq-rabbit RabbitMQ"
      subtitle="RabbitMQ 消息队列 — 轻量级消息中间件"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>mq-rabbit</InlineCode> 是 EasyFK 框架中基于 RabbitMQ 的消息队列组件。该模块基于 Spring AMQP，提供统一的消息发送 API（同步/异步）、延迟消息支持（基于 <InlineCode>rabbitmq_delayed_message_exchange</InlineCode> 插件）、Jackson JSON 自动序列化、发布确认与返回回调机制，并与框架内 Kafka、RocketMQ 组件共享 <InlineCode>CommonMessage</InlineCode> 消息模型，适用于微服务解耦、异步通信、延迟任务、事件驱动等场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>mq-rabbit</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:mq-rabbit'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-boot-starter-amqp` — Spring AMQP 集成", "`mq-common` — EasyFK 通用消息模型（`CommonMessage`、`BaseMessage`）"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 启用模块</H3>

                            <DocTable
                headers={["`easyfk.config.mq.rabbit.enable-rabbit`", "Boolean", "`false`", "启用 RabbitMQ（**必须设为 `true`**）"]}
                rows={[
                  ["`easyfk.config.mq.rabbit.delay-exchange`", "String", "`easyfk.delay.exchange`", "延迟消息 Exchange 名称"],
                  ["`easyfk.config.mq.rabbit.confirm-callback`", "Boolean", "`false`", "是否启用发布确认回调"],
                  ["`easyfk.config.mq.rabbit.return-callback`", "Boolean", "`false`", "是否启用返回回调（消息无法路由时触发）"],
                ]}
              />

              <H3>3.2 基础配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      rabbit:
        enable-rabbit: true
        exchange: my-app.direct.exchange
        delay-exchange: my-app.delay.exchange
        confirm-callback: true
        return-callback: true

spring:
  rabbitmq:
    host: 192.168.1.100
    port: 5672
    username: guest
    password: guest
    virtual-host: /`}</CodeBlock>

              <H3>3.3 生产环境配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    mq:
      rabbit:
        enable-rabbit: true
        exchange: order.direct.exchange
        delay-exchange: order.delay.exchange
        confirm-callback: true
        return-callback: true

spring:
  rabbitmq:
    host: mq-cluster.internal
    port: 5672
    username: \${RABBIT_USER}
    password: \${RABBIT_PASSWORD}
    virtual-host: /production
    publisher-confirm-type: correlated
    publisher-returns: true
    listener:
      simple:
        acknowledge-mode: manual
        prefetch: 10
        concurrency: 5
        max-concurrency: 20
    connection-timeout: 10000`}</CodeBlock>

              {/* ============== 4. 消息发送 ============== */}
              <H2 id="sec-3">4. 消息发送</H2>

              <H3>4.1 注入 RabbitProducer</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RabbitProducer rabbitProducer;
}`}</CodeBlock>

              <H3>4.2 发送 API</H3>

                            <DocTable
                headers={["`syncSendMessage(message)`", "同步发送（阻塞等待 Broker 确认）"]}
                rows={[]}
              />
              <P>两个方法均自动识别延迟消息：当 <InlineCode>CommonMessage.delayTime &gt; 0</InlineCode> 时，自动路由到延迟交换机。</P>

              <H3>4.3 CommonMessage 消息结构</H3>
              <P><InlineCode>CommonMessage&lt;T&gt;</InlineCode> 是消息载体，继承自 <InlineCode>BaseMessage</InlineCode>：</P>

                            <DocTable
                headers={["`topic`", "String", "Exchange 名称", "为空时使用默认 Exchange"]}
                rows={[
                  ["`messageId`", "String", "MessageProperties.messageId", "消息 ID（为空时自动生成雪花 ID）"],
                  ["`messageKey`", "String", "RoutingKey（优先）", "分区路由键"],
                  ["`tags`", "String", "RoutingKey（次选）/ Header", "消息标签"],
                  ["`sendTimestamp`", "Long", "MessageProperties.timestamp", "发送时间戳（为空时自动填充）"],
                  ["`delayTime`", "Long", "x-delay Header", "延迟时间（毫秒），&gt; 0 时走延迟交换机"],
                  ["`properties`", "Map", "Headers", "自定义 Header 属性"],
                ]}
              />

              <H3>4.4 消息映射规则</H3>
              <P><Strong>Exchange 选择逻辑：</Strong></P>
              <P>1. <InlineCode>delayTime &gt; 0</InlineCode> → 使用 <InlineCode>delayExchange</InlineCode>（延迟交换机）</P>
              <P>2. <InlineCode>topic</InlineCode> 不为空 → 使用 <InlineCode>topic</InlineCode> 作为 Exchange</P>
              <P>3. 都为空 → 使用默认 <InlineCode>exchange</InlineCode>（配置文件中指定）</P>
              <P><Strong>RoutingKey 选择逻辑：</Strong></P>
              <P>1. <InlineCode>messageKey</InlineCode> 不为空 → 使用 <InlineCode>messageKey</InlineCode></P>
              <P>2. <InlineCode>tags</InlineCode> 不为空 → 使用 <InlineCode>tags</InlineCode></P>
              <P>3. 都为空 → 空字符串 <InlineCode>{'""'}</InlineCode></P>

              {/* ============== 5. 实战示例 ============== */}
              <H2 id="sec-4">5. 实战示例</H2>

              <H3>5.1 同步发送普通消息</H3>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setTopic("order.direct.exchange");
message.setData(orderDTO);
message.setMessageKey("order.created");
message.setTags("ORDER_CREATED");

rabbitProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.2 异步发送普通消息</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("notification.fanout.exchange");
message.setData("用户注册成功");
message.setMessageKey("user.registered");

rabbitProducer.asyncSendMessage(message);`}</CodeBlock>

              <H3>5.3 发送延迟消息</H3>
              <P>延迟消息需要 RabbitMQ 安装 <InlineCode>rabbitmq_delayed_message_exchange</InlineCode> 插件。</P>
              <CodeBlock lang="java">{`CommonMessage<OrderDTO> message = new CommonMessage<>();
message.setData(orderDTO);
message.setMessageKey("order.timeout.check");
message.setDelayTime(30 * 60 * 1000L);  // 30 分钟后发送

rabbitProducer.syncSendMessage(message);
// 自动识别 delayTime > 0，路由到延迟交换机`}</CodeBlock>

              <H3>5.4 自定义 Header 属性</H3>
              <CodeBlock lang="java">{`CommonMessage<String> message = new CommonMessage<>();
message.setTopic("event.topic.exchange");
message.setData("event data");
message.setTags("USER_EVENT");

Map<String, String> props = new HashMap<>();
props.put("source", "order-service");
props.put("traceId", "trace_12345");
message.setProperties(props);

rabbitProducer.syncSendMessage(message);`}</CodeBlock>

              <H3>5.5 消费消息</H3>
              <CodeBlock lang="java">{`@Component
public class OrderConsumer {

    @RabbitListener(queues = "order-queue")
    public void onMessage(OrderDTO order) {
        // Jackson 自动反序列化为 OrderDTO
        // 处理订单
    }
}`}</CodeBlock>

              <H3>5.6 消费原生 Message（获取 Header）</H3>
              <CodeBlock lang="java">{`@Component
public class OrderConsumer {

    @RabbitListener(queues = "order-queue")
    public void onMessage(Message message) {
        // 获取消息 ID
        String messageId = RabbitMessageUtil.getMessageId(message);

        // 获取时间戳
        Long timestamp = RabbitMessageUtil.getTimestamp(message);

        // 获取自定义 Header
        String traceId = RabbitMessageUtil.getHeaderValue(message, "traceId", String.class);

        // 获取消息体
        String body = RabbitMessageUtil.getBodyAsString(message);
    }
}`}</CodeBlock>

              <H3>5.7 使用 RabbitProducerHelper（底层 API）</H3>
              <P><InlineCode>RabbitProducerHelper</InlineCode> 提供更底层的发送方法，适用于需要精细控制的场景：</P>
              <CodeBlock lang="java">{`@Resource
private RabbitProducerHelper rabbitProducerHelper;

// 同步发送
rabbitProducerHelper.syncSendMessage("my-exchange", "my-routing-key", data);

// 同步发送（带关联数据）
CorrelationData correlationData = new CorrelationData("unique-id");
rabbitProducerHelper.syncSendMessage("my-exchange", "my-routing-key", data, correlationData);

// 异步发送
rabbitProducerHelper.asyncSendMessage("my-exchange", "my-routing-key", data);

// 延迟消息
rabbitProducerHelper.sendDelayMessage("delay-exchange", "my-routing-key", data, 60000L);

// 带自定义属性发送
MessageProperties props = new MessageProperties();
props.setMessageId("msg-001");
props.setHeader("customKey", "customValue");
rabbitProducerHelper.sendMessageWithProperties("my-exchange", "my-routing-key", data, props);

// 发送原生消息
Message rawMessage = new Message(body, messageProperties);
rabbitProducerHelper.sendRawMessage("my-exchange", "my-routing-key", rawMessage);`}</CodeBlock>

              {/* ============== 6. RabbitMessageUtil 工具类 ============== */}
              <H2 id="sec-5">6. RabbitMessageUtil 工具类</H2>

                            <DocTable
                headers={["`getHeaderValue(message, key, clazz)`", "`T`", "获取 Header 值（支持类型转换）"]}
                rows={[
                  ["`getTimestamp(message)`", "`Long`", "获取时间戳（毫秒）"],
                  ["`getBody(message)`", "`byte[]`", "获取消息体字节数组"],
                  ["`getBodyAsString(message)`", "`String`", "获取消息体字符串"],
                ]}
              />
              <P><InlineCode>getHeaderValue</InlineCode> 支持自动类型转换：</P>
              <BulletList items={["目标类型为 `String` → 调用 `toString()`", "目标类型为 `Long` 且值为 `Number` → 数值转换", "目标类型为 `Integer` 且值为 `Number` → 数值转换"]} />

              {/* ============== 7. 发布确认与返回回调 ============== */}
              <H2 id="sec-6">7. 发布确认与返回回调</H2>

              <H3>7.1 发布确认（Confirm Callback）</H3>
              <P>启用 <InlineCode>confirm-callback: true</InlineCode> 后，消息发送到 Exchange 后会触发确认回调：</P>
              <BulletList items={["**确认成功**：消息已到达 Exchange", "**确认失败**：消息未到达 Exchange，日志输出失败原因"]} />
              <P>&gt; 需同时配置 <InlineCode>spring.rabbitmq.publisher-confirm-type: correlated</InlineCode></P>

              <H3>7.2 返回回调（Return Callback）</H3>
              <P>启用 <InlineCode>return-callback: true</InlineCode> 后，当消息无法从 Exchange 路由到 Queue 时触发回调：</P>
              <BulletList items={["日志输出 Exchange、RoutingKey、replyCode、replyText"]} />
              <P>&gt; 需同时配置 <InlineCode>spring.rabbitmq.publisher-returns: true</InlineCode></P>

              {/* ============== 8. 自动配置机制 ============== */}
              <H2 id="sec-7">8. 自动配置机制</H2>

              
              <P>自动注册的 Bean：</P>

                            <DocTable
                headers={["`jsonMessageConverter`", "`Jackson2JsonMessageConverter`", "JSON 消息转换器"]}
                rows={[
                  ["`rabbitProducer`", "`RabbitProducer`", "消息生产者（核心 API）"],
                  ["`rabbitProducerHelper`", "`RabbitProducerHelper`", "生产者辅助类（底层 API）"],
                ]}
              />
              <P>所有 Bean 均支持 <InlineCode>@ConditionalOnMissingBean</InlineCode>，可自定义覆盖。</P>

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-8">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.mq.rabbit
├── config
│   └── RabbitMqConfig.java              # 自动配置（RabbitTemplate / 消息转换器 / 确认回调）
├── producer
│   ├── RabbitProducer.java              # 消息生产者（核心 API：同步/异步 + 延迟自动路由）
│   └── RabbitProducerHelper.java        # 生产者辅助类（底层 RabbitTemplate 封装）
├── properties
│   └── RabbitMqProperties.java          # 配置属性类
└── util
    └── RabbitMessageUtil.java           # 消息工具类（Header 提取 / 类型转换）`}</CodeBlock>

              {/* ============== 10. 最佳实践 ============== */}
              <H2 id="sec-9">10. 最佳实践</H2>
              <P>1. <Strong>Exchange 与 Queue 预先声明</Strong>：本组件只负责消息发送，Exchange、Queue、Binding 的声明建议在消费端通过 <InlineCode>@RabbitListener</InlineCode> 的 <InlineCode>bindings</InlineCode> 属性或 <InlineCode>@Bean</InlineCode> 声明。</P>
              <P>2. <Strong>合理选择 Exchange 类型</Strong>：</P>
              <BulletList items={["**Direct**：精确路由，适合点对点通信", "**Topic**：模式匹配路由，适合多级分类", "**Fanout**：广播，适合通知场景", "**Headers**：基于 Header 匹配路由"]} />
              <P>3. <Strong>启用发布确认</Strong>：生产环境建议开启 <InlineCode>confirm-callback</InlineCode> 和 <InlineCode>return-callback</InlineCode>，确保消息可靠投递。</P>
              <P>4. <Strong>延迟消息注意事项</Strong>：使用延迟消息前确保 RabbitMQ 安装了 <InlineCode>rabbitmq_delayed_message_exchange</InlineCode> 插件，并正确声明延迟交换机。</P>
              <P>5. <Strong>善用 messageKey</Strong>：将 messageKey 作为 RoutingKey，实现精确的消息路由。</P>
              <P>6. <Strong>消费者手动确认</Strong>：高可靠场景建议配置 <InlineCode>acknowledge-mode: manual</InlineCode>，处理完成后手动 ACK。</P>
              <P>7. <Strong>预取限制</Strong>：设置合理的 <InlineCode>prefetch</InlineCode> 值，避免消费者被大量消息淹没。</P>
              <P>8. <Strong>统一消息模型</Strong>：使用 <InlineCode>CommonMessage</InlineCode> 发送，便于未来在 Kafka / RocketMQ 之间切换。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-mq-rabbit — 轻量级消息中间件集成方案。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
