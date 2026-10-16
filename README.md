# siyuan · 个人主页与博客

参考终端风格设计的轻量个人站点。采用原生 HTML、CSS、JavaScript，无构建依赖。

## 修改内容

- `dist/assets/content.js`：站点昵称、描述、博客文章与正文。
- `dist/assets/app.js`：自我介绍、近况、外链、页面与 CLI 行为。
- `dist/assets/style.css`：配色、排版、响应式样式。

博客文章暂为演示内容，旅行相册使用用户提供的真实照片。站点无管理后台；编辑源码即可更新。CLI 为网站内的导航交互，不会执行系统命令。

## 本地预览

```sh
python3 -m http.server 4173 --directory dist --bind 127.0.0.1
```

打开 http://127.0.0.1:4173 。

## 功能

主页原创 ASCII 星球动画；明暗主题记忆；博客分类和搜索；文章阅读进度；关于与近况页面；CLI 导航（help / ls / cd / cat / open / pwd / history / clear / theme / exit），支持 Tab 补全和命令历史。

站点由 Sites 私有托管，部署配置在 `.openai/hosting.json`。

## 旅行与随笔

入口 `#/travel`。交互世界地图、地点与年份筛选、关键词搜索、照片墙与日记时间线、大图与随笔弹窗，支持 Escape 关闭、左右方向键切换。

- `dist/assets/travel-data.js`：地点经纬度、照片、日期、标题、随笔和摄影来源。
- `dist/assets/travel.js`：旅行页交互。
- `dist/assets/travel-atlas.js`：本地交互地图；点击国家展开目的地，点击目的地缩放并筛选照片；支持面包屑返回、拖动、双指缩放和缩放按钮。
- `dist/assets/travel-atlas-data.js`：随网站部署的地理轮廓；城市与区域使用近似中心点，不调用地图服务商。
- `dist/assets/travel/`：本地照片与世界地图。
- `sources/TRAVEL-SOURCES.md`：素材来源。

目前为展示页，新增记录通过更新源码完成。原片放在 `travel-materials/01-inbox`，整理清单保存在 `travel-materials/03-organized`；原片目录不进入 Git 或部署包。当前旅行相册有 59 张照片，涵盖 2026 年 5—10 月的意大利、西班牙、中国与越南。照片墙和随笔按拍摄日期从新到旧排列，未记录日期的照片排在末尾并可单独筛选；未确认地点的照片归入「地点待补」，地图不生成推测位置。

## about 社交账号

在 `dist/assets/content.js` 的 `SITE.socials` 中填写 Instagram、Threads、X 的 username 与 url；微信填写 username，页面支持复制微信号。账号尚未填写时显示「待填写」，不生成虚假跳转。

## 标志

`dist/assets/daisy.svg` 为透明背景的雏菊标志；`dist/assets/siyuan-logo.svg` 为水平字标；`dist/assets/favicon.svg` 为浏览器图标。页头使用内嵌 SVG，并适配明暗主题。
