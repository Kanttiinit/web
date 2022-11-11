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

    --accent_color: #2196f3;

    --gray1: #464646;
    --gray2: #636363;
    --gray3: #777;
    --gray4: #bdbdbd;
    --gray5: #ebebeb;
    --gray6: #f8f8f8;
    --gray7: #fefefe;

    --hearty: #d81b60;
    --friendly: #1bb518;

    --priceCategory_student: #5c9e5c;
    --priceCategory_studentPremium: #8b8f4f;
    --priceCategory_regular: #875555;

    &.dark {
      --accent_color: #eee;

      --gray7: #0a0a0a;
      --gray6: #212121;
      --gray5: #313131;
      --gray4: #989898;
      --gray3: #adadad;
      --gray2: #b3b3b3;
      --gray1: #c3c3c3;

      --hearty: #c15c81;
      --friendly: #4a9448;
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
