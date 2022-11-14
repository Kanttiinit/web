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

    &.dark {
      --accent_color: #09ACFE;

      --gray7: #2B3138;
      --gray6: #202329;
      --gray5: #313131;
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
