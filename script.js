/**
 * GuYi Web Tools Pro - Core Logic
 * Optimized by Google Advanced Agentic Coding Team
 */

// --- Tailwind 配置 (运行时) ---
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                glass: "rgba(17, 25, 40, 0.75)",
                glassBorder: "rgba(255, 255, 255, 0.125)",
                accent: "#818cf8", // CSS模式 (蓝紫)
                accentHover: "#6366f1",
                rose: "#fb7185",   // HTML模式 (红粉)
                roseHover: "#f43f5e",
                amber: "#fbbf24",  // JS模式 (琥珀/金)
                amberHover: "#f59e0b"
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                }
            }
        }
    }
};

// --- Web Worker 构建 ---
const workerCode = `
importScripts('https://cdn.jsdelivr.net/npm/javascript-obfuscator/dist/index.browser.js');

self.onmessage = function(e) {
    const { code, options } = e.data;
    try {
        const startTime = Date.now();
        const result = JavaScriptObfuscator.obfuscate(code, options);
        const obfuscatedCode = result.getObfuscatedCode();
        const endTime = Date.now();
        
        self.postMessage({
            type: 'success',
            code: obfuscatedCode,
            time: endTime - startTime
        });
    } catch (err) {
        self.postMessage({
            type: 'error',
            message: err.message || 'Obfuscation failed'
        });
    }
};
`;
const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(workerBlob);
let obfuscatorWorker = null;

// --- HTML 模板 (UI核心) ---
const appTemplate = `
    <div class="bg-layer bg-mobile"></div>
    <div class="bg-overlay"></div>

    <!-- 优化点：修复移动端显示问题 -->
    <!-- 1. 使用 fixed 确保不跟随滚动 -->
    <!-- 2. 移除 hidden md:inline，确保文字在移动端也显示 -->
    <!-- 3. 加深背景色确保在各种壁纸上都可见 -->
    <nav class="fixed top-5 right-5 md:top-6 md:right-6 z-50">
        <button onclick="toggleAbout()" class="flex items-center gap-2 text-slate-200 hover:text-white transition-all bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-full text-xs md:text-sm font-medium border border-white/10 hover:border-white/30 shadow-xl hover:scale-105 active:scale-95">
            <i class="ph-bold ph-info text-lg text-accent"></i>
            <span>关于我们</span>
        </button>
    </nav>

    <main class="w-full max-w-6xl animate-fade-in relative z-10 p-4 md:p-8 mt-16 md:mt-0">
        
        <header class="mb-8 text-center flex flex-col items-center">
            <div class="relative group mb-4">
                <div id="logoGlow" class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img src="http://q.qlogo.cn/headimg_dl?dst_uin=156440000&spec=640&img_type=jpg" alt="Logo" class="w-full h-full object-cover">
                </div>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 drop-shadow-lg">
                GuYi <span id="headerTitle" class="text-accent transition-colors duration-300">Web</span> Tools
            </h1>
            <p class="text-slate-300 text-xs md:text-sm font-light tracking-wide">全能型代码封装与加密混淆工具箱</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- 左侧：输入区域 -->
            <section class="lg:col-span-8 flex flex-col gap-4">
                <div class="glass-panel rounded-2xl p-1 flex-1 flex flex-col h-[500px] md:h-[600px] relative overflow-hidden group">
                    <div class="flex items-center justify-between px-5 py-3 border-b border-glassBorder bg-white/5">
                        <div class="flex items-center gap-3">
                            <span id="inputIcon" class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 transition-colors duration-300">
                                <i id="inputIconEl" class="ph-bold ph-code"></i>
                            </span>
                            <span id="inputLabel" class="text-sm font-medium text-slate-200">CSS Source Code</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <input type="file" id="fileInput" class="hidden">
                            <button onclick="document.getElementById('fileInput').click()" class="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-transparent hover:border-slate-500">
                                <i class="ph-bold ph-upload-simple"></i> 导入
                            </button>
                            <button onclick="clearInput()" class="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-transparent hover:border-red-500/30">
                                <i class="ph-bold ph-trash"></i> 清空
                            </button>
                        </div>
                    </div>
                    
                    <textarea id="sourceInput" class="w-full h-full bg-transparent text-slate-100 font-mono text-sm p-5 resize-none focus:outline-none placeholder-slate-500 leading-relaxed"
                        spellcheck="false"></textarea>
                    
                    <!-- 拖拽覆盖层 -->
                    <div id="dropZone" class="absolute inset-0 bg-accent/20 backdrop-blur-sm border-2 border-dashed border-accent hidden flex-col items-center justify-center text-white z-20 transition-colors duration-300">
                        <i class="ph-duotone ph-file-arrow-up text-6xl mb-4"></i>
                        <p class="text-lg font-medium">释放文件以导入</p>
                    </div>

                    <!-- 处理中覆盖层 -->
                    <div id="processingLayer" class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm hidden flex-col items-center justify-center text-white z-30 transition-opacity duration-300">
                        <div class="flex flex-col items-center gap-4">
                            <i class="ph-duotone ph-spinner animate-spin-slow text-5xl text-accent"></i>
                            <p class="text-sm font-medium animate-pulse tracking-wide" id="processingText">正在处理...</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 右侧：设置与操作 -->
            <section class="lg:col-span-4 flex flex-col gap-4">
                
                <!-- 模式切换 -->
                <div class="glass-panel rounded-2xl p-4">
                    <div class="grid grid-cols-3 gap-2 p-1 bg-slate-900/50 rounded-xl">
                        <button onclick="switchMode('css')" id="btnModeCss" class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all bg-accent text-white shadow-lg">
                            <i class="ph-bold ph-file-css"></i> <span>CSS</span>
                        </button>
                        <button onclick="switchMode('js')" id="btnModeJs" class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all text-slate-400 hover:text-slate-200 hover:bg-white/5">
                            <i class="ph-bold ph-file-js"></i> <span>JS</span>
                        </button>
                        <button onclick="switchMode('html')" id="btnModeHtml" class="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all text-slate-400 hover:text-slate-200 hover:bg-white/5">
                            <i class="ph-bold ph-lock-key"></i> <span>HTML</span>
                        </button>
                    </div>
                </div>

                <div class="glass-panel rounded-2xl p-5 flex flex-col gap-5 flex-1">
                    <h2 class="text-sm font-semibold flex items-center gap-2 text-white uppercase tracking-wider">
                        <i id="configIcon" class="ph-duotone ph-sliders-horizontal text-accent text-lg transition-colors"></i>
                        <span id="configTitle">打包配置</span>
                    </h2>

                    <!-- CSS 专用设置 -->
                    <div id="cssSettings" class="flex flex-col gap-5 mode-transition">
                        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-colors">
                            <div class="flex flex-col">
                                <span class="text-sm font-medium text-slate-200">代码压缩</span>
                                <span class="text-[10px] text-slate-400">智能移除空格与注释</span>
                            </div>
                            <div class="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in text-accent">
                                <input type="checkbox" id="minifyToggle" class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 appearance-none cursor-pointer transition-all duration-300 top-0.5 left-0.5 checked:left-5 z-10"/>
                                <label for="minifyToggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-600 cursor-pointer transition-colors duration-300"></label>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-medium text-slate-400 ml-1">注入位置</label>
                            <div class="relative">
                                <select id="insertPos" class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent outline-none appearance-none">
                                    <option value="append">Append (底部 - 覆盖)</option>
                                    <option value="prepend">Prepend (顶部 - 预置)</option>
                                </select>
                                <i class="ph-bold ph-caret-down absolute right-3 top-3 text-slate-500 pointer-events-none"></i>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-medium text-slate-400 ml-1">Style ID (可选)</label>
                            </div>
                            <div class="relative group">
                                <input type="text" id="styleId" placeholder="例如: my-widget" 
                                    class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-accent outline-none pl-9 transition-all">
                                <i class="ph-bold ph-tag absolute left-3 top-3 text-slate-500"></i>
                            </div>
                        </div>
                    </div>

                    <!-- JS 专用设置 -->
                    <div id="jsSettings" class="hidden flex-col gap-5 mode-transition">
                         <div class="flex flex-col gap-2">
                            <label class="text-xs font-medium text-amber-400 ml-1 flex items-center gap-1">
                                <i class="ph-fill ph-lightning"></i> 混淆强度
                            </label>
                            <div class="relative">
                                <select id="jsPreset" class="w-full bg-slate-900/50 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none appearance-none">
                                    <option value="high">顶级混淆 (High Protection)</option>
                                    <option value="medium">中级混淆 (Medium)</option>
                                    <option value="low">低级混淆 (Low / Perf)</option>
                                </select>
                                <i class="ph-bold ph-caret-down absolute right-3 top-3.5 text-slate-500 pointer-events-none"></i>
                            </div>
                            <p class="text-[10px] text-slate-500 px-1 mt-1 leading-tight">顶级混淆将启用：控制流扁平化、字符串阵列加密、死代码注入、自我保护。体积会显著增加。</p>
                        </div>

                         <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5">
                            <div class="flex flex-col">
                                <span class="text-sm font-medium text-slate-200">防调试保护</span>
                                <span class="text-[10px] text-slate-400">Debug Protection</span>
                            </div>
                            <div class="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in text-amber-500">
                                <input type="checkbox" id="jsDebugToggle" checked class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 appearance-none cursor-pointer transition-all duration-300 top-0.5 left-0.5 checked:left-5 z-10"/>
                                <label for="jsDebugToggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-600 cursor-pointer transition-colors duration-300"></label>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5">
                            <div class="flex flex-col">
                                <span class="text-sm font-medium text-slate-200">禁止控制台</span>
                                <span class="text-[10px] text-slate-400">Disable Console</span>
                            </div>
                            <div class="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in text-amber-500">
                                <input type="checkbox" id="jsConsoleToggle" checked class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 appearance-none cursor-pointer transition-all duration-300 top-0.5 left-0.5 checked:left-5 z-10"/>
                                <label for="jsConsoleToggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-600 cursor-pointer transition-colors duration-300"></label>
                            </div>
                        </div>
                    </div>

                    <!-- HTML 专用说明 -->
                    <div id="htmlSettings" class="hidden flex-col gap-5 mode-transition">
                        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs leading-relaxed">
                            <div class="flex items-center gap-2 mb-2 font-bold text-rose-400">
                                <i class="ph-fill ph-warning-circle"></i> 注意事项
                            </div>
                            仅加密 &lt;body&gt; 内部的内容片段。加密后的代码依赖 JS 动态还原，对 SEO 不友好，仅适用于隐藏敏感内容。
                        </div>
                        <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs leading-relaxed">
                             <div class="flex items-center gap-2 mb-2 font-bold text-blue-400">
                                <i class="ph-fill ph-shield-check"></i> 加密原理
                            </div>
                            采用 Hex Encoding 转换，客户端动态解码。可有效防止直接查看源代码，但无法防止专业逆向。
                        </div>
                    </div>

                    <div class="h-px bg-white/10 my-1"></div>

                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">输出文件名</label>
                        <div class="relative group">
                            <input type="text" id="fileName" value="bundle" 
                                class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none pl-10 transition-all">
                            <i id="fileNameIcon" class="ph ph-file-js absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-accent transition-colors text-lg"></i>
                            <span id="fileExt" class="absolute right-4 top-3.5 text-slate-500 text-sm font-mono opacity-50">.js</span>
                        </div>
                    </div>
                </div>

                <div class="glass-panel rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
                    <div class="flex justify-between items-end border-b border-white/5 pb-4">
                        <span class="text-xs text-slate-400 font-medium">预计大小</span>
                        <div class="flex items-baseline gap-2">
                            <div id="sizeStat" class="text-2xl font-mono font-bold text-white">0 KB</div>
                            <span id="savingsStat" class="text-xs text-emerald-400 hidden">(-0%)</span>
                        </div>
                    </div>

                    <button onclick="handleGenerate()" id="actionBtn" class="group relative w-full py-3.5 rounded-xl bg-accent hover:bg-accentHover text-white font-bold text-base shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden border border-white/20 select-none">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                        <span class="flex items-center justify-center gap-2 relative z-10">
                            <i id="actionBtnIcon" class="ph-bold ph-package"></i>
                            <span id="actionBtnText">封装并下载</span>
                        </span>
                    </button>
                </div>
            </section>
        </div>
        
        <footer class="mt-8 text-center text-slate-500 text-xs pb-4">
            <p>GuYi CSS Encapsulation & HTML Encryption & JS Obfuscation Tool &copy; 2026</p>
        </footer>
    </main>

    <!-- 关于我们 模态框 -->
    <div id="aboutModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity opacity-0" id="modalBackdrop" onclick="toggleAbout()"></div>
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0 pointer-events-none">
            <div class="glass-panel relative transform overflow-hidden rounded-2xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm opacity-0 scale-90 pointer-events-auto" id="modalPanel">
                <button onclick="toggleAbout()" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <i class="ph-bold ph-x text-xl"></i>
                </button>
                <div class="px-6 py-8">
                    <div class="flex flex-col items-center text-center">
                        <div class="h-16 w-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg mb-4">
                            <img src="http://q.qlogo.cn/headimg_dl?dst_uin=156440000&spec=640&img_type=jpg" alt="Admin" class="w-full h-full object-cover">
                        </div>
                        <h3 class="text-xl font-bold text-white mb-1">联系作者</h3>
                        <p class="text-sm text-slate-400 mb-6">如有问题或建议，欢迎联系</p>

                        <div class="w-full space-y-3">
                            <a href="mailto:156440000@qq.com" class="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:text-blue-300">
                                        <i class="ph-fill ph-envelope-simple text-lg"></i>
                                    </div>
                                    <div class="flex flex-col items-start">
                                        <span class="text-xs text-slate-400">电子邮箱</span>
                                        <span class="text-sm text-white font-mono">156440000@qq.com</span>
                                    </div>
                                </div>
                                <i class="ph-bold ph-arrow-right text-slate-500 group-hover:text-white"></i>
                            </a>

                            <button onclick="copyToClipboard('1077643184', '官方群号已复制！')" class="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 rounded-lg bg-violet-500/20 text-violet-400 group-hover:text-violet-300">
                                        <i class="ph-fill ph-users-three text-lg"></i>
                                    </div>
                                    <div class="flex flex-col items-start">
                                        <span class="text-xs text-slate-400">官方交流群</span>
                                        <span class="text-sm text-white font-mono">1077643184</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1 text-slate-500 group-hover:text-accent text-xs bg-black/20 px-2 py-1 rounded">
                                    <i class="ph-bold ph-copy"></i>
                                    <span>复制</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="bg-black/20 px-6 py-3 border-t border-white/5 text-center">
                    <p class="text-[10px] text-slate-500">Power by GuYi Tools</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast 提示 -->
    <div id="toast" class="fixed top-6 left-1/2 -translate-x-1/2 -translate-y-20 opacity-0 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-[60]">
        <i class="ph-fill ph-check-circle text-emerald-400 text-xl"></i>
        <span id="toastMsg" class="text-sm font-medium">操作成功</span>
    </div>
`;

// --- DOM 注入与初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    // 移除 Loading 遮罩
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // 渲染应用
    const appContainer = document.getElementById('app');
    appContainer.className = "min-h-screen flex flex-col items-center justify-center p-0 md:p-4 font-sans selection:bg-accent selection:text-white";
    appContainer.innerHTML = appTemplate;
    
    // 初始化变量绑定
    initApp();
});


// --- 变量定义 (全局) ---
let currentMode = 'css';
let elements = {};

// Placeholders
const cssPlaceholder = "/* 拖拽 CSS 文件到此处 */\n.example-class {\n    color: #fff;\n    background: #000;\n}";
const htmlPlaceholder = "<!-- 输入要加密的 HTML 代码片段 -->\n<div>\n    <h1>Hello World</h1>\n    <p>这是加密后的中文内容。</p>\n</div>";
const jsPlaceholder = "// 输入 JavaScript 代码\nfunction hello() {\n    console.log('Hello World');\n    const secret = '123456';\n}";

function initApp() {
    // 绑定 DOM 元素引用
    const ids = [
        'sourceInput', 'minifyToggle', 'insertPos', 'styleId', 'fileName', 
        'sizeStat', 'savingsStat', 'fileInput', 'dropZone', 'processingLayer', 'processingText',
        'btnModeCss', 'btnModeHtml', 'btnModeJs',
        'cssSettings', 'htmlSettings', 'jsSettings',
        'inputLabel', 'inputIcon', 'inputIconEl',
        'actionBtnText', 'actionBtnIcon', 'actionBtn', 'fileExt', 'fileNameIcon',
        'headerTitle', 'configIcon', 'logoGlow', 'jsPreset', 'jsDebugToggle', 'jsConsoleToggle'
    ];
    ids.forEach(id => elements[id] = document.getElementById(id));

    // 初始化
    elements.sourceInput.placeholder = cssPlaceholder;
    
    // 事件监听
    elements.sourceInput.addEventListener('input', debounce(updateSize, 300));
    elements.minifyToggle.addEventListener('change', updateSize);
    elements.insertPos.addEventListener('change', updateSize);
    elements.jsPreset.addEventListener('change', updateSize);
    elements.fileInput.addEventListener('change', handleFileSelect);

    // 拖拽逻辑
    const textAreaContainer = elements.sourceInput.parentElement;
    textAreaContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.dropZone.classList.remove('hidden'); elements.dropZone.classList.add('flex');
    });
    textAreaContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (e.relatedTarget && !textAreaContainer.contains(e.relatedTarget)) {
            elements.dropZone.classList.add('hidden'); elements.dropZone.classList.remove('flex');
        }
    });
    textAreaContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.dropZone.classList.add('hidden'); elements.dropZone.classList.remove('flex');
        processFile(e.dataTransfer.files[0]);
    });
    
    // 初始化 Worker
    if (window.Worker) {
        obfuscatorWorker = new Worker(workerUrl);
        obfuscatorWorker.onmessage = handleWorkerMessage;
    } else {
        showToast("您的浏览器不支持 Web Worker，混淆可能会卡顿", "error");
    }
}

// --- 逻辑处理 ---

// 1. 模式切换
window.switchMode = function(mode) {
    currentMode = mode;
    
    // UI 重置
    const btns = [elements.btnModeCss, elements.btnModeHtml, elements.btnModeJs];
    btns.forEach(btn => btn.className = "flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all text-slate-400 hover:text-slate-200 hover:bg-white/5");

    elements.cssSettings.classList.add('hidden'); elements.cssSettings.classList.remove('flex');
    elements.htmlSettings.classList.add('hidden'); elements.htmlSettings.classList.remove('flex');
    elements.jsSettings.classList.add('hidden'); elements.jsSettings.classList.remove('flex');

    const themeColors = {
        css: { main: 'bg-accent', text: 'text-accent', lightBg: 'bg-blue-500/20', lightText: 'text-blue-400', shadow: 'shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]' },
        html: { main: 'bg-rose-500', text: 'text-rose-500', lightBg: 'bg-rose-500/20', lightText: 'text-rose-400', shadow: 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)]' },
        js: { main: 'bg-amber-500', text: 'text-amber-500', lightBg: 'bg-amber-500/20', lightText: 'text-amber-400', shadow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)]' }
    };
    const theme = themeColors[mode];

    // 激活按钮样式
    const activeBtn = mode === 'css' ? elements.btnModeCss : (mode === 'html' ? elements.btnModeHtml : elements.btnModeJs);
    activeBtn.classList.remove('text-slate-400', 'hover:text-slate-200', 'hover:bg-white/5');
    activeBtn.classList.add('text-white', 'shadow-lg', theme.main);

    // 更新全局颜色
    elements.headerTitle.className = `${theme.text} transition-colors duration-300`;
    elements.configIcon.className = `ph-duotone ph-sliders-horizontal ${theme.text} text-lg transition-colors`;
    elements.logoGlow.className = `absolute -inset-1 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${mode === 'css' ? 'bg-gradient-to-r from-blue-600 to-violet-600' : (mode === 'html' ? 'bg-rose-600' : 'bg-amber-500')}`;
    elements.inputIcon.className = `flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${theme.lightBg} ${theme.lightText}`;
    
    // 按钮样式
    elements.actionBtn.className = `group relative w-full py-3.5 rounded-xl text-white font-bold text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden border border-white/20 ${theme.main} hover:brightness-110 ${theme.shadow} select-none`;
    
    // 输入框聚焦色
    elements.fileName.classList.remove('focus:ring-accent', 'focus:ring-rose-500', 'focus:ring-amber-500');
    elements.fileName.classList.add(`focus:ring-${mode === 'css' ? 'accent' : (mode === 'html' ? 'rose-500' : 'amber-500')}`);
    
    // 拖拽框颜色
    elements.dropZone.className = `absolute inset-0 backdrop-blur-sm border-2 border-dashed hidden flex-col items-center justify-center text-white z-20 transition-colors duration-300 ${mode === 'css' ? 'bg-accent/20 border-accent' : (mode === 'html' ? 'bg-rose-500/20 border-rose-500' : 'bg-amber-500/20 border-amber-500')}`;

    // 更新内容配置
    if (mode === 'css') {
        elements.cssSettings.classList.remove('hidden'); elements.cssSettings.classList.add('flex');
        elements.inputLabel.innerText = "CSS Source Code";
        elements.inputIconEl.className = "ph-bold ph-code";
        elements.sourceInput.placeholder = cssPlaceholder;
        elements.actionBtnText.innerText = "封装并下载";
        elements.actionBtnIcon.className = "ph-bold ph-package";
        elements.fileExt.innerText = ".js";
        elements.fileInput.accept = ".css";
    } else if (mode === 'html') {
        elements.htmlSettings.classList.remove('hidden'); elements.htmlSettings.classList.add('flex');
        elements.inputLabel.innerText = "HTML Source Code";
        elements.inputIconEl.className = "ph-bold ph-brackets-angle";
        elements.sourceInput.placeholder = htmlPlaceholder;
        elements.actionBtnText.innerText = "加密并下载";
        elements.actionBtnIcon.className = "ph-bold ph-lock-key";
        elements.fileExt.innerText = ".html";
        elements.fileInput.accept = ".html,.htm,.txt";
    } else {
        elements.jsSettings.classList.remove('hidden'); elements.jsSettings.classList.add('flex');
        elements.inputLabel.innerText = "JS Source Code";
        elements.inputIconEl.className = "ph-bold ph-file-js";
        elements.sourceInput.placeholder = jsPlaceholder;
        elements.actionBtnText.innerText = "混淆并下载";
        elements.actionBtnIcon.className = "ph-bold ph-magic-wand";
        elements.fileExt.innerText = ".js";
        elements.fileInput.accept = ".js";
    }

    elements.fileNameIcon.className = `absolute left-3.5 top-3.5 text-slate-500 group-focus-within:${theme.text} transition-colors text-lg ${mode === 'css' ? 'ph-file-css' : (mode === 'html' ? 'ph-file-html' : 'ph-file-js')}`;
    
    updateSize();
};

// 2. 文件与体积处理
window.handleFileSelect = function(e) { processFile(e.target.files[0]); e.target.value = ''; };

function processFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.sourceInput.value = e.target.result;
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        if(nameWithoutExt) elements.fileName.value = nameWithoutExt;
        
        if (file.name.endsWith('.css')) {
            elements.styleId.value = 'style-' + nameWithoutExt.toLowerCase().replace(/[^a-z0-9]/g, '-');
            switchMode('css');
        } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
            switchMode('html');
        } else if (file.name.endsWith('.js')) {
            switchMode('js');
        }
        updateSize();
        showToast(`已导入: ${file.name}`);
    };
    reader.readAsText(file);
}

function updateSize() {
    let content = elements.sourceInput.value;
    const originalSize = new Blob([content]).size;
    
    if (!content) { 
        elements.sizeStat.innerText = "0 KB"; 
        elements.savingsStat.classList.add('hidden'); 
        return; 
    }

    let finalSize = 0;

    if (currentMode === 'css') {
        finalSize = originalSize;
        if (elements.minifyToggle.checked) finalSize = new Blob([minifyCSS(content)]).size;
        // 加上封装代码的大致开销
        finalSize += 300; 
        showSavings(originalSize, finalSize, 'css');

    } else if (currentMode === 'html') {
        // 简单估算，Hex 编码后体积会变成约 3 倍
        finalSize = originalSize * 3 + 100;
        showSavings(originalSize, finalSize, 'html');

    } else if (currentMode === 'js') {
        // JS 混淆预估
        const preset = elements.jsPreset.value;
        let factor = 1.0;
        if (preset === 'low') factor = 1.2;
        if (preset === 'medium') factor = 1.8;
        if (preset === 'high') factor = 3.5;
        
        finalSize = originalSize * factor;
        elements.sizeStat.innerText = "~" + formatBytes(finalSize);
        
        const bloating = ((finalSize - originalSize) / originalSize) * 100;
        elements.savingsStat.innerText = `(+${bloating.toFixed(0)}%)`;
        elements.savingsStat.className = "text-xs text-amber-400";
        elements.savingsStat.classList.remove('hidden');
        return;
    }

    elements.sizeStat.innerText = formatBytes(finalSize);
}

function showSavings(orig, final, mode) {
    if(orig === 0) return;
    const diff = final - orig;
    const percent = (Math.abs(diff) / orig) * 100;
    
    if (mode === 'css' && diff < 0) {
        elements.savingsStat.innerText = `(-${percent.toFixed(1)}%)`;
        elements.savingsStat.className = "text-xs text-emerald-400";
        elements.savingsStat.classList.remove('hidden');
    } else {
        elements.savingsStat.innerText = `(+${percent.toFixed(0)}%)`;
        elements.savingsStat.className = `text-xs ${mode === 'html' ? 'text-rose-400' : 'text-amber-400'}`;
        elements.savingsStat.classList.remove('hidden');
    }
}

// 3. 核心生成逻辑

window.handleGenerate = function() {
    const raw = elements.sourceInput.value;
    if (!raw.trim()) { showToast('内容为空', 'error'); return; }

    if (currentMode === 'css') {
        generateCSSBundle();
    } else if (currentMode === 'html') {
        generateEncryptedHTML();
    } else if (currentMode === 'js') {
        // 使用 Worker 进行异步处理
        elements.processingText.innerText = "正在进行顶级混淆...";
        elements.processingLayer.classList.remove('hidden'); elements.processingLayer.classList.add('flex');
        
        const preset = elements.jsPreset.value;
        const debugProtection = elements.jsDebugToggle.checked;
        const disableConsole = elements.jsConsoleToggle.checked;

        let options = {
            compact: true,
            simplify: true,
            debugProtection: debugProtection,
            disableConsoleOutput: disableConsole,
        };

        if (preset === 'high') {
            Object.assign(options, {
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.5,
                stringArray: true,
                stringArrayEncoding: ['rc4'],
                stringArrayThreshold: 1,
                splitStrings: true,
                selfDefending: true,
                numbersToExpressions: true,
                identifierNamesGenerator: 'hexadecimal',
            });
        } else if (preset === 'medium') {
            Object.assign(options, {
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                stringArray: true,
                stringArrayThreshold: 0.75,
                identifierNamesGenerator: 'mangled',
            });
        }

        if (obfuscatorWorker) {
            obfuscatorWorker.postMessage({ code: raw, options: options });
        } else {
            // 降级处理 (虽然很少见)
            showToast('Worker Error, 尝试主线程', 'error');
        }
    }
};

// 4. Worker 回调处理
function handleWorkerMessage(e) {
    const { type, code, message, time } = e.data;
    
    elements.processingLayer.classList.add('hidden'); elements.processingLayer.classList.remove('flex');

    if (type === 'success') {
        downloadFile(code, 'js');
        showToast(`混淆完成 (${time}ms)`);
    } else {
        showToast('混淆失败: ' + message, 'error');
        console.error(message);
    }
}

// 5. CSS 逻辑 (安全版)
function minifyCSS(css) {
    // 1. 移除注释
    let clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    // 2. 移除换行，转为单行
    clean = clean.replace(/[\r\n\t]+/g, ' ');
    // 3. 合并多余空格，但保留 calc() 需要的空格
    clean = clean.replace(/\s{2,}/g, ' '); 
    // 4. 处理符号周边的安全空格
    clean = clean.replace(/\s*([{};])\s*/g, '$1');
    return clean.trim();
}

function generateCSSBundle() {
    const rawCSS = elements.sourceInput.value;
    const isMinify = elements.minifyToggle.checked;
    const insertPos = elements.insertPos.value;
    const customId = elements.styleId.value.trim();

    let processedCSS = isMinify ? minifyCSS(rawCSS) : rawCSS;
    const safeCSS = processedCSS.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/<\/script>/gi, '<\\/script>');

    let injectionLogic = `
try {
    var css = \`${safeCSS}\`;
    var id = '${customId}';
    if(id && document.getElementById(id)) return;
    var style = document.createElement('style');
    style.type = 'text/css';
    if(id) style.id = id;
    style.appendChild(document.createTextNode(css));
    var head = document.head || document.getElementsByTagName('head')[0];
    ${insertPos === 'prepend' ? 'head.insertBefore(style, head.firstChild);' : 'head.appendChild(style);'}
} catch(e) { console.error('GuYi CSS Inject Error', e); }`;

    let finalScript = `/**\n * CSS Bundle Generated by GuYi Web Tools\n * Time: ${new Date().toLocaleString()}\n */\n(function(){${injectionLogic}})();`;
    downloadFile(finalScript, 'js');
}

// 6. HTML 加密逻辑
function hexEncode(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        let hex = charCode.toString(16).toUpperCase();
        result += (charCode < 256 ? "%" : "%u") + (hex.length < 2 ? "0" + hex : hex.padStart(charCode < 256 ? 2 : 4, "0"));
    }
    return result;
}

function generateEncryptedHTML() {
    const rawHTML = elements.sourceInput.value;
    const encoded = hexEncode(rawHTML);
    // 使用 document.write 的替代方案并不完美，但在单页加密场景下，document.write 依然是最直接的“解密即渲染”方式
    // 稍微优化一下结构
    const finalCode = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Encrypted Page</title>
</head>
<body>
<script>
/* Encrypted via https://tools.guyiovo.xyz */
document.open();
document.write(unescape('${encoded}'));
document.close();
<\/script>
<noscript>Please enable JavaScript to view this page.</noscript>
</body>
</html>`;
    downloadFile(finalCode, 'html');
}

// 7. 通用工具
function downloadFile(content, extension) {
    const promoUrl = "https://tools.guyiovo.xyz";
    let finalContent = content;

    // 隐蔽式引流 (JS 中较难删除)
    if (extension === 'js') {
        // 在 JS 中插入一段不易察觉的日志代码，且如果用户删除了变量定义可能会报错
        const watermark = `\n/* ${promoUrl} */\n;(function(){try{if(window.console&&console.log){console.log("%cProvided by GuYi Tools: ${promoUrl}","color:#818cf8;font-weight:bold;padding:4px;");}}catch(e){}})();\n`;
        finalContent = watermark + content;
    } else if (extension === 'html' && !content.includes('Encrypted via')) {
        finalContent = `<!-- Encrypted via ${promoUrl} -->\n` + content;
    }

    const blob = new Blob([finalContent], { type: extension === 'js' ? 'text/javascript' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    let filename = elements.fileName.value.trim() || (extension === 'js' ? 'bundle' : 'index');
    if (!filename.toLowerCase().endsWith('.' + extension)) filename += '.' + extension;
    
    a.href = url; 
    a.download = filename;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a); 
    URL.revokeObjectURL(url);
    
    // 如果是 CSS 模式，下载后提示
    if(currentMode === 'css') showToast(`已生成: ${filename}`);
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals))} ${['B', 'KB', 'MB', 'GB'][i]}`;
}

window.clearInput = function() { 
    elements.sourceInput.value = ''; 
    elements.styleId.value = ''; 
    updateSize(); 
    elements.sourceInput.focus(); 
};

window.showToast = function(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const icon = toast.querySelector('i');
    
    toastMsg.innerText = msg;
    icon.className = type === 'error' 
        ? 'ph-fill ph-warning-circle text-red-400 text-xl' 
        : 'ph-fill ph-check-circle text-emerald-400 text-xl';
        
    toast.classList.remove('-translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => { 
        toast.classList.remove('translate-y-0', 'opacity-100'); 
        toast.classList.add('-translate-y-20', 'opacity-0'); 
    }, 3000);
};

window.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Modal 逻辑
window.toggleAbout = function() {
    const modal = document.getElementById('aboutModal');
    const backdrop = document.getElementById('modalBackdrop');
    const panel = document.getElementById('modalPanel');

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        // 触发重绘
        void modal.offsetWidth;
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'scale-90');
        panel.classList.add('opacity-100', 'scale-100');
    } else {
        backdrop.classList.add('opacity-0');
        panel.classList.remove('opacity-100', 'scale-100');
        panel.classList.add('opacity-0', 'scale-90');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    }
};

window.copyToClipboard = function(text, msg) {
    navigator.clipboard.writeText(text)
        .then(() => showToast(msg))
        .catch(() => showToast('复制失败', 'error'));
};
