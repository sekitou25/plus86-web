---
kicker: "PROJECT METRICS"
title: "优化前后"
lead: "选择指标查看对比。帧率和 SLA 使用原始值；内存与弱网首包只有相对降幅，以优化前为 100 换算。"
beforeLabel: "优化前"
afterLabel: "优化后"
fpsLabel: "FPS"
percentLabel: "%"
indexLabel: "指数"
indexNote: "优化前 = 100，仅表示相对变化，不是 MB 或毫秒。数值越低越好。"
rawNote: "原始数值，数值越高越好。"
note: "统计阶段：2023.06—2025.03。数据不是当前产品实时表现；长连接 SLA 与对话可用率是不同指标。"
data: "metrics.json"
---

## scrolling | 列表滚动 FPS

使用 DiffableDataSource 重构消息流并优化渲染，滚动帧率从 51 提升到 60 FPS。

## availability | 长连接系统 SLA

建设连接与同步能力，结合推送、推拉策略和短连补偿。SLA 从初期 68% 提升并稳定在 99.9%。

## memory | 内存占用

列表渲染优化后内存占用降低 22%，指数由 100 变为 78。同阶段 OOM 降低 23%。

## weak-network | 弱网首包时间

DNS 与弱网链路优化后，首包时间改善 42%，指数由 100 变为 58。
