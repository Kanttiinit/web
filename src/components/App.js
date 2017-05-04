// @flow
import React from 'react'
import Swipeable from 'react-swipeable'
import classnames from 'classnames'
import Left from 'react-icons/lib/md/arrow-back'
import Right from 'react-icons/lib/md/arrow-forward'

import {uiState} from '../store'
import css from '../styles/App.scss'
import Footer from './Footer'
import Modal from './Modal'

const Arrow = ({direction, visible}) => (
  <div
    className={classnames(css.arrow, visible && css.arrowVisible, direction === 'right' ? css.right : css.left)}>
    {direction === 'right' ? <Right /> : <Left />}
  </div>
)

export default class App extends React.PureComponent {
  state = {
    rightArrowVisible: false,
    leftArrowVisible: false
  };
  swiped = (direction: number) => {
    uiState.setDayOffset(uiState.dayOffset + direction)
    this.setState({
      rightArrowVisible: false,
      leftArrowVisible: false
    })
  }
  swiping = (direction: string) => (event: Event, amount: number) => {
    const canGoLeft = uiState.dayOffset > 0 || direction === 'right'
    const canGoRight = uiState.dayOffset !== uiState.maxDayOffset
    if (direction === 'left' && canGoLeft || direction === 'right' && canGoRight) {
      this.setState({[direction + 'ArrowVisible']: Math.min(1, amount / 100)})
    }
  }
  render() {
    const {children, location} = this.props
    const {leftArrowVisible, rightArrowVisible} = this.state
    return (
      <Swipeable
        onSwipingLeft={this.swiping('right')}
        onSwipingRight={this.swiping('left')}
        onSwipedLeft={() => this.swiped(1)}
        onSwipedRight={() => this.swiped(-1)}>
        <Arrow
          visible={leftArrowVisible}
          direction="left" />
        <div className={css.container}>
          {children}
          <Footer path={location.pathname} />
        </div>
        <Arrow
          visible={rightArrowVisible}
          direction="right" />
        <Modal />
      </Swipeable>
    )
  }
}