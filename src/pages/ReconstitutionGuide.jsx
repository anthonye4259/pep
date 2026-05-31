import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoWater, IoFlask, IoMedkit, IoHandLeft } from 'react-icons/io5';

const steps = [
  {
    icon: IoMedkit,
    title: '1. Gather Your Supplies',
    items: ['Your peptide vial (freeze-dried powder)', 'Bacteriostatic water (BAC water)', 'Syringe(s) for reconstitution', 'Alcohol swabs'],
  },
  {
    icon: IoHandLeft,
    title: '2. Clean Everything',
    items: ['Wash your hands thoroughly', 'Swab the top of the peptide vial with alcohol', 'Swab the top of the BAC water vial with alcohol', 'Let both air dry (do not blow on them)'],
  },
  {
    icon: IoWater,
    title: '3. Draw the Water',
    items: [
      'Using a fresh syringe, draw your chosen amount of BAC water',
      'Common amounts: 1mL, 2mL, or 3mL',
      'More water = lower concentration = easier to measure small amounts',
      'Less water = higher concentration = fewer draws needed',
    ],
  },
  {
    icon: IoFlask,
    title: '4. Add Water to Peptide Vial',
    items: [
      'Insert the needle through the rubber stopper at an angle',
      'SLOWLY inject the water down the side of the vial',
      'Do NOT spray directly onto the powder',
      'Let the powder dissolve — gently swirl if needed, never shake',
    ],
  },
];

const waterGuide = [
  { water: '1 mL', concentration: '5,000 mcg/mL', pros: 'Fewer draws, less volume', cons: 'Harder to measure small amounts' },
  { water: '2 mL', concentration: '2,500 mcg/mL', pros: 'Good balance of precision and volume', cons: 'Most popular choice' },
  { water: '3 mL', concentration: '1,667 mcg/mL', pros: 'Easiest to measure small amounts', cons: 'More liquid per draw' },
];

export default function ReconstitutionGuide() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-icon btn-secondary" onClick={() => navigate(-1)}><IoArrowBack size={20} /></button>
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>How to Reconstitute</h1>
          <p className="text-muted text-sm">Step-by-step preparation guide</p>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: '#fff8e1', borderRadius: 12, marginBottom: 24, fontSize: '0.8rem', color: '#8d6e00', lineHeight: 1.6 }}>
        <strong>For research and educational purposes only.</strong> Always verify all calculations independently. This is not medical advice.
      </div>

      {steps.map((step, i) => (
        <div key={i} className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <step.icon size={22} color="#1a1a1a" />
            <h3 style={{ fontSize: '0.95rem' }}>{step.title}</h3>
          </div>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {step.items.map((item, j) => (
              <li key={j} style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Water amount guide */}
      <h2 style={{ fontSize: '1.1rem', marginTop: 28, marginBottom: 14 }}>How Much Water Should I Add?</h2>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
        For a standard <strong>5mg vial</strong>, here's how water amount affects your concentration:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {waterGuide.map((row, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{row.water}</span>
              <span style={{ fontSize: '0.8rem', color: '#999', fontFamily: 'Space Grotesk' }}>{row.concentration}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#555' }}>{row.pros}</div>
            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 2 }}>{row.cons}</div>
          </div>
        ))}
      </div>

      {/* mg vs mcg */}
      <h2 style={{ fontSize: '1.1rem', marginTop: 28, marginBottom: 14 }}>mg vs mcg — What's the Difference?</h2>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'center' }}>
          <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 10 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700 }}>mg</div>
            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 2 }}>milligram</div>
            <div style={{ fontSize: '0.8rem', color: '#555', marginTop: 6 }}>1 mg = 1,000 mcg</div>
          </div>
          <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 10 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 700 }}>mcg</div>
            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 2 }}>microgram</div>
            <div style={{ fontSize: '0.8rem', color: '#555', marginTop: 6 }}>1,000 mcg = 1 mg</div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontSize: '0.82rem', color: '#555', lineHeight: 1.6 }}>
          <strong>Example:</strong> If your target amount is 2.5mg, that equals 2,500mcg. In the calculator, enter <strong>2500</strong> in the "Target amount (mcg)" field.
        </div>
      </div>
    </div>
  );
}
