---
title: Talkie / 星野
slug: talkie-xingye
order: 2
company: MiniMax
period: 2023.06 — 2025.03
role: iOS 高级研发工程师
category: AI 与对话
headline: IM、流式消息与网络基础设施
summary: 负责 Talkie 与星野的 IM 核心模块、消息时延优化、列表渲染，以及长连接和网络库建设。
tags: ["Swift", "IM", "长连接", "DiffableDataSource"]
focus: ["消息全链路优化", "流式对话", "网络与稳定性"]
highlights: [{"value":"−610 ms","label":"对话时延 p90"},{"value":"51 → 60","label":"列表滚动 FPS"},{"value":"99.9%","label":"对话可用率"}]
visual: {"type":"conversation","caption":"消息与网络模块示意","label":"MESSAGING / NETWORKING","title":"Talkie / 星野","subtitle":"消息系统与网络","nodes":["客户端","长连接","AI 对话"],"footer":"流式消息 · 同步 · 持久化"}
cover: ""
coverAlt: ""
coverCaption: ""
caseStudy: talkie/case-study.json
---

## 职责

负责星野 / Talkie AI Chatbot 应用的 IM 核心模块迭代、网络基础设施和稳定性优化，支持用户与 AI 智能体的单聊、群聊，以及会话列表管理。

消息能力覆盖推送、离线消息、持久化、ack 机制、消息同步与漫游、本地数据库回写和一致性校验。

## 消息链路与列表性能

主导收发消息全链路优化，提出客户端与服务端的工程改造方案。将消息链路从透写调整为回写，通过自建长连接实现上下行消息的流式输出。

优化后对话时延 p90 降低 **610 ms**。对应项目阶段，用户留存提升 **1.4%**，对话数提升 **10%**。

使用 DiffableDataSource 重构消息流，列表滚动 FPS 从 **51 提升到 60**；通过列表渲染优化，内存占用降低 **22%**，OOM 降低 **23%**。

## 消息同步与网络库

逐步剥离对环信的依赖，自研持久化、消息同步、发送前后回调等能力。结合长连接推送与推拉策略，提升消息同步的可靠性；对话可用率达到 **99.9%**，长连接系统 SLA 从初期的 68% 提升并稳定在 **99.9%**。

基于 Alamofire 与 Moya 建设网络库，支持缓存策略、请求池与优先级、自定义序列化、长连接重建和短连补偿。通过 DNS 解析与弱网链路优化，弱网首包时间改善 **42%**。

## UI 自动化与留存专项

探索基于大模型的 UI 自动化，使用 Poco、WDA 和 Claude Sonnet 做界面探索与用例执行。参与新用户留存专项，包括 Feed 首刷缓存、关注转化和 deeplink 链路优化。

以上结果对应当时项目阶段内的统计口径。
