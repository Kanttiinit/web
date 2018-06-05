import * as React from 'react';

import * as css from './Colon.scss';

const Colon = ({ text }: { text: string }) => {
  const parts = text.split(':');
  return (
    <span className={css.container}>
      {parts.map((part, i) => <span key={i}>{part}</span>)}
    </span>
  );
};

export default Colon;
