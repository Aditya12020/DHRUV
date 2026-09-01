import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, UploadCloud, Clock, CheckCircle2, XCircle, AlertCircle,
  Eye, Download, Trash2, Edit3, Search, Filter, Plus, FileCode,
  BookOpen, RefreshCw, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';
import type { Publication, PublicationStatus, Region } from '@/types';

const REGIONS: Region[] = ['Arctic', 'Antarctic', 'Both', 'Southern Ocean', 'Sub-Antarctic'];
const DOMAINS = [
  'Glaciology',
  'Atmospheric Science',
  'Oceanography',
  'Polar Geophysics',
  'Marine Biology',
  'Climate Modeling',
  'Biogeochemistry',
  'Polar Ecology',
];

interface PaperStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function ResearcherDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'my-papers' | 'upload' | 'pending' | 'approved' | 'rejected'>('overview');

  // Papers data & loading states
  const [papers, setPapers] = useState<Publication[]>([]);
  const [stats, setStats] = useState<PaperStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('All');

  // Modals & Detail views
  const [selectedPaper, setSelectedPaper] = useState<Publication | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Upload Form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAbstract, setUploadAbstract] = useState('');
  const [uploadAuthors, setUploadAuthors] = useState(user?.name || '');
  const [uploadInstitution, setUploadInstitution] = useState(user?.institution || '');
  const [uploadDomain, setUploadDomain] = useState(DOMAINS[0]);
  const [uploadRegion, setUploadRegion] = useState<Region>('Antarctic');
  const [uploadKeywords, setUploadKeywords] = useState('');
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear().toString());
  const [uploadDoi, setUploadDoi] = useState('');
  const [uploadJournal, setUploadJournal] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch papers from API
  const fetchMyPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/publications/my');
      if (res.data.success) {
        setPapers(res.data.data.publications || []);
        setStats(res.data.data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    } catch (err: any) {
      console.error('Error fetching researcher publications:', err);
      setError(err.response?.data?.message || 'Failed to load research papers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPapers();
  }, []);

  // Update tab based on route query parameter or state
  useEffect(() => {
    if (location.pathname.endsWith('/upload')) {
      setActiveTab('upload');
    }
  }, [location.pathname]);

  // Filtered papers list
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesTab =
        activeTab === 'overview' ||
        activeTab === 'my-papers' ||
        (activeTab === 'pending' && paper.status === 'PENDING') ||
        (activeTab === 'approved' && paper.status === 'APPROVED') ||
        (activeTab === 'rejected' && paper.status === 'REJECTED');

      const matchesSearch =
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        paper.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = filterDomain === 'All' || paper.domain === filterDomain;

      return matchesTab && matchesSearch && matchesDomain;
    });
  }, [papers, activeTab, searchQuery, filterDomain]);

  // Handle PDF file drop / selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFormError('Only PDF documents (.pdf) are accepted.');
      setPdfFile(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setFormError('File size exceeds maximum limit of 50MB.');
      setPdfFile(null);
      return;
    }

    setFormError(null);
    setPdfFile(file);
  };

  // Submit Paper Upload Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setUploadSuccessMsg(null);

    // Validation
    if (!uploadTitle.trim()) return setFormError('Research paper title is required.');
    if (!uploadAbstract.trim()) return setFormError('Abstract is required.');
    if (!uploadAuthors.trim()) return setFormError('Author list is required.');
    if (!uploadInstitution.trim()) return setFormError('Institution is required.');
    if (!uploadKeywords.trim()) return setFormError('At least one keyword is required.');
    if (!uploadYear || isNaN(Number(uploadYear))) return setFormError('Valid publication year is required.');
    if (!pdfFile && !isEditing) return setFormError('Research paper PDF file is required.');

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadTitle.trim());
      formData.append('abstract', uploadAbstract.trim());
      formData.append('authors', uploadAuthors.trim());
      formData.append('institution', uploadInstitution.trim());
      formData.append('domain', uploadDomain);
      formData.append('region', uploadRegion);
      formData.append('keywords', uploadKeywords.trim());
      formData.append('year', uploadYear.trim());
      if (uploadDoi.trim()) formData.append('doi', uploadDoi.trim());
      if (uploadJournal.trim()) formData.append('journal', uploadJournal.trim());
      if (pdfFile) formData.append('pdf', pdfFile);

      let res;
      if (isEditing && selectedPaper) {
        res = await apiClient.put(`/publications/${selectedPaper.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await apiClient.post('/publications', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        setUploadSuccessMsg('Research paper manuscript submitted successfully for editorial review.');
        // Reset form
        setUploadTitle('');
        setUploadAbstract('');
        setUploadKeywords('');
        setUploadDoi('');
        setUploadJournal('');
        setPdfFile(null);
        setIsEditing(false);
        setSelectedPaper(null);

        // Refresh list
        fetchMyPapers();

        // Switch to my papers tab after brief delay
        setTimeout(() => {
          setActiveTab('my-papers');
        }, 1200);
      }
    } catch (err: any) {
      console.error('Error submitting publication:', err);
      setFormError(err.response?.data?.message || 'Failed to submit paper. Please review the form fields.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete/Withdraw paper
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you wish to withdraw this research paper submission?')) return;
    try {
      await apiClient.delete(`/publications/${id}`);
      fetchMyPapers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw manuscript.');
    }
  };

  // Pre-fill form for editing
  const startEdit = (paper: Publication) => {
    setSelectedPaper(paper);
    setIsEditing(true);
    setUploadTitle(paper.title);
    setUploadAbstract(paper.abstract);
    setUploadAuthors(paper.authors.join(', '));
    setUploadInstitution(paper.institution);
    setUploadDomain(paper.domain);
    setUploadRegion(paper.region);
    setUploadKeywords(paper.keywords.join(', '));
    setUploadYear(paper.year.toString());
    setUploadDoi(paper.doi || '');
    setUploadJournal(paper.journal || '');
    setPdfFile(null);
    setActiveTab('upload');
  };

  const statusBadge = (status?: PublicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-forest-50 text-forest-700 border border-forest-200">
            <CheckCircle2 className="w-3 h-3 text-forest-600" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" /> Needs Revision
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> In Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-semibold tracking-wider text-forest-700 bg-forest-50 border border-forest-200 px-2 py-0.5 rounded">
                Researcher Workspace
              </span>
              <span className="text-xs text-ink-light">• {user?.institution || 'NCPOR Member'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink">
              Research Papers Management
            </h1>
            <p className="text-xs sm:text-sm text-ink-light mt-0.5">
              Submit manuscripts, manage verified publications, and monitor editorial status.
            </p>
          </div>

          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedPaper(null);
              setUploadTitle('');
              setUploadAbstract('');
              setUploadKeywords('');
              setUploadDoi('');
              setUploadJournal('');
              setPdfFile(null);
              setActiveTab('upload');
            }}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-4 shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Submit Research Paper
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 border-b border-line">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'my-papers', label: 'All Submissions', count: stats.total, icon: FileText },
            { id: 'upload', label: isEditing ? 'Edit Paper' : 'Upload Paper', icon: UploadCloud },
            { id: 'pending', label: 'In Review', count: stats.pending, icon: Clock },
            { id: 'approved', label: 'Approved', count: stats.approved, icon: CheckCircle2 },
            { id: 'rejected', label: 'Needs Revision', count: stats.rejected, icon: XCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-forest-600 text-forest-700 bg-canvas-subtle/70 font-semibold'
                    : 'border-transparent text-ink-light hover:text-ink hover:bg-canvas-subtle/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-forest-600' : 'text-ink-faint'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] ${
                      isActive ? 'bg-forest-100 text-forest-800 font-semibold' : 'bg-canvas-subtle text-ink-light border border-line/60'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Subtle Stat Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-line rounded p-4 shadow-subtle">
                <p className="text-[11px] font-medium uppercase tracking-wider text-ink-light">Total Submissions</p>
                <p className="text-2xl font-serif font-bold text-ink mt-1">{stats.total}</p>
                <span className="text-[11px] text-ink-faint">Cumulative manuscripts</span>
              </div>

              <div className="bg-white border border-line rounded p-4 shadow-subtle">
                <p className="text-[11px] font-medium uppercase tracking-wider text-amber-800">In Editorial Review</p>
                <p className="text-2xl font-serif font-bold text-amber-800 mt-1">{stats.pending}</p>
                <span className="text-[11px] text-ink-faint">Awaiting verification</span>
              </div>

              <div className="bg-white border border-line rounded p-4 shadow-subtle">
                <p className="text-[11px] font-medium uppercase tracking-wider text-forest-700">Approved &amp; Published</p>
                <p className="text-2xl font-serif font-bold text-forest-700 mt-1">{stats.approved}</p>
                <span className="text-[11px] text-ink-faint">Visible in public archive</span>
              </div>

              <div className="bg-white border border-line rounded p-4 shadow-subtle">
                <p className="text-[11px] font-medium uppercase tracking-wider text-red-700">Needs Revision</p>
                <p className="text-2xl font-serif font-bold text-red-700 mt-1">{stats.rejected}</p>
                <span className="text-[11px] text-ink-faint">Feedback provided</span>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white border border-line rounded p-6 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h2 className="text-base font-serif font-bold text-ink">Recent Manuscript Submissions</h2>
                <button
                  onClick={() => setActiveTab('my-papers')}
                  className="text-xs text-forest-700 hover:underline font-medium"
                >
                  View all ({papers.length}) &rarr;
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-ink-light">Loading submissions...</div>
              ) : papers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-line rounded p-8 bg-canvas-subtle/40">
                  <UploadCloud className="w-8 h-8 text-ink-faint mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-ink">No Research Papers Submitted Yet</h3>
                  <p className="text-xs text-ink-light max-w-sm mx-auto mt-1 mb-4">
                    Submit your polar research papers to make them available to the scientific community.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="btn-primary text-xs py-1.5 px-3.5"
                  >
                    Submit First Paper
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-line/70">
                  {papers.slice(0, 5).map((paper) => (
                    <div
                      key={paper.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-canvas-subtle/50 px-2 -mx-2 rounded transition-colors"
                    >
                      <div className="space-y-0.5 max-w-2xl">
                        <div className="flex items-center gap-2 text-[11px] text-ink-light">
                          <span className="font-semibold text-forest-700">{paper.domain}</span>
                          <span>•</span>
                          <span>{paper.region}</span>
                          <span>•</span>
                          <span>{paper.year}</span>
                        </div>
                        <h4
                          onClick={() => setSelectedPaper(paper)}
                          className="font-serif font-bold text-ink text-sm hover:text-forest-700 cursor-pointer line-clamp-1"
                        >
                          {paper.title}
                        </h4>
                        <p className="text-[11px] text-ink-light line-clamp-1">
                          {paper.authors.join(', ')} — {paper.institution}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {statusBadge(paper.status)}
                        <button
                          onClick={() => setSelectedPaper(paper)}
                          className="p-1.5 rounded border border-line bg-white hover:bg-canvas-subtle text-ink-light hover:text-ink text-xs"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Form Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white border border-line rounded p-6 sm:p-8 max-w-4xl mx-auto space-y-6 shadow-subtle">
            <div className="border-b border-line pb-4">
              <h2 className="text-xl font-serif font-bold text-ink">
                {isEditing ? 'Revise & Resubmit Paper' : 'Submit Research Paper for Review'}
              </h2>
              <p className="text-xs text-ink-light mt-1">
                Submissions are reviewed by NCPOR editorial administrators before inclusion in the open-access repository.
              </p>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3.5 rounded bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{uploadSuccessMsg}</p>
                  <p className="text-[11px] text-forest-600 mt-0.5">Redirecting to manuscript list...</p>
                </div>
              </div>
            )}

            {formError && (
              <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="font-medium">{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Research Paper Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holocene Climate Variations Inferred from East Antarctic Ice Cores"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Abstract <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide a concise abstract describing methodology, observations, and primary conclusions..."
                  value={uploadAbstract}
                  onChange={(e) => setUploadAbstract(e.target.value)}
                  className="w-full bg-canvas-subtle border border-line rounded p-3 text-xs text-ink outline-none focus:border-forest-600 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Authors <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Pavan Chandan, Dr. Anjali Sinha"
                    value={uploadAuthors}
                    onChange={(e) => setUploadAuthors(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  />
                  <p className="text-[10px] text-ink-faint mt-1">Comma-separated author names</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Institution / University <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NCPOR, Ministry of Earth Sciences"
                    value={uploadInstitution}
                    onChange={(e) => setUploadInstitution(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Research Domain <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={uploadDomain}
                    onChange={(e) => setUploadDomain(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Region <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={uploadRegion}
                    onChange={(e) => setUploadRegion(e.target.value as Region)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Keywords <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ice Sheet, Glaciology, Antarctica"
                    value={uploadKeywords}
                    onChange={(e) => setUploadKeywords(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  />
                  <p className="text-[10px] text-ink-faint mt-1">Comma-separated tags</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Publication Year <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1950"
                    max={new Date().getFullYear()}
                    value={uploadYear}
                    onChange={(e) => setUploadYear(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    DOI <span className="text-ink-faint font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10.1029/2023GL000000"
                    value={uploadDoi}
                    onChange={(e) => setUploadDoi(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Journal / Proceedings <span className="text-ink-faint font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Journal of Glaciology"
                    value={uploadJournal}
                    onChange={(e) => setUploadJournal(e.target.value)}
                    className="w-full bg-canvas-subtle border border-line rounded px-3 py-2 text-xs text-ink outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              {/* PDF File Upload Field */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Manuscript PDF Document {!isEditing && <span className="text-red-600">*</span>}
                </label>
                <div className="border border-dashed border-line hover:border-forest-400 rounded p-6 bg-canvas-subtle/50 text-center transition-colors">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    id="pdf-upload-input"
                    className="hidden"
                  />
                  <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                    <UploadCloud className="w-7 h-7 text-forest-600 mb-1" />
                    <span className="text-xs font-semibold text-ink">
                      {pdfFile ? pdfFile.name : 'Select or drop PDF file'}
                    </span>
                    <span className="text-[11px] text-ink-light">
                      PDF documents up to 50MB
                    </span>
                  </label>
                  {pdfFile && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded bg-forest-50 text-forest-800 border border-forest-200 text-xs">
                      <FileCode className="w-3.5 h-3.5 text-forest-600" />
                      <span>{pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        onClick={() => setPdfFile(null)}
                        className="text-ink-light hover:text-red-600 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedPaper(null);
                      setActiveTab('my-papers');
                    }}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : isEditing ? 'Update & Resubmit' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Papers List / Table Views */}
        {activeTab !== 'overview' && activeTab !== 'upload' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white border border-line rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-subtle">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
                <input
                  type="text"
                  placeholder="Filter papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-canvas-subtle border border-line rounded pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-faint outline-none focus:border-forest-600"
                />
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-ink-light" />
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="bg-canvas-subtle border border-line rounded px-2.5 py-1.5 text-xs text-ink outline-none focus:border-forest-600"
                >
                  <option value="All">All Domains</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchMyPapers}
                  className="p-1.5 rounded border border-line bg-white hover:bg-canvas-subtle text-ink-light hover:text-ink text-xs"
                  title="Refresh list"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Academic Table */}
            <div className="bg-white border border-line rounded overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead className="bg-canvas-subtle text-ink-light text-[11px] uppercase font-semibold border-b border-line">
                    <tr>
                      <th className="p-3.5">Title &amp; Metadata</th>
                      <th className="p-3.5">Domain</th>
                      <th className="p-3.5">Year</th>
                      <th className="p-3.5">Review Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/70 text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-ink-light">
                          Loading manuscripts...
                        </td>
                      </tr>
                    ) : filteredPapers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-ink-faint">
                          No research papers found in this category.
                        </td>
                      </tr>
                    ) : (
                      filteredPapers.map((paper) => (
                        <tr key={paper.id} className="hover:bg-canvas-subtle/50 transition-colors">
                          <td className="p-3.5 max-w-md">
                            <div
                              className="font-serif font-bold text-ink hover:text-forest-700 cursor-pointer line-clamp-1"
                              onClick={() => setSelectedPaper(paper)}
                            >
                              {paper.title}
                            </div>
                            <div className="text-[11px] text-ink-light mt-0.5 line-clamp-1">
                              {paper.authors.join(', ')} • {paper.institution}
                            </div>
                            {paper.status === 'REJECTED' && paper.rejectionReason && (
                              <div className="mt-1.5 text-[11px] p-2 rounded bg-red-50 border border-red-200 text-red-800">
                                <strong>Editor note:</strong> {paper.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="text-[11px] bg-canvas-subtle text-ink-light border border-line px-2 py-0.5 rounded">
                              {paper.domain}
                            </span>
                          </td>
                          <td className="p-3.5 text-ink-light">{paper.year}</td>
                          <td className="p-3.5">{statusBadge(paper.status)}</td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedPaper(paper)}
                                className="p-1.5 text-ink-light hover:text-forest-700 hover:bg-canvas-subtle rounded transition-colors"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {paper.pdfUrl && (
                                <a
                                  href={paper.pdfUrl.startsWith('http') ? paper.pdfUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${paper.pdfUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-ink-light hover:text-forest-700 hover:bg-canvas-subtle rounded transition-colors"
                                  title="Download PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {(paper.status === 'PENDING' || paper.status === 'REJECTED') && (
                                <button
                                  onClick={() => startEdit(paper)}
                                  className="p-1.5 text-ink-light hover:text-amber-800 hover:bg-canvas-subtle rounded transition-colors"
                                  title="Revise manuscript"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {paper.status !== 'APPROVED' && (
                                <button
                                  onClick={() => handleDelete(paper.id)}
                                  className="p-1.5 text-ink-light hover:text-red-700 hover:bg-canvas-subtle rounded transition-colors"
                                  title="Withdraw submission"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Paper Details Modal */}
      <AnimatePresence>
        {selectedPaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-line rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-modal space-y-5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {statusBadge(selectedPaper.status)}
                    <span className="text-[11px] bg-canvas-subtle text-ink-light border border-line px-2 py-0.5 rounded">
                      {selectedPaper.domain}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-ink leading-snug">
                    {selectedPaper.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="text-ink-light hover:text-ink p-1 rounded hover:bg-canvas-subtle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedPaper.status === 'REJECTED' && selectedPaper.rejectionReason && (
                <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs">
                  <p className="font-bold uppercase tracking-wider text-red-700 mb-0.5">Editorial Revision Request</p>
                  <p>{selectedPaper.rejectionReason}</p>
                </div>
              )}

              <div>
                <h4 className="text-[11px] uppercase font-semibold tracking-wider text-ink-light mb-1">Abstract</h4>
                <p className="text-xs text-ink leading-relaxed bg-canvas-subtle/60 p-3 rounded border border-line/60">
                  {selectedPaper.abstract}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink-faint">Authors:</span>
                  <p className="text-ink font-medium mt-0.5">{selectedPaper.authors.join(', ')}</p>
                </div>
                <div>
                  <span className="text-ink-faint">Institution:</span>
                  <p className="text-ink font-medium mt-0.5">{selectedPaper.institution}</p>
                </div>
                <div>
                  <span className="text-ink-faint">Region:</span>
                  <p className="text-ink font-medium mt-0.5">{selectedPaper.region}</p>
                </div>
                <div>
                  <span className="text-ink-faint">Publication Year:</span>
                  <p className="text-ink font-medium mt-0.5">{selectedPaper.year}</p>
                </div>
                {selectedPaper.doi && (
                  <div>
                    <span className="text-ink-faint">DOI:</span>
                    <p className="text-forest-700 font-mono mt-0.5">{selectedPaper.doi}</p>
                  </div>
                )}
                {selectedPaper.journal && (
                  <div>
                    <span className="text-ink-faint">Journal/Conference:</span>
                    <p className="text-ink font-medium mt-0.5">{selectedPaper.journal}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-line flex items-center justify-between">
                {selectedPaper.pdfUrl ? (
                  <a
                    href={selectedPaper.pdfUrl.startsWith('http') ? selectedPaper.pdfUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${selectedPaper.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Manuscript PDF
                  </a>
                ) : (
                  <span className="text-xs text-ink-faint italic">No PDF document attached</span>
                )}

                <button
                  onClick={() => setSelectedPaper(null)}
                  className="btn-secondary text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
