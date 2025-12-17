<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MarkFlow PDF Studio</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/style.css">
    <!-- html2pdf CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <!-- highlight.js for syntax highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <!-- Marked.js CDN for Markdown parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body class="bg-gray-100 flex flex-col min-h-screen">
    <header class="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 class="text-2xl font-bold text-indigo-600">MarkFlow PDF Studio</h1>
        <div id="header-actions" class="flex items-center space-x-4">
            <!-- View Mode Buttons -->
            <div class="flex bg-slate-100 rounded-lg p-1 mr-4 border border-slate-200">
                <button id="split-view-btn" class="view-mode-btn px-4 py-1.5 text-xs font-bold rounded-md transition-all">Split</button>
                <button id="edit-view-btn" class="view-mode-btn px-4 py-1.5 text-xs font-bold rounded-md transition-all">Edit</button>
                <button id="preview-view-btn" class="view-mode-btn px-4 py-1.5 text-xs font-bold rounded-md transition-all">Preview</button>
            </div>
            
            <!-- Theme Selector -->
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Theme</span>
                <select id="theme-select" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-white transition-colors">
                    <option value="modern">Modern Professional</option>
                    <option value="academic">Academic Journal</option>
                    <option value="minimal">Clean Minimalist</option>
                </select>
            </div>

            <!-- Export PDF Button -->
            <button id="export-pdf-btn" class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all text-sm font-bold shadow-lg shadow-indigo-200 active:scale-95 ml-2">
                <!-- SVG Icon for Download -->
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export PDF
            </button>
        </div>
    </header>

    <main class="flex flex-1 overflow-hidden">
        <!-- Editor Section -->
        <div id="editor-section" class="flex flex-col h-full bg-[#fdfdfd] border-r border-slate-200 transition-all duration-300 relative overflow-hidden flex-1">
            <div class="h-10 border-b flex items-center justify-between px-6 bg-white shrink-0 z-10">
                <span class="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                    <!-- SVG Icon for Edit -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Source Markdown
                </span>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Provider</span>
                        <select id="ai-provider-select" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-white transition-colors">
                            <option value="gemini">Gemini</option>
                            <option value="openrouter">OpenRouter</option>
                        </select>
                    </div>
                    <button id="ai-optimize-btn" class="group relative flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all text-[11px] font-black disabled:opacity-50" title="Optimize with Gemini">
                        <!-- SVG Icon for Sparkles -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                        AI OPTIMIZE
                    </button>
                    <button id="ai-smartfix-btn" class="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-[11px] font-black disabled:opacity-50">
                        <!-- SVG Icon for Wand -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0-.83-.83-.83-2.17 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86c0-1 1.92-1.41 2.36-.51l1.24 2.54c.26.54.16 1.17-.28 1.6l-1.14 1.14Z"/><path d="M15 2h.01"/><path d="M18 5h.01"/><path d="M20 2h.01"/></svg>
                        SMART FIX
                    </button>
                </div>
            </div>
            <div class="flex-1 relative min-h-0 flex flex-col">
                <textarea id="markdown-editor" class="flex-1 p-8 pb-20 font-mono text-[14px] bg-transparent outline-none resize-none text-slate-800 leading-[1.6] overflow-y-auto w-full focus:bg-white transition-colors scroll-smooth" placeholder="Start writing your masterpiece in Markdown..." spellcheck="false"></textarea>
                <div class="absolute bottom-6 right-8 px-3 py-1.5 bg-white/90 backdrop-blur shadow-xl rounded-full border border-slate-200 text-[10px] font-black text-slate-500 pointer-events-none flex gap-4 ring-4 ring-slate-50/50">
                    <span id="char-count">0 CHARS</span>
                    <span id="word-count" class="border-l border-slate-200 pl-4">0 WORDS</span>
                </div>
            </div>
        </div>

        <!-- Preview Section -->
        <div id="preview-section" class="flex flex-col h-full overflow-hidden bg-slate-100 transition-all duration-300 flex-1">
             <div class="h-10 border-b flex items-center px-6 bg-white shrink-0 z-10">
                <span class="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <!-- SVG Icon for Eye -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Page Preview
                </span>
                <div class="ml-auto flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                       <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span class="text-[10px] font-bold text-slate-400">Live Sync</span>
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 bg-slate-200/50 flex flex-col items-center scroll-smooth">
                <div id="preview-content" class="prose max-w-none min-h-[297mm] bg-white p-16 shadow-2xl mx-auto transition-all duration-300 markdown-body" style="width: 210mm; min-height: 297mm; flex-shrink: 0;">
                    <!-- Markdown will be rendered here -->
                </div>
                <div class="h-20 shrink-0"></div> <!-- Extra space at the bottom of the preview area -->
            </div>
        </div>
    </main>

    <!-- AI Processing Spinner -->
    <div id="ai-processing-spinner" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-300 border border-white/10 z-50 hidden">
        <div class="relative">
            <div class="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 bg-indigo-500/20 blur-sm rounded-full animate-pulse"></div>
        </div>
        <div class="flex flex-col">
            <span class="text-sm font-black tracking-tight">Gemini Brainstorming...</span>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Applying professional edits</span>
        </div>
    </div>

    <!-- Main JavaScript -->
    <script src="assets/main.js"></script>
</body>
</html>