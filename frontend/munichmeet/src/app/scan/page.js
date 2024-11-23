"use client";
import { useState } from 'react';
import QRCode from 'qrcode';
import dynamic from 'next/dynamic';

const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

export default function Scan() {
  const [message, setMessage] = useState('');
  // For showing QR code
  const [inputValue, setInputValue] = useState('https://www.wikipedia.org/');
  const [qrCodeData, setQRCodeData] = useState('');

  // For scanning QR code
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      setScanning(false); // Stop scanning after a QR code is detected
    }
  };

  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
  };

  const generateQRCode = async () => {
    try {
      const qrCode = await QRCode.toDataURL(inputValue || 'Default QR Code');
      setQRCodeData(qrCode);
    } catch (error) {
      console.error('Error generating QR Code:', error);
    }
  };

  const scanQRcode = async () => {
    try {
      const qrCode = await QRCode.toDataURL(inputValue || 'Default QR Code');
      setQRCodeData(qrCode);
    } catch (error) {
      console.error('Error generating QR Code:', error);
    }
  };


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter text to generate QR Code"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '80%',
          maxWidth: '300px',
          marginBottom: '20px',
        }}
      />
      <br />
      <button
        onClick={generateQRCode}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Generate QR Code
      </button>
      <div style={{ marginTop: '30px' }}>
        {qrCodeData && (
          <div>
            <p>Scan the QR Code below:</p>
            <img src={qrCodeData} alt="Generated QR Code" />
          </div>
        )}
      </div>
      <button
        onClick={handleScan}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Scan QR Code
      </button>
    </div>
  );

  // return (
  //   <div style={{ textAlign: 'center', marginTop: '50px' }}>
  //     <h1>Welcome to My Next.js App</h1>
  //     <div>
  //       <button
  //         style={{
  //           padding: '10px 20px',
  //           margin: '10px',
  //           fontSize: '16px',
  //           cursor: 'pointer',
  //         }}
  //         onClick={() => showQRcode()}
  //       >
  //         Show QR code
  //       </button>
  //       <button
  //         style={{
  //           padding: '10px 20px',
  //           margin: '10px',
  //           fontSize: '16px',
  //           cursor: 'pointer',
  //         }}
  //         onClick={() => handleClick(2)}
  //       >
  //         Scan QR code
  //       </button>
  //     </div>
  //     {message && <p style={{ marginTop: '20px', fontSize: '18px' }}>{message}</p>}
  //   </div>
  // );
}

















 

