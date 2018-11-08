import * as React from 'react';

declare module 'react' {
  class Suspense extends React.Component<{
    children: React.ReactChild;
    fallback: React.ReactNode;
  }> {}
  function lazy(fn: () => Promise<any>): any;
}
