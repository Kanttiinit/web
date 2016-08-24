import React from 'react'
import loaderImg from '../assets/loader.svg'

const Loader = () => (
  <div style={{textAlign: 'center', margin: '4rem 1rem'}}>
    <img width="100" height="100" src={loaderImg} />
  </div>
)

export default Loader
