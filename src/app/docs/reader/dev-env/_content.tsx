"use client"

import Link from "next/link"
import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, H2, H3, P, DocTable, TipBox, WarnBox, InlineCode, Strong, BulletList, NumberList } from "../_components/doc-components"
import { CredentialGate } from "../_components/credential-gate"

const outlineItems = [
  { id: "sec-env", label: "环境准备" },
  { id: "sec-maven", label: "配置 Maven 私服" },
  { id: "sec-db", label: "准备数据库" },
  { id: "sec-backend", label: "启动后端项目" },
  { id: "sec-frontend", label: "启动前端项目" },
  { id: "sec-faq", label: "常见问题" },
  { id: "sec-done", label: "完成" },
]

export default function QuickStartContent() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="项目体验"
      title="快速上手"
      subtitle="从零开始，跑通 EasyBuild Admin 全流程"
      readingTime="~15 min"
    >
      <P>本指南将带你从零开始，完成环境搭建、数据库准备、后端接口启动、前端项目运行的全流程，最终跑通一套完整的中后台管理系统。</P>

      {/* ============== 1. 环境准备 ============== */}
      <H2 id="sec-env">1. 环境准备</H2>
      <P>请确保本机已安装以下软件：</P>
      <DocTable
        headers={["软件", "版本要求", "用途"]}
        rows={[
          ["JDK", <Strong key="jdk">{"≥ 21"}</Strong>, "后端运行环境"],
          ["Maven", "最新稳定版", "后端构建工具"],
          ["Node.js", <Strong key="node">{"≥ 18.17.0"}</Strong>, "前端运行环境"],
          ["MySQL 或 PostgreSQL", "MySQL 5.7+ / PG 12+", "业务数据库"],
          ["Redis", "最新稳定版", "缓存服务"],
        ]}
      />
      <TipBox>
        JDK、Maven、Node.js 的安装与环境变量配置请参考网上资料或借助 AI 完成，建议使用 <InlineCode>nvm</InlineCode> 管理 Node 版本。
      </TipBox>

      {/* ============== 2. 配置 Maven 私服 ============== */}
      <H2 id="sec-maven">2. 配置 Maven 私服</H2>
      <P>EasyBuild 的依赖包托管在私有 Maven 仓库，需要在 Maven 的 <InlineCode>settings.xml</InlineCode> 中添加仓库配置。</P>
      <P>找到你的 Maven 配置文件（通常在 <InlineCode>~/.m2/settings.xml</InlineCode>），将以下内容合并进去：</P>
      <CredentialGate />

      <CodeBlock lang="xml">{`<settings>
  <mirrors>
    <mirror>
      <id>aliyun</id>
      <mirrorOf>central,jcenter,!jackorg-easybuild-profile</mirrorOf>
      <name>mirror</name>
      <url>https://maven.aliyun.com/nexus/content/groups/public</url>
    </mirror>
  </mirrors>

  <servers>
    <server>
      <id>jackorg-easybuild</id>
      <username>【由上述方式获取】</username>
      <password>【由上述方式获取】</password>
    </server>
  </servers>

  <profiles>
    <profile>
      <id>jackorg-easybuild-profile</id>
      <repositories>
        <repository>
          <id>jackorg-easybuild</id>
          <url>【由上述方式获取仓库地址】</url>
        </repository>
      </repositories>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
    </profile>
  </profiles>
</settings>`}</CodeBlock>
      <WarnBox>
        <InlineCode>mirrors</InlineCode> 中的 <InlineCode>mirrorOf</InlineCode> 必须包含 <InlineCode>!jackorg-easybuild-profile</InlineCode> 排除项，否则阿里云镜像会拦截私服请求，导致依赖下载失败。
      </WarnBox>

      {/* ============== 3. 准备数据库 ============== */}
      <H2 id="sec-db">3. 准备数据库</H2>

      <H3>3.1 创建数据库</H3>
      <P><Strong>MySQL 用户</Strong>：创建一个名为 <InlineCode>eb_demo</InlineCode> 的数据库（字符集 UTF-8）。</P>
      <CodeBlock lang="sql">{`CREATE DATABASE eb_demo DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`}</CodeBlock>
      <P><Strong>PostgreSQL 用户</Strong>：创建一个名为 <InlineCode>eb_demo</InlineCode> 的数据库。</P>
      <CodeBlock lang="sql">{`CREATE DATABASE eb_demo;`}</CodeBlock>

      <H3>3.2 执行初始化脚本</H3>
      <P>克隆后端项目后（见第四步），在项目的 <InlineCode>doc/sql/</InlineCode> 目录下有初始化脚本：</P>
      <BulletList items={[
        "MySQL → 执行 mysql_260322.sql",
        "PostgreSQL → 执行 postgresql_260322.sql"
      ]} />
      <P>脚本已包含全部表结构和初始数据（管理员账号、权限资源等），执行完毕即可直接使用。</P>

      <H3>3.3 启动 Redis</H3>
      <P>确保 Redis 服务已启动，默认连接 <InlineCode>127.0.0.1:6379</InlineCode>，无需额外配置。</P>

      {/* ============== 4. 启动后端项目 ============== */}
      <H2 id="sec-backend">4. 启动后端项目（demo-bms）</H2>

      <H3>4.1 克隆项目</H3>
      <CodeBlock lang="bash">{`# GitHub
git clone https://github.com/jackliuyijun/easybuild-admin-api.git

cd easybuild-admin-api`}</CodeBlock>

      <H3>4.2 修改数据库连接</H3>
      <P><Strong>MySQL 用户</Strong> — 编辑 <InlineCode>config/application-dev.yml</InlineCode>：</P>
      <CodeBlock lang="yaml">{`spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/eb_demo?characterEncoding=UTF-8&useSSL=false&useInformationSchema=true&remarks=true&useUnicode=true&allowPublicKeyRetrieval=true
    username: root
    password: YOUR_PASSWORD    # 改为你的数据库密码`}</CodeBlock>

      <P><Strong>PostgreSQL 用户</Strong> — 编辑 <InlineCode>config/application-pgDev.yml</InlineCode>：</P>
      <CodeBlock lang="yaml">{`spring:
  datasource:
    url: jdbc:postgresql://127.0.0.1:5432/eb_demo
    username: postgres
    password: YOUR_PASSWORD    # 改为你的数据库密码`}</CodeBlock>

      <P>同时修改 <InlineCode>config/application.yml</InlineCode> 中的配置文件引用：</P>
      <CodeBlock lang="yaml">{`spring:
  config:
    import:
      # MySQL 用（默认）
      - "file:config/application-dev.yml"
      # PostgreSQL 用（二选一，注释掉上面那行，打开下面这行）
      # - "file:config/application-pgDev.yml"`}</CodeBlock>
      <TipBox>
        PostgreSQL 用户还需修改 <InlineCode>pom.xml</InlineCode>：注释掉 <InlineCode>db-mysql</InlineCode> 依赖，打开 <InlineCode>db-postgresql</InlineCode> 依赖。
      </TipBox>

      <H3>4.3 修改 Redis 连接（如非默认配置）</H3>
      <P>在 <InlineCode>config/application-dev.yml</InlineCode>（或 <InlineCode>application-pgDev.yml</InlineCode>）中：</P>
      <CodeBlock lang="yaml">{`spring:
  data:
    redis:
      database: 11
      host: 127.0.0.1
      port: 6379`}</CodeBlock>

      <H3>4.4 执行数据库脚本</H3>
      <P>用数据库客户端工具执行 <InlineCode>doc/sql/</InlineCode> 目录下对应的 SQL 脚本（参见第三步 3.2）。</P>

      <H3>4.5 编译并启动</H3>
      <P><Strong>方式一：IDE 启动（推荐开发时使用）</Strong></P>
      <NumberList items={[
        <>用 IntelliJ IDEA 打开 <InlineCode>easybuild-admin-api</InlineCode> 项目</>,
        "等待 Maven 依赖下载完成",
        <>运行启动类 <InlineCode>com.easybuild.admin.bms.ServerApp</InlineCode></>,
      ]} />
      <P><Strong>方式二：命令行启动</Strong></P>
      <CodeBlock lang="bash">{`mvn clean package -DskipTests
java -jar target/easybuild-admin-api.jar`}</CodeBlock>

      <H3>4.6 验证后端启动</H3>
      <P>看到控制台输出 Spring Boot 启动成功日志后，打开浏览器访问接口文档：</P>
      <CodeBlock lang="text">{`http://localhost:5001/doc.html`}</CodeBlock>
      <P>能看到 Knife4j 接口文档页面，说明后端已启动成功。</P>

      {/* ============== 5. 启动前端项目 ============== */}
      <H2 id="sec-frontend">5. 启动前端项目（easybuild-admin）</H2>

      <H3>5.1 创建前端项目</H3>
      <P><Strong>方式一：使用 CLI 命令创建（推荐）</Strong></P>
      <CodeBlock lang="bash">{`npx easybuild-admin my-admin`}</CodeBlock>
      <P>按照提示输入项目描述、选择包管理器（推荐 yarn）即可，CLI 会自动完成模板下载、依赖安装和 Git 初始化。</P>

      <P><Strong>方式二：手动克隆</Strong></P>
      <CodeBlock lang="bash">{`# GitHub
git clone https://github.com/jackliuyijun/easybuild-admin.git my-admin

cd my-admin
yarn install`}</CodeBlock>

      <H3>5.2 配置后端接口地址</H3>
      <P>编辑 <InlineCode>.env.development</InlineCode> 文件，将 API 地址指向刚才启动的后端服务：</P>
      <CodeBlock lang="env">{`NEXT_PUBLIC_API_URL=http://localhost:5001`}</CodeBlock>

      <H3>5.3 启动前端</H3>
      <CodeBlock lang="bash">{`yarn dev`}</CodeBlock>
      <P>启动成功后，打开浏览器访问：</P>
      <CodeBlock lang="text">{`http://localhost:4000`}</CodeBlock>

      <H3>5.4 登录系统</H3>
      <P>使用初始化脚本中预置的管理员账号登录（默认账号密码请查看 SQL 脚本中的初始数据），登录后即可看到完整的中后台管理界面。</P>
      <TipBox>
        以上流程是 EasyBuild 最基础的示例，更多强大的功能请继续阅读官网其他模块文档。在实际开发过程中，EasyBuild 为你提供了强大的<Link href="/docs/reader" className="text-[#00FF88] underline underline-offset-2 hover:text-[#00FF88]/80">代码生成工具</Link>，可以极大提升开发效率。
      </TipBox>

      {/* ============== 6. 常见问题 ============== */}
      <H2 id="sec-faq">6. 常见问题</H2>

      <H3>Q: Maven 依赖下载失败？</H3>
      <P>检查 <InlineCode>settings.xml</InlineCode> 中 <InlineCode>mirrors</InlineCode> 的 <InlineCode>mirrorOf</InlineCode> 是否包含了 <InlineCode>!jackorg-easybuild-profile</InlineCode> 排除项。如果缺少这个排除项，阿里云镜像会代理所有请求，导致私服依赖拉取不到。</P>

      <H3>Q: 后端启动报数据库连接失败？</H3>
      <NumberList items={[
        "确认数据库服务已启动",
        <>确认 <InlineCode>eb_demo</InlineCode> 数据库已创建</>,
        <>确认 <InlineCode>application-dev.yml</InlineCode>（或 <InlineCode>application-pgDev.yml</InlineCode>）中的用户名和密码正确</>,
        <>PostgreSQL 用户需确认 <InlineCode>pom.xml</InlineCode> 中已切换为 <InlineCode>db-postgresql</InlineCode> 依赖</>,
      ]} />

      <H3>Q: 后端启动报 Redis 连接失败？</H3>
      <P>确认 Redis 服务已启动，且配置文件中的 host、port 与实际一致。</P>

      <H3>Q: 前端页面空白或接口 404？</H3>
      <NumberList items={[
        <>确认 <InlineCode>.env.development</InlineCode> 中的 <InlineCode>NEXT_PUBLIC_API_URL</InlineCode> 地址正确</>,
        "确认后端服务已正常运行在 5001 端口",
        "重启前端开发服务器使环境变量生效",
      ]} />

      <H3>Q: 前端登录后页面没有菜单？</H3>
      <P>菜单由后端动态下发。确认数据库初始化脚本已执行完毕，脚本中包含了完整的菜单资源数据。</P>

      {/* ============== 完成 ============== */}
      <H2 id="sec-done">完成！</H2>
      <P>到这里，你已经跑通了 EasyBuild Admin 的完整流程：</P>
      <CodeBlock lang="text">{`MySQL/PostgreSQL + Redis  →  demo-bms（后端 :5001）  →  easybuild-admin（前端 :4000）`}</CodeBlock>
      <P>你可以：</P>
      <BulletList items={[
        <>在 <InlineCode>http://localhost:5001/doc.html</InlineCode> 查看和测试所有后端接口</>,
        <>在 <InlineCode>http://localhost:4000</InlineCode> 体验完整的中后台管理功能</>,
        "基于 demo-bms 和 easybuild-admin 模板，开始开发自己的业务模块",
      ]} />
    </DocLayout>
  )
}
