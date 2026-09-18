import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { PDFDocument } from 'pdf-lib';
import { FileUp, FileText, CheckCircle2, Scissors, Layers, Info, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PdfTab = 'analyze' | 'merge' | 'split';

export const PDFTools = () => {
  const [activeTab, setActiveTab] = useState<PdfTab>('analyze');
  
  // Analyze State
  const [fileInfo, setFileInfo] = useState<{name: string, size: string, pages: number, author?: string, creationDate?: string} | null>(null);
  
  // Merge State
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  
  // Split State
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPagesStr, setSplitPagesStr] = useState<string>('');
  const [splitMaxPages, setSplitMaxPages] = useState<number>(0);

  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analyze Handler
  const handleAnalyzeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a valid PDF file.");
      setFileInfo(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileInfo(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const pages = pdfDoc.getPageCount();
      const author = pdfDoc.getAuthor();
      const creationDate = pdfDoc.getCreationDate()?.toLocaleDateString();

      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        pages,
        author,
        creationDate
      });
    } catch (err) {
      console.error(err);
      setError("Could not read this PDF file. It might be corrupted or encrypted.");
    } finally {
      setIsLoading(false);
    }
  };

  // Merge Handlers
  const handleMergeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f: File) => f.type === 'application/pdf');
    if (files.length === 0) {
      setError("Please select valid PDF files.");
      return;
    }
    setError(null);
    setMergeFiles(prev => [...prev, ...files]);
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const executeMerge = async () => {
    if (mergeFiles.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      downloadBlob(mergedPdfBytes, 'merged-document.pdf');
    } catch (err) {
      console.error(err);
      setError("Error merging PDFs. One of the files might be encrypted or corrupted.");
    } finally {
      setIsLoading(false);
    }
  };

  // Split Handlers
  const handleSplitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please select a valid PDF file.");
      setSplitFile(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSplitFile(file);
    setSplitPagesStr('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setSplitMaxPages(pdfDoc.getPageCount());
    } catch (err) {
      console.error(err);
      setError("Could not read this PDF file. It might be corrupted or encrypted.");
      setSplitFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSplit = async () => {
    if (!splitFile) return;
    
    const indices = parsePageRange(splitPagesStr, splitMaxPages);
    if (indices.length === 0) {
      setError("Please enter a valid page range (e.g., '1, 3-5').");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const arrayBuffer = await splitFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const splitPdf = await PDFDocument.create();
      const copiedPages = await splitPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach((page) => splitPdf.addPage(page));
      
      const splitPdfBytes = await splitPdf.save();
      downloadBlob(splitPdfBytes, `extracted-${splitFile.name}`);
    } catch (err) {
      console.error(err);
      setError("Error extracting pages. The file might be encrypted or corrupted.");
    } finally {
      setIsLoading(false);
    }
  };

  const parsePageRange = (rangeStr: string, maxPage: number): number[] => {
    const indices: number[] = [];
    const parts = rangeStr.split(',');
    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-');
            const s = parseInt(start, 10);
            const e = parseInt(end, 10);
            if (!isNaN(s) && !isNaN(e) && s >= 1 && e <= maxPage && s <= e) {
                for (let i = s; i <= e; i++) {
                    indices.push(i - 1);
                }
            }
        } else {
            const p = parseInt(trimmed, 10);
            if (!isNaN(p) && p >= 1 && p <= maxPage) {
                indices.push(p - 1);
            }
        }
    }
    return [...new Set(indices)].sort((a,b)=>a-b);
  };

  const downloadBlob = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout 
      toolId="pdf-tools"
      howItWorks={<p>We use local browser technologies to parse and modify your PDF files. <strong>Your files never leave your computer</strong> and are not uploaded to any server. It is 100% private and secure.</p>}
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-2xl mx-auto">
        
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          <button 
            onClick={() => { setActiveTab('analyze'); setError(null); }}
            className={`flex-1 py-3 px-4 font-bold rounded-xl border-[3px] border-comic-dark flex items-center justify-center gap-2 transition-colors ${activeTab === 'analyze' ? 'bg-comic-blue text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            <Info size={20} /> Info
          </button>
          <button 
            onClick={() => { setActiveTab('merge'); setError(null); }}
            className={`flex-1 py-3 px-4 font-bold rounded-xl border-[3px] border-comic-dark flex items-center justify-center gap-2 transition-colors ${activeTab === 'merge' ? 'bg-comic-green text-comic-dark' : 'bg-white hover:bg-gray-50'}`}
          >
            <Layers size={20} /> Merge
          </button>
          <button 
            onClick={() => { setActiveTab('split'); setError(null); }}
            className={`flex-1 py-3 px-4 font-bold rounded-xl border-[3px] border-comic-dark flex items-center justify-center gap-2 transition-colors ${activeTab === 'split' ? 'bg-comic-red text-white' : 'bg-white hover:bg-gray-50'}`}
          >
            <Scissors size={20} /> Extract
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'analyze' && (
          <div className="space-y-6">
            <div className="border-4 border-dashed border-comic-dark rounded-3xl p-8 text-center bg-comic-light hover:bg-[#ebf0f5] transition-colors relative cursor-pointer group">
              <input 
                type="file" 
                accept="application/pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleAnalyzeUpload}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-comic-yellow border-[3px] border-comic-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileUp className="w-10 h-10 text-comic-dark" />
                </div>
                <div>
                  <p className="font-display text-2xl mb-1">Analyze PDF</p>
                  <p className="font-bold text-gray-500">Tap to browse or drag and drop a PDF</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {fileInfo && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <h3 className="font-display text-2xl mb-4 text-center">Document Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="comic-card-sm p-4 bg-white border-2 border-comic-dark rounded-xl flex items-start gap-3 col-span-2 sm:col-span-1">
                      <FileText className="text-comic-blue mt-1 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-500 uppercase">Filename</div>
                        <div className="font-bold truncate" title={fileInfo.name}>{fileInfo.name}</div>
                      </div>
                    </div>
                    <div className="comic-card-sm p-4 bg-white border-2 border-comic-dark rounded-xl">
                      <div className="text-xs font-bold text-gray-500 uppercase">File Size</div>
                      <div className="font-display text-2xl truncate">{fileInfo.size}</div>
                    </div>
                    <div className="comic-card-sm p-4 bg-white border-2 border-comic-dark rounded-xl">
                      <div className="text-xs font-bold text-gray-500 uppercase">Page Count</div>
                      <div className="font-display text-3xl text-comic-red">{fileInfo.pages}</div>
                    </div>
                    {(fileInfo.author || fileInfo.creationDate) && (
                      <div className="comic-card-sm p-4 bg-white border-2 border-comic-dark rounded-xl">
                        <div className="text-xs font-bold text-gray-500 uppercase">Meta</div>
                        {fileInfo.author && <div className="font-bold text-sm truncate" title={fileInfo.author}>By: {fileInfo.author}</div>}
                        {fileInfo.creationDate && <div className="font-bold text-sm">Created: {fileInfo.creationDate}</div>}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'merge' && (
          <div className="space-y-6">
            <div className="border-4 border-dashed border-comic-dark rounded-3xl p-8 text-center bg-comic-light hover:bg-[#ebf0f5] transition-colors relative cursor-pointer group">
              <input 
                type="file" 
                multiple
                accept="application/pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleMergeUpload}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-comic-green border-[3px] border-comic-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-10 h-10 text-comic-dark" />
                </div>
                <div>
                  <p className="font-display text-2xl mb-1">Add PDFs to Merge</p>
                  <p className="font-bold text-gray-500">Select multiple files</p>
                </div>
              </div>
            </div>

            {mergeFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-700">Files to Merge ({mergeFiles.length}):</h3>
                {mergeFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-2 border-comic-dark rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="text-comic-blue shrink-0" size={20} />
                      <span className="font-bold truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => removeMergeFile(i)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={executeMerge}
                  disabled={isLoading || mergeFiles.length < 2}
                  className="comic-btn comic-btn-primary w-full py-4 text-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  <Layers size={24} /> Merge PDFs
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'split' && (
          <div className="space-y-6">
            {!splitFile ? (
              <div className="border-4 border-dashed border-comic-dark rounded-3xl p-8 text-center bg-comic-light hover:bg-[#ebf0f5] transition-colors relative cursor-pointer group">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleSplitUpload}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-comic-red border-[3px] border-comic-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scissors className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="font-display text-2xl mb-1">Select PDF to Extract</p>
                    <p className="font-bold text-gray-500">Tap to browse or drag and drop</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border-2 border-comic-dark rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-comic-blue shrink-0" size={24} />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{splitFile.name}</div>
                      <div className="text-sm font-bold text-gray-500">{splitMaxPages} pages total</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSplitFile(null); setSplitPagesStr(''); }}
                    className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div>
                  <label className="block font-bold mb-2">Pages to Extract</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1, 3-5"
                    className="comic-input w-full mb-2"
                    value={splitPagesStr}
                    onChange={(e) => setSplitPagesStr(e.target.value)}
                  />
                  <p className="text-sm font-bold text-gray-500">Enter comma-separated page numbers or ranges (e.g., "1, 3-5").</p>
                </div>

                <button 
                  onClick={executeSplit}
                  disabled={isLoading || !splitPagesStr.trim()}
                  className="comic-btn comic-btn-primary w-full py-4 text-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download size={24} /> Extract & Download
                </button>
              </div>
            )}
          </div>
        )}

        {/* Common Status Indicators */}
        {isLoading && (
          <div className="mt-8 text-center font-bold text-comic-blue animate-pulse text-lg">
            Processing your PDF...
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 rounded-xl border-[3px] border-red-500 bg-red-50 text-red-700 font-bold text-center">
            {error}
          </div>
        )}

        <div className="mt-8 text-sm font-bold text-comic-green flex items-center justify-center gap-1 border-t-[3px] border-comic-dark pt-6">
          <CheckCircle2 size={16} /> Processed locally. No server upload.
        </div>
      </div>
    </ToolLayout>
  );
};
