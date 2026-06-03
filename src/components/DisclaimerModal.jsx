import React, { useState, useEffect } from 'react';

export default function DisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('peptidai_eula_accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('peptidai_eula_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '24px',
        padding: '32px 24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
          <ion-icon name="warning-outline"></ion-icon>
        </div>
        
        <h2 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: '800', color: '#1A1815' }}>Important Disclaimer</h2>
        
        <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#4B5563', textAlign: 'left', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            This application is a mathematical tool designed <strong>exclusively for academic laboratory research and dilution calculations</strong>.
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            It is <strong>NOT a medical device</strong>. It does not provide medical advice and must not be used to determine amounts for human or animal consumption.
          </p>
          <p style={{ margin: 0 }}>
            By continuing, you acknowledge that this tool is for educational and research purposes only.
          </p>
        </div>

        <button 
          onClick={handleAccept}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#1A1815',
            color: '#FFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
}
