"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖关系" },
  { id: "sec-2", label: "包结构" },
  { id: "sec-3", label: "配置属性" },
  { id: "sec-4", label: "配置示例" },
  { id: "sec-5", label: "自动配置" },
  { id: "sec-6", label: "CustomTaskExecutor（TraceId 传递）" },
  { id: "sec-7", label: "线程池监控" },
  { id: "sec-8", label: "CompletableFuture 转换工具" },
  { id: "sec-9", label: "重试执行器" },
  { id: "sec-10", label: "预定义配置模板" },
]

export default function ThreadDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="线程池"
      title="easyfk-thread 线程池"
      subtitle="线程池管理 — 高性能并发任务调度"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>easyfk-thread</InlineCode> 是 EasyFK 框架的<Strong>线程池管理与异步任务模块</Strong>，提供以下核心能力：</P>
              <BulletList items={["**六种预定义线程池**：通用、异步（@Async）、调度（@Scheduled）、I/O 密集型、CPU 密集型、重试线程池", "**全链路 TraceId 传递**：自动在父子线程间传递 TraceId + MDC 日志上下文", "**线程池动态监控与自动伸缩**：基于负载指标（线程利用率 / 队列利用率）自动扩缩容", "**重试执行器**：支持同步/异步模式、三种退避策略、信号量并发控制、降级处理", "**CompletableFuture 转换工具**：将阻塞调用转为异步，并自动解包 BaseResult"]} />

              {/* ============== 2. 依赖关系 ============== */}
              <H2 id="sec-1">2. 依赖关系</H2>
              <CodeBlock lang="groovy">{`dependencies {
    compileOnly project(':easyfk-core')
}`}</CodeBlock>

              

              {/* ============== 3. 包结构 ============== */}
              <H2 id="sec-2">3. 包结构</H2>
              <CodeBlock lang="plaintext">{`easyfk-thread/
├── build.gradle
└── src/main/java/com/mcst/easyfk/thread/
    ├── config/
    │   ├── ThreadPoolConfig.java              # 线程池自动配置（核心）
    │   └── ThreadPoolMonitorAutoConfig.java   # 监控自动配置
    ├── properties/
    │   ├── ThreadPoolBaseProperties.java       # 线程池基础配置
    │   ├── ThreadPoolArgs.java                # 线程池参数（可复用）
    │   ├── ThreadPoolMonitorProperties.java   # 监控配置
    │   └── DynamicAdjustmentConfig.java       # 动态调整配置
    ├── CustomTaskExecutor.java                # 增强的任务执行器（TraceId 传递）
    ├── ThreadPoolMetrics.java                 # 线程池指标数据
    ├── ThreadPoolMonitor.java                 # 线程池监控器
    ├── AsyncThreadPoolMonitor.java            # 异步线程池监控器
    ├── ThreadPoolMonitorManager.java          # 监控器管理器
    ├── AdjustmentDecision.java                # 调整决策
    ├── async/
    │   └── CompletableFutureConvert.java      # CompletableFuture 转换工具
    └── retry/
        ├── RetryConfig.java                   # 重试配置
        ├── RetryContext.java                  # 重试上下文
        ├── RetryCallback.java                 # 重试回调接口
        ├── BackoffStrategy.java               # 退避策略枚举
        ├── RetryableOperation.java            # 可重试操作接口
        └── RetryExecutor.java                 # 重试执行器`}</CodeBlock>

              {/* ============== 4. 配置属性 ============== */}
              <H2 id="sec-3">4. 配置属性</H2>

              <H3>4.1 线程池基础配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.thread.pool</InlineCode></P>

                            <DocTable
                headers={["`create-common-pool`", "Boolean", "`false`", "是否创建通用线程池"]}
                rows={[
                  ["`create-schedule-pool`", "Boolean", "`false`", "是否创建任务调度线程池（配合 @Scheduled）"],
                  ["`create-io-intensive-pool`", "Boolean", "`false`", "是否创建 I/O 密集型线程池"],
                  ["`create-cpu-intensive-pool`", "Boolean", "`false`", "是否创建 CPU 密集型线程池"],
                  ["`create-retry`", "Boolean", "`false`", "是否创建重试线程池 + RetryExecutor"],
                ]}
              />

              <H3>4.2 线程池参数（ThreadPoolArgs）</H3>
              <P>每种线程池都有独立的参数配置：</P>

                            <DocTable
                headers={["`core-pool-size`", "Integer", "CPU 核心数", "核心线程数（未设置时自动获取）"]}
                rows={[
                  ["`queue-capacity`", "Integer", "200", "队列容量"],
                  ["`keep-alive-seconds`", "Integer", "60", "空闲线程存活时间"],
                  ["`thread-name-prefix`", "String", "`custom-thread-`", "线程名前缀"],
                  ["`wait-for-tasks-to-complete-on-shutdown`", "Boolean", "`true`", "关闭时等待任务完成"],
                  ["`await-termination-seconds`", "Integer", "60", "等待终止时间"],
                  ["`allow-core-thread-time-out`", "Boolean", "`false`", "核心线程是否超时回收"],
                  ["`prestart-all-core-threads`", "Boolean", "`false`", "是否预热核心线程"],
                  ["`rejected-execution-handler`", "String", "`CALLER_RUNS`", "拒绝策略：ABORT / CALLER_RUNS / DISCARD / DISCARD_OLDEST"],
                ]}
              />
              <P><Strong>配置路径映射：</Strong></P>

                            <DocTable
                headers={["通用", "`easyfk.config.thread.pool.common-pool-args.*`"]}
                rows={[
                  ["调度", "`easyfk.config.thread.pool.schedule-pool-args.*`"],
                  ["I/O 密集", "`easyfk.config.thread.pool.io-intensive-pool-args.*`"],
                  ["CPU 密集", "`easyfk.config.thread.pool.cpu-intensive-pool-args.*`"],
                  ["重试", "`easyfk.config.thread.pool.retry-pool-args.*`"],
                ]}
              />

              <H3>4.3 监控配置</H3>
              <P>配置前缀：<InlineCode>easyfk.config.thread.pool.monitor</InlineCode></P>

                            <DocTable
                headers={["`enabled`", "boolean", "`false`", "是否启用监控"]}
                rows={[
                  ["`auto-start`", "boolean", "`true`", "是否自动启动监控"],
                  ["`include-names`", "List\&lt;String\&gt;", "`[]`", "包含的线程池名称（空表示全部）"],
                  ["`exclude-names`", "List\&lt;String\&gt;", "`[]`", "排除的线程池名称"],
                ]}
              />

              <H3>4.4 动态调整配置（DynamicAdjustmentConfig）</H3>

                            <DocTable
                headers={["`enabled`", "Boolean", "`true`", "是否启用动态调整"]}
                rows={[
                  ["`cooldown-period`", "Duration", "2min", "冷却期（两次调整最小间隔）"],
                  ["`min-core-pool-size`", "Integer", "2", "最小核心线程数"],
                  ["`max-core-pool-size`", "Integer", "20", "最大核心线程数"],
                  ["`scale-up-step`", "Integer", "2", "扩容步长"],
                  ["`scale-down-step`", "Integer", "1", "缩容步长"],
                  ["`high-load-threshold`", "Double", "80.0", "高负载阈值（线程利用率 %）"],
                  ["`low-load-threshold`", "Double", "30.0", "低负载阈值（线程利用率 %）"],
                  ["`queue-high-threshold`", "Double", "70.0", "队列高负载阈值（%）"],
                  ["`queue-low-threshold`", "Double", "20.0", "队列低负载阈值（%）"],
                  ["`async-monitoring-enabled`", "Boolean", "`true`", "是否启用异步监控"],
                  ["`async-monitoring-pool-size`", "Integer", "2", "异步监控线程池大小"],
                  ["`async-monitoring-queue-capacity`", "Integer", "100", "异步监控队列容量"],
                  ["`async-monitoring-timeout-seconds`", "Integer", "30", "异步监控超时时间"],
                ]}
              />

              {/* ============== 5. 配置示例 ============== */}
              <H2 id="sec-4">5. 配置示例</H2>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    thread:
      pool:
        create-common-pool: true
        create-async-pool: true
        create-schedule-pool: true
        create-io-intensive-pool: true
        create-retry: true

        common-pool-args:
          core-pool-size: 8
          max-pool-size: 16
          queue-capacity: 500
          thread-name-prefix: "common-"
          rejected-execution-handler: CALLER_RUNS

        async-pool-args:
          core-pool-size: 4
          queue-capacity: 200

        io-intensive-pool-args:
          core-pool-size: 16
          max-pool-size: 32
          queue-capacity: 1000
          keep-alive-seconds: 120

        retry-pool-args:
          core-pool-size: 2
          thread-name-prefix: "retry-"

        monitor:
          enabled: true
          auto-discovery: true
          auto-start: true
          exclude-names:
            - retryScheduledExecutor
          default-config:
            monitoring-interval: 30s
            cooldown-period: 2m
            high-load-threshold: 80.0
            low-load-threshold: 30.0
            async-monitoring-enabled: true
          configs:
            commonTaskExecutor:
              high-load-threshold: 70.0
              max-core-pool-size: 30
              scale-up-step: 3`}</CodeBlock>

              {/* ============== 6. 自动配置 ============== */}
              <H2 id="sec-5">6. 自动配置</H2>

              <H3>6.1 ThreadPoolConfig</H3>
              <P><InlineCode>@AutoConfiguration</InlineCode> 类，注册所有线程池 Bean：</P>

                            <DocTable
                headers={["`commonTaskExecutor`", "`CustomTaskExecutor`", "`create-common-pool=true`", "通用线程池"]}
                rows={[
                  ["`scheduleTaskExecutor` / `taskScheduler`", "`TaskScheduler`", "`create-schedule-pool=true`", "调度线程池（`@Primary`）"],
                  ["`ioIntensiveTaskExecutor`", "`CustomTaskExecutor`", "`create-io-intensive-pool=true`", "I/O 密集型线程池"],
                  ["`cpuIntensiveTaskExecutor`", "`CustomTaskExecutor`", "`create-cpu-intensive-pool=true`", "CPU 密集型线程池"],
                  ["`retryScheduledExecutor`", "`ScheduledExecutorService`", "`create-retry=true`", "重试调度线程池"],
                  ["`retryExecutor`", "`RetryExecutor`", "`create-retry=true`", "重试执行器"],
                ]}
              />

              <H3>6.2 ThreadPoolMonitorAutoConfig</H3>
              <P><InlineCode>@AutoConfiguration</InlineCode> 类，条件：<InlineCode>monitor.enabled=true</InlineCode></P>
              <BulletList items={["注册 `ThreadPoolMonitorManager` Bean", "通过 `@PostConstruct` 自动发现所有 `ThreadPoolTaskExecutor` Bean", "根据 include/exclude 规则过滤", "为每个线程池创建 `ThreadPoolMonitor`，支持特定配置和默认配置", "自动启动监控（`auto-start=true` 时）"]} />

              {/* ============== 7. CustomTaskExecutor（TraceId 传递） ============== */}
              <H2 id="sec-6">7. CustomTaskExecutor（TraceId 传递）</H2>
              <P>继承 <InlineCode>ThreadPoolTaskExecutor</InlineCode>，重写 <InlineCode>execute()</InlineCode> 方法：</P>
              <CodeBlock lang="java">{`public class CustomTaskExecutor extends ThreadPoolTaskExecutor {
    @Override
    public void execute(Runnable task) {
        final String traceId = TraceIdContext.getTraceId();
        super.execute(() -> {
            try {
                if (EmptyUtil.isNotEmpty(traceId)) {
                    TraceIdContext.setTraceId(traceId);
                    MDC.put(RequestHeaderConstant.TRACE_ID, traceId);
                }
                task.run();
            } finally {
                TraceIdContext.remove();
                MDC.remove(RequestHeaderConstant.TRACE_ID);
            }
        });
    }
}`}</CodeBlock>
              <P><Strong>功能：</Strong></P>
              <BulletList items={["提交任务前捕获当前线程的 TraceId", "任务执行时自动注入 TraceId 到子线程的 `TraceIdContext` 和 `MDC`", "任务结束后清理，防止泄漏"]} />

              {/* ============== 8. 线程池监控 ============== */}
              <H2 id="sec-7">8. 线程池监控</H2>

              <H3>8.1 ThreadPoolMetrics（指标数据）</H3>

                            <DocTable
                headers={["`corePoolSize`", "核心线程数"]}
                rows={[
                  ["`activeThreadCount`", "活跃线程数"],
                  ["`poolSize`", "当前线程池大小"],
                  ["`queueSize`", "队列中等待任务数"],
                  ["`queueCapacity`", "队列容量"],
                  ["`completedTaskCount`", "已完成任务数"],
                  ["`taskCount`", "总任务数"],
                  ["`threadUtilization`", "线程利用率（active / core × 100）"],
                  ["`queueUtilization`", "队列利用率（queueSize / capacity × 100）"],
                  ["`loadStatus`", "负载状态：LOW / MEDIUM / HIGH / CRITICAL"],
                ]}
              />

              <H3>8.2 AdjustmentDecision（调整决策）</H3>

                            <DocTable
                headers={["`SCALE_UP`", "扩容"]}
                rows={[
                  ["`NO_CHANGE`", "无需调整"],
                ]}
              />
              <P>提供工厂方法：<InlineCode>scaleUp()</InlineCode>、<InlineCode>scaleDown()</InlineCode>、<InlineCode>noChange()</InlineCode></P>

              <H3>8.3 ThreadPoolMonitor（监控器）</H3>
              <P>核心功能：</P>
              <BulletList items={["`startMonitoring()` — 启动监控（CAS 幂等保护）", "`stopMonitoring()` — 停止监控", "`manualAdjust()` — 手动触发一次调整", "`getStatistics()` — 获取完整统计信息", "`resetStatistics()` — 重置统计数据"]} />
              <P>支持同步 / 异步两种监控模式，OOM 时自动降级为同步模式。</P>

              <H3>8.4 ThreadPoolMonitorManager（管理器）</H3>
              <P>集中管理所有监控器：</P>
              <CodeBlock lang="java">{`// 获取指定监控器
ThreadPoolMonitor monitor = manager.getMonitor("commonTaskExecutor");

// 获取所有统计
Map<String, Map<String, Object>> stats = manager.getAllStatistics();

// 启动/停止所有监控
manager.startAllMonitoring();
manager.stopAllMonitoring();`}</CodeBlock>

              {/* ============== 9. CompletableFuture 转换工具 ============== */}
              <H2 id="sec-8">9. CompletableFuture 转换工具</H2>

              <H3>9.1 通用异步转换</H3>
              <CodeBlock lang="java">{`CompletableFuture<Result> future = CompletableFutureConvert.async(
    () -> slowService.query(param),
    5,   // 超时秒数
    ioIntensiveTaskExecutor
);`}</CodeBlock>

              <H3>9.2 BaseResult 自动解包</H3>
              <CodeBlock lang="java">{`CompletableFuture<UserDto> future = CompletableFutureConvert.asyncForBaseResult(
    () -> userApi.getUser(userId),
    3,   // 超时秒数
    ioIntensiveTaskExecutor
);

// future 直接包含 UserDto，无需手动解包 BaseResult
// 失败时自动抛出 RuntimeException("REMOTE_FAIL: code:msg")`}</CodeBlock>

              {/* ============== 10. 重试执行器 ============== */}
              <H2 id="sec-9">10. 重试执行器</H2>

              <H3>10.1 退避策略（BackoffStrategy）</H3>

                            <DocTable
                headers={["`LINEAR`", "base × attempt", "500ms, 1000ms, 1500ms"]}
                rows={[
                  ["`FIXED`", "base（恒定）", "500ms, 500ms, 500ms"],
                ]}
              />

              <H3>10.2 RetryConfig（重试配置）</H3>
              <CodeBlock lang="java">{`RetryConfig config = RetryConfig.builder()
    .maxRetries(3)                              // 最大重试 3 次
    .baseDelayMs(500)                           // 基础延迟 500ms
    .backoffStrategy(BackoffStrategy.LINEAR)    // 线性退避
    .maxConcurrentRetries(100)                  // 最大并发重试数
    .businessKey("pushMsg:user123")             // 业务标识
    .enableFallback(true)                       // 启用降级
    .retryFor(new Class[]{IOException.class})   // 仅重试 IO 异常
    .noRetryFor(new Class[]{IllegalArgumentException.class}) // 参数异常不重试
    .build();`}</CodeBlock>

              <H3>10.3 同步模式</H3>
              <CodeBlock lang="java">{`@Resource
private RetryExecutor retryExecutor;

// 同步执行，失败自动重试，所有重试完成后返回或抛异常
try {
    String result = retryExecutor.execute(config, () -> {
        return httpClient.get(url);
    });
} catch (Exception e) {
    // 所有重试都失败后的异常
}`}</CodeBlock>

              <H3>10.4 异步模式</H3>
              <CodeBlock lang="java">{`retryExecutor.executeAsync(config, () -> {
    rocketProducer.send(message);
    return null;
}, new RetryCallback<Void>() {
    @Override
    public void onSuccess(Void result, int attempt) {
        log.info("发送成功，尝试次数: {}", attempt);
    }

    @Override
    public void onFinalFailure(Exception e, int totalAttempts) {
        log.error("发送最终失败，总尝试: {}", totalAttempts, e);
    }
});`}</CodeBlock>

              <H3>10.5 RetryCallback（回调接口）</H3>

                            <DocTable
                headers={["`onSuccess(T result, int attempt)`", "操作成功时调用（首次或重试后）"]}
                rows={[]}
              />
              <P>两个方法都有默认空实现，可按需覆盖。</P>

              {/* ============== 11. 预定义配置模板 ============== */}
              <H2 id="sec-10">11. 预定义配置模板</H2>
              <P><InlineCode>DynamicAdjustmentConfig</InlineCode> 提供三种预置配置：</P>

                            <DocTable
                headers={["默认", "`defaultConfig()`", "30s", "2min", "80%", "2", "启用"]}
                rows={[
                  ["保守", "`conservativeConfig()`", "2min", "5min", "90%", "1", "关闭"],
                ]}
              /><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-thread — 高性能线程池管理，提升并发任务调度效率。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
