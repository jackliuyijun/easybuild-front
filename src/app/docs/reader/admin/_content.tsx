"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-project-intro", label: "项目定位" },
  { id: "sec-highlights", label: "核心亮点" },
  { id: "sec-tech-stack", label: "技术架构概览" },
  { id: "sec-components", label: "自定义组件体系" },
  { id: "sec-get-project", label: "获取项目" },
  { id: "sec-structure", label: "目录结构说明" },
  { id: "sec-standards", label: "开发规范与技术细节" },
  { id: "sec-template", label: "模版使用指南" },
  { id: "sec-backend", label: "后端接口配合" },
]

export default function AdminDocContent() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="EasyBuild-Admin"
      title="中台管理系统前端项目介绍与开发手册"
      subtitle="新一代中后台管理系统前端脚手架说明文档"
      readingTime="~25 min"
    >

      {/* ============== 项目介绍 ============== */}
      <H2 id="sec-project-intro">一、项目定位</H2>
      <P>
        <Strong>EasyBuild Admin</Strong> 是一套业务无关的企业级中后台前端脚手架。它提供的不是某一个具体的业务系统，而是一套 <Strong>可复用、可扩展、可快速交付</Strong> 的通用中后台解决方案。
      </P>
      <P>
        无论是零售电商、仓储物流、内容运营、企业 OA，还是任何需要后台管理的业务场景，都可以基于此脚手架快速搭建，实现从 0 到 1 的高效落地。
      </P>
      <BulletList items={[
        <><Strong>业务无关</Strong>：所有菜单、页面、权限均由后端动态下发，前端不硬编码任何业务逻辑。更换一套后端接口，它就是另一个全新的管理平台。</>,
        <><Strong>按需组装</Strong>：脚手架内置了多种通用业务模块（权限管理、基础数据、内容运营、系统配置等），均可根据实际业务自由选择、裁剪或扩展。后端决定“有哪些模块”，前端自动生成对应菜单与导航。</>,
        <><Strong>即插即用</Strong>：新增一个业务模块，只需创建页面文件 + 后端注册菜单资源，前端侧边栏自动出现新菜单，无需修改任何路由配置文件。</>,
      ]} />
      <BulletList items={[
        <>GitHub 仓库：<InlineCode>https://github.com/jackliuyijun/easybuild-admin</InlineCode></>,
        <>npm 包：<InlineCode>https://www.npmjs.com/package/easybuild-admin</InlineCode></>,
      ]} />

      {/* ============== 核心亮点 ============== */}
      <H2 id="sec-highlights">二、核心亮点 — 动态菜单与业务模块灵活组装</H2>
      
      <H3>后端驱动的动态菜单系统</H3>
      <P>这是本脚手架 <Strong>最核心的设计理念</Strong> —— <Strong>前端不决定“有什么菜单”，后端说了算。</Strong></P>
      <NumberList items={[
        "用户登录成功后，前端自动向后端请求菜单资源接口",
        "后端根据当前用户的角色和权限，返回该用户可见的菜单资源树（包含菜单名称、路径、排序、层级关系等）",
        "前端自动将后端返回的菜单数据转换为路由配置，动态渲染侧边栏导航",
        "菜单数据智能缓存 30 分钟，避免重复请求，页面切换零延迟",
      ]} />

      <H3>开箱即用的企业级能力</H3>
      <BulletList items={[
        <><Strong>动态菜单 & 权限</Strong>：前端零配置即可实现菜单级权限控制。</>,
        <><Strong>多主题 & 暗黑模式</Strong>：内置 20+ 精心调校的主题色，深浅模式一键切换。</>,
        <><Strong>统一 CRUD 模式</Strong>：搜索 + 表格 + 分页 + CRUD 操作，统一交互范式。</>,
        <><Strong>类型安全全链路</Strong>：从 API 响应类型及 Store 状态到组件 Props，TypeScript 全覆盖。</>,
      ]} />

      {/* ============== 技术架构概览 ============== */}
      <H2 id="sec-tech-stack">三、技术架构概览</H2>
      <P>
        坚持 <Strong>“选最新的、用最稳的”</Strong> 原则，所有技术选型均为当前社区最活跃、生态最健全的方案：
      </P>
      <DocTable
        headers={["领域", "技术方案", "核心优势"]}
        rows={[
          [<Strong>应用框架</Strong>, <Strong>Next.js 15 + React 19</Strong>, "利用 React Server Components (RSC) 优化首屏并行渲染。"],
          [<Strong>类型系统</Strong>, <Strong>TypeScript 5.x</Strong>, "全链路类型安全，从 API 到组件一气呵成。"],
          [<Strong>UI 体系</Strong>, <Strong>Shadcn/ui + Radix UI + Tailwind CSS</Strong>, "无障碍合规、主题灵活、零运行时 CSS 开销。"],
          [<Strong>状态管理</Strong>, <Strong>Zustand + TanStack React Query v5</Strong>, "极简 Store + 智能服务端缓存，告别样板代码。"],
          [<Strong>表单引擎</Strong>, <Strong>React Hook Form + Zod</Strong>, "高性能非受控表单 + 声明式校验。"],
          [<Strong>数据表格</Strong>, <Strong>TanStack Table v8</Strong>, "配置化表格逻辑，支持虚拟滚动及复杂元数据渲染。"],
          [<Strong>HTTP 通信</Strong>, <Strong>Axios (统一封装)</Strong>, "拦截器链式处理，Token 自动注入，异常统一兜底。"],
        ]}
      />
      <H3>六层解耦架构</H3>
      <NumberList items={[
        <><Strong>Middleware 层</Strong>：负责全局路由守卫、权限拦截及请求预处理。</>,
        <><Strong>Layout 层</Strong>：侧边栏、顶栏、面包屑、主题引擎、通知中心。</>,
        <><Strong>业务模块层 (后端动态驱动)</Strong>：后端下发菜单 → 前端自动渲染 → 模块自由组合。</>,
        <><Strong>通用能力层</Strong>：高级组件封装，如 CustomTable、CustomForm、FileUpload 等。</>,
        <><Strong>基础 UI 层 (Shadcn/ui)</Strong>：40+ 无障碍基础组件，统一设计语言。</>,
        <><Strong>数据通信与状态管理层</Strong>：Axios 封装，Zustand (App/Sidebar) 与 React Query 缓存。</>,
      ]} />

      {/* ============== 组件体系 ============== */}
      <H2 id="sec-components">四、自定义组件体系</H2>
      <P>
        脚手架内置了一套精心设计的 <Strong>高级业务组件</Strong>，封装了中后台最常见的交互模式：
      </P>
      <BulletList items={[
        <><Strong>CustomForm（声明式表单引擎）</Strong>：支持 JSON 配置，涵盖16+字段类型，内置Zod校验。支持Grid自适应布局、字段联动、数据转换及远程搜索。</>,
        <><Strong>CustomTable（配置化数据表格）</Strong>：列配置驱动，支持虚拟化、自定义渲染、左右固定列、分页与行选择集成，并支持边框样式定制及其专属空状态展现。</>,
        <><Strong>CustomDialog / ConfirmDialog</Strong>：多尺寸内置最大化切换机制，独立区分区(Header/Content/Footer)以响应不同弹窗状态；二次操作提供安全确认流的危险预警。</>,
        <><Strong>FileUpload（文件上传组件）</Strong>：支持图/视/文等多种流文件的精准控制，开放多图排序与直观播放和阅览接口。</>,
        <><Strong>MultiSelect & DateRangePicker</Strong>：支持远程抗抖多段搜索，日历端全面对准中英文系统精确锁定时间颗粒度。</>,
        <><Strong>Notifications（统一通知系统）</Strong>：四形态语义囊括场景应用：<InlineCode>showMessage</InlineCode>、<InlineCode>showError</InlineCode>、<InlineCode>showWarning</InlineCode>、<InlineCode>showLoading</InlineCode>。</>,
      ]} />

      {/* ============== 获取项目 ============== */}
      <H2 id="sec-get-project">五、获取项目</H2>
      <TipBox>
        环境要求：<Strong>Node.js {">"}= 18.17.0</Strong>
      </TipBox>

      <H3>方式一：使用 CLI 命令创建（推荐）</H3>
      <P>
        一行命令即可创建项目，自动完成模板下载、项目信息替换、Git 初始化和依赖安装：
      </P>
      <CodeBlock lang="bash">npx easybuild-admin my-project</CodeBlock>
      <P>也可以通过参数跳过交互，直接创建：</P>
      <CodeBlock lang="bash">{`# 指定项目名 + 描述 + 包管理器
npx easybuild-admin my-project -d "我的管理后台" --pm yarn

# 只下载模板，不初始化 git 也不安装依赖
npx easybuild-admin my-project --skip-git --skip-install`}</CodeBlock>

      <H3>方式二：手动下载</H3>
      <P>如果不使用 CLI，也可以直接从 GitHub 获取代码：</P>
      <CodeBlock lang="bash">{`git clone https://github.com/jackliuyijun/easybuild-admin.git my-project
cd my-project
yarn install`}</CodeBlock>

      <H3>开发环境常用命令</H3>
      <CodeBlock lang="bash">{`# 安装依赖 (Yarn v4)
yarn install

# 启动开发服务器 (默认端口: 4000)
yarn dev

# 生成生产环境构建产物
yarn build:prod

# 静态代码检查与质量控制
yarn lint`}</CodeBlock>

      {/* ============== 目录结构 ============== */}
      <H2 id="sec-structure">六、目录结构说明</H2>
      <CodeBlock lang="text">{`src/
├── api/             # API 模块化定义，按业务域拆分文件 (e.g., auth.ts, user.ts)
├── app/             # App Router 路由。包含 layout.tsx, page.tsx 及 api 路由
├── components/      # 组件库
│   ├── ui/          # 基类原子组件 (Shadcn/ui)
│   ├── custom/      # 核心业务高级组件 (CustomForm, CustomTable 等)
│   └── icons/       # 内部使用的图标资源
├── config/          # 全局静态配置文件 (如主题配色、环境常量)
├── constants/       # 业务常量声明 (枚举、响应码等)
├── hooks/           # 通用的自定义 Hooks 及 React Query 的封装
├── lib/             # 外部库实例化 (Axios, Lucide, Crypto-JS 等)
├── store/           # Zustand 状态切片定义
├── styles/          # Tailwind 指令、全局 CSS 变量、自定义 Animations
├── types/           # 全局 TypeScript 类型声明 (.d.ts)
└── middleware.ts    # Next.js 中间件逻辑`}</CodeBlock>

      {/* ============== 开发规范 ============== */}
      <H2 id="sec-standards">七、开发规范与技术细节</H2>
      
      <H3>1. 编码约定</H3>
      <BulletList items={[
        <><Strong>组件定义</Strong>：统一使用函数组件与 Arrow Functions。</>,
        <><Strong>文件命名</Strong>：组件目录使用 PascalCase；Hooks 使用 camelCase 且以 <InlineCode>use</InlineCode> 开头；类型文件以 <InlineCode>.types.ts</InlineCode> 结尾。</>,
        <><Strong>Props 调用</Strong>：必须声明接口 (Interface) 或类型 (Type)，严禁使用 <InlineCode>any</InlineCode>。</>,
        <><Strong>优先解耦</Strong>：尽量编写 Dumb Components，将业务逻辑抽离至自定义 Hooks。</>,
        <><Strong>配置驱动</Strong>：高级组件必须支持通过 JSON 配置项完全控制其渲染行为。</>,
      ]} />

      <H3>2. 与后端对接规范设计</H3>
      <P>
        所有 API 请求遵循统一的 <Strong>请求-响应-异常</Strong> 三层处理机制：
      </P>
      <BulletList items={[
        <><Strong>请求层</Strong>：Axios 拦截器自动注入 Token 请求头，后端无需关心前端如何传递认证信息。</>,
        <><Strong>异常层</Strong>：前端自动处理 <InlineCode>UN_LOGIN</InlineCode> (跳回登录)、网络超时、业务错误弹窗兜底，禁止在页面内重复编写 <InlineCode>try-catch</InlineCode>。</>,
      ]} />
      <CodeBlock lang="json">{`// 后端接口统一返回标准结构：
{
  "code": "OK",          // 状态码：OK / UN_LOGIN / UN_AUTH / ERROR
  "data": { ... },       // 业务数据
  "msg": "操作成功",      // 提示信息
  "count": 100           // 分页总数（列表接口）
}`}</CodeBlock>
      <P>所有业务模块的接口遵循 <Strong>统一命名规范</Strong>，例如 <InlineCode>{"/{domain}/{module}/queryPage"}</InlineCode> (分页查询)、<InlineCode>{"/{domain}/{module}/addOrEdit"}</InlineCode> (新增/修改)、<InlineCode>{"/{domain}/{module}/disable"}</InlineCode> (状态切换)、<InlineCode>{"/{domain}/{module}/delete"}</InlineCode> (删除)。</P>


      {/* ============== 模版指南 ============== */}
      <H2 id="sec-template">八、模版使用指南 — 创建后需改动的文件</H2>
      <P>使用本模版创建新项目后，请按照以下清单逐一修改，完成项目初始化。</P>

      <H3>1. 项目基础信息</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>package.json</InlineCode>, <><InlineCode>name</InlineCode>、<InlineCode>version</InlineCode></>, <>将 <InlineCode>&quot;easybuild-admin&quot;</InlineCode> 改为你的项目名称，版本号按需设置。</>],
          [<InlineCode>src/app/layout.tsx</InlineCode>, <><InlineCode>metadata.title</InlineCode>、<InlineCode>metadata.description</InlineCode></>, <>修改浏览器标签页标题与 SEO 描述，替换 <InlineCode>&quot;EasyBuild Admin - 易构&quot;</InlineCode> 为你的项目名称。</>],
          [<InlineCode>src/config/login/login-config.ts</InlineCode>, <><InlineCode>name</InlineCode>、<InlineCode>description</InlineCode>、<InlineCode>subDescription</InlineCode></>, "登录页的品牌名称和描述文案，直接替换即可。"],
          [<InlineCode>public/favicon.ico</InlineCode>, "网站图标", "替换为你自己的 Favicon。"],
        ]}
      />

      <H3>2. 环境变量与接口地址</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>.env.development</InlineCode>, <><InlineCode>NEXT_PUBLIC_API_URL</InlineCode>、<InlineCode>NEXT_PUBLIC_APP_NAME</InlineCode>、<InlineCode>NEXT_PUBLIC_UPLOAD_API_URL</InlineCode></>, "开发环境的后端 API 地址和文件上传地址。"],
          [<InlineCode>.env.test</InlineCode>, "同上", "测试环境配置。"],
          [<InlineCode>.env.production</InlineCode>, "同上", "生产环境配置。"],
          [<InlineCode>src/config/api-url.ts</InlineCode>, <><InlineCode>API_URLS</InlineCode> 对象</>, <><Strong>核心文件</Strong>。删除模版中的示例接口路径（如 brand、banner 等），替换为你自己的业务接口地址。auth 部分如果后端的规则相同可以保留。</>],
        ]}
      />

      <H3>3. 业务页面与 API 模块（需删除 / 替换）</H3>
      <P>
        模版内置的以下目录包含 <Strong>示例业务代码</Strong>，创建新项目时应 <Strong>全部删除</Strong> 并替换为自己的业务模块：
      </P>
      <DocTable
        headers={["目录 / 文件", "说明"]}
        rows={[
          [<InlineCode>src/app/base/</InlineCode>, "示例：品牌、分类、分组、标签管理页面"],
          [<InlineCode>src/app/commodity/</InlineCode>, "示例：商品、SPU 管理页面"],
          [<InlineCode>src/app/operation/</InlineCode>, "示例：Banner 运营管理页面"],
          [<InlineCode>src/app/order/</InlineCode>, "示例：订单、退款管理页面"],
          [<InlineCode>src/app/customer/</InlineCode>, "示例：用户/会员管理页面"],
          [<InlineCode>src/app/businesses/</InlineCode>, "示例：商超管理页面"],
          [<InlineCode>src/app/system/</InlineCode>, "示例：字典管理页面"],
          [<><InlineCode>src/api/</InlineCode> 中的业务文件</>, <>如 goods.ts、banner.ts 等。按需新增API。请 <Strong>保留</Strong> <InlineCode>http.ts</InlineCode>（Axios 封装）和 <InlineCode>upload.ts</InlineCode>（文件上传）。</>],
          [<><InlineCode>src/types/</InlineCode> 中的业务类型</>, <>如 goods.ts 等。请 <Strong>保留</Strong> <InlineCode>api.ts</InlineCode>（通用响应）和 <InlineCode>token.ts</InlineCode>（Token）。</>],
        ]}
      />
      <TipBox>
        <Strong>可保留的通用模块</Strong>：<InlineCode>src/app/auth/</InlineCode>（部门/角色/员工权限管理）和 <InlineCode>src/app/login/</InlineCode>（登录页）属于通用鉴权能力，如果后端接口兼容可直接复用。
      </TipBox>

      <H3>4. 菜单图标与颜色映射</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>src/config/routes.ts</InlineCode>, <><InlineCode>iconMap</InlineCode>、<InlineCode>colorMap</InlineCode></>, <>菜单图标和颜色由后端下发的 <InlineCode>resourceId</InlineCode> 匹配。删除示例映射，新增对应的图标（从 lucide-react 导入）和颜色。</>],
        ]}
      />

      <H3>5. 可选调整项</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>src/config/constants.ts</InlineCode>, <InlineCode>API_CODE</InlineCode>, "如果后端返回的响应状态码不同（如 SUCCESS 替代 OK），需在此修改。"],
          [<InlineCode>src/config/theme-colors.ts</InlineCode>, "主题色配置", "可新增/删除主题配色方案，或修改默认主题。"],
          [<InlineCode>src/config/pagination.ts</InlineCode>, <><InlineCode>DEFAULT_PAGE_SIZE</InlineCode>、<InlineCode>PAGE_SIZE_OPTIONS</InlineCode></>, "分页默认值调整。"],
          [<InlineCode>src/middleware.ts</InlineCode>, "路由守卫规则", <>当前仅放行 <InlineCode>/login</InlineCode>，如需配置请修改。</>],
          [<InlineCode>src/lib/auth.ts</InlineCode>, "Token 存储键名", "如果 localStorage 键名不同需调整。"],
          [<InlineCode>src/api/http.ts</InlineCode>, "请求头 / 超时配置", "调整 Token 请求头名称及默认超时。"],
        ]}
      />

      <H3>快速上手检查清单</H3>
      <CodeBlock lang="text">{`✅ 1. 修改 package.json 项目名
✅ 2. 配置三个 .env 文件的 API 地址
✅ 3. 修改 login-config.ts 和 layout.tsx 中的品牌信息
✅ 4. 删除 src/app/ 下的示例业务页面
✅ 5. 清理 src/api/ 和 src/types/ 中的示例文件
✅ 6. 在 api-url.ts 中定义自己的接口路径
✅ 7. 在 routes.ts 中配置菜单图标映射
✅ 8. 替换 public/favicon.ico`}</CodeBlock>

      {/* ============== 后端接口配合 ============== */}
      <H2 id="sec-backend">九、后端接口配合说明</H2>
      <P>
        需要后端接口配合，后端接口示例项目地址：<Strong><InlineCode>https://github.com/jackliuyijun/easybuild-admin-api.git</InlineCode></Strong>
      </P>
      <TipBox>
        clone 项目到本地，启动项目接口为 <Strong>easybuild-admin</Strong> 示例项目提供接口服务。
      </TipBox>

    </DocLayout>
  )
}
