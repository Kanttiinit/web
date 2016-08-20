import React from 'React'
import {AppLinks} from './Header'

const Footer = () => (
  <footer className="footer">
    <a href="/">Ruokalistat</a>&bull;
    <a href="/contact">Ota yhteyttä</a>&bull;
    <a href="/privacy-policy">Yksityisyyskäytäntö</a>&bull;
    <a href="https://github.com/Kanttiinit" target="_blank">Lähdekoodi</a>
    <AppLinks style={{marginTop: '2rem'}} />
  </footer>
)

export default Footer
