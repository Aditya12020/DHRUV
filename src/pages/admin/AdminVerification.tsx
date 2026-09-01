import React, { useState, useEffect } from 'react';
import { Check, X, Eye, FileText, Download, AlertCircle, RefreshCw } from 'lucide-react';
import apiClient from '@/api/client';
import type { Publication } from '@/types';

export default function AdminVerification() {
  const [dbPending, setDbPending] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/publications/pending');
      if (res.data.success) {
        setDbPending(res.data.data.publications || []);
      }
    } catch (err) {
      console.error('Failed to load pending publications for admin verification:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    setMsg(null);
    try {
      const res = await apiClient.patch(`/publications/${id}/status`, { status: 'APPROVED' });
      if (res.data.success) {
        setMsg('Research paper approved and published successfully to the scientific repository.');
        fetchPending();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve paper.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionModalId) return;
    setActionLoading(true);
    setMsg(null);
    try {
      const res = await apiClient.patch(`/publications/${rejectionModalId}/status`, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim() || 'Submission does not meet publication criteria.',
      });
      if (res.data.success) {
        setMsg('Research paper marked for revision.');
        setRejectionModalId(null);
        setRejectionReason('');
        fetchPending();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject paper.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-ink p-4 sm:p-6 lg:p-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-line">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
            Editorial Review Board
          </span>
          <h1 className="text-2xl font-serif font-bold text-ink mt-1">Research Paper Verification Queue</h1>
          <p className="text-xs text-ink-light mt-0.5">Evaluate researcher manuscript submissions before authorization into the public repository.</p>
        </div>
        <button
          onClick={fetchPending}
          className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} className="text-forest-600 hover:text-ink font-semibold">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['pending', 'all'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors border ${
              filterStatus === st
                ? 'bg-forest-600 text-white border-forest-600 font-semibold shadow-xs'
                : 'bg-white text-ink-light border-line hover:bg-canvas-subtle'
            }`}
          >
            <span className="capitalize">{st} Submissions</span>
            <span className="bg-canvas-subtle text-ink px-1.5 py-0.2 rounded text-[10px] font-mono border border-line/60">{dbPending.length}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-line overflow-hidden shadow-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead className="bg-canvas-subtle text-ink-light text-[11px] uppercase font-semibold border-b border-line">
            <tr>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Manuscript Title</th>
              <th className="p-3.5">Submitter &amp; Institution</th>
              <th className="p-3.5">Domain</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5 text-right">Editorial Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-line/70">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-light">Loading pending verification queue...</td>
              </tr>
            ) : dbPending.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-faint">
                  No research papers currently awaiting verification.
                </td>
              </tr>
            ) : (
              dbPending.map((paper) => (
                <React.Fragment key={paper.id}>
                  <tr className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-canvas-subtle border border-line px-2 py-0.5 rounded text-[10px] text-ink-light font-medium">
                        <FileText className="w-3 h-3 text-forest-600" />
                        <span>Paper</span>
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div
                        className="font-serif font-bold text-ink cursor-pointer hover:text-forest-700 transition-colors line-clamp-2"
                        onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}
                      >
                        {paper.title}
                      </div>
                      <div className="text-[11px] text-ink-light mt-0.5">Authors: {paper.authors.join(', ')}</div>
                    </td>
                    <td className="p-3.5 text-ink-light">
                      <div className="font-semibold text-ink">{paper.user?.name || paper.institution}</div>
                      <div className="text-[11px] text-ink-faint">{paper.user?.email || paper.institution}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] bg-canvas-subtle text-ink-light border border-line px-2 py-0.5 rounded">
                        {paper.domain}
                      </span>
                    </td>
                    <td className="p-3.5 text-ink-light">
                      {new Date(paper.publishedDate || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}
                          className="p-1.5 text-ink-light hover:text-ink hover:bg-canvas-subtle rounded transition-colors"
                          title="Preview Abstract & Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {paper.pdfUrl && (
                          <a
                            href={paper.pdfUrl.startsWith('http') ? paper.pdfUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${paper.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-ink-light hover:text-forest-700 hover:bg-canvas-subtle rounded transition-colors"
                            title="Download PDF Document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleApprove(paper.id)}
                          disabled={actionLoading}
                          className="px-2.5 py-1 bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Approve & Publish"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectionModalId(paper.id);
                            setRejectionReason('');
                          }}
                          disabled={actionLoading}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Reject / Request Revision"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Content View */}
                  {expandedId === paper.id && (
                    <tr className="bg-canvas-subtle/70 border-t border-line">
                      <td colSpan={6} className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-forest-700">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Manuscript &amp; Abstract Preview
                          </span>
                          <span>Year: {paper.year} | Region: {paper.region}</span>
                        </div>

                        <div className="bg-white border border-line rounded p-4 text-xs text-ink space-y-3 shadow-subtle">
                          <div>
                            <span className="text-[11px] text-ink-faint font-semibold uppercase block">Abstract</span>
                            <p className="mt-1 leading-relaxed text-ink">{paper.abstract}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-line/60">
                            <div>
                              <span className="text-ink-faint">Institution:</span>{' '}
                              <span className="text-ink font-medium">{paper.institution}</span>
                            </div>
                            <div>
                              <span className="text-ink-faint">Journal / Proceedings:</span>{' '}
                              <span className="text-ink font-medium">{paper.journal || 'N/A'}</span>
                            </div>
                            {paper.doi && (
                              <div>
                                <span className="text-ink-faint">DOI:</span>{' '}
                                <span className="text-forest-700 font-mono">{paper.doi}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-ink-faint">Keywords:</span>{' '}
                              <span className="text-ink">{paper.keywords.join(', ')}</span>
                            </div>
                          </div>

                          {paper.pdfUrl && (
                            <div className="pt-2">
                              <a
                                href={paper.pdfUrl.startsWith('http') ? paper.pdfUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${paper.pdfUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-forest-700 hover:underline font-semibold"
                              >
                                <Download className="w-3.5 h-3.5" /> View Manuscript PDF Document
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-white border border-line rounded max-w-lg w-full p-6 space-y-4 shadow-modal">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-serif font-bold text-ink flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" /> Request Revisions / Reject Submission
              </h3>
              <button onClick={() => setRejectionModalId(null)} className="text-ink-light hover:text-ink">✕</button>
            </div>

            <p className="text-xs text-ink-light">
              Provide specific editorial feedback for the researcher. This message will be displayed on their workspace dashboard.
            </p>

            <textarea
              rows={4}
              placeholder="Specify formatting issues, missing data citations, or methodological clarifications required..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-canvas-subtle border border-line rounded p-3 text-xs text-ink outline-none focus:border-red-600"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalId(null)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="btn-primary bg-red-700 hover:bg-red-800 border-red-700 text-xs"
              >
                {actionLoading ? 'Saving...' : 'Send Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
