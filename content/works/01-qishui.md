---
title: 汽水音乐播放器
slug: qishui-music
order: 3
company: 字节跳动
period: 2021.10 — 2023.06
role: iOS 研发工程师
category: 音乐与播放
headline: 播放器、首页组件化与播放性能优化
summary: 参与汽水音乐早期开发，负责首页播放器、歌词和 Feed 相关业务，以及缓存治理和早期版本上架。
tags: ["Swift", "MVVM", "OpenCombine", "音视频"]
focus: ["播放器与首页", "播放性能优化", "缓存与组件化"]
highlights: [{"value":"音视频","label":"首页播放业务"},{"value":"MVVM","label":"首页组件化"},{"value":"App Store","label":"早期版本发布"}]
visual: {"type":"music","caption":"播放器模块示意","label":"PLAYER / HOME","title":"汽水音乐","subtitle":"播放器 / 首页","nodes":["预加载","播放","缓存"],"footer":"播放器、歌词与首页 Feed"}
cover: ""
coverAlt: ""
coverCaption: ""
caseStudy: qishui/case-study.json
---

## 职责

在汽水音乐的早期建设阶段，负责播放器主页的业务迭代和工程架构。工作覆盖音频与短视频播放、无限 Feed 流、首页 UI、krc / lrc 歌词，以及早期商店发布流程。

## 播放性能与监控

基于公司自研的点播 SDK 搭建和维护业务播放器。针对首帧耗时，使用预加载、预渲染等方式调优；针对卡顿和播放失败，通过自适应码率切换、卡顿水位调整等手段改善体验。

梳理播放性能指标和埋点，建立核心指标告警与 on-call 机制，用于发现和排查线上播放问题。

## 组件化与缓存

基于 MVVM 和 OpenCombine 风格的消息传递，完成首页能力的组件化。将歌曲 cell 抽象为可配置的通用 UI 组件，支持不同业务场景复用。

治理播放器缓存：隔离音频文件缓存，统一业务缓存；在启动阶段异步或延迟读取数据库，并推动数据从 Core Data 向 KV 迁移。基于 YYCache 产出业务缓存组件，推广到其他业务场景。

## 版本发布

负责早期 App 上架的完整流程，包括证书申请、工程配置、测试包与商店包打包、商店提审。通过证书池提供更便捷的开发者签名能力，改善团队开发体验。
