let configuration, data, loadingCounter = 0

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
    configuration = await fetch('./data/configuration.json').then(res => res.json())
    data = await fetch('./data/category.json').then(res => res.json())
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
            let item = document.createElement('div')
            item.className = 'item'
            container.appendChild(item)

            loadingCounter++
            fetch(`./data/item/${i}.json`).then(res => res.json()).then(json => {
                let { name, description, logo, mod_meta, ids, tags, versions, status, coop } = json

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

                // Collect versions
                let versionsTable = '', loaders = [], version = '???', usedStatus = new Set()
                if (versions) {
                    let loaderTemp = {}, availableVersions = [], ignored = configuration.misc.ignoredInSupportedVersions
                    Object.keys(versions).filter(x => Object.values(versions[x]).filter(y => ignored.indexOf(y) == -1).length > 0).forEach(x => availableVersions.push(x))
                    Object.values(versions).forEach(x => loaderTemp = { ...loaderTemp, ...x })
                    loaders = Object.keys(loaderTemp)
                    versionsTable = `<thead><tr><th></th>${loaders.map(x => `<th>${x}</th>`).join('')}</tr></thead>`
                    versionsTable += '<tbody>'
                    for (let v of Object.keys(versions)) {
                        versionsTable += `<tr><td>${v}</td>`
                        let obj = versions[v]
                        for (let l of loaders) {
                            usedStatus.add(obj[l])
                            let status = configuration?.icons?.versions?.[obj[l] ?? '']
                            versionsTable += `<td>${status?.emoji ?? ''}</td>`
                        }
                        versionsTable += '</tr>'
                    }
                    versionsTable += '</tbody>'
                    version = buildMainVersion(availableVersions, configuration?.misc?.versionConnector ?? '~')
                }

                if (display.modal)
                    item.onclick = _ => openModal(name, description, `./logos/mods/${logo}`, mod_meta, ids, tags, usedStatus, versionsTable)
                else
                    item.appendChild(nodeWithText('h4', description))

                let tagsDiv = document.createElement('div')
                tagsDiv.className = 'tags'
                tagsDiv.appendChild(spanWithTextAndColor(version, configuration?.colors?.version ?? '#777777'))
                for (let l of loaders)
                    tagsDiv.appendChild(spanWithTextAndColor(l, configuration?.colors?.loader?.[l] ?? '#777777'))
                if (display.status)
                    tagsDiv.appendChild(spanWithTextAndColor(status, configuration?.colors?.status?.[status] ?? '#777777'))
                if (coop)
                    tagsDiv.appendChild(spanWithTextAndColor('Co-Author: ' + coop.join(', '), configuration?.colors?.coop ?? '#777777'))
                item.append(tagsDiv)

                loadingCounter--
                if (loadingCounter == 0) document.getElementById('spinner').classList.add('hidden');
            })
        }
    }
}

const buildMainVersion = (allVersions, connector) => {
    if (allVersions.length == 0) return '???'
    if (allVersions.length == 1) return allVersions[0]
    if (allVersions.length == 2) return `${allVersions[0]}, ${allVersions[1]}`
    let start = allVersions[0], end = allVersions[allVersions.length - 1]
    if (start.indexOf(connector) != -1) start = start.split(connector)[0]
    if (end.indexOf(connector) != -1) end = end.split(connector)[1]
    return start + connector + end
}

const openModal = (title, description, imgSrc, modMeta, ids, tags, usedStatus, versionsTable) => {
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
    if (modMeta?.id) {
        tagsContainer.appendChild(constructModalSpan(`MODID: ${modMeta.id}`, 'grey', modMeta.id))
        tagsContainer.appendChild(document.createElement('br'))
    }
    if (ids.cf) tagsContainer.appendChild(constructModalSpan(`CFID: ${ids.cf}`, 'orange', ids.cf))
    if (ids.mr) tagsContainer.appendChild(constructModalSpan(`MRID: ${ids.mr}`, 'green', ids.mr))

    //添加版本信息
    let versionConfig = configuration?.icons?.versions ?? {}
    document.getElementById('versionLegend').innerHTML = Object.keys(versionConfig).filter(x => usedStatus.has(x)).map(x => versionConfig[x] ?? {}).map(x => x.emoji + x.text).join('<br>')
    document.getElementById('versions').innerHTML = versionsTable

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