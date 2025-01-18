'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"

import { Upload } from 'lucide-react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { useRouter } from 'next/navigation'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

type TaxData = {
  totalSalary: number;
  hra: number;
  totalExemptions: number;
  deductions: number;
  standardDeductions: number;
  taxableIncome: number;
  totalTax: number;
  lta: number;
};

interface ParsedResult {
  ParsedText: string;
}

interface OCRResponse {
  ParsedResults: ParsedResult[];
}

export default function FileUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('')
  const router = useRouter();

  // Function to handle file change and upload PDF to OCR.space
  const onDrop = async (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploading(true) // Set initial progress
      setProcessingMessage('Uploading file...')

      try {
        // Load the PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Get the total number of pages in the PDF
        const totalPages = pdfDoc.getPages().length;

        // Create a new PDF document
        const newPdfDoc = await PDFDocument.create();

        // Copy the first 3 pages (or fewer if the PDF has less than 3 pages)
        const pagesToCopy = Math.min(totalPages, 3);
        for (let i = 0; i < pagesToCopy; i++) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
          newPdfDoc.addPage(copiedPage);
        }

        // Save the new PDF as a byte array
        const newPdfBytes = await newPdfDoc.save();
        const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' });

        // Create a FormData object for the modified PDF
        const formData = new FormData();
        formData.append('apikey', API_KEY!);
        formData.append('language', 'eng');
        formData.append('isTable', true.toString());

        // Create a File object with the correct file extension
        const newPdfFile = new File([newPdfBlob], 'modified.pdf', { type: 'application/pdf' });
        formData.append('file', newPdfFile); // Append the new File

        // Make API call to OCR.space
        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.IsErroredOnProcessing) {
          console.error('Error during OCR processing:', response.data.ErrorMessage);
        } else {
          // setUploading(false);
          const text = (response.data as OCRResponse).ParsedResults
            .map((result) => result.ParsedText)
            .join('\n');

          const { totalSalary, lta, hra, totalExemptions, deductions, standardDeductions, taxableIncome, totalTax } = parseForm16(text);

          // Prepare the data to be added to the query params
          const params = {
            totalSalary,
            hra,
            lta,
            totalExemptions,
            deductions,
            standardDeductions,
            taxableIncome,
            totalTax,
          };

          // Create URLSearchParams by iterating over the `params` object
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            // Only add the key-value pair if the value is not undefined or null
            if (value != null) {
              queryParams.append(key, value.toString());
            }
          });

          // Simulate file upload and analysis
          setTimeout(() => {
            setProcessingMessage('Analyzing your tax data...')
            setTimeout(() => {
              router.push(`/results?${queryParams}`);
            }, 2000)
          }, 2000)


        }
      } catch (error) {
        console.error('OCR API request failed:', error);
        setUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // Helper function to extract value using regex
  const extractValue = (content: string, pattern: RegExp): number => {
    const match = content.match(pattern);
    if (match && match[1]) {
      return parseFloat(match[1].replace(/,/g, '')) || 0;
    }
    return 0;
  };

  // Main parser function
  const parseForm16 = (content: string): TaxData => {
    // Regex patterns for different fields
    const patterns = {
      totalSalary: /17\(1\)\s+(\d+\.\d{2})/,
      hra: /\(13A\)\s+(\d+\.\d{2})/,
      lta: /(?:IO\(S\)|10\(5\))\s+(\d+\.\d{2})/,
      totalExemptions: /Total amount of exemption claimed under section 10\s+(\d+\.\d{2})/,
      deductions: /80CCD\(I\)\s+(\d+\.\d{2})/,
      standardDeductions: /16\(1a\)\s+(\d+\.\d{2})/,
      taxableIncome: /\(9-11\)\s+(\d+\.\d{2})/,
      totalTax: /\(17-18\)\s+(\d+\.\d{2})/
    };

    return {
      totalSalary: extractValue(content, patterns.totalSalary),
      hra: extractValue(content, patterns.hra),
      lta: extractValue(content, patterns.lta),
      totalExemptions: extractValue(content, patterns.totalExemptions),
      deductions: extractValue(content, patterns.deductions),
      standardDeductions: extractValue(content, patterns.standardDeductions),
      taxableIncome: extractValue(content, patterns.taxableIncome),
      totalTax: extractValue(content, patterns.totalTax)
    };
  };

  return (
    <Card className="w-full rounded-3xl border-none shadow-none">
      <div className="space-y-6 p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-blue-400 bg-blue-400/10' : 'border-gray-300 hover:border-[#F58C98]'
            }`}
        >
          <input type="file" accept="application/pdf" {...getInputProps()} />
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-[#F48087]" />
            <p className="text-lg">
              {isDragActive
                ? "Drop your Form 16 here"
                : "Drag 'n' drop your Form 16, or click to select"}
            </p>
          </div>
          {uploading && (
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F48087] to-[#FFA42C] animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <p className="mt-2 text-gray-500 font-thin">{processingMessage}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
