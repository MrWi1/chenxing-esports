// ===== 全局状态 =====
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let currentImages = [];
let currentIndex = 0;

// 拖拽状态
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

// 触摸缩放状态
let lastTouchDistance = 0;
let isPinching = false;

// 滑动切换状态
let swipeStartX = 0;
let swipeStartY = 0;
let isSwiping = false;

// 双击检测
let lastTapTime = 0;

// ✅ 新增：是否处于图片查看模式
let viewerActive = false;

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderMenu('delta-exclusive');
    setupSearch();
    setupViewer();
    setupTouchGestures();
});

// ===== 渲染导航栏 =====
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
    const firstActive = Object.keys(MENU_DATA).find(key => MENU_DATA[key].items.length > 0);
    if (firstActive) {
        const activeBtn = document.querySelector(`[data-category="${firstActive}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}

// ===== 渲染菜单 =====
function renderMenu(category) {
    const section = document.getElementById('menuSection');
    section.innerHTML = '';
    const items = MENU_DATA[category]?.items || [];
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = item.id;
        card.innerHTML = `
      <div class="card-image">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="card-tags">
          ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
    `;
        card.onclick = () => openViewer(item.img, items, items.indexOf(item));
        section.appendChild(card);
    });
}

// ===== 搜索功能 =====
function setupSearch() {
    const input = document.getElementById('searchInput');
    input.oninput = (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const desc = card.querySelector('p').innerText.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.innerText.toLowerCase()).join(' ');
            const isMatch = !keyword || title.includes(keyword) || desc.includes(keyword) || tags.includes(keyword);
            card.style.display = isMatch ? 'block' : 'none';
        });
    };
}

// ===== 图片查看器 =====
const viewer = document.getElementById('imageViewer');
const img = document.getElementById('viewerImg');

/* 打开查看器 */
function openViewer(imgPath, items, index) {
    if (!img || !viewer) return;

    viewerActive = true; // ✅ 启用触摸手势
    currentImages = items.map(item => item.img);
    currentIndex = index || 0;

    img.src = imgPath;
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();

    viewer.classList.add('active');
    updateViewerButtons();
    document.body.style.overflow = 'hidden';
}

/* 更新按钮 */
function updateViewerButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.style.visibility = currentIndex <= 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = currentIndex >= currentImages.length - 1 ? 'hidden' : 'visible';
}

/* 切换图片 */
function changeImage(delta) {
    const newIndex = currentIndex + delta;
    if (newIndex < 0 || newIndex >= currentImages.length) return;
    currentIndex = newIndex;
    img.src = currentImages[currentIndex];
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
    updateViewerButtons();
}

/* 关闭 */
function closeViewerHandler() {
    viewerActive = false; // ✅ 禁用触摸手势
    viewer.classList.remove('active');
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    document.body.style.overflow = '';
}
document.getElementById('closeViewer').onclick = closeViewerHandler;

/* 放大/缩小 */
document.getElementById('zoomIn').onclick = () => {
    scale = Math.min(scale * 1.3, 5);
    applyTransform();
};
document.getElementById('zoomOut').onclick = () => {
    scale = Math.max(scale / 1.3, 0.5);
    if (scale <= 1) offsetX = offsetY = 0;
    applyTransform();
};

document.getElementById('prevBtn').onclick = () => changeImage(-1);
document.getElementById('nextBtn').onclick = () => changeImage(1);

/* 应用变换 */
function applyTransform() {
    img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

/* 滚轮缩放 */
viewer.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.5, Math.min(scale * delta, 5));
    applyTransform();
}, { passive: false });

/* 鼠标拖拽 */
img.onmousedown = function (e) {
    if (e.button !== 0 || scale <= 1) return;
    isDragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    img.style.cursor = 'grabbing';
    e.preventDefault();
};
img.onmousemove = function (e) {
    if (!isDragging) return;
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    applyTransform();
};
img.onmouseup = () => {
    isDragging = false;
    img.style.cursor = scale > 1 ? 'grab' : 'default';
};
img.onmouseleave = () => {
    isDragging = false;
    img.style.cursor = scale > 1 ? 'grab' : 'default';
};

// ===================================================================
//  手机端触摸手势（✅ 仅在 viewerActive 为 true 时生效）
// ===================================================================
function setupTouchGestures() {

    function getTouchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }

    /* touchstart */
    viewer.addEventListener('touchstart', function (e) {
        if (!viewerActive) return;
        e.preventDefault();

        if (e.touches.length === 1) {
            const t = e.touches[0];
            swipeStartX = t.clientX;
            swipeStartY = t.clientY;

            if (scale > 1) {
                isDragging = true;
                dragStartX = t.clientX - offsetX;
                dragStartY = t.clientY - offsetY;
            } else {
                isSwiping = true;
            }
        } else if (e.touches.length === 2) {
            isPinching = true;
            isDragging = false;
            isSwiping = false;
            lastTouchDistance = getTouchDistance(e.touches);
        }
    }, { passive: false });

    /* touchmove */
    viewer.addEventListener('touchmove', function (e) {
        if (!viewerActive) return;
        e.preventDefault();

        if (e.touches.length === 1 && isDragging && scale > 1) {
            offsetX = e.touches[0].clientX - dragStartX;
            offsetY = e.touches[0].clientY - dragStartY;
            applyTransform();
        } else if (e.touches.length === 2 && isPinching) {
            const dist = getTouchDistance(e.touches);
            scale = Math.max(0.5, Math.min(scale * (dist / lastTouchDistance), 5));
            applyTransform();
            lastTouchDistance = dist;
        }
    }, { passive: false });

    /* touchend */
    viewer.addEventListener('touchend', function (e) {
        if (!viewerActive) return;

        if (e.touches.length === 0) {
            if (isSwiping && scale <= 1) {
                const diffX = e.changedTouches[0].clientX - swipeStartX;
                if (Math.abs(diffX) > 50) {
                    changeImage(diffX > 0 ? -1 : 1);
                }
            }
            isDragging = false;
            isSwiping = false;
            isPinching = false;
        } else if (e.touches.length === 1 && isPinching) {
            isPinching = false;
            if (scale > 1) {
                isDragging = true;
                dragStartX = e.touches[0].clientX - offsetX;
                dragStartY = e.touches[0].clientY - offsetY;
            }
        }
    }, { passive: true });

    /* 双击 */
    img.addEventListener('touchend', function (e) {
        if (!viewerActive) return;

        const now = Date.now();
        if (now - lastTapTime < 350) {
            e.preventDefault();
            if (scale > 1) {
                scale = 1;
                offsetX = 0;
                offsetY = 0;
            } else {
                scale = 2;
                const t = e.changedTouches[0];
                const rect = img.getBoundingClientRect();
                offsetX = (rect.left + rect.width / 2 - t.clientX) * (scale - 1);
                offsetY = (rect.top + rect.height / 2 - t.clientY) * (scale - 1);
            }
            applyTransform();
            lastTapTime = 0;
        } else {
            lastTapTime = now;
        }
    }, { passive: false });
}

// ===== 粒子背景 =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        d: Math.random() * 1,
        color: `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });
    moveParticles();
}

function moveParticles() {
    particles.forEach(p => {
        p.y += Math.pow(p.d, 2) + 0.2;
        if (p.y > canvas.height) {
            particles.splice(particles.indexOf(p), 1);
            particles.push({
                x: Math.random() * canvas.width,
                y: 0,
                r: p.r,
                d: p.d,
                color: p.color
            });
        }
    });
}

setInterval(drawParticles, 33);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
