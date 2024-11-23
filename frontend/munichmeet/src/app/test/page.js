// "use client";

// import React, { useState } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';

// export default function Test() {
//   const [data, setData] = useState('No result');
//   return (<Scanner onScan={(result) => {
//     console.log(result[0].rawValue)
//     }   
//   } />
//   );
// }

"use client";

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function Test() {
  const [data, setData] = useState("No result");
  const [showScanner, setShowScanner] = useState(false); // Control scanner visibility

  const handleScan = (result) => {
    if (result?.[0]?.rawValue) {
      console.log(result[0].rawValue); // Log scanned value
      setData(result[0].rawValue); // Update scanned data
      setShowScanner(false); // Close the scanner after successful scan
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code Scanner</h1>
      <button
        onClick={() => setShowScanner(true)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Start Scanning
      </button>
      <p>Scanned Result: {data}</p>

      {showScanner && (
        <Scanner
          onScan={handleScan}
          onError={(error) => console.error("Error scanning QR code:", error)}
          containerStyle={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
        />
      )}
    </div>
  );
}




// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { Scanner } from '@yudiel/react-qr-scanner';

// // Modal.setAppElement('#__next'); // Set the root element for accessibility

// export default function QRCodeScannerWithModal() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [scanResult, setScanResult] = useState('');

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const handleScan = (result) => {
//     if (result) {
//       console.log("hello")
//       console.log(result)
//       setScanResult(result);
//       closeModal(); // Close modal after scanning
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>QR Code Scanner with Modal</h1>
//       <button
//         onClick={openModal}
//         style={{
//           padding: '10px 20px',
//           fontSize: '16px',
//           cursor: 'pointer',
//           marginBottom: '20px',
//         }}
//       >
//         Open QR Scanner
//       </button>
//       <p>Scanned Result: {scanResult || 'No result yet'}</p>

//       {/* Modal for QR Scanner */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         contentLabel="QR Code Scanner"
//         style={{
//           content: {
//             top: '50%',
//             left: '50%',
//             right: 'auto',
//             bottom: 'auto',
//             marginRight: '-50%',
//             transform: 'translate(-50%, -50%)',
//           },
//         }}
//       >
//         <h2>Scan a QR Code</h2>
//         <Scanner
//           onResult={handleScan}
//           containerStyle={{ width: '100%', height: '300px' }}
//         />
//         <button
//           onClick={closeModal}
//           style={{
//             padding: '10px 20px',
//             marginTop: '20px',
//             fontSize: '16px',
//             cursor: 'pointer',
//           }}
//         >
//           Close
//         </button>
//       </Modal>
//     </div>
//   );
// }


