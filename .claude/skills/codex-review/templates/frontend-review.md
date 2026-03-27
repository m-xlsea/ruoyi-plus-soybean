# Frontend Review Template

审查重点:
1. **可访问性**: ARIA 标签? 键盘导航? 色彩对比?
2. **响应式**: 移动端/平板/桌面 断点覆盖?
3. **XSS 防护**: 用户输入是否转义? dangerouslySetInnerHTML?
4. **性能**: 大列表虚拟滚动? 图片懒加载? 包体积?
5. **状态管理**: 数据流清晰? 避免 prop drilling?
6. **错误边界**: React ErrorBoundary? 加载/空/错误状态?
7. **国际化**: 硬编码文案? 日期/数字格式?
