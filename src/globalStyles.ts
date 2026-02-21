import { createGlobalStyles } from 'solid-styled-components';

export const breakSmall = '767px';
export const breakLarge = '768px';
export const breakMini = '390px';

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
      /* Raw palette — desaturated blue-gray (~205°, ~25% less saturated) */
      --gray7: #1e252d;
      --gray6: #151c24;
      --gray5: #24303c;
      --gray4: #46586a;
      --gray3: #637b8a;
      --gray2: #91a9b6;
      --gray1: #ccd8df;

      /* Semantic backgrounds — independently tuned, clear hierarchy */
      --bg-app: #0e1317;       /* page canvas + modal base */
      --bg-surface: #161c24;   /* restaurant cards, elevated above page */
      --bg-inset: #212e3f;     /* settings cards within modal, further elevated */
      --bg-interactive: #263243; /* hover/pressed states */

      /* Semantic borders — visible against respective surfaces */
      --border-subtle: #1d2c3b; /* dividers, subtle outlines */
      --border: #2a3d50;        /* card outlines, focused states */

      /* Semantic text — neutral tint, strong contrast hierarchy */
      --text-primary: #dfe8ec;
      --text-secondary: #91a9b6;
      --text-muted: #5f7783;
      --text-disabled: #3d4d58;

      /* Component tokens */
      --topbar-bg: rgba(22, 28, 36, 0.90);
      --topbar-border: rgba(255, 255, 255, 0.07);
      --accent_color: #1ab0d8;
      --radio-track: #090d11;
      --radio-selected: #212e3f;

      --hearty: #f23d6e;
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
