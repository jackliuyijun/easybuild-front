"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖关系" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "配置属性" },
  { id: "sec-4", label: "自动配置" },
  { id: "sec-5", label: "RequestBaseFilter（请求前置过滤器）" },
  { id: "sec-6", label: "MicroExceptionHandler（全局异常处理）" },
  { id: "sec-7", label: "ContextDataManager（上下文数据管理器）" },
  { id: "sec-8", label: "JwtManager（JWT 管理器）" },
  { id: "sec-9", label: "Jackson 全局序列化配置" },
  { id: "sec-10", label: "ErrorRequest 错误码枚举" },
  { id: "sec-11", label: "工具类" },
  { id: "sec-12", label: "FilterChainData（过滤链传递数据）" },
  { id: "sec-13", label: "快速接入" },
]

export default function WebMicroDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="微服务 Web"
      title="easyfk-web-micro 微服务 Web"
      subtitle="微服务 Web 开发 — 轻量级微服务 Web 支撑"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>web-micro</InlineCode> 是 EasyFK 框架为<Strong>微服务（网关后端服务）</Strong>提供的 Web 基础设施模块。适用于经过 <InlineCode>easyfk-gateway</InlineCode> 网关转发后的下游微服务，提供以下核心能力：</P>
              <BulletList items={["**请求上下文还原**：从请求头中提取 TraceId、AccessToken、Language 等信息，还原为 ThreadLocal 上下文", "**用户数据上下文加载**：通过 JWT 解析获取登录用户，从缓存中加载完整的 UserData", "**全局异常处理**：统一处理参数校验异常、业务异常和系统异常，返回标准化的 ResponseResult", "**Jackson 全局序列化配置**：Java 8 时间类型的统一格式化"]} />
              <P>本模块是 <InlineCode>easyfk-web</InlineCode> 多层模块体系中面向微服务场景的组合模块，依赖 <InlineCode>web-simple</InlineCode>（Web 容器 + easyfk-core）、<InlineCode>web-common</InlineCode>（通用配置 + 工具）、<InlineCode>web-base</InlineCode>（JWT + 上下文管理）。</P>

              {/* ============== 2. 依赖关系 ============== */}
              <H2 id="sec-1">2. 依赖关系</H2>

              <H3>2.1 模块依赖图</H3>
              <CodeBlock lang="plaintext">{`web-micro
├── web-simple
│   ├── spring-boot-starter-web（排除 Tomcat + Logging）
│   ├── spring-boot-starter-undertow（默认容器）
│   └── easyfk-core
└── web-common
    ├── web-base
    │   ├── easyfk-authority（用户权限管理）
    │   └── easyfk-core（编译期）
    ├── easyfk-core（编译期）
    └── spring-web（编译期）`}</CodeBlock>

              <H3>2.2 web-micro build.gradle</H3>
              <CodeBlock lang="groovy">{`dependencies {
    api project(':easyfk-web:web-simple')
    api project(':easyfk-web:web-common')
}`}</CodeBlock>

              <H3>2.3 web-simple build.gradle</H3>
              <CodeBlock lang="groovy">{`dependencies {
    api('org.springframework.boot:spring-boot-starter-web') {
        exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'
        exclude group: 'org.springframework.boot', module: 'spring-boot-starter-tomcat'
    }
    api project(':easyfk-core')
    api 'org.springframework.boot:spring-boot-starter-undertow'
}`}</CodeBlock>

              <H3>2.4 web-common build.gradle</H3>
              <CodeBlock lang="groovy">{`dependencies {
    compileOnly project(':easyfk-core')
    compileOnly('org.springframework:spring-web')
    api project(':easyfk-web:web-base')
}`}</CodeBlock>

              <H3>2.5 web-base build.gradle</H3>
              <CodeBlock lang="groovy">{`dependencies {
    compileOnly project(':easyfk-core')
    api project(':easyfk-authority')
}`}</CodeBlock>

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`easyfk-web/
├── web-simple/                         # Web 容器层
│   └── (spring-boot-starter-web + Undertow + easyfk-core)
│
├── web-base/                           # 基础管理层
│   ├── config/
│   │   └── WebBaseConfig.java          # 自动配置（JwtManager + ContextDataManager）
│   ├── manager/
│   │   ├── JwtManager.java             # JWT 创建与解析
│   │   └── ContextDataManager.java     # 上下文数据管理器
│   ├── properties/
│   │   └── JwtProperties.java          # JWT 配置
│   └── vo/
│       └── ParseJwtResult.java         # JWT 解析结果
│
├── web-common/                         # 通用配置层
│   ├── config/
│   │   └── WebCommonConfig.java        # 注册属性配置
│   ├── properties/
│   │   ├── InterceptProperties.java    # 拦截器配置
│   │   ├── SecurityProperties.java     # 安全配置
│   │   └── CorsProperties.java         # 跨域配置
│   ├── constant/
│   │   ├── ErrorRequest.java           # 错误请求枚举（15 种错误类型）
│   │   ├── RequestConstant.java        # 请求常量
│   │   └── SignConstant.java           # 签名常量
│   ├── util/
│   │   ├── InterceptorExcludeUriUtil.java  # URI 排除匹配工具
│   │   └── CheckIgnoreSecurityUriUtil.java # 安全忽略 URI 工具
│   ├── vo/
│   │   └── FilterChainData.java        # 过滤链传递数据
│   └── resources/
│       └── i18n/
│           ├── webMessages_zh_CN.properties  # 简体中文
│           ├── webMessages_zh_TW.properties  # 繁体中文（台湾）
│           ├── webMessages_zh_HK.properties  # 繁体中文（香港）
│           ├── webMessages_en_US.properties  # 英文
│           └── webMessages_vi_VN.properties  # 越南语
│
└── web-micro/                          # 微服务组合层（本模块）
    ├── config/
    │   └── MicroWebConfig.java         # 自动配置
    ├── exception/
    │   └── MicroExceptionHandler.java  # 全局异常处理
    └── filter/
        └── RequestBaseFilter.java      # 请求前置过滤器`}</CodeBlock>

              {/* ============== 4. 配置属性 ============== */}
              <H2 id="sec-3">4. 配置属性</H2>

              <H3>4.1 JWT 配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.web.jwt</InlineCode></P>

                            <DocTable
                headers={["`secret`", "String", "内置默认值", "JWT 签名私钥"]}
                rows={[]}
              />

              <H3>4.2 拦截器配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.web.intercept</InlineCode></P>

                            <DocTable
                headers={["`exclude-paths`", "List\&lt;String\&gt;", "null", "拦截器排除的 URI 列表"]}
                rows={[
                  ["`auth-type`", "Integer", "0", "权限拦截等级：0=只检测登录，1=检测登录+权限"],
                  ["`refresh-user-auth`", "boolean", "false", "是否刷新用户权限缓存"],
                  ["`verify-param`", "boolean", "false", "是否验证参数防篡改"],
                  ["`custom-local-interceptor`", "boolean", "false", "是否使用自定义本地拦截器"],
                  ["`custom-local-filter`", "boolean", "false", "是否使用自定义本地过滤器"],
                  ["`custom-gateway-filter`", "boolean", "false", "是否使用自定义网关过滤器"],
                ]}
              />

              <H3>4.3 安全配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.web.security</InlineCode></P>

                            <DocTable
                headers={["`open`", "boolean", "false", "是否开启接口安全控制"]}
                rows={[
                  ["`timeout`", "Duration", "150s", "防重放超时时间"],
                  ["`sign-key`", "String", "`mcst_sign_reset`", "签名密钥"],
                  ["`sign-key-dynamic`", "boolean", "false", "签名密钥是否动态"],
                  ["`key-time-to-live`", "Duration", "10min", "动态密钥存活时间"],
                ]}
              />

              <H3>4.4 跨域配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.web.cors</InlineCode></P>

                            <DocTable
                headers={["`open`", "boolean", "false", "是否开启跨域"]}
                rows={[
                  ["`cors-domain`", "String", "`*`", "允许跨域的域名"],
                  ["`allowed-header`", "String", "`*`", "允许的自定义头"],
                  ["`allowed-method`", "String", "`*`", "允许的 HTTP Method"],
                  ["`path-pattern`", "String", "`/**`", "跨域路径模式"],
                ]}
              />

              {/* ============== 5. 自动配置 ============== */}
              <H2 id="sec-4">5. 自动配置</H2>

              <H3>5.1 MicroWebConfig</H3>
              <CodeBlock lang="plaintext">{`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
→ com.mcst.easyfk.web.micro.config.MicroWebConfig`}</CodeBlock>
              <P>注册的 Bean：</P>

                            <DocTable
                headers={["`microExceptionHandler`", "`MicroExceptionHandler`", "`@ConditionalOnMissingBean`", "全局异常处理器"]}
                rows={[
                  ["`serializingObjectMapper`", "`ObjectMapper`", "`@ConditionalOnMissingBean(ObjectMapper.class)`", "Jackson 全局配置"],
                ]}
              />

              <H3>5.2 WebBaseConfig</H3>
              <P>注册的 Bean：</P>

                            <DocTable
                headers={["`jwtManager`", "`JwtManager`", "JWT 创建与解析管理器"]}
                rows={[]}
              />

              <H3>5.3 WebCommonConfig</H3>
              <P>注册配置属性：<InlineCode>SecurityProperties</InlineCode>、<InlineCode>InterceptProperties</InlineCode>、<InlineCode>CorsProperties</InlineCode></P>

              {/* ============== 6. RequestBaseFilter（请求前置过滤器） ============== */}
              <H2 id="sec-5">6. RequestBaseFilter（请求前置过滤器）</H2>
              <P>继承 <InlineCode>OncePerRequestFilter</InlineCode>，在每个请求开始时还原上下文：</P>
              <CodeBlock lang="plaintext">{`HTTP 请求到达微服务
    │
    ├─ 从 ThreadLocal 获取或创建 RequestHeaders
    │
    ├─ 提取请求头信息
    │   ├─ TRACE_ID → traceId 变量
    │   ├─ ACCESS_TOKEN → headers.accessToken
    │   └─ LANGUAGE → headers.language
    │
    ├─ 非空字段写入 RequestHeaderContext（ThreadLocal）
    │
    ├─ contextDataManager.doDataContext(traceId)
    │   ├─ JWT 解析 AccessToken → LoginUser
    │   ├─ UserDataManager 加载 UserData → UserDataContext
    │   ├─ TraceId → TraceIdContext + MDC
    │   └─ （可选）异步刷新用户权限缓存
    │
    ├─ filterChain.doFilter() ← 继续后续处理
    │
    └─ finally: contextDataManager.clearContext()
        ├─ TraceIdContext.remove()
        ├─ MDC.clear()
        ├─ RequestHeaderContext.remove()
        └─ UserDataContext.remove()`}</CodeBlock>

              {/* ============== 7. MicroExceptionHandler（全局异常处理） ============== */}
              <H2 id="sec-6">7. MicroExceptionHandler（全局异常处理）</H2>
              <P>使用 <InlineCode>@ControllerAdvice</InlineCode> 统一处理所有异常：</P>

                            <DocTable
                headers={["`BindException` / `ValidationException` / `MethodArgumentNotValidException`", "500", "`RRBuilder.buildFailByException(e)` 提取校验错误信息"]}
                rows={[
                  ["`Exception`（兜底）", "500", "使用 I18N 国际化消息 `SystemErrorMsg`"],
                ]}
              />
              <P><Strong>国际化支持：</Strong> 系统异常消息通过 <InlineCode>{'I18NUtil.getMessage("SystemErrorMsg", "i18n/webMessages")'}</InlineCode> 获取，支持 5 种语言：</P>
              <BulletList items={["简体中文（zh_CN）", "繁体中文-台湾（zh_TW）", "繁体中文-香港（zh_HK）", "英文（en_US）", "越南语（vi_VN）"]} />

              {/* ============== 8. ContextDataManager（上下文数据管理器） ============== */}
              <H2 id="sec-7">8. ContextDataManager（上下文数据管理器）</H2>
              <P>核心管理类，负责请求上下文的全生命周期：</P>

              <H3>8.1 上下文初始化</H3>
              <CodeBlock lang="java">{`// 微服务场景：从请求头中的 traceId 恢复上下文
contextDataManager.doDataContext(traceId);`}</CodeBlock>
              <P><Strong>内部流程：</Strong></P>
              <P>1. 从 <InlineCode>RequestHeaderContext</InlineCode> 获取 AccessToken</P>
              <P>2. 过滤无效 Token（空值、<InlineCode>{'"undefined"'}</InlineCode>）</P>
              <P>3. <InlineCode>JwtManager.getObjectContent()</InlineCode> 解析 JWT → <InlineCode>LoginUser</InlineCode></P>
              <P>4. <InlineCode>UserDataManager.getUserData()</InlineCode> 从缓存加载 <InlineCode>UserData</InlineCode></P>
              <P>5. 写入 <InlineCode>UserDataContext</InlineCode>（ThreadLocal）</P>
              <P>6. 设置 TraceId → <InlineCode>TraceIdContext</InlineCode> + <InlineCode>MDC</InlineCode></P>

              <H3>8.2 上下文清理</H3>
              <CodeBlock lang="java">{`contextDataManager.clearContext();`}</CodeBlock>
              <P>一次性清理四个 ThreadLocal：</P>
              <BulletList items={["`TraceIdContext.remove()`", "`MDC.clear()`", "`RequestHeaderContext.remove()`", "`UserDataContext.remove()`"]} />

              <H3>8.3 创建 TraceId</H3>
              <CodeBlock lang="java">{`contextDataManager.createTraceId();`}</CodeBlock>
              <P>使用 <InlineCode>IdUtil.randomUUID()</InlineCode> 生成新的 TraceId，写入 <InlineCode>TraceIdContext</InlineCode> + <InlineCode>MDC</InlineCode>。（网关场景使用）</P>

              {/* ============== 9. JwtManager（JWT 管理器） ============== */}
              <H2 id="sec-8">9. JwtManager（JWT 管理器）</H2>

              <H3>9.1 创建 JWT</H3>
              <CodeBlock lang="java">{`// 从字符串创建
String token = jwtManager.createJwtByString("content");

// 从对象创建（自动 JSON 序列化）
String token = jwtManager.createJwtByObject(loginUser);`}</CodeBlock>

              <H3>9.2 解析 JWT</H3>
              <CodeBlock lang="java">{`// 解析为对象
ParseJwtResult<LoginUser> result = jwtManager.getObjectContent(token, LoginUser.class);
if (result.isSuccess()) {
    LoginUser user = result.getData();
}

// 解析为字符串
ParseJwtResult<String> result = jwtManager.getStringContent(token);`}</CodeBlock>

              <H3>9.3 ParseJwtResult</H3>

                            <DocTable
                headers={["`success`", "boolean", "解析是否成功"]}
                rows={[
                  ["`expires`", "boolean", "JWT 是否已过期"],
                ]}
              />

              {/* ============== 10. Jackson 全局序列化配置 ============== */}
              <H2 id="sec-9">10. Jackson 全局序列化配置</H2>
              <P><InlineCode>MicroWebConfig</InlineCode> 注册全局 <InlineCode>ObjectMapper</InlineCode>：</P>

                            <DocTable
                headers={["`LocalDateTime`", "`yyyy-MM-dd HH:mm:ss`", "`yyyy-MM-dd HH:mm:ss`"]}
                rows={[
                  ["`LocalTime`", "`HH:mm:ss`", "`HH:mm:ss`"],
                  ["`Date`", "`yyyy-MM-dd HH:mm:ss`", "—"],
                ]}
              />
              <P><Strong>其他配置：</Strong></P>
              <BulletList items={["`NON_NULL`：null 字段不参与序列化", "`FAIL_ON_EMPTY_BEANS = false`：空对象不抛异常", "`FAIL_ON_UNKNOWN_PROPERTIES = false`：忽略 JSON 中多余的字段"]} />

              {/* ============== 11. ErrorRequest 错误码枚举 ============== */}
              <H2 id="sec-10">11. ErrorRequest 错误码枚举</H2>
              <P>web-common 定义了 15 种标准化错误码：</P>

                            <DocTable
                headers={["`UNLOGIN`", "未登录或登录过期"]}
                rows={[
                  ["`HEARD_EMPTY`", "请求头为空"],
                  ["`NONCE_EMPTY`", "随机串为空"],
                  ["`RESET_SIGN_EMPTY`", "ResetSign 为空"],
                  ["`TIMESTAMP_EMPTY`", "时间戳为空"],
                  ["`SIGN_ERROR`", "验签失败"],
                  ["`EXPIRED`", "请求过期"],
                  ["`API_AGAIN`", "接口重放"],
                  ["`PARAM_SIGN_EMPTY`", "ParamSign 为空"],
                  ["`VERIFY_EMPTY`", "无验签数据"],
                  ["`VERIFY_ERROR`", "参数签名失败"],
                  ["`REQUEST_TOKEN_EMPTY`", "RequestToken 为空"],
                  ["`REQUEST_AGAIN`", "重复提交"],
                  ["`JWT_ERROR`", "JWT 无效"],
                ]}
              />

              {/* ============== 12. 工具类 ============== */}
              <H2 id="sec-11">12. 工具类</H2>

              <H3>12.1 InterceptorExcludeUriUtil</H3>
              <CodeBlock lang="java">{`boolean excluded = InterceptorExcludeUriUtil.containsUri(requestUri, interceptProperties);`}</CodeBlock>
              <P>检查请求 URI 是否在拦截器排除列表中。</P>

              <H3>12.2 CheckIgnoreSecurityUriUtil</H3>
              <CodeBlock lang="java">{`boolean pass = CheckIgnoreSecurityUriUtil.isPass(requestUri, ignoreUris);`}</CodeBlock>
              <P>检查请求 URI 是否应跳过安全检查：</P>
              <BulletList items={["自动忽略静态文件：`.html`、`.htm`、`.icon`、`.css`、`.js`、`.ico`", "配置的忽略 URI 列表（包含匹配）"]} />

              {/* ============== 13. FilterChainData（过滤链传递数据） ============== */}
              <H2 id="sec-12">13. FilterChainData（过滤链传递数据）</H2>
              <P>微服务间传递的标准化数据容器：</P>
              <CodeBlock lang="java">{`@Data
@Accessors(chain = true)
public class FilterChainData implements Serializable {
    private RequestHeaders headers;
    private LoginUser loginUser;
}`}</CodeBlock>
              <P>网关将解析后的 <InlineCode>RequestHeaders</InlineCode> 和 <InlineCode>LoginUser</InlineCode> 封装为 JSON 写入请求头，下游微服务从中还原上下文。</P>

              {/* ============== 14. 快速接入 ============== */}
              <H2 id="sec-13">14. 快速接入</H2>

              <H3>14.1 添加依赖</H3>
              <CodeBlock lang="groovy">{`dependencies {
    implementation project(':easyfk-web:web-micro')
}`}</CodeBlock>

              <H3>14.2 配置 JWT</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    web:
      jwt:
        secret: "your-custom-secret-key"`}</CodeBlock>

              <H3>14.3 使用上下文</H3>
              <CodeBlock lang="java">{`@RestController
public class UserController {

    @GetMapping("/user/info")
    public ResponseResult<UserData> getUserInfo() {
        // 自动由 RequestBaseFilter 注入
        UserData userData = UserDataContext.getUserData();
        String traceId = TraceIdContext.getTraceId();
        return RRBuilder.buildSuccessBody(userData);
    }
}`}</CodeBlock><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-web-micro — 轻量级微服务 Web 基础设施。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
