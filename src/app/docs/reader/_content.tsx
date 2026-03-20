"use client"

import { Download } from "lucide-react"

import { DocLayout } from "./_components/doc-layout"
import { CodeBlock, DocTable, TipBox, H2, H3, H4, P, BulletList, NumberList, InlineCode, Strong, CopyText } from "./_components/doc-components"

const outlineItems = [
  { id: "sec-overview", label: "1. 概述" },
  { id: "sec-env", label: "2. 环境要求" },
  { id: "sec-plugin", label: "3. 方式一：IntelliJ IDEA 插件（推荐）" },
  { id: "sec-cli", label: "4. 方式二：CLI 命令行工具" },
  { id: "sec-config", label: "5. 通用配置详解" },
  { id: "sec-arch", label: "6. 项目架构类型详解" },
  { id: "sec-codegen", label: "7. 生成代码详解" },
  { id: "sec-db", label: "8. 数据库支持与类型映射" },
  { id: "sec-annotation", label: "9. Entity 自定义注解说明" },
  { id: "sec-overwrite", label: "10. 文件覆盖策略" },
  { id: "sec-faq", label: "11. 常见问题（FAQ）" },
  { id: "sec-appendix", label: "12. 附录" },
]

export default function DocReaderPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="代码生成器"
      title="EasyFK Generator 代码生成器使用手册"
      subtitle="最新版：3.2.12"
      readingTime="~30 min"
    >

      {/* ============== 1. 概述 ============== */}
      <H2 id="sec-overview">1. 概述</H2>
      <P>
        EasyFK Generator 是 <Strong>易架构（EasyFK）</Strong> 框架的核心代码生成工具，面向 Java / Spring Boot 技术栈的开发团队，提供 <Strong>配置驱动、数据库感知、全层覆盖</Strong> 的一站式代码生成能力。
      </P>
      <P><Strong>核心能力：</Strong></P>
      <BulletList items={[
        <><Strong>项目骨架生成</Strong>：自动创建完整的 Maven / Gradle 多模块项目结构</>,
        <><Strong>全层代码生成</Strong>：Entity → Mapper → Repository → Service → API → Remote → Controller，一张表生成 8~15 个 Java 类</>,
        <><Strong>数据库感知</Strong>：直连数据库自动解析表结构、字段类型、注释等元数据</>,
        <><Strong>多架构支持</Strong>：单体（SINGLE）、微服务（MICROSERVICE）、多栈微服务（SMART）三种架构一键切换</>,
        <><Strong>多 ORM 支持</Strong>：MyBatis-Plus、MyBatis-Flex、Hibernate 三种 ORM 框架可选</>,
        <><Strong>多构建工具</Strong>：Maven、Gradle Groovy DSL、Gradle Kotlin DSL 三种构建方式</>,
        <><Strong>增量安全</Strong>：已有文件不覆盖，仅 DTO/Param 类随表结构刷新</>,
      ]} />
      <P><Strong>两种使用方式：</Strong></P>
      <NumberList items={[
        <><Strong>IntelliJ IDEA 插件</Strong>（推荐）：可视化操作界面，支持数据库导入表结构、分步生成、配置持久化，零学习成本</>,
        <><Strong>CLI 命令行工具</Strong>：脱离 IDE，一条命令完成全栈生成，适合自动化场景</>,
      ]} />

      {/* ============== 2. 环境要求 ============== */}
      <H2 id="sec-env">2. 环境要求</H2>
      <DocTable
        headers={["项目", "要求"]}
        rows={[
          ["JDK", "21 或更高版本"],
          ["IDE（插件方式）", "IntelliJ IDEA 2023.1 或更高版本"],
          ["数据库（可选）", "使用数据库导入表结构时需要可连接的数据库实例"],
        ]}
      />

      {/* ============== 3. 方式一：IntelliJ IDEA 插件（推荐） ============== */}
      <H2 id="sec-plugin">3. 方式一：IntelliJ IDEA 插件（推荐）</H2>
      <P>EasyFK Generator 提供了 IntelliJ IDEA 插件 <Strong>EasyFK Generator</Strong>，支持可视化操作界面，无需编写配置文件即可完成代码生成，是最便捷的使用方式。</P>

      <H3>3.1 插件安装</H3>
      <P><Strong>方式一：从插件市场安装（推荐）</Strong></P>
      <NumberList items={[
        <>打开 IntelliJ IDEA，进入 <InlineCode>File → Settings → Plugins</InlineCode>（macOS：<InlineCode>IntelliJ IDEA → Preferences → Plugins</InlineCode>）</>,
        <>选择 <Strong>Marketplace</Strong> 标签页</>,
        <>搜索 <CopyText text="EasyFK Generator" /></>,
        <>点击 <Strong>Install</Strong>，安装完成后重启 IDE</>,
      ]} />
      <TipBox>
        <Strong>提示：</Strong> 如果在插件市场中搜索不到 EasyFK Generator，可以从 JetBrains 插件官方页面手动下载安装包：
        <br />
        <a href="https://plugins.jetbrains.com/plugin/30796-easyfk-generator/versions#tabs" target="_blank" className="text-blue-500 hover:underline">plugins.jetbrains.com/plugin/30796-easyfk-generator/versions#tabs</a>
        <br />
        下载最新版本的 <InlineCode>.zip</InlineCode> 文件后，按照下方“从本地磁盘安装”的方式进行安装。
      </TipBox>

      <P><Strong>方式二：从本地磁盘安装</Strong></P>
      <NumberList items={[
        <>获取插件安装包 <InlineCode>easyfk-generator-idea-x.x.x.zip</InlineCode></>,
        <>打开 IntelliJ IDEA，进入 <InlineCode>File → Settings → Plugins</InlineCode></>,
        <>点击齿轮图标 ⚙ → <Strong>Install Plugin from Disk...</Strong></>,
        <>选择下载的<InlineCode>.zip</InlineCode> 文件，安装完成后重启 IDE</>,
      ]} />

      <H3>3.2 核心特性</H3>
      <BulletList items={[
        <><Strong>可视化配置</Strong>：通过对话框填写项目配置、模型配置、代码配置，无需手写 YAML</>,
        <><Strong>数据库导入</Strong>：可视化连接数据库，勾选需要导入的表，自动生成模型定义</>,
        <><Strong>分步生成</Strong>：对话框底部提供 “生成项目”、“生成模型”、“生成业务代码”、“生成自动装配” 四个独立按钮</>,
        <><Strong>工具窗口</Strong>：右侧面板快速入口，按场景分组（新建项目 / 增量生成 / 单独生成）</>,
        <><Strong>配置持久化</Strong>：自动保存 <InlineCode>.easyfk-generator.json</InlineCode> 到项目根目录，下次打开自动加载</>,
        <><Strong>快捷键</Strong>：<InlineCode>Ctrl + Alt + Z</InlineCode> 快速打开代码生成对话框</>,
      ]} />

      <H3>3.3 插件入口</H3>
      <DocTable
        headers={["入口", "说明"]}
        rows={[
          ["File → New → EasyFK Project", "新建项目，创建项目骨架并生成代码"],
          ["Generate → EasyFK 增量生成", "在已有项目中生成代码，已有文件不覆盖（Ctrl + Alt + Z）"],
          ["Generate → EasyFK 生成业务代码", "仅生成 Repository / Service / API / Remote / Controller"],
          ["Generate → EasyFK 刷新模型 (字段变更)", "重新生成 Entity / Mapper + DTO / Param"],
          ["Generate → EasyFK 刷新 DTO/Param", "仅重新生成 DTO 和 Param 类"],
          ["Generate → EasyFK 生成自动装配", "生成 Spring Boot AutoConfiguration"],
          ["右侧工具窗口 → EasyFK", "按场景分组的快捷操作面板"],
        ]}
      />

      <H3>3.4 全局设置</H3>
      <P><Strong>File → Settings → Tools → EasyFK Generator：</Strong></P>
      <DocTable
        headers={["设置项", "说明", "默认值"]}
        rows={[
          ["默认作者", "代码注释中的 @author", "eb-jack"],
          ["默认框架版本", "EasyFK 框架版本号", "3.2.12"],
          ["生成后自动刷新项目树", "生成完成后自动刷新 IDEA 项目目录", "开启"],
          ["生成后弹出结果统计", "生成完成后弹出结果信息对话框", "开启"],
        ]}
      />
      <TipBox>
        详细的 IDEA 插件使用说明请参阅 <InlineCode>easyfk-generator-idea/USER_MANUAL.md</InlineCode>。
      </TipBox>


      {/* ============== 4. 方式二：CLI 命令行工具 ============== */}
      <H2 id="sec-cli">4. 方式二：CLI 命令行工具</H2>
      <P>CLI 工具独立运行，不依赖 IDE 和 Spring Boot 项目环境，适合从零创建新项目、在任意目录快速生成代码，或配合 CI/CD 自动化流程使用。</P>

      <H3>4.1 安装</H3>
      <a
        href="/downloads/efg-3.2.12.zip"
        download
        className="flex items-center gap-3 rounded-[10px] border border-[#00FF8830] bg-[#00FF880A] px-5 py-4 transition-colors hover:border-[#00FF8860] hover:bg-[#00FF8814]"
      >
        <Download className="size-5 shrink-0 text-[#00FF88]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-white">下载 efg.zip</span>
          <span className="text-[12px] text-[#9CA3AF]">CLI 安装包 · 约 31 MB</span>
        </div>
      </a>
      <NumberList items={[
        <>获取安装包 <InlineCode>efg-3.2.12.zip</InlineCode> 并解压</>,
        <>进入 <InlineCode>efg-3.2.12</InlineCode> 目录执行安装</>,
      ]} />
      <P><Strong>Windows：</Strong></P>
      <CodeBlock lang="bat">{`双击 install.bat`}</CodeBlock>
      <P><Strong>macOS / Linux：</Strong></P>
      <CodeBlock lang="bash">{`chmod +x install && ./install`}</CodeBlock>
      <P>重新打开终端，验证安装：</P>
      <CodeBlock lang="bash">{`efg -V`}</CodeBlock>
      <P>输出以下内容表示安装成功：</P>
      <CodeBlock lang="plaintext">{`easyfk-generator 3.2.12`}</CodeBlock>

      <H3>4.2 卸载</H3>
      <P><Strong>Windows：</Strong> 双击 <InlineCode>uninstall.bat</InlineCode></P>
      <P><Strong>macOS / Linux：</Strong></P>
      <CodeBlock lang="bash">{`chmod +x uninstall && ./uninstall`}</CodeBlock>

      <H3>4.3 快速开始</H3>
      <CodeBlock lang="bash">{`# 1. 创建工作目录
mkdir my-project && cd my-project

# 2. 生成配置模板
efg init

# 3. 用编辑器打开 generator.yml，填入项目信息、app-type 和数据库配置

# 4. 执行全量生成
efg`}</CodeBlock>

      <H3>4.4 CLI 命令参考</H3>
      <H4>基本语法</H4>
      <CodeBlock lang="bash">{`efg [选项]
efg init [-o 文件名]`}</CodeBlock>

      <H4>生成命令</H4>
      <DocTable
        headers={["命令", "说明"]}
        rows={[
          ["efg", "全量生成（项目骨架 + Entity + Mapper + 业务代码 + 自动装配配置）"],
          ["efg -p", "仅生成项目骨架（目录结构 + 构建文件）"],
          ["efg -m", "仅生成 Entity + Mapper（包含 Mapper XML）"],
          ["efg -s", "仅生成业务代码（Repository / Service / API / Remote / Controller + DTO/Param 等）"],
          ["efg -a", "仅生成自动装配配置（AutoConfiguration）"],
          ["efg -d", "仅刷新 DTO 和 Param（数据库表结构变更后使用，不影响其他代码）"],
        ]}
      />

      <H4>组合使用</H4>
      <P>Flag 可以组合使用：</P>
      <DocTable
        headers={["命令", "说明"]}
        rows={[
          ["efg -pm", "项目骨架 + Entity + Mapper（新项目初始化第一步）"],
          ["efg -sa", "业务代码 + 自动装配配置（新增业务表后的第二步）"],
          ["efg -pms", "项目骨架 + Entity + 全部业务代码"],
        ]}
      />

      <H4>其他选项</H4>
      <DocTable
        headers={["选项", "说明"]}
        rows={[
          ["-c <文件>", "指定配置文件路径（默认读取当前目录下的 generator.yml）"],
          ["-h, --help", "查看帮助信息"],
          ["-V, --version", "查看版本号"],
        ]}
      />

      <H4>init 子命令</H4>
      <DocTable
        headers={["命令", "说明"]}
        rows={[
          ["efg init", "在当前目录生成 generator.yml 配置模板"],
          ["efg init -o my-config.yml", "指定输出文件名"],
        ]}
      />

      <H3>4.5 典型使用场景</H3>
      <H4>场景一：从零创建新项目</H4>
      <CodeBlock lang="bash">{`mkdir my-project && cd my-project
efg init                    # 生成配置模板
# 编辑 generator.yml，填入所有配置
efg                         # 全量生成`}</CodeBlock>

      <H4>场景二：已有项目新增业务表</H4>
      <NumberList items={[
        <>在数据库中创建新表</>,
        <>修改 <InlineCode>generator.yml</InlineCode>，在 <InlineCode>from-db-tables</InlineCode> 中添加新表名（或在 <InlineCode>model-list</InlineCode> 中新增 Model 定义）</>,
        <>分步执行：</>
      ]} />
      <CodeBlock lang="bash">{`efg -m                      # 生成新表的 Entity + Mapper
efg -s                      # 生成对应的业务代码
efg -a                      # 刷新自动装配配置（SMART 架构需要）`}</CodeBlock>
      <P>或一步到位：</P>
      <CodeBlock lang="bash">{`efg                         # 全量生成（已有文件不会被覆盖）`}</CodeBlock>

      <H4>场景三：数据库表结构变更（新增/修改字段）</H4>
      <CodeBlock lang="bash">{`efg -m                      # 重新生成 Entity（会覆盖）
efg -d                      # 刷新 DTO 和 Param（会覆盖）`}</CodeBlock>
      <TipBox>
        其他文件（Service、Controller 等）不会被重新生成，需要手动在对应文件中添加新字段的逻辑。
      </TipBox>

      <H4>场景四：使用不同配置文件管理多环境</H4>
      <CodeBlock lang="bash">{`efg -c dev-generator.yml            # 开发环境配置
efg -c prod-generator.yml -m        # 生产环境，仅生成 Model`}</CodeBlock>

      <H4>场景五：仅生成项目骨架（不涉及业务代码）</H4>
      <CodeBlock lang="bash">{`efg -p                      # 生成目录结构和构建文件，可以先搭建好项目结构再逐步添加业务`}</CodeBlock>

      <H3>4.6 完整配置示例</H3>
      <P>以下是 CLI 方式下 <InlineCode>generator.yml</InlineCode> 配置文件的完整示例，覆盖不同架构和典型场景。</P>

      <H4>4.6.1 单体项目（最小配置）</H4>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: my-app
        base-package: com.example.myapp
        project-type: single
        app-type: BMS
      code:
        module-name: myapp
        model-list:
          - model-name: Product
            model-desc: 商品信息
          - model-name: Order
            model-desc: 订单信息`}</CodeBlock>

      <H4>4.6.2 微服务项目（Spring Cloud）</H4>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: order-service
        base-package: com.example.order
        project-type: microservice
        rpc-type: cloud
        prd-type: single
        build-type: gradle
        app-type: CLIENT
        framework-version: 3.2.12
      code:
        module-name: order
        author: 开发者
        db-type: MYSQL
        db-short-url: localhost:3306/order_db
        db-user: root
        db-pwd: 123456
        from-db-tables: t_order,t_order_item
        table-prefix: t_`}</CodeBlock>

      <H4>4.6.3 微服务项目（Dubbo）</H4>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: user-service
        base-package: com.example.user
        project-type: microservice
        rpc-type: dubbo
        prd-type: separation
        build-type: maven
        app-type: BMS
        framework-version: 3.2.12
      code:
        module-name: user
        db-type: POSTGRE_SQL
        db-short-url: localhost:5432/user_db
        db-user: postgres
        db-pwd: 123456
        from-db-tables: user_info,user_address
        model-list:
          - model-name: UserInfo
            model-desc: 用户信息
            forbidden-filed: status
          - model-name: UserAddress
            model-desc: 收货地址`}</CodeBlock>

      <H4>4.6.4 多栈微服务项目（SMART）</H4>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.mcst
        project-name: trading
        base-package: com.mcst.trading
        project-type: smart
        prd-type: separation
        build-type: gradle
        gradle-type: groovy
        orm-type: MYBATIS
        log-type: LOGBACK
        app-type: BMS
        framework-version: 3.2.12
        project-version: 1.0.0-SNAPSHOT
        controller-auto-config: true
      code:
        module-name: trading
        author: 开发团队
        orm-type: MYBATIS
        spring-annotation: true
        create-controller: true
        db-type: MYSQL
        db-short-url: 192.168.1.100:3306/trading_db
        db-user: root
        db-pwd: secure_password
        table-prefix: t_
        from-db-tables: t_product,t_order,t_order_item,t_payment
        model-list:
          - model-name: Product
            model-desc: 商品
          - model-name: Order
            model-desc: 订单
          - model-name: OrderItem
            model-desc: 订单明细
            only-repository: true
          - model-name: Payment
            model-desc: 支付记录
            create-controller: false`}</CodeBlock>

      <H4>4.6.5 从数据库自动解析表结构</H4>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.example
        project-name: my-app
        base-package: com.example.myapp
        project-type: single
        app-type: BMS
      code:
        module-name: myapp
        db-type: MYSQL
        db-short-url: localhost:3306/my_database
        db-user: root
        db-pwd: 123456
        table-prefix: base_
        from-db-tables: base_product,base_category,base_brand`}</CodeBlock>

      <P><Strong>工作原理：</Strong></P>
      <NumberList items={[
        <>生成器通过 JDBC 连接数据库</>,
        <>使用 <InlineCode>DatabaseMetaData</InlineCode> 获取表结构（字段名、类型、注释、主键等）</>,
        <>自动去除表前缀（<InlineCode>base_product</InlineCode> → <InlineCode>Product</InlineCode>）</>,
        <>将下划线字段名转为驼峰命名（<InlineCode>product_name</InlineCode> → <InlineCode>productName</InlineCode>）</>,
        <>按类型映射规则转换 Java 类型</>,
        <>读取字段注释作为 <InlineCode>@Schema</InlineCode> 和 <InlineCode>@Column</InlineCode> 的描述</>,
      ]} />

      <H4>4.6.6 带资源权限注解的配置</H4>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:
        project-dir: D:\\workspace\\projects
        group-id: com.mcst
        project-name: user
        base-package: com.mcst.user
        project-type: smart
        prd-type: separation
        build-type: gradle
        app-type: BMS
      code:
        module-name: user
        db-short-url: localhost:3306/user_db
        db-pwd: 123456
        create-resource-annotation: true
        resource-group: userManagement
        resource-id: userManagement
        resource-name: 用户管理
        resource-path: /user
        resource-sort: 80000
        module-resource-sort: 10000
        increment-star: 100
        model-list:
          - model-name: UserInfo
            model-desc: 会员
          - model-name: UserAddress
            model-desc: 收货地址
          - model-name: UserAccount
            model-desc: 账号`}</CodeBlock>
      <P><Strong>排序值自动计算：</Strong></P>
      <BulletList items={[
        <>UserInfo: <InlineCode>modelResourceSort = 10000 + 100 = 10100</InlineCode></>,
        <>UserAddress: <InlineCode>modelResourceSort = 10000 + 200 = 10200</InlineCode></>,
        <>UserAccount: <InlineCode>modelResourceSort = 10000 + 300 = 10300</InlineCode></>,
      ]} />


      {/* ============== 5. 通用配置详解 ============== */}
      <H2 id="sec-config">5. 通用配置详解</H2>
      <H3>5.1 配置文件结构</H3>
      <P>无论是 CLI 的 <InlineCode>generator.yml</InlineCode> 还是 IDEA 插件的可视化配置，底层配置结构完全一致，均位于 <InlineCode>easyfk.config.generator</InlineCode> 节点下：</P>
      <CodeBlock lang="yaml">{`easyfk:
  config:
    generator:
      project:    # 项目配置
        ...
      code:       # 代码配置
        ...`}</CodeBlock>
      <TipBox>
        IDEA 插件的可视化配置会自动保存为 <InlineCode>.easyfk-generator.json</InlineCode> 文件，与 YAML 配置内容等价。
      </TipBox>

      <H3>5.2 项目配置（project）</H3>
      <P>配置前缀：<InlineCode>easyfk.config.generator.project</InlineCode></P>
      <DocTable
        headers={["配置项", "必填", "类型", "默认值", "说明"]}
        rows={[
          ["project-dir", "是", "String", "-", "项目输出根目录。例：D:\\workspace\\projects"],
          ["group-id", "是", "String", "-", "Maven groupId，例：com.example"],
          ["project-name", "是", "String", "-", "项目名称，同时作为项目根目录名和各子模块名前缀。例：my-app"],
          ["base-package", "是", "String", "-", "Java 包根路径。例：com.example.myapp"],
          ["project-type", "否", "枚举", "smart", "项目架构类型：single / microservice / smart"],
          ["rpc-type", "否", "枚举", "cloud", "RPC 类型，仅 microservice 时生效。cloud / dubbo"],
          ["build-type", "否", "枚举", "maven", "构建工具：maven → pom.xml；gradle → build.gradle"],
          ["gradle-type", "否", "枚举", "groovy", "Gradle DSL 类型，仅 build-type: gradle 时生效。groovy / kotlin"],
          ["orm-type", "否", "枚举", "MYBATIS", "ORM 框架：MYBATIS / MYBATIS_FLEX / HIBERNATE"],
          ["prd-type", "否", "枚举", "none", "PRD / Controller 层策略：none / single / separation"],
          ["log-type", "否", "枚举", "LOGBACK", "日志框架：LOGBACK / LOG4J2"],
          ["framework-version", "否", "String", "3.2.12", "EasyFK 框架版本号"],
          ["project-version", "否", "String", "1.0.0-SNAPSHOT", "生成的项目版本号"],
          ["app-type", "是", "枚举", "-", "应用类型，决定生成的项目模板和配置风格。可选值：BMS（后台管理端）、CLIENT（面向 C 端）"],
          ["create-prd-project", "否", "Boolean", "true", "是否生成 PRD（Controller）子项目"],
          ["create-repository", "否", "Boolean", "false", "是否生成独立的 Repository 子项目"],
          ["controller-auto-config", "否", "Boolean", "false", "是否为 Controller 层生成 AutoConfiguration 自动装配配置"],
        ]}
      />

      <H4>project-type 详细说明</H4>
      <DocTable
        headers={["值", "说明"]}
        rows={[
          ["single", "单体项目，所有代码在一个工程中，无子模块拆分"],
          ["microservice", "标准微服务架构，生成 API + Server + PRD 模块，支持选择一种 RPC 方式（Cloud 或 Dubbo）"],
          ["smart", "多栈微服务，在 microservice 基础上同时生成 Spring Cloud 和 Dubbo 两套 RPC 远程调用通道"],
        ]}
      />

      <H3>5.3 代码配置（code）</H3>
      <P>配置前缀：<InlineCode>easyfk.config.generator.code</InlineCode></P>

      <H4>基本配置</H4>
      <DocTable
        headers={["配置项", "必填", "类型", "默认值", "说明"]}
        rows={[
          ["module-name", "是", "String", "-", "模块名称，用于配置类名、远程调用 serviceId、Controller 路径前缀等。例：myapp"],
          ["author", "否", "String", "eb-jack", "代码注释中的作者信息"],
          ["orm-type", "否", "枚举", "MYBATIS", "ORM 类型：MYBATIS / MYBATIS_FLEX / HIBERNATE"],
          ["spring-annotation", "否", "Boolean", "true", "是否在实现类上添加 Spring 注解（如 @Repository、@Service）。project-type 为 smart 时无效"],
          ["create-controller", "否", "Boolean", "true", "是否生成 Controller 层代码（全局控制，可被 Model 级别覆盖）"],
          ["extends-supper-class", "否", "Boolean", "true", "Entity 是否继承框架基类，基类提供 deleted、insertTime、lastUpdateTime 字段"],
        ]}
      />

      <H4>数据库连接配置</H4>
      <DocTable
        headers={["配置项", "必填", "类型", "默认值", "说明"]}
        rows={[
          ["db-type", "否", "枚举", "MYSQL", "数据库类型"],
          ["db-short-url", "条件必填", "String", "-", "数据库短连接地址，格式：host:port/database。仅使用 from-db-tables 时必填"],
          ["db-user", "否", "String", "root", "数据库用户名"],
          ["db-pwd", "条件必填", "String", "-", "数据库密码。仅使用 from-db-tables 时必填"],
        ]}
      />
      <TipBox>
        <Strong>连接字符串格式说明：</Strong> <InlineCode>db-short-url</InlineCode> 只需填写 <InlineCode>host:port/database</InlineCode> 部分，生成器会自动拼接完整的 JDBC URL。例如 MySQL 会自动拼接为 <InlineCode>jdbc:mysql://host:port/database?characterEncoding=UTF-8&useSSL=false&...</InlineCode>
      </TipBox>

      <H4>表配置</H4>
      <DocTable
        headers={["配置项", "必填", "类型", "默认值", "说明"]}
        rows={[
          ["table-prefix", "否", "String", "-", "全局表名前缀，生成类名时自动去除。例：配置 base_，表 base_product → 类名 Product"],
          ["from-db-tables", "否", "String", "-", "需要从数据库读取结构的表名列表，逗号分隔。例：product,order,user_info"],
        ]}
      />

      <H3>5.4 Model 定义配置</H3>
      <P>Model 定义在 <InlineCode>code.model-list</InlineCode> 节点下，是一个列表。每个 Model 对应数据库中的一张表，也对应生成的一组完整分层代码。</P>
      <CodeBlock lang="yaml">{`code:
  model-list:
    - model-name: Product
      model-desc: 商品信息
      # ... 更多配置
    - model-name: Order
      model-desc: 订单信息`}</CodeBlock>

      <H4>Model 配置项详解</H4>
      <DocTable
        headers={["配置项", "必填", "类型", "默认值", "说明"]}
        rows={[
          ["model-name", "是", "String", "-", "模型名称，大驼峰命名。对应所有类名前缀"],
          ["model-desc", "否", "String", "-", "模型中文描述，用于代码注释、Swagger 文档描述等"],
          ["table-name", "否", "String", "自动推导", "对应的数据库表名。不填则根据 model-name 自动推导"],
          ["id-type", "否", "String", "String", "主键字段的 Java 类型：String 或 Long"],
          ["id-is-auto", "否", "Boolean", "false", "主键是否自增"],
          ["super-class", "否", "String", "BaseMyBatisPlusEntity", "Entity 父类的完全限定类名"],
          ["only-repository", "否", "Boolean", "false", "是否只生成 Repository 层"],
          ["create-controller", "否", "Boolean", "true", "是否为该 Model 生成 Controller"],
          ["table-prefix", "否", "String", "继承全局", "该 Model 专属的表前缀"],
          ["forbidden-filed", "否", "String", "-", "禁用字段名（如 status），设置后 Controller 生成启用/禁用接口"],
          ["resource-group", "否", "String", "继承全局", "该 Model 的资源权限分组"],
          ["resource-name", "否", "String", "继承全局", "该 Model 的资源权限名称"],
          ["resource-id", "否", "String", "继承全局", "该 Model 的资源权限 ID"],
          ["resource-path", "否", "String", "继承全局", "该 Model 的资源权限前端路由路径"],
          ["resource-sort", "否", "Integer", "继承全局", "资源组排序值"],
          ["model-resource-sort", "否", "Integer", "自动计算", "当前 Model 的资源排序值"],
        ]}
      />
      <TipBox>
        <Strong>from-db-tables 和 model-list 的关系：</Strong> 两者可以同时使用。<InlineCode>from-db-tables</InlineCode> 自动从数据库读取表结构生成 Model 信息。如果同一个 Model 在 <InlineCode>model-list</InlineCode> 中也有定义，则 <InlineCode>model-list</InlineCode> 中的配置作为覆盖项优先生效。
      </TipBox>

      <H3>5.5 资源权限配置</H3>
      <P>配置前缀：<InlineCode>easyfk.config.generator.code</InlineCode></P>
      <DocTable
        headers={["配置项", "必填", "类型", "默认值", "说明"]}
        rows={[
          ["create-resource-annotation", "否", "Boolean", "false", "总开关：是否生成资源权限注解"],
          ["resource-group", "否", "String", "-", "资源所属分组标识"],
          ["resource-name", "否", "String", "-", "资源所属分组的显示名称"],
          ["resource-id", "否", "String", "-", "资源分组 ID"],
          ["resource-path", "否", "String", "-", "资源分组对应的前端路由路径"],
          ["resource-sort", "否", "Integer", "10000", "资源分组的排序基础值"],
          ["module-resource-sort", "否", "Integer", "10000", "各 Model 资源排序的起始值"],
          ["increment-star", "否", "Integer", "100", "多个 Model 之间排序值的自增步长"],
        ]}
      />
      <P>启用后生成的 Controller 示例注解：</P>
      <CodeBlock lang="java">{`@ResourceController(group = "operationSetting", id = "operationSetting",
    name = "运营管理", sort = 81000, path = "/operation")
public class ProductController {

    @AuthResource(id = "productManage", name = "商品管理",
        pId = "operationSetting", pName = "运营管理",
        sort = 10100, path = "/operation/product",
        category = ResourceCategory.menu)
    public ResponseResult<List<ProductResp>> queryPage(...) { ... }
}`}</CodeBlock>

      {/* ============== 6. 项目架构类型详解 ============== */}
      <H2 id="sec-arch">6. 项目架构类型详解</H2>
      <P>EasyFK Generator 内置四种项目架构，覆盖从小型工具到大型平台的不同场景。</P>

      <H3>6.1 SINGLE 单体架构</H3>
      <P><Strong>适用场景：</Strong> 中小型项目、快速原型验证、内部工具系统</P>
      <P><Strong>配置：</Strong> <InlineCode>project-type: single</InlineCode></P>
      <P><Strong>生成的项目结构：</Strong></P>
      <CodeBlock lang="plaintext">{`my-app/
├── pom.xml (或 build.gradle)
├── src/main/java/com/example/myapp/
│   ├── ServerApp.java                          # 启动类
│   ├── controller/
│   │   └── ProductController.java              # Controller（直接调用 Service）
│   ├── api/
│   │   ├── dto/ProductDto.java                 # DTO
│   │   ├── param/ProductParam.java             # 查询参数
│   │   ├── request/
│   │   │   ├── ProductReq.java                 # 请求对象
│   │   │   └── ProductEditReq.java             # 编辑请求对象
│   │   └── response/ProductResp.java           # 响应对象
│   └── service/
│       ├── IProductService.java                # 服务接口
│       ├── impl/ProductServiceImpl.java        # 服务实现
│       ├── persistence/
│       │   ├── model/Product.java              # Entity
│       │   └── mapper/ProductMapper.java       # Mapper 接口
│       └── repository/
│           ├── IProductRepository.java         # 仓储接口
│           └── impl/ProductRepositoryImpl.java # 仓储实现
├── src/main/resources/
│   └── mappings/ProductMapper.xml              # Mapper XML
└── config/
    ├── application.yml
    ├── application-dev.yml
    ├── application-test.yml
    ├── application-prod.yml
    └── logback.xml (或 log4j2.xml)`}</CodeBlock>
      <H4>特点</H4>
      <BulletList items={[
        "所有代码在同一个工程中",
        "Controller 直接依赖 Service 层，无 Remote/API 中间层",
        <><InlineCode>{"{basePackage}.service"}</InlineCode> 代替 <InlineCode>{"{basePackage}.server"}</InlineCode></>,
        <>Service 接口路径使用 <InlineCode>{"{basePackage}.api"}</InlineCode></>,
      ]} />

      <H3>6.2 MICRO_PRD 微服务产品层架构</H3>
      <P><Strong>适用场景：</Strong> BMS 后台管理端、ToC 端的接口网关项目，仅提供 REST API 接口，本身无业务逻辑，通过 RPC 调用后端微服务获取数据</P>
      <P><Strong>配置：</Strong> <InlineCode>project-type: micro_prd</InlineCode>，<InlineCode>rpc-type: cloud</InlineCode> 或 <InlineCode>dubbo</InlineCode>（必选）</P>
      <P><Strong>生成的项目结构：</Strong></P>
      <CodeBlock lang="plaintext">{`my-app/
├── pom.xml (或 build.gradle + settings.gradle)
├── src/main/java/com/example/myapp/
│   └── MyappPrdApp.java                          # 启动类（含 RPC 注解）
└── config/
    ├── application.yml
    ├── application-dev.yml
    ├── application-test.yml
    ├── application-prod.yml
    └── logback.xml (或 log4j2.xml)`}</CodeBlock>
      <H4>特点</H4>
      <BulletList items={[
        "与 SINGLE 类似的扁平结构（单模块），但依赖完全不同",
        <><Strong>RPC 必选</Strong>：必须选择 CLOUD 或 DUBBO 作为远程调用方式</>,
        <><Strong>无 ORM/DB</Strong>：不包含任何数据库相关依赖</>,
        <><Strong>无业务代码</Strong>：不生成 Entity、Mapper、Repository、Service、DTO、Param、Controller 等</>,
        <><Strong>仅骨架代码</Strong>：只生成启动类、配置文件、日志配置</>,
        <><InlineCode>运行时引入各业务模块的 API 接口项目</InlineCode>（如 xxx-cloud-api 或 xxx-dubbo-api），通过 RPC 进行远程调用</>,
        <>包含 <InlineCode>web-prd</InlineCode>、<InlineCode>doc-knife4j</InlineCode>、<InlineCode>registry-nacos</InlineCode>、<InlineCode>rpc-{"\${rpcType}"}</InlineCode> 等依赖</>,
        <>可选引入 <InlineCode>auth-prd</InlineCode>（BMS 时）和 <InlineCode>auth-{"\${rpcType}"}-api</InlineCode>（认证模块的 RPC 接口）</>,
      ]} />
      <H4>典型使用流程</H4>
      <NumberList items={[
        <>使用 MICRO_PRD 生成项目骨架和基础配置</>,
        <>手动在 pom.xml / build.gradle 中引入需要调用的微服务 API 模块依赖</>,
        <>手动编写 Controller，注入各微服务的 Remote/API 接口进行远程调用</>,
        <>配置 Nacos 注册中心地址，启动项目</>,
      ]} />

      <H3>6.3 MICROSERVICE 微服务架构</H3>
      <P><Strong>适用场景：</Strong> 标准微服务拆分，使用单一 RPC 协议（Spring Cloud 或 Dubbo）</P>
      <P><Strong>配置：</Strong> <InlineCode>project-type: microservice</InlineCode>，<InlineCode>rpc-type: cloud</InlineCode> 或 <InlineCode>dubbo</InlineCode></P>
      <P><Strong>生成的项目结构（以 Spring Cloud 为例）：</Strong></P>
      <CodeBlock lang="plaintext">{`my-app/
├── pom.xml (或 build.gradle + settings.gradle)    # 父工程
│
├── my-app-api/                                     # API 定义模块
│   ├── pom.xml
│   └── src/main/java/com/example/myapp/api/
│       ├── IProductApi.java                        # API 接口（仅 SMART 架构生成）
│       ├── dto/ProductDto.java
│       ├── param/ProductParam.java
│       ├── request/
│       │   ├── ProductReq.java
│       │   └── ProductEditReq.java
│       └── response/ProductResp.java
│
├── my-app-server/                                  # 服务实现模块
│   ├── pom.xml
│   ├── src/main/java/com/example/myapp/
│   │   ├── ServerApp.java                          # 启动类
│   │   └── server/
│   │       ├── persistence/model/Product.java
│   │       ├── persistence/mapper/ProductMapper.java
│   │       ├── repository/
│   │       │   ├── IProductRepository.java
│   │       │   └── impl/ProductRepositoryImpl.java
│   │       ├── service/
│   │       │   ├── IProductService.java
│   │       │   └── impl/ProductServiceImpl.java
│   │       └── impl/
│   │           └── ProductRemoteImpl.java          # RPC 实现
│   ├── src/main/resources/mappings/ProductMapper.xml
│   └── config/
│       ├── application.yml / -dev.yml / -test.yml / -prod.yml
│       └── logback.xml
│
└── my-app-prd/                                     # PRD 层（Controller）
    ├── pom.xml
    └── src/main/java/com/example/myapp/
        ├── ClientApp.java                          # 启动类
        └── controller/
            └── ProductController.java              # Controller（通过 Remote 调用 Server）`}</CodeBlock>
      <P>当 <InlineCode>prd-type: separation</InlineCode> 时，PRD 层会分为两个独立项目（与 server 平级）：</P>
      <CodeBlock lang="plaintext">{`my-app/
├── ...
├── my-app-prd-client/    # C 端 / 用户端 Controller
│   ├── ClientApp.java
│   └── controller/ProductController.java
└── my-app-prd-bms/       # B 端 / 管理后台 Controller
    ├── BmsApp.java
    └── controller/ProductBmsController.java`}</CodeBlock>

      <H3>6.4 SMART 多栈微服务架构</H3>
      <P><Strong>适用场景：</Strong> 大型平台项目，需要同时支持 Spring Cloud 和 Dubbo 两种 RPC 协议</P>
      <P><Strong>配置：</Strong> <InlineCode>project-type: smart</InlineCode></P>
      <P><Strong>生成的项目结构：</Strong></P>
      <CodeBlock lang="plaintext">{`my-app/
├── pom.xml
│
├── my-app-api/                                     # API 定义模块
│   └── com/example/myapp/api/
│       ├── IProductApi.java                        # 统一 API 接口
│       ├── dto/ProductDto.java
│       ├── param/ProductParam.java
│       ├── request/ProductReq.java / ProductEditReq.java
│       └── response/ProductResp.java
│
├── my-app-server/                                  # 服务实现模块
│   └── com/example/myapp/server/
│       ├── persistence/model/Product.java
│       ├── persistence/mapper/ProductMapper.java
│       ├── repository/IProductRepository.java + impl/
│       ├── service/IProductService.java + impl/
│       ├── impl/ProductApiServerImpl.java          # API 服务端实现
│       └── config/MyappServerConfig.java           # 自动装配配置
│
├── my-app-remote/                                  # 远程调用模块（父项目）
│   │
│   ├── my-app-cloud-api/                           # Spring Cloud 客户端
│   │   └── com/example/myapp/remote/
│   │       ├── IProductRemote.java                 # Feign 接口
│   │       ├── impl/ProductApiScImpl.java          # API 的 SC 实现
│   │       ├── properties/MyappApiProperties.java  # 配置属性
│   │       └── config/MyappApiConfig.java          # 自动装配
│   │
│   ├── my-app-cloud-provider/                      # Spring Cloud 服务提供者
│   │   └── com/example/myapp/remote/provider/
│   │       └── impl/ProductRemoteImpl.java         # Remote 实现
│   │
│   ├── my-app-dubbo-api/                           # Dubbo 客户端
│   │   └── com/example/myapp/remote/
│   │       ├── IProductRemote.java                 # Dubbo 接口
│   │       └── impl/ProductApiDubboImpl.java       # API 的 Dubbo 实现
│   │
│   └── my-app-dubbo-provider/                      # Dubbo 服务提供者
│       └── com/example/myapp/remote/provider/
│           └── impl/ProductRemoteImpl.java
│
├── my-app-prd-client/                                 # PRD / Controller 层（C 端）
│   └── controller/ProductController.java
│
└── my-app-prd-bms/                                    # PRD / Controller 层（B 端）
    └── controller/ProductBmsController.java`}</CodeBlock>
      <H4>SMART 架构的关键特点</H4>
      <BulletList items={[
        <>定义了统一的 <InlineCode>IProductApi</InlineCode> 接口</>,
        <>Server 模块实现 <InlineCode>ProductApiServerImpl</InlineCode>（本地直接调用 Service）</>,
        <>Cloud API 模块实现 <InlineCode>ProductApiScImpl</InlineCode>（通过 Feign 远程调用）</>,
        <>Dubbo API 模块实现 <InlineCode>ProductApiDubboImpl</InlineCode>（通过 Dubbo 远程调用）</>,
        "Controller 层依赖 API 接口，运行时通过 Spring Boot AutoConfiguration 自动注入对应的实现",
        "切换调用方式只需更换依赖包，无需修改业务代码",
      ]} />

      <H3>6.5 灵活组合项目架构</H3>
      <P>四种内置架构并非固定不变的模板，而是通过多个配置维度的组合来决定最终生成的项目结构。开发团队可以根据业务需求，灵活调整以下配置维度来定制适合自己的项目架构。</P>
      <H4>项目结构维度</H4>
      <P>通过 <InlineCode>project-type</InlineCode> + <InlineCode>prd-type</InlineCode> 的组合：</P>
      <DocTable
        headers={["project-type", "prd-type", "生成的子模块"]}
        rows={[
          ["single", "（不适用）", "单一工程，所有代码在一个项目中"],
          ["micro_prd", "（不适用）", "单一工程，仅启动类 + 配置文件，无业务代码"],
          ["microservice", "none", "api + server（无 Controller 层项目）"],
          ["microservice", "single", "api + server + prd"],
          ["microservice", "separation", "api + server + prd-client + prd-bms"],
          ["smart", "none", "api + server + remote（含 cloud/dubbo 四个子模块）"],
          ["smart", "single", "api + server + remote + prd"],
          ["smart", "separation", "api + server + remote + prd-client + prd-bms"],
        ]}
      />
      <TipBox>
        例如：只需要后端 API 服务、不需要 Controller 层的项目，使用 <InlineCode>microservice</InlineCode> + <InlineCode>prd-type: none</InlineCode> 即可。
      </TipBox>

      <H4>构建工具维度</H4>
      <DocTable
        headers={["build-type", "生成的构建文件"]}
        rows={[
          ["maven", "pom.xml"],
          ["gradle", "build.gradle + settings.gradle（Groovy DSL）"],
        ]}
      />

      <H4>技术栈维度</H4>
      <DocTable
        headers={["配置项", "影响范围"]}
        rows={[
          ["orm-type", "持久化依赖和 Entity 代码风格：MyBatis-Plus（默认）→ @TableName + BaseMapper；MyBatis-Flex → Flex 风格注解；Hibernate → JPA 注解"],
          ["rpc-type", "MICROSERVICE 和 MICRO_PRD 架构生效（MICRO_PRD 时必选），决定 RPC 调用方式和相关依赖"],
          ["log-type", "日志配置文件：logback.xml 或 log4j2.xml"],
          ["db-type", "构建文件中的数据库驱动依赖（如 MySQL / PostgreSQL），以及 JDBC URL 拼接规则"],
          ["include-auth", "是否在构建文件中引入 EasyFK 框架的 auth 权限模块依赖"],
        ]}
      />

      <H4>代码层裁剪维度</H4>
      <DocTable
        headers={["配置项", "作用域", "说明"]}
        rows={[
          ["only-repository", "Model 级", "设为 true 时只生成 Entity + Mapper + Repository + DTO，不生成 Service / API / Controller / Remote"],
          ["create-controller", "全局 / Model 级", "控制是否生成 Controller 层代码，Model 级配置优先于全局配置"],
          ["controller-auto-config", "全局", "SMART 架构下，是否为 Controller 层额外生成 Spring Boot AutoConfiguration 自动装配配置"],
        ]}
      />

      <H4>典型定制场景</H4>
      <P><Strong>场景一：纯后端微服务（无 Controller）</Strong></P>
      <CodeBlock lang="yaml">{`project-type: microservice
rpc-type: cloud
prd-type: none          # 不生成 PRD（Controller）子项目`}</CodeBlock>

      <P><Strong>场景二：SMART 架构 + 部分 Model 只要数据层</Strong></P>
      <CodeBlock lang="yaml">{`project-type: smart
prd-type: separation
code:
  model-list:
    - model-name: Order
      model-desc: 订单
    - model-name: OrderItem
      model-desc: 订单明细
      only-repository: true       # 只生成数据访问层
    - model-name: Payment
      model-desc: 支付记录
      create-controller: false    # 有 Service 但不生成 Controller`}</CodeBlock>

      <P><Strong>场景三：单体项目使用 Gradle + MyBatis-Flex</Strong></P>
      <CodeBlock lang="yaml">{`project-type: single
build-type: gradle
orm-type: MYBATIS_FLEX
app-type: BMS`}</CodeBlock>
      <TipBox>
        <Strong>总结：</Strong> 四种内置架构是推荐的最佳实践起点。通过 <InlineCode>project-type</InlineCode> 等组合配置，可灵活定制业务场景需求。
      </TipBox>

      {/* ============== 7. 生成代码详解 ============== */}
      <H2 id="sec-codegen">7. 生成代码详解</H2>
      <P>以下以 Model 名为 <InlineCode>Product</InlineCode>、模块名为 <InlineCode>myapp</InlineCode> 为例说明生成的各层代码。</P>

      <H3>7.1 Entity 实体类</H3>
      <P><Strong>文件：</Strong> <InlineCode>Product.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{server}/persistence/model/"}</InlineCode></P>
      <P>生成 MyBatis-Plus（默认）：</P>
      <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("product")
@AutoMapper(target = ProductDto.class)
public class Product extends BaseMyBatisPlusEntity<Product> {

    @PrimaryKey
    @TableId(type = IdType.ASSIGN_UUID)
    @EntityColumn(comment = "商品信息ID")
    private String productId;

    @EntityColumn(comment = "商品名称")
    private String productName;

    @EntityColumn(comment = "商品价格")
    private BigDecimal price;
}`}</CodeBlock>

      <H3>7.2 Mapper 接口与 XML</H3>
      <P><Strong>Mapper 接口：</Strong> <InlineCode>ProductMapper.java</InlineCode></P>
      <CodeBlock lang="java">{`public interface ProductMapper extends BaseMapper<Product> {
}`}</CodeBlock>
      <P><Strong>Mapper XML：</Strong> <InlineCode>ProductMapper.xml</InlineCode> — 位于 <InlineCode>resources/mappings/</InlineCode> 目录</P>

      <H3>7.3 DTO 数据传输对象</H3>
      <P><Strong>文件：</Strong> <InlineCode>ProductDto.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/dto/"}</InlineCode></P>
      <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据对象")
@SuperBuilder
@NoArgsConstructor
public class ProductDto extends BaseDto {

    @PrimaryKey
    @Schema(description = "商品信息ID")
    private String productId;

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品价格")
    private BigDecimal price;
}`}</CodeBlock>

      <H3>7.4 Param 查询参数对象</H3>
      <P><Strong>文件：</Strong> <InlineCode>ProductParam.java</InlineCode>　<Strong>位置：</Strong> <InlineCode>{"{api}/param/"}</InlineCode></P>
      <CodeBlock lang="java">{`@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "商品信息数据参数对象")
@SuperBuilder
@NoArgsConstructor
public class ProductParam extends BasicParam {

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品价格")
    private BigDecimal price;
}`}</CodeBlock>

      <H3>7.5 Req 请求对象</H3>
      <P><Strong>文件：</Strong> <InlineCode>ProductReq.java</InlineCode></P>
      <CodeBlock lang="java">{`public class ProductReq extends ProductParam {
}`}</CodeBlock>

      <H3>7.6 Resp 响应对象</H3>
      <P><Strong>文件：</Strong> <InlineCode>ProductResp.java</InlineCode></P>
      <CodeBlock lang="java">{`public class ProductResp extends ProductDto {
}`}</CodeBlock>

      <H3>7.7 EditReq 编辑请求对象</H3>
      <P><Strong>文件：</Strong> <InlineCode>ProductEditReq.java</InlineCode></P>
      <CodeBlock lang="java">{`public class ProductEditReq extends ProductDto {
}`}</CodeBlock>

      <H3>7.8 Repository 仓储层</H3>
      <P><Strong>接口：</Strong> <InlineCode>IProductRepository.java</InlineCode></P>
      <CodeBlock lang="java">{`public interface IProductRepository extends IBaseRepository<ProductDto, String> {
}`}</CodeBlock>
      <P><Strong>实现：</Strong> <InlineCode>ProductRepositoryImpl.java</InlineCode></P>
      <CodeBlock lang="java">{`@Repository
public class ProductRepositoryImpl
    extends BaseMyBatisRepositoryImpl<ProductMapper, ProductDto, Product, String>
    implements IProductRepository {
}`}</CodeBlock>

      <H3>7.9 Service 服务层</H3>
      <P><Strong>接口：</Strong> <InlineCode>IProductService.java</InlineCode></P>
      <CodeBlock lang="java">{`public interface IProductService extends IBaseService<ProductResp, String, ProductReq> {
}`}</CodeBlock>

      <H3>7.10 API 接口层</H3>
      <P><Strong>仅 SMART 架构生成。</Strong></P>
      <P><Strong>文件：</Strong> <InlineCode>IProductApi.java</InlineCode></P>
      <CodeBlock lang="java">{`public interface IProductApi extends IBaseApi<ProductResp, String, ProductReq> {
}`}</CodeBlock>

      <H3>7.11 Controller 控制器层</H3>
      <DocTable
        headers={["project-type", "prd-type", "生成的 Controller"]}
        rows={[
          ["single", "single", "直接注入 IProductService，本地调用"],
          ["microservice + cloud", "single", "注入 Remote 接口（Feign），远程调用"],
          ["microservice + dubbo", "single", "注入 Remote 接口（Dubbo），远程调用"],
          ["smart", "single", "注入 IProductApi，具体实现由自动装配决定"],
          ["任意", "separation", "同时生成 ProductController（C 端）和 ProductBmsController（B 端）"],
        ]}
      />

      <H3>7.12 SpringCloud Remote 远程调用层</H3>
      <CodeBlock lang="java">{`@FeignClient(value = "\${easyfk.config.remote.myapp.service-id:server}",
    path = "\${easyfk.config.remote.myapp.base-path:/remote}/myapp/product")
public interface IProductRemote extends IBaseRemote<ProductResp, String, ProductReq> {
}`}</CodeBlock>

      <H3>7.13 Dubbo Remote 远程调用层</H3>
      <CodeBlock lang="java">{`public interface IProductRemote extends IDubboBaseRemote<ProductResp, String, ProductReq> {
}`}</CodeBlock>

      <H3>7.14 AutoConfiguration 自动装配</H3>
      <P>主要用于 SMART 架构，以及启用了 <InlineCode>controller-auto-config</InlineCode> 的微服务架构。自动为 Server、API、Provider 及 Controller 模块生成自动装配类并注册配置。</P>

      <H3>7.15 启动类与配置文件</H3>
      <P>非 SINGLE 架构会生成单独的启动类，例如 <InlineCode>ServerApp.java</InlineCode>、<InlineCode>ClientApp.java</InlineCode> 等，以及各环境适用的配置和日志文件。</P>

      {/* ============== 8. 数据库支持与类型映射 ============== */}
      <H2 id="sec-db">8. 数据库支持与类型映射</H2>
      <H3>8.1 支持的数据库</H3>
      <P>支持多达 22 种数据库：MYSQL, MARIADB, POSTGRE_SQL, ORACLE, ORACLE_12C, SQL_SERVER 等等。</P>

      <H3>8.2 字段类型映射规则</H3>
      <DocTable
        headers={["数据库字段类型", "Java 类型"]}
        rows={[
          ["DATETIME, TIMESTAMP", "LocalDateTime"],
          ["DATE", "LocalDate"],
          ["TIME", "LocalTime"],
          ["DECIMAL, NUMERIC", "BigDecimal"],
          ["TINYINT, BOOLEAN, BIT", "Boolean"],
          ["INT, INT4, INTEGER", "Integer"],
          ["BIGINT, NUMBER, INT8", "Long"],
          ["DOUBLE, FLOAT", "Double"],
          ["VARCHAR, CHAR, TEXT, CLOB", "String"],
        ]}
      />

      {/* ============== 9. Entity 自定义注解说明 ============== */}
      <H2 id="sec-annotation">9. Entity 自定义注解说明</H2>
      <P>在已生成的 Entity 文件中，可以手动添加以下 EasyFK 框架提供的自定义注解，再次执行代码生成即可应用到各层中。</P>

      <H4>@SingleUniqueField — 单字段唯一校验</H4>
      <CodeBlock lang="java">{`@SingleUniqueField(repetitionMsg = "商品名称已存在")
@EntityColumn(comment = "商品名称")
private String productName;`}</CodeBlock>

      <H4>@CombUniqueField — 组合唯一校验</H4>
      <CodeBlock lang="java">{`@CombUniqueField(repetitionMsg = "该分类下已存在同名商品", combinationField = "categoryId")
private String productName;`}</CodeBlock>

      <H4>@BetweenConditionField — 区间查询字段</H4>
      <CodeBlock lang="java">{`@BetweenConditionField
private LocalDateTime createTime;`}</CodeBlock>
      <P>会自动生成 <InlineCode>createTimeStart</InlineCode> 和 <InlineCode>createTimeEnd</InlineCode> 查询字段。</P>

      <H4>@ForbiddenField — 禁用字段</H4>
      <CodeBlock lang="java">{`@ForbiddenField(value = "forbidden")`}</CodeBlock>
      <P>标注在 Entity 类上，会自动生成启用/禁用功能。</P>

      {/* ============== 10. 文件覆盖策略 ============== */}
      <H2 id="sec-overwrite">10. 文件覆盖策略</H2>
      <DocTable
        headers={["策略", "涉及文件", "行为"]}
        rows={[
          ["不存在才创建", "Mapper 接口/XML, Repository, Service, API, Controller, Remote, Req/Resp, 启动类, 配置文件", "文件已存在则跳过，绝不覆盖"],
          ["删除后重建", "Entity, DTO, Param, AutoConfiguration 配置类", "每次生成都会删除旧文件并重新生成"],
        ]}
      />

      {/* ============== 11. 常见问题（FAQ） ============== */}
      <H2 id="sec-faq">11. 常见问题（FAQ）</H2>
      <H4>Q1: 提示&quot;找不到 java&quot;</H4>
      <P>请安装 JDK 21 或更高版本：<a href="https://adoptium.net/zh-CN/" target="_blank" className="text-blue-500 hover:underline">adoptium.net</a></P>
      <P>安装后确认 <InlineCode>java -version</InlineCode> 输出的版本 {`>=`} 21。</P>

      <H4>Q2: 生成的代码会覆盖我手动修改的文件吗？</H4>
      <P>不会（大部分情况下）。</P>
      <BulletList items={[
        <><Strong>不会覆盖的文件</Strong>：Mapper 接口、Mapper XML、Repository、Service、API、Controller、Remote、Req、Resp、EditReq、启动类、配置文件</>,
        <><Strong>会覆盖的文件</Strong>：Entity、DTO、Param、AutoConfiguration 配置类</>
      ]} />

      <H4>Q3: from-db-tables 和 model-list 有什么区别？</H4>
      <DocTable
        headers={["特性", "from-db-tables", "model-list"]}
        rows={[
          ["字段信息来源", "自动从数据库读取", "手动定义或配合 from-db-tables 使用"],
          ["是否需要数据库连接", "是", "否"],
          ["字段类型/注释", "自动解析", "无法定义字段（仅定义 Model 级配置）"],
          ["适用场景", "表已经在数据库中存在", "设计阶段、无法连接数据库、或需要覆盖默认值"],
        ]}
      />
      <P>两者可同时使用。相同 Model 在两处都有定义时，<InlineCode>model-list</InlineCode> 中的配置优先。</P>

      <H4>Q4: 支持哪些数据库？</H4>
      <P>支持 22 种数据库，完整列表见上方章节“8.1 支持的数据库”。</P>

      <H4>Q5: 配置文件格式和 Spring Boot 的 application.yml 一样吗？</H4>
      <P>完全一致。CLI 的 <InlineCode>generator.yml</InlineCode> 和 Spring Boot 的 <InlineCode>application.yml</InlineCode> 使用相同的配置节点结构。</P>

      <H4>Q6: 如何只为部分 Model 生成 Controller？</H4>
      <P>在 <InlineCode>model-list</InlineCode> 中为特定 Model 设置 <InlineCode>create-controller: false</InlineCode>。</P>

      <H4>Q7: 如何只生成 Repository 层（不需要 Service / Controller）？</H4>
      <P>在 <InlineCode>model-list</InlineCode> 中设置 <InlineCode>only-repository: true</InlineCode>。</P>

      <H4>Q8: Entity 父类的 BaseMyBatisPlusEntity 和 BaseMyBatisPlusSimpleEntity 有什么区别？</H4>
      <DocTable
        headers={["父类", "包含的公共字段"]}
        rows={[
          ["BaseMyBatisPlusEntity（默认）", "deleted、insertTime、lastUpdateTime"],
          ["BaseMyBatisPlusSimpleEntity", "无公共字段（适用于关联表等简单场景）"],
        ]}
      />

      <H4>Q9: 如何处理表名和类名的映射？</H4>
      <P>生成器按规则自动处理：</P>
      <NumberList items={[
        <>去除 <InlineCode>table-prefix</InlineCode></>,
        <>下划线转驼峰</>,
        <>首字母大写</>
      ]} />
      <P>也可在 <InlineCode>model-list</InlineCode> 中通过 <InlineCode>table-name</InlineCode> 显式指定表名。</P>

      <H4>Q10: SMART 架构中如何切换 RPC 调用方式？</H4>
      <P>SMART 架构同时生成了 Spring Cloud 和 Dubbo 两套实现。切换方式通过改变依赖：</P>
      <BulletList items={[
        <>引入 <InlineCode>xxx-cloud-api</InlineCode> 依赖 → 使用 Spring Cloud Feign 远程调用</>,
        <>引入 <InlineCode>xxx-dubbo-api</InlineCode> 依赖 → 使用 Dubbo 远程调用</>,
        <>引入 <InlineCode>xxx-server</InlineCode> 依赖 → 本地直接调用（用于单体部署场景）</>,
      ]} />
      <P>无需修改任何业务代码。</P>

      <H4>Q11: 在 IDEA 插件市场搜索不到 EasyFK Generator？</H4>
      <P>可能是由于网络原因或插件市场索引延迟。可以从上方章节“3.1 插件安装”里的链接手动下载并安装。</P>

      {/* ============== 12. 附录 ============== */}
      <H2 id="sec-appendix">12. 附录</H2>
      <H3>12.1 枚举值速查表</H3>
      <DocTable
        headers={["配置项", "可选值", "说明"]}
        rows={[
          ["project-type", "single, micro_prd, microservice, smart", "项目架构类型"],
          ["app-type", "BMS, CLIENT", "应用类型"],
          ["rpc-type", "cloud, dubbo", "RPC 协议类型"],
          ["build-type", "maven, gradle", "构建工具"],
          ["gradle-type", "groovy, kotlin", "Gradle DSL 类型"],
          ["orm-type", "MYBATIS, MYBATIS_FLEX, HIBERNATE", "ORM 框架"],
          ["prd-type", "none, single, separation", "PRD 层策略"],
          ["log-type", "LOGBACK, LOG4J2", "日志框架"],
          ["db-type", "MYSQL, POSTGRE_SQL, ORACLE 等...", "数据库类型，支持 22+ 种常见数据库"],
        ]}
      />

      <H3>12.2 生成文件清单</H3>
      <P>以下是一个 Model（如 <InlineCode>Product</InlineCode>）在不同架构下可能生成的全部文件：</P>
      <DocTable
        headers={["文件", "SINGLE", "MICRO_PRD", "MICRO", "SMART", "覆盖策略"]}
        rows={[
          ["PrdApp.java（启动类）", "❌", "✅", "❌", "❌", "不覆盖"],
          ["application.yml（配置文件）", "✅", "✅", "✅", "✅", "不覆盖"],
          ["logback.xml（日志配置）", "✅", "✅", "✅", "✅", "不覆盖"],
          ["Product.java（Entity）", "✅", "❌", "✅", "✅", "强制刷新"],
          ["ProductMapper.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductMapper.xml", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductDto.java", "✅", "❌", "✅", "✅", "强制刷新"],
          ["ProductParam.java", "✅", "❌", "✅", "✅", "强制刷新"],
          ["ProductReq.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductResp.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductEditReq.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["IProductRepository.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductRepositoryImpl.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["IProductService.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductServiceImpl.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["IProductApi.java", "❌", "❌", "❌", "✅", "不覆盖"],
          ["ProductApiServerImpl.java", "❌", "❌", "❌", "✅", "不覆盖"],
          ["IProductRemote.java（Cloud）", "❌", "❌", "✅★", "✅", "不覆盖"],
          ["ProductRemoteImpl.java（Cloud）", "❌", "❌", "✅★", "✅", "不覆盖"],
          ["ProductApiScImpl.java", "❌", "❌", "❌", "✅", "不覆盖"],
          ["IProductRemote.java（Dubbo）", "❌", "❌", "✅★", "✅", "不覆盖"],
          ["ProductRemoteImpl.java（Dubbo）", "❌", "❌", "✅★", "✅", "不覆盖"],
          ["ProductApiDubboImpl.java", "❌", "❌", "❌", "✅", "不覆盖"],
          ["ProductController.java", "✅", "❌", "✅", "✅", "不覆盖"],
          ["ProductBmsController.java", "❌", "❌", "✅★★", "✅★★", "不覆盖"],
        ]}
      />
      <TipBox>
        <p>★ MICROSERVICE 架构下根据 <InlineCode>rpc-type</InlineCode> 只生成 Cloud 或 Dubbo 其中一套</p>
        <p className="mt-1">★★ 仅当 <InlineCode>prd-type: separation</InlineCode> 时生成</p>
      </TipBox>

      {/* Footer note */}
      <div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
        <p className="font-mono text-[13px] italic text-[#525252]">
          EasyFK Generator v3.2.12（插件 v1.0.2）— 让架构设计直接变成可运行的代码。
        </p>
      </div>

    </DocLayout>
  )
}
