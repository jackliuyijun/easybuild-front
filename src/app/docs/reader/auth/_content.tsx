"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, NumberList, InlineCode, Strong, Highlight } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "模块概述" },
  { id: "sec-deps", label: "模块依赖" },
  { id: "sec-packages", label: "包结构" },
  { id: "sec-annotations", label: "注解使用指南" },
  { id: "sec-components", label: "核心组件" },
  { id: "sec-datamodel", label: "数据模型" },
  { id: "sec-enums", label: "枚举与常量" },
  { id: "sec-config", label: "配置说明" },
  { id: "sec-dataflow", label: "数据流转" },
  { id: "sec-integration", label: "集成指南" },
]

export default function AuthDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="认证鉴权"
      title="easyfk-auth 认证鉴权"
      subtitle="统一认证鉴权模块 — 安全与权限管理"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-overview">1. 模块概述</H2>
              <P>
                <InlineCode>easyfk-authority</InlineCode> 是 EasyFK 框架的<Strong>权限管理基础模块</Strong>，提供了<Highlight>注解驱动</Highlight>的权限资源定义、用户<Highlight>权限缓存</Highlight>管理、资源<Highlight>安全级别</Highlight>控制等核心能力。该模块作为权限体系的基础层，定义了通用的数据结构、注解和接口规范，供上层业务模块依赖和扩展。
              </P>
              <TipBox>
                <InlineCode>easyfk-authority</InlineCode> 是整个权限体系的<Strong>基础层</Strong>，上层的网关鉴权、业务权限控制等模块均依赖此模块提供的注解、数据结构和缓存管理能力。
              </TipBox>

              {/* ============== 2. 模块依赖 ============== */}
              <H2 id="sec-deps">2. 模块依赖</H2>
              <DocTable
                headers={["依赖模块", "依赖方式", "说明"]}
                rows={[
                  ["easyfk-core", "compileOnly", "核心模块，提供基础 DTO、工具类、上下文等"],
                  ["easyfk-cache", "api", "缓存模块，提供 ICacheService 缓存服务"],
                  ["easyfk-service:service-api", "api", "服务层 API，提供 IBaseApi 等基础接口"],
                ]}
              />
              <CodeBlock lang="groovy">{`dependencies {
    compileOnly project(':easyfk-core')
    api project(':easyfk-cache')
    api project(':easyfk-service:service-api')
}`}</CodeBlock>

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-packages">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.authority
├── annotation/           # 权限注解
│   ├── AuthResource        - 权限资源注解（标注方法或类）
│   ├── LoginResource       - 登录资源注解（标注方法）
│   └── ResourceController  - 资源控制器注解（标注类）
├── config/               # 自动配置
│   └── UserAuthConfigure   - Spring Boot 自动配置类
├── constant/             # 常量
│   └── ResourceSecurityLevel - 资源安全级别枚举
├── dto/                  # 数据传输对象
│   └── AuthResourceDto     - 权限资源 DTO
├── enums/                # 枚举
│   ├── ResourceCategory    - 资源类别枚举
│   └── UserTypeEnum        - 用户类型枚举
├── manager/              # 管理器
│   └── UserDataManager     - 用户数据与权限缓存管理器
├── param/                # 参数对象
│   └── AuthResourceParam   - 权限资源查询参数
├── properties/           # 配置属性
│   └── AuthProperties      - 权限配置属性
├── request/              # 请求对象
│   └── AuthResourceReq     - 权限资源请求对象
├── response/             # 响应对象
│   └── AuthResourceResp    - 权限资源响应对象
├── vo/                   # 值对象
│   ├── RoleListVo          - 角色列表
│   ├── TreeNode            - 通用树节点
│   ├── UserAuth            - 用户权限缓存对象
│   └── UserAuthResources   - 用户权限资源树形结构
└── IAuthResourceApi        # 权限资源 API 接口`}</CodeBlock>

              {/* ============== 4. 注解使用指南 ============== */}
              <H2 id="sec-annotations">4. 注解使用指南</H2>

              <H3>4.1 @ResourceController</H3>
              <P>
                标注在 Controller 类上，声明该控制器为<Highlight>权限资源控制器</Highlight>。适用目标：<InlineCode>ElementType.TYPE</InlineCode>（类）。
              </P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["group", "String", '"default"', "组标识，支持增量初始化时按组操作"],
                  ["id", "String", '""', "控制器资源 ID"],
                  ["name", "String", '""', "资源名称"],
                  ["title", "String", '""', "标题"],
                  ["path", "String", '""', "前端页面路径"],
                  ["sort", "int", "0", "排序权重"],
                  ["remark", "String", '""', "备注说明"],
                  ["icon", "String", '""', "图标信息"],
                  ["typeFlag", "String", '"all"', "类型标识，用于多平台资源归类"],
                ]}
              />
              <CodeBlock lang="java">{`@ResourceController(
    id = "user-mgmt",
    name = "用户管理",
    title = "用户管理",
    path = "/system/user",
    icon = "user",
    typeFlag = "system"
)
@RestController
@RequestMapping("/api/user")
public class UserController {
    // ...
}`}</CodeBlock>

              <H3>4.2 @AuthResource</H3>
              <P>
                标注在方法或类上，声明需要<Highlight>权限验证</Highlight>的资源。适用目标：<InlineCode>ElementType.METHOD</InlineCode>、<InlineCode>ElementType.TYPE</InlineCode>。
              </P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["id", "String", "*必填*", "资源 ID"],
                  ["name", "String", "*必填*", "资源名称"],
                  ["pId", "String", '""', "父资源 ID"],
                  ["pName", "String", '""', "上级资源名称"],
                  ["title", "String", '""', "资源名称简写，权限分配页面展示用"],
                  ["actionCode", "String", '""', "功能 Code"],
                  ["category", "ResourceCategory", "menu", "资源类型：menu/action/normal"],
                  ["rootStatus", "int", "0", "是否根目录：0-否，1-是"],
                  ["sort", "int", "0", "排序"],
                  ["path", "String", '""', "前端页面路径"],
                  ["remark", "String", '""', "备注"],
                  ["icon", "String", '""', "图标信息"],
                  ["unPassMsg", "String", '""', "无权限时的提示信息"],
                  ["typeFlag", "String", '"all"', "类型标识，多平台资源归类"],
                  ["defaultFlag", "String", '"all"', "默认类型标识，平台端默认资源"],
                ]}
              />
              <CodeBlock lang="java">{`@AuthResource(
    id = "user-list",
    name = "用户列表",
    pId = "user-mgmt",
    category = ResourceCategory.menu,
    path = "/system/user/list"
)
@GetMapping("/list")
public ResponseResult<List<UserResp>> list() {
    // ...
}

@AuthResource(
    id = "user-add",
    name = "新增用户",
    pId = "user-mgmt",
    category = ResourceCategory.action,
    actionCode = "user:add"
)
@PostMapping("/add")
public ResponseResult<?> add(@RequestBody UserReq req) {
    // ...
}`}</CodeBlock>

              <H3>4.3 @LoginResource</H3>
              <P>
                标注在方法上，声明该接口需要<Highlight>登录</Highlight>后才能访问（无需特定权限）。适用目标：<InlineCode>ElementType.METHOD</InlineCode>。
              </P>
              <DocTable
                headers={["属性", "类型", "默认值", "说明"]}
                rows={[
                  ["value", "String", '""', "预留扩展字段"],
                ]}
              />
              <CodeBlock lang="java">{`@LoginResource
@GetMapping("/profile")
public ResponseResult<UserProfile> getProfile() {
    // 仅需登录即可访问，无需权限验证
}`}</CodeBlock>

              {/* ============== 5. 核心组件详解 ============== */}
              <H2 id="sec-components">5. 核心组件详解</H2>

              <H3>5.1 UserDataManager — 用户数据与权限管理器</H3>
              <P>
                <InlineCode>UserDataManager</InlineCode> 是模块的核心管理类，负责用户<Highlight>权限数据</Highlight>的缓存读写和<Highlight>权限校验</Highlight>。
              </P>
              <P>
                <Strong>缓存空间：</Strong><InlineCode>User_Auth</InlineCode> 存储用户的权限数据（<InlineCode>UserAuth</InlineCode>）；<InlineCode>User_Data</InlineCode> 存储用户的基本数据（<InlineCode>UserData</InlineCode>）。
              </P>

              <H4>方法列表</H4>
              <DocTable
                headers={["方法", "返回值", "说明"]}
                rows={[
                  ["loginOut()", "BaseResult<?>", "退出登录，清除当前用户的 Auth 和 Data 缓存"],
                  ["checkAuth(String cacheKey, String path)", "BaseResult<Boolean>", "校验用户是否拥有指定路径的权限"],
                  ["refreshUserAuth(LoginUser loginUser)", "void", "刷新用户缓存的过期时间（剩余 <=600秒时延长10分钟）"],
                  ["getUserAuth(String cacheKey)", "UserAuth", "通过缓存 Key 获取用户权限对象"],
                  ["cacheUserAuth(UserAuth userAuth)", "BaseResult<String>", "缓存权限对象，返回生成的缓存 Token"],
                  ["cacheUserData(UserData userData)", "BaseResult<String>", "缓存用户数据对象，返回生成的缓存 Token"],
                  ["getUserData(LoginUser loginUser)", "UserData", "通过登录信息获取用户数据"],
                ]}
              />

              <H4>权限校验流程</H4>
              <CodeBlock lang="plaintext">{`checkAuth(cacheKey, path)
    │
    ├─ 1. 从缓存获取 UserAuth
    │     └─ 不存在 → 返回 false（未登录/缓存过期）
    │
    ├─ 2. 判断是否超级管理员
    │     └─ 是 → 直接通过
    │
    └─ 3. 检查用户 URL 列表是否包含目标路径
          ├─ 包含 → 返回 true（有权限）
          └─ 不包含 → 返回 false（无权限）`}</CodeBlock>

              <H4>缓存续期策略</H4>
              <P>
                当用户活跃时，系统会自动检查缓存剩余时间：若 <InlineCode>User_Data</InlineCode> 或 <InlineCode>User_Auth</InlineCode> 缓存剩余时间 <Strong>&lt;= 600 秒</Strong>（10分钟），自动延长 <Strong>10 分钟</Strong>；若缓存已永久过期（expire &lt;= 0），不进行续期。
              </P>
              <TipBox>
                <Highlight>缓存续期</Highlight>机制确保活跃用户不会因为缓存过期而被迫重新登录，提升用户体验的同时保障<Highlight>安全性</Highlight>。
              </TipBox>

              <H3>5.2 IAuthResourceApi — 权限资源 API 接口</H3>
              <P>
                继承自 <InlineCode>{'IBaseApi<AuthResourceResp, String, AuthResourceReq>'}</InlineCode>，提供权限资源的 CRUD 及扩展能力。
              </P>
              <DocTable
                headers={["方法", "返回值", "说明"]}
                rows={[
                  ["authorityResourceList()", "ResponseResult<List<AuthResourceResp>>", '获取系统中所有"权限类型"的资源列表'],
                  ["checkUriSecurityLevel(String url)", "ResourceSecurityLevel", "判断指定 URL 的安全级别"],
                  ["saveResourceByBath(List<AuthResourceReq> list)", "void", "批量保存权限资源"],
                  ["getPlatformAuthResources(String type, Integer defaultStatus)", "List<AuthResourceResp>", "获取指定平台类型的权限资源"],
                ]}
              />

              {/* ============== 6. 数据模型 ============== */}
              <H2 id="sec-datamodel">6. 数据模型</H2>

              <H3>6.1 AuthResourceDto — 权限资源 DTO</H3>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["resourceId", "String", "资源 ID（主键）"],
                  ["name", "String", "名称"],
                  ["icon", "String", "图标"],
                  ["url", "String", "资源 URL"],
                  ["pid", "String", "父资源 ID"],
                  ["pname", "String", "父资源名称"],
                  ["title", "String", "标题"],
                  ["category", "String", "资源类型：menu/action"],
                  ["remark", "String", "备注"],
                  ["sort", "Integer", "排序"],
                  ["path", "String", "前端路由地址"],
                  ["actionCode", "String", "功能代码"],
                  ["unPassMsg", "String", "无权限提示"],
                  ["resourceLevel", "Integer", "资源等级：0-无需验证，1-需要登录，2-需要权限"],
                  ["rootStatus", "Integer", "根目录标识：0-否，1-是"],
                  ["groupCode", "String", "分组代码"],
                  ["typeFlag", "String", "类型标识（多平台归类）"],
                  ["defaultFlag", "String", "默认类型标识"],
                ]}
              />

              <H3>6.2 UserAuth — 用户权限缓存对象</H3>
              <DocTable
                headers={["字段", "类型", "默认值", "说明"]}
                rows={[
                  ["supperUser", "Boolean", "false", "是否超级管理员"],
                  ["resources", "List\<AuthResourceDto\>", "-", "权限资源列表"],
                  ["urls", "List\<String\>", "-", "已授权 URL 列表"],
                ]}
              />

              <H3>6.3 UserAuthResources — 用户权限资源树</H3>
              <DocTable
                headers={["字段", "类型", "说明"]}
                rows={[
                  ["resourceId", "String", "资源 ID"],
                  ["name", "String", "名称"],
                  ["title", "String", "标题"],
                  ["icon", "String", "图标"],
                  ["path", "String", "路径"],
                  ["actions", "List\<String\>", "功能操作列表"],
                  ["children", "List\<UserAuthResources\>", "子资源列表（递归结构）"],
                  ["sort", "Integer", "排序"],
                ]}
              />

              {/* ============== 7. 枚举与常量 ============== */}
              <H2 id="sec-enums">7. 枚举与常量</H2>

              <H3>7.1 ResourceSecurityLevel — 资源安全级别</H3>
              <DocTable
                headers={["枚举值", "说明"]}
                rows={[
                  ["LOGIN", "需要登录"],
                  ["AUTHORITY", "需要权限"],
                  ["UNIMPEDED", "不拦截，自由访问"],
                ]}
              />
              <TipBox>
                三个<Highlight>安全级别</Highlight>从低到高依次为：<InlineCode>UNIMPEDED</InlineCode>（自由访问）→ <InlineCode>LOGIN</InlineCode>（需要登录）→ <InlineCode>AUTHORITY</InlineCode>（需要权限），网关层根据此级别决定拦截策略。
              </TipBox>

              <H3>7.2 ResourceCategory — 资源类别</H3>
              <DocTable
                headers={["枚举值", "说明"]}
                rows={[
                  ["menu", "菜单资源"],
                  ["action", "功能/操作资源"],
                  ["normal", "普通资源"],
                ]}
              />

              <H3>7.3 UserTypeEnum — 用户类型</H3>
              <DocTable
                headers={["枚举值", "value", "说明"]}
                rows={[
                  ["Platform", '"platform"', "平台用户"],
                  ["Agent", '"agent"', "代理商"],
                  ["Merchant", '"merchant"', "商户"],
                  ["Customer", '"customer"', "C端会员用户"],
                ]}
              />

              {/* ============== 8. 配置说明 ============== */}
              <H2 id="sec-config">8. 配置说明</H2>

              <H3>8.1 application.yml 配置</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    auth:
      live-time: 120   # 权限缓存时间，单位：分钟，默认 120（2小时）`}</CodeBlock>

              <H3>8.2 自动配置</H3>
              <P>
                模块通过 Spring Boot <Highlight>自动配置</Highlight>机制注册：
              </P>
              <NumberList items={[
                <><Strong>配置文件：</Strong><InlineCode>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</InlineCode></>,
                <><Strong>自动配置类：</Strong><InlineCode>UserAuthConfigure</InlineCode></>,
                <><Strong>注册的 Bean：</Strong><InlineCode>UserDataManager</InlineCode>（条件：容器中不存在时创建）</>,
              ]} />
              <WarnBox>
                <InlineCode>UserAuthConfigure</InlineCode> 使用了 <InlineCode>@ConditionalOnMissingBean</InlineCode>，如果业务模块注册了同类型 Bean，自定义 Bean 将优先生效。
              </WarnBox>

              {/* ============== 9. 数据流转关系 ============== */}
              <H2 id="sec-dataflow">9. 数据流转关系</H2>
              <CodeBlock lang="plaintext">{`Request 层                  Param 层                  DTO 层                   Response 层
AuthResourceReq  ──────→  AuthResourceParam  ──────→  AuthResourceDto  ──────→  AuthResourceResp
  (请求入参)                 (查询参数)                 (数据传输)                (响应出参)
      │                                                      │
      └────── @AutoMapper ──────────────────────────────────→ │
                                                              │
                                              @AutoMapper ────┘──────→ AuthResourceResp`}</CodeBlock>
              <P>
                对象映射基于 <InlineCode>mapstruct-plus</InlineCode>（<InlineCode>@AutoMapper</InlineCode> 注解），自动完成 DTO 与 Request/Response 之间的转换。
              </P>

              {/* ============== 10. 集成指南 ============== */}
              <H2 id="sec-integration">10. 集成指南</H2>

              <H3>10.1 引入依赖</H3>
              <P>
                在业务模块的 <InlineCode>build.gradle</InlineCode> 中添加：
              </P>
              <CodeBlock lang="groovy">{`dependencies {
    implementation project(':easyfk-authority')
}`}</CodeBlock>

              <H3>10.2 使用权限注解</H3>
              <NumberList items={[
                <>在 Controller 类上添加 <InlineCode>@ResourceController</InlineCode> 声明<Highlight>资源控制器</Highlight></>,
                <>在需要权限的方法上添加 <InlineCode>@AuthResource</InlineCode> 声明<Highlight>权限资源</Highlight></>,
                <>在仅需登录的方法上添加 <InlineCode>@LoginResource</InlineCode></>,
              ]} />

              <H3>10.3 自定义 UserDataManager</H3>
              <P>
                如需自定义用户数据管理逻辑，可通过注册同类型 Bean 覆盖默认实现：
              </P>
              <CodeBlock lang="java">{`@Configuration
public class CustomAuthConfig {

    @Bean
    public UserDataManager userAuthManager() {
        return new CustomUserDataManager();
    }
}`}</CodeBlock>
              <TipBox>
                由于 <InlineCode>UserAuthConfigure</InlineCode> 使用了 <InlineCode>@ConditionalOnMissingBean</InlineCode>，自定义 Bean 将优先生效，可以灵活替换默认的<Highlight>权限管理</Highlight>逻辑。
              </TipBox><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-auth — 统一认证鉴权，为业务系统提供安全基础设施。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
