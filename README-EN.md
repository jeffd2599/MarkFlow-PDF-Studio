# MarkFlow PDF Studio

[![PHP Version](https://img.shields.io/badge/php-8.0%2B-blue.svg)](https://php.net)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MarkFlow PDF Studio** is a professional, web-based Markdown editor designed for writers, developers, and academics who need a seamless bridge between writing in Markdown and producing high-fidelity PDF documents. It features a real-time, side-by-side preview, multiple document themes, and powerful, integrated AI editing capabilities powered by both Google Gemini and OpenRouter.

![MarkFlow Screenshot](https://via.placeholder.com/800x400.png?text=MarkFlow+PDF+Studio+Screenshot)
*(Screenshot placeholder: A preview of the application's interface)*

---

## ✨ Key Features

- **Live Markdown Preview**: A WYSIWYG (What You See Is What You Get) split-screen editor that renders Markdown as you type.
- **Multiple View Modes**: Switch between a split editor/preview, editor-only, or preview-only mode to suit your workflow.
- **Thematic Styling**: Choose from professional themes like `Modern`, `Academic`, or `Minimalist` to instantly format your document.
- **Syntax Highlighting**: Code blocks are automatically highlighted for over 100 languages, preserving readability and aesthetics.
- **AI-Powered Editing**:
  - **Provider Choice**: Seamlessly switch between Google Gemini and OpenRouter.
  - **Smart Fix**: Automatically correct spelling, grammar, and punctuation.
  - **AI Optimize**: Improve writing style for conciseness and professionalism.
- **High-Fidelity PDF Export**: Generate print-ready A4 documents directly from the preview pane with a single click.
- **Zero Dependencies**: Runs with a standard PHP/web server setup. All frontend libraries are loaded via CDN.

## 🛠️ Tech Stack

- **Backend**: PHP 8.0+ (for API handling)
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS (via CDN)
- **Markdown Parsing**: `marked.js`
- **Syntax Highlighting**: `highlight.js`
- **PDF Generation**: `html2pdf.js`

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- A web server with PHP 8.0 or newer (e.g., Apache, Nginx, or a local development server like Laragon, XAMPP).
- cURL extension for PHP enabled (for making API requests).

### Installation & Setup

1.  **Clone or Download the Code**
    - Place the contents of this directory (`mfs`) into a folder served by your web server (e.g., `htdocs`, `www`).

2.  **Configure Environment Variables**
    - In the root of this directory, you will find a file named `.env.example`.
    - Create a copy of this file and rename it to `.env`.
    ```bash
    cp .env.example .env
    ```
    - Open the new `.env` file and fill in your API keys.

3.  **Set Up API Keys**
    - **`GEMINI_API_KEY`**: 
      1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
      2. Click "Create API key" and copy the generated key.
    - **`OPENROUTER_API_KEY`**:
      1. Go to [OpenRouter.ai](https://openrouter.ai/keys).
      2. Log in and click "Create a Key".
      3. Copy the generated key.

    > **IMPORTANT**: Your web server must be configured to load these variables from the `.env` file. Common PHP servers do not do this by default. You may need to:
    > - Add a small PHP script to load the `.env` file (e.g., using `symfony/dotenv`).
    > - Or, set these as actual environment variables in your server's configuration (e.g., in your Apache `.htaccess` or Nginx `fastcgi_param`).

##  usage

1.  Navigate to the project's URL in your web browser.
2.  Write or paste your Markdown content into the editor pane on the left.
3.  Use the controls in the header to change the view mode and theme.
4.  To use the AI features:
    - Select your desired **AI Provider** (Gemini or OpenRouter).
    - Click **AI OPTIMIZE** or **SMART FIX**.
5.  Click **Export PDF** to download a high-quality PDF of your document.

## 🛣️ Future Roadmap

- [ ] Add a model selector for OpenRouter.
- [ ] Implement user-configurable prompts for AI actions.
- [ ] Add more themes and customization options.
- [ ] Explore a collaborative editing mode.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
