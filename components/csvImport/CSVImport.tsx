'use client';
import React, { useState, useRef } from 'react';
import Button from '../button/Button';
import LoadingIcon from '../../assets/icons/loadingIcon';

interface DiscoveredBusiness {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  companyWebsite: string;
  industry: string;
  score: number;
  userId: string;
  serviceNeeds: string[];
  value: number;
}

interface CSVImportProps {
  onImport: (businesses: DiscoveredBusiness[]) => void;
  onClose: () => void;
}

export const CSVImport: React.FC<CSVImportProps> = ({ onImport, onClose }) => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<DiscoveredBusiness[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setCSVFile(file);
    setError(null);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target?.result as string;
      
      try {
        setLoading(true);
        const response = await fetch('/api/import/csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvData })
        });

        if (!response.ok) {
          throw new Error('Failed to parse CSV');
        }

        const data = await response.json();
        setPreview(data.businesses.slice(0, 5)); // Show first 5 for preview
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvFile) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        
        const response = await fetch('/api/import/csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvData })
        });

        if (!response.ok) {
          throw new Error('Failed to import CSV');
        }

        const data = await response.json();
        onImport(data.businesses);
        onClose();
      };

      reader.readAsText(csvFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,company,email,phone,location,website,industry,services,value
John Doe,Acme Corp,john@acme.com,555-1234,New York NY,acme.com,Retail,"Website Design,SEO",10000
Jane Smith,Tech Startup,jane@techstartup.com,555-5678,San Francisco CA,techstartup.com,Technology,"Mobile App,Branding",25000`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Import Businesses from CSV</h2>
          <button
            onClick={onClose}
            className="opacity-[0.6] hover:opacity-[0.6] text-2xl"
          >
            ×
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Download the template CSV file below</li>
            <li>Fill in your business data (or export from LinkedIn, Yellow Pages, etc.)</li>
            <li>Upload the completed CSV file</li>
            <li>Review the preview and click Import</li>
          </ol>
          <button
            onClick={downloadTemplate}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            📥 Download CSV Template
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            {csvFile ? (
              <div>
                <p className="text-green-600 font-semibold">📄 {csvFile.name}</p>
                <p className="text-sm opacity-[0.6] mt-1">Click to select a different file</p>
              </div>
            ) : (
              <div>
                <p className="opacity-[0.6] font-semibold">Click to select CSV file</p>
                <p className="text-sm text-gray/ mt-1">or drag and drop</p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Preview (first 5 rows):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium opacity-[0.6] uppercase">Company</th>
                    <th className="px-3 py-2 text-left text-xs font-medium opacity-[0.6] uppercase">Contact</th>
                    <th className="px-3 py-2 text-left text-xs font-medium opacity-[0.6] uppercase">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-medium opacity-[0.6] uppercase">Website</th>
                    <th className="px-3 py-2 text-left text-xs font-medium opacity-[0.6] uppercase">Industry</th>
                    <th className="px-3 py-2 text-left text-xs font-medium opacity-[0.6] uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200">
                  {preview.map((business, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">{business.company}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{business.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600">{business.email}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-blue-600">{business.companyWebsite}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{business.industry}</td>
                      <td className="px-3 py-2 whitespace-nowrap">${business.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!csvFile || loading}
          >
            {loading ? (
              <>
                <LoadingIcon /> Processing...
              </>
            ) : (
              `Import ${preview.length > 0 ? `(${preview.length}+ businesses)` : ''}`
            )}
          </Button>
        </div>

        {/* Column Mapping Guide */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Supported CSV Columns:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs opacity-[0.6]">
            <div><strong>name</strong> or contact, contact name</div>
            <div><strong>company</strong> or business, business name</div>
            <div><strong>email</strong> or email address</div>
            <div><strong>phone</strong> or telephone, phone number</div>
            <div><strong>location</strong> or city, address, state</div>
            <div><strong>website</strong> or url, company website</div>
            <div><strong>industry</strong> or category, type</div>
            <div><strong>services</strong> or needs, service needs</div>
            <div><strong>value</strong> or budget</div>
            <div><strong>score</strong> (optional)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
