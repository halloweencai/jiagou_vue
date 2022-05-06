// ast语法树是用对象描述原生语法的，虚拟dom 用对象来描述dom节点的
// ?: 匹配不捕获
// arguments[0] = 匹配到的标签   arguments[1] = 匹配到的标签名字
// id     =      "aaa" 或者  id   = 'aaaa'  id = aaaa
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/  // 匹配属性  \s = 空格
// console.log(`  aa =123`.match(attribute))
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`  // abc-aaa 命名空间
const qnameCapture = `((?:${ncname}\\:)?${ncname})`  // <aaa:b>
const startTagOpen = new RegExp(`^<${qnameCapture}`)  // 标签开头的正则，捕获内容是标签 div
const startTagClose = /^\s*(\/?)>/  // 匹配标签结束的 >   <div />
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)  // 匹配标签结尾的  </div?

// console.log('{{aaaa}}'.match(defaultTagRE))


export function parseHTML(html) {
    let root = null   // ast语法树的树根
    let currentParent   //  标识当前父亲是谁
    let stack = []
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3

    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
    function chars(text) {
        // console.log('文本是:',text)
        text = text.replace(/\s/g, '')
        if(text) {
            currentParent.children.push({
                text,
                type: TEXT_TYPE
            })
        }
    }
    function start(tagName, attrs) {
        // console.log('开始标签：' + tagName, '属性：' ,attrs)
        // 遇到开始标签，就创建一个ast元素s
        let element = createASTElement(tagName, attrs)
        if(!root) {
            root = element
        }
        currentParent = element   // 把当前元素标记成父ast树
        stack.push(element)   // 将开始标签存放到栈中
    }
    // <div><p></p></div>   [div,p]
    function end(tagName) {
        // console.log('结束标签:', tagName)
        let element = stack.pop()  
        // 标识当前这个p是属于这个div的儿子
        currentParent = stack[stack.length - 1]
        if(currentParent) {
            element.parent = currentParent
            currentParent.children.push(element)   // 实现了树的父子关系
        }
    }
    // 不停地去解析html字符串
    while(html) {
        let textEnd = html.indexOf('<')
        if(textEnd == 0) {
            // 如果当前索引为0  肯定是一个标签   开始标签 结束标签
            let startTagMatch = parseStartTag()  // 通过这个方法获取到匹配的结果
            if(startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue  //  如果开始标签匹配完毕后，继续下一次匹配
            }
            let endTagMatch = html.match(endTag)
            if(endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text
        if(textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if(text) {
            advance(text.length)
            chars(text)
        }
    }
    function advance(n) {
        html = html.substring(n)
    }
    function parseStartTag() {
        let start = html.match(startTagOpen)
        if(start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)  // 将标签删除
            let end, attr
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // 将属性进行解析
                advance(attr[0].length)  // 将属性去掉
                match.attrs.push({name: attr[1],value: attr[3] || attr[4] || attr[5]})
            }
            if(end) {  // 去掉开始标签的 >
                advance(end[0].length)
                return match
            }
        }
    }
    return root
}