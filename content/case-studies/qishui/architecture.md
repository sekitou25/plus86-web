---
kicker: "PLAYER / RESPONSIBILITIES"
title: "播放器职责划分"
lead: "首页展示、状态协作和播放基础能力。选择节点查看具体工作。"
selectionLabel: "职责与实现"
defaultNode: "view-model"
diagramLabel: "汽水音乐首页、状态组件和播放基础能力的职责图"
note: "按当时工作范围整理。连线表示协作关系，不是完整生产架构。"
---

## experience | 首页展示

### feed | 无限 Feed / 歌曲 Cell

负责首页无限 Feed，类 Tiktok 的无限 feed 流、FPS 优化、播放首帧和卡顿优化

### lyrics | krc / lrc 歌词

负责 krc 与 lrc 歌词能力，处理歌词、播放进度与界面状态的同步。

### media | 音频 / 短视频

负责首页音频与短视频播放相关业务，处理不同媒体形态下的展示与播放状态。

## coordination | 状态与组件

### view-model | MVVM

使用 MVVM 组织首页业务，将界面展示与业务状态分离，支持组件组合与复用。

### events | OpenCombine 风格消息传递

使用 OpenCombine 风格的消息传递处理组件间事件和播放状态更新。

## foundation | 播放与数据

### player-sdk | 点播 SDK / 播放调优

基于自研点播 SDK 搭建业务播放器。通过预加载、预渲染、自适应码率和卡顿水位调节，优化首帧与播放稳定性。

### cache | 音频缓存 / 业务缓存

隔离音频缓存，统一业务缓存。基于 YYCache 实现缓存组件，调整启动数据库读取，并推动 Core Data 向 KV 迁移。

### telemetry | 埋点 / 告警 / On-call

梳理播放性能埋点，建立核心指标告警与 on-call 机制，用于发现和排查线上播放问题。
