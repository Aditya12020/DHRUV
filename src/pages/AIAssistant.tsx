import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/components/ai/ChatMessage';
import SuggestedPrompts from '@/components/ai/SuggestedPrompts';
import { AIMessage, AudienceMode } from '@/components/ai/SourceCard';
import { Send, Sparkles } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('researcher');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([{
    id: '1',
    role: 'assistant',
    content: "Welcome to DHRUV Intelligence — your scientific research companion for Indian polar and ocean science archives. You can inquire about expedition logs, glaciology findings, atmospheric measurements, and publications from India's Arctic, Antarctic, and Southern Ocean programs.",
    suggestedQuestions: [
      'What did ISEA-43 discover about ice sheet dynamics?',
      'How does Arctic amplification affect Indian monsoon?',
      'Compare India\'s Arctic and Antarctic research programs',
      'What is the significance of Lambert Glacier findings?',
      'Tell me about Maitri and Bharati research stations',
      'What microplastics data was found in Southern Ocean 2024?'
    ],
    timestamp: new Date(),
    audienceMode: 'researcher'
  }]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingId = Date.now().toString() + '-loading';
    setMessages(prev => [...prev, {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }]);

    // Mock AI response logic
    setTimeout(() => {
      let responseContent = "NCPOR (National Centre for Polar and Ocean Research) is India's premier R&D institution responsible for the country's research activities in the polar and Southern Ocean realms.";
      let sources = undefined;
      const lowerText = text.toLowerCase();

      if (lowerText.match(/ice|glacier|sheet/)) {
        responseContent = "Recent findings from ISEA-43 show that the Lambert Glacier has accelerated by 12% over the past decade. The sediment cores and paleoclimate data suggest a significant shift in glacial dynamics linked to basal melting.";
        sources = [
          { id: 's1', title: 'Ice Sheet Dynamics (2024)', type: 'publication' as any, snippet: 'Analysis of Lambert Glacier flow velocity...', relevanceScore: 0.95 },
          { id: 's2', title: 'Lambert Glacier Flow Data', type: 'dataset' as any, snippet: 'GPS coordinates and flow vectors...', relevanceScore: 0.88 }
        ];
      } else if (lowerText.match(/arctic|permafrost|himadri/)) {
        responseContent = "Data from Himadri station during IAE-14 reveals the permafrost active layer is now 18cm thicker. This has substantial implications for greenhouse gas release and local ecology.";
        sources = [
          { id: 's3', title: 'Arctic Amplification Study (2023)', type: 'publication' as any, snippet: 'Permafrost thaw rates in Svalbard...', relevanceScore: 0.92 },
          { id: 's4', title: 'Permafrost Temperature Archive', type: 'dataset' as any, snippet: 'Borehole temperature logs 2010-2023...', relevanceScore: 0.85 }
        ];
      } else if (lowerText.match(/monsoon|teleconnection/)) {
        responseContent = "IAE-13 identified a strong correlation between Arctic sea ice extent anomalies and the Indian summer monsoon. Specifically, delayed sea ice melt correlates with stronger mid-season monsoon pulses.";
      } else if (lowerText.match(/ocean|carbon|microplastic/)) {
        responseContent = "The SOC-2024 expedition found a 30% increase in CO2 absorption in the surveyed sector of the Southern Ocean. However, they also recorded a 6x increase in microplastic concentrations compared to 2010 baselines.";
        sources = [
          { id: 's5', title: 'Southern Ocean Carbon Flux (2024)', type: 'publication' as any, snippet: 'pCO2 measurements across the polar front...', relevanceScore: 0.96 }
        ];
      } else if (lowerText.match(/biodiversity|species|krill/)) {
        responseContent = "During ISEA-43, marine biologists identified three new species of deep-water krill predators, suggesting a more complex benthic food web than previously understood.";
      }

      if (audienceMode === 'student') {
        responseContent = "Here's a simpler way to understand it: " + responseContent.replace(/basal melting/g, "melting from underneath").replace(/teleconnection/g, "long-distance weather connection").replace(/benthic food web/g, "ocean floor food chain");
      } else if (audienceMode === 'public') {
        responseContent = "Imagine the ice as a giant river. " + responseContent.replace(/basal melting/g, "melting at the bottom").replace(/anomalies/g, "unusual changes").replace(/benthic food web/g, "creatures living at the bottom of the sea");
      }

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          sources,
          suggestedQuestions: [
            'Can you explain the methodology used?',
            'What datasets support this?',
            'Who were the lead researchers?'
          ],
          timestamp: new Date(),
          audienceMode
        }];
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col bg-canvas text-ink" style={{ height: 'calc(100dvh - 4rem)', minHeight: 0 }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-line bg-white/80 backdrop-blur-sm z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-forest-600" />
            <h1 className="text-base font-serif font-bold text-ink">DHRUV Intelligence</h1>
          </div>
          <p className="text-[11px] text-ink-light">Scientific Research AI Companion · NCPOR Archive</p>
        </div>
        <div className="flex bg-canvas-subtle rounded p-1 border border-line">
          {(['researcher', 'student', 'public'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setAudienceMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors capitalize ${
                audienceMode === mode 
                  ? 'bg-forest-600 text-white font-semibold shadow-xs' 
                  : 'text-ink-light hover:text-ink'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-col">
          {messages.map(msg => (
            <React.Fragment key={msg.id}>
              <ChatMessage message={msg} />
              {msg.role === 'assistant' && msg.suggestedQuestions && !msg.isLoading && (
                <div className="ml-11 mb-6 max-w-3xl">
                  <SuggestedPrompts 
                    prompts={msg.suggestedQuestions} 
                    onSelect={handleSend} 
                  />
                </div>
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-line p-4 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="max-w-4xl mx-auto relative flex items-end bg-canvas-subtle rounded border border-line focus-within:border-forest-600 transition-all shadow-subtle">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder={`Ask DHRUV Intelligence as a ${audienceMode}...`}
            className="w-full bg-transparent border-none text-ink placeholder:text-ink-faint p-3.5 min-h-[50px] max-h-32 resize-none focus:ring-0 text-xs sm:text-sm leading-relaxed outline-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 rounded bg-forest-600 text-white hover:bg-forest-700 disabled:opacity-40 transition-colors"
            aria-label="Send query"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-center text-[10px] text-ink-faint mt-2">
          DHRUV Intelligence citations refer to published expedition papers and datasets. Verify critical research claims with primary literature.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
