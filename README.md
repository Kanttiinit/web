# Kanttiinit Web Client

## Local development

After cloning the repo run `npm install` to install all dependencies.

The (Webpack) development server can be started with `npm run run` after which it will be available at `http://localhost:8080/`. However, the Webpack development server might act a bit buggy sometimes. If you encounter problems with it, the server can also be started separately with `npm start` and running `webpack -w` in a separate terminal window.

### ESLint
This code base uses [ESLint](http://eslint.org/) for linting JavaScript in order to keep the style uniform. ESLint has integrations for all major IDE's and we highly recommend installing it. We won't accept contributions that don't pass the linter rules!
