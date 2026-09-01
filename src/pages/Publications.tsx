import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/ui/SearchBar';
import PublicationCard from '@/components/cards/PublicationCard';
import { publications as staticPublications } from '@/data/publications';
import type { Publication, Region } from '@/types';
import apiClient from '@/api/client';
import { BookOpen, Filter } from 'lucide-react';

const regions: ('All' | Region)[] = ['All', 'Arctic', 'Antarctic', 'Southern Ocean', 'Sub-Antarctic'];

export default function Publications() {
  const [dbPublications, setDbPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [domain, setDomain] = useState('All');
  const [year, setYear] = useState('All');
  const [sortBy, setSortBy] = useState<'year' | 'citations'>('year');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch approved database publications
  useEffect(() => {
    async function fetchApprovedPublications() {
      try {
        const res = await apiClient.get('/publications', { params: { status: 'APPROVED' } });
        if (res.data.success) {
          setDbPublications(res.data.data.publications || []);
        }
      } catch (err) {
        console.error('Error fetching database publications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApprovedPublications();
  }, []);

  // Merge static publications with database approved publications
  const combinedPublications = useMemo(() => {
    const map = new Map<string, Publication>();
    staticPublications.forEach((p) => map.set(p.id, { ...p, status: 'APPROVED' }));
    dbPublications.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [dbPublications]);

  const domains = useMemo(() => {
    return ['All', ...Array.from(new Set(combinedPublications.map((p) => p.domain)))];
  }, [combinedPublications]);

  const years = useMemo(() => {
    return ['All', ...Array.from(new Set(combinedPublications.map((p) => p.year.toString()))).sort((a, b) => Number(b) - Number(a))];
  }, [combinedPublications]);

  const filteredAndSorted = useMemo(() => {
    let result = combinedPublications.filter((p) => {
      if (p.status && p.status !== 'APPROVED') return false;

      const matchQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.authors.some((a) => a.toLowerCase().includes(query.toLowerCase())) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())));

      const matchRegion = region === 'All' || p.region === region;
      const matchDomain = domain === 'All' || p.domain === domain;
      const matchYear = year === 'All' || p.year.toString() === year;

      return matchQuery && matchRegion && matchDomain && matchYear;
    });

    result.sort((a, b) => {
      if (sortBy === 'year') return b.year - a.year;
      return (b.citationCount || 0) - (a.citationCount || 0);
    });

    return result;
  }, [combinedPublications, query, region, domain, year, sortBy]);

  const displayed = filteredAndSorted.slice(0, page * itemsPerPage);
  const hasMore = displayed.length < filteredAndSorted.length;

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Editorial Page Header */}
        <header className="pt-6 pb-2 border-b border-line">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            NCPOR Scientific Repository · Open Access
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-2">
            Scientific Publications &amp; Research Archive
          </h1>
          <p className="text-sm md:text-base text-ink-light max-w-2xl leading-relaxed">
            Search peer-reviewed literature, observational studies, expedition monographs, and technical papers published by Indian polar research scientists.
          </p>
        </header>

        {/* Search Bar */}
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search publications by title, author, domain, or keyword..."
        />

        {/* Academic Filters Card */}
        <div className="bg-white p-5 rounded border border-line space-y-4 shadow-subtle">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold text-ink-light uppercase tracking-wider min-w-[60px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-forest-600" /> Region:
            </span>
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  region === r
                    ? 'bg-forest-600 text-white font-semibold shadow-xs'
                    : 'bg-canvas-subtle text-ink-light hover:text-ink hover:bg-line/60 border border-line'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-line/70">
            <div className="flex items-center gap-2">
              <label htmlFor="domain-select" className="text-xs font-semibold text-ink-light uppercase tracking-wider">Domain:</label>
              <select
                id="domain-select"
                aria-label="Select scientific domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-canvas-subtle border border-line rounded px-3 py-1.5 text-xs text-ink outline-none focus:border-forest-600"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="year-select" className="text-xs font-semibold text-ink-light uppercase tracking-wider">Year:</label>
              <select
                id="year-select"
                aria-label="Select publication year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-canvas-subtle border border-line rounded px-3 py-1.5 text-xs text-ink outline-none focus:border-forest-600"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <label htmlFor="sort-select" className="text-xs font-semibold text-ink-light uppercase tracking-wider">Sort by:</label>
              <select
                id="sort-select"
                aria-label="Sort publications by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-canvas-subtle border border-line rounded px-3 py-1.5 text-xs text-ink outline-none focus:border-forest-600"
              >
                <option value="year">Publication Year (Newest)</option>
                <option value="citations">Citation Count (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="text-xs text-ink-light flex items-center justify-between">
          <span>
            Showing <strong className="text-ink font-semibold">{displayed.length}</strong> of{' '}
            <strong className="text-ink font-semibold">{filteredAndSorted.length}</strong> catalogued scientific publications
          </span>
        </div>

        {/* Publications Grid / Feed */}
        {loading ? (
          <div className="py-16 text-center text-xs text-ink-light font-mono">
            Loading scientific publications archive...
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((pub, i) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % itemsPerPage) * 0.03 }}
              >
                <PublicationCard publication={pub} />
              </motion.div>
            ))}

            {displayed.length === 0 && (
              <div className="text-center py-16 bg-white rounded border border-line p-8 text-ink-light text-sm">
                No publications found matching the active search and filter criteria.
              </div>
            )}
          </div>
        )}

        {/* Pagination Action */}
        {hasMore && (
          <div className="text-center py-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary px-8 py-2 text-xs font-medium"
            >
              Load More Publications
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
