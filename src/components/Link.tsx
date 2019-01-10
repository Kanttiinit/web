import * as React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

interface Props extends RouteComponentProps<any> {
  to: string;
}

export default withRouter(({ to, location, ...props }: Props) => (
  <Link {...props} to={{ pathname: to, search: location.search }} />
));
