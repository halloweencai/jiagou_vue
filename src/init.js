import {initState} from './state'

import { compileToFunction } from "./compiler/index";

import {callHook, mountComponent} from './lifecycle'

import {mergeOptions} from './util/index'
// 在原型上添加一个init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function(options) {
        // console.log(options)
        // 数据的劫持
        const vm = this  // vue中使用this.options指代的就是用户传递的属性
        // 将用户传递的和全局的进行一个合并
        vm.$options = mergeOptions(vm.constructor.options,options)
        // console.log(vm.$options)
        callHook(vm, 'beforeCreate')
        // 初始化状态
        initState(vm)  // 分割代码

        callHook(vm, 'created')
        // 如果用户传入了el属性，需要将页面渲染出来
        // 如果用户传入el，就要实现挂载流程(渲染模版)
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        // 默认先会查找有没有render方法，没有就会采用template，template没有的话会使用el的内容
        if(!options.render) {
            // 对模版进行编译
            let template = options.template  // 取出模版
            if (!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunction(template)
            options.render = render
            // 需要将template转化成render方法  vue2.0 虚拟dom
        }
        // options.render
        
        // 渲染当前组件（挂载这个组件）
        mountComponent(vm,el)
    }
}