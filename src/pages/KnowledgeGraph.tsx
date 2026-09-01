import React, { useState, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  MiniMap, 
  Background, 
  BackgroundVariant, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { knowledgeNodes, knowledgeEdges } from '@/data/knowledgeGraph';
import type { KnowledgeNode } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { GitBranch, X } from 'lucide-react';

const typeColors: Record<string, string> = {
  expedition: '#24463A', // forest green
  researcher: '#6F887B', // sage
  publication: '#B7A68A', // sand
  dataset: '#71808A', // polar blue
  location: '#466657', // dark sage
  institution: '#8C6D23', // amber
  finding: '#9C3D3D', // brick red
};

const getPosition = (type: string, index: number) => {
  const positions: Record<string, {x: number, y: number}> = {
    expedition: { x: 500, y: 300 },
    researcher: { x: 200, y: 250 },
    publication: { x: 800, y: 200 },
    dataset: { x: 800, y: 450 },
    location: { x: 500, y: 600 },
    institution: { x: 500, y: 100 },
    finding: { x: 1050, y: 325 },
  };

  const base = positions[type] || { x: 500, y: 300 };
  const offset = index * 40;
  
  let spreadX = base.x;
  let spreadY = base.y;

  if (type === 'researcher') {
    spreadY += offset * 1.5 - 100;
  } else if (type === 'publication' || type === 'dataset') {
    spreadY += offset - 50;
  } else if (type === 'location') {
    spreadX += offset * 1.5 - 100;
  } else if (type === 'expedition') {
    spreadX += offset - 50;
  }

  return { x: spreadX, y: spreadY };
};

const initialNodes: Node[] = knowledgeNodes.map((node, i) => ({
  id: node.id,
  data: { label: node.label, fullData: node },
  position: getPosition(node.type, knowledgeNodes.filter((n, idx) => n.type === node.type && idx < i).length),
  style: { 
    background: typeColors[node.type] || '#24463A', 
    color: '#ffffff', 
    border: '1px solid rgba(0,0,0,0.1)', 
    borderRadius: 6, 
    padding: '6px 12px', 
    fontSize: 11, 
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
  },
}));

const initialEdges: Edge[] = knowledgeEdges.map(e => ({
  id: e.id,
  source: e.source,
  target: e.target,
  label: e.label,
  style: { stroke: '#B7A68A', strokeWidth: 1.5 },
  labelStyle: { fill: '#66635F', fontSize: 10, fontWeight: 600 },
  labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.9, rx: 4 },
  animated: e.label === 'conducted at' || e.label === 'generated'
}));

const KnowledgeGraph: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(Object.keys(typeColors));

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    setNodes(initialNodes.map(n => ({
      ...n,
      hidden: !activeFilters.includes(n.data.fullData.type)
    })));
  }, [activeFilters, setNodes]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data.fullData);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-canvas text-ink relative overflow-hidden">
      {/* Header outside ReactFlow */}
      <div className="p-4 border-b border-line bg-white/80 backdrop-blur-sm z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-forest-600" />
            <h1 className="text-base font-serif font-bold text-ink">Polar Knowledge Graph</h1>
          </div>
          <p className="text-xs text-ink-light">Semantic relationships connecting expeditions, researchers, datasets, and discoveries</p>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeColors).map(([type, color]) => {
            const isActive = activeFilters.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-2.5 py-1 text-[11px] rounded uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 border ${
                  isActive 
                    ? 'bg-white border-line text-ink shadow-xs' 
                    : 'bg-canvas-subtle/50 border-line/50 text-ink-faint opacity-60'
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color={isDark ? '#3A3730' : '#D9D6CF'} gap={20} size={1.2} />
          <Controls 
            className="bg-white border-line shadow-subtle text-ink"
          />
          <MiniMap 
            style={{ backgroundColor: isDark ? '#211F1B' : '#FFFFFF', border: isDark ? '1px solid #3A3730' : '1px solid #D9D6CF', borderRadius: 6 }}
            nodeColor={(n) => typeColors[n.data.fullData?.type] || '#6F887B'}
            maskColor={isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(247, 245, 240, 0.6)'}
          />
        </ReactFlow>

        {/* Right Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-line shadow-modal p-5 z-20 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-line">
                <div>
                  <span 
                    className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded text-white inline-block mb-1"
                    style={{ backgroundColor: typeColors[selectedNode.type] || '#24463A' }}
                  >
                    {selectedNode.type}
                  </span>
                  <h2 className="text-base font-serif font-bold text-ink leading-snug">{selectedNode.label}</h2>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-ink-light hover:text-ink p-1 rounded hover:bg-canvas-subtle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-semibold text-ink-light uppercase tracking-wider">Properties</h3>
                
                {Object.entries(selectedNode.data).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-[10px] text-ink-faint uppercase font-medium">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-xs text-ink bg-canvas-subtle p-2 rounded border border-line/60 mt-0.5">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-line">
                <h3 className="text-[11px] font-semibold text-ink-light uppercase tracking-wider mb-2">Connected Entities</h3>
                <div className="space-y-1.5">
                  {knowledgeEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => {
                      const isSource = e.source === selectedNode.id;
                      const connectedId = isSource ? e.target : e.source;
                      const connectedNode = knowledgeNodes.find(n => n.id === connectedId);
                      if (!connectedNode) return null;

                      return (
                        <div key={e.id} className="text-xs flex items-center justify-between p-2 rounded bg-canvas-subtle border border-line/60">
                          <span className="text-[11px] text-ink-faint italic">
                            {isSource ? e.label : `is ${e.label} by`}
                          </span>
                          <span 
                            className="font-semibold truncate max-w-[120px] text-ink"
                          >
                            {connectedNode.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
