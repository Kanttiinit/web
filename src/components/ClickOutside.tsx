import * as React from 'react';

type Props = {
  onClickOutside(): any;
  children: any;
};

const ClickOutside = (props: Props) => {
  const { onClickOutside, children, ...otherProps } = props;
  const containerRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const clickedInside =
        containerRef.current.contains(e.target as Node) ||
        e.target === containerRef.current;
      if (!clickedInside) {
        onClickOutside();
      }
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [onClickOutside]);

  return (
    <div ref={containerRef} {...otherProps}>
      {children}
    </div>
  );
};

export default ClickOutside;
