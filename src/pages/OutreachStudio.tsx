import React, { useState, useEffect, useRef } from 'react';
import { generateOutreachContent } from '@/services/outreachService';
import type {
  ResourceType,
  AudienceMode,
  OutreachContentType,
  OutreachContent,
} from '@/types';

import {
  FileText,
  Globe,
  GraduationCap,
  Share2,
  Camera,
  Clipboard,
  ChevronDown,
  Check,
  Sparkles,
  Download,
  ShieldCheck
} from 'lucide-react';

import AudienceToggle from '@/components/ui/AudienceToggle';
import { publications } from '@/data/publications';
import { expeditions } from '@/data/expeditions';

export default function OutreachStudio() {
  const [sourceType, setSourceType] = useState<ResourceType>('publication');
  const [sourceId, setSourceId] = useState<string>('');
  const [audience, setAudience] = useState<AudienceMode>('public');
  const [contentType, setContentType] = useState<OutreachContentType>('scientific_summary');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [content, setContent] = useState<OutreachContent | null>(null);

  // Custom dropdown state
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const sourceDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sourceType === 'publication' && publications.length > 0) {
      setSourceId(publications[0].id);
    } else if (sourceType === 'expedition_report' && expeditions.length > 0) {
      setSourceId(expeditions[0].id);
    }
    setIsSourceDropdownOpen(false);
  }, [sourceType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sourceDropdownRef.current &&
        !sourceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSourceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown with Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSourceDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Generate content
  const handleGenerate = async () => {
    if (!sourceId) return;

    setIsGenerating(true);

    try {
      const result = await generateOutreachContent(
        sourceId,
        sourceType,
        audience,
        contentType
      );

      setContent(result);
    } catch (error: any) {
      console.error('Outreach generation failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Content generation failed. Please check the backend server.';
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClaimStatusCycle = (claimId: string) => {
    if (!content) return;

    const cycle = {
      pending: 'verified',
      verified: 'needs_review',
      needs_review: 'rejected',
      rejected: 'pending',
    };

    setContent((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        claims: prev.claims.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: cycle[c.status] as any,
              }
            : c
        ),
      };
    });
  };

  const handleVerifyAll = () => {
    if (!content) return;

    setContent((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        claims: prev.claims.map((c) => ({
          ...c,
          status: 'verified',
        })),
      };
    });
  };

  const contentTypes = [
    {
      id: 'scientific_summary',
      icon: FileText,
      label: 'Scientific Summary',
      desc: 'Technical overview with citations for researchers',
    },
    {
      id: 'website_article',
      icon: Globe,
      label: 'Website Editorial',
      desc: 'Narrative scientific article for portal readers',
    },
    {
      id: 'student_explanation',
      icon: GraduationCap,
      label: 'Educational Guide',
      desc: 'Pedagogical breakdown for students and schools',
    },
    {
      id: 'linkedin_post',
      icon: Share2,
      label: 'Institutional Dispatch',
      desc: 'Professional communication for science networks',
    },
    {
      id: 'instagram_caption',
      icon: Camera,
      label: 'Visual Media Caption',
      desc: 'Concise field story with hashtags for outreach',
    },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'tag-status-approved';
      case 'needs_review':
        return 'tag-status-pending';
      case 'rejected':
        return 'tag-status-rejected';
      case 'pending':
      default:
        return 'tag-status-draft';
    }
  };

  const selectedSourceLabel =
    sourceType === 'publication'
      ? publications.find((p) => p.id === sourceId)?.title || 'Select publication'
      : expeditions.find((e) => e.id === sourceId)?.name || 'Select expedition';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-ink space-y-6">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Science Communication Studio
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink mt-2">
          Polar Outreach &amp; Synthesis Studio
        </h1>
        <p className="text-xs sm:text-sm text-ink-light mt-0.5">
          Transform complex polar research papers and expedition reports into tailored communications with built-in fact verification.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT PANEL: CONFIGURATION */}
        <div className="lg:w-[58%] bg-white p-6 rounded border border-line shadow-subtle space-y-6">
          <h2 className="text-base font-serif font-bold text-ink pb-2 border-b border-line">
            Configure Content Generation
          </h2>

          {/* STEP 1: SOURCE */}
          <div>
            <label className="block text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
              Step 1 — Choose Source Document
            </label>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSourceType('publication')}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  sourceType === 'publication'
                    ? 'bg-forest-600 text-white border-forest-600 font-semibold shadow-xs'
                    : 'bg-canvas-subtle text-ink-light hover:text-ink border-line'
                }`}
              >
                Research Publication
              </button>

              <button
                type="button"
                onClick={() => setSourceType('expedition_report')}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  sourceType === 'expedition_report'
                    ? 'bg-forest-600 text-white border-forest-600 font-semibold shadow-xs'
                    : 'bg-canvas-subtle text-ink-light hover:text-ink border-line'
                }`}
              >
                Expedition Report
              </button>
            </div>

            {/* CUSTOM SOURCE DROPDOWN */}
            <div ref={sourceDropdownRef} className="relative w-full">
              <button
                type="button"
                onClick={() => setIsSourceDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-3 bg-canvas-subtle border border-line text-ink rounded px-3.5 py-2 text-left text-xs outline-none focus:border-forest-600 transition-colors shadow-subtle"
                aria-haspopup="listbox"
                aria-expanded={isSourceDropdownOpen}
              >
                <span className="truncate font-medium">{selectedSourceLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 text-ink-light transition-transform duration-150 ${
                    isSourceDropdownOpen ? 'rotate-180 text-forest-600' : ''
                  }`}
                />
              </button>

              {isSourceDropdownOpen && (
                <div
                  className="absolute z-50 top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-line rounded shadow-modal p-1"
                  role="listbox"
                >
                  {sourceType === 'publication' &&
                    publications.map((p) => {
                      const isSelected = sourceId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSourceId(p.id);
                            setIsSourceDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 rounded text-xs transition-colors ${
                            isSelected
                              ? 'bg-forest-50 text-forest-700 font-semibold'
                              : 'text-ink hover:bg-canvas-subtle'
                          }`}
                        >
                          <span className="truncate">{p.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-forest-600 shrink-0" />}
                        </button>
                      );
                    })}

                  {sourceType === 'expedition_report' &&
                    expeditions.map((e) => {
                      const isSelected = sourceId === e.id;
                      return (
                        <button
                          key={e.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSourceId(e.id);
                            setIsSourceDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 rounded text-xs transition-colors ${
                            isSelected
                              ? 'bg-forest-50 text-forest-700 font-semibold'
                              : 'text-ink hover:bg-canvas-subtle'
                          }`}
                        >
                          <span className="truncate">{e.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-forest-600 shrink-0" />}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: AUDIENCE */}
          <div>
            <label className="block text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
              Step 2 — Select Target Audience
            </label>
            <AudienceToggle value={audience} onChange={setAudience} />
          </div>

          {/* STEP 3: CONTENT TYPE */}
          <div>
            <label className="block text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
              Step 3 — Content Format
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isActive = contentType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id as OutreachContentType)}
                    className={`flex flex-col items-start p-3 rounded border text-left transition-all ${
                      isActive
                        ? 'bg-forest-50/70 border-forest-600 shadow-xs ring-1 ring-forest-600/30'
                        : 'bg-canvas-subtle/50 border-line hover:bg-canvas-subtle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-forest-600' : 'text-ink-light'}`} />
                    <span className={`text-xs font-semibold ${isActive ? 'text-forest-700' : 'text-ink'}`}>
                      {type.label}
                    </span>
                    <span className="text-[11px] text-ink-light mt-0.5 leading-snug">
                      {type.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !sourceId}
            className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Synthesizing Outreach Narrative...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Synthesize Outreach Content
              </>
            )}
          </button>
        </div>

        {/* RIGHT PANEL: GENERATED CONTENT & FACT CHECK */}
        <div className="lg:w-[42%] bg-white p-6 rounded border border-line shadow-subtle flex flex-col justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-ink pb-2 border-b border-line mb-4">
              Generated Outreach Synthesis
            </h2>

            {/* Empty State */}
            {!content && !isGenerating && (
              <div className="flex flex-col items-center justify-center text-ink-faint py-20 text-center">
                <FileText className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-xs font-medium text-ink-light">Configure options and click synthesize</p>
                <p className="text-[11px] text-ink-faint mt-0.5">Content with verified factual claims will appear here.</p>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center text-ink-light py-20 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-forest-600/30 border-t-forest-600 rounded-full animate-spin" />
                <p className="text-xs font-medium">Extracting key findings and adapting tone...</p>
              </div>
            )}

            {/* Generated Content Body */}
            {content && !isGenerating && (
              <div className="space-y-4">
                {/* Status Bar */}
                <div className="flex gap-1.5">
                  {['draft', 'verified', 'approved', 'published'].map((step) => (
                    <div key={step} className="flex-1 flex flex-col">
                      <div
                        className={`h-1 rounded-full mb-1 ${
                          step === content.status ? 'bg-forest-600' : 'bg-canvas-subtle'
                        }`}
                      />
                      <span className="text-[10px] uppercase text-center font-semibold text-ink-faint">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Generated Text Area */}
                <textarea
                  readOnly
                  value={content.generatedText}
                  className="w-full h-44 bg-canvas-subtle border border-line text-ink rounded p-3 text-xs outline-none resize-none leading-relaxed"
                />

                {/* Quick Copy / Regenerate */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(content.generatedText)}
                    className="btn-secondary flex-1 text-xs py-1.5 flex items-center justify-center gap-1.5"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    Copy Text
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="btn-secondary flex-1 text-xs py-1.5 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>

                {/* Fact Verification Claims */}
                <div className="pt-3 border-t border-line">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-serif font-bold text-ink flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                      Factual Claims Verification ({content.claims.length})
                    </h3>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {content.claims.map((claim) => (
                      <div key={claim.id} className="border border-line bg-canvas-subtle/60 rounded p-2.5 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <button
                            type="button"
                            onClick={() => handleClaimStatusCycle(claim.id)}
                            className={`tag text-[10px] uppercase font-semibold ${statusBadge(claim.status)}`}
                          >
                            {claim.status.replace('_', ' ')}
                          </button>
                          {claim.sourceDocument && (
                            <span className="text-[10px] text-ink-faint">
                              {claim.sourceDocument} (p. {claim.sourcePage})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink leading-relaxed">{claim.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {content && !isGenerating && (
            <div className="pt-3 mt-3 border-t border-line flex gap-2">
              <button
                type="button"
                onClick={handleVerifyAll}
                className="btn-secondary text-xs flex-1 py-1.5"
              >
                Mark All Verified
              </button>
              <button
                type="button"
                onClick={() => alert('Article content exported to clipboard.')}
                className="btn-primary text-xs flex-1 py-1.5"
              >
                Export Output
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}