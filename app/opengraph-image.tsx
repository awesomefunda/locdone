import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Locdone — Your documents never leave this device.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#0E0E10',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: '#1E1E23',
              border: '1.5px solid #36363F',
              display: 'flex',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 18,
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: '#7CFFB2',
                boxShadow: '0 0 16px rgba(124,255,178,0.6)',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 52,
              fontStyle: 'italic',
              color: '#F2F2F5',
              display: 'flex',
            }}
          >
            Loc
            <span style={{ color: '#7CFFB2', fontStyle: 'normal' }}>done</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontStyle: 'italic',
            fontSize: 100,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: '#F2F2F5',
          }}
        >
          <div>Your documents</div>
          <div style={{ display: 'flex', gap: '22px' }}>
            <span style={{ color: '#7CFFB2' }}>never leave</span>
            <span>this device.</span>
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 22,
            color: '#A8A8B3',
          }}
        >
          <div style={{ display: 'flex', gap: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: '#7CFFB2',
                }}
              />
              <span>0 uploads</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: '#7CFFB2',
                }}
              />
              <span>0 accounts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: '#7CFFB2',
                }}
              />
              <span>0 tracking</span>
            </div>
          </div>
          <div style={{ color: '#6E6E78' }}>locdone.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
