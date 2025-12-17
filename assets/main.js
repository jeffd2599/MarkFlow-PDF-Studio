document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element References
    const markdownEditor = document.getElementById('markdown-editor');
    const previewContent = document.getElementById('preview-content');
    const charCountSpan = document.getElementById('char-count');
    const wordCountSpan = document.getElementById('word-count');
    const aiProcessingSpinner = document.getElementById('ai-processing-spinner');
    
    const splitViewBtn = document.getElementById('split-view-btn');
    const editViewBtn = document.getElementById('edit-view-btn');
    const previewViewBtn = document.getElementById('preview-view-btn');
    
    const editorSection = document.getElementById('editor-section');
    const previewSection = document.getElementById('preview-section');
    
    const themeSelect = document.getElementById('theme-select');
    const aiProviderSelect = document.getElementById('ai-provider-select');
    const aiOptimizeBtn = document.getElementById('ai-optimize-btn');
    const aiSmartfixBtn = document.getElementById('ai-smartfix-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    // 2. Constants
    const INITIAL_MARKDOWN = `# MarkFlow PDF Studio

Welcome to the **professional-grade** Markdown to PDF environment. This tool now supports advanced syntax highlighting, GitHub Flavored Markdown, and nested components.

## 🚀 Key Features

*   **Syntax Highlighting**: Beautiful code blocks for 100+ languages.
*   **GFM Support**: Tables, task lists, and strikethrough are natively interpreted.
*   **AI Integration**: Powered by **Gemini 3 Flash** for instant document optimization.
*   **A4 Precision**: WYSIWYG preview calibrated for real-world printing.

---

### 💻 Code Demonstration

Here is a snippet showing the new highlighting engine:

\`\`\`typescript
interface DocumentOptions {
  theme: 'modern' | 'academic' | 'minimal';
  exportFormat: 'pdf' | 'html';
  aiEnabled: boolean;
}

const generateDoc = (opts: DocumentOptions) => {
  console.log("Preparing high-fidelity export...");
  return opts.aiEnabled ? "Enhanced Output" : "Standard Output";
};
\`\`\`

### 📊 Structured Data

| Element | Status | Compatibility |
| :--- | :---: | :--- |
| **Tables** | ✅ | GFM Standard |
| **Task Lists** | ✅ | Interactive |
| **Images** | ✅ | Responsive |
| **Footnotes** | ✅ | Academic |

### 📝 Project Goals
- [x] Implement real-time rendering
- [x] Add high-quality PDF export
- [ ] Add collaborative editing mode
- [x] Integrate AI for content polishing

> "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs

---

*Footnote: This document was generated using the MarkFlow Studio Engine.*
`;
    
    const ThemeClasses = {
        modern: "prose-indigo font-sans rounded-sm border-t-[12px] border-indigo-600",
        academic: "prose-slate font-serif text-justify border-t-[12px] border-slate-900",
        minimal: "prose-neutral font-sans p-20"
    };

    // 3. State Variables
    let currentMarkdown = INITIAL_MARKDOWN;
    let isProcessing = false;
    let currentViewMode = 'split'; // 'split', 'edit', 'preview'
    let currentTheme = 'modern'; // 'modern', 'academic', 'minimal'

    // Set initial markdown in editor
    markdownEditor.value = INITIAL_MARKDOWN;

    // Enable GFM and line breaks in marked.js
    marked.setOptions({
        gfm: true,
        breaks: true
    });

    // 4. updatePreview() Function
    const updatePreview = () => {
        // Use marked.js for Markdown to HTML conversion
        const html = marked.parse(markdownEditor.value);
        previewContent.innerHTML = html;

        // Force highlight.js to re-scan the new content
        previewContent.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Apply theme classes
        const baseClasses = "prose max-w-none min-h-[297mm] bg-white p-16 shadow-2xl mx-auto transition-all duration-300 markdown-body ";
        previewContent.className = baseClasses + (ThemeClasses[currentTheme] || ThemeClasses.modern);
    };

    // 5. updateCounts() Function
    const updateCounts = () => {
        const text = markdownEditor.value;
        charCountSpan.textContent = `${text.length} CHARS`;
        const words = text.split(/\s+/).filter(Boolean).length;
        wordCountSpan.textContent = `${words} WORDS`;
    };

    // 6. setViewMode() Function
    const setViewMode = (mode) => {
        currentViewMode = mode;
        
        // Update button active states
        [splitViewBtn, editViewBtn, previewViewBtn].forEach(btn => {
            if (btn.id.includes(mode)) {
                btn.className = `px-4 py-1.5 text-xs font-bold rounded-md transition-all bg-white text-indigo-600 shadow-md ring-1 ring-black/5`;
            } else {
                btn.className = `px-4 py-1.5 text-xs font-bold rounded-md transition-all text-slate-500 hover:text-indigo-500 hover:bg-white/50`;
            }
        });

        // Adjust section visibility and width
        if (mode === 'split') {
            editorSection.classList.remove('hidden', 'w-full');
            editorSection.classList.add('flex-1');
            previewSection.classList.remove('hidden', 'w-full');
            previewSection.classList.add('flex-1');
        } else if (mode === 'edit') {
            editorSection.classList.remove('hidden', 'flex-1');
            editorSection.classList.add('w-full');
            previewSection.classList.add('hidden');
        } else if (mode === 'preview') {
            editorSection.classList.add('hidden');
            previewSection.classList.remove('hidden', 'flex-1');
            previewSection.classList.add('w-full');
        }
    };

    // 7. setTheme() Function
    const setTheme = (theme) => {
        currentTheme = theme;
        themeSelect.value = theme; // Ensure select box reflects current theme
        updatePreview(); // Re-render to apply new theme classes
    };

    // 8. handleAIAction() Function
    const handleAIAction = async (instruction) => {
        if (isProcessing) return;

        isProcessing = true;
        aiProcessingSpinner.classList.remove('hidden');
        aiOptimizeBtn.disabled = true;
        aiSmartfixBtn.disabled = true;

        try {
            const provider = aiProviderSelect.value;
            const body = {
                content: markdownEditor.value,
                instruction: instruction,
                provider: provider
            };

            const response = await fetch('api/ai_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok && data.markdown) {
                markdownEditor.value = data.markdown;
                updatePreview();
                updateCounts();
            } else {
                console.error('AI API Error:', data.error || 'Unknown error');
                alert('Failed to process with AI: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Network or AI processing error:', error);
            alert('An error occurred during AI processing.');
        } finally {
            isProcessing = false;
            aiProcessingSpinner.classList.add('hidden');
            aiOptimizeBtn.disabled = false;
            aiSmartfixBtn.disabled = false;
        }
    };

    // 9. handleExportPDF() Function
    const handleExportPDF = () => {
        const element = previewContent;
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `document-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 3, 
                useCORS: true, 
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Check if html2pdf is available
        if (typeof html2pdf !== 'undefined') {
            html2pdf().from(element).set(opt).save();
        } else {
            alert('PDF export library not loaded. Please try again or check your connection.');
        }
    };

    // 10. Event Listeners Setup
    markdownEditor.addEventListener('input', () => {
        updatePreview();
        updateCounts();
    });

    splitViewBtn.addEventListener('click', () => setViewMode('split'));
    editViewBtn.addEventListener('click', () => setViewMode('edit'));
    previewViewBtn.addEventListener('click', () => setViewMode('preview'));

    themeSelect.addEventListener('change', (e) => setTheme(e.target.value));

    aiOptimizeBtn.addEventListener('click', () => handleAIAction("Improve writing style, making it more concise and professional. Maintain all markdown structure."));
    aiSmartfixBtn.addEventListener('click', () => handleAIAction("Review and fix all spelling, grammar, and punctuation errors in the text."));

    exportPdfBtn.addEventListener('click', handleExportPDF);

    // Initial setup calls
    updatePreview();
    updateCounts();
    setViewMode('split');
    setTheme('modern'); // Default theme
});
