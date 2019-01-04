import * as React from 'react';
import styled from 'styled-components';

export default styled(
  (props: { className?: string; children: React.ReactNode }) => {
    return React.cloneElement(React.Children.only(props.children), {
      className: props.className
    });
  }
)`
  vertical-align: -0.1rem !important;
  margin-right: 0.1rem;
`;
