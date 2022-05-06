const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // {{}}

function genProps(attrs) {
    let str = ''
    for(let i=0; i<attrs.length; i++) {
        let attr = attrs[i]
        if(attr.name === 'style') {
            // style="color: red;"  => {style: {color: 'red'}}
            let obj = {}
            let arr = attr.value.split(";")
            arr.forEach(item => {
                let [key,value] = item.split(":")
                obj[key] = value 
            })
            attr.value = obj
            
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`  // 去掉最后一个逗号
}
function genChildren(el) {
    let children = el.children
    if(children && children.length > 0) {
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false
    }
}
function gen(node) {
    if(node.type === 1) {
        // 元素标签
        return generate(node)
    } else {
        let text = node.text   // <div> a {{name}}  b{{age}}  c </div>
        // 每次的偏移量  buffer.split()
        let lastIndex = defaultTagRE.lastIndex = 0  // 只要全匹配，就要将lastIndex每次匹配调到0处
        let tokens = []
        let match, index
        while (match = defaultTagRE.exec(text)) {
            index = match.index
            if(index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if(lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        // exec(正则问题)  lastIndex
        // _v("a"+_s(name)+"b"+_s(age)+"c")
        
        return `_v(${tokens.join('+')})`
    }
}
export function generate(el) {
    let children = genChildren(el)
    let code = `_c("${el.tag}",${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${
        children ? `,${children}` : ''
    })`

    return code
}