import { styled } from 'solid-styled-components';
import upcloudLogo from '../assets/Upcloud_Logo-Purple.svg';

const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--gray4);
  font-size: 0.8rem;
  letter-spacing: 0.05rem;
  text-decoration: none;

  &:hover {
    color: var(--accent_color);
  }
`;

const Logo = styled.img`
  height: 1rem;
  vertical-align: middle;
`;

export default function PoweredByUpcloud() {
  return (
    <Link href='https://upcloud.com/' target='_blank' rel='noopener noreferrer'>
      Powered by <Logo src={upcloudLogo} alt='UpCloud' />
    </Link>
  );
}
