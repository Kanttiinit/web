import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { MdMap, MdSettings, MdFiberNew } from 'react-icons/md';
const FI = require('../../assets/fi.png');
const EN = require('../../assets/en.png');

import DaySelector from '../DaySelector';
import { preferenceStore, dataStore } from '../../store';
import * as css from './TopBar.scss';
import Text from '../Text';

export default withRouter(
  observer(
    class TopBar extends React.Component {
      props: RouteComponentProps<any>;

      toggleLanguage = () => {
        preferenceStore.toggleLanguage();
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
              <Link
                to={{ pathname: '/select-area', search }}
                className={css.icon}
              >
                <MdMap size={18} />
                <Text id="selectArea" />
              </Link>
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
