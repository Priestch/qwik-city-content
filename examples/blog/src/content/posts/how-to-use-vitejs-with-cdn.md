---
title: How to use Vite with CDN
date: "2023-04-28T12:08:03.284Z"
description: ""
tags: ["Vite", "CDN"]
---
I deployed a project bundled by Vite to CDN recently. It's surprising that there isn't a clear solution available for
such a common requirement. It's even more surprising that there is little discussion around this topic on the web,
I only found a single related Github [discussion](https://github.com/vitejs/vite/discussions/5997) which created about a year ago.

I didn't find a solution after searching via Google, so I visited the official website with the hope of discovering some magic configurations that would make CDN deployment possible. Fortunately, I stumbled upon the experimental **renderBuiltUrl** configuration in the [advanced base options](https://vitejs.dev/guide/build.html#advanced-base-options) section, which appeared to support CDN usage based on the sample code provided.

According to the sample code, the simplified final configuration in the project is as follows, I added additional comments for better understanding. The real configuration is more complicated because it depends on a package which is based on web worker architecture, some additional resources must be copied and hashed manually. 
```typescript
// learned from vite source code
const dynamicBaseAssetsCode = `
globalThis.__toAssetUrl = url => './' + url
`

function createCDNPlugin(cdnPrefix = '') {
  return {
    name: 'vite-plugin-cdn-transform-html',
    transformIndexHtml(html, ctx) {
      // add crossorigin to css bundle, you may not need to this
      // I submited a PR https://github.com/vitejs/vite/pull/12991, it hasn't been merged yet.
      const htmlContent = html.replace(
        /<link rel="stylesheet" (href=".+?\.css")>/gm,
        '<link rel="stylesheet" crossorigin $1>',
      );
      if (ctx.bundle) {
        // Only inject during build
        const tags = [
          {
            tag: 'script',
            children: dynamicBaseAssetsCode,
          },
        ];
        return {
          html: htmlContent,
          tags,
        };
      }
    },
  };
}

// additional comments added for better understanding.
const viteConfig = {
  experimental: {
    renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
      // CDN deploy can be turn off if VITE_CDN_PREFIX not set.
      if (!process.env.VITE_CDN_PREFIX) {
        return filename;
      }
      // resource in public directory, use relative path to support subpath deployment, http://example.com/subpath. 
      // see https://vitejs.dev/guide/assets.html#the-public-directory for details.
      if (type === 'public') {
        return './' + filename;
      } else if (path.extname(hostId) === '.js') {
        // dynamic resources used in javascript chunk.
        // <video src="../assets/imgs/guid/4.mp4" />
        // <img src="../assets/imgs/chatdoc.png" />
        // import wasm from 'somepackage/demo.wasm?url';
        const extsCopiedToCdn = ['.wasm', '.png', '.mp4', '.svg'];
        if (extsCopiedToCdn.includes(path.extname(filename))) {
          return process.env.VITE_CDN_PREFIX + filename;
        }
        
        // the object syntax can only be used when hostType is 'js'
        // 'runtime' means the final result will be converted to a function call,
        // so you must make sure `window.__toAssetUrl` is bind to window namespace, and can resolve asset url successfully,
        // the `vite-plugin-cdn-transform-html` use `transformIndexHtml` hook to inject the `window.__toAssetUrl`.
        return {
          runtime: `window.__toAssetUrl(${JSON.stringify(filename)})`,
        };
      } else {
        // hostType is html or css
        // html means auto-injected js and css chunks
        return process.env.VITE_CDN_PREFIX + filename;
      }
    }
  },
  plugins: [
    createCDNPlugin()
  ]
}
```

## WARNING
Do a full function check if you want to upgrade Vite.
My colleague upgrade Vite from 4.2.1 to 4.3.4 recently, caused dynamic import and manually chunk not work as expected!

#### Useful Dependencies
- [vite-plugin-static-copy](https://github.com/sapphi-red/vite-plugin-static-copy) - used to copy additional resources
- [vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression) - used to zip wasm file during bundle process
- [pako](https://github.com/nodeca/pako) - used to manually zip some resource
- [crypto](https://github.com/nodeca/pako) - used to calculate md5 based on file content
