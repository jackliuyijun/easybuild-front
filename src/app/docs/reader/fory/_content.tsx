"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖关系" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "核心接口" },
  { id: "sec-4", label: "配置属性" },
  { id: "sec-5", label: "自动配置" },
  { id: "sec-6", label: "初始化流程" },
  { id: "sec-7", label: "ForySerializer 核心 API" },
  { id: "sec-8", label: "ForySerializerClassRegister" },
  { id: "sec-9", label: "快速接入" },
]

export default function ForyDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Fory 序列化"
      title="easyfk-fory Fory 序列化"
      subtitle="Fory 序列化 — 高性能对象序列化框架"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>serializer-fory</InlineCode> 是 EasyFK 框架的<Strong>高性能序列化模块</Strong>，基于 [Apache Fory](https://fury.apache.org/)（原 Fury）0.14.1 构建。提供 Java 内部序列化和跨语言（XLANG）序列化两种模式，通过 Spring Boot 自动配置实现类的自动扫描与注册，开箱即用。</P>
              <P>本模块由两个子模块组成：</P>
              <BulletList items={["**serializer-base**：序列化器的抽象层，定义 SPI 接口、配置属性和初始化流程", "**serializer-fory**：基于 Apache Fory 的具体实现"]} />

              {/* ============== 2. 依赖关系 ============== */}
              <H2 id="sec-1">2. 依赖关系</H2>

              <H3>2.1 serializer-base</H3>
              <CodeBlock lang="groovy">{`// 父级 build.gradle 声明了 easyfk-core 为所有子模块的编译期依赖
subprojects {
    dependencies {
        compileOnly project(':easyfk-core')
    }
}`}</CodeBlock>

              <H3>2.2 serializer-fory</H3>
              <CodeBlock lang="groovy">{`dependencies {
    api project(':easyfk-serializer:serializer-base')
    api 'org.apache.fory:fory-core:0.14.1'
}`}</CodeBlock>

                            <DocTable
                headers={["`easyfk-core`", "提供 `@SerializableClass` 注解和 `EmptyUtil` 工具"]}
                rows={[
                  ["`fory-core 0.14.1`", "Apache Fory 序列化框架核心库"],
                ]}
              />

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`easyfk-serializer/
├── serializer-base/                          # 抽象层
│   ├── build.gradle                          # （空，继承父级配置）
│   └── src/main/java/com/mcst/easyfk/serializer/base/
│       ├── SerializerClassRegister.java       # SPI 接口：类注册器
│       ├── properties/
│       │   └── SerializerProperties.java      # 配置属性
│       ├── config/
│       │   └── SerializerAutoConfiguration.java # 自动配置
│       └── init/
│           └── SerializerInitializer.java     # 初始化器：扫描+注册
│
└── serializer-fory/                          # Fory 实现层
    ├── build.gradle
    └── src/main/java/com/mcst/easyfk/serializer/fory/
        ├── ForySerializer.java                # 核心：Fory 序列化工具类
        ├── ForySerializerClassRegister.java   # SPI 实现：Fory 类注册器
        └── config/
            └── ForySerializerAutoConfiguration.java # Fory 自动配置`}</CodeBlock>

              {/* ============== 4. 核心接口 ============== */}
              <H2 id="sec-3">4. 核心接口</H2>

              <H3>4.1 SerializerClassRegister（SPI 接口）</H3>
              <CodeBlock lang="java">{`public interface SerializerClassRegister {
    default void registerClass(List<Class<?>> classes) {
    }
}`}</CodeBlock>
              <P>序列化类注册器的函数接口。实现此接口可将扫描到的类注册到具体的序列化器中。模块通过 Spring 容器自动发现所有实现者。</P>
              <P><Strong>方法说明：</Strong></P>

              

              <H3>4.2 @SerializableClass（标记注解）</H3>
              <P>定义在 <InlineCode>easyfk-core</InlineCode> 模块中：</P>
              <CodeBlock lang="java">{`@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SerializableClass {
}`}</CodeBlock>
              <P>标记需要预注册到序列化器的类。启动时 <InlineCode>SerializerInitializer</InlineCode> 会扫描带有此注解的类并交给注册器处理。</P>

              {/* ============== 5. 配置属性 ============== */}
              <H2 id="sec-4">5. 配置属性</H2>

              <H3>5.1 SerializerProperties</H3>
              <P>配置前缀：<InlineCode>easyfk.config.serializer</InlineCode></P>

                            <DocTable
                headers={["`pre-register`", "Boolean", "`true`", "是否在启动时预注册序列化类。关闭后使用时动态注册"]}
                rows={[
                  ["`scan-packages`", "List\&lt;String\&gt;", "`[]`", "额外需要扫描的包路径列表（默认必扫 `com.mcst`）"],
                ]}
              />

              <H3>5.2 配置示例</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    serializer:
      pre-register: true
      cross-language: false
      scan-packages:
        - com.example.dto
        - com.example.entity`}</CodeBlock>

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-5">6. 自动配置</H2>

              <H3>6.1 SerializerAutoConfiguration（serializer-base）</H3>
              <CodeBlock lang="java">{`@AutoConfiguration
@EnableConfigurationProperties(SerializerProperties.class)
@ConditionalOnProperty(prefix = "easyfk.config.serializer", name = "pre-register",
                       havingValue = "true", matchIfMissing = true)
public class SerializerAutoConfiguration {

    @Bean
    public SerializerInitializer serializerInitializer() {
        return new SerializerInitializer();
    }
}`}</CodeBlock>
              <P><Strong>生效条件：</Strong> <InlineCode>pre-register</InlineCode> 为 <InlineCode>true</InlineCode>（默认生效）</P>
              <P>注册 <InlineCode>SerializerInitializer</InlineCode> Bean，负责启动时扫描和注册类。</P>

              <H3>6.2 ForySerializerAutoConfiguration（serializer-fory）</H3>
              <CodeBlock lang="java">{`@AutoConfiguration
@ConditionalOnProperty(prefix = "easyfk.config.serializer", name = "pre-register",
                       havingValue = "true", matchIfMissing = true)
public class ForySerializerAutoConfiguration {

    @Bean
    public ForySerializerClassRegister forySerializerClassRegister() {
        return new ForySerializerClassRegister();
    }
}`}</CodeBlock>
              <P><Strong>生效条件：</Strong> <InlineCode>pre-register</InlineCode> 为 <InlineCode>true</InlineCode>（默认生效）</P>
              <P>注册 <InlineCode>ForySerializerClassRegister</InlineCode> Bean，使 <InlineCode>SerializerInitializer</InlineCode> 能够自动发现并调用。</P>

              <H3>6.3 Spring Boot 自动配置注册</H3>
              <P><Strong>serializer-base：</Strong></P>
              <CodeBlock lang="plaintext">{`# META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.mcst.easyfk.serializer.base.config.SerializerAutoConfiguration`}</CodeBlock>
              <P><Strong>serializer-fory：</Strong></P>
              <CodeBlock lang="plaintext">{`# META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.mcst.easyfk.serializer.fory.config.ForySerializerAutoConfiguration`}</CodeBlock>

              {/* ============== 7. 初始化流程 ============== */}
              <H2 id="sec-6">7. 初始化流程</H2>

              <H3>7.1 SerializerInitializer</H3>
              <P><InlineCode>SerializerInitializer</InlineCode> 实现 <InlineCode>InitializingBean</InlineCode>，在 Bean 初始化完成后自动执行：</P>
              <CodeBlock lang="plaintext">{`Spring 容器启动
    │
    ├─ SerializerAutoConfiguration 注册 SerializerInitializer
    ├─ ForySerializerAutoConfiguration 注册 ForySerializerClassRegister
    │
    └─ afterPropertiesSet() 触发
        │
        ├─ 检查 preRegister 开关
        │   └─ false → 跳过，日志提示
        │
        ├─ 发现所有 SerializerClassRegister Bean
        │   └─ 空 → 跳过
        │
        ├─ 构建 ClassPath 扫描器
        │   └─ 过滤器：@SerializableClass 注解
        │
        ├─ 合并扫描包路径
        │   ├─ 固定包："com.mcst"
        │   └─ 配置包：scanPackages
        │
        ├─ 扫描所有候选类
        │   └─ ClassPathScanningCandidateComponentProvider
        │       └─ AnnotationTypeFilter(SerializableClass.class)
        │
        └─ 调用所有注册器
            └─ serializerClassRegister.registerClass(classes)
                └─ ForySerializerClassRegister
                    └─ ForySerializer.register(clazz) × N`}</CodeBlock>

              {/* ============== 8. ForySerializer 核心 API ============== */}
              <H2 id="sec-7">8. ForySerializer 核心 API</H2>
              <P><InlineCode>ForySerializer</InlineCode> 是序列化操作的入口，提供静态方法调用。</P>

              <H3>8.1 Java 序列化</H3>
              <CodeBlock lang="java">{`// 序列化
byte[] data = ForySerializer.serialize(myObject);

// 反序列化
MyClass obj = ForySerializer.deserialize(data);`}</CodeBlock>

                            <DocTable
                headers={["`serialize(Object obj)`", "待序列化对象", "`byte[]`", "null 返回空数组"]}
                rows={[]}
              />

              <H3>8.2 跨语言序列化</H3>
              <P>需要先开启 <InlineCode>cross-language: true</InlineCode> 配置：</P>
              <CodeBlock lang="java">{`// 跨语言序列化
byte[] data = ForySerializer.serializeXLang(myObject);

// 跨语言反序列化
MyClass obj = ForySerializer.deserializeXLang(data);`}</CodeBlock>

                            <DocTable
                headers={["`serializeXLang(Object obj)`", "待序列化对象", "`byte[]`", "未开启跨语言时抛 UnsupportedOperationException"]}
                rows={[]}
              />

              <H3>8.3 手动注册类</H3>
              <CodeBlock lang="java">{`ForySerializer.register(MyClass.class);`}</CodeBlock>
              <BulletList items={["重复注册会被自动忽略（ConcurrentHashMap.newKeySet 去重）", "同时注册到 Java 实例和 XLANG 实例（若已启用）"]} />

              <H3>8.4 获取底层 Fory 实例</H3>
              <CodeBlock lang="java">{`ThreadSafeFory javaFory = ForySerializer.getJavaFory();
ThreadSafeFory xlangFory = ForySerializer.getXLangFory();`}</CodeBlock>
              <P>用于需要直接操作 Fory API 的高级场景。</P>

              {/* ============== 9. ForySerializerClassRegister ============== */}
              <H2 id="sec-8">9. ForySerializerClassRegister</H2>
              <P>SPI 接口的 Fory 实现：</P>
              <CodeBlock lang="java">{`public class ForySerializerClassRegister implements SerializerClassRegister {

    @Override
    public void registerClass(List<Class<?>> classes) {
        for (Class<?> clazz : classes) {
            ForySerializer.register(clazz);
        }
    }
}`}</CodeBlock>
              <P>作为桥梁，将 <InlineCode>SerializerInitializer</InlineCode> 扫描到的类列表注册到 <InlineCode>ForySerializer</InlineCode>。</P>

              {/* ============== 10. 快速接入 ============== */}
              <H2 id="sec-9">10. 快速接入</H2>

              <H3>10.1 添加依赖</H3>
              <CodeBlock lang="groovy">{`dependencies {
    implementation project(':easyfk-serializer:serializer-fory')
}`}</CodeBlock>

              <H3>10.2 标记序列化类</H3>
              <CodeBlock lang="java">{`import com.mcst.easyfk.core.annotation.SerializableClass;

@SerializableClass
public class UserDto {
    private String name;
    private int age;
    // getter/setter
}`}</CodeBlock>

              <H3>10.3 使用序列化</H3>
              <CodeBlock lang="java">{`// 序列化
UserDto user = new UserDto();
user.setName("张三");
user.setAge(25);
byte[] bytes = ForySerializer.serialize(user);

// 反序列化
UserDto restored = ForySerializer.deserialize(bytes);`}</CodeBlock>

              <H3>10.4 启用跨语言模式</H3>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    serializer:
      cross-language: true`}</CodeBlock>
              <CodeBlock lang="java">{`byte[] xlangData = ForySerializer.serializeXLang(user);
// 发送 xlangData 到 Python / Go / JavaScript 等语言的 Fory 客户端`}</CodeBlock>

              <H3>10.5 动态注册模式</H3>
              <P>关闭预注册后，类在首次序列化时自动注册：</P>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    serializer:
      pre-register: false`}</CodeBlock>
              <P>无需 <InlineCode>@SerializableClass</InlineCode> 注解，但首次序列化会有微小的注册开销。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-fory — 高性能序列化框架，加速数据传输与存储。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
