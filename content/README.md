# 以后只编辑这个目录

页面、文章、按钮提示、站点信息和旅行文案都从 `content/` 生成。用任意编辑器打开这个文件夹即可，不用修改代码或维护文章列表。

## 文案约定

这次统一后的写法以事实为主：标题直接说明主题，正文写职责、实现、结果和取舍。避免用排比、口号或抽象赞语代替工作内容，不替自己下“专业”“可靠”“有品位”的结论。

项目中区分个人职责与产品现状、阶段指标与实时数据、生产功能与本地演示。没有数据时不补造数字。中英文共享事实和指标，可以分别调整表达。

参考 [OpenAI 公司介绍](https://openai.com/about/) 的直接陈述和 [Anthropic 工程页面](https://www.anthropic.com/engineering) 对具体问题的组织方式，不照搬品牌口号。原有研究文章和旅行记录保留作者自己的写法。

| 想修改的内容 | 文件 |
| --- | --- |
| 昵称、标语、浏览器简介、邮箱、社交账号、关注方向 | `site.json` |
| 首页介绍 | `pages/home.md` |
| 关于我的介绍 | `pages/about.md` |
| 博客标题、简介 | `pages/blog.md` |
| 旅行页标题、简介 | `pages/travel.md` |
| 每篇文章的标题、日期、摘要和正文 | `posts/` 内对应的 `.md` |
| 作品集标题、开场介绍与结尾 | `pages/work.md` |
| 大模型阅读工作的指引 | `pages/work.md` 的 `llmsGuide`，英文在 `en/pages/work.md` |
| 每个作品的介绍、职责、成果、配图 | `works/` 内对应的 `.md` |
| 汽水、Talkie、公众号案例页的开场、场景、工程决策与交互说明 | `case-studies/qishui/`、`case-studies/talkie/`、`case-studies/wechat/` 内的 `.md` |
| 地点名称、照片标题、说明、随笔、日期 | `travel.json` |
| 导航、按钮、搜索、空状态、地图和终端提示 | `interface.json` |
| 新增图片等附件 | `media/` |
| 英文导航、页面、作品和旅行文案 | `en/` 中的对应文件 |

`notion-import.json` 只记录原始目录信息，不是文章索引。现有 8 篇 Notion 笔记已经成为本地文件，后续以本目录为准，不会被 Notion 自动覆盖。

作品集的详细修改方式见 `works/README.md`。新增作品只需复制 `templates/work.md` 到 `works/` 并编辑，保存后自动进入网站。

汽水、Talkie 与公众号的交互案例文案另见 [case-studies/README.md](case-studies/README.md)。每个项目按 `overview.md`、`scenes.md`、`decisions.md`、`demo.md` 拆分，架构图文案在 `architecture.md`；Talkie 的对比图文案在 `results.md`，数据在中英文共用的 `metrics.json`。中文和英文文案独立编辑。

首页现在以 Hero 开场，下滑展示作品。Hero 文案在 `pages/home.md`，作品区介绍在 `pages/work.md`。顶部支持中文 / EN 切换；英文修改方式见 `en/README.md`。

首页姓名使用 `site.json` 的 `displayName`，英文姓名在 `en/site.json`。首屏的招呼语、姓名标点、专长和介绍分别在 `pages/home.md` 的 `greeting`、`heroName`、`heroSpecialty` 与正文中；交付标准在 `heroStandardLabel` 和 `heroStandard`，英文对应 `en/pages/home.md`。右侧使用编辑插画风格的敲代码人物，素材在 `media/home/coding-editorial.webp`，`pages/home.md` 的 `heroImage` 指定图片地址。图形说明及鼠标提示在 `interface.json` 的 `home.artCaption`、`home.artLabel` 和 `home.artHint`。

## 编辑时运行预览

在项目根目录双击 `preview.command`，或在终端运行：

```sh
python3 scripts/preview.py
```

打开终端显示的本地地址（默认 `http://127.0.0.1:4173/`，端口占用时顺延）。保持终端运行：保存、新增或删除文件后，网站自动重新生成，浏览器自动刷新。格式有误时，终端会指出文件，并暂时保留上次成功的页面；修正并保存即可恢复。

不要再用单纯的 `python3 -m http.server` 编辑预览，它不会索引内容修改。

## 新增文章

在 `posts/` 新建 `.md` 文件，支持子目录。文件名可以使用英文或中文，请避免空格。最简单的内容：

```md
# 我的新文章

从这里开始写正文。
```

保存后会自动进入博客列表、分类、全文搜索、首页最新文章和终端目录。文件名成为文章地址；文件名固定后，建议只修改标题。未填日期时，先使用文件名开头的 `YYYY-MM-DD`，否则使用文件修改日期。正式文章建议明确填写日期，避免后续编辑改变它。

可以复制 `templates/article.md` 到 `posts/`，改名并填写顶部字段：

```md
---
title: 我的新文章
date: 2026-10-19
tag: notes
excerpt: 一句话介绍这篇文章。
draft: false
---

## 第一个小标题

从这里开始写正文。支持 **加粗**、列表、表格、链接和代码块。
```

- `draft: true` 隐藏草稿；删除文章文件会从网站移除。
- `tag` 是分类；新分类可以直接填写文字。`investment`、`notes` 的显示名称可在 `interface.json` 的 `tags` 中修改。
- 可选 `slug: my-first-post` 固定文章地址，此后改文件名也不影响地址；slug 不要重复。
- `title` 不填时，使用正文第一个一级标题，再没有则使用文件名。
- 系列信息写在一行：`series: {"id":"my-series","name":"我的系列","order":1}`。同一 id 的文章会自动形成章节导航，order 从小到大排列。
- 普通 Markdown 的空行区分段落。已有 Notion 文章保留 `format: "notion"`，兼容原有表格和文本块。
- 文件头用两行 `---` 包住，每个字段单独一行；复杂值使用 JSON 写法。请保留字段名和括号。

## 图片与链接

把新图片放进 `media/`，例如 `media/lake.jpg`，文章里使用：

```md
![湖边的风景](../media/lake.jpg)
[另一篇文章](./另一篇文章.md)
[站内旅行页](#/travel)
```

路径相对于当前 Markdown 文件；文章在 `posts/子目录/` 时，图片路径为 `../../media/lake.jpg`。构建时自动复制附件并转换链接。只有 `media/` 里的新附件会复制到发布目录。

## 旅行记录

在 `travel.json` 中编辑记录的 `title`（标题）、`excerpt`（简述）、`alt`（图片说明）和 `body`（随笔段落）。`body` 写成 `["第一段。", "第二段。"]`。日期为 `YYYY-MM-DD`，不确定时保留 `null`；不确定的地点使用已有的 `unlocated`。

新增照片也放进 `media/`，在 `entries` 数组追加记录：`photo` 填 `media/新照片.jpg`，`thumb` 可省略；填写唯一的 `id`、现有地点 `place`、`date`、`title`、`excerpt`、`alt`、`body`、`width`、`height` 和 `ratio`（例如 `"3/4"`）。地点信息在同一文件的 `places` 和 `mapPlaces` 中，已有照片路径无需移动。

## JSON 与占位符

JSON 只改冒号右侧的值，保留双引号、逗号和括号；最后一项后不要留逗号。双引号写成 `\"`，文字换行写成 `\n`。

`{name}`、`{count}`、`{place}` 会自动替换为昵称、数量或地点。可以调整旁边的文字，请保留占位符。页面 Markdown 可以使用 `{name}`、`{handle}` 和 `{email}`；邮箱只需在 `site.json` 中修改，中英文关于页会同步更新。文章正文中的花括号按原文保留。

## 准备发布

在项目根目录执行 `python3 scripts/preview.py --build`（或 `node scripts/build-content.mjs`），然后将 `dist/` 部署到静态服务器。线上不需要 Node、Python、Notion 账号或数据库。生成的 `dist/` 无需手工修改。

构建也会自动更新供搜索工具和大模型读取的独立 HTML、Markdown、`llms.txt`、全文汇总和结构化目录。`llms.txt` 与 `llms-full.txt` 只聚焦职业简介、交付标准、作品和公开联系方式；简介来自首页与关于页的 `lead`，作品来自 `works/`，联系方式来自 `site.json`。文章和旅行仍有独立文字版，保留在综合目录中。具体地址见项目根目录 README 的「机器可读内容」。草稿、删除的文章及 `sources/` 归档不会进入这些公开文字版。

正式部署后，可在 `site.json` 中添加 `url` 字段，填写网站完整根地址，构建时会一并生成 sitemap 与 canonical。尚未部署时可以不填。
