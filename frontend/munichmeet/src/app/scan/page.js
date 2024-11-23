"use client";
import { useState } from 'react';
import QRCode from 'qrcode';
import dynamic from 'next/dynamic';
import { Scanner } from '@yudiel/react-qr-scanner';
import "./styles.css"; // Import the CSS file


export default function Scan() {
  const [message, setMessage] = useState('');
  // For showing QR code
  const [inputValue, setInputValue] = useState('https://thispersondoesnotexist.com/');
  const [qrCodeData, setQRCodeData] = useState('');

  // For scanning QR code
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [data, setData] = useState('No result');
  const [showScanner, setShowScanner] = useState(false); // Control scanner visibility
  
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

  const handleQRScan = (result) => {
    if (result?.[0]?.rawValue) {
      console.log(result[0].rawValue); // Log scanned value
      setData(result[0].rawValue); // Update scanned data
      setShowScanner(false); // Close the scanner after successful scan
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
        className="blue-rounded-button"
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
        onClick={() => setShowScanner(true)}
        className="blue-rounded-button"
      >
        Start Scanning
      </button>
      <p>Scanned Result: {data}</p>

      {showScanner && (
        <Scanner
          onScan={handleQRScan}
          onError={(error) => console.error("Error scanning QR code:", error)}
          containerStyle={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
        />
      )}
    </div>
  );
}

















 

