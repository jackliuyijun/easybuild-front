"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, TipBox, WarnBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong, Highlight } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-intro", label: "项目简介" },
  { id: "sec-get-project", label: "获取项目" },
  { id: "sec-tech-stack", label: "技术栈选型" },
  { id: "sec-architecture", label: "核心架构设计" },
  { id: "sec-structure", label: "目录结构说明" },
  { id: "sec-standards", label: "开发规范" },
  { id: "sec-implementation", label: "核心技术实现" },
  { id: "sec-commands", label: "开发环境命令" },
  { id: "sec-template", label: "模版使用指南" },
]

export default function AdminDocContent() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="EasyBuild-Admin"
      title="EasyBuild Admin 开发文档"
      subtitle="中后台前端项目 — 架构设计、技术栈与开发规范"
      readingTime="~15 min"
    >

      {/* ============== 项目简介 ============== */}
      <H2 id="sec-intro">项目简介</H2>
      <P>
        本文档旨在为开发者提供 <Strong>EasyBuild Admin</Strong>（易构）前端项目的技术全景视图，涵盖架构设计、技术栈选型、开发规范及核心逻辑实现细节。
      </P>
      <BulletList items={[
        <>GitHub 仓库：<InlineCode>https://github.com/jackliuyijun/easybuild-admin</InlineCode></>,
        <>npm 包：<InlineCode>https://www.npmjs.com/package/easybuild-admin</InlineCode></>,
      ]} />

      {/* ============== 获取项目 ============== */}
      <H2 id="sec-get-project">获取项目</H2>
      <TipBox>
        环境要求：<Strong>Node.js {">"}= 18.17.0</Strong>
      </TipBox>

      <H3>方式一：使用 CLI 命令创建（推荐）</H3>
      <P>
        一行命令即可创建项目，自动完成模板下载、项目信息替换、Git 初始化和依赖安装：
      </P>
      <CodeBlock lang="bash">npx easybuild-admin my-project</CodeBlock>
      <P>
        按提示依次输入项目描述、选择包管理器即可完成创建。也可以通过参数跳过交互，直接创建：
      </P>
      <CodeBlock lang="bash">npx easybuild-admin my-project -d "我的管理后台" --pm yarn</CodeBlock>

      <H4>常用命令参考</H4>
      <CodeBlock lang="bash">{`# 交互式创建（逐步引导）
npx easybuild-admin

# 指定项目名 + 描述 + 包管理器
npx easybuild-admin my-project -d "项目描述" --pm pnpm

# 只下载模板，不初始化 git 也不安装依赖
npx easybuild-admin my-project --skip-git --skip-install`}</CodeBlock>

      <H4>可用参数</H4>
      <DocTable
        headers={["参数", "说明", "默认值"]}
        rows={[
          [<InlineCode>[project-name]</InlineCode>, "项目名称", "交互输入"],
          [<InlineCode>-d, --description {"<desc>"}</InlineCode>, "项目描述", "交互输入"],
          [<InlineCode>--pm {"<pm>"}</InlineCode>, "包管理器：yarn / pnpm / npm", "交互选择"],
          [<InlineCode>--skip-install</InlineCode>, "跳过依赖安装", <InlineCode>false</InlineCode>],
          [<InlineCode>--skip-git</InlineCode>, "跳过 Git 初始化", <InlineCode>false</InlineCode>],
          [<InlineCode>--repo {"<repo>"}</InlineCode>, <>自定义模板仓库（<InlineCode>owner/repo#branch</InlineCode>）</>, <InlineCode>jackliuyijun/easybuild-admin</InlineCode>],
        ]}
      />

      <H3>方式二：手动下载</H3>
      <P>如果不使用 CLI，也可以直接从 GitHub 获取代码：</P>
      <CodeBlock lang="bash">{`# 下载代码
git clone https://github.com/jackliuyijun/easybuild-admin.git my-project

# 进入目录并安装依赖
cd my-project
yarn install`}</CodeBlock>
      <TipBox>
        推荐使用 <Strong>方式一</Strong>（CLI），自动完成项目名替换和初始化，省去手动修改的步骤。
      </TipBox>

      {/* ============== 技术栈选型 ============== */}
      <H2 id="sec-tech-stack">一、技术栈选型</H2>
      <P>
        项目基于现代前端生态构建，坚持 <Strong>全链路类型安全</Strong> 与 <Strong>高性能</Strong> 原则：
      </P>
      <DocTable
        headers={["领域", "选型", "说明"]}
        rows={[
          [<Strong>基础框架</Strong>, <Strong>Next.js 15 (App Router) + React 19</Strong>, "利用 React Server Components (RSC) 优化首屏并行渲染。"],
          [<Strong>语言</Strong>, <Strong>TypeScript 5.x</Strong>, "严格模式，确保从 API 定义到 UI 组件的端到端类型安全。"],
          [<Strong>样式体系</Strong>, <Strong>Tailwind CSS 3 + Lucide React</Strong>, "原子化 CSS，零运行时开销，配合 CSS Variables 实现动态主题。"],
          [<Strong>组件库</Strong>, <Strong>Shadcn/ui (Radix UI)</Strong>, "无头 (Headless) 组件驱动，源码级可控，符合 WAI-ARIA 无障碍标准。"],
          [<Strong>状态管理</Strong>, <Strong>Zustand</Strong>, "极简的状态流转，用于全局 UI 状态及同步的菜单数据管理。"],
          [<Strong>异步数据流</Strong>, <Strong>TanStack React Query v5</Strong>, "自动化的服务端状态同步、缓存失效及并发请求控制。"],
          [<Strong>表单方案</Strong>, <Strong>React Hook Form + Zod</Strong>, "基于非受控组件的高性能表单，通过 Zod 实现声明式 Schema 校验。"],
          [<Strong>表格解析</Strong>, <Strong>TanStack Table v8</Strong>, "配置化表格逻辑，支持虚拟滚动、列排序及复杂元数据渲染。"],
          [<Strong>包管理</Strong>, <Strong>Yarn 4 (Plug{"'"}n{"'"}Play)</Strong>, "提升依赖解析速度与磁盘占用率。"],
        ]}
      />

      {/* ============== 核心架构设计 ============== */}
      <H2 id="sec-architecture">二、核心架构设计</H2>
      <P>
        项目采用 <Strong>六层解耦架构</Strong>，确保业务逻辑与基础能力的隔离：
      </P>
      <NumberList items={[
        <><Strong>Middleware 层</Strong>：负责全局路由守卫、JWT Token 校验与非法请求重定向。</>,
        <><Strong>Layout 系统</Strong>：基于 Next.js Layout 特性，实现嵌套布局、侧边栏自适应及平滑的主题切换引擎。</>,
        <><Strong>驱动架构 (Driver-Based)</Strong>：前端不维护静态路由表。菜单由后端下发 Resource Tree，前端运行时动态将其映射为应用路由。</>,
        <><Strong>业务组件层 (Higher-Order Components)</Strong>：对 Shadcn/ui 进行二次封装，提供 <InlineCode>CustomForm</InlineCode> 和 <InlineCode>CustomTable</InlineCode> 等配置化组件，覆盖 90% 的 CRUD 场景。</>,
        <><Strong>数据通信层 (API Internal)</Strong>：基于 Axios 的拦截器管道，统一处理 Token 注入、多环境 BaseURL 切换及全局异常捕获。</>,
        <><Strong>状态映射层 (State Matrix)</Strong>：Zustand 负责跨组件的同步状态，React Query 负责 Server State 的本地缓存副本。</>,
      ]} />

      {/* ============== 目录结构说明 ============== */}
      <H2 id="sec-structure">三、目录结构说明</H2>
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
      <H2 id="sec-standards">四、开发规范</H2>

      <H3>1. 编码约定</H3>
      <BulletList items={[
        <><Strong>组件定义</Strong>：统一使用函数组件与 Arrow Functions。</>,
        <><Strong>文件命名</Strong>：组件目录使用 PascalCase；Hooks 使用 camelCase 且以 <InlineCode>use</InlineCode> 开头；类型文件以 <InlineCode>.types.ts</InlineCode> 结尾。</>,
        <><Strong>Props 调用</Strong>：必须声明接口 (Interface) 或类型 (Type)，严禁使用 <InlineCode>any</InlineCode>。</>,
      ]} />

      <H3>2. API 通信规范</H3>
      <BulletList items={[
        "所有接口必须定义请求参数与响应数据的 TS 类型。",
        <>业务异常必须通过 HTTP Interceptor 统一拦截处理，禁止在页面内重复编写 <InlineCode>try-catch</InlineCode>。</>,
      ]} />

      <H3>3. 组件封装原则</H3>
      <BulletList items={[
        <><Strong>优先解耦</Strong>：尽量编写 Dumb Components（展示性组件），将业务逻辑（Side Effects）抽离至自定义 Hooks。</>,
        <><Strong>配置驱动</Strong>：高级组件（CustomForm/Table）必须支持通过 JSON 配置项完全控制其渲染行为。</>,
      ]} />

      {/* ============== 核心技术实现细节 ============== */}
      <H2 id="sec-implementation">五、核心技术实现细节</H2>

      <H3>动态菜单与路由映射</H3>
      <P>
        项目在初始化时调用 <InlineCode>queryMenu</InlineCode> 接口。通过递归算法解析后端返回的 <InlineCode>{"Resource[]"}</InlineCode> 数组：
      </P>
      <NumberList items={[
        <>提取 <InlineCode>path</InlineCode> 与 <InlineCode>component</InlineCode> 的对应关系。</>,
        <>注入 <InlineCode>Lucide</InlineCode> 图标动态加载。</>,
        "状态持久化至 Zustand 及本地 Storage，实现 30 分钟缓存机制。",
      ]} />

      <H3>配置化表单引擎 (CustomForm)</H3>
      <P>
        基于 <InlineCode>react-hook-form</InlineCode> 的 Controller 设计：
      </P>
      <BulletList items={[
        <>支持 <InlineCode>Grid</InlineCode> 布局自适应。</>,
        <>内置 <InlineCode>Zod</InlineCode> 进行异步/同步字段联动校验。</>,
        "采用非受控模式，显著降低大表单输入的渲染延迟。",
      ]} />

      {/* ============== 开发环境常用命令 ============== */}
      <H2 id="sec-commands">六、开发环境常用命令</H2>
      <CodeBlock lang="bash">{`# 安装依赖 (Yarn v4)
yarn install

# 启动开发服务器 (默认端口: 4000)
yarn dev

# 生成生产环境构建产物
yarn build:prod

# 静态代码检查与质量控制
yarn lint`}</CodeBlock>
      <TipBox>
        环境要求：<InlineCode>Node.js {">"}= 18.17.0</InlineCode>
      </TipBox>

      {/* ============== 模版使用指南 ============== */}
      <H2 id="sec-template">七、模版使用指南 — 创建后需改动的文件</H2>
      <P>
        使用本模版创建新项目后，请按照以下清单逐一修改，完成项目初始化。
      </P>

      <H3>1. 项目基础信息</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>package.json</InlineCode>, <><InlineCode>name</InlineCode>、<InlineCode>version</InlineCode></>, <>将 <InlineCode>"easybuild-admin"</InlineCode> 改为你的项目名称，版本号按需设置。</>],
          [<InlineCode>src/app/layout.tsx</InlineCode>, <><InlineCode>metadata.title</InlineCode>、<InlineCode>metadata.description</InlineCode></>, <>修改浏览器标签页标题与 SEO 描述，替换 <InlineCode>"EasyBuild Admin - 易构"</InlineCode> 为你的项目名称。</>],
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
          [<InlineCode>src/config/api-url.ts</InlineCode>, <><InlineCode>API_URLS</InlineCode> 对象</>, <>核心文件。删除模版中的示例接口路径，替换为你自己的业务接口地址。<InlineCode>auth</InlineCode> 部分如果后端遵循相同登录协议则可保留。</>],
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
          [<><InlineCode>src/api/</InlineCode> 中的业务文件</>, <>如 goods.ts、banner.ts、order.ts 等，删除后按需新增自己的 API 模块。<Strong>保留</Strong> http.ts（Axios 封装）和 upload.ts（文件上传）。</>],
          [<><InlineCode>src/types/</InlineCode> 中的业务类型</>, <>如 goods.ts、order.ts、category.ts 等，删除后新增自己的类型定义。<Strong>保留</Strong> api.ts（通用响应类型）和 token.ts（Token 类型）。</>],
        ]}
      />
      <TipBox>
        <Strong>可保留的通用模块</Strong>：<InlineCode>src/app/auth/</InlineCode>（部门/角色/员工权限管理）和 <InlineCode>src/app/login/</InlineCode>（登录页）属于通用鉴权能力，如果后端接口兼容可直接复用。
      </TipBox>

      <H3>4. 菜单图标与颜色映射</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>src/config/routes.ts</InlineCode>, <><InlineCode>iconMap</InlineCode>、<InlineCode>colorMap</InlineCode></>, <>菜单图标和颜色由后端下发的 <InlineCode>resourceId</InlineCode> 匹配。删除模版中的示例映射，新增你自己的菜单 <InlineCode>resourceId</InlineCode> 对应的图标和颜色。图标从 <InlineCode>lucide-react</InlineCode> 中按需导入。</>],
        ]}
      />

      <H3>5. 可选调整项</H3>
      <DocTable
        headers={["文件", "需改动项", "说明"]}
        rows={[
          [<InlineCode>src/config/constants.ts</InlineCode>, <InlineCode>API_CODE</InlineCode>, "如果后端返回的响应状态码字段不同（如用 SUCCESS 替代 OK），需要在此修改。"],
          [<InlineCode>src/config/theme-colors.ts</InlineCode>, "主题色配置", "可新增/删除主题配色方案，或修改默认主题。"],
          [<InlineCode>src/config/pagination.ts</InlineCode>, <><InlineCode>DEFAULT_PAGE_SIZE</InlineCode>、<InlineCode>PAGE_SIZE_OPTIONS</InlineCode></>, "分页默认值，按业务需要调整。"],
          [<InlineCode>src/middleware.ts</InlineCode>, "路由守卫规则", <>当前仅放行 <InlineCode>/login</InlineCode>，如需增加公开路由或加入 Token 校验逻辑，请在此修改。</>],
          [<InlineCode>src/lib/auth.ts</InlineCode>, "Token 存储键名", <>如果 Token 的 localStorage 键名需与后端约定不同，在此修改 <InlineCode>access-token</InlineCode> 和 <InlineCode>user-info</InlineCode>。</>],
          [<InlineCode>src/api/http.ts</InlineCode>, "请求头 / 超时配置", <>如需调整 Token 请求头名称（默认 <InlineCode>Access-Token</InlineCode>）或超时时间（默认 <InlineCode>10000ms</InlineCode>），在此修改。</>],
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

    </DocLayout>
  )
}
