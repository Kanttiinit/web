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
      /* Raw palette — blue-teal hue (~205°) */
      --gray7: #1b2530;
      --gray6: #121c26;
      --gray5: #203040;
      --gray4: #405870;
      --gray3: #5c7c90;
      --gray2: #8aaabb;
      --gray1: #c8d8e2;

      /* Semantic backgrounds — independently tuned, clear hierarchy */
      --bg-app: #0d1318;       /* page canvas + modal base */
      --bg-surface: #131c26;   /* restaurant cards, elevated above page */
      --bg-inset: #1c2d44;     /* settings cards within modal, further elevated */
      --bg-interactive: #213248; /* hover/pressed states */

      /* Semantic borders — visible against respective surfaces */
      --border-subtle: #182c40; /* dividers, subtle outlines */
      --border: #243d56;        /* card outlines, focused states */

      /* Semantic text — cool tint, strong contrast hierarchy */
      --text-primary: #dce8ee;
      --text-secondary: #8aaabb;
      --text-muted: #587888;
      --text-disabled: #384e5c;

      /* Component tokens */
      --topbar-bg: rgba(19, 28, 38, 0.90);
      --topbar-border: rgba(255, 255, 255, 0.07);
      --accent_color: #1ab0d8;
      --radio-track: #080d12;
      --radio-selected: #1c2d44;

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
