import React from 'react'

const PageContainer = ({children, title}) => (
  <div className="page-container">
    <h1>{title}</h1>
    {children}
  </div>
)

export default PageContainer
