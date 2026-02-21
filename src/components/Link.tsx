import { A, useLocation } from "@solidjs/router";

interface Props {
  to: string;
  class?: string;
  style?: any;
  children: any;
  "aria-label"?: any;
}

export default function Link(props: Props) {
  const location = useLocation();
  return (
    <A
      noScroll
      class={props.class}
      style={props.style}
      href={
        !props.to.includes("?") && props.to !== "/"
          ? props.to + location.search
          : props.to
      }
      aria-label={props["aria-label"]}
    >
      {props.children}
    </A>
  );
}
