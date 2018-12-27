import * as React from 'react';

declare module 'react' {
  function lazy(fn: () => Promise<any>): any;
}
