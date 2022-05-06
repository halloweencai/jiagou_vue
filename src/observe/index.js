// 把data中的数据，都使用Object.defineProperty重新定义 （es5）
// Object.defineProperty 不能兼容ie8及以下，所以vue2无法兼容ie8版本
import {arrayMethods} from './array'
import {isObject, def} from '../util/index'
class Observer {
    constructor(value) {
        // vue如果数据的层次过多，需要递归地去解析对象中的属性，依次增加get和set方法
        // value.__ob__ = this  // 给每一个监控过的对象都增加一个__ob__属性
        // console.log(value, 'aaaa')
        def(value,'__ob__',this)
        if(Array.isArray(value)) {
            // 如果是数组的话并不会对索引进行观测，因为会导致性能问题
            // 前端开发中很少很少去操作索引  push shift unshift
            value.__proto__ = arrayMethods
            
            // 如果数组里放的是对象再监控
            this.observerArray(value)
        } else {
            this.walk(value)  // 对对象进行观测
        }
        
    }
    // 遍历数组
    observerArray(value) {
        for(let i = 0; i < value.length; i++) {
            observe(value[i])
        }
    }
    // 遍历对象
    walk(data) {
        let keys = Object.keys(data)  // [name,age,address]

        // 如果这个data不可配置，直接return
        keys.forEach((key) => {
            defineReactive(data,key,data[key])  // 定义响应式数据
        })
    }

}
// 响应式的核心
function defineReactive(data,key,value) {
    observe(value) // 递归实现深度检测
    Object.defineProperty(data,key,{
        configurable: true,
        enumerable: true,
        get() {  // 获取值的时候做一些操作
            return value
        },
        set(newValue) {
            // console.log('更新数据')
            if(newValue === value) return
            observe(newValue) // 继续劫持用户设置的值，用户有可能设置的值是一个对象
            value = newValue
        }
    })
} 
export function observe(data) {
    let isObj = isObject(data)
    if(!isObj) {
        return
    }
    return new Observer(data)  //用来观测数据
}