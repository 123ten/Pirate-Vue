interface IDragRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IModalProps {
  title?: string; // modal 标题
  width?: string | number; // modal 宽度
  visible: boolean; // 控制 modal 开关
  maskClosable?: boolean; // 点击蒙层是否允许关闭
  dragModal?: boolean; // 是否允许拖拽 modal 框
  cancelLoading?: boolean; // 取消按钮 loading
  loading?: boolean; // modal 加载loading 包括 body 和 确定按钮
  bodyStyle?: CSSProperties; // body 样式
  init?: () => void; // 初始化
}

export { IDragRect };
