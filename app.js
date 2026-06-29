/**
 * 宸星电竞 - 主应用逻辑
 */
(function () {
    'use strict';

    // ==================== 状态管理 ====================
    const state = {
        currentCategory: 'all',
        currentSub: null,       // 当前子分类ID，null 表示全部
        searchKeyword: '',
        scale: 1,               // 查看器缩放
        translateX: 0,          // 查看器位移
        translateY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        lastTouchDistance: 0,   // 触摸双指距离
    };

    // ==================== DOM 引用 ====================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        navBtns: null,
        subTabs: $('#subTabs'),
        cardsGrid: $('#cardsGrid'),
        searchInput: $('#searchInput'),
        searchClear: $('#searchClear'),
        searchTags: $('#searchTags'),
        emptyState: $('#emptyState'),
        viewerOverlay: $('#viewerOverlay'),
        viewerImage: $('#viewerImage'),
        viewerTitle: $('#viewerTitle'),
        viewerClose: $('#viewerClose'),
        viewerZoomIn: $('#viewerZoomIn'),
        viewerZoomOut: $('#viewerZoomOut'),
        viewerReset: $('#viewerReset'),
        viewerContent: $('#viewerContent'),
        backToTop: $('#backToTop'),
        particles: $('#particles'),
    };

    // ==================== 初始化 ====================
    function init() {
        dom.navBtns = $$('.nav-btn');
        bindEvents();
        renderSubTabs();
        renderCards();
        initParticles();
        initBackToTop();
    }

    // ==================== 事件绑定 ====================
    function bindEvents() {
        // 导航点击
        dom.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;
                setActiveNav(cat);
                state.currentCategory = cat;
                state.currentSub = null;
                renderSubTabs();
                renderCards();
            });
        });

        // 搜索输入
        dom.searchInput.addEventListener('input', debounce(() => {
            state.searchKeyword = dom.searchInput.value.trim();
            dom.searchClear.classList.toggle('visible', state.searchKeyword.length > 0);
            renderCards();
        }, 200));

        // 搜索清除
        dom.searchClear.addEventListener('click', () => {
            dom.searchInput.value = '';
            state.searchKeyword = '';
            dom.searchClear.classList.remove('visible');
            renderCards();
        });

        // 搜索标签点击
        dom.searchTags.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-tag')) {
                dom.searchInput.value = e.target.textContent;
                state.searchKeyword = e.target.textContent;
                dom.searchClear.classList.add('visible');
                renderCards();
            }
        });

        // 查看器事件
        dom.viewerClose.addEventListener('click', closeViewer);
        dom.viewerOverlay.addEventListener('click', (e) => {
            if (e.target === dom.viewerOverlay) closeViewer();
        });
        dom.viewerZoomIn.addEventListener('click', () => zoomViewer(1.3));
        dom.viewerZoomOut.addEventListener('click', () => zoomViewer(0.7));
        dom.viewerReset.addEventListener('click', resetViewer);

        // 鼠标滚轮缩放
        dom.viewerContent.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.15 : 0.85;
            zoomViewer(factor);
        }, { passive: false });

        // 鼠标拖拽
        dom.viewerContent.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);

        // 触摸支持
        dom.viewerContent.addEventListener('touchstart', onTouchStart, { passive: false });
        dom.viewerContent.addEventListener('touchmove', onTouchMove, { passive: false });
        dom.viewerContent.addEventListener('touchend', onTouchEnd);

        // 键盘操作
        document.addEventListener('keydown', (e) => {
            if (!dom.viewerOverlay.classList.contains('active')) return;
            switch (e.key) {
                case 'Escape': closeViewer(); break;
                case '+': case '=': zoomViewer(1.3); break;
                case '-': zoomViewer(0.7); break;
                case '0': resetViewer(); break;
                case 'ArrowLeft': panViewer(-30, 0); break;
                case 'ArrowRight': panViewer(30, 0); break;
                case 'ArrowUp': panViewer(0, -30); break;
                case 'ArrowDown': panViewer(0, 30); break;
            }
        });

        // 回到顶部
        dom.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 滚动监听
        window.addEventListener('scroll', () => {
            dom.backToTop.classList.toggle('visible', window.scrollY > 300);
        });
    }

    // ==================== 导航高亮 ====================
    function setActiveNav(catId) {
        dom.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === catId);
        });
    }

    // ==================== 子分类渲染 ====================
    function renderSubTabs() {
        const config = CATEGORY_CONFIG.find(c => c.id === state.currentCategory);
        if (!config) return;

        const subs = config.subCategories;
        if (subs.length <= 1) {
            dom.subTabs.innerHTML = '';
            return;
        }

        let html = `<button class="sub-tab ${!state.currentSub ? 'active' : ''}" data-sub="">全部</button>`;
        subs.forEach(subId => {
            const data = MENU_DATA[subId];
            if (data) {
                html += `<button class="sub-tab ${state.currentSub === subId ? 'active' : ''}" data-sub="${subId}">${data.icon} ${data.name}</button>`;
            }
        });
        dom.subTabs.innerHTML = html;

        // 绑定子分类点击
        dom.subTabs.querySelectorAll('.sub-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const sub = tab.dataset.sub || null;
                state.currentSub = sub;
                dom.subTabs.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderCards();
            });
        });
    }

    // ==================== 卡片渲染 ====================
    function renderCards() {
        const items = getFilteredItems();
        const keywords = extractKeywords();

        if (items.length === 0) {
            dom.cardsGrid.innerHTML = '';
            dom.emptyState.style.display = 'block';
            return;
        }

        dom.emptyState.style.display = 'none';

        // 更新搜索标签
        renderSearchTags(keywords);

        const html = items.map((item, index) => {
            const categoryData = getCategoryByItemId(item.id);
            const badgeClass = categoryData ? categoryData.color : 'badge-fun';
            const categoryName = categoryData ? categoryData.name : '';

            return `
                <div class="card" data-id="${item.id}" style="animation-delay: ${index * 0.05}s" onclick="window.__openViewer('${item.id}')">
                    <div class="card-img-wrapper">
                        <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%221a1f35%22 width=%22400%22 height=%22300%22/><text fill=%2264748b%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🎮 ${item.name}</text></svg>'">
                        <span class="card-badge ${badgeClass}">${categoryName}</span>
                    </div>
                    <div class="card-body">
                        <div class="card-title">${highlightText(item.name, state.searchKeyword)}</div>
                        <div class="card-desc">${item.desc}</div>
                    </div>
                    <div class="card-footer">
                        <span class="card-category">${item.tags.join(' · ')}</span>
                        <span class="card-view-btn">查看图片 →</span>
                    </div>
                </div>
            `;
        }).join('');

        dom.cardsGrid.innerHTML = html;
    }

    // ==================== 数据过滤 ====================
    function getFilteredItems() {
        const config = CATEGORY_CONFIG.find(c => c.id === state.currentCategory);
        if (!config) return [];

        let items = [];
        const subs = state.currentSub ? [state.currentSub] : config.subCategories;

        subs.forEach(subId => {
            const data = MENU_DATA[subId];
            if (data && data.items) {
                items = items.concat(data.items.map(item => ({ ...item, _subId: subId })));
            }
        });

        // 搜索过滤
        if (state.searchKeyword) {
            const kw = state.searchKeyword.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(kw) ||
                item.desc.toLowerCase().includes(kw) ||
                item.tags.some(t => t.toLowerCase().includes(kw))
            );
        }

        return items;
    }

    // 获取所有可用关键词
    function extractKeywords() {
        const allItems = [];
        CATEGORY_CONFIG.forEach(c => {
            c.subCategories.forEach(subId => {
                const data = MENU_DATA[subId];
                if (data && data.items) {
                    data.items.forEach(item => {
                        allItems.push(item.name, ...item.tags);
                    });
                }
            });
        });
        // 去重 + 限制数量
        return [...new Set(allItems)].slice(0, 12);
    }

    // 渲染搜索标签
    function renderSearchTags(keywords) {
        dom.searchTags.innerHTML = keywords.map(k =>
            `<span class="search-tag">${k}</span>`
        ).join('');
    }

    // 高亮搜索文字
    function highlightText(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
        return text.replace(regex, '<mark style="background:rgba(0,245,255,0.3);color:#00f5ff;padding:0 2px;border-radius:2px;">$1</mark>');
    }

    // ==================== 图片查看器 ====================
    // 暴露给全局（卡片onclick调用）
    window.__openViewer = function (itemId) {
        const allItems = getFilteredItems();
        const item = allItems.find(i => i.id === itemId);
        if (!item) return;

        dom.viewerImage.src = item.img;
        dom.viewerTitle.textContent = item.name;
        resetViewerTransform();
        dom.viewerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeViewer() {
        dom.viewerOverlay.classList.remove('active');
        document.body.style.overflow = '';
        resetViewerTransform();
    }

    function zoomViewer(factor) {
        state.scale = Math.min(Math.max(state.scale * factor, 0.1), 10);
        applyTransform();
    }

    function resetViewer() {
        resetViewerTransform();
    }

    function resetViewerTransform() {
        state.scale = 1;
        state.translateX = 0;
        state.translateY = 0;
        applyTransform();
    }

    function panViewer(dx, dy) {
        state.translateX += dx;
        state.translateY += dy;
        applyTransform();
    }

    function applyTransform() {
        dom.viewerImage.style.transform =
            `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
    }

    // 鼠标拖拽
    function onDragStart(e) {
        if (e.button !== 0) return;
        state.isDragging = true;
        state.dragStartX = e.clientX - state.translateX;
        state.dragStartY = e.clientY - state.translateY;
        e.preventDefault();
    }

    function onDragMove(e) {
        if (!state.isDragging) return;
        state.translateX = e.clientX - state.dragStartX;
        state.translateY = e.clientY - state.dragStartY;
        applyTransform();
    }

    function onDragEnd() {
        state.isDragging = false;
    }

    // 触摸手势
    function onTouchStart(e) {
        if (e.touches.length === 1) {
            state.isDragging = true;
            state.dragStartX = e.touches[0].clientX - state.translateX;
            state.dragStartY = e.touches[0].clientY - state.translateY;
        } else if (e.touches.length === 2) {
            state.lastTouchDistance = getTouchDistance(e.touches);
        }
        e.preventDefault();
    }

    function onTouchMove(e) {
        if (e.touches.length === 1 && state.isDragging) {
            state.translateX = e.touches[0].clientX - state.dragStartX;
            state.translateY = e.touches[0].clientY - state.dragStartY;
            applyTransform();
        } else if (e.touches.length === 2) {
            const dist = getTouchDistance(e.touches);
            const factor = dist / state.lastTouchDistance;
            state.scale = Math.min(Math.max(state.scale * factor, 0.1), 10);
            state.lastTouchDistance = dist;
            applyTransform();
        }
        e.preventDefault();
    }

    function onTouchEnd() {
        state.isDragging = false;
        state.lastTouchDistance = 0;
    }

    function getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // ==================== 工具函数 ====================
    function getCategoryByItemId(itemId) {
        for (const key in MENU_DATA) {
            const data = MENU_DATA[key];
            if (data.items && data.items.find(i => i.id === itemId)) {
                return data;
            }
        }
        return null;
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ==================== 粒子背景 ====================
    function initParticles() {
        const canvas = dom.particles;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // 边界反弹
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 245, 255, ${p.opacity})`;
                ctx.fill();

                // 连线
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ==================== 回到顶部按钮 ====================
    function initBackToTop() {
        window.addEventListener('scroll', () => {
            dom.backToTop.classList.toggle('visible', window.scrollY > 400);
        });
    }

    // ==================== 启动 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
