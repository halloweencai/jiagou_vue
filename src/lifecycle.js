import Watcher from "./observe/watcher.js"
import {patch} from './vdom/patch.js'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        // 我要通过虚拟节点，渲染出真实的dom
        vm.$el = patch(vm.$el, vnode)
        console.log(vnode)
    }
}

export function mountComponent(vm,el) {
    const options = vm.$options  // render
    vm.$el = el  // 真实的dom元素

    // Watcher 就是用来渲染的
    // vm._render() 通过解析的render方法渲染出虚拟dom  _c _v _s
    // vm._update() 通过虚拟dom创建真实的dom
    callHook(vm, 'beforeMount')
    // 渲染页面
    let updateComponent = () => { // 无论是渲染还是更新都调用此方法
        vm._update(vm._render())  
    }
    debugger
    // 渲染watcher，每个组件都有一个watcher
    new Watcher(vm, updateComponent,()=>{},true)  // true代表它是一个渲染watcher
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook];  // [fn,fn,fn]
    if(handlers) {
        // 找到对应钩子依次执行
        for(let i=0; i<handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}