## 问题起源

最近的一个需求背景是:将`@tencent/qmfe-mobile-cocos-lib `这个包的导出路径全部修改为主包名导出,目前在项目里引入此包的一个命名空间是通过子路径:

`import { qqm } from '@tencent/qmfe-mobile-cocos-lib/types/qqmusic'`;

为了方便描述,下文将无关代码删除,保留配置文件

源代码目录结构:
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191457475.png)

最初 `qqmusic.ts` 的导出是这样的

```ts
export declare namespace qqm {
  type A = "1" | "2" | "3";
  enum B {
    T1,
    T2,
    T3,
  }
  interface C {
    x: number;
    y: string;
  }
}
```

那么直接在 `index.ts`中导入再导出不就可以了?

```ts
import { qqm } from "./qqmusic";
export { qqm };
```

运行`npm run build`,报错了 🤣![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191502680.png)

一开始没明白这个报错的原因,于是换了一种方式:

```ts
declare namespace qqm {
  type A = "1" | "2" | "3";
  enum B {
    T1,
    T2,
    T3,
  }
  interface C {
    x: number;
    y: string;
  }
}
export default qqm;
```

再次运行`npm run build`,这次打包成功了,![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191532144.png)  
利用 yalc 本地发包后在项目中引入,通过主包路径也能正确访问到 qqm 这个命名空间
但是后面运行起来项目的时候发现了问题,![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191535327.png)  
经过排查后发现在打包后生成的`index.js`文件中出现了这么一行代码
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191537440.png)  
将这一行注释掉后重新运行项目,成功 😁  
看起来问题已经解决了,但是不太优雅,每一次打包后需要手动注释掉这一行

## 是否是打包工具的问题

最初查了一圈资料也没找到具体是什么原因,于是自己开了一个空项目,把这个包的配置文件复制过来,因为使用`npm run build`打包这里是用的封装过的 rollup,是不是其中有问题呢?
当前的`package.json`其中相关的脚本为:

```JSON
"scripts": {
    "clean": "rimraf dist && rimraf types",
    "gen-dts": "npm run clean && tsc",
    "build": "qmfe-build-tools-lib-rollup run build -t && npm run gen-dts"
  },
```

打包工具的配置文件`.qmfe-build-tools.config.js`,与 rollup 的配置文件结构类似:

```js
const path = require("path");
const typescript = require("rollup-plugin-typescript2");

module.exports = {
  rollupConfig: {
    inputOptions: {
      input: "./src/index.ts",
    },
    buildOutputOptions: {
      file: "./lib/index.js",
      format: "cjs",
    },
    releaseOutputOptions: {
      file: "./lib/index.js",
      format: "cjs",
    },
    plugins: [
      typescript({
        tsconfig: path.resolve(__dirname, "./tsconfig.json"), // 导入本地ts配置
      }),
    ],
  },
};
```

`tsconfig.json`中配置为

```JSON
{
  "compilerOptions": {
    "lib": ["es2015", "es2017", "dom"],
    "target": "ES2017",
    "outDir": "./dist/es",
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": false,
    "importHelpers": true,
    "types": ["minigame-api-typings"],
    "declaration": true,
    "baseUrl": "./",
    "declarationDir": "./types",
    "moduleResolution": "node"
  },
  "exclude": ["node_modules", "library", "local", "temp", "build", "dist", "types", "settings"],
  "include": ["./**/*.ts", ".eslintrc.js", "*.js"]
}

```

只关注, `outDir` 和 `declarationDir` ,即 tsc 编译后的 js 文件在 `./dist/es` 目录, `.d.ts` 文件在`./types`目录,可以看到 build 脚本的第二部分作用是删除掉 `dist` 和 `types` 目录然后使用 tsc 编译,这一部分也可以忽略掉,因此直接配置 rollup 来打包试一下:  
`rollup.config.js`:

```js
import path from "path";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts", // 你的入口文件
  output: {
    file: "./rollup/bundle.js", // 输出文件
    format: "cjs", // CommonJS 模块格式
  },
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"), // 导入本地ts配置
    }),
  ],
};
```

运行`npx rollup -c`,得到的`bundle.js`为:![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191556126.png)  
可以看到依然有那句`exports.qqm = qqm`,说明`qmfe-build-tools-lib-rollup`不背锅 🤣  
分别看一下编译后尚未打包的 js 文件:  
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191606279.png)
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191606338.png)  
不难看出原因在于`qqmusic.ts`经过编译后得到的 js 文件中导出了一个不存在的东西,最终导致了打包后的错误,
手动修改`qqmusic.js`

```js
const qqm = 1;
export default qqm;
```

然后打包`npx rollup ./dist/es/index.js --file bundle.js`
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191609057.png)  
这样就是没错的,看来问题的确出在这里的导出

## 解决方案

经过自己尝试和查找资料,最后有三种方式可以解决之前的需求

### 1.直接在 index.ts 中声明命名空间

直接删除`qqmusic.ts`文件,将其中的声明直接复制到`index.ts`中来,这样就避免了导入导出,也就避免了在打包的 js 文件中引入不存在的东西了

### 2.改写 namespace

看了一下 ts 的手册,尝试将`qqmusic.ts`文件改为

```ts
namespace qqm {
  type A = "1" | "2" | "3";
  enum B {
    T1,
    T2,
    T3,
  }
  interface C {
    x: number;
    y: string;
  }
}
export default qqm;
```

tsc 编译后![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191625897.png),这里类型声明文件里 namespace 怎么空了?😢 再查资料发现需要将内部每个类型分别导出:

```ts
namespace qqm {
  export type A = "1" | "2" | "3";
  export enum B {
    T1,
    T2,
    T3,
  }
  export interface C {
    x: number;
    y: string;
  }
}
export default qqm;
```

这次对了  
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191627770.png)

### 3.使用 import type

改写`index.ts`:

```ts
import type qqm from "./qqmusic";
export { type qqm };
```

`npm run build`后可以看到

编译后的`index.js`  
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191631662.png)

打包后的结果:  
![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408191632641.png)

## 展开

### import type 的使用

先来看看`import type`的用法,文档链接------
[Typescript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)

TS 在 3.8 版本引入了`import type`和`export type`语法,用来仅导入/导出类型,
以下是一个例子:

```ts
import type { Component } from "react";
interface ButtonProps {
  // ...
}
class Button extends Component<ButtonProps> {
  //               ~~~~~~~~~
  // error! 'Component' only refers to a type, but is being used as a value here.
  // ...
}
```

作为**仅类型导入**的 Component 无法作为**值**来使用

此外不能混合使用默认导入和具名导入:

```ts
import type Foo, { Bar, Baz } from "some-module";
//     ~~~~~~~~~~~~~~~~~~~~~~
// error! A type-only import can specify a default import or named bindings, but not both.
```

再来看一下与`type`修饰符相关的几个`tsconfig`的编译选项

#### 1. isolateModules

官网对于 Type-Only 的解释是这样一句话:

> This feature is something most users may never have to think about; however, if you’ve hit issues under **isolatedModules**, TypeScript’s transpileModule API, or Babel, this feature might be relevant

看一下这个 isolatedModules 是怎么回事-----[官方解释](https://www.typescriptlang.org/tsconfig/#isolatedModules)

像 babel,swc 这些非 tsc 编译器,属于单文件编译,无法理解完整的类型系统来进行代码转换
举个例子

```ts
import { someType, someFunction } from "someModule";
const x: someType = "xxx";
someFunction();

export { someType, someFunction };
```

对于上述 ts 文件,经过编译后应该是:

```js
import { someFunction } from "someModule";
const x = "xxx";
someFunction();

export { someFunction };
```

这里推断出了 someType 是一个类型  
如果是这样

```ts
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

对于 babel 这些单文件编译来说,无法判断此处的 someType 究竟是一个类型还是一个值,就会原样保留下来:

```js
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

可以在`tsconfig.json`里看到对这个值的注释:

> `"isolatedModules": true /* Ensure that each file can be safely transpiled without relying on other imports. */  `确保每个文件都可以安全地转译，而不依赖于其他导入

也就是说它强制让每个文件都能作为单个模块被独立编译,显示地告诉编译器,我们导入/导出的是一个类型,这个时候就可以选择`babel,swc,esbuild`等单文件的编译器

对于单个模块/文件,如果导入导出能够确定,那么称为**模块隔离的**(Isolated Modules),上述这种情况就属于破坏了模块隔离性,官网一共给出了三种情况:

1. Exports of Non-Value Identifiers: 即上述情况,也包括 `export {someType} form 'someModule'`这种重导出的形式
2. Non-Module Files: 如果开启了`isolateModules=true`,则命名空间只能用在模块当中,即需要某种形式的`import/export`, 否则会报错:
   ![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408192102156.png)

3. References to const enum members: 引用了`const enum`值:
   ![](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408192120786.png)

在开启这个值后,我们至少需要一处(import 或 export)来告诉编译器这个内容是一个类型:

```ts
type Test = {
  a: number;
  b: string;
};

export { Test }; //报错:提供 "--isolatedModules" 标志时，需要使用 "export type" 才能重新导出类型
```

```ts
type Test = {
  a: number;
  b: string;
};

export { type Test }; //👌
```

引入它的地方可以改成:

```ts
import { type Test } from "./types";
export { Test };
```

或

```ts
import { Test } from "./types";
export { type Test };
```

#### 2. importsNotUsedAsValues

用来控制导入之后却未作为值使用的情况,包括三个取值:

- remove: 默认值,未使用将被直接丢弃
- preserve 未使用将保留,可能会引起副作用 imports/side-effects
- error 与 preserve 一样,但是当引入的值仅作为类型来使用时会报错

[`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig/#importsNotUsedAsValues)

```ts
import { Car } from "./car";
export function drive(car: Car) {
  // ...
}
```

在默认情况下,以上代码会被编译成:

```ts
export function drive(car) {
  // ...
}
```

大多数情况下是没有问题的,但是它没有考虑到模块的副作用如`import "./car"`,此外,导入的省略并不总是仅由导入的使用方式来决定,通常也会参考声明方式,对于以下代码:

```ts
export { Car } from "./car";
```

不知道是否应该保留或丢弃,如果`Car`是一个`class`,那么将保留,如果是`type`或`interface`,则丢弃,尽管 tsc 可能通过跨文件的信息来作出决策,但不意味着其他的编译器也可以,

这时就可以通过`importsNotUsedAsValues`来确保使用

#### 3. preserveValueImports

在某些情况下,TS 无法检测到使用了导入值,如:

```ts
import { Animal } from "./animal.js";
eval("console.log(new Animal().isDangerous())");
```

以及针对 Vue 或 Svelte 这种`"Compiles to HTML"`的语言的场景  
默认情况下编译后会删掉这个 import,这时候就会导致报错,开启这个选项就是**保留未使用的导入**,这个选项与`isolatedModules`结合使用,因为单文件编译器无法知道导入的是一个**未使用的值**还是必须删除以避免运行时崩溃的**类型**

#### 小结---verbatimModuleSyntax

`type`修饰符本身用处不大,需要结合上述 3 个 flag 来工作,`importsNotUsedAsValues`来确保使用`type`修饰符， `preserveValueImports` 来防止某些模块省略行为，`isolatedModules` 来确保 TypeScript 代码可以跨不同的编译器工作,但是理解这 3 个标志的细节很困难，并且仍然存在一些具有意外行为的边缘情况,因此在 5.0 版本开始`importsNotUsedAsValues`和`preserveValueImports`被标记为`Deprecated`,并在 5.5 之后不再支持,用[`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax)来替代  
在`tsconfig`里查找:

> `// "verbatimModuleSyntax": true /_ Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. _/`, 不要转换或删除任何未标记为仅类型的导入或导出，确保它们以基于“module”设置的输出文件格式写入

这个规则就简单多了:

- 任何没有 type 修饰符的导入或导出都会被保留。
- 任何使用 type 修饰符的内容都会被完全删除

官网的例子:

```ts
// Erased away entirely.
import type { A } from "a";
// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from "bcd";
// Rewritten to 'import {} from "xyz";'
import { type xyz } from "xyz";
```

不过开启这个选项后,采用 import/export 写法的 ts 代码编译输出的 js 文件不能是 cjs 了,指定`"module": "CommonJS"`后它不会被转译成`require`和`module.export`的形式,而是会直接报错,需要 cjs 的输出的话只能采用 ES2015 之前的 TypeScript 模块语法了.

开启`verbatimModuleSyntax`后,`isolatedModules`默认将为`true`,否则为`false`.
