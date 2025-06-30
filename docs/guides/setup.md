# Waffle Solver - Next.js 15 重构版

> 🧇 智能Waffle单词游戏求解器 - 基于Next.js 15 + App Router + TypeScript构建

## 项目概述

Waffle Solver是一个智能的单词谜题求解器，专为Waffle游戏设计。该项目使用先进的算法分析字母网格，快速找到最优解决方案。

### 核心功能

- 🎯 **智能解题算法**: 基于约束满足和图论的高效求解引擎
- 🔄 **最优交换策略**: 最小化交换次数的智能路径规划
- 🎨 **直观用户界面**: 现代化的响应式设计，支持移动端
- ⚡ **高性能优化**: 组件级缓存、懒加载、并行计算
- 🧩 **多解决方案处理**: 智能选择最佳下一步策略

## 技术架构

### 前端技术栈

- **框架**: Next.js 15 with App Router
- **语言**: TypeScript 5.0+
- **样式**: Tailwind CSS 3.3+
- **状态管理**: React Hooks (useState, useCallback, useMemo)
- **性能优化**: React.memo, 组件懒加载
- **测试**: Jest + React Testing Library

### 核心算法模块

```
src/lib/
├── board.ts           # 游戏板数据结构与操作
├── solution.ts        # 解题算法核心逻辑
├── swaps.ts          # 交换序列计算
├── swap-chooser.ts   # 最优交换选择器
├── words.ts          # 词库管理与搜索
└── types/            # TypeScript类型定义
```

### 组件架构

```
src/components/
├── TileComponent.tsx      # 单个字母瓦片
├── BoardComponent.tsx     # 游戏板网格
├── SwapDisplay.tsx        # 交换建议展示
├── SolutionPanel.tsx      # 解决方案面板
└── LoadingSpinner.tsx     # 加载动画
```

## 核心算法详解

### 1. 解题算法 (solution.ts)

**算法复杂度**: O(W^6)，其中W为候选词汇数量

**优化策略**:
- 约束传播：字母计数提前终止
- 交叉验证：横纵单词交叉点一致性检查
- 启发式剪枝：优先处理约束最强的位置

```typescript
// 核心解题流程
export function possibleSolutionsFromBoard(board: Board<Tile>): Set<SerializedSolution> {
  // 1. 词汇匹配：为每个位置找到符合颜色约束的候选词汇
  // 2. 组合生成：生成所有可能的6个单词组合
  // 3. 约束验证：字母计数 + 交叉点一致性
  // 4. 解决方案输出：返回所有有效解
}
```

### 2. 交换算法 (swaps.ts)

**核心思想**: 循环分解算法，将置换分解为最小交换序列

**算法步骤**:
1. 构建字母映射关系
2. 识别循环组
3. 分解复杂循环
4. 生成最小交换序列

```typescript
// 交换序列计算
export function findSwaps(start: SerializedSolution, end: SerializedSolution): Swap[] {
  // 时间复杂度: O(N²)，空间复杂度: O(N)
  // 保证生成最少的交换步骤
}
```

### 3. 最优选择器 (swap-chooser.ts)

**策略**: 多解决方案场景下的贪心算法

**评分机制**:
- 计算每个可能交换后到达各解决方案的平均剩余步数
- 选择平均剩余步数最少的交换
- 支持启发式快速选择

## 性能优化

### 1. 前端优化

- **组件级优化**: React.memo + 自定义比较函数
- **状态管理**: useCallback 防止不必要的重渲染
- **计算缓存**: useMemo 缓存昂贵计算结果
- **代码分割**: 动态导入非关键组件

### 2. 算法优化

- **Trie数据结构**: 词汇搜索时间复杂度 O(L)
- **预计算映射**: 位置转换使用预建索引
- **约束传播**: 提前终止无效分支
- **并行处理**: 支持Web Workers（可选）

### 3. 构建优化

- **包大小优化**: lodash按需导入
- **静态资源**: 图片压缩、字体子集化
- **缓存策略**: 浏览器缓存 + CDN加速

## 快速开始

### 环境要求

- Node.js 18.0+
- npm 9.0+ 或 yarn 1.22+

### 安装依赖

```bash
cd waffle-next
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用

### 构建部署

```bash
npm run build
npm start
```

### 测试

```bash
npm test                 # 单次测试
npm run test:watch      # 监听模式
```

## 使用指南

### 1. 输入字母网格

- 点击每个位置选择字母
- 使用颜色按钮设置约束：
  - 🟢 **绿色**: 字母在正确位置
  - 🟡 **黄色**: 字母存在但位置错误  
  - ⚪ **灰色**: 字母不在该单词中

### 2. 获取解决方案

- 点击"获取解决方案"按钮
- 系统分析并返回结果：
  - **单一解决方案**: 显示完整交换序列
  - **多个解决方案**: 显示建议的下一步交换

### 3. 执行交换

- 按照建议逐步执行交换
- 系统会自动更新颜色状态
- 重复直到完成所有交换

## 项目结构对比

### 原始项目 (React CRA)
```
src/
├── App.tsx           # 单一大组件
├── lib/              # 核心算法
└── index.tsx         # 入口文件
```

### 重构后项目 (Next.js 15)
```
waffle-next/
├── src/
│   ├── app/                    # App Router
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页面
│   │   └── globals.css         # 全局样式
│   ├── components/             # UI组件
│   │   ├── TileComponent.tsx   # 瓦片组件
│   │   ├── BoardComponent.tsx  # 游戏板组件
│   │   └── SwapDisplay.tsx     # 交换展示
│   ├── hooks/                  # 自定义Hooks
│   │   └── useWaffleSolver.ts  # 主要游戏逻辑
│   ├── lib/                    # 核心算法库
│   │   ├── board.ts            # 游戏板操作
│   │   ├── solution.ts         # 解题算法
│   │   ├── swaps.ts            # 交换计算
│   │   ├── swap-chooser.ts     # 选择策略
│   │   └── words.ts            # 词库管理
│   └── types/                  # TypeScript类型
│       └── index.ts            # 统一类型导出
├── package.json
├── next.config.js              # Next.js配置
├── tailwind.config.js          # Tailwind配置
├── tsconfig.json               # TypeScript配置
└── README.md
```

## 重构优势

### 1. 架构改进

- **模块化设计**: 功能按职责明确分离
- **类型安全**: 完整的TypeScript类型定义
- **组件复用**: 高度可复用的UI组件
- **状态管理**: 清晰的状态流和副作用处理

### 2. 性能提升

- **SSR支持**: Next.js服务端渲染
- **自动优化**: 代码分割、图片优化、字体优化
- **缓存策略**: 多层缓存机制
- **并发处理**: 异步算法执行

### 3. 开发体验

- **热重载**: 快速开发反馈
- **TypeScript**: 编译时错误检查
- **ESLint/Prettier**: 代码质量保证
- **测试覆盖**: 完整的单元测试

### 4. 部署优化

- **Vercel友好**: 一键部署
- **边缘计算**: 全球CDN加速
- **性能监控**: 内置性能分析
- **SEO优化**: 更好的搜索引擎优化

## 算法复杂度分析

| 模块 | 时间复杂度 | 空间复杂度 | 优化策略 |
|------|------------|------------|----------|
| 词汇搜索 | O(W×L) | O(W×L) | Trie树结构 |
| 解决方案生成 | O(W^6) | O(S×21) | 约束传播 |
| 交换计算 | O(N²) | O(N) | 循环分解 |
| 最优选择 | O(N²×S) | O(N²) | 启发式算法 |

*W: 词汇数量, L: 单词长度, N: 网格大小, S: 解决方案数量*

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目链接: [https://github.com/yourname/waffle-solver-next](https://github.com/yourname/waffle-solver-next)
- 演示地址: [https://waffle-solver.vercel.app](https://waffle-solver.vercel.app)

---

**⭐ 如果这个项目对您有帮助，请给个Star！** 