import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { QRCodeSVG } from 'qrcode.react';

export const QRGenerator = () => {
  const [text, setText] = useState('https://studenttoolkit.com');

  return (
    <ToolLayout 
      toolId="qr-generator"
      howItWorks={<p>Simply type a link or any text, and this tool will instantly generate a QR code that you can scan with your phone's camera.</p>}
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-2xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 w-full">
          <label className="block font-bold mb-2 text-left">Text or URL</label>
          <textarea 
            className="comic-input w-full h-32 resize-none"
            placeholder="Enter link, text, or contact info..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 border-[3px] border-comic-dark rounded-2xl bg-comic-light shadow-[4px_4px_0px_#1E1E24]">
          <div className="bg-white p-4 border-2 border-gray-200 rounded-xl">
            <QRCodeSVG value={text || ' '} size={200} />
          </div>
          <p className="font-bold text-sm text-gray-500">Scan me!</p>
        </div>
      </div>
    </ToolLayout>
  );
};
