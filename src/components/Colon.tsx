import { For } from 'solid-js';
import { styled } from 'solid-styled-components';

const Container = styled.span`
  span::after {
    content: ":";
    vertical-align: 1px;
    margin-right: 1px;
  }

  span:last-child::after {
    display: none;
  }
`;

const Colon = (props: { children: string }) => {
  return (
    <Container>
      <For each={props.children.split(':')}>
        {part => <span>{part}</span>}
      </For>
    </Container>
  );
};

export default Colon;
