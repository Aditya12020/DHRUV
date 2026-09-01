import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Microscope, Globe, Library, Archive, ArrowRight, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const missions = [
    {
      icon: <Microscope className="w-5 h-5 text-forest-700" />,
      title: "Research Excellence",
      description: "Facilitating cutting-edge polar and ocean research by providing open access to historic and modern field observation datasets from India's polar expeditions."
    },
    {
      icon: <Globe className="w-5 h-5 text-forest-700" />,
      title: "Global Visibility",
      description: "Showcasing India's contributions to Antarctic, Arctic, and Southern Ocean science on the global stage, fostering international scientific collaboration."
    },
    {
      icon: <Library className="w-5 h-5 text-forest-700" />,
      title: "Knowledge Repository",
      description: "Serving as the definitive national archive for peer-reviewed publications, technical reports, and mission logs spanning 40+ years of polar exploration."
    },
    {
      icon: <Archive className="w-5 h-5 text-forest-700" />,
      title: "Data Stewardship",
      description: "Ensuring long-term preservation and standardized metadata cataloguing for meteorological, glaciological, oceanographic, and biological records."
    }
  ];

  const stats = [
    { value: "43+", label: "Indian Antarctic Expeditions" },
    { value: "14+", label: "Arctic Research Missions" },
    { value: "1,200+", label: "Verified Publications" },
    { value: "40+", label: "Years of Polar Science" }
  ];

  return (
    <div className="bg-canvas text-ink min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-line bg-canvas-subtle">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-block mb-3">
              National Centre for Polar and Ocean Research
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink leading-tight">
              Digital Knowledge Architecture for <br />
              <span className="italic font-normal text-forest-700">Indian Polar &amp; Ocean Science</span>
            </h1>
            <p className="text-sm md:text-base text-ink-light mt-3 max-w-2xl mx-auto leading-relaxed">
              DHRUV is India's premier archival and analytics repository, cataloguing expeditions, research papers, field datasets, and media from the Arctic, Antarctic, and Southern Ocean realms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700">Mandate &amp; Objectives</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink mt-1">Core Archival Pillars</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="bg-white border border-line rounded p-6 shadow-subtle hover:border-forest-400 transition-colors"
            >
              <div className="w-10 h-10 bg-canvas-subtle rounded border border-line flex items-center justify-center mb-4">
                {mission.icon}
              </div>
              <h3 className="text-base font-serif font-bold text-ink mb-2">{mission.title}</h3>
              <p className="text-xs text-ink-light leading-relaxed">{mission.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About NCPOR Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-line rounded overflow-hidden shadow-subtle flex flex-col lg:flex-row">
          <div className="p-8 lg:p-12 lg:w-3/5 flex flex-col justify-center space-y-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Institutional Mandate
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink mb-3">
                Established Under NCPOR &amp; MoES
              </h2>
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed mb-3">
                The National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India, serves as the nodal agency for coordinating and executing India's multi-disciplinary research in Antarctica, the Arctic, Himalayas, and the Southern Ocean.
              </p>
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                DHRUV embodies India's commitment to the Antarctic Treaty and open scientific data exchange, safeguarding vital climate indicators and discoveries for the global scientific community.
              </p>
            </motion.div>
          </div>
          <div className="lg:w-2/5 bg-canvas-subtle p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-line flex items-center justify-center">
             <div className="grid grid-cols-2 gap-6 w-full">
               {stats.map((stat, idx) => (
                 <div key={idx} className="text-center">
                   <div className="text-2xl md:text-3xl font-serif font-bold text-forest-700 mb-1">{stat.value}</div>
                   <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">{stat.label}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-14 text-center px-4"
      >
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink mb-2">Explore the Polar Archive</h2>
        <p className="text-xs text-ink-light mb-6 max-w-md mx-auto">Access peer-reviewed papers, observation datasets, and expedition catalogs.</p>
        <Link 
          to="/explore/repository" 
          className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-5"
        >
          <span>Explore Knowledge Repository</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.section>
    </div>
  );
};

export default About;
