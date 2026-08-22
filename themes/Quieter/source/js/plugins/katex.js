function initKatex() {
    // katex.js and auto-render.js are loaded with `defer`, so poll until ready.
    function tryRender() {
        if (typeof katex === 'undefined' || typeof renderMathInElement === 'undefined') {
            setTimeout(tryRender, 50);
            return;
        }
        renderKatex();
    }

    function isDisplayMath(tex) {
        // Block environments
        if (/\\begin\{(bmatrix|pmatrix|matrix|vmatrix|Bmatrix|cases|align|equation|gather|multline|array)/.test(tex)) return true;
        // Summation, integration, products — always block in practice
        if (/\\(sum|int|prod|bigcup|bigcap)/.test(tex)) return true;
        // Multiline or long expressions
        if (tex.indexOf('\n') !== -1) return true;
        if (tex.length > 60) return true;
        return false;
    }

    function unescape(tex) {
        // kramed double-escapes backslashes in script tags: \sum → \\sum
        // Step 1: collapse double backslashes back to single
        tex = tex.replace(/\\\\/g, '\\');
        // Step 2: \_ is a markdown escape for underscore, not a LaTeX command → strip the backslash
        tex = tex.replace(/\\_/g, '_');
        return tex;
    }

    function renderKatex() {
        // hexo-renderer-kramed converts $...$ → <script type="math/tex">
        // and $$...$$ (when on its own line) → <script type="math/tex; mode=display">
        // BUT $$...$$ inside list items / paragraphs also becomes inline math/tex.
        // We detect block-math content and promote it to display mode.

        // 1. Explicit display tags
        document.querySelectorAll('script[type="math/tex; mode=display"]').forEach(function(el) {
            var tex = unescape(el.textContent || el.innerText);
            var wrapper = document.createElement('div');
            wrapper.className = 'math-display-block';
            try {
                katex.render(tex, wrapper, { displayMode: true, throwOnError: false });
            } catch(e) {
                wrapper.textContent = tex;
            }
            el.parentNode.replaceChild(wrapper, el);
        });

        // 2. Inline tags — but promote to display if they contain block environments or are long
        document.querySelectorAll('script[type="math/tex"]').forEach(function(el) {
            var tex = unescape(el.textContent || el.innerText);
            var display = isDisplayMath(tex);
            var node;
            if (display) {
                node = document.createElement('div');
                node.className = 'math-display-block';
            } else {
                node = document.createElement('span');
                node.className = 'math-inline';
            }
            try {
                katex.render(tex, node, { displayMode: display, throwOnError: false });
            } catch(e) {
                node.textContent = tex;
            }
            el.parentNode.replaceChild(node, el);
        });

        // 3. Auto-render for any raw $$ / $ delimiters not caught by kramed
        renderMathInElement(document.body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$',  right: '$',  display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
        });
    }

    tryRender();
}