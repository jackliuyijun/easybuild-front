"use client"

import { DocLayout } from "../_components/doc-layout"
import { CodeBlock, DocTable, H2, H3, H4, P, BulletList, InlineCode, Strong } from "../_components/doc-components"

const outlineItems = [
  { id: "sec-0", label: "模块概述" },
  { id: "sec-1", label: "依赖引入" },
  { id: "sec-2", label: "配置说明" },
  { id: "sec-3", label: "锁类型说明" },
  { id: "sec-4", label: "使用方式" },
  { id: "sec-5", label: "API 参考" },
  { id: "sec-6", label: "实战示例" },
  { id: "sec-7", label: "自动配置机制" },
  { id: "sec-8", label: "包结构" },
  { id: "sec-9", label: "最佳实践" },
]

export default function LockRedissonDocPage() {
  return (
    <DocLayout
      outlineItems={outlineItems}
      breadcrumb="Redisson 分布式锁"
      title="easyfk-lock-redisson Redisson 分布式锁"
      subtitle="Redisson 分布式锁 — 高可用分布式互斥方案"
      readingTime="~15 min"
    >
{/* ============== 1. 模块概述 ============== */}
              <H2 id="sec-0">1. 模块概述</H2>
              <P><InlineCode>lock-redisson</InlineCode> 是 EasyFK 框架中基于 Redisson 的分布式锁组件。该模块提供四种锁类型（可重入锁、公平锁、读锁、写锁）、四种 Redis 部署模式（单机、主从、哨兵、集群）、看门狗自动续期机制，以及模板化的加锁执行 API（单锁、批量锁、嵌套锁），适用于分布式环境下的并发控制、资源互斥、幂等防重等场景。</P>

              {/* ============== 2. 依赖引入 ============== */}
              <H2 id="sec-1">2. 依赖引入</H2>

              <H3>Maven</H3>
              <CodeBlock lang="xml">{`<dependency>
    <groupId>com.mcst</groupId>
    <artifactId>lock-redisson</artifactId>
</dependency>`}</CodeBlock>

              <H3>Gradle</H3>
              <CodeBlock lang="gradle">{`dependencies {
    implementation 'com.mcst:lock-redisson'
}`}</CodeBlock>
              <P>&gt; 版本号由框架统一 BOM 管理，无需手动指定。</P>
              <P>该模块会自动传递引入以下依赖：</P>
              <BulletList items={["`redisson` — Redisson 分布式锁客户端"]} />

              {/* ============== 3. 配置说明 ============== */}
              <H2 id="sec-2">3. 配置说明</H2>

              <H3>3.1 配置属性</H3>
              <P>所有配置项统一在 <InlineCode>easyfk.config.lock.redisson</InlineCode> 前缀下。</P>
              <H4>基础配置</H4>

                            <DocTable
                headers={["`host`", "String", "`127.0.0.1`", "Redis 服务器地址"]}
                rows={[
                  ["`password`", "String", "—", "连接密码"],
                  ["`database`", "int", "`0`", "数据库索引"],
                  ["`minimumIdleSize`", "int", "`10`", "最小空闲连接数"],
                  ["`pattern`", "RedisPattern", "`SINGLE`", "Redis 部署模式"],
                ]}
              />
              <H4>主从模式配置</H4>

                            <DocTable
                headers={["`masterAddresses`", "String", "主节点地址"]}
                rows={[]}
              />
              <H4>哨兵模式配置</H4>

                            <DocTable
                headers={["`sentinelAddresses`", "String[]", "哨兵节点地址列表"]}
                rows={[]}
              />
              <H4>集群模式配置</H4>

              

              <H3>3.2 配置示例</H3>
              <H4>单机模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        host: 192.168.1.100
        port: 6379
        password: your_password
        database: 0
        minimumIdleSize: 10
        pattern: SINGLE`}</CodeBlock>
              <H4>哨兵模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        password: your_password
        database: 0
        pattern: SENTINEL
        masterName: mymaster
        sentinelAddresses:
          - redis://192.168.1.100:26379
          - redis://192.168.1.101:26379
          - redis://192.168.1.102:26379`}</CodeBlock>
              <H4>集群模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        password: your_password
        pattern: CLUSTER
        nodeAddress:
          - redis://192.168.1.100:7000
          - redis://192.168.1.100:7001
          - redis://192.168.1.100:7002
          - redis://192.168.1.101:7000
          - redis://192.168.1.101:7001
          - redis://192.168.1.101:7002`}</CodeBlock>
              <H4>主从模式</H4>
              <CodeBlock lang="yaml">{`easyfk:
  config:
    lock:
      redisson:
        password: your_password
        database: 0
        pattern: MASTERSLAVE
        masterAddresses: redis://192.168.1.100:6379
        slaveAddresses:
          - redis://192.168.1.101:6379
          - redis://192.168.1.102:6379`}</CodeBlock>

              {/* ============== 4. 锁类型说明 ============== */}
              <H2 id="sec-3">4. 锁类型说明</H2>
              <P>通过 <InlineCode>LockType</InlineCode> 枚举指定锁类型：</P>

                            <DocTable
                headers={["**可重入锁**", "`REENTRANT_LOCK`", "同一线程可多次获取同一把锁，不会死锁"]}
                rows={[
                  ["**读锁**", "`READ_LOCK`", "读写锁的读端，允许多个线程同时持有"],
                  ["**写锁**", "`WRITE_LOCK`", "读写锁的写端，互斥独占"],
                ]}
              />

              {/* ============== 5. 使用方式 ============== */}
              <H2 id="sec-4">5. 使用方式</H2>

              <H3>5.1 注入 RLockTemplate</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RLockTemplate rLockTemplate;
}`}</CodeBlock>

              <H3>5.2 核心概念</H3>
              <BulletList items={["**waitTime**：等待获取锁的最长时间，超时返回 `null`", "**leaseTime**：锁的租约时间（持有时间）。设为 `-1` 表示启用**看门狗机制**，自动续期直到手动释放", "**看门狗机制**：Redisson 默认每 10 秒自动续期锁，防止业务未完成锁就过期"]} />

              {/* ============== 6. API 参考 ============== */}
              <H2 id="sec-5">6. API 参考</H2>

              <H3>6.1 RLockTemplate 方法一览</H3>
              <H4>基础锁操作</H4>

                            <DocTable
                headers={["`getLock(key, lockType)`", "锁 key, 锁类型", "`RLock`", "获取锁对象（不加锁）"]}
                rows={[
                  ["`unlock(lock)`", "锁对象", "void", "释放锁（自动检查当前线程持有）"],
                ]}
              />
              <H4>模板化加锁执行（推荐）</H4>

                            <DocTable
                headers={["`withTryLock(key, bizMethod)`", "无等待尝试加锁，公平锁，看门狗续期"]}
                rows={[
                  ["`withTryLock(key, waitTime, unit, bizMethod)`", "带等待时间，公平锁，看门狗续期"],
                  ["`withTryLock(key, waitTime, unit, lockType, bizMethod)`", "带等待时间，指定锁类型，看门狗续期"],
                  ["`withTryLock(key, waitTime, leaseTime, unit, bizMethod)`", "带等待和租约时间，公平锁"],
                  ["`withTryLock(key, waitTime, leaseTime, unit, lockType, bizMethod)`", "完整参数版，指定所有选项"],
                ]}
              />
              <H4>批量加锁</H4>

                            <DocTable
                headers={["`withTryLockMulti(keys, waitTime, unit, bizMethod)`", "批量加锁，公平锁，看门狗续期"]}
                rows={[]}
              />
              <H4>嵌套加锁</H4>

                            <DocTable
                headers={["`withNestedLock(outerKey, innerKeys, waitTime, unit, bizMethod)`", "嵌套锁，公平锁，看门狗续期"]}
                rows={[]}
              />
              <P>&gt; 所有 <InlineCode>withTryLock*</InlineCode> 方法：加锁成功执行业务并返回结果，加锁失败返回 <InlineCode>null</InlineCode>。<Strong>锁的释放完全自动</Strong>，无需手动 <InlineCode>unlock</InlineCode>。</P>

              {/* ============== 7. 实战示例 ============== */}
              <H2 id="sec-6">7. 实战示例</H2>

              <H3>7.1 最简用法：无等待加锁</H3>
              <CodeBlock lang="java">{`@Service
public class OrderService {

    @Resource
    private RLockTemplate rLockTemplate;

    public BaseResult<?> createOrder(OrderDTO order) throws Exception {
        return rLockTemplate.withTryLock("order:create:" + order.getUserId(), () -> {
            // 加锁成功，执行创建订单逻辑
            return doCreateOrder(order);
        });
        // 返回 null 表示加锁失败（有其他线程正在处理）
    }
}`}</CodeBlock>

              <H3>7.2 带等待时间加锁</H3>
              <CodeBlock lang="java">{`public BaseResult<?> processPayment(String orderId) throws Exception {
    return rLockTemplate.withTryLock(
        "payment:" + orderId,
        5, TimeUnit.SECONDS,          // 最多等待 5 秒
        () -> {
            return doPayment(orderId);
        }
    );
}`}</CodeBlock>

              <H3>7.3 指定租约时间（禁用看门狗）</H3>
              <CodeBlock lang="java">{`public void syncData(String taskId) throws Exception {
    rLockTemplate.withTryLock(
        "sync:" + taskId,
        10, 60, TimeUnit.SECONDS,     // 等待 10 秒，锁最多持有 60 秒
        () -> {
            doSync(taskId);
            return null;
        }
    );
}`}</CodeBlock>

              <H3>7.4 指定锁类型</H3>
              <CodeBlock lang="java">{`// 使用可重入锁
public void process(String key) throws Exception {
    rLockTemplate.withTryLock(
        "task:" + key,
        5, TimeUnit.SECONDS,
        LockType.REENTRANT_LOCK,
        () -> {
            return doProcess(key);
        }
    );
}

// 使用读锁（允许并发读）
public ProductDTO getProduct(String productId) throws Exception {
    return rLockTemplate.withTryLock(
        "product:" + productId,
        LockType.READ_LOCK,
        () -> {
            return queryProduct(productId);
        }
    );
}

// 使用写锁（互斥写）
public void updateProduct(ProductDTO product) throws Exception {
    rLockTemplate.withTryLock(
        "product:" + product.getId(),
        5, TimeUnit.SECONDS,
        LockType.WRITE_LOCK,
        () -> {
            doUpdateProduct(product);
            return null;
        }
    );
}`}</CodeBlock>

              <H3>7.5 批量加锁：多资源并发控制</H3>
              <P>批量加锁自动按 key 字典序排序后依次加锁，<Strong>有效避免死锁</Strong>。任一锁获取失败则释放所有已获取的锁并返回 <InlineCode>null</InlineCode>。</P>
              <CodeBlock lang="java">{`public BaseResult<?> transferStock(List<String> productIds) throws Exception {
    // 对多个商品同时加锁
    List<String> lockKeys = productIds.stream()
        .map(id -> "stock:" + id)
        .collect(Collectors.toList());

    return rLockTemplate.withTryLockMulti(
        lockKeys,
        5, TimeUnit.SECONDS,
        () -> {
            // 所有商品锁获取成功，执行转移库存逻辑
            return doTransferStock(productIds);
        }
    );
}`}</CodeBlock>

              <H3>7.6 嵌套加锁：订单锁 + 商品锁</H3>
              <P>先获取外层锁（如订单幂等锁），再批量获取内层锁（如商品并发锁），适用于复合锁场景。</P>
              <CodeBlock lang="java">{`public BaseResult<?> submitOrder(String orderId, List<String> productIds) throws Exception {
    // 外层锁：订单幂等控制
    String outerKey = "order:" + orderId;
    // 内层锁：商品库存并发控制
    List<String> innerKeys = productIds.stream()
        .map(id -> "product:stock:" + id)
        .collect(Collectors.toList());

    return rLockTemplate.withNestedLock(
        outerKey, innerKeys,
        5, TimeUnit.SECONDS,
        () -> {
            // 订单锁 + 所有商品锁均获取成功
            return doSubmitOrder(orderId, productIds);
        }
    );
}`}</CodeBlock>

              <H3>7.7 手动控制锁（高级用法）</H3>
              <CodeBlock lang="java">{`public void manualLockExample(String key) throws InterruptedException {
    RLock lock = rLockTemplate.tryLock(
        key, 5, 30, TimeUnit.SECONDS, LockType.FAIR_LOCK
    );
    if (lock == null) {
        // 加锁失败
        return;
    }
    try {
        // 执行业务逻辑
        doBusiness();
    } finally {
        rLockTemplate.unlock(lock);
    }
}`}</CodeBlock>

              {/* ============== 8. 自动配置机制 ============== */}
              <H2 id="sec-7">8. 自动配置机制</H2>

              
              <BulletList items={["通过 Spring Boot `AutoConfiguration.imports` 声明自动配置入口", "使用 `@EnableConfigurationProperties` 自动绑定 `RedissonProperties`", "自动注册三个 Bean：", "`RedissonClient` — Redisson 客户端（`@ConditionalOnMissingBean`，可自定义覆盖）", "`RedissonLockManager` — 锁管理器", "`RLockTemplate` — 锁操作模板", '`RedissonClient` 使用 `destroyMethod = "shutdown"`，应用关闭时自动释放连接']} />

              {/* ============== 9. 包结构 ============== */}
              <H2 id="sec-8">9. 包结构</H2>
              <CodeBlock lang="plaintext">{`com.mcst.easyfk.lock.redisson
├── RLockTemplate.java                # 锁操作模板（核心 API）
├── config
│   └── RLockConfig.java              # Spring Boot 自动配置类
├── enums
│   ├── LockType.java                 # 锁类型枚举（可重入/公平/读/写）
│   └── RedisPattern.java             # Redis 部署模式枚举（单机/主从/哨兵/集群）
├── manager
│   └── RedissonLockManager.java      # 锁管理器（创建锁对象）
├── properties
│   └── RedissonProperties.java       # 配置属性类
└── util
    └── RedisLockUtil.java            # 静态工具类`}</CodeBlock>

              {/* ============== 10. 最佳实践 ============== */}
              <H2 id="sec-9">10. 最佳实践</H2>
              <P>1. <Strong>优先使用 <InlineCode>withTryLock</InlineCode> 模板方法</Strong>：自动管理锁的获取和释放，避免忘记 <InlineCode>unlock</InlineCode> 导致死锁。</P>
              <P>2. <Strong>合理设置等待时间</Strong>：根据业务耗时设置 <InlineCode>waitTime</InlineCode>，避免过长阻塞或过短失败。</P>
              <P>3. <Strong>善用看门狗机制</Strong>：<InlineCode>leaseTime</InlineCode> 设为 <InlineCode>-1</InlineCode>（默认）启用自动续期，适合业务耗时不确定的场景。固定耗时业务可设置明确的租约时间。</P>
              <P>4. <Strong>批量锁防死锁</Strong>：需要同时锁多个资源时使用 <InlineCode>withTryLockMulti</InlineCode>，框架自动按字典序排序加锁。</P>
              <P>5. <Strong>嵌套锁分层控制</Strong>：订单幂等 + 商品并发等复合场景使用 <InlineCode>withNestedLock</InlineCode>。</P>
              <P>6. <Strong>公平锁 vs 可重入锁</Strong>：需要按请求顺序获取锁选公平锁（默认），追求性能选可重入锁。</P>
              <P>7. <Strong>读写锁提升并发</Strong>：读多写少场景使用 <InlineCode>READ_LOCK</InlineCode> / <InlineCode>WRITE_LOCK</InlineCode>，允许并发读、互斥写。</P>
              <P>8. <Strong>锁粒度尽量细</Strong>：按业务资源 ID 加锁（如 <InlineCode>{'order:{orderId}'}</InlineCode>），避免用粗粒度锁降低并发能力。</P>
              <P>9. <Strong>处理加锁失败</Strong>：<InlineCode>withTryLock*</InlineCode> 方法加锁失败返回 <InlineCode>null</InlineCode>，业务层需判断并做相应处理（如返回&quot;请勿重复提交&quot;）。</P><div className="rounded-[10px] border border-[#1F2937] bg-white/[0.024] px-5 py-4 text-center">
                <p className="font-mono text-[13px] italic text-[#525252]">
                  easyfk-lock-redisson — 高可用分布式互斥锁方案。
                </p>
              </div>

              {/* Separator */}
    </DocLayout>
  )
}
