import React from 'react';

export default function PDFPreview({ pdfUrl }) {
  return (
    <iframe
      title="PDF Preview"
      src={pdfUrl}
      width="100%"
      height="500px"
      style={{ border: 'none' }}
    />
  );
}
