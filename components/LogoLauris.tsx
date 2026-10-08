'use client'

export default function LogoLauris({ className = '' }: { className?: string }) {
  return (
    <svg className={`la-svg ${className}`} viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          .la-M{fill:none;stroke:rgba(235,218,185,.92);stroke-width:1.4;stroke-linejoin:round}
          .la-D{fill:none;stroke:rgba(235,218,185,.78);stroke-width:.88;stroke-linejoin:round}
          .la-F{fill:none;stroke:rgba(235,218,185,.52);stroke-width:.52}
          .la-V{fill:none;stroke:rgba(75,115,45,.55);stroke-width:.8}
          @keyframes la-logoIn{0%{opacity:0;transform:translateY(28px) scale(.91)}60%{opacity:1;transform:translateY(-2px) scale(1.005)}100%{opacity:1;transform:translateY(0) scale(1)}}
          @keyframes la-drift{0%,100%{transform:translateY(0)}38%{transform:translateY(-5px)}72%{transform:translateY(2.5px)}}
          .la-svg{display:block;width:100%;height:auto;will-change:transform;animation:la-logoIn 2.2s cubic-bezier(.16,1,.3,1) both,la-drift 56s 2.4s ease-in-out infinite}
          @keyframes la-tw{0%,100%{opacity:.80}48%{opacity:.03}}
          .la-s1{animation:la-tw 3.9s 0s ease-in-out infinite}.la-s2{animation:la-tw 4.4s 1.3s ease-in-out infinite}.la-s3{animation:la-tw 3.4s .7s ease-in-out infinite}.la-s4{animation:la-tw 5.1s 2.6s ease-in-out infinite}.la-s5{animation:la-tw 3.6s .3s ease-in-out infinite}.la-s6{animation:la-tw 4.8s 1.8s ease-in-out infinite}.la-s7{animation:la-tw 3.1s 3.2s ease-in-out infinite}
          @keyframes la-moonD{0%,100%{transform:translate(0,0)}50%{transform:translate(-1.5px,2.8px)}}
          .la-moonG{animation:la-moonD 44s ease-in-out infinite}
          @keyframes la-wg{0%,30%,70%,100%{opacity:0}50%{opacity:1}}
          .la-wfb{stroke:none}
          .la-wf1{animation:la-wg 12s 0s ease-in-out infinite}.la-wf2{animation:la-wg 12s 4s ease-in-out infinite}.la-wf3{animation:la-wg 12s 8s ease-in-out infinite}.la-wf4{animation:la-wg 9s 2s ease-in-out infinite}.la-wf5{animation:la-wg 9s 6s ease-in-out infinite}.la-wf6{animation:la-wg 10s 1s ease-in-out infinite}.la-wf7{animation:la-wg 11s 5s ease-in-out infinite}
          @keyframes la-tA{0%{opacity:.07}8%{opacity:.32}16%{opacity:.06}25%{opacity:.38}34%{opacity:.08}42%{opacity:.30}51%{opacity:.05}60%{opacity:.36}70%{opacity:.09}79%{opacity:.28}89%{opacity:.06}100%{opacity:.07}}
          @keyframes la-tB{0%{opacity:.10}7%{opacity:.24}15%{opacity:.05}23%{opacity:.34}31%{opacity:.08}39%{opacity:.28}48%{opacity:.10}56%{opacity:.30}64%{opacity:.06}73%{opacity:.32}82%{opacity:.07}91%{opacity:.26}100%{opacity:.10}}
          .la-tc1{animation:la-tA 1.9s 0s infinite}.la-tc2{animation:la-tB 2.3s .6s infinite}.la-tc3{animation:la-tA 2.1s 1.1s infinite}
          @keyframes la-luc{0%,15%,85%,100%{opacity:0}40%,60%{opacity:.92}}
          .la-l1{animation:la-luc 3.2s .4s ease-in-out infinite}.la-l2{animation:la-luc 2.8s 1.8s ease-in-out infinite}.la-l3{animation:la-luc 3.8s 3.0s ease-in-out infinite}.la-l4{animation:la-luc 2.5s 5.2s ease-in-out infinite}
          @keyframes la-rip{0%{r:0;opacity:.50}100%{r:9;opacity:0}}
          .la-r1{animation:la-rip 3.4s 0s ease-out infinite}.la-r2{animation:la-rip 3.4s 1.7s ease-out infinite}
        `}</style>
        <filter id="la-tfG" x="-600%" y="-600%" width="1300%" height="1300%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="la-wfG" x="-80%" y="-15%" width="260%" height="130%"><feGaussianBlur stdDeviation="5.5"/></filter>
        <filter id="la-mfG" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="12"/></filter>
        <radialGradient id="la-mhG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(218,206,172,.22)"/><stop offset="60%" stopColor="rgba(218,206,172,.05)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="la-nG" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(210,162,55,.22)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="la-pg" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="rgba(210,162,55,.20)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* Stars — couvrent tout le viewBox */}
      <polygon className="la-s1 la-F" points="56,28 57.8,32 62,33 57.8,34 56,38 54.2,34 50,33 54.2,32"/>
      <polygon className="la-s2 la-F" points="120,14 121.5,18 126,18.5 121.5,19 120,23 118.5,19 114,18.5 118.5,18"/>
      <polygon className="la-s3 la-F" points="448,32 449.7,36 454,37 449.7,38 448,42 446.3,38 442,37 446.3,36"/>
      <polygon className="la-s4 la-F" points="490,14 491.4,17.5 495,18 491.4,18.5 490,22 488.6,18.5 485,18 488.6,17.5"/>
      <polygon className="la-s5 la-F" points="526,28 527.1,31 530,31.5 527.1,32 526,35 524.9,32 522,31.5 524.9,31"/>
      <polygon className="la-s6 la-F" points="320,18 321,21 324,21.5 321,22 320,25 319,22 316,21.5 319,21"/>
      <polygon className="la-s7 la-F" points="86,12 87,15 90,15.5 87,16 86,19 85,16 82,15.5 85,15"/>

      {/* Moon */}
      <g className="la-moonG">
        <circle cx="502" cy="46" r="36" fill="url(#la-mhG)" filter="url(#la-mfG)"/>
        <circle cx="502" cy="46" r="14" fill="rgba(226,213,184,.76)"/>
        <circle cx="496" cy="45" r="12" fill="#0c0703"/>
      </g>

      {/* Shooting star */}
      <line x1="0" y1="0" x2="24" y2="9" fill="none" stroke="rgba(235,218,185,.88)" strokeWidth=".72">
        <animateMotion path="M 540,22 L 462,54" dur=".85s" begin="9s;31s;55s" fill="remove"/>
        <animate attributeName="opacity" values="0;.92;0" dur=".85s" begin="9s;31s;55s" fill="remove"/>
      </line>

      {/* ── CHÂTEAU (gauche) + TERRASSES (droite) — face gauche ── */}
      <g transform="translate(0,39) skewY(-9)">
        <animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;-2 -1.6;1 1;0 0" keyTimes="0;0.42;0.78;1" dur="52s" repeatCount="indefinite"/>

        {/* Halo au-dessus du château — centré sur bâtiment élargi */}
        <ellipse cx="112" cy="114" rx="100" ry="48" fill="url(#la-pg)" opacity=".55">
          <animate attributeName="opacity" values=".38;.72;.38" dur="9s" repeatCount="indefinite"/>
        </ellipse>

        {/* Cyprès flanquant le château élargi */}
        <ellipse cx="8"   cy="132" rx="4.5" ry="48" fill="rgba(22,42,14,.82)" stroke="rgba(46,84,30,.42)" strokeWidth=".8"/>
        <ellipse cx="20"  cy="140" rx="3"   ry="34" fill="rgba(22,42,14,.66)" stroke="rgba(46,84,30,.34)" strokeWidth=".6"/>
        <ellipse cx="218" cy="128" rx="4.5" ry="52" fill="rgba(22,42,14,.80)" stroke="rgba(46,84,30,.40)" strokeWidth=".8"/>
        <ellipse cx="230" cy="136" rx="3"   ry="36" fill="rgba(22,42,14,.64)" stroke="rgba(46,84,30,.32)" strokeWidth=".6"/>

        {/* ── CHÂTEAU DE LAURIS (x=12-212, 3×7 fenêtres) ── */}
        <rect className="la-M" x="12" y="82" width="200" height="12" fill="rgba(18,12,4,.90)"/>
        <line x1="10" y1="94" x2="212" y2="94" stroke="rgba(235,218,185,.55)" strokeWidth=".8"/>
        {/* Mât et drapeau — centré sur bâtiment */}
        <line x1="112" y1="82" x2="112" y2="65" stroke="rgba(235,218,185,.52)" strokeWidth=".7"/>
        <path className="la-F" d="M112,65 L127,69 L112,75" fill="rgba(235,218,185,.25)">
          <animate attributeName="d"
            values="M112,65 L127,69 L112,75;M112,65 L128,68 L113,74;M112,65 L126,70 L112,76;M112,65 L127,68.5 L112,75;M112,65 L127,69 L112,75"
            dur="3.4s" repeatCount="indefinite"/>
        </path>
        {/* Corps bâtiment */}
        <rect className="la-M" x="12" y="94" width="200" height="88" fill="rgba(28,20,7,.82)"/>
        {/* String courses */}
        <rect x="12" y="122" width="200" height="3.5" fill="rgba(42,30,10,.78)" stroke="rgba(235,218,185,.26)" strokeWidth=".5"/>
        <rect x="12" y="151" width="200" height="3.5" fill="rgba(38,27,8,.72)" stroke="rgba(235,218,185,.22)" strokeWidth=".45"/>
        {/* 3 rangées × 7 fenêtres (wx = 16 + col*28) */}
        {[0,1,2].map(row => {
          const wy = 97 + row * 28;
          return [0,1,2,3,4,5,6].map(col => {
            const wx = 16 + col * 28;
            return (
              <g key={`w-${row}-${col}`}>
                <rect x={wx} y={wy} width="17" height="21" fill="rgba(5,3,1,.72)" stroke="rgba(235,218,185,.48)" strokeWidth=".55"/>
                <rect x={wx-4} y={wy} width="4" height="21" fill="rgba(15,26,8,.84)" stroke="rgba(235,218,185,.18)" strokeWidth=".35"/>
                <rect x={wx+17} y={wy} width="4" height="21" fill="rgba(15,26,8,.84)" stroke="rgba(235,218,185,.18)" strokeWidth=".35"/>
              </g>
            );
          });
        })}
        {/* Halos fenêtres (7 parmi 21) */}
        <rect className="la-wfb la-wf1" x="16"  y="97"  width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf5" x="72"  y="97"  width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf2" x="184" y="97"  width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf6" x="44"  y="125" width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf7" x="156" y="125" width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf3" x="72"  y="154" width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf4" x="156" y="154" width="17" height="21" rx="2" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        {/* Torches entrée château */}
        <circle className="la-tc1" cx="14"  cy="177" r="8" fill="rgba(220,150,40,.28)" filter="url(#la-tfG)"/>
        <circle className="la-tc1" cx="14"  cy="177" r="2.2" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.2;3.0;2.0;3.2;2.3" dur="1.9s" repeatCount="indefinite"/>
        </circle>
        <circle className="la-tc3" cx="210" cy="177" r="8" fill="rgba(220,150,40,.26)" filter="url(#la-tfG)"/>
        <circle className="la-tc3" cx="210" cy="177" r="2.1" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.1;2.8;1.9;3.0;2.2" dur="2.1s" repeatCount="indefinite"/>
        </circle>

        {/* ── FALAISE pleine largeur sous château ── */}
        <path fill="rgba(44,32,11,.90)"
          d="M14,182 L26,174 L38,182 L52,170 L68,178 L86,164 L106,173 L128,158 L148,167 L168,154 L188,162 L208,151 L222,160 L228,182 Z"/>
        <path className="la-F" d="M14,182 L26,174 L38,182 L52,170 L68,178 L86,164 L106,173 L128,158 L148,167 L168,154 L188,162 L208,151 L222,160" opacity=".72"/>
        <path className="la-F" d="M14,197 L34,191 L60,197 L90,189 L118,194 L148,191 L178,196 L208,190 L228,194" opacity=".40"/>

        {/* Garrigue pleine largeur */}
        <ellipse cx="30" cy="208" rx="14" ry="7" fill="rgba(14,28,8,.68)"/>
        <ellipse cx="66" cy="212" rx="18" ry="7" fill="rgba(12,24,6,.62)"/>
        <ellipse cx="100" cy="210" rx="16" ry="6" fill="rgba(14,28,8,.65)"/>
        <ellipse cx="148" cy="209" rx="16" ry="6" fill="rgba(14,28,8,.62)"/>
        <ellipse cx="186" cy="212" rx="14" ry="7" fill="rgba(12,24,6,.60)"/>
        <ellipse cx="220" cy="210" rx="12" ry="6" fill="rgba(14,28,8,.58)"/>

        {/* Lucioles dans la garrigue */}
        <circle className="la-l1" cx="50" cy="204" r="1.4" fill="rgba(190,240,80,.92)"/>
        <circle className="la-l2" cx="130" cy="200" r="1.2" fill="rgba(190,240,80,.90)"/>
        <circle className="la-l3" cx="178" cy="206" r="1.3" fill="rgba(200,245,85,.88)"/>
        <circle className="la-l4" cx="210" cy="202" r="1.1" fill="rgba(185,235,75,.82)"/>

        {/* Mur terrasse basse (pleine largeur) */}
        <rect x="14" y="225" width="214" height="3" fill="rgba(80,56,18,.52)" stroke="rgba(210,165,55,.30)" strokeWidth=".6"/>

        {/* Vignes et lavande (pleine largeur) */}
        <line className="la-V" x1="16" y1="232" x2="226" y2="232" strokeDasharray="4 6"/>
        <line className="la-V" x1="16" y1="240" x2="226" y2="240" strokeDasharray="3 5" opacity=".72"/>
        <line x1="16" y1="248" x2="226" y2="248" stroke="rgba(115,68,155,.50)" strokeWidth=".9" strokeDasharray="1.5 3.5"/>

        {/* Balayage lune */}
        <rect x="14" y="82" width="20" height="108" fill="rgba(224,214,188,.04)" opacity="0">
          <animate attributeName="x" values="14;212;212" keyTimes="0;0.92;1" dur="24s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;.42;.42;0" keyTimes="0;0.05;0.95;1" dur="24s" repeatCount="indefinite"/>
        </rect>
      </g>

      {/* ── TERRASSES DE LAURIS — face droite (panorama, même ligne y=200) ── */}
      <g transform="translate(-48,-19) skewY(4)">
        <animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;2.4 -1.6;-1.1 1.0;0 0" keyTimes="0;0.38;0.72;1" dur="61s" repeatCount="indefinite"/>

        {/* Halo chaud */}
        <ellipse cx="412" cy="108" rx="92" ry="54" fill="rgba(210,158,52,.07)">
          <animate attributeName="opacity" values=".05;.14;.05" dur="8s" repeatCount="indefinite"/>
        </ellipse>

        {/* ── Tour du château (gauche, même hauteur que Avignon) ── */}
        <path className="la-D" d="M278,98 L278,88 L284,88 L284,93 L290,93 L290,88 L297,88 L297,93 L303,93 L303,88 L310,88 L310,93 L316,93 L316,98"/>
        <rect className="la-M" x="278" y="98" width="38" height="102" fill="rgba(22,15,5,.86)"/>
        {[0,1,2].map(row => [0,1].map(col => {
          const wx = 284 + col * 16, wy = 106 + row * 28;
          return <rect key={`ct-${row}-${col}`} x={wx} y={wy} width="11" height="18"
            fill="rgba(5,3,1,.72)" stroke="rgba(235,218,185,.45)" strokeWidth=".5"/>;
        }))}
        <rect className="la-wfb la-wf1" x="284" y="106" width="11" height="18" rx="1.5" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <rect className="la-wfb la-wf3" x="300" y="134" width="11" height="18" rx="1.5" fill="rgba(210,158,52,1)" filter="url(#la-wfG)"/>
        <circle className="la-tc3" cx="280" cy="101" r="8" fill="rgba(220,150,40,.28)" filter="url(#la-tfG)"/>
        <circle className="la-tc3" cx="280" cy="101" r="2.2" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.2;3.0;2.0;3.2;2.3" dur="2.3s" repeatCount="indefinite"/>
        </circle>

        {/* ── Liaison tour → terrasse 1 ── */}
        <rect x="316" y="150" width="16" height="50" fill="rgba(52,37,13,.74)" stroke="rgba(210,165,55,.30)" strokeWidth=".6"/>

        {/* ── Terrasse 1 : mur haut (x=332–450, y=136–150) ── */}
        <rect className="la-M" x="332" y="136" width="118" height="14" fill="rgba(62,44,15,.72)"/>
        <ellipse cx="346" cy="108" rx="4.5" ry="32" fill="rgba(22,42,14,.82)" stroke="rgba(46,84,30,.42)" strokeWidth=".7"/>
        <ellipse cx="358" cy="114" rx="3"   ry="24" fill="rgba(22,42,14,.66)" stroke="rgba(46,84,30,.32)" strokeWidth=".55"/>
        <ellipse cx="440" cy="102" rx="4.5" ry="38" fill="rgba(22,42,14,.80)" stroke="rgba(46,84,30,.40)" strokeWidth=".68"/>
        <line x1="392" y1="136" x2="392" y2="120" stroke="rgba(100,75,30,.55)" strokeWidth="1.4"/>
        <ellipse cx="392" cy="115" rx="14" ry="9" fill="rgba(38,58,20,.60)" stroke="rgba(62,95,34,.38)" strokeWidth=".65"/>
        <line x1="332" y1="148" x2="448" y2="148" stroke="rgba(115,68,155,.44)" strokeWidth=".85" strokeDasharray="1.5 3"/>
        <circle className="la-l1" cx="370" cy="126" r="1.4" fill="rgba(190,240,80,.92)"/>

        {/* ── Liaison terrasse 1 → terrasse 2 ── */}
        <rect x="450" y="168" width="14" height="32" fill="rgba(52,37,13,.70)" stroke="rgba(210,165,55,.26)" strokeWidth=".6"/>

        {/* ── Terrasse 2 : mur bas (x=332–548, y=168–180) ── */}
        <rect className="la-M" x="332" y="168" width="214" height="12" fill="rgba(68,48,16,.70)"/>
        <ellipse cx="470" cy="118" rx="4.5" ry="54" fill="rgba(22,42,14,.80)" stroke="rgba(46,84,30,.40)" strokeWidth=".7"/>
        <ellipse cx="484" cy="126" rx="3"   ry="44" fill="rgba(22,42,14,.64)" stroke="rgba(46,84,30,.28)" strokeWidth=".55"/>
        <ellipse cx="526" cy="110" rx="4.5" ry="62" fill="rgba(22,42,14,.76)" stroke="rgba(46,84,30,.36)" strokeWidth=".66"/>
        <line x1="504" y1="168" x2="504" y2="152" stroke="rgba(100,75,30,.50)" strokeWidth="1.3"/>
        <ellipse cx="504" cy="147" rx="14" ry="8" fill="rgba(38,58,20,.56)" stroke="rgba(62,95,34,.34)" strokeWidth=".6"/>
        <line x1="334" y1="178" x2="544" y2="178" stroke="rgba(115,68,155,.38)" strokeWidth=".75" strokeDasharray="1.5 3.5"/>
        <circle className="la-l2" cx="456" cy="146" r="1.2" fill="rgba(190,240,80,.90)"/>
        <circle className="la-l3" cx="514" cy="138" r="1.3" fill="rgba(200,245,85,.88)"/>

        {/* ── Arcade basse / soubassement (y=180–200) ── */}
        <rect x="278" y="180" width="268" height="20" fill="rgba(50,34,11,.82)" stroke="rgba(210,165,55,.50)" strokeWidth="1.0"/>
        <line className="la-D" x1="278" y1="183" x2="546" y2="183"/>
        {[0,1,2,3].map(i => {
          const ax = 282 + i * 62;
          return (
            <g key={i}>
              <ellipse cx={ax+22} cy="198" rx="14" ry="6" fill="url(#la-nG)"/>
              <path d={`M ${ax},200 L ${ax},191 A 22,18 0 0 1 ${ax+44},191 L ${ax+44},200 Z`}
                fill="rgba(4,2,0,.94)" stroke="rgba(215,170,58,.66)" strokeWidth="1.0"/>
              <circle cx={ax+22} cy="191" r="2" fill="rgba(215,170,58,.44)"/>
            </g>
          );
        })}
        {[1,2,3].map(i => (
          <line key={i} className="la-F" x1={282+i*62-2} y1="183" x2={282+i*62-2} y2="200" opacity=".35"/>
        ))}
        <circle className="la-tc2" cx="280" cy="183" r="8" fill="rgba(220,150,40,.26)" filter="url(#la-tfG)"/>
        <circle className="la-tc2" cx="280" cy="183" r="2.2" fill="rgba(255,215,95,.96)">
          <animate attributeName="r" values="2.2;3.0;2.0;3.2;2.3" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle className="la-tc1" cx="544" cy="183" r="6" fill="rgba(220,150,40,.22)" filter="url(#la-tfG)"/>
        <circle className="la-tc1" cx="544" cy="183" r="1.8" fill="rgba(255,215,95,.92)">
          <animate attributeName="r" values="1.8;2.5;1.6;2.6;1.9" dur="1.8s" repeatCount="indefinite"/>
        </circle>

        {/* Vasque / fontaine */}
        <circle className="la-r1" cx="412" cy="205" r="0" fill="none" stroke="rgba(210,165,55,.28)" strokeWidth=".5"/>
        <circle className="la-r2" cx="412" cy="205" r="0" fill="none" stroke="rgba(210,165,55,.20)" strokeWidth=".4"/>

        {/* Vignes + lavande bas */}
        <line className="la-V" x1="280" y1="210" x2="544" y2="210" strokeDasharray="4 6"/>
        <line x1="280" y1="218" x2="544" y2="218" stroke="rgba(115,68,155,.52)" strokeWidth=".9" strokeDasharray="1.5 3.5"/>
        <circle className="la-l4" cx="414" cy="206" r="1.1" fill="rgba(185,235,75,.82)"/>

        {/* Étiquette LAURIS */}
        <path fill="rgba(235,218,185,.28)" d="M358,272 L361,268 L364,272 L361,276 Z"/>
        <path fill="rgba(235,218,185,.28)" d="M458,272 L461,268 L464,272 L461,276 Z"/>
        <text x="411" y="273" fontFamily="var(--font-cinzel),Georgia,serif" fontSize="17"
          fontWeight="600" letterSpacing="7" fill="rgba(235,218,185,.52)" textAnchor="middle">LAURIS</text>
        <line x1="366" y1="263" x2="456" y2="263" stroke="rgba(235,218,185,.12)" strokeWidth=".6"/>
        <line x1="366" y1="279" x2="456" y2="279" stroke="rgba(235,218,185,.10)" strokeWidth=".5"/>
      </g>
    </svg>
  )
}
