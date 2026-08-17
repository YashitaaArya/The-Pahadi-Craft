import React, { useState } from 'react';
import { Download, UploadCloud, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { downloadProductTemplate, bulkImportProducts, BulkImportResult } from '../../api/adminApi';
import { Modal, showSuccess, showError } from './common';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void; // called after a successful import so the product list refreshes
}

const BulkProductUpload: React.FC<Props> = ({ isOpen, onClose, onImported }) => {
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      await downloadProductTemplate();
    } catch (err: any) {
      showError('Failed to download template');
    } finally {
      setDownloading(false);
    }
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const res = await bulkImportProducts(file);
      setResult(res);
      if (res.successCount > 0) {
        showSuccess(`Added ${res.successCount} product${res.successCount !== 1 ? 's' : ''}`);
        onImported();
      }
      if (res.failCount > 0 && res.successCount === 0) {
        showError(`All ${res.failCount} row(s) had errors - see details below`);
      }
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to import the file');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Products" size="lg">
      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            For listing many products at once. Download the template, fill in one row per product
            (photos are added separately afterward, from each product's edit screen), then upload it here.
          </p>
          <button
            onClick={handleDownloadTemplate}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 border border-[#C9A66B] text-[#5A4232] rounded-lg text-sm hover:bg-[#F5E9DA] disabled:opacity-50"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {downloading ? 'Preparing...' : 'Download Template (.xlsx)'}
          </button>
        </div>

        <div className="border-t pt-5">
          <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            {uploading ? (
              <>
                <Loader2 size={28} className="animate-spin text-[#C9A66B]" />
                <span className="text-sm text-gray-600">Processing your file...</span>
              </>
            ) : (
              <>
                <UploadCloud size={28} className="text-[#C9A66B]" />
                <span className="text-sm text-gray-600">Click to upload your filled-in spreadsheet</span>
                <span className="text-xs text-gray-400">.xlsx or .csv, up to 2000 rows</span>
              </>
            )}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                handleFileSelected(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
        </div>

        {result && (
          <div className="border-t pt-5">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">{result.successCount} added</span>
              </div>
              {result.failCount > 0 && (
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle size={18} />
                  <span className="text-sm font-medium">{result.failCount} skipped</span>
                </div>
              )}
              <span className="text-xs text-gray-400">({result.totalRows} rows total)</span>
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">Row</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((e, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-2 text-gray-500">{e.row}</td>
                        <td className="px-3 py-2 text-red-600">{e.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {result.errors.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Fix these rows in your spreadsheet and upload again. If a row has an SKU filled in, re-uploading
                it a second time won't create a duplicate - it'll just be skipped as already existing. Rows
                without an SKU aren't checked for duplicates, so avoid re-uploading rows that already succeeded.
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BulkProductUpload;