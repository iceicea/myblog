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

:::tip

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
