---
slug: "statarb-learning-guide"
kind: "guide"
excerpt: "统计套利入门的六章阅读顺序：收益来源、信号、仓位、日常交易、风险与代码实现。"
title: "统计套利入门 六章学习目录"
id: "3fb6dacbbc7e81dea566f821d5b7aa7e"
sourceUrl: "https://app.notion.com/p/3fb6dacbbc7e81dea566f821d5b7aa7e"
createdAt: "2026-10-16T06:56:46.744Z"
updatedAt: "2026-10-16T06:56:46.744Z"
date: "2026-10-16"
dateSource: "created"
series: {"id":"statarb-intro","name":"统计套利入门","order":0}
tag: "investment"
format: "notion"
---

这套六章讲解面向投资初学者，依据 Triangulated Stat Arb 策略说明和 R notebook，解释收益来源、信号、仓位、日常交易、风险与代码实现。六章正文已完成，可按下面顺序阅读。
## 阅读顺序
1. <mention-page url="https://app.notion.com/p/3fb6dacbbc7e81cd9e28d11916c8b53f"/>：从买入与做空开始，理解相对价格回归怎样产生盈亏。
2. <mention-page url="https://app.notion.com/p/3fb6dacbbc7e816aa025f8594a8504ab"/>：用数字解释 z-score、配对质量、深度与意见一致性。
3. <mention-page url="https://app.notion.com/p/3fb6dacbbc7e810db7a8ce7a3768f8d8"/>：把信号变成金额与股数，理解总敞口、净敞口、杠杆和集中度。
4. <mention-page url="https://app.notion.com/p/3fb6dacbbc7e8101bc5fe9dc5b1dd85b"/>：理解仓位漂移、交易缓冲、不同进出场门槛、财报与执行时间。
5. <mention-page url="https://app.notion.com/p/3fb6dacbbc7e810aa418c9936b2091c9"/>：解释复合收益、波动、回撤、Sharpe、换手、成本和回测可信度。
6. <mention-page url="https://app.notion.com/p/3fb6dacbbc7e81098ef8d876cfbe2af3"/>：把整份代码串起来，区分配置、模拟结果与导出文件，并记录复现问题。
## 怎样使用这些章节
先理解每章的数字例子，再对照代码。示例金额和参数用于讲解计算；历史绩效明确标为材料中的已保存输出。各章末尾保留学习反馈区，可以记录不清楚的地方。
## 阅读时保留的三个边界
- 上游配对与质量排名来自外部数据，本地文件没有展示完整的信号研究生产流程。
- 历史模型收益、风险尺度调整后的展示与未来可实现收益需要分别判断。
- 第六章记录了缓冲版本、权重导出位置、借券补齐和依赖函数等静态核对问题；完整复现仍需数据快照与匹配版本。
本轮完成了讲解与静态阅读，课程内容可以作为后续核对数据和实现的依据。
