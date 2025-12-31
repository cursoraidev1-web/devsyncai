'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
;
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Save,
  X,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../../styles/pages/DocumentationEditor.css';

const DocumentationEditor = () => {
  const params = useParams(); const id = params.id;
  const router = useRouter();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('New Documentation');
  const [isPreview, setIsPreview] = useState(false);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    document.getElementById('editor-content').focus();
  };

  const handleSave = () => {
    // Handle save logic
    toast.success('Documentation saved successfully!');
    router.push('/documents');
  };

  return (
    <div className="documentation-editor-page">
      <div className="editor-header">
        <div className="editor-header-left">
          <input
            type="text"
            className="editor-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Documentation Title"
          />
        </div>
        <div className="editor-header-right">
          <button
            className="editor-btn"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye size={18} />
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button className="editor-btn secondary" onClick={() => router.push('/documents')}>
            <X size={18} />
            Cancel
          </button>
          <button className="editor-btn primary" onClick={handleSave}>
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('bold')}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('italic')}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('underline')}
            title="Underline"
          >
            <Underline size={18} />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('formatBlock', 'h1')}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('formatBlock', 'h2')}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('formatBlock', 'h3')}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('insertUnorderedList')}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) handleFormat('createLink', url);
            }}
            title="Insert Link"
          >
            <Link size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) handleFormat('insertImage', url);
            }}
            title="Insert Image"
          >
            <ImageIcon size={18} />
          </button>
          <button
            className="toolbar-btn"
            onClick={() => handleFormat('formatBlock', 'pre')}
            title="Code Block"
          >
            <Code size={18} />
          </button>
        </div>
      </div>

      <div className="editor-content-wrapper">
        {isPreview ? (
          <div
            className="editor-preview"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div
            id="editor-content"
            className="editor-content"
            contentEditable
            onInput={(e) => setContent(e.target.innerHTML)}
            suppressContentEditableWarning
          >
            <p>Start writing your documentation...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationEditor;

