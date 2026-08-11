// One-off: render the OG card SVG to public/og.png. Not part of the app build.
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="14%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#4C8DF6" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#4C8DF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="100%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#4C8DF6" stop-opacity="0.14"/>
      <stop offset="55%" stop-color="#4C8DF6" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#07090f"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <rect x="8" y="8" width="1184" height="614" rx="22" fill="none" stroke="#1e2534" stroke-width="2"/>

  <!-- monogram -->
  <g transform="translate(80,74)">
    <rect width="66" height="66" rx="15" fill="#0d111a" stroke="#4C8DF6" stroke-width="3"/>
    <text x="33" y="34" fill="#8FB8FB" font-family="Consolas, 'Courier New', monospace" font-size="30" font-weight="700" text-anchor="middle" dominant-baseline="central" letter-spacing="-1">W</text>
  </g>
  <text x="164" y="118" fill="#8b95a7" font-family="Consolas, 'Courier New', monospace" font-size="20" letter-spacing="3">// AI FULL-STACK &amp; AUTOMATION</text>

  <!-- name + title -->
  <text x="80" y="272" fill="#e7ecf5" font-family="'Segoe UI', Arial, sans-serif" font-size="98" font-weight="800" letter-spacing="-3">Winayagatar</text>
  <text x="82" y="330" fill="#8FB8FB" font-family="'Segoe UI', Arial, sans-serif" font-size="34" font-weight="600">AI Full-Stack Developer &amp; Automation Engineer</text>

  <!-- live apps -->
  <g font-family="Consolas, 'Courier New', monospace" font-size="24">
    <g transform="translate(82,420)">
      <circle cx="9" cy="-8" r="7" fill="#34d399"/>
      <text x="30" y="0" fill="#34d399" font-weight="700">LIVE</text>
      <text x="120" y="0" fill="#8FB8FB">kenshi-questpay.vercel.app</text>
    </g>
    <g transform="translate(82,460)">
      <circle cx="9" cy="-8" r="7" fill="#34d399"/>
      <text x="30" y="0" fill="#34d399" font-weight="700">LIVE</text>
      <text x="120" y="0" fill="#8FB8FB">kenshi-notes.vercel.app</text>
    </g>
    <g transform="translate(82,500)">
      <circle cx="9" cy="-8" r="7" fill="#34d399"/>
      <text x="30" y="0" fill="#34d399" font-weight="700">LIVE</text>
      <text x="120" y="0" fill="#8FB8FB">ganga-schedule-universal.vercel.app</text>
    </g>
    <g transform="translate(82,540)">
      <circle cx="9" cy="-8" r="7" fill="#34d399"/>
      <text x="30" y="0" fill="#34d399" font-weight="700">LIVE</text>
      <text x="120" y="0" fill="#8FB8FB">mellogang.vercel.app</text>
    </g>
  </g>

  <line x1="80" y1="574" x2="1120" y2="574" stroke="#161c28" stroke-width="1"/>
  <text x="80" y="604" fill="#6c7688" font-family="Consolas, 'Courier New', monospace" font-size="21">github.com/ryuken25  ·  winayaarya@gmail.com  ·  Bali → Kuala Lumpur</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true },
  background: "#07090f",
});
const png = resvg.render().asPng();
writeFileSync(new URL("../public/og.png", import.meta.url), png);
console.log("wrote public/og.png", png.length, "bytes");
