import React from 'react'

const PageContainer = ({children, title, className = ''}) => (
  <div className={'page-container ' + className}>
    {title && <h1>{title}</h1>}
    {children}
  </div>
)

export default PageContainer
