import { createResource, createSignal, type JSX } from 'solid-js';
import { styled } from 'solid-styled-components';
import { getCourses } from '../api';
import { breakSmall } from '../globalStyles';
import { CheckIcon, CopyIcon, LinkIcon, ShareIcon } from '../icons';
import { state } from '../state';
import CourseList from './CourseList';
import DaySelector from './DaySelector';
import Tooltip from './Tooltip';

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;

  svg {
    cursor: pointer;
    color: var(--text-primary);
    display: block;
  }
`;

const CopyTrack = styled.span<{ done: boolean }>`
  position: relative;
  display: inline-flex;
  width: 18px;
  height: 18px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;

  .icon-default {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${props => (props.done ? 'translateY(-100%)' : 'translateY(0)')};
  }

  .icon-check {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #22c55e;
    border-radius: 50%;
    color: white;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${props => (props.done ? 'translateY(0)' : 'translateY(100%)')};
  }
`;

function CopyButton(props: { icon: JSX.Element; onCopy: () => void }) {
  const [done, setDone] = createSignal(false);

  const handle = () => {
    props.onCopy();
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };

  return (
    <CopyTrack done={done()} onClick={handle}>
      <span class="icon-default">{props.icon}</span>
      <span class="icon-check">
        <CheckIcon size={18} />
      </span>
    </CopyTrack>
  );
}

const StyledCourseList = styled(CourseList)<{ loading: boolean }>`
  transition: opacity 0.2s;
  overflow: auto;
  max-height: 25vh;
  padding-right: 1ch;

  ${props => (props.loading ? 'opacity: 0.5;' : '')}

  @media (max-width: ${breakSmall}) {
    max-height: 100%;
  }
`;

interface Props {
  restaurantId: number;
  showCopyButton?: boolean;
  maxHeight?: number;
}

export default function MenuViewer(props: Props) {
  const [courses] = createResource(
    () => ({
      id: props.restaurantId,
      selectedDay: state.selectedDay,
      lang: state.preferences.lang,
    }),
    source => getCourses(source.id, source.selectedDay, source.lang),
  );

  const copyURL = () => navigator.clipboard.writeText(location.href);

  const copyMenu = () =>
    navigator.clipboard.writeText(
      (courses() || [])
        .map(c => {
          let line = c.title;
          if (c.properties.length) {
            line += `(${c.properties.join(', ')})`;
          }
          return line;
        })
        .join('\n'),
    );

  const share = () => {
    (navigator as any).share({
      title: 'Kanttiinit.fi',
      url: location.href,
    });
  };

  return (
    <div>
      <Header>
        <DaySelector />
        {props.showCopyButton && (
          <ButtonContainer>
            {'share' in navigator && (
              <Tooltip translationKey="shareURL">
                <ShareIcon size={18} onClick={share} />
              </Tooltip>
            )}
            <Tooltip translationKey="copyURLToClipboard">
              <CopyButton icon={<LinkIcon size={18} />} onCopy={copyURL} />
            </Tooltip>
            <Tooltip translationKey="copyMenuToClipboard">
              <CopyButton icon={<CopyIcon size={18} />} onCopy={copyMenu} />
            </Tooltip>
          </ButtonContainer>
        )}
      </Header>
      <StyledCourseList loading={courses.loading} courses={courses() || []} />
    </div>
  );
}
