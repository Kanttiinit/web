import * as React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { MdContentCopy, MdLink, MdShare } from 'react-icons/md';

import { uiState, preferenceStore } from '../../store';
import CourseList from '../CourseList';
import DaySelector from '../DaySelector';
import { getCourses } from '../../utils/api';
import { CourseType } from '../../store/types';
import Tooltip from '../Tooltip';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  svg {
    cursor: pointer;
    margin-left: 1rem;
    color: var(--gray1);
  }
`;

const StyledCourseList = styled(CourseList)<{ loading: boolean }>`
  transition: opacity 0.2s;
  overflow: auto;
  max-height: 25vh;
  padding-right: 1ch;

  ${props => props.loading && 'opacity: 0.5;'}

  @media (max-width: ${props => props.theme.breakSmall}) {
    max-height: 100%;
  }
`;

type Props = {
  restaurantId: number;
  showCopyButton?: boolean;
  maxHeight?: number;
};

export default observer(
  class MenuViewer extends React.Component {
    removeAutorun: Function;
    props: Props;
    state: {
      courses: Array<CourseType>;
      loading: boolean;
      error: Error | null;
    } = {
      courses: [],
      loading: false,
      error: null
    };

    onCopy = (target: string) => {
      const textArea = document.createElement('textarea');
      if (target === 'courses') {
        textArea.value = this.state.courses
          .map(c => `${c.title} (${c.properties.join(', ')})`)
          .join('\n');
      } else if (target === 'url') {
        textArea.value = location.href;
      }
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    };

    share = () => {
      (navigator as any).share({
        title: 'Kanttiinit.fi',
        url: location.href
      });
    };

    componentDidMount() {
      this.removeAutorun = autorun(async () => {
        try {
          this.setState({ loading: true });
          const courses = await getCourses(
            this.props.restaurantId,
            uiState.selectedDay,
            preferenceStore.lang
          );
          this.setState({ courses, loading: false, error: null });
        } catch (error) {
          this.setState({ error, loading: false });
        }
      });
    }

    componentWillUnmount() {
      this.removeAutorun();
    }

    render() {
      const { courses, loading } = this.state;
      const { showCopyButton } = this.props;
      return (
        <div>
          <Header>
            <DaySelector root={location.pathname} />
            {showCopyButton && (
              <ButtonContainer>
                {'share' in navigator && (
                  <Tooltip translationKey="shareURL">
                    <MdShare size={18} onClick={this.share} />
                  </Tooltip>
                )}
                <Tooltip translationKey="copyURLToClipboard">
                  <MdLink size={18} onClick={() => this.onCopy('url')} />
                </Tooltip>
                <Tooltip translationKey="copyMenuToClipboard">
                  <MdContentCopy
                    size={18}
                    onClick={() => this.onCopy('courses')}
                  />
                </Tooltip>
              </ButtonContainer>
            )}
          </Header>
          <StyledCourseList loading={loading} courses={courses} />
        </div>
      );
    }
  }
);
