# 02 · Turning Relative Value into Trading Signals

Language: en
Body language: zh
Date: 2026-10-16

[Interactive edition](/?lang=en#/blog/statarb-02-signals) · [HTML](/read/en/blog/statarb-02-signals.html)

This article is currently available in its original Chinese.

上一篇：[统计套利入门 01 策略靠什么赚钱](/read/en/blog/statarb-01-how-it-makes-money.html)

本篇基于当前可见上下文生成。沿用上一篇的例子，先把信号算清楚，再进入资金分配；所有演示数字均为假设。

## 这一篇要解决的问题

模型怎样判断一组股票的关系偏离了平常水平，又怎样把多组关系合并成对一只股票的判断？本篇用同一组数字解释 z-score、配对质量、depth、consistency，并对应 `build_signal_base()` 与后续信号处理代码。

## 正文

**1 先给相对关系找一个可计算的表达**

假设 A 每股 50 美元，B 每股 100 美元。为了教学，我们选择一个最简单的关系指标：A 的价格 ÷ B 的价格。这个指标等于 0.50。

现在假设，从当时可获得的历史数据估计，这个比值的平均水平为 0.50，标准差为 0.02。平均水平告诉我们过去关系的中心位置，标准差衡量这个关系围绕中心变化的幅度。这里的标准差针对价格比值，不是 A 或 B 的收益率波动。

如果今天 B 仍是 100 美元，A 跌到了 44 美元，比值就变成 0.44，比历史均值低了 0.06。

这个例子只用来解释数学。Notebook 从外部读取已经算好的 `zscore`，没有在本地展示原始价差怎样估计，因此不能据此断言原策略使用 A/B 比值、固定均值、固定标准差或某个确定的观察窗口。实际价差也可能使用对数价格、回归残差等表达。

**2 用 z-score 表示偏离了几把标准差的尺子**

z-score 的通用计算方式为：

```plain
z-score =（当前关系指标 − 历史均值）÷ 历史标准差
```

把上面的数字放进去：

```plain
z =（0.44 − 0.50）÷ 0.02 = −3
```

含义是：当前比值比历史平均水平低了 3 个标准差。标准差就像一把衡量历史变化幅度的尺子，z-score 表示当前离中心有几把尺子远。[NIST 对 z-score 的定义](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm)

在这个比值方向，以及本策略后续代码使用的方向约定下，可以这样理解：

<table><thead><tr><th scope="col">z-score</th><th scope="col">对 A 相对 B 的判断</th><th scope="col">均值回归模型倾向</th></tr></thead><tbody><tr><td>−3</td><td>A 明显偏低</td><td>买入 A 的方向</td></tr><tr><td>0</td><td>在估计的中心位置</td><td>这组关系没有方向性的偏离信号</td></tr><tr><td>+3</td><td>A 明显偏高</td><td>做空 A 的方向</td></tr></tbody></table>

代码最终还要经过汇总、筛选和仓位构建；上表没有直接给出订单。

标准化的作用是让不同关系具有可比较的尺度。同样偏离 0.06，如果某组关系平时的标准差是 0.02，得到 3；如果标准差是 0.10，只得到 0.6。相同的绝对变化，在平时稳定的关系里更显著。

z-score 描述偏离程度，不能直接给出未来涨幅、回归时间或盈利概率。z = −3 不能解释成将涨 3%，也不能据此认定有某个很高的盈利概率；更大的偏离也可能来自历史关系发生变化。

**3 把每组配对拆成两只股票各自的判断**

上面是 A/B 一组关系。实际策略同时观察很多组。

外部辅助函数 `process_raw_spreads()` 把同一条配对记录生成正反两条股票记录：交换两只股票，并把 z-score 取反。例如 A/B 的分数为 −2，则生成 A 的 −2 和 B 的 +2。这是对同一配对信号使用相反方向的记账方式。[辅助函数源代码](https://raw.githubusercontent.com/RWLab/rwlab-helpers/master/R/statarb_helpers.R)

<table><thead><tr><th scope="col">原来的配对信号</th><th scope="col">拆开后的股票信号</th></tr></thead><tbody><tr><td>A 相对 B 的 z = −2</td><td>A：−2，偏向买入；B：+2，偏向做空</td></tr></tbody></table>

等到把 A 的所有记录合并，策略就能回答：综合不同配对，A 到底处在什么位置？

**4 先筛选配对质量，再计算质量权重**

本地 `build_signal_base()` 一开始做：

```r
filter(combo_percentile >= quality_threshold)
```

Notebook 的 `QUALITY_THRESHOLD` 设置为 90，因此保留上游质量百分位不低于 90 的配对，通常可以理解为排名前约 10%。百分位衡量排名位置，不能理解为 90% 的胜率。

代码接下来对每一天单独计算：

```r
quality_weight = 1 - (combo_rank - 1) / max(combo_rank - 1)
```

假设当天经过筛选和展开后的全部数据中，最大 `combo_rank` 为 5。对应的权重为：

<table><thead><tr><th scope="col">当天配对排名 combo_rank</th><th scope="col">quality_weight</th></tr></thead><tbody><tr><td>1</td><td>1.00</td></tr><tr><td>2</td><td>0.75</td></tr><tr><td>3</td><td>0.50</td></tr><tr><td>4</td><td>0.25</td></tr><tr><td>5</td><td>0.00</td></tr></tbody></table>

这个 0 到 1 的数用来区分当天保留配对的质量。权重 0.75 也不能解释成 75% 的成功率。这里的最大排名取自当天全部保留数据，并不是只看 A 自己参与的配对。

**5 用 A 的四条记录算出六个字段**

假设 A 参与了下面四组配对，数据完整，每组恰好贡献一条 A 的记录。沿用上面的排名权重：

<table><thead><tr><th scope="col">配对</th><th scope="col">对 A 的 z-score</th><th scope="col">配对质量权重</th></tr></thead><tbody><tr><td>A/B</td><td>−2.0</td><td>1.00</td></tr><tr><td>A/C</td><td>−1.6</td><td>0.75</td></tr><tr><td>A/D</td><td>−1.2</td><td>0.50</td></tr><tr><td>A/E</td><td>+0.8</td><td>0.25</td></tr></tbody></table>

先计算 `depth`，即 A 当天有多少条贡献记录。这里等于 4，可以直观理解为 4 组配对参与判断。

再计算 `mean_zscore`，即平均偏离：

```plain
mean_zscore =（−2.0 − 1.6 − 1.2 + 0.8）÷ 4 = −1.0
```

前三条偏低，第四条偏高；平均以后，A 总体仍然偏低。

代码还计算 `weighted_zscore`，即按配对质量加权的平均偏离：

```plain
分子 = −2.0×1.00 − 1.6×0.75 − 1.2×0.50 + 0.8×0.25
     = −3.60

分母 = 1.00 + 0.75 + 0.50 + 0.25 = 2.50

weighted_zscore = −3.60 ÷ 2.50 = −1.44
```

这里高质量配对给出的偏低意见比较强，较低质量配对的反对意见影响较小，所以加权结果比简单平均更负。

`mean_quality` 是这些质量权重的平均值：

```plain
mean_quality =（1.00 + 0.75 + 0.50 + 0.25）÷ 4 = 0.625
```

它反映 A 所参与配对的平均排名权重，同样不表示盈利概率。

**6 consistency 衡量意见有多一致**

代码首先只看每条 z-score 的符号：负数记为 −1，正数记为 +1，零记为 0。

本例中为：

```plain
−1，−1，−1，+1
```

然后取平均，再取绝对值：

```plain
consistency = |（−1 − 1 − 1 + 1）÷ 4| = 0.5
```

可以用几种情况对照：

<table><thead><tr><th scope="col">四组配对的意见</th><th scope="col">consistency</th></tr></thead><tbody><tr><td>全部认为偏低</td><td>1.0</td></tr><tr><td>三组偏低，一组偏高</td><td>0.5</td></tr><tr><td>两组偏低，两组偏高</td><td>0.0</td></tr><tr><td>全部认为偏高</td><td>1.0</td></tr></tbody></table>

因此，consistency 只描述意见一致程度，不保留买卖方向。方向和幅度由 `mean_zscore` 等字段保留。它也没有按偏离大小或质量给投票加权。

例如，3 条很小的负分数加上 1 条很大的正分数，平均偏离仍可能为正。代码不能简单理解为少数服从多数。

把本例的六个字段放在一起：

<table><thead><tr><th scope="col">字段</th><th scope="col">结果</th><th scope="col">直白解释</th></tr></thead><tbody><tr><td>ticker</td><td>A</td><td>哪只股票</td></tr><tr><td>depth</td><td>4</td><td>有多少条记录参与</td></tr><tr><td>mean_zscore</td><td>−1.00</td><td>简单平均偏离</td></tr><tr><td>weighted_zscore</td><td>−1.44</td><td>质量加权的平均偏离</td></tr><tr><td>mean_quality</td><td>0.625</td><td>平均配对质量权重</td></tr><tr><td>consistency</td><td>0.50</td><td>方向一致程度</td></tr></tbody></table>

实际输出还带有 `date`，因为每天都要重新计算。同一只股票在不同日期可以得到完全不同的信号。

**7 后续代码怎样降低分歧较大信号的影响**

上述字段由 `build_signal_base()` 生成。接下来，`run_backtest()` 会根据深度和一致性计算一个信号调整系数：

```r
agreement_strength = tanh(sqrt(depth * consistency)) *
  exp(-0.5 * depth * pmax(0, 0.6 - consistency))

cw_smooth = mean_zscore * agreement_strength
```

先理解它的作用就够了：有较多支持且方向一致时，系数更接近 1；意见分歧大时，系数更低。在非负深度和 0 至 1 的一致性输入下，这个系数介于 0 和 1 之间，不会把原始平均偏离的绝对值放大。

第二项专门惩罚一致性低于 0.6 的情形。深度越大、低于 0.6 的程度越多，这项惩罚越明显。这是作者选择的规则形状，效果需要回测检验。

本例中：

```plain
depth = 4
consistency = 0.5
agreement_strength ≈ 0.72735

cw_smooth = −1.0 × 0.72735 ≈ −0.72735
```

可以读成：原来 A 的平均偏离为 −1，考虑意见分歧以后，把可用于后续权重构建的信号收弱到约 −0.727。

代码另有 `cw_step`：当 consistency < 0.5 时直接把相应信号设为 0；否则采用上述调整。在本例 consistency 恰好等于 0.5，不会触发这条清零规则。

**8 对应 R 代码时要区分计算了什么与使用了什么**

这段 R 代码可以先按表格处理来理解。`%>%` 表示把前一步的结果交给下一步，`filter()` 筛选行，`group_by(date, ticker)` 把同一天、同一只股票的记录归到一起。

在数据完整的假设下，下面是核心统计的易读表达，帮助理解计算含义；原 notebook 用分组编号和 `rowsum()` 加速执行：

```r
df %>%
  group_by(date, ticker) %>%
  summarise(
    depth = n(),
    mean_zscore = mean(zscore, na.rm = TRUE),
    weighted_zscore = weighted.mean(zscore, quality_weight, na.rm = TRUE),
    mean_quality = mean(quality_weight, na.rm = TRUE),
    consistency = abs(mean(sign(zscore), na.rm = TRUE)),
    .groups = "drop"
  )
```

其中，`n()` 数记录条数，`mean()` 求平均，`weighted.mean()` 求加权平均，`sign()` 取正负方向，`abs()` 取绝对值。`na.rm = TRUE` 表示计算时排除相应的缺失观测。

原实现的 `depth = tabulate(gid)` 统计的是行数，没有对配对去重，也没有排除 z-score 缺失行；其他几个平均计算对缺失值另作处理。因此，“depth 等于有多少组有效配对”依赖于输入数据满足唯一性和完整性条件。上面的数字例子满足这些条件。

还有一个需要认清的实现细节：`weighted_zscore` 虽然被计算出来，当前 notebook 的各个仓位方案都没有直接使用它。常用的 `cons_quality` 路径实际是：

```plain
mean_zscore
    ↓ 乘以 agreement_strength
cw_smooth
    ↓ 乘以 mean_quality
后续用于仓位分配的分数
```

`cons_step_quality` 则使用 `cw_step`。把“质量先加权到每条 z-score”与“先平均 z-score，最后再乘平均质量”混在一起，会读错这份代码。下一篇再把最终分数转换为资金仓位。

**9 本篇几个数字能说明的范围**

- z-score 衡量相对于估计历史关系的偏离程度，不能直接提供涨幅、回归期限或盈利概率。

- 配对质量百分位和质量权重描述排名，不是胜率。

- consistency 描述方向一致性，不是判断正确的概率。

- depth 较高代表参与记录较多，这些记录仍可能高度相关。

- `mean_zscore` 是多个配对 z-score 的平均值，没有对这个平均值重新做一次标准化；不能直接给它套用单个正态变量的概率解释。

## 小结

- 先给股票间的相对关系建立可计算的表达，再用标准差衡量偏离距离。

- 每条配对同时形成两只股票方向相反的信号，多条信号按股票和日期汇总。

- depth、平均偏离、质量和一致性描述不同事情，需要分别理解。

- 后续代码根据深度与一致性收弱分歧信号，再结合质量构建仓位。

- 这些数字描述模型信号，能否带来收益还要检验未来相对表现和交易成本。

## 下一篇预告

把信号变成资金：怎样选出候选股票，为什么目标权重有正有负，10 万美元怎样分配到多头和空头，以及总敞口、净敞口和杠杆分别意味着什么。

---

## 学习反馈

你可以写：

1. 哪里看懂了？

2. 哪里没看懂？

3. 哪个地方想展开？

4. 这个主题和你的真实问题有什么关系？

请写在这行下面：

[Original on Notion ↗](https://app.notion.com/p/3fb6dacbbc7e816aa025f8594a8504ab)
