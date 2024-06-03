
export type OverlayType = 'reload' | 'close' | 'fullScreen' | 'closeOther' | 'closeAll'

export interface OverlayProps {
  disabled?: (type: OverlayType) => boolean
}
