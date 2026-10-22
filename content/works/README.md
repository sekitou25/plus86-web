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

汽水、Talkie 与公众号已使用真实录屏、截图生成的产品封面；plumber 仍使用工程示意。

把可公开的截图放到 `content/media/`，例如 `media/works/qishui.jpg`，然后填写：

```text
cover: ../media/works/qishui.jpg
coverAlt: 汽水音乐播放器的实际界面
coverCaption: 截图对应的版本或场景
```

保存后，总览与详情页都会自动使用该图片。清空 `cover` 会恢复示意图。可以编辑 `visual` 这一行 JSON 中的配图文字；`type` 请保留为 `music`、`conversation`、`reading`、`agent` 或 `generic`。

作品集总标题、开场介绍和结尾在 `../pages/work.md`；导航、按钮等公共提示在 `../interface.json` 的 `work` 中。

## 汽水、Talkie 与公众号交互案例页

这三个作品的文件头使用 `caseStudy` 指向各自目录中的 `case-study.json`。配置内 `media` 登记视频、封面与截图，`copy.zh` / `copy.en` 仅指定文案目录。日常改文案不用编辑该 JSON。

中文文案已拆到 `../case-studies/qishui/`、`../case-studies/talkie/` 与 `../case-studies/wechat/`，英文放在 `../en/case-studies/` 中的对应目录。每个项目有 `overview.md`（开场与封面）、`scenes.md`（产品场景）、`decisions.md`（工程决策）、`demo.md`（交互说明）四份文件，编辑方式见 [案例文案说明](../case-studies/README.md)。保存后自动构建与刷新。

新增架构图的层级、节点名称与说明在各自的 `architecture.md`；Talkie 优化对比图的文案在 `results.md`，原始数值在中文目录中的 `metrics.json`，中英文共用这一份数据。

项目名称、公司、职责、时间、技术栈、成果数字与完整工程记录，仍在本目录的 `01-qishui.md`、`02-talkie-xingye.md`、`03-wechat.md` 中；作品集总标题在 `../pages/work.md`，通用按钮与标签在 `../interface.json` 的 `work`、`caseStudy` 中。

- 原始素材保留在本目录下的 `qishui/`、`talkie/` 与 `wechat/`，不会复制到网站发布目录。
- 网页使用的衍生素材位于 `../media/works/`；视频为静音 H.264，截图与封面为 JPEG。
- 在 macOS 项目根目录运行 `swift -suppress-warnings scripts/prepare-work-media.swift` 可以重新生成缺失的网页录屏与封面；加 `--rebuild` 重建已生成的视频。原始文件名在脚本中登记。
- 只处理公众号素材时运行 `swift -suppress-warnings scripts/prepare-work-media.swift --project wechat --stills`，会生成网页录屏、封面与两张场景截帧；原视频 `wechat/reading-original.mp4` 保持不变。
- 页面里的录屏属于 2026 年当前版本。案例保留工作经历的具体阶段与负责范围，不把产品的全部功能归为个人贡献。
- 技术链路演示是讲解模型，不调用真实服务，不作为性能测量。

展示与交互逻辑在 `dist/assets/case-study.js`，样式在 `dist/assets/case-study.css`。三页与作品总览共用同一组素材，不需要分别维护封面；主页保留背景色块，详情页视频没有外层色块。
