## RuoYi-Plus-Soybean

> A modern admin system based on RuoYi-Vue-Plus, enhanced with Soybean Admin features

> This project combines the robust backend capabilities of RuoYi-Vue-Plus with the modern frontend features of Soybean Admin, providing a comprehensive enterprise-level admin system.

> Active Development

> Open Source Project

> Framework: Vue 3 + TypeScript + Vite + Naive UI
> Language: TypeScript
> State Management: Pinia
> HTTP Client: Axios/Alova
> UI Framework: Naive UI
> Build Tool: Vite
> Package Manager: pnpm

## Dependencies

* vue (^3.4.0): Progressive JavaScript framework
* typescript (^5.3.0): JavaScript with syntax for types
* vite (^5.0.0): Next generation frontend tooling
* naive-ui (^2.37.0): A Vue 3 Component Library
* pinia (^2.1.0): Intuitive, type safe store for Vue
* axios (^1.6.0): Promise based HTTP client
* alova (^2.0.0): Lightweight request strategy library
* dayjs (^1.11.0): Fast 2kB alternative to Moment.js
* colord (^2.9.0): Color manipulation library
* crypto-js (^4.2.0): JavaScript library of crypto standards

## Development Environment

> Node.js >= 18.0.0
> pnpm >= 8.0.0
> Git

> The project uses pnpm workspaces for monorepo management, with multiple packages in the packages directory.

## Structure

> The project follows a modular architecture with clear separation of concerns. Key directories and their purposes are explained below.

```
root
- build                    // Build configuration and plugins
    - config              // Build configuration files
    - plugins             // Vite plugins
- docs                    // Documentation and templates
    - java               // Java backend documentation
    - template           // Code generation templates
- packages               // Monorepo packages
    - alova             // HTTP client implementation using Alova
    - axios             // HTTP client implementation using Axios
    - color             // Color management utilities
    - hooks             // Reusable Vue composition functions
    - materials         // UI components and materials
    - ofetch            // HTTP client implementation using ofetch
    - scripts           // Build and development scripts
    - uno-preset        // UnoCSS preset configuration
    - utils             // Common utility functions
- public                // Static assets
- src                   // Main application source code
    - assets            // Static assets (images, icons)
    - components        // Reusable Vue components
    - constants         // Application constants
    - enum              // TypeScript enums
    - hooks             // Vue composition functions
    - layouts           // Page layouts
    - locales           // Internationalization
    - plugins           // Vue plugins
    - router            // Vue Router configuration
    - service           // API services
    - store             // Pinia store modules
    - styles            // Global styles
    - theme             // Theme configuration
    - typings           // TypeScript type definitions
    - utils             // Utility functions
    - views             // Page components
```

## Dependencies (init from programming language specification like package.json, requirements.txt, etc.)

* package1 (version): simple description
* package2 (version): simple description


## Development Environment

> include all the tools and environments needed to run the project
> makefile introduction (if exists)


## Structrue (init from project tree)

> It is essential to consistently refine the analysis down to the file level — this level of granularity is of utmost importance.

> If the number of files is too large, you should at least list all the directories, and provide comments for the parts you consider particularly important.

> In the code block below, add comments to the directories/files to explain their functionality and usage scenarios.

> if you think the directory/file is not important, you can not skip it, just add a simple comment to it.

> but if you think the directory/file is important, you should read the files and add more detail comments on it (e.g. add comments on the functions, classes, and variables. explain the functionality and usage scenarios. write the importance of the directory/file).
```
root
- .editorconfig
- .env
- .env.dev
- .env.prod
- .env.test
- .gitattributes
- .gitignore
- .npmrc
- LICENSE
- build
    - config
        - index.ts
        - proxy.ts
        - time.ts
    - plugins
        - devtools.ts
        - html.ts
        - index.ts
        - monaco-editor.ts
        - router.ts
        - unocss.ts
        - unplugin.ts
- docs
    - README.md
    - java
        - SysMenuServiceImpl.java
        - VelocityUtils.java
    - template
        - api
            - soy.api.ts.vm
        - modules
            - soy.operate-drawer.vue.vm
            - soy.search.vue.vm
        - soy.index.vue.vm
        - typings
            - soy.api.d.ts.vm
- eslint.config.js
- index.html
- package.json
- packages
    - alova
        - node_modules
            - @alova
                - mock
            - @sa
                - utils
            - alova
        - package.json
        - src
            - client.ts
            - constant.ts
            - fetch.ts
            - index.ts
            - mock.ts
            - type.ts
        - tsconfig.json
    - axios
        - node_modules
            - @sa
                - utils
            - @types
                - qs
            - axios
            - axios-retry
            - qs
        - package.json
        - src
            - constant.ts
            - index.ts
            - options.ts
            - shared.ts
            - type.ts
        - tsconfig.json
    - color
        - node_modules
            - @sa
                - utils
            - colord
        - package.json
        - src
            - constant
                - index.ts
                - name.ts
                - palette.ts
            - index.ts
            - palette
                - antd.ts
                - index.ts
                - recommend.ts
            - shared
                - colord.ts
                - index.ts
                - name.ts
            - types
                - index.ts
        - tsconfig.json
    - hooks
        - node_modules
            - @sa
                - axios
                - utils
        - package.json
        - src
            - index.ts
            - use-boolean.ts
            - use-context.ts
            - use-count-down.ts
            - use-loading.ts
            - use-request.ts
            - use-signal.ts
            - use-svg-icon-render.ts
            - use-table.ts
        - tsconfig.json
    - materials
        - node_modules
            - .bin
                - tcm
            - @sa
                - utils
            - simplebar-vue
            - typed-css-modules
        - package.json
        - src
            - index.ts
            - libs
                - admin-layout
                    - index.module.css
                    - index.module.css.d.ts
                    - index.ts
                    - index.vue
                    - shared.ts
                - page-tab
                    - button-tab.vue
                    - chrome-tab-bg.vue
                    - chrome-tab.vue
                    - index.module.css
                    - index.module.css.d.ts
                    - index.ts
                    - index.vue
                    - shared.ts
                    - svg-close.vue
                - simple-scrollbar
                    - index.ts
                    - index.vue
            - types
                - index.ts
        - tsconfig.json
    - ofetch
        - node_modules
            - ofetch
        - package.json
        - src
            - index.ts
        - tsconfig.json
    - scripts
        - bin.ts
        - node_modules
            - .bin
                - bumpp
                - ncu
                - npm-check-updates
                - rimraf
            - @soybeanjs
                - changelog
            - bumpp
            - c12
            - cac
            - consola
            - enquirer
            - execa
            - kolorist
            - npm-check-updates
            - rimraf
        - package.json
        - src
            - commands
                - changelog.ts
                - cleanup.ts
                - git-commit.ts
                - index.ts
                - release.ts
                - router.ts
                - update-pkg.ts
            - config
                - index.ts
            - index.ts
            - locales
                - index.ts
            - shared
                - index.ts
            - types
                - index.ts
        - tsconfig.json
    - uno-preset
        - package.json
        - src
            - index.ts
        - tsconfig.json
    - utils
        - node_modules
            - .bin
                - nanoid
            - @types
                - crypto-js
            - colord
            - crypto-js
            - klona
            - localforage
            - nanoid
        - package.json
        - src
            - crypto.ts
            - index.ts
            - klona.ts
            - nanoid.ts
            - storage.ts
        - tsconfig.json
- pnpm-lock.yaml
- pnpm-workspace.yaml
- public
    - favicon.png
- src
    - App.vue
    - assets
        - imgs
            - logo.png
            - soybean.jpg
        - svg-icon
            - activity.svg
            - at-sign.svg
            - avatar.svg
            - banner.svg
            - cast.svg
            - chrome.svg
            - copy.svg
            - custom-icon.svg
            - empty-data.svg
            - expectation.svg
            - heart.svg
            - maxkey.svg
            - menu
                - 404.svg
                - bug.svg
                - build.svg
                - button.svg
                - caret-back.svg
                - caret-forward.svg
                - cascader.svg
                - category.svg
                - chart.svg
                - checkbox.svg
                - clipboard.svg
                - code.svg
                - color.svg
                - company.svg
                - component.svg
                - dashboard.svg
                - date-range.svg
                - date.svg
                - dict.svg
                - documentation.svg
                - download.svg
                - drag.svg
                - druid.svg
                - edit.svg
                - education.svg
                - email.svg
                - example.svg
                - excel.svg
                - exit-fullscreen.svg
                - eye-open.svg
                - eye.svg
                - finish.svg
                - form.svg
                - fullscreen.svg
                - gitee.svg
                - github.svg
                - guide.svg
                - icon.svg
                - input.svg
                - international.svg
                - job.svg
                - language.svg
                - link.svg
                - list.svg
                - lock.svg
                - log.svg
                - logininfor.svg
                - message.svg
                - model.svg
                - money.svg
                - monitor.svg
                - my-copy.svg
                - my-task.svg
                - nested.svg
                - number.svg
                - online.svg
                - password.svg
                - pdf.svg
                - people.svg
                - peoples.svg
                - phone.svg
                - post.svg
                - process-definition.svg
                - qq.svg
                - question.svg
                - radio.svg
                - rate.svg
                - redis-list.svg
                - redis.svg
                - row.svg
                - search.svg
                - select.svg
                - server.svg
                - shopping.svg
                - size.svg
                - skill.svg
                - slider.svg
                - star.svg
                - swagger.svg
                - switch.svg
                - system.svg
                - tab.svg
                - table.svg
                - textarea.svg
                - theme.svg
                - time-range.svg
                - time.svg
                - tool.svg
                - tree-table.svg
                - tree.svg
                - upload.svg
                - user.svg
                - validCode.svg
                - waiting.svg
                - wechat.svg
                - workflow.svg
                - zip.svg
            - network-error.svg
            - no-icon.svg
            - no-permission.svg
            - not-found.svg
            - service-error.svg
            - topiam.svg
            - wind.svg
    - components
        - advanced
            - table-column-setting.vue
            - table-header-operation.vue
            - table-row-check-alert.vue
            - table-sider-layout.vue
        - common
            - app-provider.vue
            - dark-mode-container.vue
            - exception-base.vue
            - full-screen.vue
            - lang-switch.vue
            - menu-toggler.vue
            - monaco-editor.vue
            - pin-toggler.vue
            - reload-button.vue
            - system-logo.vue
            - theme-schema-switch.vue
        - custom
            - better-scroll.vue
            - boolean-tag.vue
            - button-icon.vue
            - count-to.vue
            - dict-radio.vue
            - dict-select.vue
            - dict-tag.vue
            - file-upload.vue
            - form-tip.vue
            - json-preview.vue
            - look-forward.vue
            - menu-tree-select.vue
            - post-select.vue
            - role-select.vue
            - soybean-avatar.vue
            - status-switch.vue
            - svg-icon.vue
            - tenant-select.vue
            - wave-bg.vue
    - constants
        - app.ts
        - business.ts
        - common.ts
        - reg.ts
    - enum
        - index.ts
    - hooks
        - business
            - auth.ts
            - captcha.ts
            - dict.ts
            - download.ts
        - common
            - echarts.ts
            - form.ts
            - icon.ts
            - loading.ts
            - router.ts
            - table.ts
            - tree-table.ts
    - layouts
        - base-layout
            - index.vue
        - blank-layout
            - index.vue
        - context
            - index.ts
        - modules
            - global-breadcrumb
                - index.vue
            - global-content
                - index.vue
            - global-footer
                - index.vue
            - global-header
                - components
                    - theme-button.vue
                    - user-avatar.vue
                - index.vue
            - global-logo
                - index.vue
            - global-menu
                - components
                    - first-level-menu.vue
                - index.vue
                - modules
                    - horizontal-menu.vue
                    - horizontal-mix-menu.vue
                    - reversed-horizontal-mix-menu.vue
                    - vertical-menu.vue
                    - vertical-mix-menu.vue
            - global-search
                - components
                    - search-footer.vue
                    - search-modal.vue
                    - search-result.vue
                - index.vue
            - global-sider
                - index.vue
            - global-tab
                - context-menu.vue
                - index.vue
            - theme-drawer
                - components
                    - layout-mode-card.vue
                    - setting-item.vue
                - index.vue
                - modules
                    - config-operation.vue
                    - dark-mode.vue
                    - layout-mode.vue
                    - page-fun.vue
                    - theme-color.vue
    - locales
        - dayjs.ts
        - index.ts
        - langs
            - en-us.ts
            - zh-cn.ts
        - locale.ts
        - naive.ts
    - main.ts
    - plugins
        - app.ts
        - assets.ts
        - dayjs.ts
        - iconify.ts
        - index.ts
        - loading.ts
        - nprogress.ts
    - router
        - elegant
            - imports.ts
            - routes.ts
            - transform.ts
        - guard
            - index.ts
            - progress.ts
            - route.ts
            - title.ts
        - index.ts
        - routes
            - builtin.ts
            - index.ts
    - service
        - api
            - auth.ts
            - index.ts
            - monitor
                - cache.ts
                - index.ts
                - login-infor.ts
                - online.ts
                - oper-log.ts
            - route.ts
            - system
                - client.ts
                - config.ts
                - dept.ts
                - dict-data.ts
                - dict.ts
                - index.ts
                - menu.ts
                - notice.ts
                - oss-config.ts
                - oss.ts
                - post.ts
                - role.ts
                - social.ts
                - tenant-package.ts
                - tenant.ts
                - user.ts
            - tool
                - gen.ts
                - index.ts
        - request
            - index.ts
            - shared.ts
            - type.ts
    - store
        - index.ts
        - modules
            - app
                - index.ts
            - auth
                - index.ts
                - shared.ts
            - dict
                - index.ts
            - notice
                - index.ts
            - route
                - index.ts
                - shared.ts
            - tab
                - index.ts
                - shared.ts
            - theme
                - index.ts
                - shared.ts
        - plugins
            - index.ts
    - styles
        - css
            - global.css
            - nprogress.css
            - reset.css
            - transition.css
        - scss
            - custom.scss
            - global.scss
            - scrollbar.scss
    - theme
        - settings.ts
        - vars.ts
    - typings
        - api
            - api.d.ts
            - monitor.api.d.ts
            - system.api.d.ts
            - tool.api.d.ts
        - app.d.ts
        - common.d.ts
        - components.d.ts
        - elegant-router.d.ts
        - global.d.ts
        - naive-ui.d.ts
        - router.d.ts
        - storage.d.ts
        - union-key.d.ts
        - vite-env.d.ts
    - utils
        - agent.ts
        - common.ts
        - copy.ts
        - crypto.ts
        - format.ts
        - icon.ts
        - jsencrypt.ts
        - service.ts
        - sse.ts
        - storage.ts
        - websocket.ts
    - views
        - _builtin
            - 403
                - index.vue
            - 404
                - index.vue
            - 500
                - index.vue
            - iframe-page
                - [url].vue
            - login
                - index.vue
                - modules
                    - bind-wechat.vue
                    - code-login.vue
                    - pwd-login.vue
                    - register.vue
                    - reset-pwd.vue
            - social-callback
                - index.vue
            - user-center
                - index.vue
        - home
            - index.vue
            - modules
                - card-data.vue
                - creativity-banner.vue
                - header-banner.vue
                - line-chart.vue
                - pie-chart.vue
                - project-news.vue
        - monitor
            - cache
                - index.vue
            - login-infor
                - index.vue
                - modules
                    - login-infor-search.vue
                    - login-infor-view-drawer.vue
            - online
                - index.vue
                - modules
                    - online-search.vue
            - oper-log
                - index.vue
                - modules
                    - oper-log-search.vue
                    - oper-log-view-drawer.vue
        - system
            - client
                - index.vue
                - modules
                    - client-operate-drawer.vue
                    - client-search.vue
            - config
                - index.vue
                - modules
                    - config-operate-drawer.vue
                    - config-search.vue
            - dept
                - index.vue
                - modules
                    - dept-operate-drawer.vue
                    - dept-search.vue
            - dict
                - data
                    - index.vue
                    - modules
                        - dict-data-operate-drawer.vue
                        - dict-data-search.vue
                - index.vue
                - mitt.ts
                - type
                    - index.vue
                    - modules
                        - dict-type-operate-drawer.vue
                        - dict-type-search.vue
            - menu
                - index.vue
                - modules
                    - menu-operate-drawer.vue
            - notice
                - index.vue
                - modules
                    - notice-operate-drawer.vue
                    - notice-search.vue
            - oss
                - index.vue
                - modules
                    - oss-search.vue
                    - oss-upload-modal.vue
            - oss-config
                - index.vue
                - modules
                    - oss-config-operate-drawer.vue
                    - oss-config-search.vue
            - post
                - index.vue
                - modules
                    - post-operate-drawer.vue
                    - post-search.vue
            - tenant
                - index.vue
                - modules
                    - tenant-operate-drawer.vue
                    - tenant-search.vue
            - user
                - index.vue
                - modules
                    - user-operate-drawer.vue
                    - user-search.vue
        - tool
            - gen
                - index.vue
                - modules
                    - gen-table-db-search.vue
                    - gen-table-import-drawer.vue
                    - gen-table-operate-drawer.vue
                    - gen-table-preview-drawer.vue
                    - gen-table-search.vue
- tsconfig.json
- uno.config.ts
- vite.config.ts
```

## Development Guidelines

### Framework and Language
> This project uses Vue 3 with TypeScript, focusing on modern development practices and type safety.

**Framework Considerations:**
- Version Compatibility: Ensure all dependencies are compatible with Vue 3.4+ and TypeScript 5.3+
- Feature Usage: Leverage Vue 3 Composition API and TypeScript features
- Performance Patterns: Follow Vue 3 best practices for optimal performance
- Upgrade Strategy: Keep dependencies up to date while maintaining compatibility
- Importance Notes for Framework:
	* Use Composition API for better code organization and reusability
	* Implement proper TypeScript types for better development experience
	* Follow Vue 3's reactivity system best practices

**Language Best Practices:**
- Type Safety: Use TypeScript's type system to prevent runtime errors
- Modern Features: Utilize TypeScript's latest features while maintaining compatibility
- Consistency: Apply consistent coding patterns throughout the codebase
- Documentation: Document complex TypeScript implementations and workarounds

### Code Abstraction and Reusability
> The project follows a modular architecture with clear separation of concerns. Key reusable components and utilities are organized in specific directories.

**Modular Design Principles:**
- Single Responsibility: Each module is responsible for only one functionality
- High Cohesion, Low Coupling: Related functions are centralized, reducing dependencies between modules
- Stable Interfaces: Expose stable interfaces externally while internal implementations can vary

**Reusable Component Library:**
```
root
- src
    - components        // Reusable Vue components
        - advanced     // Advanced UI components
        - common       // Common UI components
        - custom       // Custom business components
    - hooks            // Reusable Vue composition functions
        - business     // Business-specific hooks
        - common       // Common utility hooks
    - utils            // Utility functions
        - common.ts    // Common utility functions
        - crypto.ts    // Cryptographic utilities
        - format.ts    // Formatting utilities
        - storage.ts   // Storage utilities
```

### Coding Standards and Tools
**Code Formatting Tools:**
- ESLint: JavaScript/TypeScript code checking
- Prettier: Code formatting
- StyleLint: CSS/SCSS code checking

**Naming and Structure Conventions:**
- Semantic Naming: Variable/function names should clearly express their purpose
- Consistent Naming Style:
  * Vue components: PascalCase (e.g., UserProfile.vue)
  * TypeScript files: camelCase (e.g., userService.ts)
  * CSS/SCSS: kebab-case (e.g., user-profile.scss)
- Directory Structure follows functional responsibility division

### Frontend-Backend Collaboration Standards
**API Design and Documentation:**
- RESTful design principles
	* Use HTTP methods (GET, POST, PUT, DELETE) to represent operations
	* Follow RESTful resource naming conventions
- Timely interface documentation updates
	* Document API endpoints, parameters, and responses
	* Keep API documentation in sync with implementation
- Unified error handling specifications
	* Implement consistent error handling across the application
	* Use appropriate HTTP status codes

**Data Flow:**
- Clear frontend state management
	* Use Pinia for state management
	* Implement proper state persistence strategies
- Data validation on both frontend and backend
	* Validate data types and constraints
	* Implement proper error handling
- Standardized asynchronous operation handling
	* Use consistent API call patterns
	* Implement proper loading and error states

### Performance and Security
**Performance Optimization Focus:**
- Resource loading optimization
	* Use code splitting and lazy loading
	* Implement proper caching strategies
- Rendering performance optimization
	* Use virtualization for large lists
	* Implement proper pagination
- Appropriate use of caching
	* Implement caching strategies for API responses
	* Use browser storage effectively

**Security Measures:**
- Input validation and filtering
	* Validate user inputs and sanitize data
	* Implement proper XSS protection
- Protection of sensitive information
	* Use secure authentication and authorization mechanisms
	* Implement proper token management
- Access control mechanisms
	* Implement role-based access control
	* Use proper permission checking

### Style and UI Guidelines
**UnoCSS Usage:**
- Priority: UnoCSS should be the primary styling solution
- Usage Guidelines:
  * Use UnoCSS utility classes for common styling needs
  * Follow the project's UnoCSS preset configuration
  * Maintain consistency in class naming and usage
  * Document custom UnoCSS utilities when created
  * Prefer UnoCSS over custom SCSS/CSS when possible

### API and Data Handling
**API Request Pattern:**
- Standardized API Response Handling:
  * Use the pattern: `const { data, error } = fetchApi();`
  * `data` represents the successful response data
  * `error` represents any error information
- Error Handling:
  * Implement proper error handling for API responses
  * Use consistent error message formatting
  * Handle network errors appropriately

### Hooks Usage Guidelines
**Boolean and Loading State Management:**
- Use the provided hooks from '@sa/hooks':
  * Boolean state: `import { useBoolean } from '@sa/hooks';`
  * Usage: `const { bool, setTrue, setFalse } = useBoolean();`
- Loading state management:
  * Use: `import { useLoading } from '@sa/hooks';`
  * Usage: `const { loading, startLoading, endLoading } = useLoading();`
- Choose between `useBoolean` and `useLoading` based on actual business requirements

**Table Component Guidelines:**
- Use the provided table hooks:
  * Regular tables: `import { useTable } from '@/hooks/common/table';`
  * Tree tables: `import { useTreeTable } from '@/hooks/common/tree-table';`
- Implementation examples available in:
  * Regular tables: `src/views/system/user/index.vue`
  * Tree tables: `src/views/system/dept/index.vue`
- Follow the established patterns for:
  * Table data management
  * Column configuration
  * Search functionality
  * CRUD operations

**Code Cleanliness:**
- Ensure unused imports and variables are removed
- Use IDE tools or linters to automatically detect and remove unused code
- Apply proper naming conventions for variables that are intentionally unused
  * Prefix with underscore (e.g., `_unusedVar`) to indicate deliberate non-usage
- Keep components clean and optimized by removing any code that doesn't contribute to functionality
