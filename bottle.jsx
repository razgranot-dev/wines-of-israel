// Cinematic SVG art for Wines of Israel — vineyard, bottle, pour, glass.
// Light-mode editorial wine cinematography. All scenes share golden-hour
// sun upper-right, deep wine reds, warm ivory/stone, warm dark browns.

const { useRef, useEffect, useState, useMemo } = React;

/* ============================================================
   BOTTLE — slim refined silhouette, deep glass, paper label,
   curved highlights, condensation, contact darkening.
   tiltDeg rotates the bottle CW around its bottom-center pivot.
   ============================================================ */
function Bottle({ tiltDeg = 0, originY = "100%", scale = 1 }) {
  return (
    <div
      className="bottle-wrap"
      style={{
        transform: `translateZ(0) rotate(${tiltDeg}deg) scale(${scale})`,
        transformOrigin: `50% ${originY}`,
      }}
    >
      <svg viewBox="0 0 160 540" width="160" height="540" className="bottle-svg" aria-hidden>
        <defs>
          {/* Glass body — deep forest-green-black with horizontal modulation */}
          <linearGradient id="bt-glass-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#040806" />
            <stop offset="14%" stopColor="#162119" />
            <stop offset="38%" stopColor="#2a3a2a" />
            <stop offset="60%" stopColor="#101913" />
            <stop offset="86%" stopColor="#06100b" />
            <stop offset="100%" stopColor="#040806" />
          </linearGradient>

          {/* Vertical modulation — lighter shoulder, darker base */}
          <linearGradient id="bt-glass-vert" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a140c" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#1a2a1c" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#06100b" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#020604" stopOpacity="0.55" />
          </linearGradient>

          {/* Neck — slightly darker, narrower vertical pass */}
          <linearGradient id="bt-glass-neck" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#020604" />
            <stop offset="20%" stopColor="#0e1812" />
            <stop offset="50%" stopColor="#1c2a20" />
            <stop offset="80%" stopColor="#0a140c" />
            <stop offset="100%" stopColor="#020604" />
          </linearGradient>

          {/* Wine inside — deep red gradient */}
          <linearGradient id="bt-wine-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a1224" stopOpacity="0.0" />
            <stop offset="18%" stopColor="#a52d3d" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#7a1224" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#3a0a12" stopOpacity="0.92" />
          </linearGradient>

          {/* Punt depth */}
          <radialGradient id="bt-wine-punt" cx="50%" cy="92%" r="42%">
            <stop offset="0%" stopColor="#2a0408" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#5a0e1f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5a0e1f" stopOpacity="0.0" />
          </radialGradient>

          {/* Foil capsule — oxblood */}
          <linearGradient id="bt-foil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a0204" />
            <stop offset="22%" stopColor="#2a0810" />
            <stop offset="50%" stopColor="#5a0e1c" />
            <stop offset="78%" stopColor="#2a0810" />
            <stop offset="100%" stopColor="#0a0204" />
          </linearGradient>

          {/* Foil vertical highlight band — light gold */}
          <linearGradient id="bt-foil-hl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c8a368" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#e6c98a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c8a368" stopOpacity="0.0" />
          </linearGradient>

          {/* Cork — warm wood */}
          <linearGradient id="bt-cork" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a07d49" />
            <stop offset="45%" stopColor="#8b6a3c" />
            <stop offset="100%" stopColor="#5a4221" />
          </linearGradient>

          {/* Label paper */}
          <linearGradient id="bt-label-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5ecd2" />
            <stop offset="55%" stopColor="#ead6a8" />
            <stop offset="100%" stopColor="#dac79a" />
          </linearGradient>

          {/* Label curvature — darker edges suggesting wrap around glass */}
          <linearGradient id="bt-label-curve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a5a2a" stopOpacity="0.55" />
            <stop offset="8%" stopColor="#7a5a2a" stopOpacity="0.18" />
            <stop offset="22%" stopColor="#f5ecd2" stopOpacity="0.0" />
            <stop offset="78%" stopColor="#f5ecd2" stopOpacity="0.0" />
            <stop offset="92%" stopColor="#7a5a2a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7a5a2a" stopOpacity="0.55" />
          </linearGradient>

          {/* Embossed crest indentation */}
          <radialGradient id="bt-crest-emboss" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#dac79a" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#7a5a2a" stopOpacity="0.22" />
          </radialGradient>

          {/* Key light — bright curved highlight on left edge */}
          <linearGradient id="bt-key-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#eaf3e6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Secondary fill — soft right edge */}
          <linearGradient id="bt-fill-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#b8c8b0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Shoulder compression highlight */}
          <radialGradient id="bt-shoulder-hl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffeede" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ffeede" stopOpacity="0.0" />
          </radialGradient>

          {/* Punt — darker concave ellipse */}
          <radialGradient id="bt-punt" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#020604" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#040806" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#040806" stopOpacity="0.0" />
          </radialGradient>

          {/* Contact darkening below bottle */}
          <radialGradient id="bt-contact" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
          </radialGradient>

          {/* Paper noise pattern */}
          <pattern id="bt-paper-noise" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="transparent" />
            <circle cx="1" cy="1.2" r="0.35" fill="#8a6b3a" opacity="0.18" />
            <circle cx="4.2" cy="3.6" r="0.28" fill="#8a6b3a" opacity="0.14" />
            <circle cx="2.6" cy="5.1" r="0.22" fill="#8a6b3a" opacity="0.12" />
            <line x1="0.4" y1="3.8" x2="1.6" y2="3.8" stroke="#8a6b3a" strokeWidth="0.18" opacity="0.12" />
            <line x1="3.2" y1="0.6" x2="4.4" y2="0.6" stroke="#8a6b3a" strokeWidth="0.18" opacity="0.1" />
          </pattern>

          {/* Drop shadow */}
          <filter id="bt-drop-shadow" x="-30%" y="-10%" width="160%" height="125%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="1" dy="6" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.55" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Clip = bottle silhouette interior */}
          <clipPath id="bt-body-clip">
            <path d="M 70 14 L 70 90 C 70 102, 64 110, 58 124 C 50 142, 44 162, 42 192 L 42 506 C 42 518, 50 524, 60 525 L 100 525 C 110 524, 118 518, 118 506 L 118 192 C 116 162, 110 142, 102 124 C 96 110, 90 102, 90 90 L 90 14 Z" />
          </clipPath>
        </defs>

        {/* Contact darkening just below bottle base */}
        <ellipse cx="80" cy="535" rx="44" ry="6" fill="url(#bt-contact)" />

        {/* BOTTLE SILHOUETTE with drop shadow */}
        <g filter="url(#bt-drop-shadow)">
          <path d="M 70 14 L 70 90 C 70 102, 64 110, 58 124 C 50 142, 44 162, 42 192 L 42 506 C 42 518, 50 524, 60 525 L 100 525 C 110 524, 118 518, 118 506 L 118 192 C 116 162, 110 142, 102 124 C 96 110, 90 102, 90 90 L 90 14 Z" fill="url(#bt-glass-body)" />
          <path d="M 70 14 L 70 90 C 70 102, 64 110, 58 124 C 50 142, 44 162, 42 192 L 42 506 C 42 518, 50 524, 60 525 L 100 525 C 110 524, 118 518, 118 506 L 118 192 C 116 162, 110 142, 102 124 C 96 110, 90 102, 90 90 L 90 14 Z" fill="url(#bt-glass-vert)" />
        </g>

        {/* Wine inside (clipped to silhouette) */}
        <g clipPath="url(#bt-body-clip)">
          <rect x="38" y="120" width="84" height="410" fill="url(#bt-wine-body)" />
          <ellipse cx="80" cy="510" rx="42" ry="32" fill="url(#bt-wine-punt)" />
          <path d="M 56 150 C 55 220, 58 300, 56 420" stroke="#a52d3d" strokeWidth="0.6" strokeOpacity="0.22" fill="none" strokeLinecap="round" />
          <path d="M 64 158 C 63 240, 66 340, 64 440" stroke="#7a1224" strokeWidth="0.5" strokeOpacity="0.28" fill="none" strokeLinecap="round" />
          <path d="M 102 152 C 103 230, 100 320, 102 430" stroke="#a52d3d" strokeWidth="0.55" strokeOpacity="0.2" fill="none" strokeLinecap="round" />
          <ellipse cx="80" cy="520" rx="30" ry="7" fill="url(#bt-punt)" />
        </g>

        {/* Neck overlay */}
        <path d="M 70 14 L 70 90 C 70 102, 64 110, 58 124 L 102 124 C 96 110, 90 102, 90 90 L 90 14 Z" fill="url(#bt-glass-neck)" opacity="0.85" />

        {/* Key light: curved bright highlight on LEFT edge */}
        <path d="M 72 18 L 72 90 C 72 100, 66 108, 60 122 C 53 140, 47 160, 45 192 L 45 500 C 45 514, 51 520, 60 521 L 56 521 C 49 520, 43 514, 43 500 L 43 192 C 45 158, 51 138, 58 120 C 64 106, 70 100, 70 90 L 70 18 Z" fill="url(#bt-key-light)" opacity="0.85" />

        {/* Secondary right-edge fill light */}
        <path d="M 90 22 L 90 90 C 90 100, 94 108, 100 122 C 107 140, 113 160, 115 192 L 115 498 C 115 510, 110 516, 102 518 L 106 518 C 113 516, 117 510, 117 498 L 117 192 C 115 158, 109 138, 102 120 C 96 106, 92 100, 92 90 L 92 22 Z" fill="url(#bt-fill-light)" opacity="0.7" />

        {/* Shoulder compression highlight */}
        <ellipse cx="80" cy="158" rx="30" ry="3.2" fill="url(#bt-shoulder-hl)" />
        <ellipse cx="68" cy="170" rx="14" ry="1.6" fill="#ffeede" opacity="0.18" />

        {/* Dark inner-edge stroke (glass thickness) */}
        <path d="M 70 14 L 70 90 C 70 102, 64 110, 58 124 C 50 142, 44 162, 42 192 L 42 506 C 42 518, 50 524, 60 525 L 100 525 C 110 524, 118 518, 118 506 L 118 192 C 116 162, 110 142, 102 124 C 96 110, 90 102, 90 90 L 90 14 Z" fill="none" stroke="#020604" strokeWidth="0.9" strokeOpacity="0.85" />

        {/* CORK */}
        <rect x="71" y="2" width="18" height="14" fill="url(#bt-cork)" rx="1.2" />
        <line x1="73" y1="5" x2="87" y2="5" stroke="#6a4f28" strokeWidth="0.35" opacity="0.55" />
        <line x1="74" y1="8" x2="86" y2="8" stroke="#6a4f28" strokeWidth="0.3" opacity="0.45" />
        <line x1="73" y1="11" x2="87" y2="11" stroke="#6a4f28" strokeWidth="0.35" opacity="0.5" />
        <line x1="75" y1="13.5" x2="85" y2="13.5" stroke="#a07d49" strokeWidth="0.25" opacity="0.4" />

        {/* FOIL CAPSULE */}
        <path d="M 67 10 L 67 78 C 67 82, 69 84, 72 84 L 88 84 C 91 84, 93 82, 93 78 L 93 10 Z" fill="url(#bt-foil)" />
        <rect x="69" y="12" width="3.2" height="68" fill="url(#bt-foil-hl)" opacity="0.7" />
        <line x1="80" y1="11" x2="80" y2="83" stroke="#0a0204" strokeWidth="0.45" opacity="0.7" />
        <line x1="68" y1="78" x2="92" y2="78" stroke="#0a0204" strokeWidth="0.55" opacity="0.85" />
        <line x1="68" y1="79.4" x2="92" y2="79.4" stroke="#7a1a28" strokeWidth="0.3" opacity="0.5" />
        <circle cx="76" cy="40" r="0.9" fill="#2a0810" opacity="0.7" />
        <circle cx="76" cy="40" r="0.4" fill="#e6c98a" opacity="0.55" />
        <circle cx="84" cy="40" r="0.9" fill="#2a0810" opacity="0.7" />
        <circle cx="84" cy="40" r="0.4" fill="#e6c98a" opacity="0.55" />
        <line x1="67" y1="11.5" x2="93" y2="11.5" stroke="#0a0204" strokeWidth="0.4" opacity="0.6" />

        {/* LABEL */}
        <rect x="44" y="270" width="72" height="150" fill="url(#bt-label-paper)" rx="1.2" />
        <rect x="44" y="270" width="72" height="150" fill="url(#bt-paper-noise)" rx="1.2" />
        <rect x="44" y="270" width="72" height="150" fill="url(#bt-label-curve)" rx="1.2" />

        <line x1="48" y1="278" x2="112" y2="278" stroke="#8a6b3a" strokeWidth="0.55" opacity="0.85" />
        <line x1="48" y1="280" x2="112" y2="280" stroke="#c8a368" strokeWidth="0.25" opacity="0.6" />
        <line x1="48" y1="412" x2="112" y2="412" stroke="#8a6b3a" strokeWidth="0.55" opacity="0.85" />
        <line x1="48" y1="410" x2="112" y2="410" stroke="#c8a368" strokeWidth="0.25" opacity="0.6" />

        <text x="80" y="294" textAnchor="middle"
          style={{ font: "italic 600 8.2px 'Cormorant Garamond', Georgia, serif", letterSpacing: 1.6 }}
          fill="#3a1208">WINES OF</text>
        <text x="80" y="307" textAnchor="middle"
          style={{ font: "italic 700 11px 'Cormorant Garamond', Georgia, serif", letterSpacing: 2.2 }}
          fill="#3a1208">ISRAEL</text>

        {/* Crest */}
        <circle cx="80" cy="345" r="16" fill="#f5ecd2" stroke="#8a6b3a" strokeWidth="0.7" />
        <circle cx="80" cy="345" r="16" fill="url(#bt-crest-emboss)" />
        <circle cx="80" cy="345" r="13.5" fill="none" stroke="#c8a368" strokeWidth="0.3" opacity="0.7" />

        {/* Grape clusters */}
        <g opacity="0.85">
          <circle cx="68" cy="343" r="1.1" fill="#5a0e1f" />
          <circle cx="70.4" cy="344.2" r="1.1" fill="#5a0e1f" />
          <circle cx="67.6" cy="345.4" r="1.1" fill="#5a0e1f" />
          <circle cx="69.6" cy="346.4" r="1.0" fill="#5a0e1f" />
          <circle cx="68.6" cy="347.6" r="0.9" fill="#5a0e1f" />
        </g>
        <g opacity="0.85">
          <circle cx="92" cy="343" r="1.1" fill="#5a0e1f" />
          <circle cx="89.6" cy="344.2" r="1.1" fill="#5a0e1f" />
          <circle cx="92.4" cy="345.4" r="1.1" fill="#5a0e1f" />
          <circle cx="90.4" cy="346.4" r="1.0" fill="#5a0e1f" />
          <circle cx="91.4" cy="347.6" r="0.9" fill="#5a0e1f" />
        </g>

        {/* Center wine drop */}
        <path d="M 80 338 C 83 343, 84.5 346.5, 84.5 348.5 C 84.5 351.2, 82.5 353, 80 353 C 77.5 353, 75.5 351.2, 75.5 348.5 C 75.5 346.5, 77 343, 80 338 Z" fill="#5a0e1f" />
        <path d="M 79 341 C 78.2 343.5, 77.6 346, 77.8 348" stroke="#a52d3d" strokeWidth="0.45" fill="none" strokeOpacity="0.7" />

        <text x="80" y="378" textAnchor="middle"
          style={{ font: "500 5.8px 'Outfit', sans-serif", letterSpacing: 1.8 }}
          fill="#3a1208">JUDEAN HILLS</text>
        <circle cx="72" cy="386" r="0.5" fill="#8a6b3a" />
        <circle cx="80" cy="386" r="0.5" fill="#8a6b3a" />
        <circle cx="88" cy="386" r="0.5" fill="#8a6b3a" />
        <text x="80" y="397" textAnchor="middle"
          style={{ font: "italic 500 6.4px 'Cormorant Garamond', serif", letterSpacing: 1.2 }}
          fill="#3a1208">RESERVE · 2021</text>
        <text x="80" y="424" textAnchor="middle"
          style={{ font: "italic 400 4.2px 'Cormorant Garamond', serif", letterSpacing: 1.1 }}
          fill="#5a3a1a">PRODUCE OF ISRAEL · 750 ML</text>

        {/* Condensation droplets on upper-right shoulder */}
        <g opacity="0.85">
          <circle cx="104" cy="148" r="1.6" fill="#ffeede" opacity="0.55" />
          <circle cx="103.5" cy="148" r="0.6" fill="#ffffff" opacity="0.85" />
          <circle cx="109" cy="158" r="1.1" fill="#ffeede" opacity="0.5" />
          <circle cx="108.7" cy="158" r="0.4" fill="#ffffff" opacity="0.8" />
          <circle cx="112" cy="174" r="0.8" fill="#ffeede" opacity="0.45" />
          <circle cx="106" cy="186" r="1.3" fill="#ffeede" opacity="0.55" />
          <circle cx="105.7" cy="186" r="0.5" fill="#ffffff" opacity="0.8" />
          <circle cx="111" cy="200" r="0.9" fill="#ffeede" opacity="0.5" />
          <circle cx="100" cy="208" r="0.6" fill="#ffeede" opacity="0.42" />
          <circle cx="113" cy="226" r="1.0" fill="#ffeede" opacity="0.45" />
          <circle cx="113" cy="226" r="0.35" fill="#ffffff" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
   BOTTLE SURFACE — warm stone tabletop with contact shadow.
   Sits BELOW the bottle in the cinema stage.
   ============================================================ */
function BottleSurface({ opacity = 1 }) {
  return (
    <svg viewBox="0 0 1200 220" width="100%" preserveAspectRatio="xMidYMid slice"
         className="bottle-surface" style={{ opacity }} aria-hidden>
      <defs>
        <linearGradient id="bs-stone" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#b8a585" />
          <stop offset="35%" stopColor="#d4c5a8" />
          <stop offset="70%" stopColor="#a8967a" />
          <stop offset="100%" stopColor="#6e5e44" />
        </linearGradient>
        <radialGradient id="bs-goldenhour" cx="82%" cy="0%" r="85%">
          <stop offset="0%" stopColor="#ffd9a8" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#e6b884" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6a4f28" stopOpacity="0.0" />
        </radialGradient>
        <linearGradient id="bs-perspective" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2c18" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#3a2c18" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3a2c18" stopOpacity="0.0" />
        </linearGradient>
        <radialGradient id="bs-contact-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0e04" stopOpacity="0.82" />
          <stop offset="35%" stopColor="#2a1a08" stopOpacity="0.5" />
          <stop offset="75%" stopColor="#2a1a08" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2a1a08" stopOpacity="0.0" />
        </radialGradient>
        <radialGradient id="bs-wine-reflection" cx="50%" cy="20%" r="55%">
          <stop offset="0%" stopColor="#7a1224" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#5a0e1f" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#5a0e1f" stopOpacity="0.0" />
        </radialGradient>
        <pattern id="bs-stone-grain" x="0" y="0" width="34" height="22" patternUnits="userSpaceOnUse">
          <rect width="34" height="22" fill="transparent" />
          <circle cx="4" cy="6" r="0.55" fill="#6a5638" opacity="0.18" />
          <circle cx="18" cy="3" r="0.4" fill="#8a7654" opacity="0.22" />
          <circle cx="26" cy="14" r="0.65" fill="#6a5638" opacity="0.16" />
          <circle cx="10" cy="17" r="0.35" fill="#8a7654" opacity="0.2" />
          <circle cx="30" cy="8" r="0.3" fill="#4a3a22" opacity="0.18" />
          <circle cx="14" cy="11" r="0.45" fill="#8a7654" opacity="0.14" />
          <line x1="2" y1="13" x2="7" y2="13.6" stroke="#6a5638" strokeWidth="0.25" opacity="0.18" />
          <line x1="20" y1="18" x2="27" y2="18.4" stroke="#8a7654" strokeWidth="0.22" opacity="0.16" />
        </pattern>
        <filter id="bs-shadow-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="bs-refl-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id="bs-slab">
          <path d="M -40 220 L 1240 220 L 1080 40 L 120 40 Z" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="1200" height="220" fill="#2a1e10" />

      <g clipPath="url(#bs-slab)">
        <rect x="0" y="0" width="1200" height="220" fill="url(#bs-stone)" />
        <rect x="0" y="0" width="1200" height="220" fill="url(#bs-goldenhour)" />
        <rect x="0" y="0" width="1200" height="220" fill="url(#bs-perspective)" />
        <rect x="0" y="0" width="1200" height="220" fill="url(#bs-stone-grain)" opacity="0.8" />
        <line x1="120" y1="42" x2="1080" y2="42" stroke="#3a2c18" strokeWidth="1" opacity="0.55" />
        <line x1="120" y1="44" x2="1080" y2="44" stroke="#e6b884" strokeWidth="0.5" opacity="0.35" />
        <path d="M 220 110 C 320 116, 400 108, 500 118" stroke="#7a6444" strokeWidth="0.55" fill="none" opacity="0.32" />
        <path d="M 700 80 C 800 86, 900 82, 980 92" stroke="#7a6444" strokeWidth="0.5" fill="none" opacity="0.28" />
        <path d="M 380 168 C 480 172, 560 166, 640 176" stroke="#6a5436" strokeWidth="0.6" fill="none" opacity="0.3" />
        <ellipse cx="600" cy="92" rx="120" ry="46" fill="url(#bs-wine-reflection)" filter="url(#bs-refl-blur)" />
        <ellipse cx="600" cy="86" rx="42" ry="14" fill="#3a0a12" opacity="0.32" filter="url(#bs-refl-blur)" />
      </g>

      <ellipse cx="600" cy="78" rx="118" ry="14" fill="url(#bs-contact-shadow)" filter="url(#bs-shadow-blur)" />
      <ellipse cx="600" cy="76" rx="56" ry="7" fill="#0a0604" opacity="0.55" filter="url(#bs-shadow-blur)" />
    </svg>
  );
}

/* ============================================================
   POUR STREAM — wine emerges from bottle mouth and falls under
   gravity. Multiple sub-stream highlights, surface-tension
   droplets, organic tributary filaments, free-falling droplet.
   ============================================================ */
function PourStreamSvg({ progress = 0, tiltDeg = 0 }) {
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.01) {
    return <svg style={{ position: "absolute", overflow: "visible" }} width="1" height="1" viewBox="0 0 1 1" aria-hidden="true" />;
  }

  const tiltRad = (tiltDeg * Math.PI) / 180;
  const tiltSin = Math.sin(tiltRad);
  const tiltCos = Math.cos(tiltRad);

  const maxLen = 360;
  const len = 40 + p * maxLen;

  const exitX = tiltSin * 22;
  const midX = tiltSin * 10;
  const tipX = tiltSin * 4;
  const tipY = len;

  const c1x = exitX;
  const c1y = len * 0.28;
  const c2x = midX;
  const c2y = len * 0.62;

  const mainPath = `M 0 0 C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${tipX.toFixed(2)} ${tipY.toFixed(2)}`;

  const wobble = 0.6 + Math.sin(p * 9) * 0.4;
  const outerPath = `M 0 0 C ${(c1x + wobble).toFixed(2)} ${(c1y - 4).toFixed(2)}, ${(c2x - wobble * 0.7).toFixed(2)} ${(c2y + 2).toFixed(2)}, ${tipX.toFixed(2)} ${tipY.toFixed(2)}`;

  const cubic = (t, p0, p1, p2, p3) =>
    Math.pow(1 - t, 3) * p0 +
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * t * t * p2 +
    t * t * t * p3;

  const tribStartT = 0.45, tribEndT = 0.78;
  const tribStartXY = { x: cubic(tribStartT, 0, c1x, c2x, tipX), y: cubic(tribStartT, 0, c1y, c2y, tipY) };
  const tribEndXY = { x: cubic(tribEndT, 0, c1x, c2x, tipX) + 4 + tiltSin * 2, y: cubic(tribEndT, 0, c1y, c2y, tipY) + 6 };
  const tributaryPath = `M ${tribStartXY.x.toFixed(2)} ${tribStartXY.y.toFixed(2)} C ${(tribStartXY.x + 2).toFixed(2)} ${(tribStartXY.y + (tribEndXY.y - tribStartXY.y) * 0.4).toFixed(2)}, ${(tribEndXY.x - 1).toFixed(2)} ${(tribEndXY.y - 4).toFixed(2)}, ${tribEndXY.x.toFixed(2)} ${tribEndXY.y.toFixed(2)}`;

  const trib2StartT = 0.58, trib2EndT = 0.86;
  const trib2StartXY = { x: cubic(trib2StartT, 0, c1x, c2x, tipX), y: cubic(trib2StartT, 0, c1y, c2y, tipY) };
  const trib2EndXY = { x: cubic(trib2EndT, 0, c1x, c2x, tipX) - 3.5 + tiltSin, y: cubic(trib2EndT, 0, c1y, c2y, tipY) + 9 };
  const tributary2Path = `M ${trib2StartXY.x.toFixed(2)} ${trib2StartXY.y.toFixed(2)} C ${(trib2StartXY.x - 1.5).toFixed(2)} ${(trib2StartXY.y + 4).toFixed(2)}, ${(trib2EndXY.x + 0.5).toFixed(2)} ${(trib2EndXY.y - 5).toFixed(2)}, ${trib2EndXY.x.toFixed(2)} ${trib2EndXY.y.toFixed(2)}`;

  const highlightOffset = 1.2;
  const highlightPath = `M ${highlightOffset.toFixed(2)} 0 C ${(c1x + highlightOffset).toFixed(2)} ${c1y.toFixed(2)}, ${(c2x + highlightOffset * 0.8).toFixed(2)} ${c2y.toFixed(2)}, ${(tipX + highlightOffset * 0.5).toFixed(2)} ${(tipY - 6).toFixed(2)}`;

  const dropletCount = Math.max(0, Math.round(3 + p * 4));
  const droplets = [];
  for (let i = 0; i < dropletCount; i++) {
    const t = 0.15 + (i / Math.max(1, dropletCount - 1)) * 0.78;
    const sx = cubic(t, 0, c1x, c2x, tipX);
    const sy = cubic(t, 0, c1y, c2y, tipY);
    const side = i % 2 === 0 ? 1 : -1;
    const off = side * (1.2 + ((i * 13) % 5) * 0.3);
    const size = 0.6 + t * 4.2;
    droplets.push({ cx: sx + off, cy: sy + ((i * 7) % 4), rx: size * 0.7, ry: size, key: `d${i}` });
  }

  const freeFall = p > 0.35;
  const freeDropDy = 40 + p * 20;
  const freeDropX = tipX + tiltSin * 1.5;
  const freeDropY = tipY + freeDropDy;

  const sideMargin = 28;
  const vbX = -sideMargin;
  const vbY = -10;
  const vbW = sideMargin * 2;
  const vbH = tipY + (freeFall ? freeDropDy + 18 : 24);

  const baseWidth = 5.2 + p * 0.6;
  const innerWidth = baseWidth * 0.55;

  return (
    <svg style={{ position: "absolute", overflow: "visible", pointerEvents: "none" }}
      width={vbW} height={vbH} viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} aria-hidden="true">
      <defs>
        <linearGradient id="ps-wine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a0810" />
          <stop offset="38%" stopColor="#7c1224" />
          <stop offset="72%" stopColor="#5a0e1f" />
          <stop offset="100%" stopColor="#2a0610" />
        </linearGradient>
        <linearGradient id="ps-wine-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a0e1f" />
          <stop offset="55%" stopColor="#7c1224" />
          <stop offset="100%" stopColor="#3a0810" />
        </linearGradient>
        <linearGradient id="ps-warmrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,170,120,0)" />
          <stop offset="100%" stopColor="rgba(255,170,120,0.35)" />
        </linearGradient>
        <radialGradient id="ps-tip" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a52d3d" />
          <stop offset="55%" stopColor="#7c1224" />
          <stop offset="100%" stopColor="#2a0610" />
        </radialGradient>
        <filter id="ps-glow" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="3.4" /></filter>
        <filter id="ps-softglow" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="1.2" /></filter>
        <filter id="ps-motionblur" x="-50%" y="-20%" width="200%" height="160%"><feGaussianBlur stdDeviation="0.9" /></filter>
      </defs>

      <path d={mainPath} stroke="#a52d3d" strokeOpacity={0.35 * p} strokeWidth={baseWidth + 8} strokeLinecap="round" fill="none" filter="url(#ps-glow)" />
      <path d={mainPath} stroke="url(#ps-warmrim)" strokeOpacity={0.45 * p} strokeWidth={baseWidth + 3} strokeLinecap="round" fill="none" filter="url(#ps-glow)" transform={`translate(${(1.4 * tiltCos).toFixed(2)}, 0)`} />
      <path d={outerPath} stroke="url(#ps-wine)" strokeWidth={baseWidth} strokeLinecap="round" fill="none" opacity={0.92} />
      <path d={mainPath} stroke="url(#ps-wine-inner)" strokeWidth={innerWidth} strokeLinecap="round" fill="none" />
      <path d={mainPath} stroke="url(#ps-wine-inner)" strokeWidth={innerWidth * 0.55} strokeLinecap="round" fill="none" strokeDasharray={`0 ${tipY * 0.55} ${tipY * 0.5} ${tipY}`} opacity={0.9} />
      <path d={tributaryPath} stroke="url(#ps-wine-inner)" strokeWidth={1.4} strokeLinecap="round" fill="none" opacity={0.7 * p} filter="url(#ps-softglow)" />
      <path d={tributary2Path} stroke="url(#ps-wine-inner)" strokeWidth={0.9} strokeLinecap="round" fill="none" opacity={0.55 * p} />

      {droplets.map((d) => (
        <g key={d.key} opacity={0.85}>
          <ellipse cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} fill="url(#ps-tip)" />
          <ellipse cx={d.cx - d.rx * 0.25} cy={d.cy - d.ry * 0.4} rx={d.rx * 0.35} ry={d.ry * 0.3} fill="rgba(255,180,140,0.4)" />
        </g>
      ))}

      {freeFall && (
        <g opacity={0.85 * p} filter="url(#ps-motionblur)">
          <ellipse cx={freeDropX} cy={freeDropY} rx={2.4} ry={4.6} fill="url(#ps-tip)" />
          <ellipse cx={freeDropX - 0.6} cy={freeDropY - 1.6} rx={0.8} ry={1.6} fill="rgba(255,180,140,0.5)" />
          <ellipse cx={freeDropX} cy={freeDropY - 5} rx={0.6} ry={3.2} fill="#7c1224" opacity={0.45} />
        </g>
      )}

      <path d={highlightPath} stroke="rgba(255,180,140,0.55)" strokeWidth={1.2} strokeLinecap="round" fill="none" filter="url(#ps-softglow)" />
      <path d={highlightPath} stroke="rgba(255,235,215,0.7)" strokeWidth={0.45} strokeLinecap="round" fill="none" strokeDasharray="4 6 2 8 3 5" opacity={0.85} />

      <ellipse cx={tipX} cy={tipY - 4} rx={2.2} ry={6} fill="url(#ps-tip)" opacity={0.85} />
      <ellipse cx={tipX} cy={tipY} rx={5.4} ry={9.2} fill="url(#ps-tip)" />
      <ellipse cx={tipX - 1.2} cy={tipY - 2.4} rx={1.6} ry={3.2} fill="rgba(255,180,140,0.55)" />
      <ellipse cx={tipX - 1.8} cy={tipY - 4} rx={0.5} ry={0.9} fill="rgba(255,240,220,0.85)" />
    </svg>
  );
}

/* ============================================================
   POUR SPLASH — impact burst when wine hits a surface.
   Concentric ripples, radiating particles, crater, warm rim.
   ============================================================ */
function PourSplash({ progress = 0 }) {
  const p = Math.max(0, Math.min(1, progress));
  if (p < 0.05) return null;

  const scale = 0.4 + p * 0.9;
  const baseRx = 22 * scale;
  const baseRy = 7 * scale;

  const vbW = 120, vbH = 60;
  const vbX = -vbW / 2;
  const vbY = -20;

  const particleCount = Math.max(6, Math.round(6 + p * 4));
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const baseAngle = -Math.PI + (i / (particleCount - 1)) * Math.PI;
    const angle = baseAngle + (((i * 37) % 13) - 6) * 0.04;
    const dist = (18 + ((i * 19) % 22)) * scale;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist * 0.55;
    const size = 0.8 + ((i * 11) % 7) * 0.35 * scale;
    const opacity = Math.max(0.15, 1 - dist / (40 * scale)) * p;
    particles.push({ cx: px, cy: py, rx: size, ry: size * (0.7 + ((i * 5) % 4) * 0.1), opacity, fill: i % 3 === 0 ? "#5a0e1f" : "#a52d3d", key: `pt${i}` });
  }

  const rings = [];
  for (let i = 0; i < 3; i++) {
    const phase = (p + i * 0.33) % 1;
    const rx = baseRx * (1.1 + phase * 1.8);
    const ry = baseRy * (1.1 + phase * 1.8);
    const opacity = Math.max(0, (1 - phase) * 0.55 * p);
    rings.push({ rx, ry, opacity, key: `r${i}` });
  }

  return (
    <svg style={{ position: "absolute", overflow: "visible", pointerEvents: "none" }}
      width={vbW} height={vbH} viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} aria-hidden="true">
      <defs>
        <radialGradient id="psp-crater" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2a0610" />
          <stop offset="55%" stopColor="#3a0810" />
          <stop offset="100%" stopColor="rgba(58,8,16,0)" />
        </radialGradient>
        <radialGradient id="psp-particle" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a52d3d" />
          <stop offset="60%" stopColor="#7c1224" />
          <stop offset="100%" stopColor="#3a0810" />
        </radialGradient>
        <linearGradient id="psp-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,170,120,0)" />
          <stop offset="55%" stopColor="rgba(255,180,140,0.45)" />
          <stop offset="100%" stopColor="rgba(255,170,120,0)" />
        </linearGradient>
        <filter id="psp-crater-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
        <filter id="psp-particle-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.5" /></filter>
        <filter id="psp-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>

      <ellipse cx={0} cy={0} rx={baseRx * 1.8} ry={baseRy * 1.8} fill="#a52d3d" opacity={0.18 * p} filter="url(#psp-glow)" />

      {rings.map((r) => (
        <ellipse key={r.key} cx={0} cy={0} rx={r.rx} ry={r.ry} fill="none" stroke="#7c1224" strokeWidth={0.7} strokeOpacity={r.opacity} strokeLinecap="round" />
      ))}

      <ellipse cx={0} cy={0} rx={baseRx} ry={baseRy} fill="url(#psp-crater)" filter="url(#psp-crater-blur)" />
      <ellipse cx={0} cy={1} rx={baseRx * 0.65} ry={baseRy * 0.7} fill="#2a0610" opacity={0.85 * p} />

      <ellipse cx={baseRx * 0.15} cy={-baseRy * 0.5} rx={baseRx * 0.85} ry={baseRy * 0.35} fill="none" stroke="url(#psp-rim)" strokeWidth={0.9} opacity={0.85 * p} filter="url(#psp-particle-blur)" />

      {particles.map((pt) => (
        <g key={pt.key} opacity={pt.opacity}>
          <ellipse cx={pt.cx} cy={pt.cy} rx={pt.rx} ry={pt.ry} fill={pt.fill === "#a52d3d" ? "url(#psp-particle)" : pt.fill} filter="url(#psp-particle-blur)" />
          {pt.rx > 1.4 && (
            <ellipse cx={pt.cx - pt.rx * 0.3} cy={pt.cy - pt.ry * 0.4} rx={pt.rx * 0.3} ry={pt.ry * 0.3} fill="rgba(255,180,140,0.5)" />
          )}
        </g>
      ))}

      <ellipse cx={baseRx * 0.35} cy={-baseRy * 0.4} rx={1.6} ry={0.9} fill="rgba(255,235,215,0.8)" opacity={0.7 * p} filter="url(#psp-particle-blur)" />
    </svg>
  );
}

/* ============================================================
   VINEYARD PLACEHOLDER — cinematic golden-hour landscape with
   sky, sun, godrays, layered hills, cypress, vineyard rows,
   foreground bokeh, dust motes, vignette. Editorial wine film.
   ============================================================ */
function VineyardPlaceholder() {
  const vineRows = [
    { y: 615, amp: 4,  cx: 800, cy: 612, clusters: [220, 360, 500, 640, 780, 920, 1060, 1200, 1340], scale: 1.0,  opacity: 0.95 },
    { y: 645, amp: 5,  cx: 800, cy: 641, clusters: [180, 320, 460, 600, 740, 880, 1020, 1160, 1300, 1420], scale: 1.1, opacity: 0.95 },
    { y: 678, amp: 6,  cx: 800, cy: 673, clusters: [140, 290, 440, 590, 740, 890, 1040, 1190, 1340, 1470], scale: 1.2, opacity: 0.96 },
    { y: 714, amp: 7,  cx: 800, cy: 708, clusters: [110, 270, 430, 590, 750, 910, 1070, 1230, 1390, 1520], scale: 1.3, opacity: 0.97 },
    { y: 754, amp: 8,  cx: 800, cy: 747, clusters: [80,  250, 420, 590, 760, 930, 1100, 1270, 1440, 1560], scale: 1.45, opacity: 0.98 },
    { y: 798, amp: 9,  cx: 800, cy: 790, clusters: [60,  230, 400, 570, 740, 910, 1080, 1250, 1420, 1580], scale: 1.6, opacity: 0.98 },
    { y: 846, amp: 10, cx: 800, cy: 838, clusters: [40,  220, 400, 580, 760, 940, 1120, 1300, 1480, 1580], scale: 1.8, opacity: 0.99 },
  ];

  const slopeRows = [
    { d: "M 250 545 C 400 540, 600 542, 780 548", op: 0.35 },
    { d: "M 240 560 C 420 555, 620 558, 800 564", op: 0.4 },
    { d: "M 235 575 C 430 570, 640 572, 820 578", op: 0.45 },
    { d: "M 230 590 C 440 585, 660 588, 840 594", op: 0.5 },
  ];

  const cypresses = [
    { x: 180, baseY: 600, h: 110, w: 14 },
    { x: 320, baseY: 595, h: 130, w: 16 },
    { x: 1080, baseY: 590, h: 145, w: 17 },
    { x: 1150, baseY: 593, h: 120, w: 14 },
    { x: 1280, baseY: 598, h: 100, w: 13 },
    { x: 1410, baseY: 602, h: 115, w: 15 },
  ];

  const moteSeeds = [
    [320, 180, 1.2], [480, 110, 0.8], [640, 220, 1.5], [780, 90, 1.0],
    [920, 250, 0.7], [1080, 140, 1.3], [1180, 310, 1.6], [880, 180, 0.9],
    [1320, 200, 1.1], [560, 340, 0.8], [720, 280, 1.4], [400, 260, 1.0],
    [1020, 360, 1.7], [240, 320, 0.6], [1240, 70, 1.2], [600, 150, 0.9],
    [840, 380, 1.5], [460, 410, 0.7], [1140, 420, 1.1], [380, 90, 1.3],
    [700, 50, 0.8], [980, 200, 1.0], [1380, 280, 1.4],
  ];
  const motes = moteSeeds.map((m, i) => ({ cx: m[0], cy: m[1], r: m[2], op: 0.35 + (i % 5) * 0.08 }));

  const cirrus = [
    { d: "M 120 200 C 320 192, 540 198, 780 195 S 1240 200, 1480 196", op: 0.25 },
    { d: "M 60 245 C 280 240, 500 246, 740 242 S 1180 248, 1420 244", op: 0.18 },
    { d: "M 200 165 C 380 160, 580 164, 760 161 S 1140 166, 1360 162", op: 0.22 },
    { d: "M 340 280 C 520 276, 720 280, 900 278 S 1260 282, 1480 279", op: 0.14 },
  ];

  const godrays = [
    { d: "M 1240 240 L 380 900 L 480 900 Z", op: 0.14 },
    { d: "M 1240 240 L 600 900 L 700 900 Z", op: 0.18 },
    { d: "M 1240 240 L 820 900 L 920 900 Z", op: 0.12 },
    { d: "M 1240 240 L 1020 900 L 1120 900 Z", op: 0.16 },
    { d: "M 1240 240 L 160 900 L 280 900 Z", op: 0.10 },
    { d: "M 1240 240 L 1240 900 L 1320 900 Z", op: 0.09 },
  ];

  return (
    <svg className="vineyard-placeholder" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="vy-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdeec7" />
          <stop offset="40%" stopColor="#f5d89f" />
          <stop offset="75%" stopColor="#e8b87c" />
          <stop offset="100%" stopColor="#c4845a" />
        </linearGradient>
        <radialGradient id="vy-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fffaf0" stopOpacity="1" />
          <stop offset="20%" stopColor="#fff4d6" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#fde0a8" stopOpacity="0.55" />
          <stop offset="75%" stopColor="#f5c179" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#e8a560" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vy-sun-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="60%" stopColor="#fff5dc" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fde6b4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vy-far-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b89f80" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9b8870" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="vy-mid-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6b50" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6b5644" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="vy-near-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a5a3e" stopOpacity="1" />
          <stop offset="60%" stopColor="#5a3f2a" stopOpacity="1" />
          <stop offset="100%" stopColor="#3d2818" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="vy-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3e26" stopOpacity="1" />
          <stop offset="50%" stopColor="#3a2616" stopOpacity="1" />
          <stop offset="100%" stopColor="#2a1810" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="vy-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf0d4" stopOpacity="0" />
          <stop offset="50%" stopColor="#f5d89f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e8b87c" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="vy-bokeh-green" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#9aa05a" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#7a8040" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5a6028" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vy-bokeh-amber" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b89456" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#8a6b3a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5a4020" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vy-vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="65%" stopColor="#2a1810" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1a0e08" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id="vy-warm-wash" cx="0.78" cy="0.27" r="0.9">
          <stop offset="0%" stopColor="#ffd6a0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffd6a0" stopOpacity="0" />
        </radialGradient>

        <filter id="vy-bokeh-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
        <filter id="vy-soft-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="vy-godray-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="12" /></filter>
        <filter id="vy-haze-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id="vy-cirrus-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="vy-mote-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.6" /></filter>
        <filter id="vy-sun-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>

        <symbol id="vy-canopy" viewBox="-10 -10 20 20">
          <ellipse cx="0" cy="0" rx="9" ry="5" fill="#3a3018" opacity="0.9" />
          <ellipse cx="-3" cy="-2" rx="5" ry="3" fill="#4a3a1c" opacity="0.85" />
          <ellipse cx="3" cy="-1" rx="4" ry="2.5" fill="#2a2010" opacity="0.95" />
          <ellipse cx="0" cy="-3" rx="3" ry="2" fill="#5a4628" opacity="0.7" />
        </symbol>
      </defs>

      <rect x="0" y="0" width="1600" height="900" fill="url(#vy-sky)" />
      <rect x="0" y="0" width="1600" height="900" fill="url(#vy-warm-wash)" />

      <g filter="url(#vy-godray-blur)">
        {godrays.map((g, i) => (
          <path key={`gr-${i}`} d={g.d} fill="#fff4d6" opacity={g.op} />
        ))}
      </g>

      <g filter="url(#vy-cirrus-blur)" fill="none" strokeLinecap="round">
        {cirrus.map((c, i) => (
          <g key={`ci-${i}`}>
            <path d={c.d} stroke="#fff5dc" strokeWidth="6" opacity={c.op} />
            <path d={c.d} stroke="#fde0a8" strokeWidth="2.5" opacity={c.op * 0.8} />
          </g>
        ))}
      </g>

      <g>
        <circle cx="1240" cy="240" r="180" fill="url(#vy-sun)" />
        <circle cx="1240" cy="240" r="110" fill="url(#vy-sun)" opacity="0.85" />
        <circle cx="1240" cy="240" r="60" fill="url(#vy-sun-core)" filter="url(#vy-sun-glow)" />
        <circle cx="1240" cy="240" r="34" fill="#ffffff" opacity="0.9" />
      </g>

      <g filter="url(#vy-haze-blur)">
        <rect x="0" y="430" width="1600" height="180" fill="url(#vy-haze)" />
      </g>

      <g opacity="0.85">
        <path d="M 0 540 C 180 510, 340 520, 520 505 C 700 490, 860 510, 1040 500 C 1220 492, 1380 508, 1600 498 L 1600 600 L 0 600 Z" fill="url(#vy-far-hill)" />
        <path d="M 0 555 C 220 530, 400 545, 580 530 C 780 515, 940 535, 1140 525 C 1320 516, 1460 532, 1600 522 L 1600 600 L 0 600 Z" fill="url(#vy-far-hill)" opacity="0.75" />
      </g>

      <g>
        <path d="M 0 575 C 160 555, 320 568, 480 552 C 660 535, 820 560, 1000 545 C 1180 532, 1340 555, 1600 542 L 1600 700 L 0 700 Z" fill="url(#vy-mid-hill)" opacity="0.7" />
        <g stroke="#4a3826" strokeWidth="0.8" opacity="0.45">
          <path d="M 200 568 L 220 567" />
          <path d="M 240 567 L 260 566" />
          <path d="M 280 566 L 300 566" />
          <path d="M 600 560 L 622 559" />
          <path d="M 640 559 L 662 558" />
          <path d="M 680 558 L 702 557" />
          <path d="M 1000 558 L 1022 558" />
          <path d="M 1040 558 L 1062 557" />
          <path d="M 1080 557 L 1102 556" />
          <path d="M 1300 552 L 1322 551" />
          <path d="M 1340 551 L 1362 550" />
        </g>
        <path d="M 0 595 C 200 575, 380 588, 560 572 C 740 558, 920 580, 1100 568 C 1280 558, 1440 575, 1600 565 L 1600 700 L 0 700 Z" fill="url(#vy-mid-hill)" opacity="0.85" />
      </g>

      <g>
        {cypresses.map((c, i) => (
          <g key={`cy-${i}`}>
            <path d={`M ${c.x} ${c.baseY} C ${c.x - c.w * 0.6} ${c.baseY - c.h * 0.3}, ${c.x - c.w * 0.5} ${c.baseY - c.h * 0.7}, ${c.x} ${c.baseY - c.h} C ${c.x + c.w * 0.5} ${c.baseY - c.h * 0.7}, ${c.x + c.w * 0.6} ${c.baseY - c.h * 0.3}, ${c.x} ${c.baseY} Z`} fill="#1a2418" opacity="0.92" />
            <path d={`M ${c.x + c.w * 0.4} ${c.baseY - c.h * 0.4} C ${c.x + c.w * 0.5} ${c.baseY - c.h * 0.6}, ${c.x + c.w * 0.3} ${c.baseY - c.h * 0.85}, ${c.x + 1} ${c.baseY - c.h + 4}`} stroke="#6b5a3a" strokeWidth="1" fill="none" opacity="0.55" />
          </g>
        ))}
      </g>

      <g>
        <path d="M 0 610 C 180 585, 360 600, 540 580 C 720 562, 900 588, 1080 572 C 1260 558, 1440 582, 1600 570 L 1600 750 L 0 750 Z" fill="url(#vy-near-hill)" />
        <g stroke="#3a2616" strokeWidth="1.2" fill="none" strokeLinecap="round">
          {slopeRows.map((r, i) => (
            <path key={`sr-${i}`} d={r.d} opacity={r.op} />
          ))}
        </g>
        <g stroke="#3a2616" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5">
          <path d="M 900 568 C 1080 564, 1280 568, 1460 572" />
          <path d="M 880 582 C 1080 578, 1300 582, 1480 586" />
          <path d="M 860 596 C 1080 592, 1320 596, 1500 600" />
        </g>
        <path d="M 0 610 C 180 585, 360 600, 540 580 C 720 562, 900 588, 1080 572 C 1260 558, 1440 582, 1600 570" stroke="#b89456" strokeWidth="0.8" fill="none" opacity="0.35" />
      </g>

      <g>
        <path d="M 720 750 C 760 720, 820 695, 880 668 C 920 650, 950 638, 980 628" stroke="#8a6b3a" strokeWidth="14" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M 720 750 C 760 720, 820 695, 880 668 C 920 650, 950 638, 980 628" stroke="#b89456" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
        <g opacity="0.55">
          <rect x="1100" y="612" width="80" height="6" fill="#7a6850" />
          <rect x="1100" y="612" width="14" height="6" fill="#8a7860" />
          <rect x="1126" y="612" width="10" height="6" fill="#6a5640" />
          <rect x="1148" y="612" width="16" height="6" fill="#8a7860" />
        </g>
      </g>

      <g>
        <rect x="0" y="600" width="1600" height="300" fill="url(#vy-ground)" />
        {vineRows.map((row, i) => {
          const y = row.y;
          const a = row.amp;
          const rowPath = `M 0 ${y} C 400 ${y - a}, 800 ${y + a * 0.6}, 1200 ${y - a * 0.4} S 1600 ${y + a * 0.5}, 1600 ${y}`;
          return (
            <g key={`vr-${i}`} opacity={row.opacity}>
              <path d={rowPath} stroke="#3a2618" strokeWidth={1.5 * row.scale} fill="none" opacity="0.85" />
              {row.clusters.map((cx, j) => {
                const size = 7 * row.scale;
                const phase = (cx / 1600) * Math.PI * 2;
                const wobble = Math.sin(phase) * a * 0.4;
                const cy = y - size * 0.6 + wobble;
                return (
                  <use key={`vc-${i}-${j}`} href="#vy-canopy" x={cx - size} y={cy - size} width={size * 2} height={size * 2} />
                );
              })}
              <path d={rowPath} stroke="#b89456" strokeWidth={0.6 * row.scale} fill="none" opacity="0.25" transform={`translate(0 ${-5 * row.scale})`} />
            </g>
          );
        })}
      </g>

      <g filter="url(#vy-mote-glow)">
        {motes.map((m, i) => (
          <circle key={`mt-${i}`} cx={m.cx} cy={m.cy} r={m.r} fill="#fff5dc" opacity={m.op} />
        ))}
      </g>

      <g filter="url(#vy-bokeh-blur)">
        <ellipse cx="120" cy="780" rx="180" ry="140" fill="url(#vy-bokeh-green)" opacity="0.85" />
        <ellipse cx="80" cy="600" rx="140" ry="110" fill="url(#vy-bokeh-green)" opacity="0.55" />
        <ellipse cx="1500" cy="820" rx="200" ry="150" fill="url(#vy-bokeh-amber)" opacity="0.8" />
        <ellipse cx="1560" cy="640" rx="130" ry="100" fill="url(#vy-bokeh-amber)" opacity="0.5" />
        <ellipse cx="380" cy="860" rx="160" ry="90" fill="url(#vy-bokeh-green)" opacity="0.45" />
        <ellipse cx="1240" cy="870" rx="180" ry="100" fill="url(#vy-bokeh-amber)" opacity="0.5" />
      </g>

      <rect x="0" y="0" width="1600" height="900" fill="url(#vy-vignette)" />
      <rect x="0" y="0" width="1600" height="900" fill="url(#vy-warm-wash)" opacity="0.4" />
    </svg>
  );
}

/* ============================================================
   WINE GLASS — Bordeaux silhouette with curved meniscus, swirl,
   legs, environmental reflections, caustic ring on table.
   ============================================================ */
function WineGlass({ fillProgress = 0, scale = 1 }) {
  const f = Math.max(0, Math.min(1, fillProgress));
  const bowlTop = 56;
  const bowlBottom = 170;
  const wineY = bowlBottom - (bowlBottom - bowlTop) * f;

  const bowlHalfWidthAt = (y) => {
    const t = (y - bowlTop) / (bowlBottom - bowlTop);
    const bell = Math.sin(Math.PI * Math.min(1, Math.max(0, t * 0.9 + 0.05)));
    const taper = 1 - Math.pow(t, 2.4) * 0.78;
    return (42 + bell * 18) * taper;
  };

  const wineHalfW = bowlHalfWidthAt(wineY) - 2.5;
  const meniscusRy = Math.max(2.4, wineHalfW * 0.18);

  const cx = 120;

  const innerPathPoints = [];
  for (let y = wineY; y <= 168; y += 4) {
    innerPathPoints.push({ x: cx - (bowlHalfWidthAt(y) - 2.5), y });
  }
  const innerPathPointsRight = [];
  for (let y = 168; y >= wineY; y -= 4) {
    innerPathPointsRight.push({ x: cx + (bowlHalfWidthAt(y) - 2.5), y });
  }

  const winePath = (() => {
    if (f <= 0.001 || innerPathPoints.length === 0 || innerPathPointsRight.length === 0) return "";
    let d = `M ${cx - wineHalfW} ${wineY}`;
    innerPathPoints.forEach((pt, i) => { if (i !== 0) d += ` L ${pt.x.toFixed(2)} ${pt.y}`; });
    d += ` Q ${cx} 174 ${innerPathPointsRight[0].x.toFixed(2)} ${innerPathPointsRight[0].y}`;
    innerPathPointsRight.forEach((pt, i) => { if (i !== 0) d += ` L ${pt.x.toFixed(2)} ${pt.y}`; });
    d += ` A ${wineHalfW} ${meniscusRy} 0 0 1 ${cx - wineHalfW} ${wineY}`;
    d += " Z";
    return d;
  })();

  const legs = [
    { x: -28, top: 8, len: 38, w: 1.6, op: 0.42 },
    { x: -12, top: 14, len: 28, w: 1.2, op: 0.32 },
    { x: 14,  top: 6,  len: 46, w: 1.8, op: 0.48 },
    { x: 30,  top: 18, len: 26, w: 1.1, op: 0.3 },
  ];

  const causticOpacity = 0.55 * f;
  const causticOpacity2 = 0.32 * f;
  const causticOpacity3 = 0.18 * f;
  const showRipple = f > 0.1 && f < 0.85;

  return (
    <div className="glass-wrap" style={{ transform: `scale(${scale})` }}>
      <svg viewBox="0 0 240 420" width="240" height="420" aria-hidden>
        <defs>
          <radialGradient id="wine-fill" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#a52d3d" stopOpacity="1" />
            <stop offset="22%" stopColor="#7c1224" />
            <stop offset="55%" stopColor="#5a0e1f" />
            <stop offset="85%" stopColor="#3a0810" />
            <stop offset="100%" stopColor="#1a0408" />
          </radialGradient>
          <linearGradient id="wine-meniscus" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,210,170,0)" />
            <stop offset="35%" stopColor="rgba(255,225,190,0.85)" />
            <stop offset="65%" stopColor="rgba(255,225,190,0.85)" />
            <stop offset="100%" stopColor="rgba(255,210,170,0)" />
          </linearGradient>
          <linearGradient id="glass-bowl-l" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(245, 238, 220, 0.18)" />
            <stop offset="35%" stopColor="rgba(255, 250, 235, 0.08)" />
            <stop offset="65%" stopColor="rgba(255, 250, 235, 0.05)" />
            <stop offset="100%" stopColor="rgba(180, 160, 130, 0.18)" />
          </linearGradient>
          <linearGradient id="glass-rim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(80, 60, 40, 0.6)" />
            <stop offset="100%" stopColor="rgba(80, 60, 40, 0.2)" />
          </linearGradient>
          <radialGradient id="wg-amber-smear" cx="30%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 190, 120, 0.55)" />
            <stop offset="60%" stopColor="rgba(255, 190, 120, 0.12)" />
            <stop offset="100%" stopColor="rgba(255, 190, 120, 0)" />
          </radialGradient>
          <linearGradient id="wg-right-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 250, 235, 0)" />
            <stop offset="60%" stopColor="rgba(255, 250, 235, 0.35)" />
            <stop offset="100%" stopColor="rgba(255, 250, 235, 0.85)" />
          </linearGradient>
          <linearGradient id="wg-stem-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 250, 235, 0)" />
            <stop offset="50%" stopColor="rgba(255, 250, 235, 0.7)" />
            <stop offset="100%" stopColor="rgba(255, 250, 235, 0)" />
          </linearGradient>
          <radialGradient id="wg-base-warm" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(165, 45, 60, 0)" />
            <stop offset="85%" stopColor="rgba(165, 45, 60, 0.25)" />
            <stop offset="100%" stopColor="rgba(165, 45, 60, 0.45)" />
          </radialGradient>
          <radialGradient id="wg-caustic" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220, 90, 80, 0.85)" />
            <stop offset="40%" stopColor="rgba(165, 45, 60, 0.55)" />
            <stop offset="80%" stopColor="rgba(120, 30, 40, 0.18)" />
            <stop offset="100%" stopColor="rgba(120, 30, 40, 0)" />
          </radialGradient>
          <radialGradient id="wg-contact-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(35, 22, 14, 0.7)" />
            <stop offset="60%" stopColor="rgba(35, 22, 14, 0.28)" />
            <stop offset="100%" stopColor="rgba(35, 22, 14, 0)" />
          </radialGradient>
          <linearGradient id="wg-leg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(165, 45, 60, 0)" />
            <stop offset="35%" stopColor="rgba(165, 45, 60, 0.45)" />
            <stop offset="100%" stopColor="rgba(124, 18, 36, 0.7)" />
          </linearGradient>
          <filter id="wg-blur-heavy" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="wg-blur-med" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="wg-blur-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" /></filter>
          <clipPath id="bowl-clip">
            <path d="M 78 56 C 74 78, 60 96, 60 120 C 60 146, 70 166, 92 172 L 148 172 C 170 166, 180 146, 180 120 C 180 96, 166 78, 162 56 Z" />
          </clipPath>
        </defs>

        {/* Cast shadow + caustic */}
        <g>
          <ellipse cx="120" cy="388" rx="62" ry="10" fill="url(#wg-contact-shadow)" filter="url(#wg-blur-heavy)" opacity="0.9" />
          <ellipse cx="120" cy="386" rx="42" ry="6" fill="rgba(20, 12, 8, 0.55)" filter="url(#wg-blur-med)" />
          <g opacity={causticOpacity}>
            <ellipse cx="102" cy="394" rx="46" ry="9" fill="url(#wg-caustic)" filter="url(#wg-blur-med)" />
          </g>
          <g opacity={causticOpacity2}>
            <ellipse cx="100" cy="396" rx="32" ry="6" fill="url(#wg-caustic)" filter="url(#wg-blur-soft)" />
          </g>
          <g opacity={causticOpacity3}>
            <ellipse cx="98" cy="397" rx="20" ry="4" fill="rgba(220, 110, 90, 0.9)" filter="url(#wg-blur-soft)" />
          </g>
        </g>

        {/* Base / foot */}
        <g>
          <ellipse cx="120" cy="362" rx="44" ry="5" fill="rgba(40,28,20,0.35)" filter="url(#wg-blur-soft)" />
          <ellipse cx="120" cy="358" rx="44" ry="6" fill="rgba(245, 238, 220, 0.22)" stroke="rgba(80, 60, 40, 0.45)" strokeWidth="0.6" />
          <ellipse cx="120" cy="358" rx="44" ry="6" fill="url(#wg-base-warm)" />
          <ellipse cx="120" cy="356" rx="42" ry="4.5" fill="none" stroke="rgba(255, 250, 235, 0.55)" strokeWidth="0.5" />
        </g>

        {/* Stem */}
        <g>
          <rect x="116.5" y="186" width="7" height="170" fill="rgba(245, 238, 220, 0.16)" stroke="rgba(80, 60, 40, 0.4)" strokeWidth="0.4" />
          <rect x="117" y="188" width="2.4" height="166" fill="url(#wg-stem-light)" />
          <rect x="121.5" y="188" width="1.4" height="166" fill="rgba(40, 28, 18, 0.18)" />
          <ellipse cx="120" cy="186" rx="9" ry="2.2" fill="rgba(255, 250, 235, 0.35)" />
          <ellipse cx="120" cy="356" rx="6" ry="1.8" fill="rgba(40, 28, 18, 0.35)" />
        </g>

        {/* Bowl exterior */}
        <g>
          <path d="M 78 56 C 74 78, 60 96, 60 120 C 60 146, 70 166, 92 172 L 148 172 C 170 166, 180 146, 180 120 C 180 96, 166 78, 162 56 Z"
            fill="url(#glass-bowl-l)" stroke="rgba(80, 60, 40, 0.35)" strokeWidth="0.8" />
          <path d="M 80.5 58 C 76.5 79, 63 97, 63 120 C 63 144, 72 163, 93 169 L 147 169 C 168 163, 177 144, 177 120 C 177 97, 163.5 79, 159.5 58"
            fill="none" stroke="rgba(255, 250, 235, 0.18)" strokeWidth="0.7" />
        </g>

        {/* Wine inside bowl */}
        <g clipPath="url(#bowl-clip)">
          {f > 0.001 && (
            <g>
              <path d={winePath} fill="url(#wine-fill)" />
              <ellipse cx={cx} cy={wineY} rx={wineHalfW} ry={meniscusRy} fill="none" stroke="url(#wine-meniscus)" strokeWidth="1.4" opacity="0.9" />
              <ellipse cx={cx} cy={wineY - 0.4} rx={wineHalfW * 0.78} ry={meniscusRy * 0.55} fill="none" stroke="rgba(255, 235, 200, 0.55)" strokeWidth="0.6" />
              <g opacity="0.42">
                <ellipse cx={cx - 4} cy={wineY + 0.6} rx={wineHalfW * 0.55} ry={meniscusRy * 0.42} fill="none" stroke="rgba(255, 200, 170, 0.6)" strokeWidth="0.5" transform={`rotate(-6 ${cx} ${wineY})`} />
                <ellipse cx={cx + 6} cy={wineY + 0.2} rx={wineHalfW * 0.38} ry={meniscusRy * 0.28} fill="none" stroke="rgba(255, 220, 190, 0.55)" strokeWidth="0.45" transform={`rotate(8 ${cx} ${wineY})`} />
                <ellipse cx={cx - 2} cy={wineY + 1.2} rx={wineHalfW * 0.22} ry={meniscusRy * 0.18} fill="none" stroke="rgba(255, 230, 200, 0.5)" strokeWidth="0.4" transform={`rotate(-14 ${cx} ${wineY})`} />
              </g>
              {showRipple && (
                <g opacity="0.55">
                  <ellipse cx={cx + 3} cy={wineY + 0.8} rx={wineHalfW * 0.18} ry={meniscusRy * 0.32} fill="none" stroke="rgba(255, 220, 195, 0.75)" strokeWidth="0.5" />
                  <ellipse cx={cx + 3} cy={wineY + 0.8} rx={wineHalfW * 0.32} ry={meniscusRy * 0.55} fill="none" stroke="rgba(255, 220, 195, 0.45)" strokeWidth="0.4" />
                  <ellipse cx={cx + 3} cy={wineY + 0.8} rx={wineHalfW * 0.48} ry={meniscusRy * 0.78} fill="none" stroke="rgba(255, 220, 195, 0.22)" strokeWidth="0.35" />
                </g>
              )}
              <ellipse cx={cx} cy={168} rx={bowlHalfWidthAt(168) - 4} ry={4} fill="rgba(26, 4, 8, 0.55)" filter="url(#wg-blur-soft)" />
            </g>
          )}
          {f > 0.18 && (
            <g opacity="0.85">
              {legs.map((lg, i) => {
                const x = cx + lg.x;
                const topY = wineY - lg.top - lg.len;
                return (
                  <rect key={i} x={x - lg.w / 2} y={topY} width={lg.w} height={lg.len + lg.top} fill="url(#wg-leg)" opacity={lg.op} rx={lg.w / 2} />
                );
              })}
              <ellipse cx={cx - 12} cy={wineY - 2} rx="1.4" ry="2.6" fill="rgba(124, 18, 36, 0.7)" />
              <ellipse cx={cx + 14} cy={wineY - 4} rx="1.6" ry="3" fill="rgba(124, 18, 36, 0.7)" />
            </g>
          )}
        </g>

        {/* Environmental reflections */}
        <g clipPath="url(#bowl-clip)">
          <ellipse cx="82" cy="84" rx="22" ry="32" fill="url(#wg-amber-smear)" filter="url(#wg-blur-soft)" />
          <g>
            <circle cx="158" cy="78" r="2.4" fill="rgba(255, 245, 215, 0.95)" />
            <circle cx="158" cy="78" r="5" fill="rgba(255, 230, 180, 0.35)" filter="url(#wg-blur-soft)" />
            <circle cx="158" cy="78" r="9" fill="rgba(255, 220, 160, 0.18)" filter="url(#wg-blur-med)" />
          </g>
          <ellipse cx="120" cy="66" rx="36" ry="7" fill="rgba(220, 215, 200, 0.18)" filter="url(#wg-blur-soft)" />
        </g>

        {/* Bowl highlights */}
        <g>
          <path d="M 68 92 C 64 110, 64 138, 76 162" fill="none" stroke="rgba(255, 250, 235, 0.45)" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
          <rect x="170" y="78" width="6" height="86" fill="url(#wg-right-highlight)" opacity="0.7" filter="url(#wg-blur-soft)" />
          <path d="M 174 84 C 178 110, 178 140, 172 162" fill="none" stroke="rgba(255, 250, 235, 0.55)" strokeWidth="0.9" strokeLinecap="round" />
          <ellipse cx="120" cy="56" rx="42" ry="4.2" fill="rgba(245, 238, 220, 0.12)" stroke="url(#glass-rim)" strokeWidth="1" />
          <ellipse cx="120" cy="56.6" rx="40" ry="3.4" fill="none" stroke="rgba(40, 28, 18, 0.35)" strokeWidth="0.5" />
          <path d="M 90 54.5 Q 120 50, 150 54.5" fill="none" stroke="rgba(255, 250, 235, 0.85)" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
   SCROLL-SCRUBBED VIDEO — drives video.currentTime from a 0..1
   `progress` prop. Lerp smoothing in rAF prevents stutter when
   scroll velocity varies. Designed for a 5–10s cinematic clip
   re-encoded with frequent keyframes for instant seek.
   ============================================================ */
function ScrollScrubVideo({ progress = 0, src, poster, smoothing = 0.18, variant = "" }) {
  const videoRef = useRef(null);
  const targetRef = useRef(progress);
  const smoothedRef = useRef(progress);
  const rafRef = useRef(0);
  const [ready, setReady] = useState(false);

  // Track latest progress without re-running the rAF loop.
  useEffect(() => { targetRef.current = progress; }, [progress]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => setReady(true);
    if (v.readyState >= 1) setReady(true);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('canplay', onMeta);
    return () => {
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('canplay', onMeta);
    };
  }, []);

  // iOS Safari requires a play()/pause() priming so currentTime is honored.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready) return;
    const prime = () => {
      const p = v.play();
      if (p && p.then) p.then(() => v.pause()).catch(() => {});
      else v.pause();
    };
    prime();
  }, [ready]);

  // rAF loop: lerp smoothed toward target, write currentTime if delta significant.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !ready) return;
    let lastWritten = -1;
    const tick = () => {
      const dur = v.duration;
      if (dur && isFinite(dur) && dur > 0) {
        smoothedRef.current += (targetRef.current - smoothedRef.current) * smoothing;
        const t = Math.max(0, Math.min(dur - 0.02, smoothedRef.current * dur));
        if (Math.abs(t - lastWritten) > 0.016) {
          try { v.currentTime = t; lastWritten = t; } catch (e) {}
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, smoothing]);

  return (
    <div className={`scrub-video-frame ${variant}`} aria-hidden>
      <video
        ref={videoRef}
        className="scrub-video"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        disablePictureInPicture
      />
      {/* Soft gradient mask — variant-dependent. The default (hero pour)
         hides the wine impact zone bottom-right; other variants override. */}
      <div className="scrub-video-mask" />
      <div className="scrub-video-vignette" />
    </div>
  );
}

window.Bottle = Bottle;
window.BottleSurface = BottleSurface;
window.PourStreamSvg = PourStreamSvg;
window.PourSplash = PourSplash;
window.VineyardPlaceholder = VineyardPlaceholder;
window.WineGlass = WineGlass;
window.ScrollScrubVideo = ScrollScrubVideo;
