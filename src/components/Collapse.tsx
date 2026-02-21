import { createEffect, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';

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
  const [height, setHeight] = createSignal(0);
  let containerRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (props.isOpen && containerRef) {
      setHeight(containerRef.scrollHeight);
    }
  });

  return (
    <Content contentHeight={props.isOpen ? height() : 0} ref={containerRef}>
      {props.children}
    </Content>
  );
}
