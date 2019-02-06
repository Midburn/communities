import React from 'react';

export const AbsoluteNavLink = ({to, children}) => {
  return <a href={to} className="nav-link">{children}</a>;
};
