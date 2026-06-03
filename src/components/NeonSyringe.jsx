import { useMemo } from 'react';

const SYRINGE_SIZES = [
  { id: 'u100', label: 'U-100', units: 100, desc: '1mL' },
  { id: 'u50', label: 'U-50', units: 50, desc: '0.5mL' },
  { id: 'u30', label: 'U-30', units: 30, desc: '0.3mL' },
];

function calculateDose({ peptideMg, waterMl, targetMcg, syringeUnits }) {
  if (!peptideMg || !waterMl || !targetMcg) return null;
  const concentrationMcgPerMl = (peptideMg * 1000) / waterMl;
  const concentrationMcgPerUnit = concentrationMcgPerMl / syringeUnits;
  const doseUnits = targetMcg / concentrationMcgPerUnit;
  const doseVolumeMl = targetMcg / concentrationMcgPerMl;
  const totalDoses = Math.floor((peptideMg * 1000) / targetMcg);
  return {
    doseUnits: Math.round(doseUnits * 10) / 10,
    doseVolumeMl: Math.round(doseVolumeMl * 1000) / 1000,
    concentrationMcgPerUnit: Math.round(concentrationMcgPerUnit * 10) / 10,
    totalDoses,
    isValid: doseUnits > 0 && doseUnits <= syringeUnits,
  };
}

export default function NeonSyringe({
  peptideMg,
  waterMl,
  targetMcg,
  syringeSize = 'u100',
  onSyringeChange,
  height = 320,
}) {
  const syringeConfig = SYRINGE_SIZES.find(s => s.id === syringeSize) || SYRINGE_SIZES[0];
  const maxUnits = syringeConfig.units;

  const result = useMemo(() =>
    calculateDose({ peptideMg, waterMl, targetMcg, syringeUnits: maxUnits }),
    [peptideMg, waterMl, targetMcg, maxUnits]
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

  const fillPercent = result && result.isValid ? (result.doseUnits / maxUnits) * 100 : 0;
  const targetBottom = result && result.isValid ? (result.doseUnits / maxUnits) * 100 : 0;

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
            <div className="syringe-fill" style={{ height: `${fillPercent}%` }} />

            {/* Target line */}
            {result && result.isValid && (
              <div className="syringe-target-line" style={{ bottom: `${targetBottom}%` }}>
                <div className="syringe-target-label">
                  Result → {result.doseUnits} units
                </div>
              </div>
            )}

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
      {result && result.isValid && (
        <div className="result-stats" style={{ width: '100%', maxWidth: 340, marginTop: 20 }}>
          <div className="result-stat">
            <div className="result-stat-value">{result.doseUnits}</div>
            <div className="result-stat-label">Calculated units</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{result.doseVolumeMl} mL</div>
            <div className="result-stat-label">Volume</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{result.concentrationMcgPerUnit}</div>
            <div className="result-stat-label">mcg / unit</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{result.totalDoses}</div>
            <div className="result-stat-label">Servings in vial</div>
          </div>
        </div>
      )}

      {/* Warning if over capacity */}
      {result && !result.isValid && result.doseUnits > 0 && (
        <div style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: 16, textAlign: 'center' }}>
          Calculated volume exceeds {maxUnits}-unit syringe capacity. Adjust your input values.
        </div>
      )}
    </div>
  );
}

export { SYRINGE_SIZES, calculateDose };
