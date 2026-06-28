import React, { useState } from 'react';
import { BookOpen, Sprout, Search } from 'lucide-react';

export default function InfoPanel({ node, onClose, onScrollToBook }) {
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'philosophy'

  if (!node) return null;

  return (
    <div className="info-panel">
      <div>
        <h2 className="node-title">{node.label}</h2>
        <span className="provenance-tag">Type: {node.type.toUpperCase()}</span>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          <BookOpen size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
          Học thuật
        </button>
        <button 
          className={`tab ${activeTab === 'philosophy' ? 'active' : ''}`}
          onClick={() => setActiveTab('philosophy')}
        >
          <Sprout size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
          Triết học
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'academic' && node.academic && (
          <>
            <div>
              <div className="section-title">Định nghĩa</div>
              <div className="academic-text">{node.academic.definition}</div>
            </div>
            <div>
              <div className="section-title">Vai trò Hệ thống</div>
              <div className="academic-text">{node.academic.role}</div>
            </div>
            <div>
              <div className="section-title">Quan hệ Nhân quả</div>
              <div className="academic-text">{node.academic.causal}</div>
            </div>
          </>
        )}

        {activeTab === 'philosophy' && node.philosophy && (
          <>
            <div>
              <div className="section-title">Ẩn dụ Sinh thái</div>
              <div className="academic-text">{node.philosophy.metaphor}</div>
            </div>
            <div className="phil-quote">
              "{node.philosophy.quote}"
            </div>
            <div className="phil-question">
              ? {node.philosophy.question}
            </div>
          </>
        )}
      </div>

      {node.bookReference && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="section-title">Trích dẫn trong sách</div>
          <div className="academic-text" style={{ color: 'var(--accent-macro)', fontWeight: 500 }}>
            <BookOpen size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {node.bookReference}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={onScrollToBook}
          style={{
            background: 'var(--accent-macro)', border: 'none', color: '#000', cursor: 'pointer', 
            padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Search size={16} />
          Tìm trong sách
        </button>

        <button 
          onClick={onClose}
          style={{
            background: 'none', border: '1px solid #8a8a9e', color: '#8a8a9e', cursor: 'pointer', 
            padding: '0.5rem 1rem', borderRadius: '4px'
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
