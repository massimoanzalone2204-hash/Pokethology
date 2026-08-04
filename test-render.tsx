import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: "http://localhost:3000"
});
global.window = dom.window as any;
global.document = dom.window.document as any;
global.navigator = dom.window.navigator as any;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
} as any;

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';

try {
  const html = renderToString(<App />);
  console.log("Rendered successfully. Length:", html.length);
} catch (e) {
  console.error("Render failed:", e);
}
