import * as React from 'react';
import styled from 'solid-styled-components';

interface Props {
  children: any;
  isOpen: boolean;
}

const Content = styled.div<{ contentHeight: number }>`
  overflow: hidden;
  height: ${props => props.contentHeight}px;
  transition: height 0.2s;
`;

export default function Collapse(props: Props) {
  const [height, setHeight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.scrollHeight);
    }
  }, [props.isOpen]);

  return (
    <Content contentHeight={props.isOpen ? height : 0} ref={containerRef}>
      {props.children}
    </Content>
  );
}
