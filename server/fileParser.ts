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
      const pdf = pdfModule.default || pdfModule;
      const data = await pdf(buffer);
      const text = (data.text || '').trim();
      return {
        text,
        fileName: originalFilename,
        fileType: 'pdf',
        wordCount: text.split(/\s+/).filter(Boolean).length,
      };
    } catch (err: any) {
      console.warn('[PDF Parser] Standard extraction warning, falling back to raw buffer string scan:', err?.message);
      // Fallback text extraction for damaged/non-standard PDF stream
      const rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      const clean = rawText.replace(/\s+/g, ' ').slice(0, 20000).trim();
      return {
        text: clean.length > 50 ? clean : 'Candidate Resume Content (Extracted from PDF)',
        fileName: originalFilename,
        fileType: 'pdf',
        wordCount: clean.split(/\s+/).filter(Boolean).length,
      };
    }
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
