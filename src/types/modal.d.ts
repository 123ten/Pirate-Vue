export interface ModalProps<O> {
  /**
   * 显示与隐藏
   */
  visible: boolean;
  /**
   * 父级传入数据
   */
  options?: O;
}
