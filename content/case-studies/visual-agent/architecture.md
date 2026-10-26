---
kicker: "SYSTEM DESIGN / TWO CONNECTED LOOPS"
title: "知识定义预期，设备生成证据"
lead: "从业务资料到正式知识，再到绑定版本的执行任务。点击节点，查看每层的职责与实现。"
selectionLabel: "模块与实现"
defaultNode: "release"
diagramLabel: "Visual Agent 的资料准备、知识发布、设备执行与证据判定链路"
note: "按报告中的已实现主流程整理。执行阶段模型、自主规划、Android Worker 与统一 Fixture Runtime 尚未接入。"
---

## preparation | 资料准备

### sources | Git / 文档来源

固定 Source Commit，或将上传资料标准化为带行号文本，冻结可追溯的输入。

### candidates | 候选与人审

外部 Agent 或千问提交带 SourceRef 的结构化候选，审核人接受、编辑、合并、拒绝或暂缓。

## knowledge | 知识发布

### compile | 规则关系与检索

业务规则、页面、目标、断言与 Case 通过明确引用关联；Pydantic 校验结构，SQLite FTS5 与别名用于检索。

### release | 不可变知识版本

统一编译冻结知识、Case 和场景；内容摘要生成版本 ID，Manifest 与哈希校验保证任务消费同一份依据。

## execution | 设备任务

### task | 版本绑定与任务快照

创建任务时选择模块与 Case，保存指定知识版本、逐 Case 依赖和执行场景，然后异步顺序执行。

### driver | iOS Worker

DeviceDriver 隔离设备能力。Appium XCUITest / WDA 执行动作与截图，simctl 管理 App 与录屏。

## verification | 独立验证

### verdict | 视觉规则与结论

重新观察黑屏、区域变化、运动或颜色稳定性；区分通过、失败、无法判定、基础设施错误与未执行。

### artifacts | 报告与证据

保存逐 Case 的动作、理由、测量值、截图和独立录屏，通过 Web、CLI 与 MCP 查询任务与结果。
