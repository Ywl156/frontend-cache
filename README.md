## frontendStore 前端储存工具

### 介绍

- 封装 localStorage 和 sessionStorage，方法个数及方法调用方式与原对象一致，setItem 方法提供额外过期时间传参，且兼容原对象方法存储的数据。

- 封装 cookie，提供多个方法调用，简化操作。

### 安装

- `npm i frontend-store`

- 全局引入 `<script src="https://unpkg.com/frontend-store/dist/index.js"></script>` 暴露全局变量 `frontendStore`

### 使用

```javaScript
import frontendStore from 'frontend-store'

// -- *storage* localStorage、sessionStorage用法一致 --
// key的类型都为string
frontendStore.localStorage.getItem(key)
// value: string | Record<string, any>
// expire?: number (过期时间戳：单位毫秒)
// frontendStore.localStorage.setItem('key', { name: '666' }, Date.now() + 1000 * 60 * 60 * 24)
frontendStore.localStorage.setItem(key, value, expire)
frontendStore.localStorage.removeItem(key)
frontendStore.localStorage.clear()

// -------------------------------------------

// *cookie*
// key的类型都为string
frontendStore.cookies.getItem(key)
// value: string
/*
* options:
*   end?: number | string | Date
*   domain?: string
*   path?: string ()
*   secure?: boolean (cookie 只会被 https 传输)
*/
/*
end
- 类型为number时，值为过期的秒数，永不过期为Infinity；
- 类型为string时，值为过期时间的 GMTString 格式；
- 类型为Date时，值为过期时间的 Date 对象；
- 如果没有定义则会在会话结束时过期。

path
- 例如 '/', '/mydir'。如果没有定义，默认为当前文档位置的路径。路径必须为绝对路径

domain
- 例如 'example.com'，'.example.com' (包括所有子域名), 'subdomain.example.com'。如果没有定义，默认为当前文档位置的路径的域名部分。

secure
- cookie 只会被 https 传输。
*/
frontendStore.cookies.setItem(key, value, options)
frontendStore.cookies.removeItem(key)
frontendStore.cookies.hasItem(key)
frontendStore.cookies.keys()
```
