import { createResource } from 'solid-js';
import { styled } from 'solid-styled-components';
import { breakSmall } from '../../globalStyles';
import { state } from '../../state';

import { getCourses } from '../../utils/api';
import { CopyIcon, LinkIcon, ShareIcon } from '../../utils/icons';
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

const StyledCourseList = styled(CourseList)<{ loading: boolean }>`
  transition: opacity 0.2s;
  overflow: auto;
  max-height: 25vh;
  padding-right: 1ch;

  ${props => props.loading ? 'opacity: 0.5;' : ''}

  @media (max-width: ${breakSmall}) {
    max-height: 100%;
  }
`;

interface Props {
  restaurantId: number;
  showCopyButton?: boolean;
  maxHeight?: number;
}

const MenuViewer = (props: Props) => {
  const [courses] = createResource(() => ({
    id: props.restaurantId,
    selectedDay: state.selectedDay,
    lang: state.preferences.lang
  }), source => getCourses(source.id, source.selectedDay, source.lang));

  const onCopy = (target: string) => {
    const textArea = document.createElement('textarea');
    if (target === 'courses') {
      textArea.value = (courses() || [])
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
        {props.showCopyButton && (
          <ButtonContainer>
            {'share' in navigator && (
              <Tooltip translationKey="shareURL">
                <ShareIcon size={18} onClick={share} />
              </Tooltip>
            )}
            <Tooltip translationKey="copyURLToClipboard">
              <LinkIcon size={18} onClick={() => onCopy('url')} />
            </Tooltip>
            <Tooltip translationKey="copyMenuToClipboard">
              <CopyIcon size={18} onClick={() => onCopy('courses')} />
            </Tooltip>
          </ButtonContainer>
        )}
      </Header>
      <StyledCourseList loading={courses.loading} courses={courses() || []} />
    </div>
  );
};

export default MenuViewer;
