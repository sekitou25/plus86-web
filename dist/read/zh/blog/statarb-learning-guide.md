# 统计套利入门 六章学习目录

语言: zh
正文语言: zh
Date: 2026-10-16

[交互版](/?lang=zh#/blog/statarb-learning-guide) · [HTML](/read/zh/blog/statarb-learning-guide.html)

这套六章讲解面向投资初学者，依据 Triangulated Stat Arb 策略说明和 R notebook，解释收益来源、信号、仓位、日常交易、风险与代码实现。六章正文已完成，可按下面顺序阅读。

## 阅读顺序

1. [统计套利入门 01 策略靠什么赚钱](/read/zh/blog/statarb-01-how-it-makes-money.html)：从买入与做空开始，理解相对价格回归怎样产生盈亏。

2. [统计套利入门 02 怎样把相对便宜和贵变成交易信号](/read/zh/blog/statarb-02-signals.html)：用数字解释 z-score、配对质量、深度与意见一致性。

3. [统计套利入门 03 怎样把信号变成实际仓位](/read/zh/blog/statarb-03-position-sizing.html)：把信号变成金额与股数，理解总敞口、净敞口、杠杆和集中度。

4. [统计套利入门 04 每天怎样调仓以及为什么有时应该不交易](/read/zh/blog/statarb-04-rebalancing.html)：理解仓位漂移、交易缓冲、不同进出场门槛、财报与执行时间。

5. [统计套利入门 05 怎样判断收益风险以及回测是否可信](/read/zh/blog/statarb-05-performance-and-risk.html)：解释复合收益、波动、回撤、Sharpe、换手、成本和回测可信度。

6. [统计套利入门 06 读懂整份代码以及从研究走到实际执行](/read/zh/blog/statarb-06-code-and-execution.html)：把整份代码串起来，区分配置、模拟结果与导出文件，并记录复现问题。

## 怎样使用这些章节

先理解每章的数字例子，再对照代码。示例金额和参数用于讲解计算；历史绩效明确标为材料中的已保存输出。各章末尾保留学习反馈区，可以记录不清楚的地方。

## 阅读时保留的三个边界

- 上游配对与质量排名来自外部数据，本地文件没有展示完整的信号研究生产流程。

- 历史模型收益、风险尺度调整后的展示与未来可实现收益需要分别判断。

- 第六章记录了缓冲版本、权重导出位置、借券补齐和依赖函数等静态核对问题；完整复现仍需数据快照与匹配版本。

本轮完成了讲解与静态阅读，课程内容可以作为后续核对数据和实现的依据。

[Notion 原文 ↗](https://app.notion.com/p/3fb6dacbbc7e81dea566f821d5b7aa7e)
