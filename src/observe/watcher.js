class Watcher {
    constructor(vm,exprOrFn,callback,options) {
        this.vm = vm
        this.callback = callback
        this.options = options
        debugger
        this.getter = exprOrFn  // 将内部的传过来的回调函数放到getter属性上
        this.get()
    }
    get() {
        this.getter()
    }
}

export default Watcher