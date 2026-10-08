'use client'

export default function LogoAvignon({ className = '' }: { className?: string }) {
  return (
    <svg className={`av-svg ${className}`} viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          .av-M{fill:none;stroke:rgba(240,228,208,.94);stroke-width:1.5;stroke-linejoin:round}
          .av-D{fill:none;stroke:rgba(240,228,208,.86);stroke-width:.88;stroke-linejoin:round}
          .av-F{fill:none;stroke:rgba(240,228,208,.72);stroke-width:.52}
          .av-W{fill:none;stroke:rgba(185,220,255,.62);stroke-width:.65}
          .av-Wf{fill:none;stroke:rgba(185,220,255,.35);stroke-width:.50}
          @keyframes av-logoIn{0%{opacity:0;transform:translateY(28px) scale(.91)}60%{opacity:1;transform:translateY(-2px) scale(1.005)}100%{opacity:1;transform:translateY(0) scale(1)}}
          @keyframes av-drift{0%,100%{transform:translateY(0) rotate(0deg)}36%{transform:translateY(-7px) rotate(.20deg)}72%{transform:translateY(4px) rotate(-.13deg)}}
          .av-svg{display:block;width:100%;height:auto;will-change:transform;animation:av-logoIn 2.2s cubic-bezier(.16,1,.3,1) both,av-drift 54s 2.4s ease-in-out infinite}
          @keyframes av-tw{0%,100%{opacity:.80}48%{opacity:.03}}
          .av-s1{animation:av-tw 3.9s 0.0s ease-in-out infinite}.av-s2{animation:av-tw 4.4s 1.3s ease-in-out infinite}.av-s3{animation:av-tw 3.4s 0.7s ease-in-out infinite}.av-s4{animation:av-tw 5.1s 2.6s ease-in-out infinite}.av-s5{animation:av-tw 3.6s 0.3s ease-in-out infinite}.av-s6{animation:av-tw 4.8s 1.8s ease-in-out infinite}.av-s7{animation:av-tw 3.1s 3.2s ease-in-out infinite}
          @keyframes av-moonDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(-1.5px,2.8px)}}
          .av-moonG{animation:av-moonDrift 44s ease-in-out infinite}
          @keyframes av-wglow{0%,30%,70%,100%{opacity:0}50%{opacity:1}}
          .av-wfb{stroke:none}.av-wf1{animation:av-wglow 12s 0.0s ease-in-out infinite}.av-wf2{animation:av-wglow 12s 4.0s ease-in-out infinite}.av-wf3{animation:av-wglow 12s 8.0s ease-in-out infinite}.av-wf4{animation:av-wglow 9s 1.8s ease-in-out infinite}.av-wf5{animation:av-wglow 9s 5.5s ease-in-out infinite}
          @keyframes av-tA{0%{opacity:.07}8%{opacity:.30}16%{opacity:.06}25%{opacity:.36}34%{opacity:.08}42%{opacity:.28}51%{opacity:.05}60%{opacity:.34}70%{opacity:.09}79%{opacity:.26}89%{opacity:.06}100%{opacity:.07}}
          @keyframes av-tB{0%{opacity:.10}7%{opacity:.22}15%{opacity:.05}23%{opacity:.32}31%{opacity:.08}39%{opacity:.26}48%{opacity:.10}56%{opacity:.28}64%{opacity:.06}73%{opacity:.30}82%{opacity:.07}91%{opacity:.24}100%{opacity:.10}}
          .av-tc1{animation:av-tA 1.85s 0.0s infinite}.av-tc2{animation:av-tB 2.25s 0.5s infinite}.av-tc3{animation:av-tA 1.65s 1.1s infinite}.av-tc4{animation:av-tB 2.90s 0.7s infinite}
          @keyframes av-cornerGl{0%,100%{opacity:.07}50%{opacity:.40}}
          .av-cg{animation:av-cornerGl 6.5s ease-in-out infinite}
          @keyframes av-avIn{from{opacity:0}to{opacity:1}}
          .av-lbl{animation:av-avIn 2.8s 2.5s ease-out both}
        `}</style>
        <linearGradient id="av-wG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(30,72,158,.68)"/>
          <stop offset="55%" stopColor="rgba(14,40,100,.48)"/>
          <stop offset="100%" stopColor="rgba(6,18,55,.28)"/>
        </linearGradient>
        <radialGradient id="av-pg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(210,160,58,.20)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="av-mhG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(218,206,172,.22)"/><stop offset="60%" stopColor="rgba(218,206,172,.05)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <filter id="av-tfG" x="-600%" y="-600%" width="1300%" height="1300%"><feGaussianBlur in="SourceGraphic" stdDeviation="7"/></filter>
        <filter id="av-wfG" x="-80%" y="-15%" width="260%" height="130%"><feGaussianBlur in="SourceGraphic" stdDeviation="5.5"/></filter>
        <filter id="av-mfG" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="12"/></filter>
      </defs>

      {/* Stars */}
      <polygon className="av-s1 av-F" points="56,28 57.8,32 62,33 57.8,34 56,38 54.2,34 50,33 54.2,32"/>
      <polygon className="av-s2 av-F" points="120,14 121.5,18 126,18.5 121.5,19 120,23 118.5,19 114,18.5 118.5,18"/>
      <polygon className="av-s3 av-F" points="448,32 449.7,36 454,37 449.7,38 448,42 446.3,38 442,37 446.3,36"/>
      <polygon className="av-s4 av-F" points="490,14 491.4,17.5 495,18 491.4,18.5 490,22 488.6,18.5 485,18 488.6,17.5"/>
      <polygon className="av-s5 av-F" points="526,28 527.1,31 530,31.5 527.1,32 526,35 524.9,32 522,31.5 524.9,31"/>
      <polygon className="av-s6 av-F" points="548,64 549.1,67 552,67.5 549.1,68 548,71 546.9,68 544,67.5 546.9,67"/>
      <polygon className="av-s7 av-F" points="320,18 321,21 324,21.5 321,22 320,25 319,22 316,21.5 319,21"/>

      {/* Moon */}
      <g className="av-moonG">
        <circle cx="502" cy="46" r="36" fill="url(#av-mhG)" filter="url(#av-mfG)"/>
        <circle cx="502" cy="46" r="14" fill="rgba(226,213,184,.76)"/>
        <circle cx="496" cy="45" r="12" fill="#0c0703"/>
      </g>

      {/* Shooting star */}
      <line x1="0" y1="0" x2="24" y2="9" fill="none" stroke="rgba(240,228,208,.88)" strokeWidth=".72">
        <animateMotion path="M 540,22 L 462,54" dur=".85s" begin="8s;28s;51s" fill="remove"/>
        <animate attributeName="opacity" values="0;.92;0" dur=".85s" begin="8s;28s;51s" fill="remove"/>
      </line>

      <ellipse className="av-cg" cx="248" cy="194" rx="5" ry="34" fill="rgba(220,162,48,.26)"/>
      <rect x="0" y="0" width="560" height="340" fill="rgba(190,140,55,0)" pointerEvents="none">
        <animate attributeName="fill-opacity" values="0;.04;0" dur="54s" repeatCount="indefinite"/>
      </rect>

      {/* ── PONT ── */}
      <g transform="translate(0,39) skewY(-9)">
        <animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;-2 -1.6;1 1;0 0" keyTimes="0;0.42;0.78;1" dur="54s" repeatCount="indefinite"/>
        <rect className="av-M" x="10" y="200" width="16" height="52"/>
        <rect className="av-M" x="10" y="200" width="238" height="5"/>
        <line className="av-D" x1="10" y1="197" x2="248" y2="197"/>
        <line className="av-F" opacity=".18" x1="48" y1="200" x2="48" y2="205"/>
        <line className="av-F" opacity=".18" x1="116" y1="200" x2="116" y2="205"/>
        <line className="av-F" opacity=".18" x1="178" y1="200" x2="178" y2="205"/>
        <line className="av-F" opacity=".18" x1="222" y1="200" x2="222" y2="205"/>
        <path fill="rgba(20,52,138,.44)" d="M26,250 A24,24 0 0 1 74,250 Z"/>
        <path fill="rgba(20,52,138,.44)" d="M84,250 A24,24 0 0 1 132,250 Z"/>
        <path fill="rgba(20,52,138,.44)" d="M142,250 A24,24 0 0 1 190,250 Z"/>
        <path fill="rgba(20,52,138,.22)" d="M200,250 A24,24 0 0 1 248,250 Z"/>
        <path className="av-M" d="M26,250 A24,24 0 0 1 74,250"/>
        <path className="av-M" d="M84,250 A24,24 0 0 1 132,250"/>
        <path className="av-M" d="M142,250 A24,24 0 0 1 190,250"/>
        <path className="av-M" strokeDasharray="3.5 3" d="M200,250 A24,24 0 0 1 248,250"/>
        <rect className="av-D" x="74" y="205" width="10" height="45"/>
        <rect className="av-D" x="132" y="205" width="10" height="45"/>
        <rect className="av-D" x="190" y="205" width="10" height="45"/>
        <rect fill="rgba(8,24,68,.52)" stroke="none" x="74" y="250" width="10" height="8"/>
        <rect fill="rgba(8,24,68,.52)" stroke="none" x="132" y="250" width="10" height="8"/>
        <rect fill="rgba(8,24,68,.52)" stroke="none" x="190" y="250" width="10" height="8"/>
        {/* Chapel */}
        <rect className="av-D" x="128" y="184" width="18" height="16"/>
        <path className="av-D" d="M128,185 A5,5 0 0 0 128,200"/>
        <path className="av-F" d="M133,200 L133,192 Q133,188 136,188 Q139,188 139,192 L139,200"/>
        <rect className="av-D" x="132" y="170" width="10" height="14"/>
        <circle className="av-F" cx="137" cy="176.5" r="2.2"/>
        <path className="av-F" d="M130,170 L137,159 L144,170"/>
        <line className="av-F" x1="137" y1="159" x2="137" y2="152"/>
        <line className="av-F" x1="134.2" y1="155.5" x2="139.8" y2="155.5"/>
        <path className="av-F" d="M127,185 L136,181 L146,185"/>
        {/* Water */}
        <polygon fill="rgba(22,58,148,.50)" stroke="none" points="10,252 248,252 248,294 10,294"/>
        <polygon fill="rgba(55,125,215,.20)" stroke="none" points="10,252 248,252 248,262 10,262"/>
        <line className="av-F" opacity=".60" x1="10" y1="252" x2="248" y2="252"/>
        <path className="av-W" d="M10,258 Q48,253 86,258 Q124,263 162,258 Q200,253 238,258 Q246,259 248,258">
          <animate attributeName="d" values="M10,258 Q48,253 86,258 Q124,263 162,258 Q200,253 238,258 Q246,259 248,258;M10,258 Q62,253 100,258 Q138,263 176,258 Q214,253 248,258 Q248,258 248,258;M10,258 Q48,253 86,258 Q124,263 162,258 Q200,253 238,258 Q246,259 248,258" keyTimes="0;0.72;1" calcMode="spline" keySplines="0.38 0 0.62 1;0 0 1 1" dur="4s" repeatCount="indefinite"/>
        </path>
        <path className="av-Wf" d="M10,265 Q62,261 110,265 Q158,269 206,265 Q234,262 248,264">
          <animate attributeName="d" values="M10,265 Q62,261 110,265 Q158,269 206,265 Q234,262 248,264;M10,265 Q76,261 124,265 Q172,269 220,265 Q244,263 248,264;M10,265 Q62,261 110,265 Q158,269 206,265 Q234,262 248,264" keyTimes="0;0.72;1" calcMode="spline" keySplines="0.38 0 0.62 1;0 0 1 1" dur="4.2s" begin="-2.1s" repeatCount="indefinite"/>
        </path>
        <path className="av-Wf" opacity=".50" d="M10,272 Q82,269 154,272 Q214,275 248,273">
          <animate attributeName="d" values="M10,272 Q82,269 154,272 Q214,275 248,273;M10,272 Q108,269 180,272 Q228,275 248,273;M10,272 Q82,269 154,272 Q214,275 248,273" keyTimes="0;0.72;1" calcMode="spline" keySplines="0.38 0 0.62 1;0 0 1 1" dur="6s" begin="-1.5s" repeatCount="indefinite"/>
        </path>
        <line className="av-F" opacity=".18" x1="30" y1="263" x2="65" y2="263"/>
        <line className="av-F" opacity=".13" x1="94" y1="268" x2="132" y2="268"/>
        <line className="av-F" opacity=".10" x1="160" y1="264" x2="206" y2="264"/>
        <circle cx="54" cy="268" r="1.1" fill="rgba(240,228,208,0)">
          <animate attributeName="fill-opacity" values="0;0;0;.80;.20;.95;0;0;0;0;0" dur="10s" repeatCount="indefinite"/>
        </circle>
        <circle cx="148" cy="263" r="0.9" fill="rgba(240,228,208,0)">
          <animate attributeName="fill-opacity" values="0;0;0;0;.85;.25;0;0;0;0;0" dur="10s" begin="3.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="212" cy="269" r="1.0" fill="rgba(240,228,208,0)">
          <animate attributeName="fill-opacity" values="0;0;.70;.15;.88;0;0;0;0;0;0" dur="10s" begin="6.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="82" cy="260" r="0" fill="none" stroke="rgba(200,225,255,.42)" strokeWidth=".55">
          <animate attributeName="r" values="0;15" dur="4.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".55;0" dur="4.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="174" cy="266" r="0" fill="none" stroke="rgba(200,225,255,.30)" strokeWidth=".45">
          <animate attributeName="r" values="0;10" dur="4.2s" begin="2.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".45;0" dur="4.2s" begin="2.3s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* ── PALAIS ── */}
      <g transform="translate(-28,-19) skewY(4)">
        <animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;2.4 -1.6;-1.1 1.0;0 0" keyTimes="0;0.38;0.72;1" dur="61s" repeatCount="indefinite"/>
        <ellipse cx="436" cy="130" rx="58" ry="42" fill="url(#av-pg)">
          <animate attributeName="opacity" values=".28;1;.28" dur="10s" repeatCount="indefinite"/>
        </ellipse>
        {/* Window glows — alignés avec les nouvelles fenêtres (y=148-196) */}
        <rect className="av-wfb" x="397" y="148" width="16" height="48" rx="7" fill="rgba(210,158,52,.22)" filter="url(#av-wfG)">
          <animate attributeName="fill-opacity" values="0;.24;0" dur="12s" begin="0s" repeatCount="indefinite"/>
        </rect>
        <rect className="av-wfb" x="421" y="148" width="16" height="48" rx="7" fill="rgba(210,158,52,.22)" filter="url(#av-wfG)">
          <animate attributeName="fill-opacity" values="0;.24;0" dur="12s" begin="4s" repeatCount="indefinite"/>
        </rect>
        <rect className="av-wfb" x="445" y="148" width="16" height="48" rx="7" fill="rgba(210,158,52,.22)" filter="url(#av-wfG)">
          <animate attributeName="fill-opacity" values="0;.24;0" dur="12s" begin="8s" repeatCount="indefinite"/>
        </rect>
        {/* Moonlight sweep */}
        <rect x="276" y="88" width="24" height="120" fill="rgba(224,214,188,.04)" opacity="0">
          <animate attributeName="x" values="276;548;548" keyTimes="0;0.92;1" dur="24s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;.65;.65;0" keyTimes="0;0.05;0.95;1" dur="24s" repeatCount="indefinite"/>
        </rect>
        <line className="av-F" x1="276" y1="200" x2="548" y2="200"/>
        {/* Torch rempart */}
        <circle className="av-tc1" cx="284" cy="162" r="9" fill="rgba(220,150,40,.32)" filter="url(#av-tfG)"/>
        <circle className="av-tc1" cx="284" cy="162" r="2.4" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.4;3.1;2.2;3.3;2.5" dur="1.85s" repeatCount="indefinite"/>
        </circle>
        {/* Rempart */}
        <rect className="av-M" x="276" y="172" width="18" height="28"/>
        <path className="av-D" d="M276,172 L276,164 L281,164 L281,168 L286,168 L286,164 L291,164 L291,168 L294,168 L294,172"/>
        {/* T1 */}
        <rect className="av-M" x="294" y="124" width="31" height="76"/>
        <rect className="av-M" x="291" y="116" width="37" height="10"/>
        <path className="av-D" d="M291,126 L291,116 L297,116 L297,120 L303,120 L303,116 L309,116 L309,120 L315,120 L315,116 L321,116 L321,120 L328,120 L328,126"/>
        <path className="av-D" d="M300,182 L300,153 Q300,143 309,143 Q318,143 318,153 L318,182"/>
        <path className="av-D" d="M300,198 L300,190 Q300,185 309,185 Q318,185 318,190 L318,198"/>
        {/* W1 */}
        <rect className="av-M" x="325" y="158" width="25" height="42"/>
        <path className="av-D" d="M325,158 L325,150 L330,150 L330,154 L335,154 L335,150 L340,150 L340,154 L345,154 L345,150 L350,150 L350,158"/>
        {/* Torch T2 */}
        <circle className="av-tc2" cx="346" cy="80" r="10" fill="rgba(220,150,40,.30)" filter="url(#av-tfG)"/>
        <circle className="av-tc2" cx="346" cy="80" r="2.5" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.5;3.4;2.1;3.2;2.6" dur="2.25s" repeatCount="indefinite"/>
        </circle>
        {/* T2 */}
        <rect className="av-M" x="350" y="90" width="42" height="110"/>
        <rect className="av-M" x="347" y="82" width="48" height="10"/>
        <path className="av-D" d="M347,92 L347,82 L353,82 L353,86 L359,86 L359,82 L365,82 L365,86 L371,86 L371,82 L377,82 L377,86 L383,86 L383,82 L389,82 L389,86 L395,86 L395,92"/>
        <path className="av-D" d="M360,128 L360,104 Q360,93 371,93 Q382,93 382,104 L382,128"/>
        <path className="av-D" d="M360,157 L360,141 Q360,133 371,133 Q382,133 382,141 L382,157"/>
        <path className="av-D" d="M360,184 L360,168 Q360,163 371,163 Q382,163 382,168 L382,184"/>
        {/* Flag */}
        <line className="av-F" x1="371" y1="82" x2="371" y2="64"/>
        <path className="av-F" d="M371,64 L383,68 L371,73">
          <animate attributeName="d" values="M371,64 L383,68 L371,73;M371,64 L384,67 L373,73;M371,64 L382,69 L371,74;M371,64 L383,67.5 L372,73.5;M371,64 L383,68 L371,73" dur="3.2s" repeatCount="indefinite"/>
        </path>
        {/* Façade gothique */}
        <rect className="av-M" x="392" y="132" width="88" height="68"/>
        <path className="av-D" d="M392,132 L392,124 L399,124 L399,128 L406,128 L406,124 L413,124 L413,128 L420,128 L420,124 L427,124 L427,128 L434,128 L434,124 L441,124 L441,128 L448,128 L448,124 L455,124 L455,128 L462,128 L462,124 L469,124 L469,128 L476,128 L476,124 L480,132"/>
        {/* Piliers séparant les 3 travées */}
        <line className="av-F" x1="417" y1="132" x2="417" y2="200" strokeOpacity=".38"/>
        <line className="av-F" x1="443" y1="132" x2="443" y2="200" strokeOpacity=".38"/>
        {/* 3 fenêtres ogivales — proportions correctes (≈3:1), non chevauchantes */}
        {/* style inline pour contourner fill:none de .av-D */}
        <path className="av-D" style={{fill:'rgba(4,2,0,.90)'}}
          d="M397,197 L397,158 Q397,144 405,143 Q413,144 413,158 L413,197 Z"/>
        <path className="av-D" style={{fill:'rgba(4,2,0,.90)'}}
          d="M421,197 L421,158 Q421,144 429,143 Q437,144 437,158 L437,197 Z"/>
        <path className="av-D" style={{fill:'rgba(4,2,0,.90)'}}
          d="M445,197 L445,158 Q445,144 453,143 Q461,144 461,158 L461,197 Z"/>
        {/* Contreforts */}
        <path className="av-F" d="M414,132 L420,95 L426,132"/>
        <path className="av-F" d="M458,132 L464,93 L470,132"/>
        {/* Porte centrale supprimée — chevauchait Window 2 */}
        {/* Torch T3 */}
        <circle className="av-tc3" cx="476" cy="94" r="9" fill="rgba(220,150,40,.28)" filter="url(#av-tfG)"/>
        <circle className="av-tc3" cx="476" cy="94" r="2.3" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.3;3.0;2.0;3.2;2.4" dur="1.65s" repeatCount="indefinite"/>
        </circle>
        {/* T3 */}
        <rect className="av-M" x="480" y="104" width="35" height="96"/>
        <rect className="av-M" x="477" y="96" width="41" height="10"/>
        <path className="av-D" d="M477,106 L477,96 L483,96 L483,100 L489,100 L489,96 L495,96 L495,100 L501,100 L501,96 L507,96 L507,100 L513,100 L513,96 L518,106"/>
        <path className="av-D" d="M487,144 L487,118 Q487,107 497.5,107 Q508,107 508,118 L508,144"/>
        <path className="av-D" d="M487,173 L487,157 Q487,148 497.5,148 Q508,148 508,157 L508,173"/>
        <rect className="av-wfb" x="489" y="109" width="17" height="33" rx="8" fill="rgba(210,158,52,.22)" filter="url(#av-wfG)">
          <animate attributeName="fill-opacity" values="0;.24;0" dur="12s" begin="2s" repeatCount="indefinite"/>
        </rect>
        {/* Aile droite */}
        <circle className="av-tc4" cx="550" cy="134" r="8" fill="rgba(220,150,40,.28)" filter="url(#av-tfG)"/>
        <circle className="av-tc4" cx="550" cy="134" r="2.2" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.2;3.0;2.0;2.8;2.3" dur="2.90s" repeatCount="indefinite"/>
        </circle>
        <rect className="av-M" x="515" y="144" width="33" height="56"/>
        <path className="av-D" d="M515,144 L515,136 L520,136 L520,140 L525,140 L525,136 L530,136 L530,140 L535,140 L535,136 L540,136 L540,140 L545,140 L545,144 L548,144"/>
        <path className="av-D" d="M521,200 L521,163 Q521,153 529.5,153 Q538,153 538,163 L538,200"/>
        <rect className="av-wfb" x="523" y="155" width="13" height="43" rx="6" fill="rgba(210,158,52,.22)" filter="url(#av-wfG)">
          <animate attributeName="fill-opacity" values="0;.24;0" dur="12s" begin="6s" repeatCount="indefinite"/>
        </rect>
        {/* Label */}
        <g className="av-lbl">
          <path fill="rgba(240,228,208,.28)" stroke="none" d="M360,224 L363,220 L366,224 L363,228 Z"/>
          <path fill="rgba(240,228,208,.28)" stroke="none" d="M458,224 L461,220 L464,224 L461,228 Z"/>
          <text x="412" y="225" fontFamily="var(--font-cinzel),Georgia,serif" fontSize="17.5" fontWeight="600"
            letterSpacing="7" fill="rgba(240,228,208,.50)" textAnchor="middle" stroke="none">AVIGNON</text>
          <line x1="368" y1="215" x2="456" y2="215" stroke="rgba(240,228,208,.12)" strokeWidth=".6"/>
          <line x1="368" y1="230" x2="456" y2="230" stroke="rgba(240,228,208,.10)" strokeWidth=".5"/>
        </g>
      </g>
    </svg>
  )
}
