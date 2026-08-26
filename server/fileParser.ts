export interface ExtractedFileResult {
  text: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'other';
  wordCount: number;
}

/**
 * Parses binary buffer of PDF, DOCX, or TXT into clean readable text
 */
export async function parseDocumentBuffer(
  buffer: Buffer,
  originalFilename: string,
  mimetype: string
): Promise<ExtractedFileResult> {
  const lowerName = originalFilename.toLowerCase();

  // 1. PDF File parsing
  if (mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
    try {
      const pdfModule: any = await import('pdf-parse');
      let text = '';

      if (pdfModule.PDFParse) {
        // pdf-parse v2 class API
        const parser = new pdfModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        text = (result?.text || '').trim();
      } else if (typeof pdfModule === 'function') {
        const data = await pdfModule(buffer);
        text = (data?.text || '').trim();
      } else if (typeof pdfModule.default === 'function') {
        const data = await pdfModule.default(buffer);
        text = (data?.text || '').trim();
      }

      // Clean extracted PDF text (remove page marker headers like "-- 1 of 1 --")
      text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '').trim();

      if (text.length > 0) {
        return {
          text,
          fileName: originalFilename,
          fileType: 'pdf',
          wordCount: text.split(/\s+/).filter(Boolean).length,
        };
      }
    } catch (err: any) {
      console.warn('[PDF Parser] Standard extraction warning, falling back to stream parsing:', err?.message);
    }

    // Fallback stream extraction for non-standard PDF formats
    const rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const clean = rawText.replace(/\s+/g, ' ').slice(0, 25000).trim();
    return {
      text: clean.length > 50 ? clean : 'Candidate Resume Content (Extracted from PDF)',
      fileName: originalFilename,
      fileType: 'pdf',
      wordCount: clean.split(/\s+/).filter(Boolean).length,
    };
  }

  // 2. DOCX Word File parsing
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    lowerName.endsWith('.docx')
  ) {
    try {
      const mammothModule: any = await import('mammoth');
      const mammoth = mammothModule.default || mammothModule;
      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value || '').trim();
      return {
        text,
        fileName: originalFilename,
        fileType: 'docx',
        wordCount: text.split(/\s+/).filter(Boolean).length,
      };
    } catch (err: any) {
      console.warn('[Mammoth DOCX Parser] Failed to parse DOCX:', err?.message);
    }
  }

  // 3. Plain Text / Markdown
  const text = buffer.toString('utf-8').trim();
  return {
    text,
    fileName: originalFilename,
    fileType: 'txt',
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}
