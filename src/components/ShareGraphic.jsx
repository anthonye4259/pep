import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { Share } from '@capacitor/share';
import { Directory, Filesystem } from '@capacitor/filesystem';

export default function ShareGraphic({ title, subtitle, items = [], onClose }) {
  const nodeRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleShare() {
    if (!nodeRef.current) return;
    setIsGenerating(true);
    try {
      // htmlToImage requires the node to be rendered, but we can temporarily strip the scale transform
      // to capture it at full 1080x1920 resolution.
      const dataUrl = await htmlToImage.toJpeg(nodeRef.current, { 
        quality: 0.95, 
        pixelRatio: 1,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      
      const fileName = `peptidai-share-${Date.now()}.jpeg`;
      const base64Data = dataUrl.split(',')[1];
      
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      await Share.share({
        title: 'My Routine',
        text: 'Check out my research routine on PeptidAI!',
        url: savedFile.uri,
        dialogTitle: 'Share to Instagram Story'
      });
      onClose && onClose();
    } catch (e) {
      console.error('Error generating image', e);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* The graphic container that gets screenshotted */}
      {/* We use a container that crops the visual preview so it fits on screen, but the inner div is 1080x1920 */}
      <div style={{ width: 1080 * 0.3, height: 1920 * 0.3, overflow: 'hidden', borderRadius: 12, position: 'relative' }}>
        <div 
          ref={nodeRef}
          style={{ 
            width: '1080px', height: '1920px', 
            transform: 'scale(0.3)', transformOrigin: 'top left',
            background: 'linear-gradient(135deg, #fff5f8 0%, #ffffff 100%)',
            display: 'flex', flexDirection: 'column', padding: '120px 80px',
            boxSizing: 'border-box', position: 'absolute', top: 0, left: 0
          }}
        >
          <h1 style={{ fontSize: '80px', color: '#1a1a1a', margin: '0 0 20px 0', fontFamily: 'system-ui, sans-serif' }}>{title}</h1>
          <h2 style={{ fontSize: '40px', color: 'var(--accent)', margin: '0 0 80px 0', fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}>{subtitle}</h2>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '30px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '50px', color: '#1a1a1a' }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '36px', color: '#666' }}>{item.value}</p>
              </div>
            ))}
          </div>
          
          {/* Footer Watermark */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '50px', fontWeight: 'bold' }}>P</div>
              <span style={{ fontSize: '40px', color: '#1a1a1a', fontWeight: 'bold' }}>Made with PeptidAI</span>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
         <button onClick={onClose} style={{ padding: '15px 30px', background: '#333', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '18px', fontWeight: 'bold' }}>Cancel</button>
         <button onClick={handleShare} disabled={isGenerating} style={{ padding: '15px 30px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '18px', fontWeight: 'bold' }}>
           {isGenerating ? 'Generating...' : 'Share to IG Story'}
         </button>
      </div>
    </div>
  );
}
