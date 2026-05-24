import { useState, useEffect } from 'react';
import { IoArrowForward, IoShieldCheckmark, IoScanOutline, IoColorFillOutline, IoTrendingUpOutline } from 'react-icons/io5';

const DISCLAIMER = `FOR LABORATORY RESEARCH PURPOSES ONLY. NOT FOR HUMAN CONSUMPTION OR MEDICAL USE. This app is an informational record-keeping and mathematical visualization tool. It does not provide medical advice, diagnosis, or recommendations. You assume full responsibility for verifying all calculations independently.`;

const TUTORIAL_STEPS = [
  {
    title: 'Snap a photo of your vial.\nAI does the rest.',
    icon: <IoScanOutline size={100} color="#ec4899" />,
    desc: 'Our intelligent scanner instantly extracts the peptide name, mass, and concentration.'
  },
  {
    title: 'Never guess your dose.\nSee the exact math.',
    icon: <IoColorFillOutline size={100} color="#ec4899" />,
    desc: 'We calculate the volume and display it on an interactive, visual syringe guide.'
  },
  {
    title: 'Track your body\'s\ntransformation day by day.',
    icon: <IoTrendingUpOutline size={100} color="#ec4899" />,
    desc: 'Log your energy, sleep, and recovery. Visualize your 30-day trends instantly.'
  }
];

const QUESTIONS = [
  {
    id: 'goal',
    title: 'What is your primary wellness goal?',
    options: ['Anti-Aging & Longevity', 'Fat Loss & Metabolism', 'Muscle Growth & Recovery', 'Cognitive Focus', 'Injury Repair'],
  },
  {
    id: 'sleep',
    title: 'How would you rate your sleep quality?',
    options: ['Deep & Restful', 'Average', 'Waking up tired', 'Insomnia'],
  },
  {
    id: 'energy',
    title: 'What is your daily energy like?',
    options: ['High and constant', 'Afternoon crashes', 'Low all day'],
  },
  {
    id: 'peptides',
    title: 'Which compounds are you researching?',
    subtitle: 'Select all that apply',
    options: ['Semaglutide / Tirzepatide', 'BPC-157 / TB-500', 'CJC-1295 / Ipamorelin', 'NAD+ / Glutathione', 'Other'],
    multi: true,
  }
];

const BUILD_STEPS = [
  'Analyzing your goals & sleep data...',
  'Generating your 30-Day Protocol...',
  'Personalizing your AI Tutor...',
  'Locking in your custom dashboard...',
  'Almost ready...'
];

export default function Onboarding({ onComplete }) {
  const [phase, setPhase] = useState('tutorial'); // tutorial, quiz, disclaimer, building
  const [tutStep, setTutStep] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelect, setMultiSelect] = useState([]);
  const [buildStep, setBuildStep] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);

  // Building animation
  useEffect(() => {
    if (phase !== 'building') return;
    const stepInterval = setInterval(() => {
      setBuildStep(prev => {
        if (prev >= BUILD_STEPS.length - 1) { clearInterval(stepInterval); return prev; }
        return prev + 1;
      });
    }, 1200);
    const progressInterval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(answers), 800);
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, [phase, onComplete]);

  // Auto-advance tutorial slightly if user doesn't tap (TikTok style auto-play feeling)
  useEffect(() => {
    if (phase !== 'tutorial') return;
    const autoPlay = setTimeout(() => {
      // Just a subtle hint or auto-advance if we wanted, but manual tap is safer for reading.
    }, 4000);
    return () => clearTimeout(autoPlay);
  }, [phase, tutStep]);

  function handleTutNext() {
    if (tutStep < TUTORIAL_STEPS.length - 1) {
      setTutStep(tutStep + 1);
    } else {
      setPhase('quiz');
    }
  }

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

  const currentQuestion = QUESTIONS[questionIdx];

  return (
    <div className="ob-screen" style={{ overflow: 'hidden' }}>
      <div className="ob-body" style={{ width: '100%', height: '100%', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Tutorial Phase */}
        {phase === 'tutorial' && (
          <div onClick={handleTutNext} className="animate-in" key={tutStep} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textAlign: 'center' }}>
            {/* Story Progress Bars */}
            <div style={{ position: 'absolute', top: 60, left: 20, right: 20, display: 'flex', gap: 6 }}>
               {TUTORIAL_STEPS.map((_, i) => (
                 <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= tutStep ? '#ec4899' : '#e0e0e0', transition: 'background 0.3s' }} />
               ))}
            </div>

            <div style={{ background: '#fff5f8', width: 180, height: 180, borderRadius: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, boxShadow: '0 20px 40px rgba(236,72,153,0.15)' }}>
               {TUTORIAL_STEPS[tutStep].icon}
            </div>
            <h1 style={{ fontSize: '2rem', lineHeight: 1.2, fontWeight: 800, color: '#1a1a1a', marginBottom: 20, whiteSpace: 'pre-line' }}>
              {TUTORIAL_STEPS[tutStep].title}
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: 1.5, maxWidth: 300 }}>
              {TUTORIAL_STEPS[tutStep].desc}
            </p>
            
            <div style={{ position: 'absolute', bottom: 60, color: '#999', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }} className="pulse">
              Tap anywhere to continue <IoArrowForward />
            </div>
          </div>
        )}

        {/* Questions Phase */}
        {phase === 'quiz' && currentQuestion && (
          <div className="animate-in" key={questionIdx} style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <p style={{ color: '#ec4899', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Question {questionIdx + 1} of {QUESTIONS.length}</p>
            <h1 className="ob-title" style={{ fontSize: '1.6rem', textAlign: 'left', lineHeight: 1.3 }}>{currentQuestion.title}</h1>
            {currentQuestion.subtitle && <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 16, textAlign: 'left' }}>{currentQuestion.subtitle}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              {currentQuestion.options.map(opt => {
                const isSelected = currentQuestion.multi ? multiSelect.includes(opt) : answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleQuestionAnswer(opt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '18px 20px', borderRadius: 16, textAlign: 'left',
                      background: isSelected ? '#1a1a1a' : '#f8f8f8',
                      color: isSelected ? 'white' : '#1a1a1a',
                      border: 'none', fontSize: '1.05rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      fontFamily: 'system-ui, sans-serif', width: '100%',
                      boxShadow: isSelected ? '0 8px 16px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {currentQuestion.multi && (
                      <div style={{
                        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                        border: isSelected ? 'none' : '2px solid #ccc',
                        background: isSelected ? '#ec4899' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.8rem', fontWeight: 700,
                      }}>
                        {isSelected && '✓'}
                      </div>
                    )}
                    {opt}
                  </button>
                );
              })}
            </div>
            
            {currentQuestion.multi && multiSelect.length > 0 && (
              <button className="btn btn-primary btn-full" onClick={handleMultiContinue} style={{ fontSize: '1.1rem', fontWeight: 700, padding: 18, marginTop: 32, borderRadius: 100 }}>
                Continue
              </button>
            )}
          </div>
        )}

        {/* Disclaimer Phase */}
        {phase === 'disclaimer' && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ marginBottom: 32, background: '#f5f5f5', width: 100, height: 100, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <IoShieldCheckmark size={50} color="#1a1a1a" />
            </div>
            <h1 className="ob-title" style={{ fontSize: '1.6rem', lineHeight: 1.3 }}>Important Disclaimer</h1>
            <div style={{ background: '#f8f8f8', padding: 24, borderRadius: 16, marginTop: 20 }}>
              <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.7, maxWidth: 340, textAlign: 'left', margin: 0, fontWeight: 500 }}>{DISCLAIMER}</p>
            </div>
            
            <button className="btn btn-primary btn-full" onClick={() => setPhase('building')} style={{ fontSize: '1.1rem', fontWeight: 700, padding: 18, marginTop: 40, borderRadius: 100 }}>
              I Understand & Agree
            </button>
          </div>
        )}

        {/* Building Phase */}
        {phase === 'building' && (
          <div className="animate-in" style={{ width: '100%', maxWidth: 320, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ width: 120, height: 120, border: '4px solid #fff5f8', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 40 }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 32, color: '#1a1a1a' }}>Generating Protocol...</h1>
            <div style={{ width: '100%', height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ width: `${buildProgress}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: 4, transition: 'width 0.15s ease' }} />
            </div>
            <p style={{ color: '#ec4899', fontSize: '1rem', fontWeight: 600, minHeight: 24, transition: 'opacity 0.3s' }}>{BUILD_STEPS[buildStep]}</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

      </div>
    </div>
  );
}
