"use client"

import Link from "next/link"
import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, TipBox, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-env", label: "环境准备" },
  { id: "sec-maven", label: "Maven 配置" },
  { id: "sec-gradle", label: "Gradle 配置" },
  { id: "sec-project", label: "创建项目" },
]

export default function DevEnvContent() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="开发环境"
      title="EasyBuild 环境配置说明"
      subtitle="开发环境搭建与仓库配置"
      readingTime="~5 min"
    >

              {/* ============== 1. 环境准备 ============== */}
              <H2 id="sec-env">1. 环境准备</H2>
              <P>JDK 必须大于等于 21，JDK 21+</P>
              <P>Java 环境变量，Maven 环境变量，Gradle 环境变量等，可自行参考网上资料或使用 AI，配置好本地的开发环境。</P>

              {/* ============== 2. Maven 配置 ============== */}
              <H2 id="sec-maven">2. Maven 配置</H2>
              <P>示例配置：</P>
              <CodeBlock lang="xml">{`<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <localRepository>C:\\repository\\maven</localRepository>
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
      <username>cnb</username>
      <password>a16k9BILdyo166eyeyja7Old60H</password>
    </server>
  </servers>
  <profiles>
    <profile>
      <id>jackorg-easybuild-profile</id>
      <repositories>
        <repository>
          <!-- 须与 server 的 id 一致 -->
          <id>jackorg-easybuild</id>
          <url>https://maven.cnb.cool/jackorg/easybuild/-/packages/</url>
        </repository>
      </repositories>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
    </profile>
  </profiles>
</settings>`}</CodeBlock>
              <P>可以新建配置，也可以把以上内容添加到已有的 setting.xml 文件中</P>

              {/* ============== 3. Gradle 配置 ============== */}
              <H2 id="sec-gradle">3. Gradle 配置</H2>
              <P>请将下列配置添加到您项目的 build.gradle 文件中或全局配置文件中</P>
              <CodeBlock lang="groovy">{`repositories {
     maven {
         url https://maven.cnb.cool/jackorg/easybuild/-/packages/
         credentials {
         username = cnb
         password = a16k9BILdyo166eyeyja7Old60H
     }
}`}</CodeBlock>

              {/* ============== 4. 创建项目 ============== */}
              <H2 id="sec-project">4. 创建项目</H2>
              <P>手动创建，或使用 EasyBuild 提供的自动代码生成工具创建项目，自动代码生成可参考<Link href="/docs/reader" className="text-[#00FF88] underline underline-offset-2 hover:text-[#00FF88]/80">代码生成文档</Link>。</P>

              <H3>4.1 项目配置</H3>
              <P>以 Maven 项目为例：手动创建项目后，可以根据以下说明配置项目</P>
              <P>在项目根目录的 pom.xml 中按照以下配置：</P>
              <CodeBlock lang="xml">{`<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <framework.version>3.2.12</framework.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mcst</groupId>
            <artifactId>easyfk-dependencies</artifactId>
            <version>\${framework.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>com.mcst</groupId>
            <artifactId>module-dependencies</artifactId>
            <version>\${framework.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <!-- 示例模块 -->
    <dependency>
        <groupId>com.mcst</groupId>
        <artifactId>easyfk-core</artifactId>
    </dependency>
</dependencies>`}</CodeBlock>
              <P>其他模块，按需引入，无需设置版本号，由易架构的 easyfk-dependencies 统一管理版本。</P>

    </DocLayout>
  )
}
