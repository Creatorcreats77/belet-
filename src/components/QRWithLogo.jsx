import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import KeyboardInput from "./KeyboardInput";


export default function QRWithLogo() {
  const [text, setText] = useState("hf");
  const [logo, setLogo] = useState(null);
  const qrCanvasRef = useRef(null);

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw QR with logo into a new canvas (so preview & download both work)
  const drawQRWithLogo = () => {
    const qrCanvas = qrCanvasRef.current;
    if (!qrCanvas) return null;

    const qrDataUrl = qrCanvas.toDataURL();
    const finalCanvas = document.createElement("canvas");
    const size = qrCanvas.width;
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext("2d");

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    return new Promise((resolve) => {
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 0, 0, size, size);
        if (logo) {
          const logoImg = new Image();
          logoImg.src = logo;
          logoImg.onload = () => {
            const logoSize = size * 0.25; // 25% of QR size
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            resolve(finalCanvas);
          };
        } else {
          resolve(finalCanvas);
        }
      };
    });
  };

  // Save QR as PNG with prompt for filename
  const handleDownload = async () => {
    const finalCanvas = await drawQRWithLogo();
    if (!finalCanvas) return;

    const defaultName = "hf";
    const enteredName = window.prompt("Enter file name:", defaultName);
    if (enteredName === null) return; // user cancelled

    const link = document.createElement("a");
    link.download = `${enteredName || defaultName}.png`;
    link.href = finalCanvas.toDataURL();
    link.click();
  };

  return (
    <div className="container mx-auto">
    <div className="mx-64">
        <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-2">QR Code Generator</h1>

      <div className="flex flex-col gap-3 w-full">
        <label className="font-medium">Enter Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          className="border rounded-lg p-2 w-full shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <label className="font-medium text-green-600">Upload Logo</label>
        <input className="border border-2" type="file" accept="image/*" onChange={handleLogoUpload} />
      </div>

      {/* Hidden QR for base generation */}
      <QRCodeCanvas
        value={text}
        size={256}
        level="H"
        includeMargin
        ref={qrCanvasRef}
        style={{ display: "none" }}
      />

      <div className="flex flex-col items-center gap-4 mt-4">
        <button
          onClick={async () => {
            const canvas = await drawQRWithLogo();
            const preview = document.getElementById("qrPreview");
            if (canvas && preview) {
              preview.src = canvas.toDataURL();
            }
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
        >
          Qr generate
        </button>

        <img id="qrPreview" alt="QR Preview" className="rounded-xl shadow-md border p-2 bg-gray-50" />

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Save QR with Logo
        </button>
      </div>
           <KeyboardInput onInputChange={(text) => setSearchText(text)} />
      
    </div>
    </div>
    </div>
  );
}
