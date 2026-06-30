// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderMenu('delta-exclusive'); // 默认显示独家趣味单
    setupSearch();
    setupViewer();
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
    // 默认激活第一个有内容的分类
    const firstActive = Object.keys(MENU_DATA).find(key => MENU_DATA[key].items.length > 0);
    if (firstActive) {
        document.querySelector(`[data-category="${firstActive}"]`).classList.add('active');
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
        <img src="${item.img}" alt="${item.name}">
        <div class="card-tags">
          ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="card-content">
        <h3>${item.name}</h3>
        ${item.desc}
      </div>
    `;
        card.onclick = () => openViewer(item.img);
        section.appendChild(card);
    });
}

// ===== 搜索功能 =====
function setupSearch() {
    const input = document.getElementById('searchInput');
    input.oninput = (e) => {
        const keyword = e.target.value.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const desc = card.querySelector('p').innerText.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.innerText.toLowerCase()).join(' ');
            const isMatch = title.includes(keyword) || desc.includes(keyword) || tags.includes(keyword);
            card.style.display = isMatch ? 'block' : 'none';
        });
    };
}

/* ===== 图片查看器 ===== */
let scale = 1;
let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let longPressTimer = null;
let startX = 0;
let startY = 0;

const viewer = document.getElementById('imageViewer');
const img = document.getElementById('viewerImg');

/* 打开查看器 */
function openViewer(imgPath) {
    const imgEl = document.getElementById('viewerImg');
    const viewerEl = document.getElementById('imageViewer');
    if (!imgEl || !viewerEl) {
        console.error("DOM 元素缺失！请确认 HTML 中有 #viewerImg 和 #imageViewer");
        return;
    }
    imgEl.src = imgPath;
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
    viewerEl.classList.add('active');
}

/* 关闭 */
document.getElementById('closeViewer').onclick = () => {
    viewer.classList.remove('active');
};

/* 滚轮整体放大 */
viewer.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.5, Math.min(scale * delta, 5));
    applyTransform();
});

// 状态管理（如果已有 state 对象，直接复用）
let state = {
    isDragging: false,
    translateX: 0,
    translateY: 0,
    dragStartX: 0,
    dragStartY: 0
};

// ===== 鼠标拖拽=====

img.onmousedown = function (e) {
    if (e.button !== 0) return;   // 只认左键
    if (scale <= 1) return;       // 未放大不拖

    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;

    img.style.cursor = 'grabbing';
    e.preventDefault();
};

img.onmousemove = function (e) {
    if (!isDragging) return;

    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    applyTransform();
};

img.onmouseup = function () {
    isDragging = false;
    img.style.cursor = scale > 1 ? 'grab' : 'default';
};

img.onmouseleave = function () {
    isDragging = false;
    img.style.cursor = scale > 1 ? 'grab' : 'default';
};
/* 应用变换 */
function applyTransform() {
    img.style.transform =
        `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

/* 切换图片（保持你第一次的结构） */
document.getElementById('prevBtn').onclick = () => changeImage(-1);
document.getElementById('nextBtn').onclick = () => changeImage(1);

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
