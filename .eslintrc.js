module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "globals": {
    "process": true,
    "version": true
  },
  "rules": {
    "no-console": 0,
    "indent": [
      "error",
      2,
      { "MemberExpression": 0, "SwitchCase": 1 }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [2, "never"],
    "react/jsx-uses-vars": [2],
    "react/jsx-uses-react": [2]
  }
};
