# ESLint 代码检测配置

本文档介绍项目中 ESLint 代码检测机制的配置和使用方法。

## 📋 配置文件

项目已经配置了以下 ESLint 相关文件：

- `.eslintrc.json` - ESLint 主配置文件
- `.eslintignore` - ESLint 忽略文件配置
- `.prettierrc` - Prettier 代码格式化配置
- `.prettierignore` - Prettier 忽略文件配置
- `.vscode/settings.json` - VSCode 编辑器配置
- `.vscode/extensions.json` - VSCode 推荐扩展配置

## 🚀 使用方法

### 命令行工具

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 严格模式检查（不允许任何警告）
npm run lint:strict

# TypeScript 类型检查
npm run type-check
```

### VSCode 编辑器集成

1. 安装推荐的扩展：
   - ESLint
   - Prettier - Code formatter
   - Tailwind CSS IntelliSense

2. 配置会自动：
   - 在保存时运行 ESLint 自动修复
   - 显示代码质量问题的下划线提示
   - 提供快速修复建议

## ⚙️ 配置规则

### TypeScript 规则
- `@typescript-eslint/no-unused-vars` - 检测未使用的变量
- `@typescript-eslint/no-explicit-any` - 警告使用 `any` 类型

### React 规则
- `react-hooks/rules-of-hooks` - 强制执行 Hooks 规则
- `react-hooks/exhaustive-deps` - 检查 useEffect 依赖

### 代码风格规则
- `quotes: 'single'` - 使用单引号
- `semi: true` - 要求分号
- `indent: 2` - 2 空格缩进
- `comma-dangle: 'never'` - 禁止尾随逗号

### Next.js 规则
- `@next/next/no-img-element` - 使用 Next.js Image 组件
- `@next/next/no-html-link-for-pages` - 使用 Next.js Link 组件

## 🔧 常见问题修复

### 1. 未使用的变量
```typescript
// ❌ 错误
import { useState, useEffect } from 'react';

// ✅ 正确 - 移除未使用的导入
import { useState } from 'react';

// ✅ 或者使用下划线前缀表示故意未使用
const [_unusedState, setUsedState] = useState();
```

### 2. React Hooks 规则
```typescript
// ❌ 错误 - 条件性调用 Hook
if (condition) {
  const [state, setState] = useState();
}

// ✅ 正确 - 始终在组件顶层调用 Hook
const [state, setState] = useState();
if (condition) {
  // 使用 state
}
```

### 3. Console 语句
```typescript
// ❌ 警告 - 生产环境中的 console
console.log('Debug info');

// ✅ 正确 - 使用条件判断或移除
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

### 4. React 实体转义
```jsx
// ❌ 错误
<p>Don't use unescaped quotes</p>

// ✅ 正确
<p>Don&apos;t use unescaped quotes</p>
// 或者
<p>{"Don't use unescaped quotes"}</p>
```

## 📊 CI/CD 集成

在 GitHub Actions 或其他 CI/CD 系统中，可以添加 lint 检查：

```yaml
- name: Run ESLint
  run: npm run lint:strict

- name: Run TypeScript Check
  run: npm run type-check
```

## 🎯 最佳实践

1. **定期运行检查**：在提交代码前运行 `npm run lint:fix`
2. **修复警告**：不要忽略 ESLint 警告，及时修复
3. **配置编辑器**：使用 VSCode 配置实现实时检查
4. **团队一致性**：确保团队成员使用相同的 ESLint 配置
5. **渐进式修复**：对于大型项目，可以逐步修复现有问题

## 📚 扩展阅读

- [ESLint 官方文档](https://eslint.org/docs/)
- [Next.js ESLint 配置](https://nextjs.org/docs/app/api-reference/config/eslint)
- [TypeScript ESLint 规则](https://typescript-eslint.io/rules/)
- [React Hooks ESLint 插件](https://www.npmjs.com/package/eslint-plugin-react-hooks)
