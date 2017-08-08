// @flow
import React from 'react'

import css from '../styles/PageContainer.scss'

type Props = {
  children?: any,
  title: string | React.Element<*>,
  className?: string
};

const PageContainer = ({children, title, className = ''}: Props) => (
  <div className={css.container + ' ' + className}>
    {title && <h1>{title}</h1>}
    {children}
  </div>
)

export default PageContainer
