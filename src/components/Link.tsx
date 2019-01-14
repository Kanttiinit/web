import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps<any> {
  to: string;
  className?: string;
  style?: any;
  children: any;
}

export default withRouter(({ to, children, location, className, style }: Props) => (
  <Link
    className={className}
    style={style}
    to={{ pathname: to, search: location.search }}>
    {children}
  </Link>
));
