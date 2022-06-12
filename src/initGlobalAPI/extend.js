import { mergeOptions } from "../util/index"
export default function initExtend(Vue) {

    // 为什么要有子类和父类，new Vue（Vue的构造函数）
    // 创建子类，继承于父类，扩展的时候都扩展到自己的属性上
    let cid = 0
    Vue.extend = function (extendOptions) {
        const Sub = function VueComponent(options) {
            // 调用Vue初始化方法
            this._init(options)
        }
        // Sub.cid = cid++
        Sub.prototype = Object.create(this.prototype)
        Sub.prototype.contructor = Sub
        Sub.options = mergeOptions(this.options, extendOptions)
        return Sub
    }
}