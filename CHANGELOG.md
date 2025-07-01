# 更新日志

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

[![xlsea](https://github.com/m-xlsea.png?size=48)](https://gitee.com/xlsea)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![wenyuanw](https://github.com/wenyuanw.png?size=48)](https://github.com/wenyuanw)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![wenyuanw](https://github.com/chen-ziwen.png?size=48)](https://github.com/chen-ziwen)&nbsp;&nbsp;
[![wangzhongqi0917](https://gitee.com/wangzhongqi0917.png?width=48)](https://gitee.com/wangzhongqi0917)&nbsp;&nbsp;[![qq1822213252](https://gitee.com/qq1822213252.png?width=48)](https://gitee.com/qq1822213252)&nbsp;&nbsp;[![tangzc](https://gitee.com/tangzc.png?width=48)](https://gitee.com/tangzc),&nbsp;[metabytes](https://gitee.com/metabytes)


## [v1.0.0](https://gitee.com/xlsea/ruoyi-plus-soybean/releases/tag/v1.0.0) (2025-06-05)

### &nbsp;&nbsp;&nbsp;🚀 新功能

1.0.0 版本正式发布，此版本不包含工作流与多语言，请期待后续版本发布。

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

首次发版不展示过多贡献者，敬请谅解

[![soybeanjs](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![xlsea](https://github.com/m-xlsea.png?size=48)](https://gitee.com/xlsea)&nbsp;&nbsp;[![Elio-An](https://github.com/Elio-An.png?size=48)](https://gitee.com/elio-an)&nbsp;&nbsp;[![wangqiqi95](https://github.com/wangqiqi95.png?size=48)](https://github.com/wangqiqi95)&nbsp;
