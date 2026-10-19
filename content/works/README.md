# 作品集内容

每个作品对应一份 Markdown，元信息在顶部 `---` 之间，详情在正文。网站会自动扫描本目录及子目录；不用修改代码或登记索引。本说明不会发表。

当前顺序由 `order` 决定：汽水音乐播放器、Talkie / 星野、微信 · 公众号、plumber。前三项根据提供的简历整理，plumber 根据项目说明整理；没有把完整简历、个人联系方式、账户或交易记录放进网站。

## 修改作品

- `title`：名称；`headline`：一句话介绍；`summary`：总览卡片简介。
- `company`、`role`、`period`：项目 / 团队、你的角色、对应阶段。修改时填写当时的真实信息。
- `focus`：卡片上的工作重点；`tags`：详情页技术方向；均使用文字数组。
- `highlights`：详情页的重点结果，格式为 `[{"value":"结果","label":"含义"}]`，没有可公开的结果时用 `[]`。
- `slug`：作品地址，保持固定并避免重复；`order`：排序数字，从小到大。
- 正文使用 Markdown，二级标题会自动生成项目目录。外链和图片同文章写法。
- `draft: true` 可以隐藏作品；删除文件会从总览、首页入口和详情页中移除。

新增作品：复制 `../templates/work.md` 到本目录，改名、修改 slug 和内容后保存即可。最简单的文件也可以只有 `# 标题` 和正文；建议使用模板填写完整信息。

## 替换示意图

当前四张配图是工程 / 布局示意，不是真实产品截图。

把可公开的截图放到 `content/media/`，例如 `media/works/qishui.jpg`，然后填写：

```text
cover: ../media/works/qishui.jpg
coverAlt: 汽水音乐播放器的实际界面
coverCaption: 截图对应的版本或场景
```

保存后，总览与详情页都会自动使用该图片。清空 `cover` 会恢复示意图。可以编辑 `visual` 这一行 JSON 中的配图文字；`type` 请保留为 `music`、`conversation`、`reading`、`agent` 或 `generic`。

作品集总标题、开场介绍和结尾在 `../pages/work.md`；导航、按钮等公共提示在 `../interface.json` 的 `work` 中。
