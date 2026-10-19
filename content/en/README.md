# 英文文案

网站默认中文，通过顶部「中文 / EN」切换；语言选择会保存，也可以使用 `?lang=en` 或 `?lang=zh` 分享指定语言的页面。

- `interface.json`：完整英文导航、按钮、提示和无障碍标签。
- `site.json`：需要单独翻译的站点信息。昵称、社交账号与其他共同字段继承外层 `content/site.json`。
- `pages/*.md`：首页 Hero、作品集开场、关于、近况、写作、旅行介绍。
- `works/*.md`：四个作品的英文内容，顶部 `slug` 与中文作品保持一致。
- `travel.json`：以地点 id、照片 id 对应的英文名称、说明和图片描述；共用原始照片与日期。
- `posts/catalog.json`：现有中文文章的英文标题和摘要。

中文来源仍在外层 `content/`；新增作品先放入 `content/works/`，再在此处添加同一 slug 的英文文件。排序、地址与共同图片会继承中文作品。删除或隐藏中文来源时，两种语言都会同步移除。

## 补充英文文章

现有学习笔记的正文保留中文，在英文界面会明确提示。要添加完整英文版，在 `posts/` 新建同名 Markdown：

```md
---
slug: statarb-learning-guide
title: Statistical Arbitrage Learning Guide
---

## Start here

Write the English article here.
```

保存后会自动替换英文界面的正文、阅读目录和搜索文字，中文原文不受影响。

英文版未补齐的新作品或文章会使用原文，明确标注语言；不会丢掉作品、生成空白页或伪装成已翻译内容。

图片仍统一放在 `content/media/`。英文 Markdown 在此目录的 `works/` 或 `pages/` 内引用共享图片时，路径为 `../../media/图片.jpg`。
