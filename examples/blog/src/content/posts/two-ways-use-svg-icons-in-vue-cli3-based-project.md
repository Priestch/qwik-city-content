---
title: Two Ways Use SVG Icons In vue-cli3 Based Project
date: "2019-06-06T15:30:03.284Z"
description: ""
tags: ["vue-cli3", "SVG", "Icon"]
---

## Icon Font

1. Install Dependencies

```bash
npm install --save-dev iconfont-webpack-plugin
```

2. Update Config of Vue

```javascript
// vue.config.js
// Add IconfontWebpackPlugin instance to plugins of postcss-loader options
const IconfontWebpackPlugin = require("iconfont-webpack-plugin");

function tapPostcssLoaderOptions(config, moduleRule, rule) {
  config.module
    .rule(moduleRule)
    .oneOf(rule)
    .use("postcss-loader")
    .loader("postcss-loader")
    .tap(options => {
      const iconFontOptions = {
        plugins: loader => {
          return [new IconfontWebpackPlugin(loader)];
        },
      };
      Object.assign(options, iconFontOptions);
      return options;
    });
}

function configIconFont(config) {
  // Sass is the pre-processor of my project
  // Replace with yours
  //
  // Tips
  // Use `vue inspect --rules` view rules used in project
  // Use `vue inspect --rule scss` view special rule
  const moduleRules = ["scss", "css"];
  const rules = ["normal", "normal-modules", "vue", "vue-modules"];
  for (let i = 0; i < moduleRules.length; i++) {
    const moduleRule = moduleRules[i];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      tapPostcssLoaderOptions(config, moduleRule, rule);
    }
  }
}

module.exports = {
  chainWebpack: config => {
    configIconFont(config);
  },
};
```

3. Usage in Component

```vue
<template>
  <div>
    <span class="class-name-use-svg-icon"></span>
  </div>
</template>

<style lang="scss">
.class-name-use-svg-icon {
  &:before {
    font-icon: url("../../src/svg-icons/spanner.svg");
  }
}
</style>
```

## SVG sprite

1. Install Dependencies

```bash
npm install --save-dev svg-sprite-loader svgo-loader
```

2. Update Config of Vue

```javascript
// vue.config.js

function configSVGIcon(config) {
  // Exclude SVG sprite directory from default svg rule
  config.module
    .rule("svg")
    .exclude.add(path.resolve(__dirname, "./src/svg-icons"))
    .end();

  // Options used by svgo-loader to optimize SVG files
  // https://github.com/svg/svgo#what-it-can-do
  const options = {
    plugins: [
      { cleanupAttrs: true },
      { cleanupEnableBackground: true },
      { cleanupIDs: true },
      { cleanupListOfValues: true },
      { cleanupNumericValues: true },
      { collapseGroups: true },
      { convertColors: true },
      { convertPathData: true },
      { convertShapeToPath: true },
      { convertStyleToAttrs: true },
      { convertTransform: true },
      { mergePaths: true },
      { removeComments: true },
      { removeDesc: true },
      { removeDimensions: true },
      { removeDoctype: true },
      { removeEditorsNSData: true },
      { removeEmptyAttrs: true },
      { removeEmptyContainers: true },
      { removeEmptyText: true },
      { removeHiddenElems: true },
      { removeMetadata: true },
      { removeNonInheritableGroupAttrs: true },
      { removeRasterImages: true },
      { removeTitle: true },
      { removeUnknownsAndDefaults: true },
      { removeUselessDefs: true },
      { removeUnusedNS: true },
      { removeUselessStrokeAndFill: true },
      {
        removeAttrs: { attrs: "fill" }, //移除fill属性
      },
      { removeXMLProcInst: true },
      { removeStyleElement: true },
      { removeUnknownsAndDefaults: true },
      { sortAttrs: true },
    ],
  };

  // Include only SVG sprite directory for new svg-icon rule
  // Use svg-sprite-loader to build SVG sprite
  // Use svgo-loader to optimize SVG files
  config.module
    .rule("svg-icon")
    .test(/\.svg$/)
    .include.add(path.resolve(__dirname, "./src/svg-icons"))
    .end()
    .use("svg-sprite-loader")
    .loader("svg-sprite-loader")
    .options({
      symbolId: "icon-[name]",
    })
    .end()
    .use("svgo-loader")
    .loader("svgo-loader")
    .options(options)
    .end();
}

module.exports = {
  chainWebpack: config => {
    configSVGIcon(config);
  },
};
```

3. Create A Component

```vue
// src/components/SvgIcon.vue
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="name"></use>
  </svg>
</template>

<script>
// https://webpack.js.org/guides/dependency-management/#context-module-api
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context("../svg-icons", false, /\.svg$/);
requireAll(req);

export default {
  name: "SvgIcon",
  props: {
    iconName: {
      // icon filename
      type: String,
      required: true,
    },
    className: {
      // css class name
      type: String,
      default: "",
    },
  },
  computed: {
    name() {
      let icon = this.iconName;
      return icon ? `#icon-${icon}` : "";
    },
    svgClass() {
      let className = this.className;
      return className ? `svg-icon ${className}` : "svg-icon";
    },
  },
};
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor; /* important */
  overflow: hidden;
}
</style>
```

4. Usage

```vue
// Remember to copy svg files to svg-icons directory under src
<template>
  <div>
    <svg-icon icon-name="settings"></svg-icon>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";

export default {
  components: {
    SvgIcon,
  },
};
</script>
```

## Useful Resources

- [icon-font-loader](https://github.com/vusion/icon-font-loader)
- [基于 svg-sprite 的 svg icon 方案实践](http://tech.lede.com/2018/03/27/fe/svg-icon/)
- [SVG-Symbol-component-practice](https://aotu.io/notes/2016/07/09/SVG-Symbol-component-practice/)
