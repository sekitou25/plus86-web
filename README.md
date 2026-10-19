# siyuan · 个人主页与博客

采用原生 HTML、CSS、JavaScript 的静态个人网站。**以后只编辑 `content/`**，详细操作见 [content/README.md](content/README.md)。

## 本地运行

macOS 双击 `preview.command`，或执行：

```sh
python3 scripts/preview.py
```

打开终端显示的地址（默认 `http://127.0.0.1:4173/`）。修改、新增和删除内容文件后，网站自动重新生成并刷新。格式错误时保留上次成功的版本，终端会显示出错文件。

预览需要 Node.js 20+；Python 启动器先使用 PATH 中的 Node，再尝试本机 Codex 自带运行时。无需 npm install。已安装 Node 的机器也可以直接运行 `node scripts/dev.mjs`，使用 `--port 4174` 指定端口。

## 内容结构

```text
content/
  README.md            编辑说明
  site.json            昵称、标语、社交账号、关注方向
  interface.json       导航、按钮、提示、无障碍文案
  pages/*.md           首页、作品集、关于、近况、博客和旅行页介绍
  posts/**/*.md        自动发现的文章，元信息与正文同处一份文件
  works/**/*.md        自动发现的作品，含职责、成果、正文与封面
  travel.json          地点、照片标题、说明与随笔
  media/               新增图片等附件
  templates/article.md 新文章模板，不会直接发表
  en/                  英文页面、作品、旅行与界面文案
  notion-import.json   原始 Notion 目录信息
```

原有 8 篇 Notion「投资和交易」笔记与 59 条旅行记录已迁入。文章无需登记 manifest；新增或删除文件会更新列表、分类、搜索、首页、数量和 CLI。Notion 内容是本地快照，后续以 content/ 为准，不自动同步。

## 构建与验证

```sh
python3 scripts/preview.py --build
# 或使用 Node
node scripts/build-content.mjs
node --test scripts/*.test.mjs
```

构建会生成 dist/assets/content.js、posts.js、travel-data.js 和 dist/index.html，复制 content/media/，刷新资源版本号及 SHA256SUMS.txt。生成文件应随部署提交，无需手工编辑。旧的 build-notion-posts.mjs 命令会转到统一构建。

src/ 保存页面和标志模板；dist/assets/app.js、travel.js、travel-atlas.js 负责交互；style.css 负责样式。只有修改功能或设计时才需要编辑这些文件。

## 部署

把构建后的 dist/ 作为 Web 服务器的静态目录即可。线上不需要构建服务、数据库、Notion 凭据或地图 API。.openai/hosting.json 是保留的历史 Sites 配置，本地构建不会触发部署。

原始照片保存在被 Git 忽略的 travel-materials/，不属于发布目录；网站使用已有照片及缩略图衍生文件。地图来源见 sources/TRAVEL-SOURCES.md。

首页为全屏 Hero 与作品集，采用顶部导航；作品随滚动逐项入场，并尊重减少动态效果的系统偏好。支持中文 / EN 切换、语言链接与选择记忆。英文文案在 content/en/；中文学习笔记保留原文，并在英文界面注明语言，支持逐篇添加英文 Markdown。

字体为本地托管的 Fraunces、Inter 和 IBM Plex Mono，许可证随字体保存在 dist/assets/fonts/。支持主题切换、ASCII 星球、博客全文搜索和章节导航、旅行地图、照片墙、日记视图及图片弹窗。CLI 是浏览器内的导航交互。
