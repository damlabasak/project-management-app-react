import React from 'react';
import PDFPreview from './PDFPreview';

export default function FilePreview({ fileUrl, fileType }) {
    if (fileType && fileType.startsWith('image/')) {
        return <img src={fileUrl} alt="Preview" />;
    } else if (fileType === 'application/pdf') {
        return <PDFPreview pdfUrl={fileUrl} />;
    } else {
        return <p>File cannot be previewed</p>;
    }
}
