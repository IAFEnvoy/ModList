const nodeWithText = (type, text) => {
    let node = document.createElement(type)
    node.innerText = text
    return node
}

const spanWithTextAndColor = (text, color) => {
    let span = document.createElement('span')
    span.innerText = text
    span.style.backgroundColor = color
    return span
}

window.onload = async _ => {
    const configuration = await fetch('./configuration.json').then(res => res.json())
    const data = await fetch('./data.json').then(res => res.json())
    let root = document.getElementById('root')
    for (let { title, subtitle, display, items } of data) {
        //h2 title
        root.appendChild(nodeWithText('h2', title))
        //h3 subtitle
        if (subtitle)
            root.appendChild(nodeWithText('h3', subtitle))
        let container = document.createElement('div')
        container.className = 'container'
        for (let { name, description, logo, links, tags, version, loader, status } of items) {
            let item = document.createElement('div')
            item.className = 'item'

            let mainFlex = document.createElement('div')
            if (display.logo) {
                mainFlex.style.display = 'flex'
                let img = document.createElement('img')
                img.className = 'logo-img'
                img.src = `./logos/mods/${logo}`
                img.alt = logo
                img.style.margin = '10px'
                mainFlex.appendChild(img)
            }
            let nameH1 = document.createElement('h2')
            nameH1.innerText = name
            nameH1.style.margin = '10px'
            nameH1.style.textAlign = 'center'
            mainFlex.appendChild(nameH1)
            item.append(mainFlex)

            if (display.modal)
                item.onclick = _ => openModal(name, description, `./logos/mods/${logo}`, links, tags)
            else
                item.appendChild(nodeWithText('h4', description))

            let tagsDiv = document.createElement('div')
            tagsDiv.className = 'tags'
            tagsDiv.appendChild(spanWithTextAndColor(version.join(', '), configuration.colors.version))
            for (let l of loader)
                tagsDiv.appendChild(spanWithTextAndColor(l, configuration.colors.loader[l] ?? '#FF777777'))
            if (display.status)
                tagsDiv.appendChild(spanWithTextAndColor(status, configuration.colors.status[status] ?? '#FF777777'))
            item.append(tagsDiv)
            container.appendChild(item)
        }
        root.appendChild(container)
    }
}

function openModal(title, description, imgSrc, links, tags) {
    document.getElementById('modalTitle').innerText = title
    document.getElementById('modalDescription').innerText = description
    document.getElementById('modalImage').src = imgSrc

    // 添加链接
    document.getElementById('githubLink').hidden = !links.gh
    document.getElementById('githubLink').href = links.gh
    document.getElementById('curseforgeLink').hidden = !links.cf
    document.getElementById('curseforgeLink').href = links.cf
    document.getElementById('modrinthLink').hidden = !links.mr
    document.getElementById('modrinthLink').href = links.mr

    // 添加标签
    const tagsContainer = document.getElementById('modalTags')
    tagsContainer.innerHTML = '' // 清空之前的标签
    tags.forEach(tag => {
        const span = document.createElement('span')
        span.innerText = tag
        span.style.backgroundColor = '#007BFF'
        span.style.color = '#fff'
        span.style.borderRadius = '12px'
        span.style.padding = '6px 12px'
        span.style.margin = '5px'
        span.style.display = 'inline-block'
        tagsContainer.appendChild(span)
    })

    // 显示模态框
    const modal = document.getElementById('modal')
    modal.classList.add('show') // 添加显示类
    modal.style.display = 'flex' // 显示模态框
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('modal')
    modal.classList.remove('show') // 移除显示类
    setTimeout(() => modal.style.display = 'none', 300) // 匹配动画持续时间
}