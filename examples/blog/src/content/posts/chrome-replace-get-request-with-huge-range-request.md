---
title: Chrome replace GET request with a huge range request
date: "2022-09-16T15:08:03.284Z"
description: ""
tags: ["Chrome"]
---

## Background

I use PDF.js to show large scanned documents in a project. The backend guys configure web server
to support HTTP Range Requests for better render performance. [More](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#pdfjs-is-fetching-the-entire-pdf-file-from-a-server-can-it-fetch-only-the-required-portions-for-rendering)

PDF.js supports this feature with three related options:

- disableRange
- disableStream
- disableAutoFetch

See [comments](https://github.com/mozilla/pdf.js/blob/bcdf161967b85760b195a9039b3e7d4d2be61446/src/display/api.js#L207) from source code.

```javascript
// options used in the project.
const options = {
  // ...
  disableRange: false,
  disableStream: false,
  disableAutoFetch: false, // Auto-fetch pages after first view displayed when disableStream enabled for better performance.
  // ...
};
```

## Render Process

1. Issue a GET request to fetch PDF document.
2. After the headers of the request resolved,
   - Cancel the GET request as soon as possible(What disableStream means)
   - Issue more requests to fetch data what the viewer needed to display first pages use range request.
3. As the user scroll, send more range requests to get necessary data.

## The Bug

When user reload the page after **view all pages**, the first GET request become a huge range request which download
the whole document, it hurts the performance badly.

## How to Resolve

First, I tried to disable the cache, and the bug just disappeared.
It's interesting, seems something related to the browser cache policy.

I searched for range request cache issues, it seems not supported perfectly.

So I inspected the response headers of PDF document. The first GET request seems normal. The next range requests got some
`Cache-Control: public, max-age=345600`. I guessed maybe the `public` cache policy cause the bug,
So I talked with DevOps and backend guys about my guess, they removed the `public` to verify.
The bug just disappear, problem solved!

## Conclusion

It seems the Chrome browser makes some magic decisions with an inappropriate cache policy. I try to find some theory to support
my guess, but get nothing.
