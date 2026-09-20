import React, { useState, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { 
  FileUp, 
  Presentation, 
  Download, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  LayoutTemplate
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { PDFDocument, rgb, StandardFonts, grayscale } from 'pdf-lib';
import confetti from 'canvas-confetti';

interface ExtractedSlide {
  index: number;
  title: string;
  paragraphs: string[];
  images: { name: string; base64: string; type: string }[];
}

interface PresentationData {
  filename: string;
  sizeFormatted: string;
  slides: ExtractedSlide[];
}

type PdfLayoutType = '16:9' | '4:3' | '2-up' | '3-up-notes';
type ColorThemeType = 'comic' | 'dark' | 'clean';

const SAMPLE_PRESENTATION: PresentationData = {
  filename: 'Biology_Lecture_Ch4.pptx',
  sizeFormatted: '1.2 MB',
  slides: [
    {
      index: 1,
      title: 'Cell Biology & Energy Production',
      paragraphs: [
        'Chapter 4: Cellular Respiration & Photosynthesis',
        'Instructor: Dr. Emily Watson',
        'Department of Biological Sciences'
      ],
      images: []
    },
    {
      index: 2,
      title: 'The Structure of the Cell',
      paragraphs: [
        'Plasma Membrane: Selectively permeable lipid bilayer controlling transport.',
        'Nucleus: Houses genomic DNA and coordinates cell activities.',
        'Cytoplasm: Jelly-like fluid where chemical reactions take place.',
        'Ribosomes: Protein synthesis factories found in all living cells.'
      ],
      images: []
    },
    {
      index: 3,
      title: 'Mitochondria: The Powerhouse',
      paragraphs: [
        'Generates most of the cell supply of Adenosine Triphosphate (ATP).',
        'Contains its own double membrane and mitochondrial DNA (mtDNA).',
        'Site of the Citric Acid Cycle (Krebs Cycle) and Oxidative Phosphorylation.',
        'Crucial for cellular metabolism and apoptosis signaling.'
      ],
      images: []
    },
    {
      index: 4,
      title: 'Summary & Key Exam Takeaways',
      paragraphs: [
        'Energy production occurs through glycolysis, Krebs cycle, and electron transport.',
        'Plant cells uniquely harness sunlight via chloroplasts and chlorophyll.',
        'Review Questions: Explain ATP yield differences between aerobic and anaerobic pathways.',
        'Next class: Genetics and Mendelian Inheritance.'
      ],
      images: []
    }
  ]
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function sanitizeText(str: string): string {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[^\x00-\x7F]/g, ' ')
    .trim();
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export const PptToPdf = () => {
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [layoutType, setLayoutType] = useState<PdfLayoutType>('16:9');
  const [colorTheme, setColorTheme] = useState<ColorThemeType>('comic');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsePptx = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setConversionProgress('Reading PowerPoint file...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      let zip: JSZip;
      try {
        zip = await JSZip.loadAsync(arrayBuffer);
      } catch (zipErr) {
        throw new Error(
          'Could not read this presentation file. If this is an older .ppt file (pre-2007 binary), please open it in Microsoft PowerPoint or Google Slides and save as .pptx.'
        );
      }

      setConversionProgress('Extracting slides & content...');

      // Find all slide XML files
      const slidePaths = Object.keys(zip.files).filter(name =>
        /^ppt\/slides\/slide\d+\.xml$/i.test(name)
      );

      if (slidePaths.length === 0) {
        throw new Error('No slides found in this PowerPoint file.');
      }

      // Sort numerically
      slidePaths.sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
        return numA - numB;
      });

      const extractedSlides: ExtractedSlide[] = [];
      const parser = new DOMParser();

      for (let i = 0; i < slidePaths.length; i++) {
        const slidePath = slidePaths[i];
        const slideXmlStr = await zip.files[slidePath].async('string');
        const xmlDoc = parser.parseFromString(slideXmlStr, 'application/xml');

        // Extract shapes and paragraphs
        let title = '';
        const paragraphs: string[] = [];

        // Check for placeholder title
        const shapeNodes = xmlDoc.getElementsByTagName('p:sp');
        for (let s = 0; s < shapeNodes.length; s++) {
          const sp = shapeNodes[s];
          const ph = sp.getElementsByTagName('p:ph')[0];
          const phType = ph ? ph.getAttribute('type') : null;
          const isTitleShape = phType === 'title' || phType === 'ctrTitle' || phType === 'subTitle';

          // Extract text runs
          const pNodes = sp.getElementsByTagName('a:p');
          const shapeTextLines: string[] = [];

          for (let p = 0; p < pNodes.length; p++) {
            const pNode = pNodes[p];
            const rNodes = pNode.getElementsByTagName('a:r');
            let pText = '';
            for (let r = 0; r < rNodes.length; r++) {
              const tNode = rNodes[r].getElementsByTagName('a:t')[0];
              if (tNode && tNode.textContent) {
                pText += tNode.textContent;
              }
            }

            // Also check <a:fld> for slide numbers or fields
            const fldNodes = pNode.getElementsByTagName('a:fld');
            for (let f = 0; f < fldNodes.length; f++) {
              const tNode = fldNodes[f].getElementsByTagName('a:t')[0];
              if (tNode && tNode.textContent) {
                pText += tNode.textContent;
              }
            }

            const cleanLine = sanitizeText(pText);
            if (cleanLine) {
              shapeTextLines.push(cleanLine);
            }
          }

          if (isTitleShape && shapeTextLines.length > 0 && !title) {
            title = shapeTextLines.join(' ');
          } else {
            paragraphs.push(...shapeTextLines);
          }
        }

        // Fallback: If no explicit title shape found, use first paragraph
        if (!title && paragraphs.length > 0) {
          title = paragraphs.shift() || `Slide ${i + 1}`;
        } else if (!title) {
          title = `Slide ${i + 1}`;
        }

        // Check relationships for embedded images
        const slideRelPath = slidePath.replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels';
        const images: { name: string; base64: string; type: string }[] = [];
        if (zip.files[slideRelPath]) {
          try {
            const relStr = await zip.files[slideRelPath].async('string');
            const relDoc = parser.parseFromString(relStr, 'application/xml');
            const relNodes = relDoc.getElementsByTagName('Relationship');

            for (let r = 0; r < relNodes.length; r++) {
              const rel = relNodes[r];
              const target = rel.getAttribute('Target') || '';
              if (target.includes('media/image')) {
                const mediaFilename = target.split('/').pop();
                const zipImgPath = 'ppt/media/' + mediaFilename;
                if (zip.files[zipImgPath]) {
                  const ext = mediaFilename?.split('.').pop()?.toLowerCase() || 'png';
                  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
                  const base64 = await zip.files[zipImgPath].async('base64');
                  images.push({
                    name: mediaFilename || 'image',
                    base64,
                    type: mime
                  });
                }
              }
            }
          } catch (relErr) {
            console.warn('Could not parse slide rels', relErr);
          }
        }

        extractedSlides.push({
          index: i + 1,
          title,
          paragraphs,
          images
        });
      }

      setPresentation({
        filename: file.name,
        sizeFormatted: formatBytes(file.size),
        slides: extractedSlides
      });
      setCurrentSlideIndex(0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while parsing the presentation.');
      setPresentation(null);
    } finally {
      setIsLoading(false);
      setConversionProgress('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parsePptx(file);
  };

  const loadSample = () => {
    setPresentation(SAMPLE_PRESENTATION);
    setCurrentSlideIndex(0);
    setError(null);
  };

  const generateAndDownloadPdf = async () => {
    if (!presentation || presentation.slides.length === 0) return;

    setIsLoading(true);
    setConversionProgress('Generating high-quality PDF...');

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Theme Colors
      let bgColor = rgb(0.98, 0.98, 0.99);
      let headerBarColor = rgb(0.12, 0.12, 0.14);
      let headerTextColor = rgb(1, 1, 1);
      let textColor = rgb(0.12, 0.12, 0.14);
      let bulletDotColor = rgb(0.12, 0.44, 0.94);
      let borderColor = rgb(0.12, 0.12, 0.14);
      let ruleLineColor = rgb(0.8, 0.82, 0.85);

      if (colorTheme === 'dark') {
        bgColor = rgb(0.12, 0.12, 0.14);
        headerBarColor = rgb(0.2, 0.22, 0.26);
        headerTextColor = rgb(1, 1, 1);
        textColor = rgb(0.95, 0.95, 0.96);
        bulletDotColor = rgb(0.98, 0.82, 0.25);
        borderColor = rgb(0.25, 0.27, 0.32);
        ruleLineColor = rgb(0.3, 0.32, 0.36);
      } else if (colorTheme === 'clean') {
        bgColor = rgb(1, 1, 1);
        headerBarColor = rgb(0.95, 0.95, 0.95);
        headerTextColor = rgb(0.1, 0.1, 0.1);
        textColor = rgb(0.15, 0.15, 0.15);
        bulletDotColor = rgb(0.4, 0.4, 0.4);
        borderColor = rgb(0.7, 0.7, 0.7);
        ruleLineColor = rgb(0.85, 0.85, 0.85);
      } else {
        // Comic theme
        bgColor = rgb(0.99, 0.99, 0.97);
        headerBarColor = rgb(0.12, 0.44, 0.94); // comic blue
        headerTextColor = rgb(1, 1, 1);
        textColor = rgb(0.12, 0.12, 0.14);
        bulletDotColor = rgb(0.93, 0.27, 0.27); // comic red
        borderColor = rgb(0.12, 0.12, 0.14);
        ruleLineColor = rgb(0.78, 0.8, 0.85);
      }

      if (layoutType === '16:9') {
        // 960 x 540 pt
        const width = 960;
        const height = 540;

        for (const slide of presentation.slides) {
          const page = pdfDoc.addPage([width, height]);
          // Background
          page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: bgColor
          });

          // Header banner
          page.drawRectangle({
            x: 0,
            y: height - 70,
            width,
            height: 70,
            color: headerBarColor
          });

          // Title
          const cleanTitle = sanitizeText(slide.title);
          page.drawText(cleanTitle.slice(0, 75), {
            x: 40,
            y: height - 46,
            size: 22,
            font: boldFont,
            color: headerTextColor
          });

          // Slide counter
          page.drawText(`Slide ${slide.index} of ${presentation.slides.length}`, {
            x: width - 150,
            y: height - 44,
            size: 13,
            font: boldFont,
            color: headerTextColor
          });

          // Content Box / Border
          page.drawRectangle({
            x: 40,
            y: 40,
            width: width - 80,
            height: height - 130,
            borderColor,
            borderWidth: 2,
            color: colorTheme === 'dark' ? rgb(0.16, 0.17, 0.2) : rgb(1, 1, 1)
          });

          // Draw Paragraphs & Bullets
          let yPos = height - 165;
          const maxLines = 11;
          let linesDrawn = 0;

          for (const para of slide.paragraphs) {
            if (linesDrawn >= maxLines) break;
            const lines = wrapText(para, 78);

            for (let l = 0; l < lines.length; l++) {
              if (linesDrawn >= maxLines) break;

              if (l === 0) {
                // Bullet dot
                page.drawCircle({
                  x: 70,
                  y: yPos + 4,
                  size: 3.5,
                  color: bulletDotColor
                });
              }

              page.drawText(lines[l], {
                x: 88,
                y: yPos,
                size: 14,
                font: l === 0 ? boldFont : font,
                color: textColor
              });

              yPos -= 24;
              linesDrawn++;
            }
            yPos -= 8; // spacing between paragraphs
          }

          // Footer
          page.drawText(sanitizeText(presentation.filename), {
            x: 50,
            y: 20,
            size: 10,
            font,
            color: grayscale(0.5)
          });
        }
      } else if (layoutType === '4:3') {
        // 720 x 540 pt
        const width = 720;
        const height = 540;

        for (const slide of presentation.slides) {
          const page = pdfDoc.addPage([width, height]);
          page.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });

          page.drawRectangle({
            x: 0,
            y: height - 65,
            width,
            height: 65,
            color: headerBarColor
          });

          page.drawText(sanitizeText(slide.title).slice(0, 55), {
            x: 35,
            y: height - 42,
            size: 20,
            font: boldFont,
            color: headerTextColor
          });

          page.drawText(`Slide ${slide.index} of ${presentation.slides.length}`, {
            x: width - 140,
            y: height - 40,
            size: 12,
            font: boldFont,
            color: headerTextColor
          });

          let yPos = height - 100;
          for (const para of slide.paragraphs.slice(0, 9)) {
            const lines = wrapText(para, 60);
            for (let l = 0; l < lines.length; l++) {
              if (l === 0) {
                page.drawCircle({ x: 45, y: yPos + 3, size: 3, color: bulletDotColor });
              }
              page.drawText(lines[l], {
                x: 60,
                y: yPos,
                size: 13,
                font: l === 0 ? boldFont : font,
                color: textColor
              });
              yPos -= 22;
            }
            yPos -= 6;
          }
        }
      } else if (layoutType === '2-up') {
        // A4 Portrait: 595.28 x 841.89 pt
        const width = 595.28;
        const height = 841.89;
        const slides = presentation.slides;

        for (let i = 0; i < slides.length; i += 2) {
          const page = pdfDoc.addPage([width, height]);
          page.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });

          // Page header
          page.drawText(`${sanitizeText(presentation.filename)} - Lecture Handout`, {
            x: 40,
            y: height - 35,
            size: 12,
            font: boldFont,
            color: textColor
          });
          page.drawText(`Page ${Math.floor(i / 2) + 1}`, {
            x: width - 85,
            y: height - 35,
            size: 10,
            font,
            color: textColor
          });

          // Draw up to 2 slides on this page
          for (let s = 0; s < 2; s++) {
            const slideIdx = i + s;
            if (slideIdx >= slides.length) break;
            const slide = slides[slideIdx];
            const slideTop = height - 60 - s * 370;

            // Slide box
            page.drawRectangle({
              x: 40,
              y: slideTop - 340,
              width: width - 80,
              height: 340,
              borderColor,
              borderWidth: 2,
              color: colorTheme === 'dark' ? rgb(0.16, 0.17, 0.2) : rgb(1, 1, 1)
            });

            // Slide Header
            page.drawRectangle({
              x: 40,
              y: slideTop - 45,
              width: width - 80,
              height: 45,
              color: headerBarColor
            });

            page.drawText(sanitizeText(slide.title).slice(0, 48), {
              x: 55,
              y: slideTop - 30,
              size: 15,
              font: boldFont,
              color: headerTextColor
            });

            page.drawText(`Slide ${slide.index}`, {
              x: width - 105,
              y: slideTop - 28,
              size: 11,
              font: boldFont,
              color: headerTextColor
            });

            // Slide Content
            let yPos = slideTop - 75;
            for (const para of slide.paragraphs.slice(0, 6)) {
              const lines = wrapText(para, 55);
              for (let l = 0; l < lines.length; l++) {
                if (l === 0) {
                  page.drawCircle({ x: 65, y: yPos + 3, size: 3, color: bulletDotColor });
                }
                page.drawText(lines[l], {
                  x: 78,
                  y: yPos,
                  size: 12,
                  font: l === 0 ? boldFont : font,
                  color: textColor
                });
                yPos -= 19;
              }
              yPos -= 5;
            }
          }
        }
      } else if (layoutType === '3-up-notes') {
        // A4 Portrait: 595.28 x 841.89 pt with Ruled Note Lines on right
        const width = 595.28;
        const height = 841.89;
        const slides = presentation.slides;

        for (let i = 0; i < slides.length; i += 3) {
          const page = pdfDoc.addPage([width, height]);
          page.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });

          // Document Header
          page.drawText(`${sanitizeText(presentation.filename)} - Lecture Notes`, {
            x: 35,
            y: height - 30,
            size: 11,
            font: boldFont,
            color: textColor
          });
          page.drawText(`Page ${Math.floor(i / 3) + 1}`, {
            x: width - 80,
            y: height - 30,
            size: 10,
            font,
            color: textColor
          });

          // Draw up to 3 slides with notes lines on right
          for (let s = 0; s < 3; s++) {
            const slideIdx = i + s;
            if (slideIdx >= slides.length) break;
            const slide = slides[slideIdx];
            const slideTop = height - 50 - s * 255;
            const slideWidth = 265;
            const slideHeight = 195;

            // Slide card on left
            page.drawRectangle({
              x: 35,
              y: slideTop - slideHeight,
              width: slideWidth,
              height: slideHeight,
              borderColor,
              borderWidth: 1.5,
              color: colorTheme === 'dark' ? rgb(0.16, 0.17, 0.2) : rgb(1, 1, 1)
            });

            // Slide mini banner
            page.drawRectangle({
              x: 35,
              y: slideTop - 32,
              width: slideWidth,
              height: 32,
              color: headerBarColor
            });

            page.drawText(sanitizeText(slide.title).slice(0, 28), {
              x: 45,
              y: slideTop - 22,
              size: 11,
              font: boldFont,
              color: headerTextColor
            });

            page.drawText(`${slide.index}`, {
              x: 35 + slideWidth - 20,
              y: slideTop - 20,
              size: 9,
              font: boldFont,
              color: headerTextColor
            });

            // Slide bullets
            let yPos = slideTop - 52;
            for (const para of slide.paragraphs.slice(0, 4)) {
              const lines = wrapText(para, 32);
              for (let l = 0; l < lines.length; l++) {
                if (l === 0) {
                  page.drawCircle({ x: 48, y: yPos + 3, size: 2.5, color: bulletDotColor });
                }
                page.drawText(lines[l], {
                  x: 58,
                  y: yPos,
                  size: 9,
                  font: l === 0 ? boldFont : font,
                  color: textColor
                });
                yPos -= 14;
              }
              yPos -= 3;
            }

            // Ruled Lecture Note Lines on Right
            const notesLeft = 325;
            const notesRight = width - 35;
            page.drawText('NOTES', {
              x: notesLeft,
              y: slideTop - 12,
              size: 9,
              font: boldFont,
              color: grayscale(0.5)
            });

            for (let l = 0; l < 7; l++) {
              const lineY = slideTop - 35 - l * 24;
              page.drawLine({
                start: { x: notesLeft, y: lineY },
                end: { x: notesRight, y: lineY },
                thickness: 0.8,
                color: ruleLineColor
              });
            }
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const baseName = presentation.filename.replace(/\.[^/.]+$/, '');
      link.download = `${baseName}_converted.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (pdfErr: any) {
      console.error('PDF creation error', pdfErr);
      setError('Error while rendering PDF. Please try a different layout or file.');
    } finally {
      setIsLoading(false);
      setConversionProgress('');
    }
  };

  const currentSlide = presentation?.slides[currentSlideIndex];

  return (
    <ToolLayout
      toolId="ppt-to-pdf"
      howItWorks={
        <div className="space-y-3">
          <p>
            Our PPT to PDF converter works <strong>100% inside your browser</strong>. It reads your
            PowerPoint (<code>.pptx</code>) file, extracts every slide's structure, titles, and
            bullet points, and generates a formatted, printable PDF document using vector rendering.
          </p>
          <ul className="list-disc list-inside space-y-1 font-bold text-gray-700">
            <li>Zero server uploads — total privacy for student lecture notes & coursework</li>
            <li>Multiple formats: 16:9 Widescreen, 4:3 Standard, 2-up Handout, or 3-up Lecture Notes with lined writing space</li>
            <li>Works completely offline without file size restrictions</li>
          </ul>
        </div>
      }
      faq={
        <div className="space-y-4">
          <div>
            <h3 className="font-display text-xl mb-1">What PowerPoint formats are supported?</h3>
            <p className="font-bold text-gray-600">
              Modern <code>.pptx</code> files created in Microsoft PowerPoint, Google Slides (File &gt; Download &gt; Microsoft PowerPoint), Apple Keynote, and LibreOffice are fully supported.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl mb-1">Can I print lecture handouts with note lines?</h3>
            <p className="font-bold text-gray-600">
              Yes! Select the <strong>"3 Slides + Notes Lines"</strong> layout to print traditional university-style handout pages with ruled notebook lines for your handwriting.
            </p>
          </div>
        </div>
      }
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-3xl mx-auto">
        {!presentation ? (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-comic-dark rounded-3xl p-8 sm:p-12 text-center bg-comic-light hover:bg-[#ebf0f5] transition-colors relative cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-comic-red border-[3px] border-comic-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[3px_3px_0px_#1E1E24]">
                  <Presentation className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl mb-1">Upload PowerPoint Presentation</p>
                  <p className="font-bold text-gray-500">
                    Drag & drop or tap to browse your <code>.pptx</code> file
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-comic-green/20 border-2 border-comic-dark rounded-full text-xs sm:text-sm font-bold text-comic-dark">
                  <CheckCircle2 size={16} className="text-comic-green" /> 100% Client-Side & Private
                </div>
              </div>
            </div>

            {/* Quick Demo Button */}
            <div className="text-center pt-2">
              <p className="font-bold text-gray-500 text-sm mb-3">Don't have a PPT file right now?</p>
              <button
                type="button"
                onClick={loadSample}
                className="comic-btn bg-comic-yellow text-comic-dark px-6 py-3 font-display text-lg inline-flex items-center gap-2"
              >
                <Sparkles size={20} /> Try with Sample Lecture PPT
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info Header Bar */}
            <div className="flex flex-wrap items-center justify-between p-4 border-2 border-comic-dark rounded-2xl bg-comic-light gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-comic-red border-2 border-comic-dark flex items-center justify-center shrink-0">
                  <Presentation className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg truncate" title={presentation.filename}>
                    {presentation.filename}
                  </h3>
                  <p className="text-xs font-bold text-gray-500">
                    {presentation.slides.length} slides • {presentation.sizeFormatted}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPresentation(null);
                    setError(null);
                  }}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border-2 border-comic-dark bg-white"
                  title="Remove file and upload another"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Layout & Style Customization Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Output Layout */}
              <div className="p-4 border-2 border-comic-dark rounded-xl bg-white space-y-2">
                <label className="font-bold text-sm flex items-center gap-2 text-gray-700">
                  <LayoutTemplate size={16} className="text-comic-blue" /> Output PDF Layout:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLayoutType('16:9')}
                    className={`p-2.5 rounded-lg border-2 border-comic-dark font-bold text-xs text-left transition-all ${
                      layoutType === '16:9' ? 'bg-comic-blue text-white shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    📺 16:9 Widescreen
                    <span className="block text-[10px] font-normal opacity-90">1 slide / page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayoutType('4:3')}
                    className={`p-2.5 rounded-lg border-2 border-comic-dark font-bold text-xs text-left transition-all ${
                      layoutType === '4:3' ? 'bg-comic-blue text-white shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    📽️ 4:3 Standard
                    <span className="block text-[10px] font-normal opacity-90">Classic slide size</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayoutType('2-up')}
                    className={`p-2.5 rounded-lg border-2 border-comic-dark font-bold text-xs text-left transition-all ${
                      layoutType === '2-up' ? 'bg-comic-blue text-white shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    📄 2-up Handout
                    <span className="block text-[10px] font-normal opacity-90">2 slides on A4</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayoutType('3-up-notes')}
                    className={`p-2.5 rounded-lg border-2 border-comic-dark font-bold text-xs text-left transition-all ${
                      layoutType === '3-up-notes' ? 'bg-comic-blue text-white shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    📝 3 Slides + Notes
                    <span className="block text-[10px] font-normal opacity-90">With ruled lines!</span>
                  </button>
                </div>
              </div>

              {/* Color Theme */}
              <div className="p-4 border-2 border-comic-dark rounded-xl bg-white space-y-2">
                <label className="font-bold text-sm flex items-center gap-2 text-gray-700">
                  <Layers size={16} className="text-comic-red" /> Color Theme:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setColorTheme('comic')}
                    className={`p-3 rounded-lg border-2 border-comic-dark font-bold text-xs flex flex-col items-center gap-1 ${
                      colorTheme === 'comic' ? 'bg-comic-yellow text-comic-dark shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-comic-blue border border-comic-dark"></span>
                    Comic Crisp
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('clean')}
                    className={`p-3 rounded-lg border-2 border-comic-dark font-bold text-xs flex flex-col items-center gap-1 ${
                      colorTheme === 'clean' ? 'bg-comic-green text-comic-dark shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white border border-comic-dark"></span>
                    Clean White
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('dark')}
                    className={`p-3 rounded-lg border-2 border-comic-dark font-bold text-xs flex flex-col items-center gap-1 ${
                      colorTheme === 'dark' ? 'bg-comic-dark text-white shadow-[2px_2px_0px_#1E1E24]' : 'bg-gray-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-gray-900 border border-white"></span>
                    Midnight Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Previewer */}
            {currentSlide && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg flex items-center gap-2 text-comic-dark">
                    <BookOpen size={20} className="text-comic-blue" /> Slide Preview ({currentSlideIndex + 1} of {presentation.slides.length})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                      className="p-1.5 rounded-lg border-2 border-comic-dark bg-white disabled:opacity-40 hover:bg-comic-yellow transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      disabled={currentSlideIndex === presentation.slides.length - 1}
                      onClick={() => setCurrentSlideIndex(prev => Math.min(presentation.slides.length - 1, prev + 1))}
                      className="p-1.5 rounded-lg border-2 border-comic-dark bg-white disabled:opacity-40 hover:bg-comic-yellow transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Simulated Slide Canvas */}
                <div className="comic-card-sm border-2 border-comic-dark rounded-2xl p-5 sm:p-6 bg-white min-h-[220px] shadow-[4px_4px_0px_#1E1E24] relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4 border-b-2 border-comic-dark/20 pb-3 mb-4">
                    <h4 className="font-display text-xl sm:text-2xl text-comic-dark leading-tight">
                      {currentSlide.title}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-comic-yellow border-2 border-comic-dark font-display text-xs shrink-0">
                      #{currentSlide.index}
                    </span>
                  </div>

                  {currentSlide.paragraphs.length > 0 ? (
                    <ul className="space-y-2.5 font-bold text-gray-700 text-sm sm:text-base">
                      {currentSlide.paragraphs.map((para, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-comic-red mt-2 shrink-0"></span>
                          <span>{para}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic font-bold py-6 text-center">
                      (Title slide or graphic content)
                    </p>
                  )}
                </div>

                {/* Slide Thumbnail Pager */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {presentation.slides.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg border-2 border-comic-dark font-bold text-xs whitespace-nowrap transition-colors shrink-0 ${
                        idx === currentSlideIndex ? 'bg-comic-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Slide {s.index}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              onClick={generateAndDownloadPdf}
              disabled={isLoading}
              className="comic-btn comic-btn-primary w-full py-4 text-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
            >
              <Download size={24} /> Convert & Download PDF
            </button>
          </div>
        )}

        {/* Loading Overlay / Progress */}
        {isLoading && (
          <div className="mt-6 text-center">
            <div className="font-bold text-comic-blue animate-pulse text-lg flex items-center justify-center gap-2">
              <Presentation className="animate-bounce" size={20} />
              {conversionProgress || 'Processing presentation...'}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 border-2 border-comic-dark rounded-xl bg-red-50 text-comic-red font-bold flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Security / Privacy Footer */}
        <div className="mt-8 text-sm font-bold text-comic-green flex items-center justify-center gap-2 border-t-[3px] border-comic-dark pt-6 text-center">
          <CheckCircle2 size={18} /> Processed 100% locally in your browser. No files uploaded to any server.
        </div>
      </div>
    </ToolLayout>
  );
};
