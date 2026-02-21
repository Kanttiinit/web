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
    background-color: var(--bg-app);

    --accent_color: #09ACFE;

    /* Raw palette — keep for derived tokens and legacy references */
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

    /* Semantic background tokens */
    --bg-app: var(--gray6);
    --bg-surface: var(--gray7);
    --bg-inset: var(--gray6);
    --bg-interactive: var(--gray5);

    /* Semantic border tokens */
    --border-subtle: var(--gray5);
    --border: var(--gray4);

    /* Semantic text tokens */
    --text-primary: var(--gray1);
    --text-secondary: var(--gray2);
    --text-muted: var(--gray3);
    --text-disabled: var(--gray4);

    /* Component tokens */
    --radio-track: var(--gray5);
    --radio-selected: var(--gray7);

    --topbar-bg: rgba(254, 254, 254, 0.82);
    --topbar-border: rgba(0, 0, 0, 0.07);

    &.dark {
      /* Raw palette */
      --gray7: #1e2629;
      --gray6: #161c1e;
      --gray5: #253032;
      --gray4: #505858;
      --gray3: #707c7c;
      --gray2: #9aa4a4;
      --gray1: #c4c8c8;

      /* Semantic backgrounds — independently tuned */
      --bg-app: #111719;
      --bg-surface: #1c2427;
      --bg-inset: #141c1f;
      --bg-interactive: #253437;

      /* Semantic borders */
      --border-subtle: #1e2c30;
      --border: #2c3c40;

      /* Semantic text */
      --text-primary: #cdd1d1;
      --text-secondary: #8fa0a0;
      --text-muted: #637476;
      --text-disabled: #475659;

      /* Component tokens */
      --topbar-bg: rgba(22, 28, 30, 0.88);
      --topbar-border: rgba(255, 255, 255, 0.07);
      --accent_color: #0898be;
      --radio-track: #0c1416;
      --radio-selected: #1c2b2e;

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
