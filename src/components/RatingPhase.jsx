import { useEffect, useState } from 'react';
import { AppReview } from '@capawesome/capacitor-app-review';
import { Capacitor } from '@capacitor/core';
import { IoStar } from 'react-icons/io5';

export default function RatingPhase({ onNext }) {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const requestReview = async () => {
      setTimeout(async () => {
        if (!isMounted) return;
        try {
          if (Capacitor.isNativePlatform()) {
            await AppReview.requestReview();
          } else {
            console.log("AppReview.requestReview() triggered (Web simulation)");
          }
          setRequested(true);
        } catch (e) {
          console.warn("Failed to request app review:", e);
          setRequested(true);
        }
      }, 1000);
    };

    requestReview();

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
      <h1 className="ob-title" style={{ fontSize: '2rem', lineHeight: 1.3, marginBottom: 24, fontWeight: 800 }}>Give us a rating</h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', position: 'relative' }}>
        {/* Glowing Stars */}
        {[...Array(5)].map((_, i) => (
          <IoStar 
            key={i} 
            size={40} 
            style={{ 
              color: '#FBBF24', // Amber/Gold
              filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.4))' 
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 300, marginBottom: 60 }}>
        This app was designed for people like you to reach your goals faster.
        <br/><br/>
        If you are enjoying PeptidAI so far, please tap a star to rate it!
      </p>
      
      <button 
        className="btn btn-primary btn-full" 
        onClick={onNext}
        style={{ fontSize: '1.1rem', fontWeight: 700, padding: 18, borderRadius: 100, marginBottom: 16 }}>
        Continue
      </button>
    </div>
  );
}
