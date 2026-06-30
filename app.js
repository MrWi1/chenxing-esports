// ===== 全局状态 =====
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let currentImages = [];
let currentIndex = 0;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let lastTouchDistance = 0;
let isPinching = false;

let swipeStartX = 0;
let isSwiping = false;

let lastTapTime = 0;

// ===== DOM =====
const viewer = document.getElementById('imageViewer');
const img = document.getElementById('viewerImg');

// ===== 手势处理函数（重点）=====
let touchStartHandler, touchMoveHandler, touchEndHandler, doubleTapHandler;

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderMenu('delta-exclusive');
    setupSearch();
    setupViewer();
});

// ===== 导航 / 菜单 / 搜索（不动）=====
function renderNavbar() {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = '';
    for (const key in MENU_DATA) {
        const cat = MENU_DATA[key];
        const btn = document.createElement('button');
        btn.textContent = `${cat.icon} ${cat.name}`;
        btn.dataset.category = key;
        btn.onclick = () => {
            document.querySelectorAll('.navbar button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu(key);
        };
        navbar.appendChild(btn);
    }
    const first = Object.keys(MENU_DATA).find(k => MENU_DATA[k].items.length);
    if (first) document.querySelector(`[data-category="${first}"]`)?.classList.add('active');
}

function renderMenu(category) {
    const section = document.getElementById('menuSection');
    section.innerHTML = '';
    (MENU_DATA[category]?.items || []).forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-image">
            <img src="${item.img}" loading="lazy">
            <div class="card-tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
          <div class="card-content"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
        card.onclick = () => openViewer(item.img, MENU_DATA[category].items, MENU_DATA[category].items.indexOf(item));
        section.appendChild(card);
    });
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    input.oninput = e => {
        const k = e.target.value.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const txt = card.innerText.toLowerCase();
            card.style.display = !k || txt.includes(k) ? 'block' : 'none';
        });
    };
}

// ===== 打开查看器（✅ 动态绑定手势）=====
function openViewer(imgPath, items, index) {
    currentImages = items.map(i => i.img);
    currentIndex = index;
    img.src = imgPath;

    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();

    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';

    bindViewerGestures(); // ✅ 关键
}

// ===== 关闭查看器（✅ 解绑手势）=====
function closeViewer() {
    viewer.classList.remove('active');
    document.body.style.overflow = '';
    unbindViewerGestures(); // ✅ 关键
}

document.getElementById('closeViewer').onclick = closeViewer;

// ===== 手势绑定 / 解绑 =====
function bindViewerGestures() {
    touchStartHandler = touchStart;
    touchMoveHandler = touchMove;
    touchEndHandler = touchEnd;
    doubleTapHandler = doubleTap;

    viewer.addEventListener('touchstart', touchStartHandler, { passive: false });
    viewer.addEventListener('touchmove', touchMoveHandler, { passive: false });
    viewer.addEventListener('touchend', touchEndHandler, { passive: true });
    img.addEventListener('touchend', doubleTapHandler, { passive: false });
}

function unbindViewerGestures() {
    viewer.removeEventListener('touchstart', touchStartHandler);
    viewer.removeEventListener('touchmove', touchMoveHandler);
    viewer.removeEventListener('touchend', touchEndHandler);
    img.removeEventListener('touchend', doubleTapHandler);
}

// ===== 实际手势逻辑 =====
function getDistance(touches) {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
}

function touchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        swipeStartX = e.touches[0].clientX;
        if (scale > 1) {
            isDragging = true;
            dragStartX = e.touches[0].clientX - offsetX;
            dragStartY = e.touches[0].clientY - offsetY;
        } else {
            isSwiping = true;
        }
    } else if (e.touches.length === 2) {
        isPinching = true;
        lastTouchDistance = getDistance(e.touches);
    }
}

function touchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && scale > 1) {
        offsetX = e.touches[0].clientX - dragStartX;
        offsetY = e.touches[0].clientY - dragStartY;
        applyTransform();
    } else if (e.touches.length === 2 && isPinching) {
        const d = getDistance(e.touches);
        scale = Math.min(5, Math.max(0.5, scale * (d / lastTouchDistance)));
        applyTransform();
        lastTouchDistance = d;
    }
}

function touchEnd(e) {
    if (e.touches.length === 0) {
        if (isSwiping && scale <= 1) {
            const dx = e.changedTouches[0].clientX - swipeStartX;
            if (Math.abs(dx) > 50) changeImage(dx > 0 ? -1 : 1);
        }
        isDragging = isSwiping = isPinching = false;
    }
}

function doubleTap(e) {
    const now = Date.now();
    if (now - lastTapTime < 300) {
        e.preventDefault();
        if (scale > 1) {
            scale = 1;
            offsetX = offsetY = 0;
        } else {
            scale = 2;
            const t = e.changedTouches[0];
            const r = img.getBoundingClientRect();
            offsetX = (r.left + r.width / 2 - t.clientX) * (scale - 1);
            offsetY = (r.top + r.height / 2 - t.clientY) * (scale - 1);
        }
        applyTransform();
        lastTapTime = 0;
    } else {
        lastTapTime = now;
    }
}

// ===== 工具 =====
function changeImage(d) {
    const i = currentIndex + d;
    if (i < 0 || i >= currentImages.length) return;
    currentIndex = i;
    img.src = currentImages[currentIndex];
    scale = 1;
    offsetX = offsetY = 0;
    applyTransform();
}

function applyTransform() {
    img.style.transform = `translate(${offsetX}px,${offsetY}px) scale(${scale})`;
}
