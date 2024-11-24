"use client";
import { useState } from 'react';
import QRCode from 'qrcode';
import { Scanner } from '@yudiel/react-qr-scanner';
import Scoreboard from '../components/Scoreboard';
import "./styles.css"; // Import the CSS file
import { useRouter } from "next/navigation";
import { useUserPoints } from '../context/context';
import QrCodeButton from '../components/QrCodeButton';

var person_data_dict = {"name": "",
                        "instagram_url": ""
};


export default function Scan() {
  const [message, setMessage] = useState('');
  // For showing QR code
  const [inputValueName, setInputValueName] = useState('Alejandro');
  const [inputValueURL, setInputValueURL] = useState('https://thispersondoesnotexist.com/');
  const [qrCodeData, setQRCodeData] = useState('');
  const userPointsAwarded = 10;  
  const { points, addPoints, resetPoints, name,setShowSuccess, setQRCode, qrCodeInfo, setQRCodeInfo } = useUserPoints();

  // For scanning QR code
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [data, setData] = useState('No result');
  const [showScanner, setShowScanner] = useState(false); // Control scanner visibility
  const router = useRouter();
  
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
      // person_data_dict["name"] = inputValueName;
      // person_data_dict["instagram_url"] = inputValueURL;

      const qrCode = await QRCode.toDataURL(JSON.stringify(person_data_dict) || 'Default QR Code');
      setQRCodeData(qrCode);
      // setQRCodeInfo(JSON.stringify(person_data_dict))
    } catch (error) {
      console.error('Error generating QR Code:', error);
    }
  };

  const handleQRScan = (result) => {
    if (result?.[0]?.rawValue) {
      console.log(result[0].rawValue); // Log scanned value
      setData(result[0].rawValue); // Update scanned data
      setShowSuccess(true); // Close the scanner after successful scan
      addPoints(userPointsAwarded)
      // setQRCodeData({"name": "",
      //                "instagram_url": ""
      // })
      person_data_dict["name"] = inputValueName;
      person_data_dict["instagram_url"] = inputValueURL;
      setQRCodeInfo(person_data_dict);
      console.log("qr code info: ", qrCodeInfo);
      // Go to the map view with the qr code successful read 
      router.push('/');
    }
  };


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QR Code Generator: Name</h1>
      <input
        type="text"
        placeholder="Enter text to generate QR Code"
        value={inputValueName}
        onChange={(e) => setInputValueName(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '80%',
          maxWidth: '300px',
          marginBottom: '20px',
        }}
        class="border border-gray-300 p-2 rounded"
      />
      <br />

      <h1>QR Code Generator: Social media URL</h1>
      <input
        type="text"
        placeholder="Enter text to generate QR Code social media"
        value={inputValueURL}
        onChange={(e) => setInputValueURL(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '80%',
          maxWidth: '300px',
          marginBottom: '20px',
        }}
        class="border border-gray-300 p-2 rounded"
      />  

  
      <div>
        <button
          onClick={generateQRCode}
          className="blue-rounded-button"
        >
          Generate QR Code
        </button> 
      </div>
      
      <div style={{ marginTop: '30px' }}>
        {qrCodeData && (
          <div >
            <p>Scan the QR Code below:</p>
            <img src={qrCodeData} alt="Generated QR Code" class="mx-auto"/>
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
       <QrCodeButton />
    </div>
   
  );
}

















 

