export function patch(oldNode, vnode) {
    // 1.判断是更新还是要渲染

    const isRealElement = oldNode.nodeType
    if(isRealElement) {
        const oldElm = oldNode  // div id="app"
        const parentElm = oldElm.parentNode  // body

        let el = createElm(vnode)
        parentElm.insertBefore(el,oldElm.nextSibling)
        parentElm.removeChild(oldElm)

        // 需要将渲染好的结果返回
        return el
    }
    // console.log(oldNode, vnode)

    // 递归创建真实节点，替换掉老的节点
}

function createElm(vnode) { // 根据虚拟节点创建真实的节点
    let {tag,children,key,data,text} = vnode
    // 是标签就创建标签
    if(typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => {
            // 递归创建儿子节点，将儿子节点扔到父节点中
            return vnode.el.appendChild(createElm(child))
        })
    } else {
        // 虚拟dom上映射着真实dom，方便后续更新操作
        vnode.el = document.createTextNode(text)
    }

    return vnode.el
}

function updateProperties(vnode) {
    let newProps = vnode.data || {}
    let el = vnode.el

    for(let key in newProps) {
        if(key === 'style') {
            for(let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if(key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key,newProps)
        }
    }
}

/* <div id="app">{{ name }}</div> */