// 重写数组的哪些方法 7个 push shift unshift pop reverse sort splice会导致数组本身发生变化
// slice不会改变原数组

let oldArrayMethods = Array.prototype
// value.__proto__ = arrayMethods  原型链查找的问题：会向上查找，先查找重写的，没有重写的会继续向上查找
// arrayMethods.__proto__ = oldArrayMethods
const arrayMethods =  Object.create(oldArrayMethods)

const methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'sort',
    'splice',
    'reverse'
]
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('用户调用了' + method + '方法')  // AOP 切片编程
        const result = oldArrayMethods[method].apply(this,args)  // 调用原生的数组方法
        // push  unshift 添加的元素可能还是一个对象
        let inserted  // 当前用户插入的元素
        let ob = this.__ob__
        console.log(ob)
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': // 有删除、修改、新增功能  arr.splice(0,1,{name: 1})
                inserted = args.slice(2)
                break
            default:
                break;
        }
        if(inserted) { // inserted是个数组
            ob.observerArray(inserted) // 将新增属性继续观测
        }
        return result
    }
})

export {
    arrayMethods
}