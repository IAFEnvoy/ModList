function openModal(title, description, imgSrc, links, tags) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('modalImage').src = imgSrc;

    // 添加链接
    document.getElementById('githubLink').hidden = !links.gh;
    document.getElementById('githubLink').href = links.gh;
    document.getElementById('curseforgeLink').hidden = !links.cf;
    document.getElementById('curseforgeLink').href = links.cf;
    document.getElementById('modrinthLink').hidden = !links.mr;
    document.getElementById('modrinthLink').href = links.mr;

    // 添加标签
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = ''; // 清空之前的标签
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.innerText = tag;
        span.style.backgroundColor = '#007BFF';
        span.style.color = '#fff';
        span.style.borderRadius = '12px';
        span.style.padding = '6px 12px';
        span.style.margin = '5px';
        span.style.display = 'inline-block';
        tagsContainer.appendChild(span);
    });

    // 显示模态框
    const modal = document.getElementById('modal');
    modal.classList.add('show'); // 添加显示类
    modal.style.display = 'flex'; // 显示模态框
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show'); // 移除显示类
    setTimeout(() => {
        modal.style.display = 'none'; // 隐藏模态框
    }, 300); // 匹配动画持续时间
}