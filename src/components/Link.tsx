import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps<any> {
  to: string;
  className?: string;
  style?: any;
  children: any;
  'aria-label'?: any;
}

export default withRouter(
  ({ to, children, location, className, style, ...rest }: Props) => (
    <Link
      className={className}
      style={style}
      to={{ pathname: to, search: location.search }}
      aria-label={rest['aria-label']}
    >
      {children}
    </Link>
  )
);
