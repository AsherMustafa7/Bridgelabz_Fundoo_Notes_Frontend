import React, { useState, useRef } from 'react';
import { uploadExcelNotes, runBatchProcessingJob } from '../services/batchService';

export const BatchImportPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [jobResult, setJobResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.xlsx')) {
        setError('Only .xlsx Excel files are supported');
        setFile(null);
        return;
      }
      setFile(selected);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Excel (.xlsx) file first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await uploadExcelNotes(file);
      setResult(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to process Excel batch import';
      setError(typeof msg === 'string' ? msg : 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleRunBatchJob = async () => {
    setBatchRunning(true);
    setError('');
    setJobResult(null);

    try {
      const data = await runBatchProcessingJob();
      setJobResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to run Spring Batch job';
      setError(typeof msg === 'string' ? msg : 'Error executing batch job');
    } finally {
      setBatchRunning(false);
    }
  };

  return (
    <div className="batch-page">
      <div className="page-header">
        <h2 className="page-title">Spring Batch Operations</h2>
        <p className="page-subtext">
          Bulk import notes from Excel spreadsheets (.xlsx) and trigger background chunk processing jobs.
        </p>
      </div>

      {error && <div className="alert-banner alert-error">{error}</div>}

      <div className="batch-cards-container">
        {/* Card 1: Excel File Upload */}
        <div className="batch-card">
          <div className="batch-card-header">
            <div className="batch-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#0F9D58">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
            </div>
            <div>
              <h3>Excel Notes Import</h3>
              <p>Upload an .xlsx file containing columns: Title, Description</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="batch-upload-form">
            <div
              className={`dropzone ${file ? 'dropzone-active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx"
                style={{ display: 'none' }}
              />
              <svg viewBox="0 0 24 24" width="36" height="36" fill="#80868b">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <p className="dropzone-text">
                {file ? (
                  <strong>Selected: {file.name}</strong>
                ) : (
                  'Click to select an .xlsx Excel spreadsheet'
                )}
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !file}
            >
              {loading ? 'Processing Import...' : 'Upload & Import Notes'}
            </button>
          </form>

          {result && (
            <div className="batch-result-badge">
              <div className="badge-row">
                <span className="badge-label">Job:</span>
                <span className="badge-val">{result.jobName || 'excelNoteImportJob'}</span>
              </div>
              <div className="badge-row">
                <span className="badge-label">Execution ID:</span>
                <span className="badge-val">{result.executionId}</span>
              </div>
              <div className="badge-row">
                <span className="badge-label">Status:</span>
                <span className={`badge-status status-${(result.status || '').toLowerCase()}`}>
                  {result.status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Manual Batch Job Execution */}
        <div className="batch-card">
          <div className="batch-card-header">
            <div className="batch-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="#4285F4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div>
              <h3>Execute Batch Processing Job</h3>
              <p>Trigger Spring Batch chunk job (ItemReader, ItemProcessor, ItemWriter)</p>
            </div>
          </div>

          <p className="batch-desc-text">
            Manually launches the background chunk processor configured in Spring Batch
            to read, validate, and write note items with execution logging.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunBatchJob}
            disabled={batchRunning}
          >
            {batchRunning ? 'Running Job...' : 'Run noteProcessingJob'}
          </button>

          {jobResult && (
            <div className="batch-result-badge">
              <div className="badge-row">
                <span className="badge-label">Job:</span>
                <span className="badge-val">{jobResult.jobName}</span>
              </div>
              <div className="badge-row">
                <span className="badge-label">Execution ID:</span>
                <span className="badge-val">{jobResult.executionId}</span>
              </div>
              <div className="badge-row">
                <span className="badge-label">Status:</span>
                <span className={`badge-status status-${(jobResult.status || '').toLowerCase()}`}>
                  {jobResult.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchImportPage;
