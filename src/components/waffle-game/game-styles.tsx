export function GameStyles() {
  return (
    <style jsx global>{`

      /* 华夫饼纹理 */
      .waffle-texture {
        background-image: 
          linear-gradient(45deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(139, 69, 19, 0.1) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(139, 69, 19, 0.1) 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      }

      /* 交换完成后的高亮动画 */
      @keyframes swap-highlight {
        0% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.3);
          transform: scale(1.05);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          transform: scale(1);
        }
      }



      /* 确保交换动画元素在最顶层 */
      .swap-animation-container {
        z-index: 9999 !important;
      }
    `}</style>
  );
}
