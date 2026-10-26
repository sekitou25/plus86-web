# 作品集案例页文案

日常改文案只需编辑这里的 Markdown，保存后预览会自动重建。素材与交互代码分别维护，修改文字不需要改 JavaScript 或 JSON。

| 想改什么 | 汽水 | Talkie / 星野 | 微信 · 公众号 |
| --- | --- | --- | --- |
| 详情页主标题、开场介绍、封面文字、成果与素材说明 | [overview.md](qishui/overview.md) | [overview.md](talkie/overview.md) | [overview.md](wechat/overview.md) |
| 场景名称、截图说明、体验观察 | [scenes.md](qishui/scenes.md) | [scenes.md](talkie/scenes.md) | [scenes.md](wechat/scenes.md) |
| 体验目标、工程实现、方案取舍 | [decisions.md](qishui/decisions.md) | [decisions.md](talkie/decisions.md) | [decisions.md](wechat/decisions.md) |
| 技术链路演示的标题、按钮、状态与步骤解释 | [demo.md](qishui/demo.md) | [demo.md](talkie/demo.md) | [demo.md](wechat/demo.md) |
| 分层架构图的标题、层级与节点说明 | [architecture.md](qishui/architecture.md) | [architecture.md](talkie/architecture.md) | [architecture.md](wechat/architecture.md) |
| 优化对比图的标题、单位和解释 | — | [results.md](talkie/results.md) | — |
| 优化对比图的原始数值与坐标 | — | [metrics.json](talkie/metrics.json) | — |

中文在本目录，英文在 `../en/case-studies/` 下相同目录、相同文件名中。改中文不会覆盖英文。

## 其他 work 文案在哪里

- 首页 Hero：`../pages/home.md`。
- 作品集开场与结尾：`../pages/work.md`。
- 汽水的名称、公司、职责、时间、技术栈、成果数字、总览卡片简介与完整工程记录：[01-qishui.md](../works/01-qishui.md)。
- Talkie 的同类内容：[02-talkie-xingye.md](../works/02-talkie-xingye.md)。
- 微信的名称、公司、职责、时间、技术栈、总览简介与完整记录：[03-wechat.md](../works/03-wechat.md)；详情页五份文案见上表。
- Visual Agent 的介绍在 `../works/04-visual-agent.md`，完整案例文案在 `visual-agent/`；英文在 `../en/case-studies/visual-agent/`。`evidence.md` 编辑历史回归的解释，`evidence.json` 保存中英文共用的原始数据。`demo.md` 的 `verdicts` 和 `completions` 对应两种断言的演示结果。
- 通用按钮和小标题（例如「播放录屏」「体验目标」「工程实现」）：`../interface.json` 中的 `work` 与 `caseStudy`；英文在 `../en/interface.json`。

## overview.md：开场与封面

顶部两行 `---` 之间是短字段，下面的正文是详情页开场介绍。

| 字段 | 页面位置 |
| --- | --- |
| `eyebrow` | 小号英文眉题 |
| `title` | 详情页主标题；`\n` 表示换行 |
| `preview` | 总览封面的主说明 |
| `previewDetail` | 总览封面的补充说明 |
| `outcomeNote` | 成果数字下方的说明 |
| `mediaNote` | 页尾的素材版本与工作范围说明 |

文字继续使用双引号包裹；文字里若包含双引号，写成 `\"`。正文直接改写，不用引号。

## scenes.md：每组素材的说明

每个 `##` 标题对应一段录屏或一张截图，例如：

```md
## playback | 播放与歌词

### 场景说明

歌曲封面、歌词、进度与播放状态共同构成一屏体验。

### 图片说明

播放器画面的替代文字，供屏幕阅读器使用。

### 观察标签

体验观察

### 体验观察

这里写你希望访问者从这个场景里理解的产品判断。
```

可以修改 `|` 后面的标题与每个小标题下的文字。`|` 前面的素材 id（例如 `playback`）用于关联录屏，请保留。构建会按 id 对齐素材，因此调换段落顺序不会配错图片。

每个场景保留以上四个 `###` 小标题及其顺序。`观察标签` 与 `体验观察` 分别对应左侧说明的小标签和正文。

## decisions.md：案例分析

文件头的 `title`、`lead` 是案例分析区的总标题和导语。每个 `##` 是一项决策的标题，可直接改写；其下依次保留 `### 体验目标`、`### 工程实现`、`### 方案取舍`，修改下面的段落即可。

需要增加一项决策时，复制一个完整的 `##` 段落及其三个小标题。页面会自动显示，不用改索引。

## demo.md：交互讲解

文件头保存演示区标题、导语、按钮和状态文字：

| 字段 | 含义 |
| --- | --- |
| `title`、`lead` | 演示区标题与导语 |
| `modes` | 两个场景按钮，保留两个文字值 |
| `start`、`running`、`resume` | 开始、进行中、恢复按钮 |
| `idle`、`complete`、`stalled` | 未开始、完成、中断时的状态说明 |
| `sample` | 演示画面的小标签 |
| `output`、`outputRunning`、`outputComplete` | 演示画面在三个状态下的说明 |
| `footnote` | 演示区下方的补充说明 |

正文四个 `##` 标题是四个技术步骤。每步包含 `### 默认场景` 与 `### 对比场景`，可以修改标题文字和说明段落，保留四步、两种说明的结构与顺序。

汽水的默认／对比场景对应「未预加载／已预加载」，Talkie 对应「稳定连接／模拟断线」。这里只改讲解文案；调整演示行为或步骤数量时，再修改相应代码。

公众号对应「保留原列表／示意点击刷新」。其 `demo.md` 还包含四张示意卡片的 `cards`（每张保留 `title`、`category`）、刷新后替换卡片的 `replacement`，以及 `feedLabel`、`selectedLabel`、`updatedLabel`、`retainedLabel` 四个界面标签。文字均可直接修改；保留四张卡片与两种模式。演示不复现微信的线上推荐规则。

## architecture.md：架构职责图

`title`、`lead` 是架构区标题与导语，`note` 是图下说明，`selectionLabel` 是节点详情标签；`defaultNode` 指定默认选中的节点 id。

正文 `## 层级id | 层级名称` 定义一层，下面的 `### 节点id | 节点名称` 定义节点，节点下的正文就是点击后显示的说明。可以修改 `|` 后的名称与正文，增加层级或节点；id 保持唯一。`defaultNode` 必须对应一个已有节点。

架构图表达履历中的职责与协作，不直接描述完整生产系统的所有调用关系。

## results.md 与 metrics.json：优化对比图

Talkie 的 `results.md` 保存标题、导语、图例、单位说明，以及每项指标的解释；其 `data` 字段指向数值文件。`## 指标id | 指标名称` 与数据中的 `id` 对应。

`metrics.json` 是中英文共用的唯一数值来源：`before`、`after` 为优化前后值，`axisMax` 为坐标上限，`unit` 使用 `fps`、`percent` 或 `index`，`direction` 使用 `up`（越高越好）或 `down`（越低越好）。

FPS、SLA 使用原始数值。内存、弱网首包只有相对降幅，因此用 `index` 并固定 `before: 100`；例如降低 22% 对应 `after: 78`，不要把这个数值标为实际 MB 或毫秒。百分比坐标上限不超过 100。

## 保存与预览

在项目根目录运行 `python3 scripts/preview.py`，或双击 `preview.command`。保持预览运行，保存后即可看到变化。文件结构不完整时，终端会指出文件，并保留上次成功的页面。

这些案例文件使用 Markdown 标题组织内容，展示文字按纯文本输出；完整工程记录中的加粗、链接、列表等排版继续在 `content/works/*.md` 内编辑。不要把本目录文件复制到 `content/works/`，避免被识别为新增作品。
