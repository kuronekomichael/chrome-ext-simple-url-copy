import React, { useState, type CSSProperties, type MouseEvent } from 'react';

type CopyStyle = 'horizontal' | 'vertical' | 'markdown';

const Popup = () => {
  const [showCopiedLabel, setShowCopiedLabel] = useState(false);

  const handleLinkClick = async (style: CopyStyle) => {
    if (showCopiedLabel) return;

    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const activeTab = tabs.shift();

    const text = (() => {
      if (style === 'horizontal') {
        return `${activeTab.title} ${activeTab.url}`;
      }
      if (style === 'vertical') {
        return `${activeTab.title}\n${activeTab.url}`;
      }
      return `[${activeTab.title}](${activeTab.url})`;
    })();
    
    await navigator.clipboard.writeText(text);
    setShowCopiedLabel(true);
    setTimeout(() => setShowCopiedLabel(false), 1 * 1000);
  };

  return (
    <div style={styles.popup}>
      <div style={styles.header}>
        URL Copy
        {showCopiedLabel && <span style={styles.copied}>Copied!</span>} {/* Copiedメッセージの表示 */}
      </div>
      <div style={styles.content}>
        <div style={styles.item}>
          <a style={styles.link} onClick={(e) => handleLinkClick('horizontal')}>
            Title URL
          </a>
        </div>
        <div style={styles.item}>
          <a style={styles.link} onClick={(e) => handleLinkClick('vertical')}>
            <div>Title</div>
            <div>URL</div>
          </a>
        </div>
        <div style={{...styles.item, ...styles.lastItem}}>
          <a style={styles.link} onClick={(e) => handleLinkClick('markdown')}>
            [Title](URL) as Markdown Style
          </a>
        </div>
      </div>
    </div>
  );
};

const styles: {[key: string]: CSSProperties} = {
  popup: {
    width: '300px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  copied: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '5px',
    borderRadius: '5px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    fontSize: '12px',
    marginLeft: '10px',
  },
  content: {
    padding: '0px',
  },
  item: {
    padding: '1em',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  lastItem: {
    borderBottom: '',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

export default Popup;