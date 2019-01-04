import * as React from 'react';
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
import Text from '../Text';
import AreaSelector from '../AreaSelector';
import styled, { css } from 'styled-components';

const Container = styled.div`
  background: linear-gradient(to bottom, var(--gray7) 0%, var(--gray6) 100%);
  box-sizing: border-box;
  padding: 0 0.5em;
  position: fixed;
  width: 100%;
  z-index: 10;
  color: var(--gray3);
  border-bottom: 1px solid var(--gray5);
  user-select: none;

  @media (max-width: ${props => props.theme.breakSmall}) {
    background-color: var(--gray6);
    justify-content: flex-start;
    padding: 0.2em;
    padding-left: 1rem;
  }

  ${props =>
    props.theme.dark &&
    'background: linear-gradient(to bottom, var(--gray6) 0%, var(--gray7) 100%);'}
`;

const Content = styled.div`
  max-width: 94.2rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const NewsIcon = styled(MdFiberNew)`
  color: var(--accent_color);
`;

const AreaSelectorButton = styled(ClickOutside)`
  position: relative;

  @media (max-width: ${props => props.theme.breakSmall}) {
    position: initial;
  }
`;

const AreaSelectorContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 32px;
  width: 20em;
  background: var(--gray7);
  padding: 1em;
  box-shadow: 0px 7px 18px -1px rgba(50, 50, 50, 0.1);
  border-radius: 4px;
  border: solid 1px var(--gray5);
  opacity: 0;
  transition: opacity 75ms;
  pointer-events: none;

  ${props =>
    props.isOpen &&
    css`
      opacity: 1;
      pointer-events: all;
    `}

  @media (max-width: ${props => props.theme.breakSmall}) {
    top: 52px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }
`;

const iconLinkStyles = css`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  margin: 0 1em;

  &:link,
  &:visited {
    color: var(--gray3);
  }

  &:hover,
  &:focus {
    outline: none;
    color: var(--accent_color);
  }

  svg {
    display: none;
  }

  @media (max-width: ${props => props.theme.breakSmall}) {
    svg {
      display: block;
    }
    span {
      display: none;
    }
  }
`;

const IconLink = styled(Link)`
  ${iconLinkStyles}
`;
const NativeIconLink = styled.a`
  ${iconLinkStyles}
`;

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
          <Container>
            <Content>
              <DaySelector root="/" />
              {dataStore.unseenUpdates.length > 0 && (
                <Link to={{ pathname: '/news', search }}>
                  <NewsIcon size={24} />
                </Link>
              )}
              <AreaSelectorButton onClickOutside={this.closeAreaSelector}>
                <NativeIconLink
                  ref={this.setTouchListeners}
                  onMouseDown={this.toggleAreaSelector}
                >
                  <MdMap size={18} />
                  <Text id="selectArea" />
                </NativeIconLink>
                <AreaSelectorContainer isOpen={this.state.areaSelectorOpen}>
                  <AreaSelector onAreaSelected={this.toggleAreaSelector} />
                </AreaSelectorContainer>
              </AreaSelectorButton>
              <IconLink as={Link} to={{ pathname: '/settings', search }}>
                <MdSettings size={18} />
                <Text id="settings" />
              </IconLink>
              <NativeIconLink onClick={this.toggleLanguage}>
                <img
                  height={18}
                  alt={preferenceStore.lang.toUpperCase()}
                  src={preferenceStore.lang === 'fi' ? FI : EN}
                />
              </NativeIconLink>
            </Content>
          </Container>
        );
      }
    }
  )
);
