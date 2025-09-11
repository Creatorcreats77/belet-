import React, { useState } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function QRWithLogoBatch() {
  const [logo, setLogo] = useState(null);
  const [ids, setIds] = useState("");

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

  const drawQRWithLogo = async (text) => {
    const size = 512; // larger size for better scanning
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Generate QR code
    await QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: "H",
      width: size,
      margin: 1,
    });

    // Add logo if uploaded
    if (logo) {
      const logoImg = new Image();
      logoImg.src = logo;
      await new Promise((resolve) => {
        logoImg.onload = () => {
          const logoSize = size * 0.2; // smaller logo for better QR readability
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          resolve();
        };
        logoImg.onerror = () => resolve(); // fail gracefully if logo cannot load
      });
    }

    return canvas;
  };

  const handleDownloadAll = async () => {
    const values = ids.split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length === 0) {
      alert("Please enter at least one ID.");
      return;
    }

    const zip = new JSZip();

    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      try {
        const canvas = await drawQRWithLogo(val);
        const dataUrl = canvas.toDataURL("image/png");
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`${val}.png`, base64Data, { base64: true });

        // Optional: small delay to avoid blocking UI
        await new Promise((r) => setTimeout(r, 50));
      } catch (err) {
        console.error(`Failed to generate QR for ${val}:`, err);
      }
    }

    // Generate zip and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "QR_Codes.zip");
    });
  };

  return (
    <div className="container mx-auto">
      <div className="mx-64">
        <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Batch QR Generator</h1>

          <div className="flex flex-col gap-3 w-full">
            <label className="font-medium text-green-600">Upload Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="font-medium">Enter IDs (comma-separated)</label>
            <input
              type="text"
              value={ids}
              onChange={(e) => setIds(e.target.value)}
              placeholder="id1,id2,id3"
              className="border rounded-lg p-2 w-full shadow-sm"
            />
          </div>

          <button
            onClick={handleDownloadAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Generate & Download ZIP
          </button>
        </div>
      </div>
    </div>
  );
}
