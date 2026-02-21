import { createGlobalStyles } from 'solid-styled-components';

export const breakSmall = '767px';
export const breakLarge = '768px';

export default createGlobalStyles`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    font-family: "Interface", sans-serif;
    margin: 0;
    background-color: var(--gray6);

    --accent_color: #09ACFE;

    --gray1: #464646;
    --gray2: #636363;
    --gray3: #777;
    --gray4: #bdbdbd;
    --gray5: #ebebeb;
    --gray6: #f8f8f8;
    --gray7: #fefefe;

    --hearty: #fe346e;
    --friendly: #06CBB0;

    --star: #F2A65A;

    --priceCategory_student: #5c9e5c;
    --priceCategory_studentPremium: #8b8f4f;
    --priceCategory_regular: #875555;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-full: 9999px;

    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
    --shadow-popover: 0 8px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);

    --radio-track: var(--gray5);
    --radio-selected: var(--gray7);

    --topbar-bg: rgba(254, 254, 254, 0.82);
    --topbar-border: rgba(0, 0, 0, 0.07);

    &.dark {
      --topbar-bg: rgba(43, 49, 56, 0.85);
      --topbar-border: rgba(255, 255, 255, 0.06);
      --accent_color: #0ba3cb;

      --gray7: #2B3138;
      --gray6: #202329;
      --gray5: #313131;

      --radio-track: #1c2128;
      --radio-selected: #363d47;
      --gray4: #989898;
      --gray3: #adadad;
      --gray2: #b3b3b3;
      --gray1: #c3c3c3;

      --hearty: #fe346e;
      --friendly: #06CBB0;
    }
  }

  #get-a-proper-browser {
    display: none;
    padding: 1em;
  }

  a:link,
  a:visited,
  a:active,
  a:hover {
    text-decoration: none;
    color: inherit;
  }
`;
