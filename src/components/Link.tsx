import { A } from '@solidjs/router';

interface Props {
  to: string;
  class?: string;
  style?: any;
  children: any;
  'aria-label'?: any;
}

export default function Link(props: Props) {
  return (
    <A
      noScroll
      class={props.class}
      style={props.style}
      href={props.to}
      aria-label={props['aria-label']}
    >
      {props.children}
    </A>
  );
}
