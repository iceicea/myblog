---
title: "手写题"
---

# 面试手写场景题

## 1. 实现 bind,call 以及 apply

:::tip
Function 实例的 apply() 方法会以给定的 this 值和作为数组（或类数组对象）提供的 arguments 调用该函数。  
Function 实例的 bind() 方法创建一个新函数，当调用该新函数时，它会调用原始函数并将其 this 关键字设置为给定的值，同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。
bind() 函数创建一个新的绑定函数（bound function）。调用绑定函数通常会执行其所包装的函数，也称为目标函数（target function）。绑定函数将绑定时传入的参数（包括 this 的值和前几个参数）提前存储为其内部状态。而不是在实际调用时传入。

通常情况下，你可以将 const boundFn = fn.bind(thisArg, arg1, arg2) 和 const boundFn = (...restArgs) => fn.call(thisArg, arg1, arg2, ...restArgs) 构建的绑定函数的调用效果视为等效（但就构建 boundFn 的过程而言，不是二者等效的）。
:::
:::code-group

```js [apply.js]
Function.prototype.myApply = function (ctx, args) {
  ctx = ctx || window;
  let f = Symbol(); // 将函数作为上下文对象的一个属性
  ctx[f] = this;
  let ret = ctx[f](...args);
  delete ctx[f]; // 清理掉 fn ，防止污染（即清掉obj上的fnKey属性）
  return ret;
};
```

```js [call.js]
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx || window;
  let f = Symbol();
  ctx[f] = this;
  let ret = ctx[f](...args);
  delete ctx[f];
  return ret;
};
```

```js [bind.js]
Function.prototype.myBind = function (ctx, ...args) {
  ctx = ctx || window;
  let self = this; // this表示调用bind的函数 fn.bind(obj) self就是fn
  let fBound = function (...args2) {
    //this instanceof fBound为true表示构造函数的情况。如new func.bind(obj)
    // 当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true，可以让实例获得来自绑定函数的值
    // 当作为普通函数时，this 默认指向 window，此时结果为 false，将绑定函数的 this 指向 context
    return self.apply(this instanceof fBound ? this : ctx, args.concat(args2));
  };
  fBound.prototype = Object.create(this.prototype);
  return fBound;
};
```

:::

## 2. 清除字符串前后的空格

```js
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
  };
}
```

## 3. 判断输入是否回文字符串

```js
function isPalindrome(input) {
  if (typeof input !== "string") return false;
  return input.split("").reverse().join("") === input;
}
```

## 4. 数组扁平化 flat

::: code-group

```js [递归]
function flatten(arr) {
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      ret = ret.concat(flatten(arr[i]));
    } else {
      ret.push(arr[i]);
    }
  }
}
```

```js [reduce]
const flatten = (arr) =>
  arr.reduce(
    (prev, item) => prev.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
```

```js [利用toString()方法]
function flatten(arr) {
  return arr.toString().split(",");
}
```

:::

## 5. 手写 new 操作符

```js
function myNew(constructor, ...args) {
  //创建空对象,并指定原型为构造函数的原型
  const newObj = {};
  Object.setPrototypeOf(newObj, constructor.prototype);
  //也可以用:const newObj = Object.create(constructor.prototype);
  // 将构造函数的作用域赋给新对象，并执行构造函数
  const ret = constructor.apply(newObj, args);
  // 如果构造函数有显式返回一个对象，则返回该对象；否则返回新对象
  return typeof ret === "object" && ret !== null ? ret : newObj;
}
```

## 6. 防抖与节流

::: code-group

```js [debounce.js]
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

```js [throttle.js]
//1. 时间戳的方式, 先执行一次
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    let now = +new Date();
    if (now - last > delay) {
      last = now;
      fn.apply(this.args);
    }
  };
}
//2. 定时器的方式
function throttle(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
```

:::

## 7. 使用 setTimeout 模拟实现 setInterval

::: code-group

```js [mySetInterval.js]
function mySetInterval(fn, delay) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, delay); //递归调用
  }
  timer = setTimeout(interval, delay); //首次调用
  return {
    //利用闭包的特性保存timer
    cancel: () => {
      clearTimeout(timer);
    },
  };
}
```

```js [mySetTimeout.js]
//setInterval 模拟实现 setTimeout
const mySetTimeout = (fn, t) => {
  const timer = setInterval(() => {
    clearInterval(timer);
    fn();
  }, t);
};
```

:::
:::tip
定时器指定的时间间隔，表示的是何时将定时器的代码添加到消息队列，而不是何时执行代码。所以真正何时执行代码的时间是不能保证的，取决于何时被主线程的事件循环取到,每个 setTimeout 产生的任务会直接 push 到任务队列中；而 setInterval 在每次把任务 push 到任务队列前，都要进行一下判断(看上次的任务是否仍在队列中)。因而我们一般用 setTimeout 模拟 setInterval，来规避掉上面的缺点
:::

## 8. 实现 instanceof

核心在于判断右侧操作数的 prototype 属性是否在左操作数的原型链上

```js
function myInstanceof(obj, constructor) {
  if (obj === null || typeof obj !== "object") {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  // 沿着原型链向上查找，直到找到constructor的prototype或者null
  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto); // 继续向上查找
  }
  // 如果没有找到匹配的prototype，返回false
  return false;
}

// 使用示例
class MyClass {
  constructor() {
    this.value = 123;
  }
}

var myInstance = new MyClass();

console.log(myInstanceOf(myInstance, MyClass)); // true
console.log(myInstanceOf(myInstance, Object)); // true，因为MyClass继承自Object
console.log(myInstanceOf(myInstance, Array)); // false
```

## 9. 封装 ajax

![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408212126801.png)
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408212127256.png)

### 1. 原生实现

```js
function ajax(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.send < 300) {
        console.log(xhr.responseText);
      }
    }
  };
  xhr.send(null);
}
```

### 2. 基于 Promise

```js
function ajax(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject("error");
        }
      }
    };
    xhr.send(null);
  });
}
ajax(url)
  .then((res) => console.log(res))
  .catch((reson) => console.log(reson));
```

## 10. 实现 Object.is

:::tip
Object.is() 确定两个值是否为相同值。如果以下其中一项成立，则两个值相同：

- 都是 undefined -都是 null
- 都是 true 或者都是 false
- 都是长度相同、字符相同、顺序相同的字符串
- 都是相同的对象（意味着两个值都引用了内存中的同一对象）
- 都是 BigInt 且具有相同的数值
- 都是 symbol 且引用相同的 symbol 值
- 都是数字且
- 都是 +0
- 都是 -0
- 都是 NaN
- 都有相同的值，非零且都不是 NaN

Object.is() 与 == 运算符并不等价。== 运算符在测试相等性之前，会对两个操作数进行类型转换（如果它们不是相同的类型），这可能会导致一些非预期的行为，例如 "" == false 的结果是 true，但是 Object.is() 不会对其操作数进行类型转换。
Object.is() 也不等价于 === 运算符。Object.is() 和 === 之间的唯一区别在于它们处理带符号的 0 和 NaN 值的时候。=== 运算符（和 == 运算符）将数值 -0 和 +0 视为相等，但是会将 NaN 视为彼此不相等。
:::

```js
Object.is = function (x, y) {
  // 当前情况下，只有一种情况是特殊的，即 +0 -0
  // 如果 x !== 0，则返回true
  // 如果 x === 0，则需要判断+0和-0，则可以直接使用 1/+0 === Infinity 和 1/-0 === -Infinity来进行判断
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  // x !== y 的情况下，只需要判断是否为NaN，如果x!==x，则说明x是NaN，同理y也一样
  // x和y同时为NaN时，返回true
  return x !== x && y !== y;
};
```

## 11. 实现单例模式

::: code-group

```js [构造函数]
let singleDemo;
function SingleDemo() {
  if (!singleDemo) {
    singleDemo = this;
  }
  return singleDemo;
}
SingleDemo.prototype.show = function () {
  console.log("单例模式");
};
const single1 = new SingleDemo();
const single2 = new SingleDemo();
console.log(single1 === single2);
```

```js [静态方法]
class SingleDemo {
  show() {
    console.log("单例模式");
  }
  static getInstance() {
    if (!SingleDemo.instance) {
      SingleDemo.instance = new SingleDemo();
    }
    return SingleDemo.instance();
  }
}
```

```js [闭包]
class SingleDemo {
  show() {
    console.log("单例模式");
  }
}
SingleDemo.getInstance = (function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new SingleDemo();
    }
    return instance;
  };
})();
```

:::

## 12. 实现柯里化函数

:::tip
预先处理的思想，利用闭包的机制

- 柯里化的定义：接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数
- 函数柯里化的主要作用和特点就是参数复用、提前返回和延迟执行
  :::

```js
function curry(func) {
  return function curried(...args1) {
    if (args1.length >= func.length) {
      return func.apply(this.args1);
    } else {
      return function (...args2) {
        return curried.apply(this, args1.concat(args2));
      };
    }
  };
}
```

## 13. 实现数组的 reduce 方法

```js
Array.prototype.myReduce = function (fn, s = 0) {
  let ret = s;
  for (let i = 0; i < this.length; i++) {
    res = fn(res, this[i]);
  }
  return res;
};
```

## 14. 实现发布订阅模式/观察者模式

::: tip
观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个目标对象，当这个目标对象的状态发生变化时，会通知所有观察者对象，使它们能够自动更新;发布订阅模式跟观察者模式很像，但它发布和订阅是不互相依赖的，因为有一个统一调度中心

:::
::: code-group

```js [观察者模式]
// 定义被观察者类
class Subject {
  constructor() {
    this.observers = [];
    this.state = "hello world";
  }
  // 获取状态
  getState() {
    return this.state;
  }
  //增加观察者
  add(observer) {
    this.observers.push(observer);
  }
  //移除观察者
  remove(observer) {
    this.observers.forEach((o, i) => {
      if (o === observer) {
        this.observers.splice(i, 1);
      }
    });
  }
  //更新状态并通知
  setState(newState) {
    this.state = newState;
    this.notify();
  }
  //通知所有观察者
  notify() {
    this.observers.forEach((o) => o.update(this));
  }
}

//定义观察者类
class Observer {
  constructor(name) {
    this.name = this.name;
  }
  //更新
  update(subject) {
    console.log(`${this.name} is Observing ${subject.getState()}`);
  }
}
```

```js [发布订阅模式]
class EventBus {
  constructor() {
    // 缓存列表,用来存放注册的事件与回调
    this.cache = {};
  }
  //订阅事件
  on(name, fn) {
    // 如果当前事件没有订阅过，就给事件创建一个队列
    if (!this.cache[name]) {
      //由于一个事件可能注册多个回调函数，所以使用数组来存储事件队列
      this.cache[name] = [];
    }
    this.cache[name].push(fn);
  }
  //触发事件
  emit(name, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.cache[name]) {
      // 逐个调用队列里的回调函数
      this.cache[name].forEach((cb) => cb(...args));
    }
  }
  //取消订阅
  off(name, fn) {
    const fns = this.cache[name];
    const index = fns.indexOf(fn);
    if (index !== -1) {
      fns.splice(index, 1);
    }
  }
  //只订阅一次
  once(name, fn) {
    // 执行完第一次回调函数后，自动删除当前订阅事件
    const newFn = (...args) => {
      fn(...args);
      this.off(name, newFn);
    };
    this.on(name, newFn);
  }
}
// 测试
let eventBus = new EventBus();
let event1 = function (...args) {
  console.log(`通知1-订阅者小陈老师,小明同学当前心情状态：${args}`);
};
// 订阅事件，只订阅一次
eventBus.once("teacherName1", event1);
// 发布事件
eventBus.emit("teacherName1", "教室", "上课", "打架", "愤怒");
eventBus.emit("teacherName1", "教室", "上课", "打架", "愤怒");
eventBus.emit("teacherName1", "教室", "上课", "打架", "愤怒");
```

:::
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
