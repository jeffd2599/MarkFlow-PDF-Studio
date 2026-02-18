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
    // const exportPdfBtn = document.getElementById('export-pdf-btn'); // OLD BUTTON
    const exportBtn = document.getElementById('export-btn'); // NEW BUTTON

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
    let currentMarkdown = localStorage.getItem('markdown_content') || INITIAL_MARKDOWN;
    let isProcessing = false;
    let currentViewMode = 'split'; // 'split', 'edit', 'preview'
    let currentTheme = 'modern'; // 'modern', 'academic', 'minimal'
    let isDarkMode = localStorage.getItem('dark_mode') === 'true';

    // 3.1. Initialize State
    markdownEditor.value = currentMarkdown;

    // Apply Dark Mode immediately
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }

    // Enable GFM and line breaks in marked.js
    marked.setOptions({
        gfm: true,
        breaks: true,
        highlight: function (code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    });

    // 4. updatePreview() Function
    const updatePreview = () => {
        const content = markdownEditor.value;
        // Persist content to localStorage
        localStorage.setItem('markdown_content', content);

        // Use marked.js for Markdown to HTML conversion
        const html = marked.parse(content);
        previewContent.innerHTML = html;

        // Apply theme classes
        const baseClasses = "prose dark:prose-invert max-w-none min-h-[297mm] bg-white p-16 shadow-2xl mx-auto transition-all duration-300 markdown-body ";
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
                btn.className = `px-4 py-1.5 text-xs font-bold rounded-md transition-all bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-black/5 dark:ring-white/10`;
            } else {
                btn.className = `px-4 py-1.5 text-xs font-bold rounded-md transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-white/50 dark:hover:bg-slate-800`;
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

    // --- Dark Mode Logic ---
    const toggleDarkMode = () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('dark_mode', isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const darkModeToggleBtn = document.getElementById('dark-mode-toggle');
    darkModeToggleBtn.addEventListener('click', toggleDarkMode);


    // --- API Key Management (Modal) ---
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const modelInput = document.getElementById('model-input');
    const modelInputContainer = document.getElementById('model-input-container');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalProviderName = document.getElementById('modal-provider-name');

    // Load Model from Storage
    if (modelInput) {
        modelInput.value = localStorage.getItem('openrouter_model') || 'mistralai/mistral-7b-instruct:free';
    }

    const getApiKey = (provider) => {
        return localStorage.getItem(`${provider}_api_key`);
    };

    const setApiKey = (provider, key) => {
        if (key) {
            localStorage.setItem(`${provider}_api_key`, key);
        }
    };

    const showApiKeyModal = (provider, onSave, onCancel) => {
        modalProviderName.textContent = provider === 'gemini' ? 'Google Gemini' : 'OpenRouter';
        apiKeyInput.value = getApiKey(provider) || ''; // Pre-fill if exists

        // Show/Hide Model Input based on provider
        if (provider === 'openrouter') {
            modelInputContainer.classList.remove('hidden');
        } else {
            modelInputContainer.classList.add('hidden');
        }

        // Show Modal
        apiKeyModal.classList.remove('hidden');
        // Small delay to allow display reset before opacity transition
        setTimeout(() => {
            apiKeyModal.classList.remove('opacity-0');
            apiKeyModal.querySelector('div').classList.remove('scale-95');
            apiKeyModal.querySelector('div').classList.add('scale-100');
        }, 10);

        apiKeyInput.focus();

        const closeAndReset = () => {
            apiKeyModal.classList.add('opacity-0');
            apiKeyModal.querySelector('div').classList.remove('scale-100');
            apiKeyModal.querySelector('div').classList.add('scale-95');
            setTimeout(() => {
                apiKeyModal.classList.add('hidden');
            }, 300);

            // Cleanup listeners to avoid duplicates
            modalSaveBtn.replaceWith(modalSaveBtn.cloneNode(true));
            modalCancelBtn.replaceWith(modalCancelBtn.cloneNode(true));
            // Re-assign references because replaceWith invalidates old ones
            document.getElementById('modal-save-btn').addEventListener('click', saveHandler);
            document.getElementById('modal-cancel-btn').addEventListener('click', cancelHandler);
        };

        const saveHandler = () => {
            const key = apiKeyInput.value.trim();
            const model = modelInput.value.trim();

            if (key) {
                setApiKey(provider, key);

                // Save model if OpenRouter
                if (provider === 'openrouter' && model) {
                    localStorage.setItem('openrouter_model', model);
                }

                closeAndReset();
                if (onSave) onSave(key);
            } else {
                apiKeyInput.classList.add('ring-2', 'ring-red-500');
                setTimeout(() => apiKeyInput.classList.remove('ring-2', 'ring-red-500'), 500);
            }
        };

        const cancelHandler = () => {
            closeAndReset();
            if (onCancel) onCancel();
        };

        // One-time listeners (reset via replaceWith above)
        modalSaveBtn.onclick = saveHandler;
        modalCancelBtn.onclick = cancelHandler;

        // Enter to save, Esc to cancel
        apiKeyInput.onkeydown = (e) => {
            if (e.key === 'Enter') saveHandler();
            if (e.key === 'Escape') cancelHandler();
        };
    };

    document.getElementById('api-key-btn').addEventListener('click', () => {
        const provider = aiProviderSelect.value;
        showApiKeyModal(provider, () => {
            alert(`Settings for ${provider} saved!`);
        });
    });

    // 8. handleAIAction() Function
    const handleAIAction = async (instruction) => {
        if (isProcessing) return;

        const provider = aiProviderSelect.value;
        let apiKey = getApiKey(provider);

        // Helper to execute the fetch
        const executeFetch = async (keyToUse) => {
            isProcessing = true;
            aiProcessingSpinner.classList.remove('hidden');
            aiOptimizeBtn.disabled = true;
            aiSmartfixBtn.disabled = true;

            try {
                const body = {
                    content: markdownEditor.value,
                    instruction: instruction,
                    provider: provider,
                    apiKey: keyToUse
                };

                // Add model if OpenRouter
                if (provider === 'openrouter') {
                    body.model = localStorage.getItem('openrouter_model') || 'mistralai/mistral-7b-instruct:free';
                }

                const response = await fetch('ai_handler.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok && data.markdown) {
                    markdownEditor.value = data.markdown;
                    updatePreview();
                    updateCounts();
                } else {
                    console.error('AI API Error:', data.error || 'Unknown error');
                    // Check for auth errors
                    if (data.error && (data.error.toLowerCase().includes('key') || data.http_code === 401 || data.http_code === 400)) {
                        showApiKeyModal(provider, (newKey) => {
                            // Retry with new key
                            executeFetch(newKey);
                        });
                    } else {
                        alert('Failed to process with AI: ' + (data.error || 'Unknown error'));
                    }
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

        if (!apiKey) {
            showApiKeyModal(provider, (newKey) => {
                executeFetch(newKey);
            });
            return; // Wait for modal callback
        }

        await executeFetch(apiKey);
    };

    // --- Export Logic ---
    // Modal inputs and tabs removed.
    // We strictly use the Image Export Button now.

    // We already have the 'exportBtn' reference from top of file.
    // And we have the listener added below.
    let processingExport = false;

    exportBtn.addEventListener('click', async () => {
        if (processingExport) return;
        processingExport = true;

        // Visual Feedback
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
        `;

        try {
            await handleImageExport();
        } catch (error) {
            console.error(error);
            alert('Export failed. Check console.');
        } finally {
            processingExport = false;
            exportBtn.innerHTML = originalText;
        }
    });

    // --- IMAGE EXPORT ONLY ---
    const handleImageExport = async () => {
        const element = previewContent;
        // Default to a reasonable width for the screenshot if not defined
        const docWidth = 210;

        // Clone to enforce styles for snapshot
        const clone = element.cloneNode(true);
        // We REMOVE dark mode to ensure a clean white screenshot, or keep it if 'preview' is dark?
        // User said "put what is in the preview", but usually screenshots are preferred clean.
        // Let's stick to the high-fidelity WYSIWYG approach for image too.

        // Ensure white background for the PNG
        clone.classList.remove('dark:prose-invert');
        clone.style.backgroundColor = '#ffffff';
        clone.style.color = '#000000';
        clone.style.width = '100%';
        clone.style.maxWidth = 'none';
        clone.style.padding = '40px';
        clone.style.margin = '0 auto';

        // Fix codes
        const codes = clone.querySelectorAll('code, pre');
        codes.forEach(block => {
            block.style.backgroundColor = '#f0f0f0';
            block.style.color = '#222';
            block.style.boxShadow = 'none';
            block.style.border = 'none';
        });

        // Add to temp container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '1200px'; // Fixed width for high res image
        container.appendChild(clone);
        document.body.appendChild(container);

        try {
            console.log(`Starting Image Export...`);
            if (!window.html2canvas) {
                throw new Error("html2canvas library not found.");
            }

            const canvas = await window.html2canvas(clone, {
                scale: 2, // Retina quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: container.scrollWidth
            });

            if (!canvas) throw new Error("Canvas creation failed");

            // Trigger Download
            const link = document.createElement('a');
            link.download = `markflow-export-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            console.log("Image Export successful.");

        } catch (err) {
            console.error("Image Export Error:", err);
            alert('Image Export failed.');
        } finally {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
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

    // exportPdfBtn.addEventListener('click', handleExportPDF); // REMOVED

    // Initial setup calls
    updatePreview();
    updateCounts();
    setViewMode('split');
    setTheme('modern'); // Default theme
});
