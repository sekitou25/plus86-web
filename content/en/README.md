# 英文文案

网站默认中文，通过顶部「中文 / EN」切换；语言选择会保存，也可以使用 `?lang=en` 或 `?lang=zh` 分享指定语言的页面。

- `interface.json`：完整英文导航、按钮、提示和无障碍标签。
- `site.json`：需要单独翻译的站点信息。昵称、社交账号与其他共同字段继承外层 `content/site.json`。
- `pages/*.md`：首页 Hero、作品集开场、关于、写作、旅行介绍。
- `works/*.md`：四个作品的英文内容，顶部 `slug` 与中文作品保持一致。
- `case-studies/qishui/*.md`、`case-studies/talkie/*.md`、`case-studies/wechat/*.md`：汽水、Talkie、公众号交互案例页的英文介绍、场景说明、工程决策与交互文案；结构与中文 `content/case-studies/` 一致。
- `travel.json`：以地点 id、照片 id 对应的英文名称、说明和图片描述；共用原始照片与日期。
- `posts/*.md`：新增 7 篇文章的完整英文正文、标题和摘要，顶部 `slug` 对应外层中文文章。
- `posts/catalog.json`：原有 8 篇投资笔记的英文标题和摘要，正文暂保留中文。

中文来源仍在外层 `content/`；新增作品先放入 `content/works/`，再在此处添加同一 slug 的英文文件。排序、地址与共同图片会继承中文作品。删除或隐藏中文来源时，两种语言都会同步移除。

## 补充英文文章

新增的 7 篇文章已经提供完整中英文版本。中文在外层 `content/posts/`，英文在此目录的 `posts/`；日期、分类、排序和文章地址共用中文稿的设置。两篇原本中英混排的笔记原稿保存在 `sources/original-posts/`，不随网站发布。书籍摘录的英文稿依据中文笔记自译，并非英文原版引文。

| 中文文件 | 英文文件 |
| --- | --- |
| `How to be successful - sam altman.md` | `how-to-be-successful-sam-altman.md` |
| `Services The new Software.md` | `services-the-new-software.md` |
| `2666.md` | `2666.md` |
| `紧张和兴奋.md` | `nervousness-and-excitement.md` |
| `反脆弱：从不确定性中获益.md` | `antifragile.md` |
| `魔术师.md` | `the-magician.md` |
| `有限与无限的游戏：一个哲学家眼中的竞技世界.md` | `finite-and-infinite-games.md` |

原有 8 篇投资笔记的正文保留中文，在英文界面会明确提示。要添加完整英文版，在 `posts/` 新建 Markdown，保持顶部 `slug` 与中文一致：

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
