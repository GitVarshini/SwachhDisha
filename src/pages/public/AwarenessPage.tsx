import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AWARENESS_TOPICS, AWARENESS_FAQS } from '../../data/mockData';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

export const AwarenessPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(AWARENESS_TOPICS[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedTopic =
    AWARENESS_TOPICS.find((t) => t.id === activeTab) || AWARENESS_TOPICS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Civic Environmental Literacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
          Waste Segregation & Responsible Disposal
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed text-balance">
          Proper waste segregation at source prevents toxic dumps, protects municipal sanitation workers, and keeps ground water channels unpolluted.
        </p>
      </div>

      {/* Interactive Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/80 rounded-xl max-w-2xl mx-auto border border-slate-200">
        {AWARENESS_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTab(topic.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === topic.id
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {topic.category.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Selected Topic Detailed Deep Dive Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Title & Badge */}
        <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {selectedTopic.badge}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-display mt-2">
              {selectedTopic.category}
            </h2>
          </div>
          <Link
            to={`/report?category=${selectedTopic.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report {selectedTopic.category.split(' ')[0]} Dump</span>
          </Link>
        </div>

        {/* What it is & How to Dispose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>What It Is</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedTopic.whatItIs}</p>
          </div>

          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Responsible Disposal Protocol</span>
            </h3>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {selectedTopic.howToDispose}
            </p>
          </div>
        </div>

        {/* Common Mistakes & Practical Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Common Mistakes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Common Mistakes to Avoid</span>
            </h3>
            <div className="space-y-2.5">
              {selectedTopic.commonMistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-rose-100 rounded-lg flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span className="leading-snug">{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Daily Tips */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Practical Household Tips</span>
            </h3>
            <div className="space-y-2.5">
              {selectedTopic.practicalTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Civic FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto space-y-4 pt-6">
        <div className="text-center space-y-1 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Citizen Inquiries
          </span>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {AWARENESS_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
