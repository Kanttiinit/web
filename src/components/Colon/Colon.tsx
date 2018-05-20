import * as React from 'react';

import css from './Colon.scss';

const Colon = ({ children }: { children: string }) => {
  const parts = children.split(':');
  return (
    <span className={css.container}>
      {parts.map((part, i) => <span key={i}>{part}</span>)}
    </span>
  );
};

export default Colon;
