# 更新日志

## [v2.1.0](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v2.0.0...v2.1.0) (2026-03-27)

### &nbsp;&nbsp;&nbsp;🚨 重大变更

- **projects**: integrate oxlint and oxfmt &nbsp;-&nbsp; by **soybeanfe** [<samp>(6ff74)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6ff74c0c)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **components**:
  - 列设置新增滚动条处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(6696d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6696da52)
  - 因包体积过大，使用 wangeditor-next 替换 umodoc &nbsp;-&nbsp; by @m-xlsea [<samp>(c47dd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/c47dd291)
  - Column settings support fixed columns. &nbsp;-&nbsp; by @m-xlsea [<samp>(70658)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/70658643)
  - Add “Select All” to TableColumnSetting &nbsp;-&nbsp; by @wenyuanw [<samp>(0081b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/0081b9c0)
- **docs**:
  - 新增 GitCode star 徽章 &nbsp;-&nbsp; by @m-xlsea [<samp>(5310d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5310d352)
- **logo**:
  - use new logo &nbsp;-&nbsp; by @soybeanjs [<samp>(5aac5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5aac540a)
- **projects**:
  - 客户端管理新增状态修改开关 &nbsp;-&nbsp; by @m-xlsea [<samp>(ea6a9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ea6a92cd)
  - Iframe 类型菜单传参更改 &nbsp;-&nbsp; by @m-xlsea [<samp>(bf3d5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bf3d5cb3)
  - 新增同步租户参数配置功能 &nbsp;-&nbsp; by @m-xlsea [<samp>(901a6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/901a65ad)
  - add the plugin: vite-plugin-vue-transition-root-validator, to optimize the development experience. &nbsp;-&nbsp; by **Azir-11** [<samp>(30e3c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/30e3cdc7)
  - 适配新图片验证码样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(1472c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/1472cc92)
  - 新增字典类型时默认选择该类型 &nbsp;-&nbsp; by @m-xlsea [<samp>(2f9cd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2f9cdfc5)
- **types**:
  - Added type definition `force` to router push options. &nbsp;-&nbsp; by @m-xlsea [<samp>(a3794)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a37949f2)
- **workflows**:
  - add opencode workflow for issue and PR comment triggers &nbsp;-&nbsp; by @soybeanjs [<samp>(dacee)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dacee143)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **components**:
  - 修复合并时 logo 被替换问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(9954f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9954f0e3)
  - 修复列设置的滚动条颜色不随主题切换问题 &nbsp;-&nbsp; by **AN** [<samp>(9b4dd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9b4dd764)
  - correction of wrong label bar configuration explanation. &nbsp;-&nbsp; by **Azir-11** [<samp>(6887b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6887b016)
- **projects**:
  - 修复代码生成模板未判断树类型问题 &nbsp;-&nbsp; by **AN** [<samp>(ae440)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ae440204)
  - 修复保存表单时提示错误问题 &nbsp;-&nbsp; by **AN** [<samp>(dbbcf)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dbbcf186)
  - 修复菜单管理左侧树过滤问题 &nbsp;-&nbsp; by **AN** [<samp>(0ef9f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/0ef9f601)
  - fix the long list TableColumnSetting component exceeds the viewport. &nbsp;-&nbsp; by **skyfeiz** [<samp>(cbfb9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/cbfb932f)
  - fix NButton props conflicts. &nbsp;-&nbsp; by **skyfeiz** [<samp>(54107)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/54107aca)
  - 修复表单校验提示重复问题 &nbsp;-&nbsp; by **AN** [<samp>(12c73)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/12c73bd8)
  - ensure HTML lang attribute is updated when setting locale &nbsp;-&nbsp; by @pan0xc [<samp>(f96c3)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f96c3c9e)
  - correct HTML lang attribute to standard format &nbsp;-&nbsp; by @pan0xc [<samp>(b520d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b520db3e)
  - resolve width abnormal issue of NColorPicker. &nbsp;-&nbsp; by **Azir-11** [<samp>(75ccd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/75ccd008)
  - fix wrong new tab opening for external link navigation. &nbsp;-&nbsp; by **Azir-11** [<samp>(af1b5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/af1b5f1d)
- **router**:
  - simplify route guard logic and remove unnecessary next calls &nbsp;-&nbsp; by **soybeanfe** [<samp>(3c2cb)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3c2cbb74)
- **utils**:
  - 忽略请求取消错误提示 &nbsp;-&nbsp; by @m-xlsea [<samp>(88c61)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/88c614e8)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**:
  - 修复菜单代码质量问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(6f349)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6f34956e)
  - modify the injection location of the token. &nbsp;-&nbsp; by **Azir-11** [<samp>(9d48c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9d48ca5f)
  - optimize unocss config &nbsp;-&nbsp; by **soybeanfe** [<samp>(6fc6f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6fc6f1c9)
  - optimize oxlint config &nbsp;-&nbsp; by @m-xlsea [<samp>(7cdcf)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7cdcfb59)

### &nbsp;&nbsp;&nbsp;💅 重构

- **projects**: 优化调整保存更新成功提示代码 &nbsp;-&nbsp; by **AN** [<samp>(7a6ee)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7a6ee7a1)

### &nbsp;&nbsp;&nbsp;📖 文档

- **other**:
  - 修复 IFrame 类型菜单无法使用问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(87e3c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/87e3c06a)
  - 新增 QQ 交流群说明 &nbsp;-&nbsp; by @m-xlsea [<samp>(b5551)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b5551355)
  - 新增 Vibe Coding Claude Code 配置 &nbsp;-&nbsp; by @m-xlsea [<samp>(da015)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/da01523e)
  - 更新 Vibe Coding 配置 &nbsp;-&nbsp; by @m-xlsea [<samp>(340e6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/340e6daf)
- **projects**:
  - V2 has been released. &nbsp;-&nbsp; by **skyfeiz** [<samp>(d7394)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/d73947a5)

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(232e1)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/232e1ac4)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(2a023)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2a0231da)
  - update deps &nbsp;-&nbsp; by **soybeanfe** [<samp>(b867c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b867c290)
- **merge**:
  - Merge Soybean branch 'dev' &nbsp;-&nbsp; by @m-xlsea [<samp>(dfe77)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dfe77ade)
  - Merge Soybean v2.1.0 &nbsp;-&nbsp; by @m-xlsea [<samp>(3c977)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3c9770a1)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **projects**:
  - 优化注释规范 &nbsp;-&nbsp; by @m-xlsea [<samp>(4139a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4139a729)
  - fix lint code and format code &nbsp;-&nbsp; by **soybeanfe** [<samp>(781a1)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/781a18f4)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![pan0xc](https://github.com/pan0xc.png?size=48)](https://github.com/pan0xc)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![wenyuanw](https://github.com/wenyuanw.png?size=48)](https://github.com/wenyuanw)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;&nbsp;[soybeanfe](mailto:honghuangdc@gmail.com),&nbsp;[skyfeiz](mailto:webzhangfei@163.com),&nbsp;

## [v2.0.0](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.2.1...v2.0.0) (2025-12-25)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **components**:
  - 列设置新增滚动条处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(6696d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6696da52)
  - 优化文件上传组件提示内容 &nbsp;-&nbsp; by @m-xlsea [<samp>(7bd11)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7bd115bf)
  - 新增预设主题支持 &nbsp;-&nbsp; by @m-xlsea [<samp>(c1063)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/c1063e3e)
- **docs**:
  - 新增 GitCode star 徽章 &nbsp;-&nbsp; by @m-xlsea [<samp>(5310d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5310d352)
- **hooks**:
  - 优化表格响应数据处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(7d7f2)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7d7f28c4)
  - 完成表格 Hooks 改造 &nbsp;-&nbsp; by @m-xlsea [<samp>(46996)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4699654f)
  - 优化树形表格 hooks 封装 &nbsp;-&nbsp; by @m-xlsea [<samp>(ccbb7)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ccbb72c0)
- **project**:
  - 优化业务代码语法格式 &nbsp;-&nbsp; by @m-xlsea [<samp>(7f04b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7f04b119)
- **projects**:
  - 项目适配 Soybean 2.0 &nbsp;-&nbsp; by @m-xlsea
  - 客户端管理新增状态修改开关 &nbsp;-&nbsp; by @m-xlsea [<samp>(ea6a9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ea6a92cd)
  - Iframe 类型菜单传参更改 &nbsp;-&nbsp; by @m-xlsea [<samp>(bf3d5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bf3d5cb3)
  - 新增同步租户参数配置功能 &nbsp;-&nbsp; by @m-xlsea [<samp>(901a6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/901a65ad)
  - 新增关于页面 &nbsp;-&nbsp; by @m-xlsea [<samp>(7d851)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7d85127c)
  - 菜单新增布局选择支持 &nbsp;-&nbsp; by @m-xlsea [<samp>(13de6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/13de6fbb)
  - 优化控制台输出和 sql 导入文件 &nbsp;-&nbsp; by @m-xlsea [<samp>(bfb71)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bfb7169e)
  - 登录记住密码加密保存 &nbsp;-&nbsp; by @m-xlsea [<samp>(90c52)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/90c52d97)
  - 使用 highlight.js 替换 monaco-editor &nbsp;-&nbsp; by @m-xlsea [<samp>(7dd7a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7dd7a936)
  - 演示页面新增字段排序 demo &nbsp;-&nbsp; by @m-xlsea [<samp>(41c25)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/41c25dcd)
  - support pinning and unpinning of tabs &nbsp;-&nbsp; by @PChening [<samp>(b8a76)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b8a767d7)
  - hybrid layout mode auto select first deepest child menu &nbsp;-&nbsp; by @paynezhuang [<samp>(94019)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9401925f)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **hooks**:
  - 修复 useTable 获取字段列表问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(0f83c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/0f83cf5f)
  - update pagination pageSize after data fetch. &nbsp;-&nbsp; by **Azir-11** [<samp>(64226)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/64226d9b)
- **projects**:
  - 修复表单校验问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(62fb9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/62fb9d90)
  - 修复登录页面 logo 颜色问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(27cae)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/27cae756)
  - 修复路由 name 与 path 不一致激活菜单异常问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(789a6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/789a6bb9)
  - fix the incorrect judgment of home by pin tab. &nbsp;-&nbsp; by **Azir-11** [<samp>(62a43)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/62a43c39)
- **project**:
  - 修复导出时查询参数错误问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(52ad9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/52ad93b2)
- **table**:
  - 修复分页数据处理逻辑 &nbsp;-&nbsp; by @imtzc [<samp>(a59fd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a59fdc58)
- **template**:
  - 调整搜索模块的属性定义位置 &nbsp;-&nbsp; by @imtzc [<samp>(bb039)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bb039eff)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**:
  - 修复菜单代码质量问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(6f349)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6f34956e)
  - 优化注释规范 &nbsp;-&nbsp; by @m-xlsea [<samp>(4139a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4139a729)
- **styles**:
  - 优化属性表格展开列样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(e40c3)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e40c37a0)

### &nbsp;&nbsp;&nbsp;📖 文档

- **other**:
  - 优化 sql 插入语句 &nbsp;-&nbsp; by @m-xlsea [<samp>(f7d8d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f7d8d189)
  - 优化工作流相关菜单 &nbsp;-&nbsp; by @m-xlsea [<samp>(33155)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3315552d)
  - 移除 cursor 文件夹 &nbsp;-&nbsp; by @m-xlsea [<samp>(5f950)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5f950b46)
  - 修复模板处理工具类内容错误 &nbsp;-&nbsp; by @m-xlsea [<samp>(f6dcd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f6dcded8)
- **projects**:
  - 更新 cursor 规则 &nbsp;-&nbsp; by @m-xlsea [<samp>(e63fe)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e63fee59)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(ec9f9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ec9f9af9)
  - update umo-editor deps &nbsp;-&nbsp; by @m-xlsea [<samp>(39f8d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/39f8d13b)
- **styles**:
  - format code &nbsp;-&nbsp; by @soybeanjs [<samp>(098cd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/098cd50e)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![imtzc](https://github.com/imtzc.png?size=48)](https://github.com/imtzc)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;[![PChening](https://github.com/PChening.png?size=48)](https://github.com/PChening)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![wenyuanw](https://github.com/wenyuanw.png?size=48)](https://github.com/wenyuanw)&nbsp;&nbsp;[![CyberShen](https://github.com/CyberShen.png?size=48)](https://github.com/CyberShen)&nbsp;&nbsp;[![Lruihao](https://github.com/Lruihao.png?size=48)](https://github.com/Lruihao)&nbsp;&nbsp;
[刘璐](mailto:hi.alue@qq.com),&nbsp;[CyberShen123](mailto:s.lijun@qq.com),&nbsp;[whyang](mailto:whyang9701@gmail.com),&nbsp;[HongxuanG](mailto:1359774872@qq.com),&nbsp;[NicholasLD](mailto:878639947@qq.com),&nbsp;

## [v2.0.0-beta.2](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2025-12-17)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **components**:
  - 列设置新增滚动条处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(6696d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6696da52)
- **docs**:
  - 新增 GitCode star 徽章 &nbsp;-&nbsp; by @m-xlsea [<samp>(5310d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5310d352)
- **hooks**:
  - 优化表格响应数据处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(7d7f2)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7d7f28c4)
- **project**:
  - 优化业务代码语法格式 &nbsp;-&nbsp; by @m-xlsea [<samp>(7f04b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7f04b119)
- **projects**:
  - 客户端管理新增状态修改开关 &nbsp;-&nbsp; by @m-xlsea [<samp>(ea6a9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ea6a92cd)
  - Iframe 类型菜单传参更改 &nbsp;-&nbsp; by @m-xlsea [<samp>(bf3d5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bf3d5cb3)
  - 新增同步租户参数配置功能 &nbsp;-&nbsp; by @m-xlsea [<samp>(901a6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/901a65ad)
  - support pinning and unpinning of tabs &nbsp;-&nbsp; by @PChening [<samp>(b8a76)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b8a767d7)
  - hybrid layout mode auto select first deepest child menu &nbsp;-&nbsp; by @paynezhuang [<samp>(94019)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9401925f)
  - 新增关于页面 &nbsp;-&nbsp; by @m-xlsea [<samp>(7d851)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7d85127c)
  - 菜单新增布局选择支持 &nbsp;-&nbsp; by @m-xlsea [<samp>(13de6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/13de6fbb)
  - 优化控制台输出和 sql 导入文件 &nbsp;-&nbsp; by @m-xlsea [<samp>(bfb71)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bfb7169e)
  - 登录记住密码加密保存 &nbsp;-&nbsp; by @m-xlsea [<samp>(90c52)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/90c52d97)
  - 使用 highlight.js 替换 monaco-editor &nbsp;-&nbsp; by @m-xlsea [<samp>(7dd7a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7dd7a936)
  - 演示页面新增字段排序 demo &nbsp;-&nbsp; by @m-xlsea [<samp>(41c25)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/41c25dcd)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **hooks**:
  - update pagination pageSize after data fetch. &nbsp;-&nbsp; by **Azir-11** [<samp>(64226)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/64226d9b)
- **project**:
  - 修复导出时查询参数错误问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(52ad9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/52ad93b2)
- **projects**:
  - fix the incorrect judgment of home by pin tab. &nbsp;-&nbsp; by **Azir-11** [<samp>(62a43)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/62a43c39)
- **table**:
  - 修复分页数据处理逻辑 &nbsp;-&nbsp; by @imtzc [<samp>(a59fd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a59fdc58)
- **template**:
  - 调整搜索模块的属性定义位置 &nbsp;-&nbsp; by @imtzc [<samp>(bb039)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bb039eff)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**:
  - 修复菜单代码质量问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(6f349)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6f34956e)
  - 优化注释规范 &nbsp;-&nbsp; by @m-xlsea [<samp>(4139a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4139a729)

### &nbsp;&nbsp;&nbsp;📖 文档

- **other**:
  - 更新 cursor 规则 &nbsp;-&nbsp; by @m-xlsea [<samp>(1d6af)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/1d6af984)
  - 优化 sql 插入语句 &nbsp;-&nbsp; by @m-xlsea [<samp>(f7d8d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f7d8d189)
  - 优化工作流相关菜单 &nbsp;-&nbsp; by @m-xlsea [<samp>(33155)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3315552d)
  - 移除 cursor 文件夹 &nbsp;-&nbsp; by @m-xlsea [<samp>(5f950)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5f950b46)
  - 修复模板处理工具类内容错误 &nbsp;-&nbsp; by @m-xlsea [<samp>(f6dcd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f6dcded8)

### &nbsp;&nbsp;&nbsp;🏡 重构

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(7cf40)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7cf4083b)
  - update umo-editor deps &nbsp;-&nbsp; by @m-xlsea [<samp>(39f8d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/39f8d13b)
- **styles**:
  - format code &nbsp;-&nbsp; by @soybeanjs [<samp>(098cd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/098cd50e)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![imtzc](https://github.com/imtzc.png?size=48)](https://github.com/imtzc)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;[![PChening](https://github.com/PChening.png?size=48)](https://github.com/PChening)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;

## [v2.0.0-beta.1](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.2.1...v2.0.0-beta.1) (2025-12-04)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **projects**:
  - 项目适配 Soybean 2.0 &nbsp;-&nbsp; by @m-xlsea
- **components**:
  - 新增预设主题支持 &nbsp;-&nbsp; by @m-xlsea [<samp>(c1063)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/c1063e3e)
- **hooks**:
  - 完成表格 Hooks 改造 &nbsp;-&nbsp; by @m-xlsea [<samp>(46996)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4699654f)
  - 优化树形表格 hooks 封装 &nbsp;-&nbsp; by @m-xlsea [<samp>(ccbb7)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ccbb72c0)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **projects**:
  - 修复登录页面 logo 颜色问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(27cae)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/27cae756)
  - 修复路由 name 与 path 不一致激活菜单异常问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(789a6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/789a6bb9)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![wenyuanw](https://github.com/wenyuanw.png?size=48)](https://github.com/wenyuanw)&nbsp;&nbsp;[![CyberShen](https://github.com/CyberShen.png?size=48)](https://github.com/CyberShen)&nbsp;&nbsp;[![Lruihao](https://github.com/Lruihao.png?size=48)](https://github.com/Lruihao)&nbsp;&nbsp;
[刘璐](mailto:hi.alue@qq.com),&nbsp;[CyberShen123](mailto:s.lijun@qq.com),&nbsp;[whyang](mailto:whyang9701@gmail.com),&nbsp;[HongxuanG](mailto:1359774872@qq.com),&nbsp;[NicholasLD](mailto:878639947@qq.com),&nbsp;

## [v1.2.1](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.2.0...v1.2.1) (2025-10-29)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **components**:
  - 菜单树选择组件新增隐藏禁用标识 &nbsp;-&nbsp; by @m-xlsea [<samp>(08cfa)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/08cfa167)
  - 列设置新增滚动条处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(6696d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6696da52)
- **docs**:
  - 新增 GitCode star 徽章 &nbsp;-&nbsp; by @m-xlsea [<samp>(5310d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5310d352)
- **projects**:
  - 优化字典操作 &nbsp;-&nbsp; by @m-xlsea [<samp>(2400b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2400bf8c)
  - 客户端管理新增状态修改开关 &nbsp;-&nbsp; by @m-xlsea [<samp>(ea6a9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ea6a92cd)
  - Iframe 类型菜单传参更改 &nbsp;-&nbsp; by @m-xlsea [<samp>(bf3d5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bf3d5cb3)
  - 新增同步租户参数配置功能 &nbsp;-&nbsp; by @m-xlsea [<samp>(901a6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/901a65ad)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **projects**: 修复代码生成树模板问题 &nbsp;-&nbsp; by **AN** [<samp>(fa7bc)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/fa7bc434)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**:
  - 优化代码内容 &nbsp;-&nbsp; by @m-xlsea [<samp>(9edbd)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9edbd8e6)
  - 修复菜单代码质量问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(6f349)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6f34956e)

### &nbsp;&nbsp;&nbsp;📖 文档

- **other**: 更新 cursor 规则 &nbsp;-&nbsp; by @m-xlsea [<samp>(1d6af)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/1d6af984)
- **projects**: 更新 cursor 规则 &nbsp;-&nbsp; by @m-xlsea [<samp>(e63fe)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e63fee59)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **projects**: 优化注释规范 &nbsp;-&nbsp; by @m-xlsea [<samp>(4139a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4139a729)

### &nbsp;&nbsp;&nbsp;❤️ 贡献值

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://gitee.com/xlsea)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)

## [v1.2.0](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.1.3...v1.2.0) (2025-09-26)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **components**:
  - 新增 umodoc 编辑器集成 &nbsp;-&nbsp; by @m-xlsea [<samp>(f182d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f182def5)
- **projects**:
  - 重构登录页面样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(8412a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8412a8db)
  - 路由兼容 activeMenu 选项 &nbsp;-&nbsp; by @m-xlsea [<samp>(25ee3)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/25ee3207)
  - 用户列表新增头像展示 &nbsp;-&nbsp; by @m-xlsea [<samp>(3146c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3146c039)
  - 新增岗位部门树接口 &nbsp;-&nbsp; by **AN** [<samp>(28101)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/28101cb2)
- **styles**:
  - 优化左侧树形结构样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(513dc)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/513dc31e)
- **utils**:
  - 新增本地 Excel 导出工具类 &nbsp;-&nbsp; by @m-xlsea [<samp>(7f2f3)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7f2f3bd0)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **components**:
  - 修复字典标签会修改字典数据值问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(90a14)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/90a14e33)
- **hooks**:
  - 修复下载 hooks 错误未处理 &nbsp;-&nbsp; by @m-xlsea [<samp>(5ef1c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5ef1c5de)
- **packages**:
  - axios: fix json response. fixed #815 &nbsp;-&nbsp; by @soybeanjs in https://gitee.com/xlsea/ruoyi-plus-soybean/issues/815 [<samp>(fd087)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/fd087f59)
  - 修复tinymce层级问题 &nbsp;-&nbsp; by **AN** [<samp>(2c248)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2c248d82)
- **projects**:
  - 修改代码生成功能模块名为驼峰时，路由错误问题 &nbsp;-&nbsp; by **AN** [<samp>(2f794)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2f794c4b)
  - 修复新增部门时不显示上级部门问题 &nbsp;-&nbsp; by **AN** [<samp>(d5bbc)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/d5bbc37d)
  - 修复菜单弹窗打开未清空默认值问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(ad207)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ad207255)
  - 修复退出登录未清空消息列表问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(dc2fb)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dc2fbbd5)
  - 修复菜单默认图标问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(34ab7)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/34ab7d5d)
  - 修复消息通知字典值未处理问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(3f148)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3f148a4e)
  - 修复登录页面跳转问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(8aeb7)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8aeb7362)
  - 修复登录页面样式问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(4e27f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4e27f3b5)
- **types**:
  - fix proxy types &nbsp;-&nbsp; by @soybeanjs [<samp>(12b25)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/12b25e0d)
- **utils**:
  - 修复请求工具响应解密问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(9ef0b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9ef0bd41)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **components**: 补充国际化 &nbsp;-&nbsp; by **AN** [<samp>(ecad1)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ecad1c3e)
- **projects**: 字典状态使用枚举值 &nbsp;-&nbsp; by @m-xlsea [<samp>(56fd5)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/56fd5434)

### &nbsp;&nbsp;&nbsp;📖 文档

- **other**: 更新 cursor 规则 &nbsp;-&nbsp; by @m-xlsea [<samp>(e623b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e623b560)

### &nbsp;&nbsp;&nbsp;🏡 重构

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(e33f9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e33f944a)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(9fa95)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9fa951aa)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **components**: 修改json预览组件样式问题 &nbsp;-&nbsp; by **AN** [<samp>(378aa)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/378aa869)
- **styles**: 修复字体样式导致下划线不可见问题 &nbsp;-&nbsp; by **AN** [<samp>(4a424)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4a4244b5)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)

## [v1.1.3](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.1.2...v1.1.3) (2025-08-16)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **hooks**:
  - 非安全环境下不使用流式下载 &nbsp;-&nbsp; by @m-xlsea [<samp>(f8983)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f8983557)
  - 修复oss下载时未转码问题 &nbsp;-&nbsp; by **AN** [<samp>(2d31d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2d31d7dc)
- **project**:
  - 关闭多租户功能后仍然遍历租户列表导致控制台报错的问题 &nbsp;-&nbsp; by **wang_rui** [<samp>(b96c4)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b96c46ba)
  - 关闭多租户功能后仍然遍历租户列表导致控制台报错的问题 Merge pull request !25 from littleghost2016/dev &nbsp;-&nbsp; by **不寻俗** [<samp>(90276)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9027632b)
- **projects**:
  - 修复一级菜单隐藏失效问题 &nbsp;-&nbsp; by **AN** [<samp>(8fcc7)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8fcc70d7)
  - 修复日期搜索条件清除问题 &nbsp;-&nbsp; by **AN** [<samp>(52318)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/52318c10)
  - 修复登录过期事件监听未被重置 &nbsp;-&nbsp; by @m-xlsea [<samp>(71037)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/71037439)
  - 修复用户新增时角色下拉包含超级管理员问题 &nbsp;-&nbsp; by **AN** [<samp>(a15b6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a15b683b)
  - 修复用户导入功能无法更新问题 &nbsp;-&nbsp; by **AN** [<samp>(4e983)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4e9839bd)
  - Fix the icon size in the image preview toolbar &nbsp;-&nbsp; by @m-xlsea [<samp>(4539f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4539fe01)
  - 修复新增用户未查询角色列表问题 &nbsp;-&nbsp; by **AN** [<samp>(d6ae8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/d6ae85d2)
- **readme**:
  - update GitHub stars and forks links for gitee &nbsp;-&nbsp; by @soybeanjs [<samp>(923eb)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/923eb98a)

### &nbsp;&nbsp;&nbsp;💅 重构

- **menu**:
  - 菜单管理中隐藏的菜单显示灰色 &nbsp;-&nbsp; by **NicholasLD** [<samp>(adca2)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/adca2e26)
  - 菜单管理中隐藏的菜单显示灰色 Merge pull request !24 from NicholasLD/N/A &nbsp;-&nbsp; by **不寻俗** [<samp>(4eb77)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4eb77eac)
- **projects**:
  - 菜单列表新增禁用菜单样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(e5383)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e538355f)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **other**: update the ESLint validation configuration to support more file types. &nbsp;-&nbsp; by **Azir-11** [<samp>(8d7f9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8d7f91dc)
- **readme**: remove DartNode sponsorship badge from README files &nbsp;-&nbsp; by @soybeanjs [<samp>(33ade)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/33ade539)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![Azir-11](https://github.com/NicholasLD.png?size=48)](https://github.com/NicholasLD)&nbsp;&nbsp;
[wang_rui](mailto:wrr1996@163.com)

## [v1.1.2](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.1.1...v1.1.2) (2025-07-24)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- 修复 api.d.ts.vm 代码生成模板bug &nbsp;-&nbsp; by **zygalaxy** [<samp>(4e8c8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/4e8c8715)
- **projects**:
  - 修复刷新时跳转至登录页问题 &nbsp;-&nbsp; by **AN** [<samp>(2587f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/2587f8cb)
  - 修复登录过期不弹窗问题 &nbsp;-&nbsp; by **AN** [<samp>(e485f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e485f680)
  - 修复菜单结构变动后路由无法进入问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(f4038)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f4038a2d)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**: 优化搜索框FormItem &nbsp;-&nbsp; by **AN** [<samp>(a1336)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a1336d15)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(e89b8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e89b86ce)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **projects**: 搜索FormItem占比调整 &nbsp;-&nbsp; by **AN** [<samp>(cc29e)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/cc29ea85)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;
[zygalaxy](mailto:zygalaxy@qq.com)

## [v1.1.1](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.1.0...v1.1.1) (2025-07-11)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **hooks**:
  - 重构下载方法，支持流式下载 &nbsp;-&nbsp; by @m-xlsea [<samp>(65067)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/650673e2)
- **projects**:
  - 角色分配用户新增部门与时间查询条件 &nbsp;-&nbsp; by @m-xlsea [<samp>(ad48d)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ad48d8e8)
  - 修改操作后列表查询方式 &nbsp;-&nbsp; by @m-xlsea [<samp>(d8542)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/d85424ee)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **hooks**:
  - 解决 streamsaver 访问不到 Github 资源问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(566b2)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/566b2c2d)
- **other**:
  - 修复代码生成类型定义文件重复问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(f7c7f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f7c7fc41)
- **packages**:
  - 修复 cleanup 会删除富文本编辑器资源问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(9ca7c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/9ca7ca8f)
- **projects**:
  - 修复字典数据重复获取问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(3628c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3628c249)
  - 修改强退在线设备接口 &nbsp;-&nbsp; by **AN** [<samp>(dbcf8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dbcf8d42)
  - 修复代码生成逻辑判断问题 &nbsp;-&nbsp; by **AN** [<samp>(6fc7b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6fc7b11b)
  - 修复部门字典 sys_normal_disable 重复获取 Merge pull request !11 from 素还真/N/A &nbsp;-&nbsp; by @m-xlsea [<samp>(ad938)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ad9386eb)
  - 修复未清空文件列表，上传回显问题 &nbsp;-&nbsp; by **AN** [<samp>(229e0)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/229e0044)
  - Fix i18n-ally not working when setting moduleResolution to bundler. fixed #780 &nbsp;-&nbsp; by @xiaobao0505 in https://gitee.com/xlsea/ruoyi-plus-soybean/issues/780 [<samp>(41191)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/41191d54)
  - 修复角色列表操作栏展示不全问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(62f2c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/62f2c6d5)
  - 修复用户导入结果信息未渲染标签问题 &nbsp;-&nbsp; by **AN** [<samp>(efc95)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/efc953c0)
  - 修复角色用户分配未调用接口问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(ff874)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ff87415d)
- **styles**:
  - 修复登录页平板界面滚动问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(90145)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/90145fa5)
- **utils**:
  - 修复isNull和IsNotNull判断方法潜在问题 &nbsp;-&nbsp; by **AN** [<samp>(90d32)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/90d32ee2)

### &nbsp;&nbsp;&nbsp;💅 重构

- **projects**: 调整租户套餐菜单接口 &nbsp;-&nbsp; by **AN** [<samp>(b9999)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/b9999935)

### &nbsp;&nbsp;&nbsp;📖 文档

- **other**: 修改文档内容 &nbsp;-&nbsp; by @m-xlsea [<samp>(3ae99)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3ae9922d)
- **projects**: 优化 cursor 规则及 mcp &nbsp;-&nbsp; by @m-xlsea [<samp>(a3199)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a31994dc)
- **readme**: 更新 README.md 文件 &nbsp;-&nbsp; by @m-xlsea [<samp>(99675)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/99675cbc)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **deps**:
  - update NodeJS and pnpm version requirements in package.json and documentation &nbsp;-&nbsp; by **Junior25306** [<samp>(a5c4b)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a5c4b4e3)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(5cb1c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/5cb1cebd)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(aeb63)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/aeb63690)
  - update deps &nbsp;-&nbsp; by @m-xlsea [<samp>(89c71)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/89c716e1)
- **packages**:
  - update Vite version to 7 in package.json and documentation. &nbsp;-&nbsp; by **Azir** [<samp>(03dd6)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/03dd64c5)
- **projects**:
  - update pnpm-lock.yaml &nbsp;-&nbsp; by @m-xlsea [<samp>(7c6ca)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7c6ca91e)
- **vscode**:
  - remove unused vue.server.hybridMode setting from .vscode/settings.json &nbsp;-&nbsp; by @soybeanjs [<samp>(13319)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/133196f3)

### &nbsp;&nbsp;&nbsp;❤️ 贡献值

[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![xiaobao0505](https://github.com/xiaobao0505.png?size=48)](https://github.com/xiaobao0505)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[Junior25306](mailto:dayu429@qq.com)

## [v1.1.0](https://gitee.com/xlsea/ruoyi-plus-soybean/compare/v1.0.0...v1.1.0) (2025-07-01)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **components**:
  - 新增表单上传组件 &nbsp;-&nbsp; by @m-xlsea [<samp>(03c8a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/03c8a7f5)
- **other**:
  - 新增菜单字典多语言适配 SQL &nbsp;-&nbsp; by @m-xlsea [<samp>(0f33f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/0f33f4a3)
- **projects**:
  - add configurable user name watermark option &nbsp;-&nbsp; by @wenyuanw [<samp>(7c3da)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7c3dac42)
  - 菜单字典适配 i18n &nbsp;-&nbsp; by @m-xlsea [<samp>(39dd9)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/39dd9acc)
  - 新增字典多语言适配 &nbsp;-&nbsp; by @m-xlsea [<samp>(8c840)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8c84063a)
- **styles**:
  - 修复登录页移动端显示问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(742e3)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/742e3858)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **app**:
  - replace console.error with window.console.error for consistency &nbsp;-&nbsp; by @soybeanjs [<samp>(7d840)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7d84062e)
- **auth**:
  - remove redundant authStore declaration in resetStore function &nbsp;-&nbsp; by @soybeanjs [<samp>(c57f8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/c57f88aa)
- **components**:
  - 修复菜单树选择组件 &nbsp;-&nbsp; by @m-xlsea [<samp>(bbda8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/bbda803e)
  - 修复树选择组件再次勾选父子联动导致全选问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(aeb73)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/aeb736eb)
  - 修复部门选择组件非树结构，默认展开失败问题 &nbsp;-&nbsp; by **AN** [<samp>(da1c1)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/da1c16e0)
  - 修复上传组件回显问题，修改accept参数逻辑 &nbsp;-&nbsp; by **AN** [<samp>(e16a0)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e16a0fa6)
  - 修复菜单选择标签渲染问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(6e6cc)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/6e6cc4d9)
- **other**:
  - 修复代码生成问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(1ec10)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/1ec10991)
  - 代码生成模板 dateRangeTime 错误 &nbsp;-&nbsp; by @m-xlsea [<samp>(f0810)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f0810bce)
  - 修复代码生成字典相关问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(94d18)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/94d1863e)
  - 修复代码生成类型定义文件重复问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(f7c7fc41)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f7c7fc41)
- **projects**:
  - 修复自定义数据权限没有保存角色部门bug &nbsp;-&nbsp; by **AN** [<samp>(a0f33)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/a0f33664)
  - 修复登录过期后，重复弹窗问题 &nbsp;-&nbsp; by **AN** [<samp>(cafee)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/cafee1db)
  - 修复首页未从环境变量获取问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(031b7)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/031b7f69)
  - 修复导出查询参数问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(ffa47)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/ffa47c37)
  - 修复权限字符显示逻辑错误问题 &nbsp;-&nbsp; by **AN** [<samp>(0ac0a)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/0ac0a093)
  - 目录类型禁用iframe选项 &nbsp;-&nbsp; by **AN** [<samp>(72b8f)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/72b8f56e)
  - 修复切换用户或登录过期部分问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(27f06)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/27f06195)
  - 修复接口请求异常拦截问题 &nbsp;-&nbsp; by @m-xlsea [<samp>(031d0)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/031d071a)
  - 修复个人信息-修改密码未加密且参数错误问题 &nbsp;-&nbsp; by **AN** [<samp>(8b315)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8b3151b8)
  - 调整属性名 &nbsp;-&nbsp; by **AN** [<samp>(62e6c)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/62e6c776)
  - ensure proper text color when themes are inverted &nbsp;-&nbsp; by @wenyuanw [<samp>(afd60)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/afd60421)
- **styles**:
  - 添加滚动条，去除页码 &nbsp;-&nbsp; by **AN** [<samp>(d37ad)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/d37adc36)
- **types**:
  - The environment variable VITE_ICON_LOCAL_PREFIX has the wrong type. &nbsp;-&nbsp; by **chenziwen** [<samp>(da149)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/da149e5b)
- **utils**:
  - 修复 删除当前tab为最后一个时，tab切换错误bug. &nbsp;-&nbsp; by **AN** [<samp>(64bd1)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/64bd119c)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **components**:
  - optimize spacing for lang-switch dropdown options &nbsp;-&nbsp; by @wenyuanw [<samp>(fcb89)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/fcb89883)
- **projects**:
  - optimize tab deletion logic. closed #755 &nbsp;-&nbsp; by @wenyuanw in https://gitee.com/xlsea/ruoyi-plus-soybean/issues/755 [<samp>(e6044)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/e6044d0f)
  - optimize tab deletion logic &nbsp;-&nbsp; by **AN** [<samp>(858c3)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/858c3180)
  - 优化接口请求异常拦截代码 &nbsp;-&nbsp; by @m-xlsea [<samp>(47191)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/471912e1)

### &nbsp;&nbsp;&nbsp;💅 重构

- **iframe-page**: remove unused lifecycle hooks and clean up script setup &nbsp;-&nbsp; by @soybeanjs [<samp>(276d8)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/276d836c)
- **projects**: 补充formTip信息 &nbsp;-&nbsp; by **AN** [<samp>(f36ac)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/f36ac9ab)

### &nbsp;&nbsp;&nbsp;📖 文档

- **readme**:
  - 更新 README.md 文件 &nbsp;-&nbsp; by @m-xlsea [<samp>(99675cb)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/99675cb)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(3e4e1)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/3e4e17ab)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(dc674)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dc674ce8)
  - update deps &nbsp;-&nbsp; by @m-xlsea [<samp>(fec05)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/fec0563e)
- **projects**:
  - 移除未使用代码 &nbsp;-&nbsp; by **AN** [<samp>(d141e)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/d141ed5b)
  - update deps & fix `moduleResolution` &nbsp;-&nbsp; by @soybeanjs [<samp>(dbd99)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/dbd995c1)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **projects**:
  - 更换 logo 与加载样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(7e4ec)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/7e4ecae6)
  - 重构登录页样式 &nbsp;-&nbsp; by @m-xlsea [<samp>(40680)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/406800de)
  - 修改按钮文本颜色 &nbsp;-&nbsp; by @m-xlsea [<samp>(907f0)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/907f0439)
  - 优化移动端字体大小 &nbsp;-&nbsp; by @m-xlsea [<samp>(8b4e4)</samp>](https://gitee.com/xlsea/ruoyi-plus-soybean/commit/8b4e41ce)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![xlsea](https://github.com/m-xlsea.png?size=48)](https://gitee.com/xlsea)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![wenyuanw](https://github.com/wenyuanw.png?size=48)](https://github.com/wenyuanw)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![chen-ziwen](https://github.com/chen-ziwen.png?size=48)](https://github.com/chen-ziwen)&nbsp;&nbsp;
[![wangzhongqi0917](https://gitee.com/wangzhongqi0917.png?width=48)](https://gitee.com/wangzhongqi0917)&nbsp;&nbsp;[![qq1822213252](https://gitee.com/qq1822213252.png?width=48)](https://gitee.com/qq1822213252)&nbsp;&nbsp;[![tangzc](https://gitee.com/tangzc.png?width=48)](https://gitee.com/tangzc),&nbsp;[metabytes](https://gitee.com/metabytes)

## [v1.0.0](https://gitee.com/xlsea/ruoyi-plus-soybean/releases/tag/v1.0.0) (2025-06-05)

### &nbsp;&nbsp;&nbsp;🚀 新功能

1.0.0 版本正式发布，此版本不包含工作流与多语言，请期待后续版本发布。

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

首次发版不展示过多贡献者，敬请谅解

[![soybeanjs](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![xlsea](https://github.com/m-xlsea.png?size=48)](https://gitee.com/xlsea)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![wangqiqi95](https://github.com/wangqiqi95.png?size=48)](https://github.com/wangqiqi95)&nbsp;
