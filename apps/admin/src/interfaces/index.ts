import { IconButtonProps } from '@mui/material/IconButton'

type IconColor =
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
type FontSize = 'inherit' | 'large' | 'medium' | 'small'

export interface IIconButton extends IconButtonProps {
  iconName: string
  iconColor?: IconColor
  fontSize?: FontSize
  badgeContent?: string
}

export interface AutocompleteOption {
  label: string
  key: string
  value?: any
  inputValue?: string
}

export interface PaginationParam {
  page: string | number
  pageSize: string | number
}

export interface ParamsUpdateMutation<T> {
  id: string
  data: T
}
