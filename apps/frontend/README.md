# Frontend

The React app for Chrome Extension that will function as search the github profile of the user.

## Local development

### Start the web app

```shell
yarn nx run frontend:serve
```

### Run Chrome extension

1. [One time] Open Chrome or Edge and navigate to `chrome://extensions`. Make sure to turn on the developer mode switch.
2. Drag the `dist/apps/frontend` folder into the Extensions Dashboard to install it. Your extension icon will be in the top bar. The icon will be the first letter of the extension's name. If the icon does not appear then open extension details and enable 'Pin to toolbar'.
3. [Enable HMR](https://crxjs.dev/vite-plugin/getting-started/react/dev-basics#profit-with-vite-hmr).

