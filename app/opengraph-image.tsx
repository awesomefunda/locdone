import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt =
  'Locdone — Free PDF tools that run entirely in your browser. No uploads.';
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
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#0E0E10',
              border: '1.5px solid #36363F',
              display: 'flex',
              position: 'relative',
            }}
          >
            {/* Document outline */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: 24,
                height: 30,
                border: '1.5px solid #A8A8B3',
                borderRadius: 2,
                background: '#1E1E23',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 26,
                left: 18,
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: '#7CFFB2',
                boxShadow: '0 0 14px rgba(124,255,178,0.7)',
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
            fontSize: 92,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: '#F2F2F5',
          }}
        >
          <div>Free PDF tools.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px' }}>
            <span style={{ color: '#7CFFB2' }}>Never uploaded.</span>
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
              <span>100% free</span>
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
              <span>no signup</span>
            </div>
          </div>
          <div style={{ color: '#6E6E78' }}>locdone.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
