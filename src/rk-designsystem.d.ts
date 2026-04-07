// Type augmentation for rk-designsystem components
// The Figma compiler generates className props on DS components
// but the DS types don't declare them
declare module 'rk-designsystem' {
  import { FC } from 'react';

  export const Heading: FC<any>;
  export const Paragraph: FC<any>;
  export const Button: FC<any>;
  export const Card: FC<any>;
  export const CardBlock: FC<any>;
  export const Divider: FC<any>;
  export const Header: FC<any>;
  export const Tag: FC<any>;
  export const Avatar: FC<any>;
  export const Tabs: FC<any> & {
    List: FC<any>;
    Tab: FC<any>;
    Panel: FC<any>;
  };
  export const Pagination: FC<any> & {
    List: FC<any>;
    Item: FC<any>;
    Button: FC<any>;
  };
  export const Chip: FC<any> & {
    Button: FC<any>;
    Checkbox: FC<any>;
    Radio: FC<any>;
    Removable: FC<any>;
  };
  export function usePagination(options: {
    currentPage: number;
    totalPages: number;
    onChange?: (e: any, page: number) => void;
  }): {
    pages: Array<{ page: number | string; itemKey: string; buttonProps: any }>;
    prevButtonProps: any;
    nextButtonProps: any;
  };
}
