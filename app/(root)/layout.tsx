import React from 'react';

type Props = React.PropsWithChildren<object>; // or 'unknown' based on use case

const Layout = ({children}: Props) => {
  return <div>{children}</div>;
};

export default Layout;
