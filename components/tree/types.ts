export interface OptionProps {
  text: string;
  render?: Function;
  value: string | number;
  selectEnable?: boolean;
  expandEnable?: boolean;
  disabled?: boolean;
  index: number;
  expandPlace?: boolean;
  parent: string | number;
  expandedIcon?: Function;
  children?: Array<OptionProps>;
}

export interface Props {
  className?: string;
  prefix: string;
  options: Array<OptionProps>;
  selectedKeys?: Array<string | number>;
  expandedKeys?: Array<string | number>;
  rowHeight: number;
  onChange?: (selectedKeys: Array<string | number>, option: OptionProps) => void;
  onExpand?: (expandedKeys: Array<string | number>, option: OptionProps) => void;
  fixedTopBottom: boolean;
  clickRow?: boolean;
}

export interface State {
  selectedKeys?: Array<string | number>;
  expandedKeys?: Array<string | number>;
  tops?: Array<OptionProps>;
  options?: Array<OptionProps>;
  bottoms?: Array<OptionProps>;
  width?: number;
  height?: number;
}

export interface ItemProps {
  option: OptionProps;
  prefix?: string;
  className?: string;
  hasSelected?: boolean;
  expanded: boolean;
  checked: boolean;
  rowHeight: number;
  parentWidth: number;
  onChange?: (type: string, value: boolean) => void;
  clickRow?: boolean;
}

export enum Scroll_Type {
  ALL,
  CONTAINER
}

export enum Insert_Type {
  TOP,
  MIDDLE,
  BOTTOM
}

export enum Render_Type {
  tops = 'tops',
  options = 'options',
  bottoms = 'bottoms'
}
