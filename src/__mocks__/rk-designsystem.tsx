import React from 'react';

const createMock = (name: string) => {
  const Component = ({ children, ...props }: any) => <div data-testid={name} {...props}>{children}</div>;
  Component.displayName = name;
  return Component;
};

export const Header = createMock('Header');
export const Heading = createMock('Heading');
export const Paragraph = createMock('Paragraph');
export const Button = createMock('Button');
export const Card = createMock('Card');
export const CardBlock = createMock('CardBlock');
export const Divider = createMock('Divider');
export const Tag = createMock('Tag');
export const Avatar = createMock('Avatar');
export const Pagination = Object.assign(createMock('Pagination'), {
  List: createMock('Pagination.List'),
  Item: createMock('Pagination.Item'),
  Button: createMock('Pagination.Button'),
});
export const Tabs = Object.assign(createMock('Tabs'), {
  List: createMock('Tabs.List'),
  Tab: createMock('Tabs.Tab'),
  Panel: createMock('Tabs.Panel'),
});
