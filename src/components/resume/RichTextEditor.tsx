
import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const [editorValue, setEditorValue] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  // Apply custom styles for dark mode
  useEffect(() => {
    if (editorRef.current) {
      const isDarkMode = document.documentElement.classList.contains('dark');
      const editorElement = editorRef.current;
      
      if (isDarkMode) {
        // Add dark mode specific styles
        editorElement.querySelectorAll('.ql-editor').forEach(editor => {
          (editor as HTMLElement).style.color = 'white';
          (editor as HTMLElement).style.backgroundColor = '#1a2234';
        });
        
        editorElement.querySelectorAll('.ql-toolbar').forEach(toolbar => {
          (toolbar as HTMLElement).style.backgroundColor = '#0f172a';
          (toolbar as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        editorElement.querySelectorAll('.ql-stroke').forEach(item => {
          (item as SVGElement).setAttribute('stroke', 'rgba(255, 255, 255, 0.7)');
        });
        
        editorElement.querySelectorAll('.ql-fill').forEach(item => {
          (item as SVGElement).setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
        });

        editorElement.querySelectorAll('.ql-picker').forEach(item => {
          (item as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)';
        });
      }
    }
  }, [editorValue]); // Re-run when editor value changes

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <div ref={editorRef} className="rich-text-editor">
      <ReactQuill 
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white dark:bg-[#1a2234] dark:text-white rounded-md"
      />
      <style jsx global>{`
        .dark .ql-container {
          border-color: rgba(255, 255, 255, 0.1);
        }
        .dark .ql-toolbar {
          border-color: rgba(255, 255, 255, 0.1);
          background-color: #0f172a;
        }
        .dark .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.4);
        }
        .dark .ql-picker-label {
          color: rgba(255, 255, 255, 0.7);
        }
        .dark .ql-picker-options {
          background-color: #1a2234;
          border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
