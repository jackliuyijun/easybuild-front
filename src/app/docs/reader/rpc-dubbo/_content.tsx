"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "工作原理" },
  { id: "sec-3", label: "SPI 注册机制" },
  { id: "sec-4", label: "使用指南" },
  { id: "sec-5", label: "配置说明" },
  { id: "sec-6", label: "上下文透传" },
  { id: "sec-7", label: "高级用法" },
  { id: "sec-8", label: "最佳实践" },
]

export default function RpcDubboDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Dubbo"
      title="easyfk-rpc-dubbo Dubbo"
      subtitle="Dubbo RPC — 高性能远程服务调用"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>rpc-dubbo</InlineCode> 是 EasyFK 框架中基于 Apache Dubbo 的高性能 RPC 远程调用组件。该模块集成了 Dubbo Spring Boot Starter 和 Nacos 注册中心，并通过自定义 <InlineCode>DubboFilter</InlineCode> 实现了 <Strong>TraceId 链路追踪透传</Strong>和 <Strong>AccessToken 身份凭证透传</Strong>，使 Dubbo 服务间的调用具备完整的上下文传递能力，同时在服务端调用完成后自动清理线程上下文，避免资源泄漏。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>rpc-dubbo</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:rpc-dubbo'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`dubbo-spring-boot-starter` — Apache Dubbo Spring Boot 集成", "`dubbo-registry-nacos` — Dubbo Nacos 注册中心适配", "`web-base` — EasyFK Web 基础模块（包含 `ContextDataManager` 等上下文管理能力）"]} />

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-2">3. 工作原理</H2>
              <P>rpc-dubbo 通过 Dubbo SPI 扩展机制注册 <InlineCode>DubboFilter</InlineCode>，在 Consumer（消费端）和 Provider（服务端）两侧自动激活，实现上下文的双向透传：</P>
              <CodeBlock lang="plaintext">{`Consumer 端                              Provider 端
┌────────────────────┐                   ┌────────────────────┐
│  业务代码发起调用    │                   │  接收 Dubbo 请求    │
│        │           │                   │        │           │
│        ▼           │                   │        ▼           │
│  DubboFilter       │   Dubbo RPC       │  DubboFilter       │
│  (Consumer 侧)     │ ──────────────▶   │  (Provider 侧)     │
│  · 读取 TraceId    │   Attachment:     │  · 提取 TraceId    │
│  · 读取 AccessToken│   traceId         │  · 提取 AccessToken│
│  · 写入 Attachment │   accessToken     │  · 设置上下文       │
│        │           │                   │        │           │
│        ▼           │                   │        ▼           │
│  发送 RPC 请求      │                   │  执行业务逻辑       │
└────────────────────┘                   │        │           │
                                         │        ▼           │
                                         │  清理线程上下文     │
                                         └────────────────────┘`}</CodeBlock>

              <H3>核心流程</H3>
              <P>1. <Strong>Consumer 端</Strong>：从当前线程的 <InlineCode>TraceIdContext</InlineCode> 获取 TraceId，从 <InlineCode>RequestHeaderContext</InlineCode> 获取 AccessToken，通过 Dubbo 的 <InlineCode>Invocation.setAttachment()</InlineCode> 机制传递到 Provider 端</P>
              <P>2. <Strong>Provider 端</Strong>：从 <InlineCode>Invocation.getAttachment()</InlineCode> 中提取 TraceId 和 AccessToken，通过 <InlineCode>ContextDataManager</InlineCode> 初始化上下文数据（包括 TraceId 设置、请求头信息恢复等）</P>
              <P>3. <Strong>资源清理</Strong>：Provider 端业务逻辑执行完成后，在 <InlineCode>finally</InlineCode> 块中调用 <InlineCode>ContextDataManager.clearContext()</InlineCode> 清理线程上下文，避免线程池复用导致的数据污染</P>

              {/* ============== 4. SPI 注册机制 ============== */}
              <H2 id="sec-3">4. SPI 注册机制</H2>
              <P>DubboFilter 通过 Dubbo SPI 扩展机制自动注册，无需在 Spring 配置中手动声明：</P>
              <P><Strong>SPI 配置文件</Strong>：<InlineCode>META-INF/dubbo/org.apache.dubbo.rpc.Filter</InlineCode></P>
              <CodeBlock lang="plaintext">{`dubboFilter=com.mcst.easyfk.rpc.dubbo.filter.DubboFilter`}</CodeBlock>
              <P><Strong>激活条件</Strong>：</P>
              <CodeBlock lang="java">{`@Activate(group = {CommonConstants.CONSUMER, CommonConstants.PROVIDER}, order = -1000)`}</CodeBlock>

                            <DocTable
                headers={["`group`", "`CONSUMER, PROVIDER`", "消费端和服务端双向激活"]}
                rows={[]}
              />
              <P>&gt; Filter 自动激活，开发者无需在配置文件中手动添加 filter 声明。</P>

              {/* ============== 5. 使用指南 ============== */}
              <H2 id="sec-4">5. 使用指南</H2>

              <H3>5.1 服务提供者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  application:
    name: user-service
  protocol:
    name: dubbo
    port: 20880
  registry:
    address: nacos://192.168.1.100:8848
    parameters:
      namespace: dev
  scan:
    base-packages: com.example.service.impl`}</CodeBlock>

              <H3>5.2 定义 Dubbo 服务接口</H3>
              <P>在公共 API 模块中定义接口：</P>
              <CodeBlock lang="java">{`public interface UserService {

    UserDTO getUserById(Long id);

    List<UserDTO> queryUsers(UserQueryDTO query);

    void createUser(UserCreateDTO dto);

    void updateUser(Long id, UserUpdateDTO dto);

    void deleteUser(Long id);
}`}</CodeBlock>

              <H3>5.3 实现服务提供者</H3>
              <CodeBlock lang="java">{`@DubboService(version = "1.0.0")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.queryById(id);
    }

    @Override
    public List<UserDTO> queryUsers(UserQueryDTO query) {
        return userRepository.queryList(query);
    }

    @Override
    public void createUser(UserCreateDTO dto) {
        userRepository.insert(dto);
    }

    @Override
    public void updateUser(Long id, UserUpdateDTO dto) {
        dto.setId(id);
        userRepository.updateById(dto);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}`}</CodeBlock>

              <H3>5.4 服务消费者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  application:
    name: order-service
  registry:
    address: nacos://192.168.1.100:8848
    parameters:
      namespace: dev`}</CodeBlock>

              <H3>5.5 注入并调用</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @DubboReference(version = "1.0.0")
    private UserService userService;

    public OrderDTO createOrder(OrderCreateDTO dto) {
        // 像调用本地方法一样调用远程服务
        // DubboFilter 自动透传 TraceId 和 AccessToken
        UserDTO user = userService.getUserById(dto.getUserId());
        // ... 业务逻辑
    }
}`}</CodeBlock>

              {/* ============== 6. 配置说明 ============== */}
              <H2 id="sec-5">6. 配置说明</H2>

              <H3>6.1 注册中心配置（Nacos）</H3>
              <CodeBlock lang="yaml">{`dubbo:
  registry:
    address: nacos://192.168.1.100:8848
    parameters:
      namespace: dev
      group: DEFAULT_GROUP`}</CodeBlock>

              <H3>6.2 协议配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  protocol:
    name: dubbo
    port: 20880
    threads: 200            # 业务线程池大小
    payload: 8388608        # 最大请求体 8MB
    serialization: hessian2 # 序列化方式`}</CodeBlock>

              <H3>6.3 消费者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  consumer:
    timeout: 3000           # 调用超时（毫秒）
    retries: 2              # 失败重试次数
    check: false            # 启动时不检查服务是否可用
    loadbalance: random     # 负载均衡策略`}</CodeBlock>

              <H3>6.4 提供者配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  provider:
    timeout: 5000           # 服务端超时（毫秒）
    threads: 200            # 业务线程数
    executes: 0             # 服务端并发执行限制，0 不限制`}</CodeBlock>

              <H3>6.5 多注册中心配置</H3>
              <CodeBlock lang="yaml">{`dubbo:
  registries:
    registry1:
      address: nacos://192.168.1.100:8848
      parameters:
        namespace: dev
    registry2:
      address: nacos://192.168.1.200:8848
      parameters:
        namespace: dev`}</CodeBlock>

              {/* ============== 7. 上下文透传 ============== */}
              <H2 id="sec-6">7. 上下文透传</H2>

              <H3>7.1 TraceId 透传</H3>
              <P><InlineCode>DubboFilter</InlineCode> 自动在消费端和服务端之间传递 TraceId：</P>
              <CodeBlock lang="plaintext">{`网关生成 TraceId: abc123
  → 服务A (Consumer) DubboFilter 写入 Attachment: traceId=abc123
    → 服务B (Provider) DubboFilter 提取 traceId=abc123，设置到 TraceIdContext
      → 服务B (Consumer) DubboFilter 写入 Attachment: traceId=abc123
        → 服务C (Provider) DubboFilter 提取 traceId=abc123`}</CodeBlock>
              <P>&gt; TraceId 在整个 Dubbo 调用链中保持一致，配合日志框架可实现全链路日志串联。</P>

              <H3>7.2 AccessToken 透传</H3>
              <P>DubboFilter 同时支持 AccessToken 的跨服务传递：</P>
              <BulletList items={["Consumer 端：从 `RequestHeaderContext` 获取 AccessToken，过滤 `undefined` 等无效值后写入 Attachment", "Provider 端：从 Attachment 提取 AccessToken，恢复到 `RequestHeaderContext`，使下游服务可获取当前用户身份信息"]} />

              <H3>7.3 上下文清理</H3>
              <P>Provider 端在业务逻辑执行完成后，自动调用 <InlineCode>ContextDataManager.clearContext()</InlineCode> 清理线程上下文：</P>
              <BulletList items={["防止 Dubbo 线程池复用时上下文数据污染", "清理操作在 `finally` 块中执行，保证异常场景也能正常清理", "清理失败仅打印 warn 日志，不影响业务流程"]} />

              {/* ============== 8. 高级用法 ============== */}
              <H2 id="sec-7">8. 高级用法</H2>

              <H3>8.1 服务版本管理</H3>
              <CodeBlock lang="java">{`// 提供者 —— 多版本并存
@DubboService(version = "1.0.0")
public class UserServiceV1Impl implements UserService { ... }

@DubboService(version = "2.0.0")
public class UserServiceV2Impl implements UserService { ... }

// 消费者 —— 指定版本
@DubboReference(version = "2.0.0")
private UserService userService;`}</CodeBlock>

              <H3>8.2 服务分组</H3>
              <CodeBlock lang="java">{`@DubboService(group = "primary")
public class PrimaryUserServiceImpl implements UserService { ... }

@DubboService(group = "secondary")
public class SecondaryUserServiceImpl implements UserService { ... }

@DubboReference(group = "primary")
private UserService userService;`}</CodeBlock>

              <H3>8.3 直连调试</H3>
              <P>开发环境可跳过注册中心直接指定服务地址：</P>
              <CodeBlock lang="java">{`@DubboReference(url = "dubbo://192.168.1.100:20880")
private UserService userService;`}</CodeBlock>

              <H3>8.4 异步调用</H3>
              <CodeBlock lang="java">{`@DubboReference(version = "1.0.0")
private UserService userService;

public CompletableFuture<UserDTO> getUserAsync(Long id) {
    // Dubbo 3 原生异步支持
    return CompletableFuture.supplyAsync(() -> userService.getUserById(id));
}`}</CodeBlock>

              <H3>8.5 负载均衡策略</H3>
              <CodeBlock lang="java">{`// 支持：random（随机）、roundrobin（轮询）、leastactive（最少活跃）、consistenthash（一致性哈希）
@DubboReference(version = "1.0.0", loadbalance = "roundrobin")
private UserService userService;`}</CodeBlock>

              <H3>8.6 服务降级</H3>
              <CodeBlock lang="java">{`@DubboReference(version = "1.0.0", mock = "com.example.mock.UserServiceMock")
private UserService userService;`}</CodeBlock>
              <CodeBlock lang="java">{`public class UserServiceMock implements UserService {

    @Override
    public UserDTO getUserById(Long id) {
        // 降级逻辑：返回默认值或缓存数据
        return new UserDTO();
    }

    // ... 其他方法的降级实现
}`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>接口独立模块</Strong>：将 Dubbo 服务接口定义在独立的 API 模块中，提供者和消费者共同引用，保证接口一致性。</P>
              <P>2. <Strong>版本管理</Strong>：使用 <InlineCode>version</InlineCode> 进行服务版本管理，支持灰度发布和多版本并存。</P>
              <P>3. <Strong>超时设置</Strong>：根据接口复杂度合理设置 <InlineCode>timeout</InlineCode>，避免全局统一超时导致慢接口拖垮快接口。</P>
              <P>4. <Strong>重试策略</Strong>：幂等接口可配置重试（<InlineCode>retries</InlineCode>），非幂等接口（如创建、扣款）应设为 <InlineCode>retries: 0</InlineCode>。</P>
              <P>5. <Strong>启动检查</Strong>：开发环境可设置 <InlineCode>check: false</InlineCode> 避免依赖服务未启动时无法启动，生产环境建议设为 <InlineCode>true</InlineCode>。</P>
              <P>6. <Strong>线程池配置</Strong>：根据业务特点调整 Provider 端线程池大小，IO 密集型可适当调大。</P>
              <P>7. <Strong>序列化</Strong>：默认 <InlineCode>hessian2</InlineCode> 序列化，DTO 对象需实现 <InlineCode>Serializable</InlineCode> 接口。</P>
              <P>8. <Strong>链路追踪</Strong>：确保所有微服务都引入 rpc-dubbo 组件，保证 TraceId 和 AccessToken 在整个调用链中完整传递。</P>
              <P>9. <Strong>避免大对象传输</Strong>：Dubbo 适合传输小数据量的 RPC 调用，大文件传输应使用其他方案（如 OSS）。</P>
              <P>10. <Strong>服务降级</Strong>：核心调用链路建议配置 mock 降级，避免下游服务故障导致级联失败。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-rpc-dubbo — 高性能 RPC 远程服务调用框架。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
