import React from 'react'
import css from '../styles/Tooltip.scss'

export default class Tooltip extends React.Component {
  constructor() {
    super()
    this.state = {isVisible: false}
  }
  showTooltip(element) {
    if (!this.state.isVisible) {
      this.setState({isVisible: true})
      const position = element.getBoundingClientRect()
      const tooltipPosition = this.tooltip.getBoundingClientRect()
      this.tooltip.style.marginTop = ((this.props.margin || 0) + position.top + position.height - tooltipPosition.top) + 'px'
      this.tooltip.style.marginLeft = (position.left + position.width / 2 - tooltipPosition.left - tooltipPosition.width / 2) + 'px'
      this.checkBounds()
    }
  }
  checkBounds() {
    const sideMargin = 16
    const windowWidth = window.innerWidth
    const tooltipRect = this.tooltip.getBoundingClientRect()
    const tooltipRight = tooltipRect.left + tooltipRect.width + sideMargin
    let adjustment = 0
    if (tooltipRight > windowWidth) {
      adjustment = windowWidth - tooltipRight
    } else if (tooltipRect.left < sideMargin) {
      adjustment = sideMargin / 2 - tooltipRect.left
    }
    this.tooltip.style.marginLeft = (parseFloat(this.tooltip.style.marginLeft) + adjustment) + 'px'
  }
  hideTooltip() {
    this.setState({isVisible: false})
  }
  render() {
    const {content, children, margin, element = 'span', ...props} = this.props
    const {isVisible} = this.state
    return React.createElement(
      element,
      {
        ref: e => {
          if (!this.initialized) {
            e.addEventListener('focus', () => this.showTooltip(e))
            e.addEventListener('mouseover', () => this.showTooltip(e))

            e.addEventListener('blur', () => this.hideTooltip())
            e.addEventListener('mouseout', () => this.hideTooltip())
            this.initialized = true
          }
        },
        ...props
      },
    children,
    isVisible && <div className={css.tooltip} ref={e => this.tooltip = e}>{content}</div>)
  }
}
