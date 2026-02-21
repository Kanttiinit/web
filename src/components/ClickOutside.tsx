import { onCleanup, onMount, splitProps } from 'solid-js';

type Props = {
  onClickOutside(): any;
  children: any;
};

const ClickOutside = (props: Props) => {
  const [ownProps, otherProps] = splitProps(props, [
    'onClickOutside',
    'children',
  ]);
  let containerRef: HTMLDivElement | undefined;

  const onClick = (e: MouseEvent) => {
    const clickedInside =
      containerRef?.contains(e.target as Node) || e.target === containerRef;
    if (!clickedInside) {
      ownProps.onClickOutside();
    }
  };

  onMount(() => {
    window.addEventListener('click', onClick);
  });

  onCleanup(() => {
    window.removeEventListener('click', onClick);
  });

  return (
    <div ref={containerRef} {...otherProps}>
      {ownProps.children}
    </div>
  );
};

export default ClickOutside;
