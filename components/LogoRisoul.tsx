'use client'

export default function LogoRisoul({ className = '' }: { className?: string }) {
  return (
    <svg className={`ri-svg ${className}`} viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>{`
          .ri-M{fill:none;stroke:rgba(210,228,252,.82);stroke-width:1.4;stroke-linejoin:round}
          .ri-D{fill:none;stroke:rgba(210,228,252,.60);stroke-width:.88;stroke-linejoin:round}
          .ri-F{fill:none;stroke:rgba(210,228,252,.40);stroke-width:.52}
          @keyframes ri-logoIn{0%{opacity:0;transform:translateY(28px) scale(.91)}60%{opacity:1;transform:translateY(-2px) scale(1.005)}100%{opacity:1;transform:translateY(0) scale(1)}}
          @keyframes ri-drift{0%,100%{transform:translateY(0)}38%{transform:translateY(-5px)}72%{transform:translateY(2.5px)}}
          .ri-svg{display:block;width:100%;height:auto;will-change:transform;animation:ri-logoIn 2.2s cubic-bezier(.16,1,.3,1) both,ri-drift 58s 2.4s ease-in-out infinite}
          @keyframes ri-tw{0%,100%{opacity:.80}48%{opacity:.03}}
          .ri-s1{animation:ri-tw 3.9s 0s ease-in-out infinite}.ri-s2{animation:ri-tw 4.4s 1.3s ease-in-out infinite}.ri-s3{animation:ri-tw 3.4s .7s ease-in-out infinite}.ri-s4{animation:ri-tw 5.1s 2.6s ease-in-out infinite}.ri-s5{animation:ri-tw 3.6s .3s ease-in-out infinite}.ri-s6{animation:ri-tw 4.8s 1.8s ease-in-out infinite}.ri-s7{animation:ri-tw 3.1s 3.2s ease-in-out infinite}
          @keyframes ri-moonD{0%,100%{transform:translate(0,0)}50%{transform:translate(-2px,3px)}}
          .ri-moonG{animation:ri-moonD 42s ease-in-out infinite}
          @keyframes ri-snC{0%,100%{opacity:.55}50%{opacity:.82}}
          .ri-snC{animation:ri-snC 5.2s ease-in-out infinite}
          @keyframes ri-pw{0%{transform:translate(0,0);opacity:0}20%{opacity:.5}80%{opacity:.3}100%{transform:translate(-32px,-18px);opacity:0}}
          .ri-pw1{animation:ri-pw 6s 0s ease-out infinite}.ri-pw2{animation:ri-pw 7s 2.4s ease-out infinite}.ri-pw3{animation:ri-pw 5s 4.8s ease-out infinite}
          @keyframes ri-tA{0%{opacity:.07}8%{opacity:.32}16%{opacity:.06}25%{opacity:.38}34%{opacity:.08}42%{opacity:.30}51%{opacity:.05}60%{opacity:.36}70%{opacity:.09}79%{opacity:.28}89%{opacity:.06}100%{opacity:.07}}
          @keyframes ri-tB{0%{opacity:.10}7%{opacity:.24}15%{opacity:.05}23%{opacity:.34}31%{opacity:.08}39%{opacity:.28}48%{opacity:.10}56%{opacity:.30}64%{opacity:.06}73%{opacity:.32}82%{opacity:.07}91%{opacity:.26}100%{opacity:.10}}
          .ri-tc1{animation:ri-tA 1.9s 0s infinite}.ri-tc2{animation:ri-tB 2.3s .6s infinite}
          @keyframes ri-sf{0%,100%{opacity:0}50%{opacity:1}}
          .ri-sf1{animation:ri-sf 4.8s 0.0s ease-in-out infinite}.ri-sf2{animation:ri-sf 4.8s 2.4s ease-in-out infinite}
        `}</style>
        <filter id="ri-tfG" x="-600%" y="-600%" width="1300%" height="1300%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="ri-mfG" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="ri-sfG" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5"/></filter>
        <radialGradient id="ri-mhG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(210,230,255,.22)"/><stop offset="60%" stopColor="rgba(210,230,255,.06)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* Stars */}
      <polygon className="ri-s1 ri-F" points="56,28 57.8,32 62,33 57.8,34 56,38 54.2,34 50,33 54.2,32"/>
      <polygon className="ri-s2 ri-F" points="120,14 121.5,18 126,18.5 121.5,19 120,23 118.5,19 114,18.5 118.5,18"/>
      <polygon className="ri-s3 ri-F" points="448,32 449.7,36 454,37 449.7,38 448,42 446.3,38 442,37 446.3,36"/>
      <polygon className="ri-s4 ri-F" points="490,14 491.4,17.5 495,18 491.4,18.5 490,22 488.6,18.5 485,18 488.6,17.5"/>
      <polygon className="ri-s5 ri-F" points="526,28 527.1,31 530,31.5 527.1,32 526,35 524.9,32 522,31.5 524.9,31"/>
      <polygon className="ri-s6 ri-F" points="320,18 321,21 324,21.5 321,22 320,25 319,22 316,21.5 319,21"/>
      <polygon className="ri-s7 ri-F" points="86,12 87,15 90,15.5 87,16 86,19 85,16 82,15.5 85,15"/>

      {/* Moon */}
      <g className="ri-moonG">
        <circle cx="64" cy="44" r="36" fill="url(#ri-mhG)" filter="url(#ri-mfG)"/>
        <circle cx="64" cy="44" r="14" fill="rgba(216,228,248,.72)"/>
        <circle cx="70" cy="43" r="12" fill="#080c18"/>
      </g>

      {/* Shooting star */}
      <line x1="0" y1="0" x2="24" y2="9" fill="none" stroke="rgba(210,228,255,.88)" strokeWidth=".72">
        <animateMotion path="M 90,18 L 28,46" dur=".85s" begin="11s;37s;59s" fill="remove"/>
        <animate attributeName="opacity" values="0;.88;0" dur=".85s" begin="11s;37s;59s" fill="remove"/>
      </line>

      {/* ── VILLAGE DE CHALETS + PISTES — face gauche ── */}
      <g transform="translate(0,39) skewY(-9)">
        <animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;-1.8 -1.2;1.2 .9;0 0" keyTimes="0;0.40;0.76;1" dur="54s" repeatCount="indefinite"/>

        {/* pas de fond solide — les éléments flottent sur le fond hero */}

        {/* Chaîne de montagnes en arrière-plan */}
        <path fill="rgba(10,16,38,.65)"
          d="M10,160 L38,110 L56,138 L78,96 L96,128 L116,102 L136,130 L152,108 L170,132 L186,112 L200,130 L216,114 L232,125 L242,120 L242,160 Z"/>
        <path fill="rgba(200,220,248,.22)"
          d="M38,110 L44,122 L50,114 L56,138 L64,118 L70,128 L78,96 L86,114 L92,106 L96,128 L104,110 L110,118 L116,102 L122,118 L128,112 L136,130 L140,118 L146,122 L152,108 L158,120 L164,116 L170,132 L176,118 L180,124 L186,112 L192,120 L196,116 L200,130 L206,116 L212,122 L216,114 L222,122 L228,118 L232,125 Z"/>

        {/* Montagnes moyennes */}
        <path fill="rgba(11,18,44,.74)"
          d="M10,185 L28,150 L50,165 L72,138 L98,158 L120,130 L146,152 L168,136 L190,154 L214,138 L232,148 L242,144 L242,185 Z"/>
        <path fill="rgba(200,218,250,.28)"
          d="M28,150 L36,160 L44,152 L50,165 L58,154 L66,162 L72,138 L82,152 L90,144 L98,158 L108,142 L116,150 L120,130 L130,148 L138,140 L146,152 L156,140 L164,148 L168,136 L178,150 L184,142 L190,154 L198,140 L206,148 L214,138 L222,146 L228,142 L232,148 Z"/>
        <path className="ri-F" d="M10,185 L28,150 L50,165 L72,138 L98,158 L120,130 L146,152 L168,136 L190,154 L214,138 L232,148 L242,144" opacity=".45"/>

        {/* Sol neigeux */}
        <path fill="rgba(215,228,252,.10)"
          d="M10,188 Q40,184 72,188 Q108,182 142,188 Q178,183 214,188 Q228,186 242,187 L242,200 Q208,198 178,202 Q148,197 118,202 Q86,197 56,202 Q32,197 10,200 Z"/>
        <path fill="rgba(210,226,250,.08)"
          d="M10,200 Q40,196 72,200 Q108,194 142,200 Q178,195 214,200 Q228,198 242,199 L242,270 L10,270 Z"/>

        {/* Pistes ski gauche */}
        <path fill="rgba(220,234,252,.15)" d="M24,185 L12,270 L40,270 L52,185 Z"/>
        <path fill="rgba(220,234,252,.10)" d="M24,185 L12,270 L40,270 L52,185 Z" filter="url(#ri-sfG)"/>
        {/* Piste milieu */}
        <path fill="rgba(220,234,252,.14)" d="M90,185 L76,270 L110,270 L124,185 Z"/>
        {/* Piste large droite */}
        <path fill="rgba(220,234,252,.13)" d="M158,185 L142,270 L188,270 L202,185 Z"/>

        {/* Bords de pistes */}
        <line x1="24" y1="186" x2="12" y2="268" stroke="rgba(200,220,250,.28)" strokeWidth=".7" strokeDasharray="4 5"/>
        <line x1="52" y1="186" x2="40" y2="268" stroke="rgba(200,220,250,.22)" strokeWidth=".6" strokeDasharray="3 5"/>
        <line x1="90" y1="186" x2="76" y2="268" stroke="rgba(200,220,250,.26)" strokeWidth=".65" strokeDasharray="4 5"/>
        <line x1="124" y1="186" x2="110" y2="268" stroke="rgba(200,220,250,.20)" strokeWidth=".6" strokeDasharray="3 5"/>
        <line x1="158" y1="186" x2="142" y2="268" stroke="rgba(200,220,250,.24)" strokeWidth=".65" strokeDasharray="4 5"/>
        <line x1="202" y1="186" x2="188" y2="268" stroke="rgba(200,220,250,.18)" strokeWidth=".55" strokeDasharray="3 5"/>

        {/* Pylônes télésiège */}
        <line x1="68" y1="164" x2="68" y2="185" stroke="rgba(180,200,230,.65)" strokeWidth="1.4"/>
        <line x1="60" y1="164" x2="76" y2="164" stroke="rgba(180,200,230,.55)" strokeWidth="1.0"/>
        <line x1="148" y1="149" x2="148" y2="168" stroke="rgba(180,200,230,.60)" strokeWidth="1.4"/>
        <line x1="140" y1="149" x2="156" y2="149" stroke="rgba(180,200,230,.50)" strokeWidth="1.0"/>

        {/* Câble télésiège */}
        <line x1="12" y1="176" x2="242" y2="130" stroke="rgba(190,215,245,.52)" strokeWidth=".7"/>

        {/* Chaises statiques */}
        {[0.15, 0.38, 0.62, 0.84].map((t, i) => {
          const x = 12 + t * 230;
          const y = 176 + t * (130 - 176);
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(180,200,230,.72)" strokeWidth=".8"/>
              <line x1="-5" y1="7" x2="5" y2="7" stroke="rgba(180,200,230,.72)" strokeWidth="1.1"/>
              <line x1="-3.5" y1="12" x2="3.5" y2="12" stroke="rgba(180,200,230,.55)" strokeWidth=".9"/>
            </g>
          );
        })}

        {/* Gondole animée */}
        <g>
          <rect x="-6" y="-4" width="12" height="8" rx="2" fill="rgba(40,80,160,.75)" stroke="rgba(160,190,230,.68)" strokeWidth=".8"/>
          <line x1="0" y1="-4" x2="0" y2="-10" stroke="rgba(160,190,230,.68)" strokeWidth=".7"/>
          <animateMotion path="M 12,177 L 242,131" dur="22s" repeatCount="indefinite"/>
        </g>

        {/* ── RÉSIDENCE A (gauche) ── */}
        <rect x="10" y="192" width="50" height="42" rx="1" fill="rgba(18,24,54,.88)" stroke="rgba(180,205,240,.66)" strokeWidth=".9"/>
        <path d="M6,192 L35,167 L64,192 Z" fill="rgba(12,18,46,.93)" stroke="rgba(180,205,240,.74)" strokeWidth=".9"/>
        <path fill="rgba(215,228,250,.26)" d="M6,192 L35,167 L64,192 L54,192 L35,175 L16,192 Z"/>
        {[200,211,222].map(y => <line key={y} x1="10" y1={y} x2="60" y2={y} stroke="rgba(170,195,230,.28)" strokeWidth=".6"/>)}
        {([0,1,2,3] as const).flatMap(row => ([0,1,2] as const).map(col => {
          const wx = 14 + col*14, wy = 194 + row*11;
          return <rect key={`a${row}-${col}`} x={wx} y={wy} width="10" height="8"
            fill="rgba(3,5,12,.76)" stroke="rgba(165,190,228,.42)" strokeWidth=".45"/>;
        }))}
        <rect x="30" y="222" width="10" height="12" fill="rgba(50,80,140,.62)" stroke="rgba(170,195,230,.36)" strokeWidth=".5"/>
        <rect x="46" y="173" width="6" height="8" fill="rgba(18,24,54,.82)" stroke="rgba(155,182,225,.40)" strokeWidth=".5"/>

        {/* ── GRAND HÔTEL (centre) ── */}
        <rect x="68" y="176" width="82" height="58" rx="1" fill="rgba(16,22,52,.90)" stroke="rgba(180,205,240,.70)" strokeWidth=".95"/>
        <path d="M62,176 L109,149 L156,176 Z" fill="rgba(10,16,44,.95)" stroke="rgba(180,205,240,.78)" strokeWidth="1.0"/>
        <path fill="rgba(215,228,250,.28)" d="M62,176 L109,149 L156,176 L144,176 L109,158 L74,176 Z"/>
        {[186,197,208,219].map(y => <line key={y} x1="68" y1={y} x2="150" y2={y} stroke="rgba(170,195,230,.27)" strokeWidth=".65"/>)}
        {([0,1,2,3] as const).flatMap(row => ([0,1,2,3,4] as const).map(col => {
          const wx = 72 + col*15, wy = 179 + row*11;
          return <rect key={`b${row}-${col}`} x={wx} y={wy} width="11" height="8"
            fill="rgba(3,5,12,.76)" stroke="rgba(165,190,228,.44)" strokeWidth=".48"/>;
        }))}
        <rect x="68" y="195" width="82" height="2" fill="rgba(140,175,220,.20)" stroke="none"/>
        <rect x="68" y="206" width="82" height="2" fill="rgba(140,175,220,.17)" stroke="none"/>
        <rect x="105" y="222" width="12" height="12" fill="rgba(50,80,140,.64)" stroke="rgba(170,195,230,.40)" strokeWidth=".5"/>
        <line x1="111" y1="222" x2="111" y2="234" stroke="rgba(170,195,230,.28)" strokeWidth=".42"/>
        <rect x="130" y="155" width="7" height="9" fill="rgba(16,22,52,.86)" stroke="rgba(155,182,225,.42)" strokeWidth=".5"/>

        {/* ── RÉSIDENCE C (droite) ── */}
        <rect x="158" y="184" width="56" height="50" rx="1" fill="rgba(18,24,54,.86)" stroke="rgba(180,205,240,.64)" strokeWidth=".88"/>
        <path d="M152,184 L186,157 L220,184 Z" fill="rgba(12,18,46,.92)" stroke="rgba(180,205,240,.72)" strokeWidth=".9"/>
        <path fill="rgba(215,228,250,.24)" d="M152,184 L186,157 L220,184 L209,184 L186,165 L163,184 Z"/>
        {[194,205,216].map(y => <line key={y} x1="158" y1={y} x2="214" y2={y} stroke="rgba(170,195,230,.26)" strokeWidth=".6"/>)}
        {([0,1,2,3] as const).flatMap(row => ([0,1,2] as const).map(col => {
          const wx = 162 + col*16, wy = 187 + row*11;
          return <rect key={`c${row}-${col}`} x={wx} y={wy} width="12" height="8"
            fill="rgba(3,5,12,.75)" stroke="rgba(165,190,228,.42)" strokeWidth=".45"/>;
        }))}
        <rect x="180" y="218" width="12" height="16" fill="rgba(50,80,140,.60)" stroke="rgba(170,195,230,.36)" strokeWidth=".5"/>
        <rect x="200" y="162" width="6" height="8" fill="rgba(18,24,54,.82)" stroke="rgba(155,182,225,.38)" strokeWidth=".45"/>

        {/* ── STATION + PYLÔNE TÉLÉCABINE ── */}
        <rect x="222" y="204" width="20" height="30" rx="1" fill="rgba(14,20,46,.88)" stroke="rgba(165,193,232,.58)" strokeWidth=".8"/>
        <path d="M218,204 L232,188 L246,204 Z" fill="rgba(8,14,38,.93)" stroke="rgba(165,193,232,.66)" strokeWidth=".8"/>
        <line x1="232" y1="188" x2="232" y2="130" stroke="rgba(155,185,228,.70)" strokeWidth="1.2"/>
        <line x1="225" y1="130" x2="239" y2="130" stroke="rgba(155,185,228,.72)" strokeWidth="1.3"/>

        {/* Sapins */}
        {[{x:8,y:248},{x:60,y:250},{x:156,y:250},{x:214,y:248},{x:244,y:252}].map(({x,y},i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y+5} stroke="rgba(150,175,210,.52)" strokeWidth="1.2"/>
            <path d={`M${x},${y} L${x-9},${y+14} L${x+9},${y+14} Z`} fill="rgba(14,28,14,.72)" stroke="rgba(80,130,60,.28)" strokeWidth=".5"/>
            <path d={`M${x},${y-8} L${x-6},${y+8} L${x+6},${y+8} Z`} fill="rgba(14,28,14,.80)" stroke="rgba(80,130,60,.24)" strokeWidth=".5"/>
            <path d={`M${x},${y-8} L${x-2},${y+2} L${x+2},${y+2} Z`} fill="rgba(205,220,248,.28)"/>
          </g>
        ))}

        {/* Skieur silhouette */}
        <g transform="translate(220,252)">
          <circle cx="0" cy="-10" r="3" fill="rgba(160,190,235,.62)"/>
          <line x1="0" y1="-7" x2="3" y2="0" stroke="rgba(160,190,235,.55)" strokeWidth="1.2"/>
          <line x1="0" y1="-4" x2="-4" y2="-1" stroke="rgba(160,190,235,.48)" strokeWidth="1.0"/>
          <line x1="0" y1="-4" x2="4" y2="-2" stroke="rgba(160,190,235,.48)" strokeWidth="1.0"/>
          <line x1="2" y1="0" x2="-2" y2="3" stroke="rgba(160,190,235,.50)" strokeWidth=".9"/>
        </g>

        {/* Balayage lune */}
        <rect x="10" y="85" width="18" height="100" fill="rgba(212,228,255,.04)" opacity="0">
          <animate attributeName="x" values="10;224;224" keyTimes="0;0.92;1" dur="26s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;.38;.38;0" keyTimes="0;0.05;0.95;1" dur="26s" repeatCount="indefinite"/>
        </rect>
      </g>

      {/* ── GRANDE MONTAGNE — face droite — gap fermé (translate -48) ── */}
      <g transform="translate(-48,-19) skewY(4)">
        <animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;2.6 -1.4;-1.0 .8;0 0" keyTimes="0;0.36;0.74;1" dur="63s" repeatCount="indefinite"/>

        {/* Chaîne de montagnes très lointaine */}
        <path fill="rgba(10,14,30,.55)"
          d="M276,180 L298,140 L316,158 L334,120 L354,148 L372,108 L392,136 L412,118 L430,140 L448,104 L468,132 L488,116 L508,138 L526,120 L548,138 L548,180 Z"/>
        <path fill="rgba(195,215,248,.18)"
          d="M298,140 L306,150 L312,142 L316,158 L324,140 L330,150 L334,120 L342,138 L348,128 L354,148 L364,128 L370,138 L372,108 L380,130 L388,120 L392,136 L400,122 L408,130 L412,118 L420,134 L426,126 L430,140 L440,118 L446,128 L448,104 L456,126 L464,114 L468,132 L476,118 L484,126 L488,116 L498,128 L504,120 L508,138 L518,120 L524,130 L526,120 L536,130 L542,124 L548,138 Z"/>
        <path className="ri-F" d="M276,180 L298,140 L316,158 L334,120 L354,148 L372,108 L392,136 L412,118 L430,140 L448,104 L468,132 L488,116 L508,138 L526,120 L548,138" opacity=".28"/>

        {/* Chaîne de montagnes moyenne */}
        <path fill="rgba(11,16,38,.68)"
          d="M276,200 L308,158 L330,175 L356,140 L382,164 L406,128 L430,155 L454,136 L480,158 L502,138 L524,158 L548,142 L548,200 Z"/>
        <path fill="rgba(195,215,250,.24)"
          d="M308,158 L318,170 L326,160 L330,175 L340,162 L350,168 L356,140 L366,158 L374,150 L382,164 L394,146 L402,156 L406,128 L416,150 L424,140 L430,155 L442,140 L450,148 L454,136 L464,152 L472,142 L480,158 L492,140 L500,150 L502,138 L512,152 L520,144 L524,158 L534,144 L542,150 L548,142 Z"/>
        <path className="ri-F" d="M276,200 L308,158 L330,175 L356,140 L382,164 L406,128 L430,155 L454,136 L480,158 L502,138 L524,158 L548,142 L548,200" opacity=".36"/>

        {/* GRANDE MONTAGNE principale */}
        <path fill="rgba(12,18,46,.86)"
          d="M276,270 L276,200 L332,130 L370,155 L414,88 L458,148 L496,118 L548,175 L548,270 Z"/>
        <path className="ri-M" d="M276,200 L332,130 L370,155 L414,88 L458,148 L496,118 L548,175"/>

        {/* ── PISTES DE SKI sur la montagne ── */}
        <path fill="rgba(220,234,252,.15)" d="M332,130 L290,200 L314,200 L352,132 Z"/>
        <path fill="rgba(220,234,252,.09)" d="M332,130 L290,200 L314,200 L352,132 Z" filter="url(#ri-sfG)"/>
        <path fill="rgba(220,234,252,.13)" d="M370,155 L342,200 L374,200 L398,158 Z"/>
        <path fill="rgba(220,234,252,.15)" d="M414,88 L382,200 L418,200 L442,92 Z"/>
        <path fill="rgba(220,234,252,.09)" d="M414,88 L382,200 L418,200 L442,92 Z" filter="url(#ri-sfG)"/>
        <path fill="rgba(220,234,252,.13)" d="M496,118 L462,200 L500,200 L522,122 Z"/>
        <path fill="rgba(220,234,252,.11)" d="M548,175 L518,200 L548,200 Z"/>

        {/* Bords de pistes */}
        <line x1="332" y1="130" x2="290" y2="200" stroke="rgba(200,220,252,.30)" strokeWidth=".7" strokeDasharray="5 6"/>
        <line x1="352" y1="132" x2="314" y2="200" stroke="rgba(200,220,252,.22)" strokeWidth=".6" strokeDasharray="4 6"/>
        <line x1="414" y1="88" x2="382" y2="200" stroke="rgba(200,220,252,.28)" strokeWidth=".7" strokeDasharray="5 6"/>
        <line x1="442" y1="92" x2="418" y2="200" stroke="rgba(200,220,252,.22)" strokeWidth=".6" strokeDasharray="4 6"/>
        <line x1="496" y1="118" x2="462" y2="200" stroke="rgba(200,220,252,.26)" strokeWidth=".65" strokeDasharray="5 6"/>
        <line x1="522" y1="122" x2="500" y2="200" stroke="rgba(200,220,252,.20)" strokeWidth=".55" strokeDasharray="3 5"/>

        {/* Balises de départ */}
        <circle cx="332" cy="130" r="2.5" fill="rgba(255,60,60,.80)"/>
        <circle cx="414" cy="88" r="2.8" fill="rgba(255,60,60,.85)"/>
        <circle cx="496" cy="118" r="2.5" fill="rgba(255,60,60,.80)"/>
        <circle cx="370" cy="155" r="2.0" fill="rgba(60,180,60,.75)"/>

        {/* Sol neigeux bas */}
        <path fill="rgba(8,10,24,.78)"
          d="M276,200 Q310,195 348,198 Q386,193 424,197 Q462,192 500,196 Q524,192 548,195 L548,270 L276,270 Z"/>
        <path fill="rgba(215,228,252,.10)"
          d="M276,200 Q310,198 348,201 Q386,196 424,200 Q462,195 500,199 Q524,195 548,198 L548,212 Q524,208 500,212 Q462,208 424,213 Q386,209 348,214 Q310,210 276,213 Z"/>

        {/* Télésiège versant gauche */}
        <line x1="340" y1="158" x2="340" y2="180" stroke="rgba(175,198,232,.62)" strokeWidth="1.4"/>
        <line x1="332" y1="158" x2="348" y2="158" stroke="rgba(175,198,232,.52)" strokeWidth="1.0"/>
        <line x1="414" y1="112" x2="414" y2="132" stroke="rgba(175,198,232,.58)" strokeWidth="1.4"/>
        <line x1="406" y1="112" x2="422" y2="112" stroke="rgba(175,198,232,.48)" strokeWidth="1.0"/>
        <line x1="278" y1="196" x2="414" y2="112" stroke="rgba(185,208,240,.50)" strokeWidth=".7"/>
        {[0.20, 0.46, 0.74].map((t, i) => {
          const x = 278 + t * 136;
          const y = 196 + t * (112 - 196);
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(175,198,232,.70)" strokeWidth=".8"/>
              <line x1="-5" y1="7" x2="5" y2="7" stroke="rgba(175,198,232,.70)" strokeWidth="1.1"/>
              <line x1="-3.5" y1="12" x2="3.5" y2="12" stroke="rgba(175,198,232,.52)" strokeWidth=".9"/>
            </g>
          );
        })}
        <g>
          <rect x="-6" y="-4" width="12" height="8" rx="2" fill="rgba(40,80,160,.72)" stroke="rgba(155,185,225,.65)" strokeWidth=".8"/>
          <line x1="0" y1="-4" x2="0" y2="-10" stroke="rgba(155,185,225,.65)" strokeWidth=".7"/>
          <animateMotion path="M 278,197 L 414,113" dur="28s" repeatCount="indefinite"/>
        </g>

        {/* Télécabine versant droit */}
        <line x1="500" y1="148" x2="500" y2="162" stroke="rgba(175,198,232,.55)" strokeWidth="1.3"/>
        <line x1="492" y1="148" x2="508" y2="148" stroke="rgba(175,198,232,.45)" strokeWidth=".9"/>
        <line x1="414" y1="112" x2="548" y2="170" stroke="rgba(175,200,235,.44)" strokeWidth=".6"/>
        <g>
          <rect x="-5" y="-3.5" width="10" height="7" rx="1.5" fill="rgba(160,40,40,.70)" stroke="rgba(155,185,225,.58)" strokeWidth=".7"/>
          <line x1="0" y1="-3.5" x2="0" y2="-8" stroke="rgba(155,185,225,.55)" strokeWidth=".6"/>
          <animateMotion path="M 414,113 L 548,171" dur="34s" repeatCount="indefinite"/>
        </g>

        {/* Neige sur pic principal */}
        <path className="ri-snC" fill="rgba(218,232,254,.68)"
          d="M414,88 L400,108 L388,118 Q402,108 414,88 Q426,108 440,120 L428,110 Z"/>
        <ellipse cx="414" cy="92" rx="22" ry="12" fill="rgba(218,232,254,.18)" filter="url(#ri-sfG)"/>
        {/* Neige crêtes secondaires */}
        <path fill="rgba(215,230,252,.44)" d="M496,118 L484,135 L490,130 Z"/>
        <path fill="rgba(215,230,252,.40)" d="M332,130 L320,144 L326,140 Z"/>
        <path fill="rgba(215,230,252,.38)" d="M370,155 L360,166 L366,162 Z"/>
        <path fill="rgba(215,230,252,.36)" d="M458,148 L448,162 L454,158 Z"/>

        {/* Tourbillons */}
        <ellipse className="ri-pw1" cx="390" cy="160" rx="8" ry="3" fill="rgba(210,228,252,.28)"/>
        <ellipse className="ri-pw2" cx="450" cy="145" rx="6" ry="2.5" fill="rgba(210,228,252,.24)"/>
        <ellipse className="ri-pw3" cx="310" cy="175" rx="7" ry="2.8" fill="rgba(210,228,252,.22)"/>

        {/* Flocons */}
        <circle className="ri-sf1" cx="360" cy="160" r="1.2" fill="rgba(210,228,252,.70)"/>
        <circle className="ri-sf1" cx="440" cy="145" r="1.0" fill="rgba(210,228,252,.65)"/>
        <circle className="ri-sf2" cx="380" cy="175" r="1.1" fill="rgba(210,228,252,.68)"/>
        <circle className="ri-sf2" cx="470" cy="155" r="1.3" fill="rgba(210,228,252,.60)"/>

        {/* Chalet station gauche */}
        <rect x="280" y="184" width="46" height="16" rx="1" fill="rgba(18,24,52,.84)" stroke="rgba(180,205,240,.58)" strokeWidth=".85"/>
        <path d="M276,184 L303,162 L330,184 Z" fill="rgba(12,18,44,.90)" stroke="rgba(180,205,240,.68)" strokeWidth=".85"/>
        <line x1="280" y1="184" x2="326" y2="184" stroke="rgba(180,205,240,.22)" strokeWidth=".55"/>
        {[[284,187,9,8],[298,187,9,8],[312,187,9,8]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(3,5,12,.75)" stroke="rgba(165,190,228,.40)" strokeWidth=".5"/>
        ))}
        <path fill="rgba(210,225,252,.22)" d="M276,184 L303,162 L330,184 L320,184 L303,170 L286,184 Z"/>
        <rect x="316" y="166" width="5" height="7" fill="rgba(18,24,52,.78)" stroke="rgba(155,180,220,.36)" strokeWidth=".5"/>

        {/* Chalet station droite */}
        <rect x="466" y="188" width="46" height="14" rx="1" fill="rgba(18,24,52,.82)" stroke="rgba(180,205,240,.55)" strokeWidth=".85"/>
        <path d="M462,188 L489,165 L516,188 Z" fill="rgba(12,18,44,.88)" stroke="rgba(180,205,240,.65)" strokeWidth=".85"/>
        <line x1="466" y1="188" x2="512" y2="188" stroke="rgba(180,205,240,.20)" strokeWidth=".5"/>
        {[[470,191,9,7],[484,191,9,7],[498,191,9,7]].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(3,5,12,.74)" stroke="rgba(165,190,228,.38)" strokeWidth=".5"/>
        ))}
        <path fill="rgba(210,225,252,.20)" d="M462,188 L489,165 L516,188 L506,188 L489,173 L472,188 Z"/>
        <rect x="502" y="169" width="5" height="7" fill="rgba(18,24,52,.76)" stroke="rgba(155,180,220,.34)" strokeWidth=".5"/>

        {/* Torches */}
        <circle className="ri-tc1" cx="280" cy="194" r="7" fill="rgba(195,215,255,.24)" filter="url(#ri-tfG)"/>
        <circle className="ri-tc1" cx="280" cy="194" r="2.0" fill="rgba(215,230,255,.92)">
          <animate attributeName="r" values="2.0;2.7;1.8;2.9;2.1" dur="2.0s" repeatCount="indefinite"/>
        </circle>
        <circle className="ri-tc2" cx="548" cy="178" r="7" fill="rgba(195,215,255,.22)" filter="url(#ri-tfG)"/>
        <circle className="ri-tc2" cx="548" cy="178" r="2.0" fill="rgba(215,230,255,.92)">
          <animate attributeName="r" values="2.0;2.6;1.9;2.8;2.0" dur="2.4s" repeatCount="indefinite"/>
        </circle>

        {/* Sapins pentes */}
        {[{x:296,y:196},{x:372,y:200},{x:452,y:200},{x:540,y:200}].map(({x,y},i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y+4} stroke="rgba(140,165,205,.42)" strokeWidth="1.0"/>
            <path d={`M${x},${y} L${x-7},${y+13} L${x+7},${y+13} Z`} fill="rgba(14,26,14,.68)" stroke="rgba(70,110,50,.24)" strokeWidth=".5"/>
            <path d={`M${x},${y-5} L${x-5},${y+8} L${x+5},${y+8} Z`} fill="rgba(14,26,14,.74)" stroke="rgba(70,110,50,.20)" strokeWidth=".45"/>
            <path d={`M${x},${y-5} L${x-2},${y+2} L${x+2},${y+2} Z`} fill="rgba(210,225,250,.20)"/>
          </g>
        ))}

        {/* Balayage lune */}
        <rect x="276" y="58" width="18" height="142" fill="rgba(212,228,255,.04)" opacity="0">
          <animate attributeName="x" values="276;530;530" keyTimes="0;0.92;1" dur="28s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;.35;.35;0" keyTimes="0;0.05;0.95;1" dur="28s" repeatCount="indefinite"/>
        </rect>

        {/* Étiquette RISOUL · 1850 */}
        <path fill="rgba(210,228,252,.26)" d="M362,236 L365,232 L368,236 L365,240 Z"/>
        <path fill="rgba(210,228,252,.26)" d="M448,236 L451,232 L454,236 L451,240 Z"/>
        <text x="409" y="234" fontFamily="var(--font-cinzel),Georgia,serif" fontSize="14"
          fontWeight="600" letterSpacing="7" fill="rgba(210,228,252,.52)" textAnchor="middle">RISOUL</text>
        <text x="409" y="244" fontFamily="var(--font-cinzel),Georgia,serif" fontSize="8"
          fontWeight="400" letterSpacing="6" fill="rgba(210,228,252,.36)" textAnchor="middle">1850</text>
        <line x1="370" y1="225" x2="449" y2="225" stroke="rgba(210,228,252,.12)" strokeWidth=".6"/>
        <line x1="370" y1="248" x2="449" y2="248" stroke="rgba(210,228,252,.10)" strokeWidth=".5"/>
      </g>
    </svg>
  )
}
