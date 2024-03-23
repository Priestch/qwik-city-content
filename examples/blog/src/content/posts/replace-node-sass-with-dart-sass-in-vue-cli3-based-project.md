---
title: Replace node-sass With dart-sass In vue-cli3 Based Project
date: "2019-04-08T04:36:03.284Z"
description: ""
tags: ["Sass", "node-sass", "dart-sass", "vue-cli3"]
---

## Why?

#### Related Issues

- [issue#1782](https://github.com/vuejs/vue-cli/issues/1782)
- [issue#3321](https://github.com/vuejs/vue-cli/pull/3321)

## How?

#### 1. Replace node-sass with dart-sass

**1. Uninstall node-sass**

```bash
npm uninstall node-sass
```

**2. Install dart-sass**

```bash
npm install --dev sass
```

#### 2. Update vue.config.js

```javascript
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"), // This line must in sass option
      },
    },
  },
};
```

#### 3. Replace /deep/ with ::v-deep in component

#### 4. Disable stylelint related rule If you use

```javascript
// stylelint.config.js
module.exports = {
  ...
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
  },
  ...
};
```

[Stylelint - Loading Config](<(https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#loading-the-configuration-object)>)

#### Tips:

If you got error in terminal after run `npm run serve` like below,
Try upgrade sass-loader to 7.1.0

```bash
Module build failed (from ./node_modules/sass-loader/lib/loader.js):
Error: Cannot find module 'node-sass'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:581:15)
    at Function.Module._load (internal/modules/cjs/loader.js:507:25)
    at Module.require (internal/modules/cjs/loader.js:637:17)
    at require (internal/modules/cjs/helpers.js:22:18)
    at Object.sassLoader (/path-of-your-project-directory/node_modules/sass-loader/lib/loader.js:24:22)
```

**[Upgrade vue-cli packages if necessary](https://github.com/vuejs/vue-cli/issues/3399#issuecomment-466319019)**
