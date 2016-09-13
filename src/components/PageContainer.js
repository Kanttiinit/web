import React from 'react'

import css from '../styles/PageContainer.scss'

const PageContainer = ({children, title, className = ''}) => (
  <div className={css.container + ' ' + className}>
    {title && <h1>{title}</h1>}
    {children}
  </div>
)

export default PageContainer
