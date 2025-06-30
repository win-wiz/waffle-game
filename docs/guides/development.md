# 开发指南

## 📋 开发环境设置

### 系统要求
- **Node.js**: v18.17+ 
- **npm**: v9.0+ 或 **pnpm**: v8.0+
- **Git**: v2.34+
- **编辑器**: VS Code (推荐) + TypeScript 扩展

### 快速开始
```bash
# 克隆项目
git clone <repository-url>
cd waffle-solver/waffle-next

# 安装依赖
npm install
# 或
pnpm install

# 启动开发服务器
npm run dev
# 或  
pnpm dev

# 打开浏览器访问
open http://localhost:3000
```

### 开发工具配置

#### VS Code 扩展推荐
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### 工作区设置
```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🏗️ 项目结构

### 目录架构
```
waffle-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 主页面
│   ├── components/            # UI 组件
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   ├── no-ssr.tsx        # SSR 处理组件
│   │   └── theme-provider.tsx # 主题提供者
│   ├── lib/                   # 核心逻辑库
│   │   ├── ai-generator.ts    # AI 生成器
│   │   ├── board.ts          # 游戏板逻辑
│   │   ├── solution.ts       # 解决方案算法
│   │   ├── swap-chooser.ts   # 交换策略
│   │   ├── swaps.ts          # 交换操作
│   │   ├── utils.ts          # 工具函数
│   │   └── words.ts          # 单词管理
│   ├── types/                 # TypeScript 类型定义
│   │   └── index.ts
│   ├── constants/             # 常量配置
│   │   └── index.ts
│   └── hooks/                 # 自定义 Hooks
│       └── use-toast.ts
├── docs/                      # 项目文档
├── public/                    # 静态资源
└── 配置文件...
```

### 关键文件说明

#### `/src/app/page.tsx`
- **作用**: 主游戏界面
- **职责**: 游戏状态管理、用户交互、动画控制
- **关键功能**: 
  - Waffle 游戏逻辑
  - 弧线交换动画
  - Toast 通知系统
  - 经典谜题集

#### `/src/lib/` 核心库
- **board.ts**: 游戏板状态管理和颜色计算
- **solution.ts**: 求解算法和可能解分析  
- **words.ts**: 单词生成和验证逻辑
- **ai-generator.ts**: AI 提示词和响应处理

#### `/src/types/index.ts`
```typescript
// 核心类型定义
export type Letter = string;
export type Board<T> = readonly [T, T, T, ...T[]];
export type SquareNumber = 0 | 1 | 2 | ... | 20;

export enum Color {
  Green = 'green',    // 正确位置
  Yellow = 'yellow',  // 存在但位置错误
  Grey = 'grey'       // 不存在
}

export interface Tile {
  letter: Letter;
  color: Color;
}
```

## 💻 开发工作流

### 分支策略
```bash
main                    # 生产分支
├── develop            # 开发分支
├── feature/toast-optimization    # 功能分支
├── feature/classic-puzzles      # 功能分支
└── hotfix/animation-bug         # 热修复分支
```

### 提交规范
```bash
# 提交格式
<type>(<scope>): <description>

# 类型说明
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式调整
refactor: 重构
test:     测试相关
chore:    构建工具或辅助工具的变动

# 示例
feat(toast): 添加右上角通知系统
fix(animation): 修复弧线动画卡顿问题
docs(readme): 更新安装指南
```

### 代码审查清单
- [ ] **类型安全**: 所有变量都有明确类型
- [ ] **性能考虑**: 避免不必要的重渲染
- [ ] **可访问性**: 支持键盘导航和屏幕阅读器
- [ ] **错误处理**: 妥善处理边界情况
- [ ] **代码质量**: 遵循项目代码规范
- [ ] **测试覆盖**: 关键逻辑有对应测试

## 🧪 测试策略

### 测试架构
```typescript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe } from '@jest/globals';

describe('TileComponent', () => {
  test('应该正确显示字母和颜色', () => {
    const tile = { letter: 'A', color: Color.Green };
    render(<TileComponent tile={tile} position={0} ... />);
    
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('green');
  });
});
```

### 测试分类

#### 1. 单元测试 (Unit Tests)
```bash
# 运行单元测试
npm run test

# 覆盖率报告
npm run test:coverage
```

- **算法测试**: 求解算法、颜色计算逻辑
- **工具函数**: 纯函数的输入输出验证
- **组件逻辑**: React 组件的状态和行为

#### 2. 集成测试 (Integration Tests)
- **游戏流程**: 完整的游戏操作流程
- **API 集成**: AI 生成器的接口调用
- **状态管理**: 复杂状态变化的验证

#### 3. 端到端测试 (E2E Tests)
```typescript
// Playwright 示例
import { test, expect } from '@playwright/test';

test('完整游戏流程', async ({ page }) => {
  await page.goto('/');
  
  // 点击两个瓦片进行交换
  await page.click('[data-testid="tile-0"]');
  await page.click('[data-testid="tile-1"]');
  
  // 验证动画执行
  await expect(page.locator('.swap-animation')).toBeVisible();
  
  // 验证状态更新
  await expect(page.locator('[data-testid="move-count"]')).toContainText('1');
});
```

### 测试数据管理
```typescript
// 测试用例数据
export const TEST_BOARDS = {
  solved: [
    { letter: 'S', color: Color.Green },
    { letter: 'I', color: Color.Green },
    // ... 完整的已解决游戏板
  ],
  
  unsolved: [
    { letter: 'N', color: Color.Yellow },
    { letter: 'I', color: Color.Green },
    // ... 需要解决的游戏板
  ]
};
```

## 🎨 样式开发指南

### Tailwind CSS 使用规范
```typescript
// ✅ 推荐：使用 clsx 组合条件样式
import { clsx } from 'clsx';

const tileClasses = clsx(
  'w-20 h-20 flex items-center justify-center text-2xl font-bold',
  'rounded-lg border-2 transition-all duration-200',
  {
    'border-blue-500 scale-105': isSelected,
    'border-green-500 bg-green-100': tile.color === Color.Green,
    'border-yellow-500 bg-yellow-100': tile.color === Color.Yellow,
    'border-gray-300 bg-gray-100': tile.color === Color.Grey,
  }
);

// ❌ 避免：内联样式混合
<div className="w-20 h-20" style={{ transform: 'scale(1.05)' }} />
```

### CSS 自定义属性
```css
/* 全局 CSS 变量 */
:root {
  --waffle-primary: hsl(222.2 84% 4.9%);
  --waffle-secondary: hsl(210 40% 98%);
  --waffle-accent: hsl(210 40% 8%);
  
  --animation-duration-fast: 200ms;
  --animation-duration-normal: 300ms;
  --animation-duration-slow: 500ms;
}

/* 动画类 */
.waffle-tile {
  transition: all var(--animation-duration-normal) cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 响应式设计
```typescript
// 响应式断点
const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
};

// 移动端优先的组件设计
<div className="
  w-full max-w-sm mx-auto    // 移动端：全宽，最大宽度
  md:max-w-md                // 平板：中等宽度
  lg:max-w-lg                // 桌面：大宽度
">
```

## 🚀 性能优化

### React 性能优化
```typescript
// 1. 使用 memo 避免不必要的重渲染
const TileComponent = React.memo(({ tile, position, onTileClick }) => {
  // 组件实现
});

// 2. 使用 useCallback 缓存函数
const handleTileClick = useCallback((position: SquareNumber) => {
  // 处理逻辑
}, [selectedPositions, gameStatus]);

// 3. 使用 useMemo 缓存计算结果
const boardWithColors = useMemo(() => {
  return recalculateColors(board);
}, [board, currentSolution]);

// 4. 批量状态更新
React.unstable_batchedUpdates(() => {
  setBoard(newBoard);
  setMoveCount(newMoveCount);
  setGameStatus('won');
});
```

### 动画性能优化
```css
/* GPU 加速 */
.waffle-tile {
  will-change: transform, opacity;
  contain: layout style paint;
}

/* 减少重绘范围 */
.swap-animation-overlay {
  contain: strict;
  position: absolute;
  z-index: 100;
}
```

### 包大小优化
```typescript
// 动态导入
const GameEndDialog = dynamic(() => import('./GameEndDialog'), {
  loading: () => <div>Loading...</div>
});

// Tree-shaking 友好的导入
import { toast } from 'sonner';  // ✅
import * as sonner from 'sonner'; // ❌
```

## 🔧 调试技巧

### React DevTools
```typescript
// 组件性能分析
const TileComponent = React.memo(({ tile }) => {
  // 添加调试信息
  React.useDebugValue(`Tile: ${tile.letter}-${tile.color}`);
  
  return <div>{tile.letter}</div>;
});
```

### 控制台调试
```typescript
// 开发环境专用的调试信息
if (process.env.NODE_ENV === 'development') {
  console.group('🎮 游戏状态更新');
  console.log('当前游戏板:', board);
  console.log('移动次数:', moveCount);
  console.log('游戏状态:', gameStatus);
  console.groupEnd();
}
```

### 性能监控
```typescript
// 自定义性能标记
const performSwap = useCallback((pos1, pos2) => {
  performance.mark('swap-start');
  
  // 执行交换逻辑
  executeSwap(pos1, pos2);
  
  performance.mark('swap-end');
  performance.measure('swap-duration', 'swap-start', 'swap-end');
}, []);
```

## 📱 移动端开发

### 触摸事件处理
```typescript
// 支持触摸和鼠标事件
const handlePointerDown = useCallback((e: React.PointerEvent) => {
  e.preventDefault();
  // 处理触摸开始
}, []);

<div
  onPointerDown={handlePointerDown}
  className="touch-manipulation" // 优化触摸响应
>
```

### 视口配置
```html
<!-- 移动端视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

### PWA 支持
```typescript
// 下一步计划：渐进式 Web 应用
const PWAConfig = {
  name: 'Waffle Solver',
  short_name: 'Waffle',
  description: '智能单词谜题游戏',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#000000',
};
```

## 🐛 常见问题解决

### 1. Hydration 错误
```typescript
// 问题：SSR 和客户端渲染不一致
// 解决：使用 NoSSR 组件
const NoSSR = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), {
  ssr: false
});

<NoSSR>
  <Toaster />
</NoSSR>
```

### 2. 状态更新延迟
```typescript
// 问题：状态更新不及时
// 解决：使用 flushSync 强制同步更新
import { flushSync } from 'react-dom';

flushSync(() => {
  setBoard(newBoard);
  setMoveCount(count + 1);
});
```

### 3. 内存泄漏
```typescript
// 问题：组件卸载后定时器仍在运行
// 解决：清理副作用
useEffect(() => {
  const timer = setTimeout(() => {
    setJustSwappedPositions([]);
  }, 800);
  
  return () => clearTimeout(timer); // 清理定时器
}, [justSwappedPositions]);
```

## 📚 学习资源

### 技术文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 18 特性](https://react.dev/blog/2022/03/29/react-v18)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### 最佳实践
- [React 性能优化](https://react.dev/learn/render-and-commit)
- [TypeScript 最佳实践](https://typescript-eslint.io/rules/)
- [可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)

### 项目参考
- [Wordle 实现](https://github.com/cwackerfuss/react-wordle)
- [Next.js 示例](https://github.com/vercel/next.js/tree/canary/examples)

---

*开发指南版本: v1.0*  
*最后更新: 2024-06-27* 