'use client';
import { useRouter } from 'next/navigation';

export default function QRCodeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => 
        {
            const currentUrl = window.location.pathname; // Current URL pathname
            console.log(`Current URL: ${currentUrl}`);
            if (currentUrl == '/scan') {
                router.push('/')
            }
            if (currentUrl == '/') {
                router.push('/scan')}
            }
            
        }
        
      className="absolute bottom-2 right-4 z-50 w-16 h-16 p-0 bg-yellow-400 hover:opacity-25"
      style={{ border: 'none', cursor: 'pointer' }}
    >
      <img
        src="/qrcodebutton.png"
        alt="QR Code Button"
        className="w-full h-full object-contain"
      />
    </button>
  );
}

