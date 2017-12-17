import * as React from 'react'

const css = require('./PageContainer.scss')

type Props = {
  children?: any,
  title: any,
  className?: string
}

const PageContainer = ({children, title, className = ''}: Props) => (
  <div className={css.container + ' ' + className}>
    {title && <h1>{title}</h1>}
    {children}
  </div>
)

export default PageContainer
