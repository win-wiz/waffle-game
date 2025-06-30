# Toast 通知系统

## 📋 功能概述

Toast 通知系统是 Waffle Solver 的核心用户交互组件，用于向用户提供即时反馈和状态更新。

## 🎯 设计目标

### 用户体验目标
- 提供清晰、及时的操作反馈
- 不干扰游戏主要界面
- 支持多种消息类型和优先级
- 优雅的动画效果和视觉层次

### 技术目标
- 性能优化，避免 hydration 错误
- 支持多层级展示
- 响应式设计，适配各种屏幕尺寸
- 可配置的显示时长和位置

## 🏗️ 技术实现

### 技术选型
- **shadcn/ui + sonner**: 替代原有的 radix-ui toast
- **next-themes**: 主题支持
- **NoSSR 包装**: 解决 hydration 问题

### 核心配置
```typescript
// Toaster 配置
<Toaster 
  position="top-right"        // 右上角显示
  duration={4000}            // 4秒显示时长
  expand={true}              // 多层级展示
  richColors={true}          // 丰富颜色主题
  closeButton={true}         // 显示关闭按钮
/>
```

### 消息类型
```typescript
// 成功消息
toast.success("🎉 恭喜！游戏完成！", {
  description: "您用 X 步完成了Waffle谜题，太棒了！"
});

// 错误消息
toast.error("⚠️ 无法交换", {
  description: "位置 X 的字母已经在正确位置，无法进行交换"
});

// 信息消息
toast.info("💡 智能建议", {
  description: "建议交换位置 X 和 Y，这可能会改善当前情况。"
});

// 普通消息
toast("🔄 游戏重置", { 
  description: "游戏已重置到初始状态，开始新的挑战！" 
});
```

## 🔧 技术挑战与解决方案

### 1. Hydration Mismatch 问题
**问题**: SSR 和客户端渲染不一致导致 hydration 错误

**解决方案**:
```typescript
// 使用 NoSSR 组件包装
const NoSSR = dynamic(() => Promise.resolve(({ children }) => <>{children}</>), {
  ssr: false
});

// ThemeProvider 优化
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

### 2. CSS 变量格式问题
**问题**: Tailwind CSS 变量格式不兼容

**解决方案**:
```css
/* 修正 CSS 变量格式 */
:root {
  --background: hsl(0 0% 100%);     /* 正确格式 */
  --foreground: hsl(222.2 84% 4.9%);
}
```

### 3. 多层级展示优化
**问题**: 多个 toast 同时显示时的视觉层次

**解决方案**:
- 启用 `expand={true}` 支持多层级
- 优化动画曲线和时长
- 合理的 z-index 层级管理

## 📊 使用场景

### 游戏操作反馈
- ✅ 交换成功确认
- ❌ 无效操作警告
- 🎯 AI 建议提示
- 🎉 游戏完成庆祝

### 系统状态通知
- 🔄 游戏重置确认
- 🎲 新谜题生成状态
- ⚡ AI 分析进度
- 🏛️ 经典谜题加载

### 错误处理
- 🚫 无效交换阻止
- ❌ AI 生成失败
- ⚠️ 网络连接问题
- 🔧 系统错误提示

## 🎨 视觉设计

### 位置策略
- **右上角定位**: 不遮挡游戏主界面
- **多层级堆叠**: 新消息在上，旧消息下沉
- **响应式适配**: 移动端自动调整位置

### 动画效果
- **入场动画**: 从右侧滑入，带弹性效果
- **退场动画**: 向右淡出，平滑消失
- **交互动画**: 悬停效果和点击反馈

### 颜色主题
- **成功**: 绿色系 (#10b981)
- **错误**: 红色系 (#ef4444)
- **警告**: 橙色系 (#f59e0b)
- **信息**: 蓝色系 (#3b82f6)

## 🚀 性能优化

### 渲染优化
- 使用 `NoSSR` 避免 hydration 问题
- 动态导入减少初始包大小
- CSS-in-JS 避免样式冲突

### 内存管理
- 自动清理过期 toast
- 限制同时显示数量
- 防抖机制避免重复消息

## 📈 未来扩展

### 计划功能
- 📱 移动端适配优化
- 🔊 声音提示选项
- 📊 消息历史记录
- 🎨 自定义主题配置
- 🌐 国际化支持

### 技术改进
- 更精细的动画控制
- 可配置的显示规则
- 更好的可访问性支持
- 性能监控和分析

---

*文档版本: v1.0*  
*最后更新: 2024-06-27* 