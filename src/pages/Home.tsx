import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/hero/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedExpeditions from '@/components/home/FeaturedExpeditions';
import PublicationCard from '@/components/cards/PublicationCard';
import { publications } from '@/data/publications';
import { ArrowRight, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  const latestPublications = publications.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <HeroSection />
      
      <StatsSection />
      
      <CategoryGrid />
      
      <FeaturedExpeditions />
      
      {/* Latest Publications Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded border border-forest-200">
              Recent Scientific Literature
            </span>
            <h2 className="section-heading mt-3">Peer-Reviewed Publications</h2>
            <p className="section-subheading mt-2">Latest verified research papers and observational findings from NCPOR scientists.</p>
          </div>
          <Link to="/explore/publications" className="flex items-center gap-1 text-xs font-medium text-forest-700 hover:text-forest-900 transition-colors">
            All publications archive <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPublications.map(pub => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      </section>
      
      {/* Editorial Archive Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-canvas-subtle border-t border-line">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-3 tracking-tight">
            National Polar Science Knowledge Archive
          </h2>
          <p className="text-sm text-ink-light mb-6 max-w-xl mx-auto leading-relaxed">
            Open-access catalog connecting researchers, policy makers, and educators with decades of validated polar research data and field literature.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/explore/repository"
              className="btn-primary flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Browse Complete Repository
            </Link>
            <Link
              to="/about"
              className="btn-secondary"
            >
              About NCPOR DHRUV
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
