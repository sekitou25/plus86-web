---
kicker: "MESSAGING / RESPONSIBILITIES"
title: "消息系统职责划分"
lead: "对话界面、消息处理，以及连接与数据基础设施。选择节点查看实现。"
selectionLabel: "职责与实现"
defaultNode: "connection"
diagramLabel: "Talkie 与星野客户端消息系统的职责图"
note: "按 2023.06—2025.03 工作范围整理，不含模型服务内部设计，也不是完整生产架构。"
---

## experience | 对话界面

### conversations | 单聊 / 群聊

支持用户与 AI 智能体的单聊和群聊，处理发送反馈与流式回复展示。

### sessions | 会话列表

负责会话列表管理，与消息同步、漫游和本地数据协作。

## messaging | 消息处理

### rendering | 消息流 / DiffableDataSource

使用 DiffableDataSource 重构消息流，优化列表渲染。滚动 FPS 从 51 提升到 60，内存占用降低 22%，OOM 降低 23%。

### acknowledgments | 发送状态 / ACK

自研发送前后回调、ACK 和状态追踪相关能力，逐步减少对环信的依赖。

### streaming | 上下行流式消息

改造客户端与服务端消息链路，从透写调整为回写，通过自建长连接实现上下行流式输出。对话时延 p90 降低 610 ms。

## infrastructure | 连接与数据

### connection | 自建长连接

建设长连接及重建能力，结合推送、推拉策略与短连补偿。长连接系统 SLA 从初期 68% 提升并稳定在 99.9%。

### persistence | 持久化 / 同步 / 一致性

自研持久化和消息同步，覆盖离线消息、漫游、本地数据库回写与一致性校验。

### network | Alamofire / Moya 网络库

建设缓存策略、请求池与优先级、自定义序列化和连接恢复等能力。通过 DNS 与弱网优化，使弱网首包时间改善 42%。
