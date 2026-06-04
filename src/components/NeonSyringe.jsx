import { useMemo } from 'react';

const SYRINGE_SIZES = [
  { id: 'u100', label: 'U-100', units: 100, desc: '1mL' },
  { id: 'u50', label: 'U-50', units: 50, desc: '0.5mL' },
  { id: 'u30', label: 'U-30', units: 30, desc: '0.3mL' },
];

function calculateConcentration({ peptideMg, waterMl, syringeUnits, explorerUnits }) {
  if (!peptideMg || !waterMl) return null;
  const concentrationMcgPerMl = (peptideMg * 1000) / waterMl;
  const concentrationMcgPerUnit = concentrationMcgPerMl / syringeUnits;
  
  const totalMcgInExplorer = (explorerUnits || 0) * concentrationMcgPerUnit;
  const volumeMlInExplorer = ((explorerUnits || 0) / syringeUnits);

  return {
    concentrationMcgPerUnit: Math.round(concentrationMcgPerUnit * 10) / 10,
    concentrationMcgPerMl: Math.round(concentrationMcgPerMl * 10) / 10,
    totalMcgInExplorer: Math.round(totalMcgInExplorer * 10) / 10,
    volumeMlInExplorer: Math.round(volumeMlInExplorer * 1000) / 1000,
    isValid: true,
  };
}

export default function NeonSyringe({
  peptideMg,
  waterMl,
  explorerUnits = 10,
  syringeSize = 'u100',
  onSyringeChange,
  height = 320,
}) {
  const syringeConfig = SYRINGE_SIZES.find(s => s.id === syringeSize) || SYRINGE_SIZES[0];
  const maxUnits = syringeConfig.units;

  const result = useMemo(() =>
    calculateConcentration({ peptideMg, waterMl, syringeUnits: maxUnits, explorerUnits }),
    [peptideMg, waterMl, maxUnits, explorerUnits]
  );

  // Generate tick marks
  const ticks = useMemo(() => {
    const t = [];
    let step, majorEvery;
    if (maxUnits === 100) { step = 5; majorEvery = 10; }
    else if (maxUnits === 50) { step = 5; majorEvery = 10; }
    else { step = 5; majorEvery = 5; }
    for (let i = 0; i <= maxUnits; i += step) {
      t.push({ value: i, major: i % majorEvery === 0 });
    }
    return t;
  }, [maxUnits]);

  const fillPercent = (explorerUnits / maxUnits) * 100;
  const targetBottom = (explorerUnits / maxUnits) * 100;

  return (
    <div className="syringe-wrap">
      {/* Size selector */}
      <div className="syringe-size-selector">
        {SYRINGE_SIZES.map(s => (
          <button
            key={s.id}
            className={`syringe-size-btn ${syringeSize === s.id ? 'active' : ''}`}
            onClick={() => onSyringeChange?.(s.id)}
          >
            {s.label} ({s.desc})
          </button>
        ))}
      </div>

      {/* Syringe */}
      <div className="syringe-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="syringe-plunger" />
          <div className="syringe-body" style={{ height }}>
            {/* Fill */}
            <div className="syringe-fill" style={{ height: `${Math.min(100, fillPercent)}%` }} />

            {/* Target line */}
            <div className="syringe-target-line" style={{ bottom: `${Math.min(100, targetBottom)}%` }}>
              <div className="syringe-target-label" style={{ background: 'var(--accent)', color: '#fff' }}>
                {explorerUnits} units = {result ? result.totalMcgInExplorer : 0} mcg
              </div>
            </div>

            {/* Tick marks */}
            <div className="syringe-ticks">
              {ticks.map(tick => (
                <div
                  key={tick.value}
                  className={`syringe-tick ${tick.major ? 'major' : ''}`}
                >
                  {tick.major && <span>{tick.value}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="syringe-needle" />
        </div>
      </div>

      {/* Result stats */}
      {result && (
        <div className="result-stats" style={{ width: '100%', maxWidth: 340, marginTop: 20 }}>
          <div className="result-stat">
            <div className="result-stat-value" style={{ color: 'var(--accent)' }}>{result.totalMcgInExplorer}</div>
            <div className="result-stat-label">mcg in {explorerUnits} units</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{result.concentrationMcgPerUnit}</div>
            <div className="result-stat-label">mcg / unit</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{result.volumeMlInExplorer} mL</div>
            <div className="result-stat-label">Volume drawn</div>
          </div>
        </div>
      )}
    </div>
  );
}

export { SYRINGE_SIZES, calculateConcentration };
