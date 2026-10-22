---
title: 微信 · 公众号
slug: wechat-official-accounts
order: 3
company: 腾讯 · 微信事业部
period: 2025.04 起
role: 客户端开发工程师
category: 内容与阅读
headline: 公众号推荐流的展示与点击刷新
summary: 参与微信公众号相关客户端开发，支持看一看推荐流的瀑布流展示和推荐点击刷新策略。
tags: ["Flutter", "Swift", "C++", "推荐流"]
focus: ["公众号业务", "看一看推荐流", "瀑布流与刷新策略"]
highlights: [{"value":"瀑布流","label":"推荐内容展示"},{"value":"点击刷新","label":"内容更新策略"},{"value":"客户端","label":"Flutter / Swift / C++"}]
visual: {"type":"reading","caption":"推荐流布局示意","label":"CONTENT / FEED","title":"公众号","subtitle":"推荐流","nodes":["内容","推荐","阅读"],"footer":"瀑布流 / 点击刷新"}
cover: ""
coverAlt: ""
coverCaption: ""
caseStudy: "wechat/case-study.json"
---

## 职责

在微信事业部参与公众号相关客户端开发，多 agent 开发公众号、推荐流相关能力。

## 推荐流

- 支持看一看推荐流的瀑布流展示。
- 增加推荐点击刷新策略。
- 使用 Flutter、Swift 与 C++ 参与客户端业务迭代。支持 iOS、安卓、鸿蒙三端同时开发

## 多 Agent 协作与自动化测试
并行开发：将需求拆分为职责明确的任务，同时驱动多个 Agent 进行实现。明确各任务的接口、依赖和验收条件，统一评审与集成，减少重复修改和并行开发中的冲突。
测试 Agent：搭建独立的测试 Agent，根据需求整理测试用例，执行冒烟测试和回归检查。记录失败步骤、界面状态与复现信息，辅助开发定位问题，并将测试结果纳入上线前检查。
UI 自动化探索：结合 Poco、WDA 和 Claude Sonnet，探索基于大模型的界面理解、交互操作与用例执行。重点关注关键业务路径、异常状态，以及测试重复执行时的稳定性。
业务知识检索：探索基于 RAG 的业务知识库，将业务规则、接口说明和历史用例整理为可检索资料，为开发与测试 Agent 提供上下文。保留来源与版本信息，便于核对依据，减少因业务信息缺失或过期产生的错误。
