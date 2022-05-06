import {parseHTML} from './parse-html'
import { generate } from './generate'
export function compileToFunction(template) {
    // 解析html字符串，将html字符串 =》 ast语法树
    let root = parseHTML(template)

    // 需要将ast语法树生成最终的render函数，就是字符串拼接
    let code = generate(root)

    // console.log(root)
    // console.log(code)
    // 核心思路就是将模版转化成下面这段字符串
    // <div id="app"><p>hello {{ name }}</p> hello</div>
    // 将ast树再次转化成js的语法
    // _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name))),_v('hello'))
    
    // 所有的模版引擎实现，都需要new Function + with
    let renderFn = new Function(`with(this){return ${code}}`)
    // vue 的render返回的是虚拟dom
    return renderFn
}
