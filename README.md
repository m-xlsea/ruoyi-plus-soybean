<div align="center">
  <img src="https://docs.ruoyi.xlsea.cn/logo.svg" width="160">
  <h1>RuoYi-Plus-Soybean</h1>
</div>

<div style="height: 10px; clear: both;"></div>

<div align="center">
  <p>一个基于 <a href="https://gitee.com/dromara/RuoYi-Vue-Plus" target="_blank">RuoYi-Vue-Plus</a> 的后端能力和 <a href="https://github.com/soybeanjs/soybean-admin" target="_blank">Soybean Admin</a> 前端特性的现代化多租户管理系统</p>
  <p>
    <a href="https://gitee.com/xlsea/ruoyi-plus-soybean" target="_blank"><img src="https://gitee.com/xlsea/ruoyi-plus-soybean/badge/star.svg" alt="Gitee"></a>
    <a href="https://gitee.com/dromara/RuoYi-Vue-Plus" target="_blank"><img src="https://gitee.com/xlsea/ruoyi-plus-soybean/badge/fork.svg" alt="Gitee-forks"></a>
    <a href="https://github.com/m-xlsea/ruoyi-plus-soybean" target="_blank"><img src="https://img.shields.io/github/stars/m-xlsea/ruoyi-plus-soybean" alt="Github"></a>
    <a href="https://github.com/m-xlsea/ruoyi-plus-soybean" target="_blank"><img src="https://img.shields.io/github/forks/m-xlsea/ruoyi-plus-soybean" alt="Github-forks"></a>
    <a href="https://vuejs.org" target="_blank"><img src="https://img.shields.io/badge/Vue-3.5-brightgreen" alt="vue"></a>
    <a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5.8-blue" alt="typescript"></a>
    <a href="https://vite.dev" target="_blank"><img src="https://img.shields.io/badge/Vite-6.2-orange" alt="vite"></a>
    <a href="https://www.naiveui.com" target="_blank"><img src="https://img.shields.io/badge/NaiveUI-2.41-purple" alt="naive-ui"></a>
        <a href="./LICENSE" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="license"></a>
  </p>
</div>

# 📢 重要通知

1.1.1 版本已发布，但仍然建议：
- 在生产环境使用前进行充分测试
- 关注项目更新，及时获取最新版本
- 积极反馈问题，帮助我们快速迭代

**后续规划**
- 工作流引擎集成
- 多语言国际化完善
- 性能优化和稳定性提升

> 如果对该项目感兴趣，可以给一个 Star 支持一下，谢谢！
> 请大家踊跃提交 PR 和 Issue，一起完善这个项目

# ❗开发前必看

<p style="font-weight: bold; font-size: 24px;">本项目强制使用 pnpm 构建，详细请看 <a href="#安装步骤及说明">安装步骤及说明</a></p>

<p style="font-weight: bold; font-size: 24px;">后端需要替换代码生成模板与菜单 SQL，详细请看 <a href="#代码生成与菜单更新">代码生成与菜单更新</a></p>

## 📋 项目概述

RuoYi-Plus-Soybean 是一个现代化的企业级多租户管理系统，它结合了 RuoYi-Vue-Plus 的强大后端功能和 Soybean Admin 的现代化前端特性，为开发者提供了完整的企业管理解决方案。

### 🌟 项目特点

- **多租户架构**：完整支持SaaS多租户模式，灵活的租户管理能力
- **现代前端技术栈**：基于Vue 3、TypeScript、Vite和Naive UI构建
- **Monorepo工程管理**：使用pnpm workspaces管理多包结构
- **丰富的组件库**：内置大量业务组件和布局选项
- **主题定制**：支持多种布局模式和主题配色
- **国际化**：内置多语言支持
- **权限管理**：精细的基于角色的权限控制

## 🛠️ 技术栈

### 前端
- **核心框架**：Vue 3.5.x
- **开发语言**：TypeScript 5.8.x
- **构建工具**：Vite 6.2.x
- **UI组件库**：Naive UI 2.41.x
- **状态管理**：Pinia 3.0.x
- **路由**：Vue Router 4.5.x
- **HTTP客户端**：Axios/Alova
- **CSS**：UnoCSS
- **包管理器**：pnpm 8.x+

### 后端（与RuoYi-Vue-Plus兼容）
- **核心框架**：Spring Boot
- **安全框架**：Spring Security
- **权限认证**：Sa-Token
- **数据操作**：MyBatis-Plus
- **数据库**：MySQL

## 🏗️ 项目结构

```
root
├── build                    # 构建配置和插件
│   ├── config               # 构建配置文件
│   └── plugins              # Vite 插件
├── docs                     # 文档和模板
│   ├── java                 # 代码生成工具类
│   └── template             # 代码生成模板
├── packages                 # Monorepo包
│   ├── alova                # 使用Alova的HTTP客户端实现
│   ├── axios                # 使用Axios的HTTP客户端实现
│   ├── color                # 颜色管理工具
│   ├── hooks                # 可复用的Vue组合函数
│   ├── materials            # UI组件和材料
│   ├── ofetch               # 使用ofetch的HTTP客户端实现
│   ├── scripts              # 构建和开发脚本
│   ├── uno-preset           # UnoCSS预设配置
│   └── utils                # 通用工具函数
├── public                   # 静态资源
├── src                      # 主应用源代码
│   ├── assets               # 静态资源(图片、图标)
│   ├── components           # 可复用的 Vue 组件
│   ├── constants            # 应用常量
│   ├── enum                 # TypeScript 枚举
│   ├── hooks                # Vue 组合函数
│   ├── layouts              # 页面布局
│   ├── locales              # 国际化
│   ├── plugins              # Vue 插件
│   ├── router               # Vue Router 配置
│   ├── service              # API 服务
│   ├── store                # Pinia 存储模块
│   ├── styles               # 全局样式
│   ├── theme                # 主题配置
│   ├── typings              # TypeScript 类型定义
│   ├── utils                # 工具函数
│   └── views                # 页面组件
└── vite.config.ts           # Vite 配置
```

## 🚀 环境要求与安装

### 环境要求
- Node.js >= 20.19.0
- pnpm >= 10.5.0
- Git

### 安装步骤及说明

1. 克隆仓库
```bash
git clone https://gitee.com/xlsea/ruoyi-plus-soybean.git
cd ruoyi-plus-soybean
```

2. 安装 pnpm (如果未安装)

```bash
npm install pnpm -g
```

设置淘宝镜像
```bash
pnpm config set registry https://registry.npmmirror.com
```

3. 安装依赖
```bash
pnpm install
```

4. 运行开发服务器
```bash
pnpm dev
```

5. 构建生产版本
```bash
pnpm build
```

### 代码生成与菜单更新

项目提供了代码生成工具和菜单SQL更新文件，在 <a href="https://gitee.com/xlsea/ruoyi-plus-soybean/tree/master/docs" target="_blank">docs</a> 目录下：

- **代码生成工具**
   - 代码生成工具类位于 `docs/java` 目录，如果没有修改过VelocityUtils.java文件，直接替换即可
   - 代码生成模板位于 `docs/template` 目录，请在ruoyi-generator模块的`resource/vm`下新建 `soy`文件夹，并将所有模板拷贝至`soy`文件夹中

- **菜单SQL更新**
   - 菜单数据更新SQL文件位于 `docs/sql` 目录
   - 在系统初始化或更新时，需要执行相应的SQL文件来更新菜单数据

## 📝 开发指南

### 可用的脚本命令

```bash
# 开发环境
pnpm dev

# 测试环境
pnpm dev:test

# 生产环境
pnpm dev:prod

# 构建生产版本
pnpm build

# 构建开发版本
pnpm build:dev

# 构建测试版本
pnpm build:test

# 预览构建
pnpm preview

# 类型检查
pnpm typecheck

# 代码规范检查并修复
pnpm lint

# 路由生成
pnpm gen-route

# 提交代码
pnpm commit

# 中文提交信息
pnpm commit:zh

# 依赖包更新
pnpm update-pkg

# 清理项目
pnpm cleanup

# 发布新版本
pnpm release
```

### 代码规范与风格

项目使用ESLint进行代码检查，遵循以下规范：

- **命名规范**：
  - Vue组件: PascalCase (如 UserProfile.vue)
  - TypeScript文件: camelCase (如 userService.ts)
  - CSS/SCSS: kebab-case (如 user-profile.scss)

- **代码风格**：
  - 使用Vue 3 Composition API
  - 使用TypeScript类型系统
  - 遵循单一职责原则

### 核心开发模式

#### 状态管理
使用Pinia进行状态管理，模块位于`src/store/modules`目录：
- **app**: 应用全局状态
- **theme**: 主题配置
- **route**: 路由信息
- **tab**: 标签页管理
- **auth**: 认证信息
- **dict**: 字典管理
- **notice**: 通知管理

#### API交互
项目支持多种HTTP客户端实现：

- **Axios**:
```typescript
import { useRequest } from '@/hooks/common/request';

const { data, loading, error } = useRequest(() => api.getData(params));
```

- **Hooks使用**:
```typescript
// 布尔值管理
import { useBoolean } from '@sa/hooks';
const { bool, setTrue, setFalse } = useBoolean();

// 加载状态管理
import { useLoading } from '@sa/hooks';
const { loading, startLoading, endLoading } = useLoading();

// 表格管理
import { useTable } from '@/hooks/common/table';
const { tableData, loading, getPaginationData } = useTable(fetchTableData);
```

#### 组件使用
项目包含多种业务组件：

- **表格组件**：支持列设置、搜索区域和高级操作
- **表单组件**：集成验证和表单布局
- **字典组件**：字典选择、标签和单选
- **布局组件**：支持多种布局模式和主题

### UnoCSS使用指南
项目优先使用 UnoCSS 来实现样式：

```html
<div class="flex flex-col items-center justify-center p-4 m-2 bg-blue-100 dark:bg-blue-800 rounded-md">
  <span class="text-lg font-bold text-center">内容</span>
</div>
```

### 国际化
项目使用vue-i18n实现国际化支持：

```typescript
// 在组件中使用
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
console.log(t('common.confirm'));
```

## 💎 特性与功能

### 前端特性
- **多种布局模式**：支持垂直、水平、混合等多种布局
- **可配置的主题**：明暗模式、主题色定制
- **标签页管理**：多种标签风格、右键菜单
- **组件封装**：进度条、图标、加载动画等
- **路由生成**：基于目录结构的路由生成
- **权限管理**：菜单和按钮级别的权限控制

### 业务功能
- **用户管理**：用户信息维护、角色分配
- **角色管理**：角色权限配置
- **菜单管理**：系统功能配置
- **部门管理**：组织架构维护
- **字典管理**：数据字典配置
- **租户管理**：多租户配置
- **系统监控**：登录日志、操作日志、在线用户、缓存监控
- **代码生成**：生成前后端代码，提升开发效率

## 🤝 贡献指南

### 开发流程
1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交Pull Request

### 提交规范
项目使用约定式提交规范：

- `feat`: 新功能
- `fix`: 修复Bug
- `docs`: 文档更新
- `style`: 代码风格调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试代码
- `chore`: 构建或工具变动

## 📄 许可证

[MIT License](./LICENSE)

## 🔗 相关链接

- [RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus) - 后端基础框架
- [Soybean Admin](https://github.com/soybeanjs/soybean-admin) - 前端基础框架
- [RuoYi-Plus-Soybean](https://ruoyi.xlsea.cn) - 官方演示站点
- [RuoYi-Plus-Soybean-Docs](https://docs.ruoyi.xlsea.cn) - 项目文档
- [Open Hives](https://openhives.com/questions) - OpenHives 问答社区

## 📮 联系方式

- **作者**: xlsea
- **邮箱**: xlsea@linux.do
- **作者主页**: https://gitee.com/xlsea


- **作者**: Elio
- **邮箱**: 1983933789@qq.com
- **作者主页**: https://gitee.com/ahcode

## 💬 交流群

**加群前请先阅读一下内容：**

- 禁止内容：黄腔、暴力言论、政治话题，违者直接飞机票（踢出群）
- 遇到问题请先阅读 [项目文档](https://docs.ruoyi.xlsea.cn) 和 [Soybean 文档](https://docs.soybeanjs.cn/)，某些简单问题不予理睬
- 蜡笔小新头像为机器人助手，私聊不保证回复，问题请在群内讨论

<img src="https://foruda.gitee.com/images/1749174520085305975/ad1b54fe_5601833.png" width="300px" />

添加作者微信备注：加群

## 🧧 捐献作者

作者为兼职做开源，平时还需要工作，如果帮到了您可以请作者吃个盒饭

<img src="https://foruda.gitee.com/images/1746840166037207866/f8c6f06b_5601833.png" width="300px" height="300px" />

## 🫡 捐赠列表

**捐赠列表已移至 [捐赠列表](https://docs.ruoyi.xlsea.cn/other/donate.html)**
