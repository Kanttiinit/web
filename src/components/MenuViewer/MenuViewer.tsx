import * as React from 'react';
import { MdContentCopy, MdLink, MdShare } from 'react-icons/md';
import styled from 'styled-components';

import preferenceContext from '../../contexts/preferencesContext';
import uiContext from '../../contexts/uiContext';
import { CourseType } from '../../store/types';
import { getCourses } from '../../utils/api';
import useResource from '../../utils/useResource';
import CourseList from '../CourseList';
import DaySelector from '../DaySelector';
import Tooltip from '../Tooltip';

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

const StyledCourseList = styled(({ loading, ...props }) => (
  <CourseList {...props} />
))<{ loading: boolean }>`
  transition: opacity 0.2s;
  overflow: auto;
  max-height: 25vh;
  padding-right: 1ch;

  ${props => props.loading && 'opacity: 0.5;'}

  @media (max-width: ${props => props.theme.breakSmall}) {
    max-height: 100%;
  }
`;

interface Props {
  restaurantId: number;
  showCopyButton?: boolean;
  maxHeight?: number;
}

const MenuViewer = (props: Props) => {
  const ui = React.useContext(uiContext);
  const preferences = React.useContext(preferenceContext);
  const [courses, setCourses] = useResource<CourseType[]>([]);
  const { showCopyButton } = props;

  React.useEffect(() => {
    setCourses(
      getCourses(props.restaurantId, ui.selectedDay, preferences.lang)
    );
  }, []);

  const onCopy = (target: string) => {
    const textArea = document.createElement('textarea');
    if (target === 'courses') {
      textArea.value = courses.data
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

  const share = () => {
    (navigator as any).share({
      title: 'Kanttiinit.fi',
      url: location.href
    });
  };

  return (
    <div>
      <Header>
        <DaySelector root={location.pathname} />
        {showCopyButton && (
          <ButtonContainer>
            {'share' in navigator && (
              <Tooltip translationKey="shareURL">
                <MdShare size={18} onClick={share} />
              </Tooltip>
            )}
            <Tooltip translationKey="copyURLToClipboard">
              <MdLink size={18} onClick={() => onCopy('url')} />
            </Tooltip>
            <Tooltip translationKey="copyMenuToClipboard">
              <MdContentCopy size={18} onClick={() => onCopy('courses')} />
            </Tooltip>
          </ButtonContainer>
        )}
      </Header>
      <StyledCourseList loading={courses.pending} courses={courses} />
    </div>
  );
};

export default MenuViewer;
