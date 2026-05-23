import { useState, useEffect } from 'react';
import { IoArrowForward, IoShieldCheckmark } from 'react-icons/io5';

const DISCLAIMER = `FOR LABORATORY RESEARCH PURPOSES ONLY. NOT FOR HUMAN CONSUMPTION OR MEDICAL USE. This app is an informational record-keeping and mathematical visualization tool. It does not provide medical advice, diagnosis, or recommendations. You assume full responsibility for verifying all calculations independently.`;

const QUESTIONS = [
  {
    id: 'experience',
    title: 'How experienced are you with peptides?',
    options: ['Complete beginner', 'Some experience', 'Advanced user', 'Healthcare professional'],
  },
  {
    id: 'peptides',
    title: 'Which peptides are you working with?',
    subtitle: 'Select all that apply',
    options: ['Semaglutide', 'Tirzepatide', 'BPC-157', 'TB-500', 'CJC/Ipamorelin', 'Other'],
    multi: true,
  },
  {
    id: 'struggle',
    title: 'What\'s your biggest challenge?',
    options: ['Calculating the right volume', 'Knowing how much water to add', 'Reading the syringe markings', 'Keeping track of my schedule'],
  },
];

const BUILD_STEPS = [
  'Analyzing your profile...',
  'Calibrating syringe calculator...',
  'Setting up your library...',
  'Personalizing your experience...',
  'Almost ready...',
];

export default function Onboarding({ onComplete }) {
  const [phase, setPhase] = useState('welcome'); // welcome, steps, questions, disclaimer, building
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelect, setMultiSelect] = useState([]);
  const [buildStep, setBuildStep] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);

  const totalDots = 3 + QUESTIONS.length + 1 + 1; // 2 welcome + questions + disclaimer + building
  const currentDot =
    phase === 'welcome' ? welcomeStep :
    phase === 'steps' ? 1 :
    phase === 'questions' ? 2 + questionIdx :
    phase === 'disclaimer' ? 2 + QUESTIONS.length :
    totalDots - 1;

  // Building animation
  useEffect(() => {
    if (phase !== 'building') return;
    const stepInterval = setInterval(() => {
      setBuildStep(prev => {
        if (prev >= BUILD_STEPS.length - 1) { clearInterval(stepInterval); return prev; }
        return prev + 1;
      });
    }, 800);
    const progressInterval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 600);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, [phase, onComplete]);

  function handleQuestionAnswer(answer) {
    const q = QUESTIONS[questionIdx];
    if (q.multi) {
      const updated = multiSelect.includes(answer)
        ? multiSelect.filter(a => a !== answer)
        : [...multiSelect, answer];
      setMultiSelect(updated);
      return;
    }
    const newAnswers = { ...answers, [q.id]: answer };
    setAnswers(newAnswers);
    if (questionIdx < QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setPhase('disclaimer');
    }
  }

  function handleMultiContinue() {
    const q = QUESTIONS[questionIdx];
    const newAnswers = { ...answers, [q.id]: multiSelect };
    setAnswers(newAnswers);
    setMultiSelect([]);
    if (questionIdx < QUESTIONS.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setPhase('disclaimer');
    }
  }

  function handleWelcomeNext() {
    if (welcomeStep === 0) { setWelcomeStep(1); setPhase('steps'); }
    else { setPhase('questions'); }
  }

  const currentQuestion = QUESTIONS[questionIdx];

  return (
    <div className="ob-screen">
      <div className="ob-body">

        {/* Welcome */}
        {phase === 'welcome' && (
          <>
            <h1 className="ob-title">Never guess<br />your volume <span className="accent">again.</span></h1>
            <p className="ob-desc">Enter your vial info. We visualize the math on a syringe graphic. You verify and decide.</p>
          </>
        )}

        {/* Steps */}
        {phase === 'steps' && (
          <>
            <div className="ob-steps">
              <div className="ob-step-item"><div className="ob-step-num">1</div><div className="ob-step-label">Input</div></div>
              <div className="ob-step-item"><div className="ob-step-num">2</div><div className="ob-step-label">Calculate</div></div>
              <div className="ob-step-item"><div className="ob-step-num">3</div><div className="ob-step-label">Visualize</div></div>
            </div>
            <h1 className="ob-title" style={{ fontSize: '1.5rem' }}>
              You enter the values.<br />We do the <span style={{ color: 'var(--accent)' }}>math</span>.
            </h1>
            <p className="ob-desc">Enter your container concentration, water volume, and target amount. The app calculates and shows the result on a visual graphic.</p>
          </>
        )}

        {/* Questions */}
        {phase === 'questions' && currentQuestion && (
          <div className="animate-in" key={questionIdx} style={{ width: '100%', maxWidth: 380 }}>
            <h1 className="ob-title" style={{ fontSize: '1.4rem', textAlign: 'left' }}>{currentQuestion.title}</h1>
            {currentQuestion.subtitle && <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 16, textAlign: 'left' }}>{currentQuestion.subtitle}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
              {currentQuestion.options.map(opt => {
                const isSelected = currentQuestion.multi ? multiSelect.includes(opt) : answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleQuestionAnswer(opt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '16px 18px', borderRadius: 14, textAlign: 'left',
                      background: isSelected ? '#1a1a1a' : '#f5f5f5',
                      color: isSelected ? 'white' : '#1a1a1a',
                      border: 'none', fontSize: '0.95rem', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      fontFamily: 'Inter, sans-serif', width: '100%',
                    }}
                  >
                    {currentQuestion.multi && (
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        border: isSelected ? 'none' : '2px solid #ccc',
                        background: isSelected ? 'white' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#1a1a1a', fontSize: '0.7rem', fontWeight: 700,
                      }}>
                        {isSelected && '✓'}
                      </div>
                    )}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {phase === 'disclaimer' && (
          <>
            <div style={{ marginBottom: 24 }}><IoShieldCheckmark size={48} color="#1a1a1a" /></div>
            <h1 className="ob-title" style={{ fontSize: '1.3rem', lineHeight: 1.3 }}>Important Disclaimer</h1>
            <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.7, maxWidth: 340, textAlign: 'left', marginTop: 16 }}>{DISCLAIMER}</p>
          </>
        )}

        {/* Building animation */}
        {phase === 'building' && (
          <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}>
            <h1 className="ob-title" style={{ fontSize: '1.3rem', marginBottom: 32 }}>Setting up your calculator</h1>
            <div style={{ width: '100%', height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ width: `${buildProgress}%`, height: '100%', background: '#1a1a1a', borderRadius: 3, transition: 'width 0.15s ease' }} />
            </div>
            <p style={{ color: '#999', fontSize: '0.85rem', minHeight: 24, transition: 'opacity 0.3s' }}>{BUILD_STEPS[buildStep]}</p>
          </div>
        )}

        {/* Dots */}
        {phase !== 'building' && (
          <div className="ob-dots" style={{ marginTop: 32 }}>
            {Array.from({ length: totalDots }).map((_, i) => (
              <div key={i} className={`ob-dot ${i === currentDot ? 'active' : ''}`} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {phase !== 'building' && (
        <div className="ob-footer">
          {(phase === 'welcome' || phase === 'steps') && (
            <button className="btn btn-primary btn-full" onClick={handleWelcomeNext} style={{ fontSize: '1rem', fontWeight: 700, padding: 16 }}>
              {phase === 'welcome' ? 'Get Started' : 'Continue'}<IoArrowForward size={18} style={{ marginLeft: 8 }} />
            </button>
          )}
          {phase === 'questions' && currentQuestion?.multi && multiSelect.length > 0 && (
            <button className="btn btn-primary btn-full" onClick={handleMultiContinue} style={{ fontSize: '1rem', fontWeight: 700, padding: 16 }}>
              Continue<IoArrowForward size={18} style={{ marginLeft: 8 }} />
            </button>
          )}
          {phase === 'disclaimer' && (
            <button className="btn btn-primary btn-full" onClick={() => setPhase('building')} style={{ fontSize: '1rem', fontWeight: 700, padding: 16 }}>
              I Understand & Agree<IoArrowForward size={18} style={{ marginLeft: 8 }} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
