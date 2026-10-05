/**
 * VLearn Lab Day 18–19: Micro-Prototypes Human–AI Interaction
 * Core Application Logic, State Management, and Simulation Engine
 * Author: Trần Phạm Thái Vũ (MHV: 2A202602695) · Nhóm Tomorrow
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.AppModule = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // --- 1. DATA FIXTURES & CONSTANTS ---
  const INITIAL_SOURCE_CODE = `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Cloud Run Microservice!');
});

// DEFECT: Hardcoded port 3000 and bound to localhost
const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`;

  const CORRECT_PATCHED_CODE = `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Cloud Run Microservice!');
});

// FIXED: Read dynamic PORT from environment and bind to 0.0.0.0
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
});`;

  const FAULTY_DOCKER_CODE = `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Cloud Run Microservice!');
});

// DEFECT STILL PRESENT: Dockerfile ENV was changed, but code still hardcodes 3000 on localhost
const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`;

  // Canned Search Knowledge Base for Option A
  const CANNED_SEARCH_DB = [
    {
      keywords: ['port', 'cổng', 'biến môi trường', 'env', 'process.env'],
      title: 'Google Cloud Run: Configuring Container Services & Port Contract',
      snippet: 'Cloud Run tự động tiêm biến môi trường PORT (mặc định 8080) vào container runtime. Ứng dụng phải đọc biến này qua process.env.PORT || 8080. Cấu hình cứng cổng 3000 sẽ khiến ingress health check thất bại.',
      url: 'https://docs.cloud.google.com/run/docs/configuring/services/containers'
    },
    {
      keywords: ['localhost', '0.0.0.0', 'host', 'ip', 'địa chỉ', 'listen'],
      title: 'Google Cloud Run Container Contract: Listening on 0.0.0.0',
      snippet: 'Cloud Run yêu cầu container phải lắng nghe trên 0.0.0.0 (tất cả network interface). Việc bind vào localhost (127.0.0.1) chỉ nhận kết nối nội bộ từ chính container, khiến bộ điều hướng bên ngoài không thể gửi lưu lượng đến dịch vụ.',
      url: 'https://docs.cloud.google.com/run/docs/container-contract#port'
    },
    {
      keywords: ['docker', 'dockerfile', 'expose'],
      title: 'Docker Documentation: EXPOSE Instruction & Metadata',
      snippet: 'Lệnh EXPOSE trong Dockerfile chỉ mang tính tài liệu hóa (metadata) cho người đọc. EXPOSE không thực sự mở cổng hoặc làm thay đổi cổng mà ứng dụng Node.js đang lắng nghe trong server.js.',
      url: 'https://docs.docker.com/reference/dockerfile/#expose'
    },
    {
      keywords: ['health check', 'timeout', 'crash', 'exit code 1', 'error'],
      title: 'Cloud Run Troubleshooting: Container Failed to Start',
      snippet: 'Lỗi "Container failed to start listening on port 8080" thường do 2 nguyên nhân cốt lõi: (1) Ứng dụng lắng nghe cổng khác 8080; (2) Ứng dụng chỉ lắng nghe trên localhost thay vì 0.0.0.0.',
      url: 'https://docs.cloud.google.com/run/docs/troubleshooting#container-failed-to-start'
    }
  ];

  // In-Memory Storage Fallback when sessionStorage is blocked
  let inMemoryScratchpad = '';

  function safeGetStorage(key) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const val = sessionStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Storage blocked or file:// restriction
    }
    return inMemoryScratchpad;
  }

  function safeSetStorage(key, val) {
    inMemoryScratchpad = val || '';
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, val);
      }
    } catch (e) {
      // Silently fall back to inMemoryScratchpad
    }
  }

  // --- 2. DETERMINISTIC CODE BUILDER FOR OPTION B ---
  function buildOptionBCode(step1Snippet, step2Snippet) {
    const portPart = (step1Snippet && step1Snippet.trim()) ? step1Snippet.trim() : 'const PORT = 3000;';
    const listenPart = (step2Snippet && step2Snippet.trim()) ? step2Snippet.trim() : `app.listen(PORT, 'localhost', () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`;

    return `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Cloud Run Microservice!');
});

// Port configuration
${portPart}
${listenPart}`;
  }

  // --- 3. EXACT TEACHING FIXTURE VALIDATION ENGINE ---
  // Safely evaluates the specific Cloud Run teaching fixture without executing untrusted user code
  // Canonicalize non-comment lines of code for deterministic fixture matching
  function canonicalizeFixtureCode(codeString) {
    if (!codeString || typeof codeString !== 'string') return '';
    return codeString
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        if (!trimmed) return false;
        // Strip standalone single-line comment lines only
        if (trimmed.startsWith('//')) return false;
        return true;
      })
      .map(line => line.trim())
      .join('\n');
  }

  // Exact template/anchored pattern check for the teaching fixture
  // Rejects syntax malformed/empty/comment-only/spoof-marker code without executing untrusted code
  function validateCode(codeString) {
    if (!codeString || typeof codeString !== 'string' || codeString.trim() === '') {
      return {
        success: false,
        reason: 'Mã nguồn rỗng hoặc không hợp lệ. Vui lòng nhập mã Node.js hợp lệ.'
      };
    }

    // Reject block comments (/* or */) as unsupported to prevent partial/unclosed comment bypasses
    if (codeString.includes('/*') || codeString.includes('*/')) {
      return {
        success: false,
        reason: '[UNSUPPORTED PATTERN] Chú thích dạng khối (/* ... */) không được hỗ trợ trong bài tập này. Vui lòng chỉ sử dụng chú thích dòng (//) hoặc xóa bỏ chú thích.'
      };
    }

    const canonical = canonicalizeFixtureCode(codeString);

    if (canonical === '') {
      return {
        success: false,
        reason: 'Mã nguồn chỉ chứa chú thích (comments) hoặc rỗng. Không có mã thực thi nào được tìm thấy.'
      };
    }

    // Exact Express header pattern required by the teaching fixture
    const headerPrefix = "const express = require('express');\nconst app = express();\napp.get('/', (req, res) => {\nres.send('Hello from Cloud Run Microservice!');\n});";
    const headerPrefixDouble = 'const express = require("express");\nconst app = express();\napp.get("/", (req, res) => {\nres.send("Hello from Cloud Run Microservice!");\n});';

    let remainder = '';
    if (canonical.startsWith(headerPrefix)) {
      remainder = canonical.slice(headerPrefix.length).trim();
    } else if (canonical.startsWith(headerPrefixDouble)) {
      remainder = canonical.slice(headerPrefixDouble.length).trim();
    } else {
      return {
        success: false,
        reason: '[UNSUPPORTED PATTERN] Mã nguồn không khớp với mẫu hình cấu trúc tệp server.js được hỗ trợ trong bài tập này. Vui lòng giữ đúng khung tệp mẫu của bài học và chỉ sửa dòng khai báo PORT và app.listen.'
      };
    }

    // Remainder must consist of EXACTLY: <PORT_DECLARATION>\n<LISTEN_BLOCK>
    // Nothing more, nothing less. Any appended syntax garbage or trailing '});' will fail to match.
    const portMatch = remainder.match(/^const\s+PORT\s*=\s*(3000|process\.env(?:\.PORT|\['PORT'\]|\["PORT"\])(?:\s*\|\|\s*([0-9]{1,5}))?)\s*;?\n([\s\S]*)$/);
    if (!portMatch) {
      return {
        success: false,
        reason: '[UNSUPPORTED PATTERN] Cú pháp khai báo biến PORT không khớp với bài tập. Vui lòng sử dụng cú pháp: const PORT = process.env.PORT || 8080;'
      };
    }

    const rawPortVal = portMatch[1];
    const numericFallback = portMatch[2];
    const listenPart = portMatch[3].trim();

    // Check if numeric fallback is out of range 1..65535
    if (numericFallback) {
      const portNum = parseInt(numericFallback, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return {
          success: false,
          reason: `Cổng dự phòng '${numericFallback}' không hợp lệ. Cổng TCP phải nằm trong khoảng 1 đến 65535.`
        };
      }
    }

    // Supported listen block must match exact fixture structure with restricted logging statement:
    // app.listen(PORT, '0.0.0.0' | 'localhost' | '127.0.0.1', () => {
    // console.log(`...` or '...' or "...");
    // });
    // Logging statement is restricted to exact permitted backtick template with ${PORT} or simple literal string matching same quote delimiter.
    const listenMatch = listenPart.match(/^app\.listen\(\s*PORT\s*,\s*(['"]0\.0\.0\.0['"]|['"]localhost['"]|['"]127\.0\.0\.1['"])\s*,\s*\(\)\s*=>\s*\{\s*\nconsole\.log\(\s*(?:`(?:[^`\\$\r\n]|\$\{PORT\})*`|'[^'\\\r\n]*'|"[^"\\\r\n]*")\s*\)\s*;?\s*\n\}\);?$/);
    if (!listenMatch) {
      return {
        success: false,
        reason: '[UNSUPPORTED PATTERN] Khối lệnh app.listen không khớp với mẫu hình chuẩn của bài tập hoặc chứa ký tự thừa. Vui lòng kiểm tra lại cấu trúc đóng ngoặc và câu lệnh console.log.'
      };
    }

    const hostArg = listenMatch[1];
    const isHardcoded3000 = (rawPortVal === '3000');
    const isLocalhost = (hostArg === "'localhost'" || hostArg === '"localhost"' || hostArg === "'127.0.0.1'" || hostArg === '"127.0.0.1"');
    const isZeroHost = (hostArg === "'0.0.0.0'" || hostArg === '"0.0.0.0"');

    if (isHardcoded3000 && isLocalhost) {
      return {
        success: false,
        reason: 'Mã nguồn vẫn chứa lỗi gốc của bài tập: hardcode PORT = 3000 và bind localhost.'
      };
    }

    if (isHardcoded3000) {
      return {
        success: false,
        reason: 'Mã nguồn vẫn đang hardcode PORT = 3000. Cloud Run yêu cầu đọc biến môi trường PORT (mặc định 8080).'
      };
    }

    if (isLocalhost) {
      return {
        success: false,
        reason: 'Mã nguồn vẫn đang bind vào localhost (127.0.0.1). Cloud Run yêu cầu bind vào 0.0.0.0 để nhận lưu lượng từ bộ định tuyến.'
      };
    }

    if (isZeroHost && !isHardcoded3000) {
      return {
        success: true,
        message: '[SIMULATION SUCCESS] Khớp mẫu hình sửa lỗi chuẩn của bài tập Cloud Run! Container mô phỏng sẽ đọc PORT và lắng nghe trên 0.0.0.0:8080. (Lưu ý: Đây là kiểm tra khớp mẫu giáo cụ định sẵn trong lab, không phải thực thi mã nguồn hay deploy Cloud Run thật).'
      };
    }

    return {
      success: false,
      reason: '[UNSUPPORTED PATTERN] Mã nguồn chưa đáp ứng yêu cầu cấu hình Cloud Run.'
    };
  }

  function isValidPortSnippet(snippet) {
    if (!snippet || typeof snippet !== 'string') return false;
    if (snippet.includes('/*') || snippet.includes('*/')) return false;
    const canonical = canonicalizeFixtureCode(snippet);
    const match = canonical.match(/^const\s+PORT\s*=\s*process\.env(?:\.PORT|\['PORT'\]|\["PORT"\])(?:\s*\|\|\s*([0-9]{1,5}))?\s*;?$/);
    if (!match) return false;
    if (match[1]) {
      const num = parseInt(match[1], 10);
      if (isNaN(num) || num < 1 || num > 65535) return false;
    }
    return true;
  }

  function isValidListenSnippet(snippet) {
    if (!snippet || typeof snippet !== 'string') return false;
    if (snippet.includes('/*') || snippet.includes('*/')) return false;
    const canonical = canonicalizeFixtureCode(snippet);
    return /^app\.listen\(\s*PORT\s*,\s*['"]0\.0\.0\.0['"]\s*,\s*\(\)\s*=>\s*\{\s*\nconsole\.log\(\s*(?:`(?:[^`\\$\r\n]|\$\{PORT\})*`|'[^'\\\r\n]*'|"[^"\\\r\n]*")\s*\)\s*;?\s*\n\}\s*\)\s*;?$/.test(canonical);
  }

  function searchCannedKnowledge(query) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return {
        status: 'empty',
        results: [],
        message: 'Vui lòng nhập từ khóa để tra cứu tài liệu (ví dụ: PORT, localhost, 0.0.0.0, Dockerfile).'
      };
    }

    const cleanQuery = query.trim().toLowerCase();
    const matched = CANNED_SEARCH_DB.filter(entry => 
      entry.keywords.some(kw => cleanQuery.includes(kw) || kw.includes(cleanQuery))
    );

    if (matched.length === 0) {
      return {
        status: 'no_match',
        results: [],
        message: `Không tìm thấy tài liệu phù hợp trong bộ ngữ cảnh mẫu cho từ khóa "${escapeHtml(query)}". Hãy thử các từ khóa: PORT, localhost, 0.0.0.0, Dockerfile.`
      };
    }

    return {
      status: 'success',
      results: matched,
      message: `Tìm thấy ${matched.length} tài liệu đối chiếu liên quan:`
    };
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- 4. STATE FACTORY ---
  function createInitialState() {
    return {
      currentTab: 'A',
      observerOpen: false,
      code: {
        A: INITIAL_SOURCE_CODE,
        B: INITIAL_SOURCE_CODE,
        C: INITIAL_SOURCE_CODE
      },
      optA: {
        checklistVisible: false,
        checkedItems: { port: false, host: false, dockerfile: false },
        searchQuery: '',
        searchResults: []
      },
      optB: {
        started: false,
        diagAnswered: false,
        diagChoice: '',
        currentStep: 1, // 1, 2, 3
        stepProgress: { 1: false, 2: false, 3: false }, // true = confirmed, false = skipped/unconfirmed
        snippets: {
          1: null, // confirmed string
          2: null
        },
        stopped: false,
        completed: false,
        alternativeMode: false
      },
      optC: {
        scenario: 'normal', // 'normal' (92% confidence) | 'uncertain' (45% confidence)
        applied: false,
        customizing: false,
        rejected: false,
        reportedWrong: false,
        lastActionMessage: ''
      }
    };
  }

  // --- 5. CONTROLLER FACTORY (Attached to DOM or Stub) ---
  function createController(domDocument, customState) {
    const doc = domDocument || (typeof document !== 'undefined' ? document : null);
    const state = customState || createInitialState();

    if (!doc) {
      return { state, validateCode, searchCannedKnowledge, buildOptionBCode, escapeHtml };
    }

    // Top elements
    const toggleObserverBtn = doc.getElementById('toggle-observer-btn');
    const closeObserverBtn = doc.getElementById('close-observer-btn');
    const observerDrawer = doc.getElementById('observer-drawer');
    const scratchpad = doc.getElementById('observer-scratchpad');

    // Code Editor elements
    const codeEditorInput = doc.getElementById('code-editor-input');
    const editorStatusIndicator = doc.getElementById('editor-status-indicator');
    const validateCodeBtn = doc.getElementById('validate-code-btn');
    const resetCodeBtn = doc.getElementById('reset-code-btn');
    const deployResultMessage = doc.getElementById('deploy-result-message');

    // Tabs
    const tabBtns = {
      A: doc.getElementById('tab-opt-a'),
      B: doc.getElementById('tab-opt-b'),
      C: doc.getElementById('tab-opt-c')
    };
    const panels = {
      A: doc.getElementById('panel-opt-a'),
      B: doc.getElementById('panel-opt-b'),
      C: doc.getElementById('panel-opt-c')
    };

    // Helper to log automatically to scratchpad
    function appendToScratchpad(note) {
      const current = safeGetStorage('observer_notes');
      const updated = current ? `${current}\n${note}` : note;
      safeSetStorage('observer_notes', updated);
      if (scratchpad) {
        scratchpad.value = updated;
      }
    }

    // --- Observer Drawer Logic ---
    function toggleObserver(open) {
      state.observerOpen = (open !== undefined) ? open : !state.observerOpen;
      if (observerDrawer && toggleObserverBtn) {
        if (state.observerOpen) {
          observerDrawer.classList.remove('hidden');
          toggleObserverBtn.setAttribute('aria-expanded', 'true');
          if (closeObserverBtn && typeof closeObserverBtn.focus === 'function') {
            closeObserverBtn.focus();
          }
        } else {
          observerDrawer.classList.add('hidden');
          toggleObserverBtn.setAttribute('aria-expanded', 'false');
          if (typeof toggleObserverBtn.focus === 'function') {
            toggleObserverBtn.focus();
          }
        }
      }
    }

    if (toggleObserverBtn && closeObserverBtn) {
      toggleObserverBtn.addEventListener('click', () => toggleObserver());
      closeObserverBtn.addEventListener('click', () => toggleObserver(false));
    }

    if (scratchpad) {
      scratchpad.value = safeGetStorage('observer_notes');
      scratchpad.addEventListener('input', (e) => {
        safeSetStorage('observer_notes', e.target.value);
      });
    }

    // --- Tab Switching Logic ---
    function switchTab(targetTab) {
      if (!['A', 'B', 'C'].includes(targetTab)) return;
      state.currentTab = targetTab;

      Object.keys(tabBtns).forEach(k => {
        if (tabBtns[k] && panels[k]) {
          const isCurrent = (k === targetTab);
          tabBtns[k].classList.toggle('active', isCurrent);
          tabBtns[k].setAttribute('aria-selected', isCurrent ? 'true' : 'false');
          panels[k].classList.toggle('active', isCurrent);
        }
      });

      updateCodeEditorView();
    }

    Object.keys(tabBtns).forEach(k => {
      if (tabBtns[k]) {
        tabBtns[k].addEventListener('click', () => switchTab(k));
      }
    });

    // --- Code Editor Sync & Validation ---
    function updateCodeEditorView() {
      if (!codeEditorInput) return;
      const currentCode = state.code[state.currentTab];
      codeEditorInput.value = currentCode;
      
      const isOriginal = (currentCode === INITIAL_SOURCE_CODE);
      if (editorStatusIndicator) {
        editorStatusIndicator.textContent = `Option ${state.currentTab} - ${isOriginal ? 'Mã nguồn ban đầu (chưa sửa)' : 'Mã nguồn đã được chỉnh sửa'}`;
      }
      if (deployResultMessage) {
        deployResultMessage.className = 'deploy-message hidden';
        deployResultMessage.textContent = '';
      }
    }

    if (codeEditorInput) {
      codeEditorInput.addEventListener('input', (e) => {
        state.code[state.currentTab] = e.target.value;
        if (editorStatusIndicator) {
          editorStatusIndicator.textContent = `Option ${state.currentTab} - Đã chỉnh sửa trực tiếp qua bàn phím`;
        }
      });
    }

    if (resetCodeBtn) {
      resetCodeBtn.addEventListener('click', () => {
        state.code[state.currentTab] = INITIAL_SOURCE_CODE;
        updateCodeEditorView();
        if (deployResultMessage) {
          deployResultMessage.className = 'deploy-message info';
          deployResultMessage.textContent = `Đã khôi phục mã nguồn ban đầu cho Option ${state.currentTab}.`;
          deployResultMessage.classList.remove('hidden');
        }
      });
    }

    if (validateCodeBtn) {
      validateCodeBtn.addEventListener('click', () => {
        const currentCode = state.code[state.currentTab];
        const result = validateCode(currentCode);

        if (deployResultMessage) {
          deployResultMessage.classList.remove('hidden');
          if (result.success) {
            deployResultMessage.className = 'deploy-message success';
            deployResultMessage.textContent = result.message;
          } else {
            deployResultMessage.className = 'deploy-message fail';
            deployResultMessage.textContent = `[SIMULATION FAILED] Deploy thất bại: ${result.reason}`;
          }
        }
      });
    }

    // --- OPTION A CONTROLLER ---
    const optATriggerBtn = doc.getElementById('opt-a-trigger-btn');
    const optAResetBtn = doc.getElementById('opt-a-reset-btn');
    const optAChecklistBox = doc.getElementById('opt-a-checklist-box');
    const chkPort = doc.getElementById('chk-port');
    const chkHost = doc.getElementById('chk-host');
    const chkDockerfile = doc.getElementById('chk-dockerfile');
    const optASearchInput = doc.getElementById('opt-a-search-input');
    const optASearchBtn = doc.getElementById('opt-a-search-btn');
    const optASearchResults = doc.getElementById('opt-a-search-results');

    if (optATriggerBtn && optAChecklistBox) {
      optATriggerBtn.addEventListener('click', () => {
        state.optA.checklistVisible = true;
        optAChecklistBox.classList.remove('hidden');
      });
    }

    if (optAResetBtn) {
      optAResetBtn.addEventListener('click', () => {
        state.optA.checklistVisible = false;
        if (optAChecklistBox) optAChecklistBox.classList.add('hidden');
        if (chkPort) chkPort.checked = false;
        if (chkHost) chkHost.checked = false;
        if (chkDockerfile) chkDockerfile.checked = false;
        state.optA.checkedItems = { port: false, host: false, dockerfile: false };
        if (optASearchInput) optASearchInput.value = '';
        if (optASearchResults) {
          optASearchResults.innerHTML = '<p class="empty-state">Chưa có truy vấn nào. Hãy nhập từ khóa hoặc bấm vào checklist để tra cứu.</p>';
        }
        state.code.A = INITIAL_SOURCE_CODE;
        if (state.currentTab === 'A') updateCodeEditorView();
      });
    }

    function executeOptionASearch() {
      if (!optASearchInput || !optASearchResults) return;
      const query = optASearchInput.value;
      const searchRes = searchCannedKnowledge(query);

      optASearchResults.innerHTML = '';
      const summaryMsg = doc.createElement('p');
      summaryMsg.className = 'caption';
      summaryMsg.textContent = searchRes.message;
      optASearchResults.appendChild(summaryMsg);

      if (searchRes.results.length > 0) {
        searchRes.results.forEach(item => {
          const card = doc.createElement('div');
          card.className = 'search-result-card';

          const h4 = doc.createElement('h4');
          h4.textContent = item.title;
          card.appendChild(h4);

          const p = doc.createElement('p');
          p.textContent = item.snippet;
          card.appendChild(p);

          const linkDiv = doc.createElement('div');
          linkDiv.className = 'citation-tag';
          const a = doc.createElement('a');
          a.href = item.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = '📖 Mở tài liệu chính thức';
          linkDiv.appendChild(a);
          card.appendChild(linkDiv);

          optASearchResults.appendChild(card);
        });
      }
    }

    if (optASearchBtn) {
      optASearchBtn.addEventListener('click', executeOptionASearch);
    }
    if (optASearchInput) {
      optASearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeOptionASearch();
        }
      });
    }

    // --- OPTION B CONTROLLER ---
    const optBStartBtn = doc.getElementById('opt-b-start-btn');
    const optBTriggerContainer = doc.getElementById('opt-b-trigger-container');
    const optBDiagnosticBox = doc.getElementById('opt-b-diagnostic-box');
    const optBSubmitDiagBtn = doc.getElementById('opt-b-submit-diag-btn');
    const optBDiagFeedback = doc.getElementById('opt-b-diag-feedback');
    const optBMicrostepsBox = doc.getElementById('opt-b-microsteps-box');
    const optBStoppedBox = doc.getElementById('opt-b-stopped-box');
    const optBResumeBtn = doc.getElementById('opt-b-resume-btn');
    const optBRestartBtn = doc.getElementById('opt-b-restart-btn');

    const stepCards = {
      1: doc.getElementById('microstep-card-1'),
      2: doc.getElementById('microstep-card-2'),
      3: doc.getElementById('microstep-card-3')
    };

    const progSteps = {
      1: doc.getElementById('prog-step-1'),
      2: doc.getElementById('prog-step-2'),
      3: doc.getElementById('prog-step-3')
    };

    const step1CodeEdit = doc.getElementById('step1-code-edit');
    const step1ErrorMsg = doc.getElementById('step1-error-msg');
    const step1ConfirmBtn = doc.getElementById('step1-confirm-btn');
    const step1SkipBtn = doc.getElementById('step1-skip-btn');
    const step1StopBtn = doc.getElementById('step1-stop-btn');

    const step2CodeEdit = doc.getElementById('step2-code-edit');
    const step2ErrorMsg = doc.getElementById('step2-error-msg');
    const step2BackBtn = doc.getElementById('step2-back-btn');
    const step2ConfirmBtn = doc.getElementById('step2-confirm-btn');
    const step2SkipBtn = doc.getElementById('step2-skip-btn');
    const step2StopBtn = doc.getElementById('step2-stop-btn');

    const step3BackBtn = doc.getElementById('step3-back-btn');
    const step3ConfirmBtn = doc.getElementById('step3-confirm-btn');
    const step3AltBtn = doc.getElementById('step3-alt-btn');
    const step3StopBtn = doc.getElementById('step3-stop-btn');
    const optBAltPanel = doc.getElementById('opt-b-alt-panel');
    const optBNavToABtn = doc.getElementById('opt-b-nav-to-a-btn');

    const microstepsCompleteBox = doc.getElementById('microsteps-complete-box');
    const completionSummaryTitle = doc.getElementById('completion-summary-title');
    const completionSummaryDesc = doc.getElementById('completion-summary-desc');
    const completionStepsList = doc.getElementById('completion-steps-list');
    const optBResetStepsBtn = doc.getElementById('opt-b-reset-steps-btn');

    if (optBStartBtn) {
      optBStartBtn.addEventListener('click', () => {
        state.optB.started = true;
        if (optBTriggerContainer) optBTriggerContainer.classList.add('hidden');
        if (optBDiagnosticBox) optBDiagnosticBox.classList.remove('hidden');
      });
    }

    if (optBSubmitDiagBtn) {
      optBSubmitDiagBtn.addEventListener('click', () => {
        const selectedRadio = doc.querySelector('input[name="diag-answer"]:checked');
        if (!selectedRadio) {
          alert('Vui lòng chọn 1 nhận định trong câu hỏi chẩn đoán để tiếp tục.');
          return;
        }
        state.optB.diagAnswered = true;
        state.optB.diagChoice = selectedRadio.value;

        // Display contextual feedback based on answer
        if (optBDiagFeedback) {
          optBDiagFeedback.classList.remove('hidden');
          if (selectedRadio.value === 'unsure') {
            optBDiagFeedback.innerHTML = '<strong>💡 Nhận định của AI theo câu trả lời "Chưa rõ":</strong> Cloud Run tự động tiêm cổng qua biến môi trường <code>PORT</code> và yêu cầu lắng nghe trên địa chỉ mở <code>0.0.0.0</code>. Lộ trình 3 bước dưới đây sẽ hướng dẫn bạn giải quyết cặn kẽ 2 điểm này.';
          } else if (selectedRadio.value === 'env-port') {
            optBDiagFeedback.innerHTML = '<strong>💡 Nhận định của AI theo câu trả lời "Đã đọc PORT nhưng bind localhost":</strong> Trong tệp <code>server.js</code> của bài tập này, mã nguồn thực tế vẫn đang gắn cứng <code>PORT = 3000</code> và bind <code>localhost</code> (chưa đọc PORT). Chúng ta sẽ cùng sửa khai báo PORT ở Bước 1 và sửa host bind sang <code>0.0.0.0</code> ở Bước 2.';
          } else {
            optBDiagFeedback.innerHTML = '<strong>💡 Nhận định của AI theo câu trả lời "Hardcode 3000 & localhost":</strong> Container đang gặp cả 2 rào cản cổng và địa chỉ mạng. Chúng ta sẽ lần lượt sửa từng dòng một qua 3 bước dưới đây.';
          }
        }

        if (optBDiagnosticBox) optBDiagnosticBox.classList.add('hidden');
        if (optBMicrostepsBox) optBMicrostepsBox.classList.remove('hidden');
        renderOptionBStep(1);
      });
    }

    function renderOptionBStep(stepNum) {
      state.optB.currentStep = stepNum;
      state.optB.stopped = false;

      if (optBStoppedBox) optBStoppedBox.classList.add('hidden');
      if (microstepsCompleteBox) microstepsCompleteBox.classList.add('hidden');

      [1, 2, 3].forEach(s => {
        if (stepCards[s]) {
          const isActive = (s === stepNum);
          stepCards[s].classList.toggle('hidden', !isActive);
          if (isActive && typeof stepCards[s].focus === 'function') {
            stepCards[s].focus();
          }
        }
        if (progSteps[s]) {
          progSteps[s].classList.toggle('active', s === stepNum);
          if (state.optB.stepProgress[s]) {
            progSteps[s].classList.add('done');
          } else {
            progSteps[s].classList.remove('done');
          }
        }
      });
    }

    function stopOptionBGuidance() {
      state.optB.stopped = true;
      [1, 2, 3].forEach(s => {
        if (stepCards[s]) stepCards[s].classList.add('hidden');
      });
      if (optBStoppedBox) optBStoppedBox.classList.remove('hidden');
      appendToScratchpad(`[Tự động ghi nhận]: Tester bấm "Dừng hướng dẫn" tại Option B (Bước ${state.optB.currentStep}).`);
    }

    if (optBResumeBtn) {
      optBResumeBtn.addEventListener('click', () => {
        renderOptionBStep(state.optB.currentStep);
      });
    }

    if (optBRestartBtn) {
      optBRestartBtn.addEventListener('click', () => {
        resetOptionB();
      });
    }

    // Step 1 Confirm & Skip & Stop
    if (step1ConfirmBtn) {
      step1ConfirmBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        const snippet = step1CodeEdit ? step1CodeEdit.value.trim() : '';
        if (!isValidPortSnippet(snippet)) {
          if (step1ErrorMsg) {
            step1ErrorMsg.textContent = "Lỗi: Đoạn mã Bước 1 phải có dạng 'const PORT = process.env.PORT || 8080;' (cổng dự phòng từ 1 đến 65535).";
            step1ErrorMsg.classList.remove('hidden');
          }
          return;
        }
        if (step1ErrorMsg) step1ErrorMsg.classList.add('hidden');

        state.optB.snippets[1] = snippet;
        state.optB.stepProgress[1] = true;
        state.code.B = buildOptionBCode(state.optB.snippets[1], state.optB.snippets[2]);
        if (state.currentTab === 'B') updateCodeEditorView();
        renderOptionBStep(2);
      });
    }

    if (step1SkipBtn) {
      step1SkipBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        // Skip explicitly does NOT mark step as confirmed
        state.optB.stepProgress[1] = false;
        renderOptionBStep(2);
      });
    }

    if (step1StopBtn) {
      step1StopBtn.addEventListener('click', stopOptionBGuidance);
    }

    // Step 2 Confirm & Back & Skip & Stop
    if (step2BackBtn) {
      step2BackBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        renderOptionBStep(1);
      });
    }

    if (step2ConfirmBtn) {
      step2ConfirmBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        const snippet = step2CodeEdit ? step2CodeEdit.value.trim() : '';
        if (!isValidListenSnippet(snippet)) {
          if (step2ErrorMsg) {
            step2ErrorMsg.textContent = "Lỗi: Đoạn mã Bước 2 phải có dạng 'app.listen(PORT, \'0.0.0.0\', () => { ... });'.";
            step2ErrorMsg.classList.remove('hidden');
          }
          return;
        }
        if (step2ErrorMsg) step2ErrorMsg.classList.add('hidden');

        state.optB.snippets[2] = snippet;
        state.optB.stepProgress[2] = true;
        state.code.B = buildOptionBCode(state.optB.snippets[1], state.optB.snippets[2]);
        if (state.currentTab === 'B') updateCodeEditorView();
        renderOptionBStep(3);
      });
    }

    if (step2SkipBtn) {
      step2SkipBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        state.optB.stepProgress[2] = false;
        renderOptionBStep(3);
      });
    }

    if (step2StopBtn) {
      step2StopBtn.addEventListener('click', stopOptionBGuidance);
    }

    // Step 3 Actions
    if (step3BackBtn) {
      step3BackBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        renderOptionBStep(2);
      });
    }

    if (step3AltBtn) {
      step3AltBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        if (optBAltPanel) {
          optBAltPanel.classList.toggle('hidden');
        }
      });
    }

    if (optBNavToABtn) {
      optBNavToABtn.addEventListener('click', () => {
        switchTab('A');
      });
    }

    if (step3ConfirmBtn) {
      step3ConfirmBtn.addEventListener('click', () => {
        if (state.optB.stopped) return;
        state.optB.stepProgress[3] = true;
        state.optB.completed = true;

        if (stepCards[3]) stepCards[3].classList.add('hidden');
        if (microstepsCompleteBox) {
          microstepsCompleteBox.classList.remove('hidden');
          if (typeof microstepsCompleteBox.focus === 'function') {
            microstepsCompleteBox.focus();
          }

          const allDone = state.optB.stepProgress[1] && state.optB.stepProgress[2];
          if (allDone) {
            if (completionSummaryTitle) completionSummaryTitle.textContent = '🎉 Hoàn Thành Đầy Đủ Cả 3 Bước Vi Mô!';
            if (completionSummaryDesc) completionSummaryDesc.textContent = 'Mã nguồn trong khung server.js đã được cập nhật đầy đủ cấu hình đọc PORT động và bind 0.0.0.0. Bạn có thể nhấn nút "Chạy thử Deploy (Simulated)" để kiểm tra.';
          } else {
            if (completionSummaryTitle) completionSummaryTitle.textContent = '⚠️ Đã Hoàn Thành Quy Trình Nhưng Có Bước Bị Bỏ Qua';
            if (completionSummaryDesc) completionSummaryDesc.textContent = 'Bạn đã đi qua hết các bước, nhưng có bước đã bị bỏ qua (Skip). Hãy kiểm tra lại mã nguồn trước khi deploy.';
          }

          if (completionStepsList) {
            completionStepsList.innerHTML = `
              <div style="margin-bottom:0.3rem;">• <strong>Bước 1 (Đọc PORT động):</strong> ${state.optB.stepProgress[1] ? '<span style="color:#16a34a;">✅ Đã áp dụng</span>' : '<span style="color:#dc2626;">⏭️ Đã bỏ qua</span>'}</div>
              <div style="margin-bottom:0.3rem;">• <strong>Bước 2 (Lắng nghe 0.0.0.0):</strong> ${state.optB.stepProgress[2] ? '<span style="color:#16a34a;">✅ Đã áp dụng</span>' : '<span style="color:#dc2626;">⏭️ Đã bỏ qua</span>'}</div>
              <div>• <strong>Bước 3 (Đối chiếu Docker):</strong> <span style="color:#16a34a;">✅ Đã rà soát</span></div>
            `;
          }
        }
      });
    }

    if (step3StopBtn) {
      step3StopBtn.addEventListener('click', stopOptionBGuidance);
    }

    function resetOptionB() {
      state.optB = {
        started: false,
        diagAnswered: false,
        diagChoice: '',
        currentStep: 1,
        stepProgress: { 1: false, 2: false, 3: false },
        snippets: { 1: null, 2: null },
        stopped: false,
        completed: false,
        alternativeMode: false
      };
      state.code.B = INITIAL_SOURCE_CODE;
      if (state.currentTab === 'B') updateCodeEditorView();

      if (step1CodeEdit) step1CodeEdit.value = 'const PORT = process.env.PORT || 8080;';
      if (step2CodeEdit) step2CodeEdit.value = `app.listen(PORT, '0.0.0.0', () => {\n  console.log(\`Server running on port \${PORT}\`);\n});`;
      if (step1ErrorMsg) step1ErrorMsg.classList.add('hidden');
      if (step2ErrorMsg) step2ErrorMsg.classList.add('hidden');
      if (optBMicrostepsBox) optBMicrostepsBox.classList.add('hidden');
      if (optBDiagnosticBox) optBDiagnosticBox.classList.add('hidden');
      if (optBDiagFeedback) optBDiagFeedback.classList.add('hidden');
      if (optBStoppedBox) optBStoppedBox.classList.add('hidden');
      if (optBAltPanel) optBAltPanel.classList.add('hidden');
      if (optBTriggerContainer) optBTriggerContainer.classList.remove('hidden');

      const diagRadios = doc.querySelectorAll('input[name="diag-answer"]');
      diagRadios.forEach(r => { r.checked = false; });
    }

    if (optBResetStepsBtn) {
      optBResetStepsBtn.addEventListener('click', resetOptionB);
    }

    // --- OPTION C CONTROLLER ---
    const optCConfidenceBadge = doc.getElementById('opt-c-confidence-badge');
    const confidenceVal = doc.getElementById('confidence-val');
    const toggleUncertainBtn = doc.getElementById('toggle-uncertain-btn');
    const diffScenarioLabel = doc.getElementById('diff-scenario-label');
    const diffViewContent = doc.getElementById('diff-view-content');
    const optCRejectedNotice = doc.getElementById('opt-c-rejected-notice');
    const optCUnrejectBtn = doc.getElementById('opt-c-unreject-btn');

    const optCApplyBtn = doc.getElementById('opt-c-apply-btn');
    const optCCustomBtn = doc.getElementById('opt-c-custom-btn');
    const optCRejectBtn = doc.getElementById('opt-c-reject-btn');
    const optCRollbackBtn = doc.getElementById('opt-c-rollback-btn');
    const optCWrongBtn = doc.getElementById('opt-c-wrong-btn');
    const optCResetBtn = doc.getElementById('opt-c-reset-btn');

    const optCCustomBox = doc.getElementById('opt-c-custom-box');
    const optCCustomTextarea = doc.getElementById('opt-c-custom-textarea');
    const optCSaveCustomBtn = doc.getElementById('opt-c-save-custom-btn');
    const optCCancelCustomBtn = doc.getElementById('opt-c-cancel-custom-btn');
    const optCNotification = doc.getElementById('opt-c-notification');

    function showOptCNotification(type, msg) {
      if (!optCNotification) return;
      optCNotification.className = `notification-box ${type}`;
      optCNotification.textContent = msg;
      optCNotification.classList.remove('hidden');
    }

    function setOptionCRejectionState(isRejected) {
      state.optC.rejected = isRejected;
      if (optCRejectedNotice) optCRejectedNotice.classList.toggle('hidden', !isRejected);
      if (optCApplyBtn) optCApplyBtn.disabled = isRejected;
      if (optCCustomBtn) optCCustomBtn.disabled = isRejected;
      if (isRejected && optCCustomBox) {
        optCCustomBox.classList.add('hidden');
      }
    }

    if (toggleUncertainBtn) {
      toggleUncertainBtn.addEventListener('click', () => {
        if (state.optC.scenario === 'normal') {
          state.optC.scenario = 'uncertain';
          if (confidenceVal) {
            confidenceVal.textContent = '45%';
            confidenceVal.style.color = '#dc2626';
          }
          toggleUncertainBtn.textContent = 'Quay lại kịch bản chuẩn: AI Gợi ý bản vá đúng (Độ tin cậy mô phỏng: 92%)';
          toggleUncertainBtn.className = 'btn btn-sm btn-secondary';
          if (diffScenarioLabel) {
            diffScenarioLabel.textContent = 'Kịch bản: AI gợi ý sai / không chắc chắn (Độ tin cậy mô phỏng: 45%)';
            diffScenarioLabel.className = 'scenario-label uncertain';
          }

          if (diffViewContent) {
            diffViewContent.innerHTML = `
              <div class="diff-line normal"><span># Dockerfile</span></div>
              <div class="diff-line remove"><span>- EXPOSE 3000</span></div>
              <div class="diff-line add"><span>+ EXPOSE 8080</span></div>
              <div class="diff-line add"><span>+ ENV PORT=8080</span></div>
              <div class="diff-line normal"><span># (LƯU Ý: AI bỏ qua việc sửa server.js vẫn đang bind localhost:3000!)</span></div>
            `;
          }
          showOptCNotification('warning', 'Tình huống thử nghiệm kích hoạt: AI đưa ra gợi ý không đầy đủ với độ tin cậy thấp (45%). Hãy quan sát xem người dùng có phát hiện và từ chối/sửa bản vá này không.');
        } else {
          state.optC.scenario = 'normal';
          if (confidenceVal) {
            confidenceVal.textContent = '92%';
            confidenceVal.style.color = '#1d4ed8';
          }
          toggleUncertainBtn.textContent = 'Kích hoạt tình huống: AI Gợi ý sai (Chỉ sửa Dockerfile EXPOSE, bỏ quên server.js)';
          toggleUncertainBtn.className = 'btn btn-sm btn-warning';
          if (diffScenarioLabel) {
            diffScenarioLabel.textContent = 'Kịch bản: Bản vá chuẩn (Độ tin cậy mô phỏng: 92%)';
            diffScenarioLabel.className = 'scenario-label normal';
          }

          if (diffViewContent) {
            diffViewContent.innerHTML = `
              <div class="diff-line remove"><span>- const PORT = 3000;</span></div>
              <div class="diff-line add"><span>+ const PORT = process.env.PORT || 8080;</span></div>
              <div class="diff-line remove"><span>- app.listen(PORT, 'localhost', () => {</span></div>
              <div class="diff-line add"><span>+ app.listen(PORT, '0.0.0.0', () => {</span></div>
              <div class="diff-line normal"><span>    console.log(\`Server running on port \${PORT}\`);</span></div>
              <div class="diff-line normal"><span>  });</span></div>
            `;
          }
          showOptCNotification('info', 'Đã trở lại kịch bản bản vá chuẩn (Độ tin cậy mô phỏng 92%).');
        }
      });
    }

    if (optCApplyBtn) {
      optCApplyBtn.addEventListener('click', () => {
        if (state.optC.rejected) return;

        if (state.optC.scenario === 'normal') {
          state.code.C = CORRECT_PATCHED_CODE;
          showOptCNotification('success', 'Đã áp dụng bản vá tự động vào tệp server.js. Bạn có thể nhấn nút "Chạy thử Deploy (Simulated Fixture Check)" để kiểm tra.');
        } else {
          state.code.C = FAULTY_DOCKER_CODE;
          showOptCNotification('error', 'Đã áp dụng bản vá thiếu sót của AI vào server.js. Container vẫn chưa đọc PORT và vẫn bind localhost. Hãy chạy thử Deploy để quan sát lỗi!');
        }
        state.optC.applied = true;
        if (state.currentTab === 'C') updateCodeEditorView();
      });
    }

    if (optCCustomBtn) {
      optCCustomBtn.addEventListener('click', () => {
        if (state.optC.rejected) return;
        if (optCCustomBox && optCCustomTextarea) {
          optCCustomBox.classList.remove('hidden');
          optCCustomTextarea.value = (state.optC.scenario === 'normal') ? CORRECT_PATCHED_CODE : state.code.C;
          optCCustomTextarea.focus();
        }
      });
    }

    if (optCSaveCustomBtn) {
      optCSaveCustomBtn.addEventListener('click', () => {
        if (optCCustomTextarea) {
          state.code.C = optCCustomTextarea.value;
          if (optCCustomBox) optCCustomBox.classList.add('hidden');
          showOptCNotification('info', 'Đã áp dụng đoạn mã tùy chỉnh của bạn vào server.js.');
          if (state.currentTab === 'C') updateCodeEditorView();
        }
      });
    }

    if (optCCancelCustomBtn) {
      optCCancelCustomBtn.addEventListener('click', () => {
        if (optCCustomBox) optCCustomBox.classList.add('hidden');
      });
    }

    if (optCRejectBtn) {
      optCRejectBtn.addEventListener('click', () => {
        setOptionCRejectionState(true);
        showOptCNotification('warning', 'Đã bác bỏ đề xuất của AI. Bản vá bị khóa để tránh áp dụng ngoài ý muốn. Tệp server.js được giữ nguyên.');
      });
    }

    if (optCUnrejectBtn) {
      optCUnrejectBtn.addEventListener('click', () => {
        setOptionCRejectionState(false);
        showOptCNotification('info', 'Đã mở khóa lại bản vá đề xuất của AI.');
      });
    }

    if (optCRollbackBtn) {
      optCRollbackBtn.addEventListener('click', () => {
        state.code.C = INITIAL_SOURCE_CODE;
        state.optC.applied = false;
        showOptCNotification('info', 'Đã khôi phục (Rollback) mã nguồn server.js về nguyên trạng ban đầu.');
        if (state.currentTab === 'C') updateCodeEditorView();
      });
    }

    if (optCWrongBtn) {
      optCWrongBtn.addEventListener('click', () => {
        state.optC.reportedWrong = true;
        showOptCNotification('warning', '🚩 [CỜ CỤC BỘ] Đã ghi nhận phản hồi: "Báo AI chẩn đoán sai". Thông tin chỉ lưu cục bộ trong phiên duyệt và đã tự động thêm vào Bảng quan sát.');
        appendToScratchpad(`[Tự động ghi nhận]: Tester bấm "Báo AI đoán sai" tại Option C.`);
      });
    }

    if (optCResetBtn) {
      optCResetBtn.addEventListener('click', () => {
        state.optC = {
          scenario: 'normal',
          applied: false,
          customizing: false,
          rejected: false,
          reportedWrong: false,
          lastActionMessage: ''
        };
        state.code.C = INITIAL_SOURCE_CODE;
        setOptionCRejectionState(false);
        if (confidenceVal) {
          confidenceVal.textContent = '92%';
          confidenceVal.style.color = '#1d4ed8';
        }
        if (toggleUncertainBtn) {
          toggleUncertainBtn.textContent = 'Kích hoạt tình huống: AI Gợi ý sai (Chỉ sửa Dockerfile EXPOSE, bỏ quên server.js)';
          toggleUncertainBtn.className = 'btn btn-sm btn-warning';
        }
        if (diffScenarioLabel) {
          diffScenarioLabel.textContent = 'Kịch bản: Bản vá chuẩn (Độ tin cậy mô phỏng: 92%)';
          diffScenarioLabel.className = 'scenario-label normal';
        }
        if (diffViewContent) {
          diffViewContent.innerHTML = `
            <div class="diff-line remove"><span>- const PORT = 3000;</span></div>
            <div class="diff-line add"><span>+ const PORT = process.env.PORT || 8080;</span></div>
            <div class="diff-line remove"><span>- app.listen(PORT, 'localhost', () => {</span></div>
            <div class="diff-line add"><span>+ app.listen(PORT, '0.0.0.0', () => {</span></div>
            <div class="diff-line normal"><span>    console.log(\`Server running on port \${PORT}\`);</span></div>
            <div class="diff-line normal"><span>  });</span></div>
          `;
        }
        if (optCNotification) optCNotification.classList.add('hidden');
        if (state.currentTab === 'C') updateCodeEditorView();
      });
    }

    updateCodeEditorView();

    return {
      state,
      switchTab,
      updateCodeEditorView,
      toggleObserver,
      executeOptionASearch,
      renderOptionBStep,
      stopOptionBGuidance,
      resetOptionB,
      setOptionCRejectionState,
      validateCode,
      searchCannedKnowledge,
      buildOptionBCode,
      escapeHtml,
      safeGetStorage,
      safeSetStorage,
      appendToScratchpad
    };
  }

  // Auto-init in real browser
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => createController(document));
    } else {
      createController(document);
    }
  }

  return {
    INITIAL_SOURCE_CODE,
    CORRECT_PATCHED_CODE,
    FAULTY_DOCKER_CODE,
    CANNED_SEARCH_DB,
    createInitialState,
    createController,
    buildOptionBCode,
    validateCode,
    searchCannedKnowledge,
    escapeHtml,
    safeGetStorage,
    safeSetStorage
  };
});
