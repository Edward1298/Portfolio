import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../../data/skills.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import ShinyText from './ShinyText.jsx'

const CATEGORIES = ['backend', 'tools', 'frontend']

const CATEGORY_LABELS = {
  backend: 'BA',
  tools: 'Tools',
  frontend: 'FE',
}

const CATEGORY_FULL = {
  backend: 'Backend',
  tools: 'Tools',
  frontend: 'Frontend',
}

const HUB_CATEGORY_MAP = {
  'b-t': ['backend', 'tools'],
  't-f': ['tools', 'frontend'],
  'f-b': ['frontend', 'backend'],
}

const LINE_GRAY = '#6B7280'

const HUB_COLORS = {
  backend: { default: '#60A5FA', active: '#7BA3FF' },
  frontend: { default: '#60A5FA', active: '#7BA3FF' },
  tools: { default: '#60A5FA', active: '#7BA3FF' },
}

const VIEW_BOX = '0 0 1000 700'

const NODE = {
  hub: { r: 44, iconSize: 32, monogramSize: 18, strokeW: 2.5 },
  sat: { r: 28, iconSize: 20, monogramSize: 14, strokeW: 2 },
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function polarX(cx, angleDeg, radius) {
  return cx + radius * Math.cos((angleDeg * Math.PI) / 180)
}
function polarY(cy, angleDeg, radius) {
  return cy + radius * Math.sin((angleDeg * Math.PI) / 180)
}

// ----------------------------------------------------------------
// Layout builder — original triangle
// ----------------------------------------------------------------

function buildLayout() {
  const grouped = {}
  CATEGORIES.forEach((c) => { grouped[c] = skills.filter((s) => s.category === c) })

  const hubs = {
    backend: { x: 215, y: 230 },
    tools: { x: 500, y: 545 },
    frontend: { x: 785, y: 230 },
  }
  const HUB_ARC = {
    backend: { outwardAngle: 198, arcSpan: 130, satRadius: 155 },
    tools: { outwardAngle: 90, arcSpan: 145, satRadius: 200 },
    frontend: { outwardAngle: 342, arcSpan: 130, satRadius: 155 },
  }

  const satsMap = {}
  CATEGORIES.forEach((cat) => {
    const hub = hubs[cat]
    const cfg = HUB_ARC[cat]
    const items = grouped[cat]
    const n = items.length
    const startAngle = cfg.outwardAngle - cfg.arcSpan / 2
    const endAngle = cfg.outwardAngle + cfg.arcSpan / 2
    satsMap[cat] = items.map((skill, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1)
      const angleDeg = startAngle + t * (endAngle - startAngle)
      return { x: polarX(hub.x, angleDeg, cfg.satRadius), y: polarY(hub.y, angleDeg, cfg.satRadius), skill }
    })
  })

  const edges = [
    { id: 'b-t', x1: hubs.backend.x, y1: hubs.backend.y, x2: hubs.tools.x, y2: hubs.tools.y },
    { id: 't-f', x1: hubs.tools.x, y1: hubs.tools.y, x2: hubs.frontend.x, y2: hubs.frontend.y },
    { id: 'f-b', x1: hubs.frontend.x, y1: hubs.frontend.y, x2: hubs.backend.x, y2: hubs.backend.y },
  ]

  return { hubs, satsMap, edges }
}

// ----------------------------------------------------------------
// Node component
// ----------------------------------------------------------------

function CircuitNode({
  x, y, r, iconSize, monogramSize, strokeW,
  name, icon, monogram, isHub, isActive, isNodeActive, activeNodeIsSat, isDimmed, reduced, hubColor,
  onPointerEnter, onPointerLeave, onClick,
  showLabel, labelSide, labelText,
  mobile,
}) {
  const trState = reduced ? 'none' : 'opacity 0.3s, stroke 0.3s, fill 0.3s'
  const trOpacity = reduced ? 'none' : 'opacity 0.3s, fill 0.3s'
  const [imgErr, setImgErr] = useState(false)
  const showIcon = icon && !imgErr
  const glyph = monogram || name.slice(0, 2).toUpperCase()

  const fill = isHub ? '#1A1E28' : '#12151C'

  let stroke
  if (isHub && hubColor) {
    stroke = isActive ? hubColor.active : hubColor.default
  } else {
    stroke = isNodeActive ? '#7BA3FF' : isActive ? '#7BA3FF' : '#2A2E3A'
  }

  const textFill = isNodeActive || isActive ? '#7BA3FF' : (isHub && hubColor ? hubColor.default : '#5B8FFF')

  let opacityVal = 0.35
  if (isNodeActive) opacityVal = 1
  else if (isDimmed) opacityVal = 0.06
  else if (isActive && activeNodeIsSat && !isHub) opacityVal = 0.5
  else if (isActive) opacityVal = 1

  const hitR = mobile ? Math.max(r * 1.5, 44) : Math.max(r, 22)

  return (
    <g
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transform: isNodeActive && !isHub ? 'scale(1.08)' : 'scale(1)',
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transition: reduced ? 'none' : 'transform 0.3s',
      }}
    >
      <circle cx={x} cy={y} r={hitR} fill="transparent" />
      {((isActive && isHub) || (isNodeActive && !isHub)) && (
        <circle cx={x} cy={y} r={r + 3} fill="none" stroke="#7BA3FF" strokeWidth={2} filter="url(#hubGlow)" style={{ transition: trState, pointerEvents: 'none' }} />
      )}
      <circle
        cx={x} cy={y} r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeW}
        style={{ transition: trState }}
      />
      {showIcon ? (
        <image
          href={icon}
          x={x - iconSize / 2}
          y={y - iconSize / 2}
          width={iconSize}
          height={iconSize}
          onError={() => setImgErr(true)}
          style={{ opacity: opacityVal, transition: trOpacity }}
        />
      ) : (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textFill}
          fontSize={monogramSize}
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontWeight={500}
          style={{ opacity: opacityVal, transition: trOpacity }}
        >
          {glyph}
        </text>
      )}
      {showLabel && (
        <text
          x={labelSide === 'left' ? x - r - 8 : labelSide === 'right' ? x + r + 8 : x}
          y={labelSide === 'above' ? y - r - 14 : labelSide === 'below' ? y + r + 18 : y + 4}
          textAnchor={labelSide === 'left' ? 'end' : labelSide === 'right' ? 'start' : 'middle'}
          dominantBaseline="central"
          fill="#A4AEB8"
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={400}
          style={{ pointerEvents: 'none', transition: trOpacity }}
        >
          {labelText || name}
        </text>
      )}
    </g>
  )
}

// ----------------------------------------------------------------
// Main component
// ----------------------------------------------------------------

export default function SkillsCircuit() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const layout = useMemo(() => buildLayout(), [])

  const activeId = hoveredId || selectedId

  const getClusterInfo = useCallback((id) => {
    if (!id) return null
    for (const cat of CATEGORIES) {
      if (id === `hub-${cat}`) return { category: cat, isHub: true }
      if (layout.satsMap[cat].some((s) => `sat-${cat}-${s.skill.name}` === id)) {
        return { category: cat, isHub: false }
      }
    }
    return null
  }, [layout.satsMap])

  const activeCluster = activeId ? getClusterInfo(activeId)?.category : null

  const handlePointerEnter = useCallback((id) => setHoveredId(id), [])
  const handlePointerLeave = useCallback(() => setHoveredId(null), [])
  const handleClick = useCallback((id) => setSelectedId((prev) => (prev === id ? null : id)), [])
  const handleBgClick = useCallback(() => setSelectedId(null), [])

  const renderEdges = () => {
    if (!layout.edges) return null
    return (
      <>
        <defs>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hubGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {layout.edges.map((e) => {
          const connectsTo = (cat) => HUB_CATEGORY_MAP[e.id]?.includes(cat)
          const isActive = activeCluster && connectsTo(activeCluster)
          return (
            <line
              key={e.id}
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke={isActive ? '#7BA3FF' : LINE_GRAY}
              strokeWidth={1.5}
              style={{
                opacity: activeCluster ? (isActive ? 0.85 : 0.03) : 0.15,
                transition: reduced ? 'none' : 'opacity 0.35s',
              }}
            />
          )
        })}
      </>
    )
  }

  const renderHubLines = (cat) => {
    const hub = layout.hubs[cat]
    return layout.satsMap[cat].map((s) => {
      const satId = `sat-${cat}-${s.skill.name}`
      const isSatHovered = activeId === satId
      return (
        <line
          key={`ln-${cat}-${s.skill.name}`}
          x1={hub.x} y1={hub.y}
          x2={s.x} y2={s.y}
          stroke={isSatHovered ? '#7BA3FF' : activeCluster === cat ? '#7BA3FF' : LINE_GRAY}
          strokeWidth={isSatHovered ? 2 : 1}
          style={{
            opacity: isSatHovered ? 1 : activeCluster ? (activeCluster === cat ? 0.8 : 0.03) : 0.1,
            transition: reduced ? 'none' : 'opacity 0.35s',
          }}
        />
      )
    })
  }

  const renderParticles = () => {
    if (reduced || !layout.edges) return null
    const segments = [
      { r: 4, delay: 0, opacity: 0.7, glow: true },
      { r: 2.5, delay: 0.2, opacity: 0.35, glow: false },
      { r: 1.5, delay: 0.4, opacity: 0.12, glow: false },
    ]
    return layout.edges.flatMap((e) =>
      segments.map((s, i) => (
        <motion.circle
          key={`p-${e.id}-${i}`}
          r={s.r}
          fill="#60A5FA"
          filter={s.glow ? 'url(#pulseGlow)' : undefined}
          style={{ opacity: activeCluster ? s.opacity * 0.3 : s.opacity }}
          animate={{
            cx: [e.x1, e.x2],
            cy: [e.y1, e.y2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            delay: s.delay,
          }}
        />
      ))
    )
  }

  const renderNodes = () =>
    CATEGORIES.map((cat) => {
      const hub = layout.hubs[cat]
      const sats = layout.satsMap[cat]
      const catActive = activeCluster === cat
      const anyActive = !!activeCluster
      const activeNodeIsSat = activeId?.startsWith('sat-')

      return (
        <g key={cat}>
          {renderHubLines(cat)}
          <CircuitNode
            x={hub.x} y={hub.y}
            r={NODE.hub.r}
            iconSize={NODE.hub.iconSize}
            monogramSize={NODE.hub.monogramSize}
            strokeW={NODE.hub.strokeW}
            name={CATEGORY_LABELS[cat]}
            monogram={CATEGORY_LABELS[cat]}
            isHub
            hubColor={HUB_COLORS[cat]}
            isActive={catActive}
            isNodeActive={activeId === `hub-${cat}`}
            activeNodeIsSat={activeNodeIsSat}
            isDimmed={anyActive && !catActive}
            reduced={reduced}
            mobile={isMobile}
            onPointerEnter={() => handlePointerEnter(`hub-${cat}`)}
            onPointerLeave={handlePointerLeave}
            onClick={() => handleClick(`hub-${cat}`)}
            showLabel={isMobile ? true : activeId === `hub-${cat}`}
            labelSide={cat === 'backend' ? 'right' : cat === 'frontend' ? 'left' : 'above'}
            labelText={isMobile ? CATEGORY_LABELS[cat] : CATEGORY_FULL[cat]}
          />
          {sats.map((s) => {
            const satId = `sat-${cat}-${s.skill.name}`
            return (
              <CircuitNode
                key={satId}
                x={s.x} y={s.y}
                r={NODE.sat.r}
                iconSize={NODE.sat.iconSize}
                monogramSize={NODE.sat.monogramSize}
                strokeW={NODE.sat.strokeW}
                name={s.skill.name}
                icon={s.skill.icon}
                monogram={s.skill.monogram}
                isHub={false}
                isActive={catActive}
                isNodeActive={activeId === satId}
                activeNodeIsSat={activeNodeIsSat}
                isDimmed={anyActive && !catActive}
                reduced={reduced}
                mobile={isMobile}
                onPointerEnter={() => handlePointerEnter(satId)}
                onPointerLeave={handlePointerLeave}
                onClick={() => handleClick(satId)}
                showLabel={isMobile ? true : activeId === satId}
                labelSide={cat === 'tools' ? 'below' : 'above'}
                labelText={s.skill.name}
              />
            )
          })}
        </g>
      )
    })

  return (
    <section id="skills" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 text-center">
        <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
          Toolbox
        </span>
        <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2 mb-10 sm:mb-14">
          Skills
        </h2>

        <div className="relative flex justify-center">
          <svg
            viewBox={VIEW_BOX}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            onClick={isMobile ? handleBgClick : undefined}
            style={{ overflow: 'visible' }}
          >
            {renderEdges()}
            {renderParticles()}
            {renderNodes()}
          </svg>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: activeId ? 0 : 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transform: 'translateY(-8px)' }}
          >
            <ShinyText text="Hover to trace connections" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
