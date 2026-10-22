---
title: plumber
slug: plumber
order: 4
company: 个人项目
period: 开发中
role: 策略研究与系统构建
category: AI 与交易
headline: 自动交易 Agent 的研究与实现
summary: 开发中的个人项目，包含策略研究、回测、IBKR 交易执行、独立账本和本机监控。
tags: ["Python", "IBKR", "策略研究", "执行与监控"]
focus: ["策略研究与回测", "交易执行与对账", "本机监控"]
highlights: [{"value":"IBKR","label":"交易执行适配"},{"value":"独立账本","label":"策略与环境隔离"},{"value":"本机监控","label":"状态、成交与日志"}]
visual: {"type":"agent","caption":"交易系统流程示意","label":"RESEARCH / EXECUTION","title":"plumber","subtitle":"自动交易 Agent","nodes":["研究 / 信号","风险校验","执行 / 对账"],"footer":"个人项目 / 开发中"}
cover: ""
coverAlt: ""
coverCaption: ""
---

## 项目范围

plumber 是开发中的自动交易 AI Agent，包含策略研究、回测、交易执行、独立账本、对账与本机监控。

目前研究风险平价、统计套利、债券季节性与订单流。每个策略需要记录收益假设、成本、执行约束和参数选择的依据。

## 研究与执行

研究 Notebook 与在线执行分层组织。运行系统包含可复用的 IBKR 适配、连接心跳、安全执行、独立账本与审计组件；按策略和交易环境隔离配置与运行状态。

系统记录信号计算、订单、成交回报与对账过程，用于排查执行差异。

## 监控

建设本机监控面板，展示策略状态、持仓、净值、成交记录与脱敏日志。监控与交易服务分离，保留明确的环境选择和停止机制。

## 待验证的问题

继续检查交易成本、成交偏差与执行异常对策略结果的影响。工程系统仍在开发，现有实现不代表策略已被验证，也不构成收益承诺。
