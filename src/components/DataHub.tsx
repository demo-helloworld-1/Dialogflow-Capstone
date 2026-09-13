import React, { useState } from 'react';
import { 
  FolderDown, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Code2, 
  FileSpreadsheet, 
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { SampleDataAsset } from '../types';
import { SAMPLE_DATA_ASSETS } from '../data/curriculumData';

interface DataHubProps {
  initialSelectedFile?: string;
  onSelectTaskById?: (taskId: string) => void;
}

export const DataHub: React.FC<DataHubProps> = ({
  initialSelectedFile,
  onSelectTaskById
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    initialSelectedFile 
      ? SAMPLE_DATA_ASSETS.find(a => a.filename === initialSelectedFile)?.id || SAMPLE_DATA_ASSETS[0].id
      : SAMPLE_DATA_ASSETS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredAssets = SAMPLE_DATA_ASSETS.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAsset = SAMPLE_DATA_ASSETS.find(a => a.id === selectedAssetId) || SAMPLE_DATA_ASSETS[0];

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'csv':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'python':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'javascript':
        return 'bg-yellow-950 text-yellow-400 border-yellow-800';
      case 'yaml':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'html':
        return 'bg-sky-950 text-sky-400 border-sky-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800/50">
                Sample Data Hub
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                6 Readily Consumable Assets
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              Sample Data Files & Backend Code Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              One-click access to CSV entity files, OpenAPI specifications, Cloud Function webhooks, and testing artifacts.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search sample files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Quick Download All / Info */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span>All sample files are formatted for instant ingestion into Google Cloud Console and Dialogflow CX.</span>
        </div>
      </div>

      {/* Grid: Left List + Right Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Asset Selection List */}
        <div className="space-y-2">
          {filteredAssets.map(asset => {
            const isSelected = asset.id === selectedAssetId;

            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-950/40 text-white'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${getBadgeColor(asset.fileType)}`}>
                      {asset.fileType}
                    </span>
                    <h3 className="text-xs font-semibold text-white truncate">
                      {asset.filename}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {asset.title}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {asset.size}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Full Code & Content Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          {/* Viewer Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getBadgeColor(selectedAsset.fileType)}`}>
                  {selectedAsset.filename}
                </span>
                <h2 className="text-sm font-bold text-white">
                  {selectedAsset.title}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedAsset.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id={`btn-copy-asset-${selectedAsset.id}`}
                onClick={() => handleCopy(selectedAsset.content, selectedAsset.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition"
              >
                {copiedId === selectedAsset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Content</span>
                  </>
                )}
              </button>

              <button
                id={`btn-download-asset-${selectedAsset.id}`}
                onClick={() => handleDownload(selectedAsset.filename, selectedAsset.content)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white flex items-center gap-1.5 shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="flex-1 bg-slate-950 p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-200 leading-relaxed">
              <code>{selectedAsset.content}</code>
            </pre>
          </div>

          {/* Quick task jump */}
          {selectedAsset.relatedTaskId && onSelectTaskById && (
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Related Task Guide:</span>
              <button
                onClick={() => onSelectTaskById(selectedAsset.relatedTaskId)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Jump to Task Implementation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
