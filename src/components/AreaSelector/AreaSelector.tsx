import * as React from 'react';
import { observer } from 'mobx-react';
import * as sortBy from 'lodash/sortBy';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { dataStore, preferenceStore } from '../../store';
import * as css from './AreaSelector.scss';
import Text from '../Text';
import { AreaType } from '../../store/types';
import { MdDirectionsWalk, MdStar } from 'react-icons/md';

type SpecialArea = {
  id: -1 | -2;
  name: React.ReactNode;
};

const specialAreas: Array<SpecialArea> = [
  {
    id: -2,
    name: (
      <React.Fragment>
        <MdDirectionsWalk className={css.areaIcon} />
        <Text id="nearby" />
      </React.Fragment>
    )
  },
  {
    id: -1,
    name: (
      <React.Fragment>
        <MdStar className={css.areaIcon} />
        <Text id="starred" />
      </React.Fragment>
    )
  }
];

const Area = ({
  area,
  selectArea
}: {
  area: AreaType | SpecialArea;
  selectArea: (id: number) => void;
}) => (
  <div className={css.area}>
    <button
      onMouseUp={() => selectArea(area.id)}
      className={classnames(
        'button-text',
        preferenceStore.selectedArea === area.id && css.selected
      )}
    >
      {area.name}
    </button>
  </div>
);

type Props = {
  onAreaSelected?: () => void;
};

@observer
class AreaSelector extends React.Component<Props & RouteComponentProps<any>> {
  selectArea = (areaId: number) => {
    preferenceStore.selectedArea = areaId;
    this.props.history.replace('/');
    if (this.props.onAreaSelected) {
      this.props.onAreaSelected();
    }
  };

  render() {
    return (
      <div className={css.container}>
        {specialAreas.map(area => (
          <Area key={area.id} selectArea={this.selectArea} area={area} />
        ))}
        {sortBy(dataStore.areas.data, 'name').map((area: AreaType) => (
          <Area key={area.id} selectArea={this.selectArea} area={area} />
        ))}
      </div>
    );
  }
}

export default withRouter(AreaSelector);
