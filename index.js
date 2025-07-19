const nodeWithText = (type, text) => {
    let node = document.createElement(type)
    node.innerText = text
    return node
}

const spanWithTextAndColor = (text, color) => {
    let span = document.createElement('span')
    span.innerText = text
    span.style.backgroundColor = color + []
    return span
}

window.onload = async _ => {
    const configuration = await fetch('./data/configuration.json').then(res => res.json())
    const data = await fetch('./data/category.json').then(res => res.json())
    let root = document.getElementById('root')
    for (let { title, subtitle, display, items } of data) {
        //<br>
        root.appendChild(document.createElement('br'))
        //h2 title
        root.appendChild(nodeWithText('h2', title))
        //h3 subtitle
        if (subtitle)
            root.appendChild(nodeWithText('h3', subtitle))
        let container = document.createElement('div')
        container.className = 'container'
        root.appendChild(container)
        for (let i of items) {
            let { name, description, logo, mod_meta, ids, tags, version, loaders, status, coop } = await fetch(`./data/item/${i}.json`).then(res => res.json())
            let item = document.createElement('div')
            item.className = 'item'
            container.appendChild(item)

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
                item.onclick = _ => openModal(name, description, `./logos/mods/${logo}`, mod_meta, ids, tags)
            else
                item.appendChild(nodeWithText('h4', description))

            let tagsDiv = document.createElement('div')
            tagsDiv.className = 'tags'
            tagsDiv.appendChild(spanWithTextAndColor(version, configuration.colors.version))
            for (let l of loaders)
                tagsDiv.appendChild(spanWithTextAndColor(l, configuration.colors.loader[l] ?? '#777777'))
            if (display.status)
                tagsDiv.appendChild(spanWithTextAndColor(status, configuration.colors.status[status] ?? '#777777'))
            if (coop)
                tagsDiv.appendChild(spanWithTextAndColor('Co-Author: ' + coop.join(', '), configuration.colors.coop ?? '#777777'))
            item.append(tagsDiv)
        }
    }
}

const openModal = (title, description, imgSrc, mod_meta, ids, tags) => {
    document.getElementById('modalTitle').innerText = title
    document.getElementById('modalDescription').innerText = description
    document.getElementById('modalImage').src = imgSrc

    // 添加链接
    document.getElementById('githubLink').hidden = !ids.gh
    document.getElementById('githubLink').href = 'https://github.com/' + ids.gh
    document.getElementById('curseforgeLink').hidden = !ids.cf
    document.getElementById('curseforgeLink').href = 'https://www.curseforge.com/projects/' + ids.cf
    document.getElementById('modrinthLink').hidden = !ids.mr
    document.getElementById('modrinthLink').href = 'https://modrinth.com/project/' + ids.mr
    document.getElementById('wikiLink').hidden = !ids.wiki
    document.getElementById('wikiLink').href = ids.wiki

    // 添加标签
    const tagsContainer = document.getElementById('modalTags')
    tagsContainer.innerHTML = '' // 清空之前的标签
    tags.forEach(tag => tagsContainer.appendChild(constructModalSpan(tag, '#007BFF')))
    tagsContainer.appendChild(document.createElement('br'))
    tagsContainer.innerHTML += 'Click To Copy: '
    if (mod_meta?.id) {
        tagsContainer.appendChild(constructModalSpan(`MODID: ${mod_meta.id}`, 'grey', mod_meta.id))
        tagsContainer.appendChild(document.createElement('br'))
    }
    if (ids.cf) tagsContainer.appendChild(constructModalSpan(`CFID: ${ids.cf}`, 'orange', ids.cf))
    if (ids.mr) tagsContainer.appendChild(constructModalSpan(`MRID: ${ids.mr}`, 'green', ids.mr))

    // 显示模态框
    const modal = document.getElementById('modal')
    modal.style.display = 'flex' // 显示模态框
    setTimeout(() => modal.classList.add('show'), 300) // 添加显示类
}

const constructModalSpan = (text, bgColor, copyText) => {
    const span = document.createElement('span')
    span.innerText = text
    span.style.backgroundColor = bgColor
    span.style.color = '#fff'
    span.style.borderRadius = '12px'
    span.style.padding = '6px 12px'
    span.style.margin = '5px'
    span.style.display = 'inline-block'
    if (copyText) {
        span.onclick = _ => copyToClip(span, copyText)
        span.style.cursor = 'pointer'
    }
    return span
}

const copyToClip = (span, content) => {
    navigator.clipboard.writeText(content)
    let origin = span.innerText
    span.innerText = 'Copied!'
    setTimeout(_ => span.innerText = origin, 500);
}

// 关闭模态框
const closeModal = _ => {
    const modal = document.getElementById('modal')
    modal.classList.remove('show') // 移除显示类
    setTimeout(() => modal.style.display = 'none', 300) // 匹配动画持续时间
}