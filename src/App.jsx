import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Menu, X, Network } from 'lucide-react';
import EcosystemGraph from './components/EcosystemGraph.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import { ecosystemData } from './data/index.js';
import './index.css';

const keywordMap = {
  "Attention Capital": "AttentionCapital",
  "Moral Intuition": "MoralIntuition",
  "Systemic Inquiry": "SystemicInquiry",
  "Interpretive Identity": "InterpretiveIdentity",
  "Responsibility Ownership": "ResponsibilityOwnership",
  "Meaning Construction Capacity": "MCC",
  "Meaning Capital": "MeaningCapital",
  "Constructive Friction": "ConstructiveFriction",
  "Ma sát chức năng": "ConstructiveFriction",
  "Ecotone": "Ecotone",
  "Interpretive Shock": "InterpretiveShock",
  "Chấn động diễn giải": "InterpretiveShock",
  "Epistemic Humility": "EpistemicHumility",
  "Khiêm nhường nhận thức": "EpistemicHumility",
  "Karma Gap": "KarmaGap",
  "Khoảng trống nghiệp": "KarmaGap",
  "4E Cognition": "FourECognition",
  "Tâm trí nhập thể": "FourECognition",
  "Beast Machine": "BeastMachine",
  "Cỗ máy thú": "BeastMachine",
  "Prediction Error": "PredictionError",
  "Sai số dự đoán": "PredictionError",
  "Meaning Error": "MeaningError",
  "Sai số ý nghĩa": "MeaningError",
  "Cognitive Atrophy": "CognitiveAtrophy",
  "Thuê ngoài hiện sinh": "ExistentialOutsourcing",
  "Existential Outsourcing": "ExistentialOutsourcing"
};

function App() {
  const [activeNode, setActiveNode] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isGraphVisible, setIsGraphVisible] = useState(false); // Mặc định ẩn
  const [fontSize, setFontSize] = useState(1.05); // rem
  
  // Resizing state
  const [readerWidth, setReaderWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);

  const readerRef = useRef(null);
  const graphRef = useRef(null);

  const generateId = (text) => {
    return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}book.md`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        // Extract headings for TOC (only H1, H2, H3)
        // Ignored code blocks by ensuring no backticks block
        const extractedHeadings = text.split('\n')
          .filter(line => /^#{1,3}\s/.test(line))
          .map(line => {
            const level = line.match(/^#+/)[0].length;
            const plainText = line.replace(/^#+\s/, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_~`]/g, '').trim();
            return { level, text: plainText };
          });
        setHeadings(extractedHeadings);

        // Pre-process markdown to inject hyperlinks for keywords
        let processed = text;
        
        // Loại bỏ các thẻ HTML rác (đặc biệt là thẻ <div> ngắt trang dùng cho PDF)
        processed = processed.replace(/<\/?div[^>]*>/gi, '');

        Object.keys(keywordMap).forEach(kw => {
          const regex = new RegExp(`(?<!\\[)\\b(${kw})\\b(?!\\])`, 'gi');
          processed = processed.replace(regex, `[$1](#node-${keywordMap[kw]})`);
        });
        setMarkdownContent(processed);
      })
      .catch(err => {
        console.error("Could not load book content:", err);
        setMarkdownContent(`> Lỗi không tải được nội dung sách: ${err.message}. Kiểm tra lại đường dẫn file \`book.md\`.`);
      });
  }, []);

  const handleNodeClick = useCallback((node) => {
    setActiveNode(node);
    if (graphRef.current) {
      graphRef.current.focusNode(node);
    }
  }, []);

  const handleLinkClick = (nodeId) => {
    const node = ecosystemData.nodes.find(n => n.id === nodeId);
    if (node) {
      if (!isGraphVisible) setIsGraphVisible(true);
      setTimeout(() => handleNodeClick(node), 100); // Đợi graph render
    }
  };

  const scrollToBook = (nodeId) => {
    if (!readerRef.current) return;
    const el = readerRef.current.querySelector(`a[href="#node-${nodeId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-pulse');
      setTimeout(() => el.classList.remove('highlight-pulse'), 2000);
    } else {
      alert("Không tìm thấy khái niệm này trong sách.");
    }
  };

  const scrollToHeading = (textToFind) => {
    if (!readerRef.current) return;
    
    // Lấy tất cả các thẻ H1, H2, H3 đang hiển thị trong văn bản
    const domHeadings = Array.from(readerRef.current.querySelectorAll('h1, h2, h3'));
    
    // Chuẩn hóa chuỗi (bỏ dấu, khoảng trắng, ký tự đặc biệt) để so sánh tuyệt đối
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, '');
    const target = normalize(textToFind);
    
    const targetEl = domHeadings.find(el => normalize(el.textContent) === target);
    
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsTocOpen(false); // tự động đóng TOC
    } else {
      console.warn("Không tìm thấy DOM cho heading:", textToFind);
    }
  };

  const closePanel = () => {
    setActiveNode(null);
  };

  // Resizing Handlers
  const startResizing = useCallback((e) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 15 && newWidth < 85) {
        setReaderWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div id="root" className={`split-layout ${isResizing ? 'resizing' : ''}`}>
      {/* TOC Panel */}
      <div className={`toc-panel ${isTocOpen ? 'open' : ''}`} onMouseEnter={() => setIsTocOpen(true)} onMouseLeave={() => setIsTocOpen(false)}>
        <div className="toc-toggle">
          {isTocOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        <div className="toc-content">
          <h3>Mục Lục</h3>
          <ul>
            {headings.map((h, i) => (
              <li key={i} className={`toc-level-${h.level}`}>
                <a onClick={() => scrollToHeading(h.text)}>{h.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reader-pane" ref={readerRef} style={{ 
        flexBasis: isGraphVisible ? `${readerWidth}%` : '100%', 
        flexGrow: isGraphVisible ? 0 : 1, 
        flexShrink: 0,
        '--reader-font-size': `${fontSize}rem`
      }}>
        <div className="reader-topbar">
          <div className="text-controls">
            <button onClick={() => setFontSize(f => Math.max(0.8, +(f - 0.1).toFixed(1)))} title="Giảm cỡ chữ">A-</button>
            <button onClick={() => setFontSize(f => Math.min(2.0, +(f + 0.1).toFixed(1)))} title="Tăng cỡ chữ">A+</button>
          </div>
        </div>

        <div className="reader-content">
          {markdownContent ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({node, href, children, ...props}) => {
                  if (href && href.startsWith('#node-')) {
                    return (
                      <a 
                        href={href} 
                        className="concept-link" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(href.replace('#node-', ''));
                        }}
                      >
                        {children}
                      </a>
                    );
                  }
                  return <a href={href} {...props}>{children}</a>;
                }
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          ) : (
            <p style={{textAlign: 'center', marginTop: '5rem', color: '#888'}}>Đang tải nội dung sách...</p>
          )}
        </div>
        
        {!isGraphVisible && (
          <button className="open-graph-btn" onClick={() => setIsGraphVisible(true)}>
            <Network size={20} /> Mở Bản Đồ Sinh Thái
          </button>
        )}
      </div>

      {/* Resizer Handle */}
      {isGraphVisible && <div className="resizer" onMouseDown={startResizing} />}

      {isGraphVisible && (
        <div className="graph-pane" style={{ flexBasis: `${100 - readerWidth}%`, flexGrow: 1, flexShrink: 1 }}>
          <div className="graph-container">
            <EcosystemGraph ref={graphRef} onNodeClick={handleNodeClick} />
          </div>
          
          <div className="overlay-container">
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1>HVDT 3D Reading Companion</h1>
                <p>Mô phỏng Động lực học Hệ thống & Triết lý Sinh thái</p>
              </div>
              <button className="close-graph-btn" onClick={() => setIsGraphVisible(false)}>
                <X size={24} />
              </button>
            </div>
            
            {activeNode && (
              <InfoPanel node={activeNode} onClose={closePanel} onScrollToBook={() => scrollToBook(activeNode.id)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
