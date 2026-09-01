import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-navy-950 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-ice-300 to-ice-600 mb-4 drop-shadow-[0_0_30px_rgba(14,165,233,0.3)]">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page lost in the polar ice
        </h2>
        <p className="text-slate-400 mb-8 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Or perhaps it's buried under a glacier.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-ice-600 hover:bg-ice-500 text-white font-medium rounded-lg transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
