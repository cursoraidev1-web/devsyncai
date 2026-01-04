'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { useApp } from '../../../../context/AppContext';
import { uploadDocumentFile } from '../../../../utils/fileUpload';
import { getDocumentUploadToken } from '../../../../api/documents';
import { uploadFile, getPublicUrl } from '../../../../utils/supabase';
import '../../../../styles/pages/DocumentationEditor.css';

const DocumentationEditor = () => {
  const router = useRouter();
  const { projects, loadDocuments } = useApp();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('New Documentation');
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  // Set default project when projects load
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Use selected project ID
  const projectId = selectedProjectId || projects?.[0]?.id;

  // Debug: Log project availability
  useEffect(() => {
    console.log('📋 Projects loaded:', { 
      projectsCount: projects?.length, 
      projectId,
      projects: projects?.map(p => ({ id: p.id, name: p.name }))
    });
  }, [projects, projectId]);

  // Initialize editor content on mount
  useEffect(() => {
    const editorElement = document.getElementById('editor-content');
    if (editorElement && !content) {
      editorElement.innerHTML = '<p>Start writing your documentation...</p>';
    }
  }, []);

  const handleFormat = (command, value = null) => {
    const editorElement = document.getElementById('editor-content');
    if (!editorElement) return;

    // Special handling for formatBlock to allow toggling
    if (command === 'formatBlock' && value) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        
        // Check if we're already in a block of this type
        let currentBlock = container.nodeType === 3 
          ? container.parentElement 
          : container;
        
        // Find the block element (p, h1, h2, h3, pre, etc.)
        while (currentBlock && currentBlock !== editorElement) {
          if (currentBlock.tagName && ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'CODE', 'DIV'].includes(currentBlock.tagName)) {
            break;
          }
          currentBlock = currentBlock.parentElement;
        }

        // If clicking the same format, convert to paragraph (toggle off)
        if (currentBlock && currentBlock.tagName === value.toUpperCase()) {
          const text = currentBlock.textContent || currentBlock.innerText;
          const p = document.createElement('p');
          p.textContent = text;
          if (currentBlock.parentNode) {
            currentBlock.parentNode.replaceChild(p, currentBlock);
            // Select the new paragraph
            const newRange = document.createRange();
            newRange.selectNodeContents(p);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        } else {
          // Apply the format
          document.execCommand(command, false, value);
        }
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }

    editorElement.focus();
    // Update content state
    setContent(editorElement.innerHTML);
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const currentProjectId = selectedProjectId || projectId;
    if (!currentProjectId) {
      toast.error('Please select a project first');
      return;
    }

    setUploadingImage(true);

    try {
      // Step 1: Get upload token from backend
      const tokenData = await getDocumentUploadToken({
        project_id: currentProjectId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      });

      if (!tokenData || !tokenData.upload_path) {
        throw new Error('Failed to get upload token');
      }

      console.log('📤 Uploading image to Supabase...', { upload_path: tokenData.upload_path });

      // Step 2: Upload to Supabase Storage (documents bucket)
      const uploadResult = await uploadFile(
        file,
        'documents',
        tokenData.upload_path,
        {
          contentType: file.type
        }
      );

      // Step 3: Get public URL
      const publicUrl = getPublicUrl('documents', tokenData.upload_path) || uploadResult.url;

      console.log('✅ Image uploaded, public URL:', publicUrl);

      // Step 4: Insert image into editor at cursor position
      const editorElement = document.getElementById('editor-content');
      if (editorElement) {
        try {
          const selection = window.getSelection();
          let range;
          
          if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
          } else {
            range = document.createRange();
            range.selectNodeContents(editorElement);
            range.collapse(false); // Move to end
          }
          
          const img = document.createElement('img');
          img.src = publicUrl;
          img.alt = file.name;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '10px 0';
          
          range.insertNode(img);
          
          // Move cursor after image
          range.setStartAfter(img);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Update content state
          setContent(editorElement.innerHTML);
          editorElement.focus();
        } catch (insertError) {
          console.warn('Failed to insert at cursor, inserting at end:', insertError);
          // Fallback: append to end
          const img = document.createElement('img');
          img.src = publicUrl;
          img.alt = file.name;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '10px 0';
          editorElement.appendChild(img);
          setContent(editorElement.innerHTML);
        }
      }

      toast.success('Image uploaded and inserted successfully');
    } catch (error) {
      console.error('❌ Failed to upload image:', error);
      toast.error(error?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    const currentProjectId = selectedProjectId || projectId;
    console.log('💾 Save button clicked', { title, selectedProjectId, projectId: currentProjectId, projects, saving });
    
    if (!title || title.trim() === '') {
      toast.error('Please enter a title for the documentation');
      return;
    }

    if (!currentProjectId) {
      console.error('❌ No project ID available', { projects, selectedProjectId });
      toast.error('No project selected. Please select a project from the dropdown.');
      return;
    }

    // Get the HTML content from the editor
    const editorElement = document.getElementById('editor-content');
    const htmlContent = editorElement?.innerHTML || content || '<p>Start writing your documentation...</p>';
    
    console.log('📝 Content check', { 
      htmlContent: htmlContent.substring(0, 100), 
      contentLength: htmlContent.length,
      isPlaceholder: htmlContent === '<p>Start writing your documentation...</p>'
    });
    
    // If content is just the placeholder, warn user
    if (htmlContent === '<p>Start writing your documentation...</p>' || htmlContent.trim() === '') {
      toast.error('Please add some content before saving');
      return;
    }

    setSaving(true);
    console.log('🚀 Starting save process...');

    try {
      // Convert HTML content to a Blob (text/html)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      const file = new File([blob], fileName, { type: 'text/html' });

      console.log('📄 File created', { fileName, fileSize: file.size, fileType: file.type });

      // Upload the document
      console.log('⬆️ Calling uploadDocumentFile...');
      const uploadedDoc = await uploadDocumentFile(
        currentProjectId,
        file,
        {
          title: title.trim(),
          tags: ['documentation', 'html']
        }
      );

      console.log('✅ Document uploaded successfully', uploadedDoc);

      // Refresh the document list
      console.log('🔄 Refreshing document list...');
      await loadDocuments(currentProjectId);

      toast.success('Documentation saved successfully!');
      router.push('/documents');
    } catch (error) {
      console.error('❌ Failed to save documentation:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        response: error?.response
      });
      toast.error(error?.message || 'Failed to save documentation. Please try again.');
    } finally {
      setSaving(false);
    }
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
          {projects && projects.length > 0 && (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                marginLeft: '12px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
                fontSize: '14px',
                minWidth: '200px',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name || project.title || 'Untitled Project'}
                </option>
              ))}
            </select>
          )}
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
          <button 
            className="editor-btn primary" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🔘 Save button clicked (onClick handler)');
              handleSave();
            }}
            disabled={saving}
            type="button"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          {(!projectId || !selectedProjectId) && projects && projects.length === 0 && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
              ⚠️ No project available. Please go to Projects and create a project first.
            </div>
          )}
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
            onClick={() => handleFormat('formatBlock', 'p')}
            title="Normal Paragraph"
          >
            <span style={{ fontSize: '14px', fontWeight: 'normal' }}>P</span>
          </button>
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
              imageInputRef.current?.click();
            }}
            disabled={uploadingImage}
            title="Upload Image"
          >
            {uploadingImage ? (
              <span style={{ fontSize: '12px' }}>⏳</span>
            ) : (
              <ImageIcon size={18} />
            )}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button
            className="toolbar-btn"
            onClick={() => {
              const editorElement = document.getElementById('editor-content');
              if (editorElement) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const container = range.commonAncestorContainer;
                  const codeBlock = container.nodeType === 3 
                    ? container.parentElement.closest('pre, code')
                    : container.closest('pre, code');
                  
                  if (codeBlock) {
                    // If already in code block, convert to paragraph
                    const text = codeBlock.textContent || codeBlock.innerText;
                    const p = document.createElement('p');
                    p.textContent = text;
                    codeBlock.parentNode.replaceChild(p, codeBlock);
                    setContent(editorElement.innerHTML);
                  } else {
                    // Create new code block
                    handleFormat('formatBlock', 'pre');
                  }
                } else {
                  handleFormat('formatBlock', 'pre');
                }
              }
            }}
            title="Code Block (click again to remove)"
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
            onInput={(e) => {
              const html = e.currentTarget.innerHTML;
              setContent(html);
            }}
            suppressContentEditableWarning
          />
        )}
      </div>
    </div>
  );
};

export default DocumentationEditor;

