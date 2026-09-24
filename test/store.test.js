import test from "node:test";import assert from "node:assert/strict";import{readFile}from"node:fs/promises";
const html=await readFile(new URL("../index.html",import.meta.url),"utf8"),css=await readFile(new URL("../styles.css",import.meta.url),"utf8"),js=await readFile(new URL("../src/app.js",import.meta.url),"utf8");
test("portfolio exposes all major sections",()=>{for(const id of["work","about","lab","contact"])assert.match(html,new RegExp(`id="${id}"`))});
test("portfolio contains four fictional case studies",()=>{for(const key of["vesper","nami","morrow","afterdark"])assert.match(html,new RegExp(`data-project="${key}"`))});
test("interaction layer includes accessibility and reduced-motion support",()=>{assert.match(html,/aria-label=/);assert.match(css,/prefers-reduced-motion/);assert.match(js,/IntersectionObserver/)});
test("visual system includes responsive layouts and custom motion",()=>{assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/@keyframes marquee/);assert.match(css,/@keyframes radar/)});
test("command palette and case dialog are wired",()=>{assert.match(html,/id="palette"/);assert.match(html,/id="caseDialog"/);assert.match(js,/openPalette/);assert.match(js,/openCase/)});
