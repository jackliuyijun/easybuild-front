"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "工作原理" },
  { id: "sec-3", label: "自动配置" },
  { id: "sec-4", label: "使用指南" },
  { id: "sec-5", label: "配置说明" },
  { id: "sec-6", label: "链路追踪" },
  { id: "sec-7", label: "高级用法" },
  { id: "sec-8", label: "最佳实践" },
]

export default function RpcCloudDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Spring Cloud"
      title="easyfk-rpc-cloud Spring Cloud"
      subtitle="Spring Cloud 微服务 — 云原生服务治理"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>rpc-cloud</InlineCode> 是 EasyFK 框架中基于 Spring Cloud OpenFeign 的远程服务调用组件。该模块封装了 Feign 客户端的自动配置，提供<Strong>统一的错误解码</Strong>和<Strong>链路追踪 TraceId 透传</Strong>能力，使微服务间的 HTTP 调用像本地方法一样简单，同时保障异常信息准确传递和分布式链路的完整性。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>rpc-cloud</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:rpc-cloud'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`spring-cloud-starter-openfeign` — Spring Cloud OpenFeign 声明式 HTTP 客户端", "`spring-cloud-loadbalancer` — Spring Cloud 客户端负载均衡", "`web-common` — EasyFK Web 公共模块"]} />
              <P>&gt; <Strong>注意</Strong>：模块已排除 <InlineCode>jackson</InlineCode>、<InlineCode>spring-boot-starter-logging</InlineCode>、<InlineCode>spring-cloud-starter-netflix-ribbon</InlineCode> 等冲突依赖，避免与框架其他组件产生版本冲突。</P>

              {/* ============== 3. 工作原理 ============== */}
              <H2 id="sec-2">3. 工作原理</H2>
              <P>rpc-cloud 基于 Spring Cloud OpenFeign 的声明式调用模型，并在此基础上增强了两项能力：</P>
              <CodeBlock lang="plaintext">{`Feign 客户端接口调用
        │
        ▼
FeignClientInterceptor（请求拦截器）
  → 自动注入 TraceId 到请求头
        │
        ▼
Spring Cloud LoadBalancer（负载均衡）
  → 从注册中心选择服务实例
        │
        ▼
HTTP 请求发送到目标服务
        │
        ▼
FeignErrorDecoder（错误解码器）
  → 非 200 响应时解析业务异常
  → 业务异常透传，系统异常国际化`}</CodeBlock>
              <BulletList items={["**FeignClientInterceptor**：在每次 Feign 请求发出前，自动从 `TraceIdContext` 获取当前链路 TraceId，注入到请求头 `traceId` 中，实现跨服务链路追踪", "**FeignErrorDecoder**：当远程服务返回非 200 响应时，解析响应体中的 `code` 和 `msg` 字段，将业务异常（`BusinessException`）准确透传给调用方，系统级错误则返回国际化错误信息"]} />

              {/* ============== 4. 自动配置 ============== */}
              <H2 id="sec-3">4. 自动配置</H2>
              <P>模块通过 Spring Boot 自动配置机制（<InlineCode>AutoConfiguration.imports</InlineCode>）自动注册以下 Bean：</P>

                            <DocTable
                headers={["`FeignErrorDecoder`", "`ErrorDecoder`", "`@ConditionalOnMissingBean`", "可被业务自定义实现覆盖"]}
                rows={[]}
              />
              <P>&gt; <Strong>自定义 ErrorDecoder</Strong>：如需自定义错误解码逻辑，只需在业务项目中声明一个 <InlineCode>FeignErrorDecoder</InlineCode> 类型的 Bean，框架默认实现将自动失效。</P>

              {/* ============== 5. 使用指南 ============== */}
              <H2 id="sec-4">5. 使用指南</H2>

              <H3>5.1 启用 Feign 客户端</H3>
              <P>在 Spring Boot 启动类或配置类上添加 <InlineCode>@EnableFeignClients</InlineCode> 注解：</P>
              <CodeBlock lang="java">{`@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.client")
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}`}</CodeBlock>

              <H3>5.2 定义 Feign 客户端接口</H3>
              <CodeBlock lang="java">{`@FeignClient(name = "user-service", path = "/api/user")
public interface UserServiceClient {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @PostMapping("/list")
    List<UserDTO> queryUsers(@RequestBody UserQueryDTO query);

    @PutMapping("/{id}")
    UserDTO updateUser(@PathVariable("id") Long id, @RequestBody UserUpdateDTO dto);

    @DeleteMapping("/{id}")
    void deleteUser(@PathVariable("id") Long id);
}`}</CodeBlock>

              <H3>5.3 注入并调用</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Autowired
    private UserServiceClient userServiceClient;

    public OrderDTO createOrder(OrderCreateDTO dto) {
        // 像调用本地方法一样调用远程服务
        UserDTO user = userServiceClient.getUserById(dto.getUserId());
        // ... 业务逻辑
    }
}`}</CodeBlock>

              <H3>5.4 异常处理</H3>
              <P>当远程服务返回异常时，<InlineCode>FeignErrorDecoder</InlineCode> 会自动解析：</P>
              <BulletList items={["**业务异常**：远程服务抛出的 `BusinessException`（code 不为 `SystemError`），将原样透传给调用方", "**系统异常**：code 为 `SystemError` 或解析失败时，返回国际化的系统错误信息"]} />
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Autowired
    private UserServiceClient userServiceClient;

    public UserDTO getUser(Long userId) {
        try {
            return userServiceClient.getUserById(userId);
        } catch (BusinessException e) {
            // 捕获远程服务的业务异常，code 和 msg 原样保留
            log.warn("远程调用业务异常: code={}, msg={}", e.getCode(), e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            // 系统级异常
            log.error("远程调用系统异常", e);
            throw e;
        }
    }
}`}</CodeBlock>

              {/* ============== 6. 配置说明 ============== */}
              <H2 id="sec-5">6. 配置说明</H2>

              <H3>6.1 注册中心配置（Nacos 示例）</H3>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.1.100:8848
        namespace: dev`}</CodeBlock>

              <H3>6.2 Feign 超时配置</H3>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    openfeign:
      client:
        config:
          default:
            connect-timeout: 5000
            read-timeout: 10000
          user-service:           # 针对特定服务的配置
            connect-timeout: 3000
            read-timeout: 5000`}</CodeBlock>

              <H3>6.3 Feign 日志配置</H3>
              <CodeBlock lang="yaml">{`logging:
  level:
    com.example.client: DEBUG     # Feign 客户端接口所在包

spring:
  cloud:
    openfeign:
      client:
        config:
          default:
            logger-level: FULL    # NONE / BASIC / HEADERS / FULL`}</CodeBlock>

              <H3>6.4 负载均衡配置</H3>
              <P>模块默认使用 Spring Cloud LoadBalancer 进行客户端负载均衡：</P>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    loadbalancer:
      retry:
        enabled: true
      cache:
        enabled: true
        ttl: 30s`}</CodeBlock>

              <H3>6.5 请求压缩配置</H3>
              <CodeBlock lang="yaml">{`spring:
  cloud:
    openfeign:
      compression:
        request:
          enabled: true
          mime-types: text/xml,application/xml,application/json
          min-request-size: 2048
        response:
          enabled: true`}</CodeBlock>

              {/* ============== 7. 链路追踪 ============== */}
              <H2 id="sec-6">7. 链路追踪</H2>
              <P>rpc-cloud 通过 <InlineCode>FeignClientInterceptor</InlineCode> 自动实现 TraceId 的跨服务透传：</P>
              <P>1. 上游服务处理请求时，<InlineCode>TraceIdContext</InlineCode> 中会存储当前请求的 TraceId</P>
              <P>2. 通过 Feign 调用下游服务时，拦截器自动将 TraceId 注入到 HTTP 请求头</P>
              <P>3. 下游服务通过请求头获取 TraceId，实现完整的调用链追踪</P>
              <CodeBlock lang="plaintext">{`服务A (TraceId: abc123)
  → FeignClientInterceptor 注入 Header: traceId=abc123
    → 服务B 接收到 traceId=abc123
      → FeignClientInterceptor 注入 Header: traceId=abc123
        → 服务C 接收到 traceId=abc123`}</CodeBlock>
              <P>&gt; TraceId 在整个调用链中保持一致，便于日志排查和链路分析。</P>

              {/* ============== 8. 高级用法 ============== */}
              <H2 id="sec-7">8. 高级用法</H2>

              <H3>8.1 Feign 降级处理</H3>
              <CodeBlock lang="java">{`@FeignClient(name = "user-service", path = "/api/user", fallback = UserServiceFallback.class)
public interface UserServiceClient {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}

@Component
public class UserServiceFallback implements UserServiceClient {

    @Override
    public UserDTO getUserById(Long id) {
        // 降级逻辑：返回默认值或缓存数据
        return new UserDTO();
    }
}`}</CodeBlock>

              <H3>8.2 自定义请求拦截器</H3>
              <P>如需在请求头中传递更多信息（如用户 Token），可添加自定义拦截器：</P>
              <CodeBlock lang="java">{`@Component
public class AuthFeignInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate requestTemplate) {
        ServletRequestAttributes attributes =
            (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            requestTemplate.header("Authorization", request.getHeader("Authorization"));
        }
    }
}`}</CodeBlock>

              <H3>8.3 自定义错误解码器</H3>
              <P>覆盖默认的 <InlineCode>FeignErrorDecoder</InlineCode>：</P>
              <CodeBlock lang="java">{`@Component
public class CustomFeignErrorDecoder extends FeignErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        // 自定义错误处理逻辑
        if (response.status() == 404) {
            return new ResourceNotFoundException("资源不存在");
        }
        return super.decode(methodKey, response);
    }
}`}</CodeBlock>

              {/* ============== 9. 最佳实践 ============== */}
              <H2 id="sec-8">9. 最佳实践</H2>
              <P>1. <Strong>接口独立模块</Strong>：将 Feign 客户端接口定义在独立的 API 模块中，服务提供者和消费者共同引用，保证接口一致性。</P>
              <P>2. <Strong>合理设置超时</Strong>：根据接口的实际响应时间设置 <InlineCode>connect-timeout</InlineCode> 和 <InlineCode>read-timeout</InlineCode>，避免使用过长的全局超时。</P>
              <P>3. <Strong>降级容错</Strong>：核心调用链路建议配置 fallback 降级，避免下游服务故障导致级联失败。</P>
              <P>4. <Strong>日志级别</Strong>：生产环境使用 <InlineCode>BASIC</InlineCode> 或 <InlineCode>NONE</InlineCode> 级别，开发/测试环境可使用 <InlineCode>FULL</InlineCode> 级别排查问题。</P>
              <P>5. <Strong>请求压缩</Strong>：大报文场景开启 Gzip 压缩，减少网络传输开销。</P>
              <P>6. <Strong>链路追踪</Strong>：确保所有微服务都引入 rpc-cloud 组件，保证 TraceId 在整个调用链中完整传递。</P>
              <P>7. <Strong>异常透传</Strong>：利用 <InlineCode>FeignErrorDecoder</InlineCode> 的业务异常透传能力，避免在调用方重复定义相同的错误码。</P>
              <P>8. <Strong>负载均衡</Strong>：默认使用 Spring Cloud LoadBalancer 轮询策略，如需自定义可实现 <InlineCode>ReactorServiceInstanceLoadBalancer</InlineCode> 接口。</P>
              <P>9. <Strong>避免循环依赖</Strong>：微服务间避免双向 Feign 调用，如有需要可通过消息队列解耦。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-rpc-cloud — Spring Cloud 微服务治理框架集成。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
