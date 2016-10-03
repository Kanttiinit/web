import React from 'react'
import css from '../styles/Tooltip.scss'

export default class Tooltip extends React.Component {
  constructor() {
    super()
    this.state = {isVisible: false}
  }
  showTooltip(position) {
    if (!this.state.isVisible) {
      this.setState({isVisible: true})
      const tooltipPosition = this.tooltip.getBoundingClientRect()
      this.tooltip.style.marginTop = ((this.props.margin || 0) + position.top + position.height - tooltipPosition.top) + 'px'
      this.tooltip.style.marginLeft = position.width-tooltipPosition.width / 2 + 'px'
    }
  }
  hideTooltip() {
    this.setState({isVisible: false})
  }
  render() {
    const {content, children, element, ...props} = this.props
    const {isVisible} = this.state
    return React.createElement(
      element,
      {
        ref: e => {
          if (!this.initialized) {
            e.addEventListener('mouseover', () => {
              this.showTooltip(e.getBoundingClientRect())
            })

            e.addEventListener('mouseout', () => {
              this.hideTooltip()
            })
            this.initialized = true
          }
        },
        ...props
      },
    children,
    isVisible && <div className={css.tooltip} ref={e => this.tooltip = e}>{content}</div>)
  }
}
