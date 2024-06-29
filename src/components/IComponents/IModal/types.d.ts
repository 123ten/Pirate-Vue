import {ModalProps} from "ant-design-vue";

export interface IDragRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IModalProps extends ModalProps {
  dragModal?: boolean; // 是否允许拖拽 modal 框
  cancelLoading?: boolean; // 取消按钮 loading
  loading?: boolean; // modal 加载loading 包括 body 和 确定按钮
  init?: () => void; // 初始化
}
