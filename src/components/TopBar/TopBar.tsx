import * as React from 'react';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { MdMap, MdSettings, MdFiberNew } from 'react-icons/md';
import ClickOutside from 'react-click-outside';
const FI = require('../../assets/fi.png');
const EN = require('../../assets/en.png');

import DaySelector from '../DaySelector';
import { preferenceStore, dataStore } from '../../store';
import * as css from './TopBar.scss';
import Text from '../Text';
import AreaSelector from '../AreaSelector';

type State = {
  areaSelectorOpen: boolean;
};

export default withRouter(
  observer(
    class TopBar extends React.Component<RouteComponentProps<any>, State> {
      state = {
        areaSelectorOpen: false
      };

      toggleLanguage = () => {
        preferenceStore.toggleLanguage();
      };

      toggleAreaSelector = () => {
        this.setState(state => ({ areaSelectorOpen: !state.areaSelectorOpen }));
      };

      closeAreaSelector = () => this.setState({ areaSelectorOpen: false });

      touchStart = (e: TouchEvent) => {
        e.preventDefault();
        this.toggleAreaSelector();
      };

      touchMove = (event: TouchEvent) => {
        event.preventDefault();
        const target = document.elementFromPoint(
          event.touches[0].pageX,
          event.touches[0].pageY
        );
        if (target instanceof HTMLButtonElement) {
          target.focus();
        }
      };

      touchEnd = (event: TouchEvent) => {
        const endTarget = document.elementFromPoint(
          event.changedTouches[0].pageX,
          event.changedTouches[0].pageY
        );
        if (endTarget instanceof HTMLElement) {
          endTarget.dispatchEvent(
            new MouseEvent('mouseup', {
              bubbles: true
            })
          );
        }
      };

      setTouchListeners = (e: HTMLElement) => {
        if (e) {
          e.addEventListener('touchstart', this.touchStart, { passive: false });
          e.addEventListener('touchmove', this.touchMove, { passive: false });
          e.addEventListener('touchend', this.touchEnd);
        }
      };

      render() {
        const { search } = this.props.location;
        return (
          <div className={css.container}>
            <div className={css.centered}>
              <DaySelector root="/" />
              {dataStore.unseenUpdates.length > 0 && (
                <Link to={{ pathname: '/news', search }}>
                  <MdFiberNew className={css.newsIcon} size={24} />
                </Link>
              )}
              <ClickOutside
                onClickOutside={this.closeAreaSelector}
                className={css.areaSelectorContainer}
              >
                <a
                  className={css.icon}
                  ref={this.setTouchListeners}
                  onMouseDown={this.toggleAreaSelector}
                >
                  <MdMap size={18} />
                  <Text id="selectArea" />
                </a>
                <div
                  className={classnames(
                    css.areaSelector,
                    this.state.areaSelectorOpen && css.areaSelectorOpen
                  )}
                >
                  <AreaSelector onAreaSelected={this.toggleAreaSelector} />
                </div>
              </ClickOutside>
              <Link to={{ pathname: '/settings', search }} className={css.icon}>
                <MdSettings size={18} />
                <Text id="settings" />
              </Link>
              <a className={css.icon} onClick={this.toggleLanguage}>
                <img
                  height={18}
                  alt={preferenceStore.lang.toUpperCase()}
                  src={preferenceStore.lang === 'fi' ? FI : EN}
                />
              </a>
            </div>
          </div>
        );
      }
    }
  )
);
