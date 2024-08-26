# BFE.dev 上的一些 CSS 题目

## 1. 垂直居中一个元素

::: tip 4 种方法

1. flex
2. grid + place-items
3. transform
4. margin:auto

使用 top:50%; left:50%;时，是以左上角为原点定位，是左上角的原点居中，但是元素本身并不居中。`transform：translate(-50%,-50%)`:向 X 轴向 Y 轴移动自身长宽的 50%，使其位于中心

父级设置为相对定位,子级绝对定位,并且四个定位属性的值都设置了 0,那么这时候如果子级没有设置宽高，则会被拉开到和父级一样宽高.若子元素设置了宽高，宽高会按照我们的设置来显示，但是实际上子级的虚拟占位已经撑满了整个父级，这时候再给它一个`margin:auto` 它就可以上下左右都居中了

:::
::: code-group

```css [flex]
.outer {
  width: 100%;
  height: 100%;
  background-color: #efefef;
  /* Solution 1 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.inner {
  width: 100px;
  height: 100px;
  background-color: #f44336;
  /* Solution 1 */
}
```

```css [grid]
.outer {
  width: 100%;
  height: 100%;
  background-color: #efefef;
  /* Solution 2 */
  display: grid;
  place-items: center;
}
.inner {
  width: 100px;
  height: 100px;
  background-color: #f44336;
  /* Solution 2 */
}
```

```css [transform]
.outer {
  width: 100%;
  height: 100%;
  background-color: #efefef;
  /* Solution 3 */
  position: relative;
}
.inner {
  width: 100px;
  height: 100px;
  background-color: #f44336;
  /* Solution 3 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

```css [margin]
.outer {
  width: 100%;
  height: 100%;
  background-color: #efefef;
  /* Solution 4 */
  position: relative;
}
.inner {
  width: 100px;
  height: 100px;
  background-color: #f44336;
  /* Solution 4 */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
```

:::

## 2. 截断文字为一行,多余的用省略号代替

```css
.one-line {
  /* 设置文本强制在一行显示 */
  white-space: nowrap;
  /* 容器溢出隐藏 */
  overflow: hidden;
  /* 文本溢出显示省略号 */
  text-overflow: ellipsis;
}
```

::: tip
请注意，`text-overflow: ellipsis` 只在 `white-space` 属性值为`nowrap`时有效。如果 `white-space` 属性设置为 `normal`，文本将会换行，而不是显示省略号。
![示例](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408241738737.png)
:::

## 3. 截断文字为多行

![示例](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408241740135.png)
::: tip
`display: -webkit-box`; 是一个 CSS 属性值，用于在早期的 Webkit 浏览器（如旧版本的 Chrome 和 Safari）中启用 CSS3 的 Flexbox 布局。这个属性是 Flexbox 的前身，它提供了一种方式来创建灵活的布局，允许容器内的项目在空间不足时伸缩或换行。
:::

```css
.max-three-lines {
  /* 适用范围：Webkit浏览器及移动端*/
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  /* 指定子元素按垂直方向排列 */
  -webkit-box-orient: vertical;
}
```

## 4. 实现两列布局

::: tip

1. flex `min-width` 和 `max-width` 会限制 flex 项的最终尺寸
2. grid

:::
::: code-group

```css [flex]
.container {
  height: 300px;
  /* your code here */
  display: flex;
}

.left {
  background-color: #f44336;
  /* your code here */
  min-width: 100px;
  flex: 1;
}

.right {
  background-color: #2973af;
  /* your code here */
  flex: 3;
}
```

```css [grid]
.container {
  height: 300px;
  /* your code here */
  display: grid;
  grid-template-columns: minmax(100px, 25%) auto;
}

.left {
  background-color: #f44336;
  /* your code here */
}

.right {
  background-color: #2973af;
  /* your code here */
}
```

:::

## 5. 具有最大高度的 modal

[题目地址](https://bigfrontend.dev/css/modal-with-max-height)
![alt](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408251414697.png)
::: tip

1. 使用 cal 计算高度
2. 使用 grid/flex

:::

::: code-group

```css [cal计算高度]
.modals {
}

.modal {
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modal-header {
  background-color: #f44336;
  height: 50px;
}

.modal-body {
  background-color: #2973af;
  height: calc(100vh - 110px);
  max-height: 250px;
}
```

```css [grid]
.modals {
  display: grid;
  place-items: center;
  padding: 30px;
  width: 100%;
  height: 100%;
}

.modal {
  width: 300px;
  max-height: 300px;
  height: 100%;
  display: grid;
  grid-template-rows: 50px auto;
}

.modal-header {
  background-color: #f44336;
}

.modal-body {
  background-color: #2973af;
}
```

:::

## 6. 修改默认的 Checkbox 样式

![alt](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408251430087.png)
::: code-group

```css [使用appearance属性]
.my-checkbox {
  display: flex;
}
input[type="checkbox"] {
  /* Disable default item */
  appearance: none;
  align-self: center;
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background-color: gray;
}
input[type="checkbox"]:checked {
  background-color: green;
}
```

```css [使用伪元素]
.my-checkbox {
  position: relative;
}
.my-checkbox input {
  position: absolute;
  left: -99999px;
}
.my-checkbox span::before {
  background-color: gray;
  content: "";
  display: inline-block;
  border-radius: 50%;
  height: 10px;
  width: 10px;
}
.my-checkbox input:checked + span::before {
  background-color: green;
}
```

:::

## 7. a row(间隔行样式)

::: tip
要求:

1. 高 50px
2. 背景颜色为#eee,如果有相邻行,偶数行颜色为#ddd
3. top & bottom border 1px #ccc 如果有相邻行,边框要融合成一个

:::
![alt](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408251440407.png)
::: code-group

```css [:nth-child()]
.row {
  background: #eee;
  border-bottom: 1px solid #ccc;
  height: 50px;
  width: 100%;
}
.row:nth-child(even) {
  background: #ddd;
}
.row:first-child {
  border-top: 1px solid #ccc;
}
```

```css [.row + .row]
.row {
  width: 100%;
  height: 50px;
  background: #eee;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.row:nth-child(even) {
  background: #ddd;
}
.row + .row {
  border-top: 0px;
}
```

:::

## 8. Twitter's website layout

![alt](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408251451405.png)
:::tip 要求

- 当视口宽度不够时，将左栏设置为 40px 宽，将中间栏设置为拉伸。
- 中间列的最大宽度为 240px
- 当有足够的空间时，显示宽度为 120px 的右栏
- 如果还有更多空间，请将左栏设置为 80px
- 当右列可见时，设置与视口边框水平最小 10px 的空间
  :::

```css
.container {
  height: 150px;
  text-align: center;
  line-height: 150px;
  justify-content: center;
  display: flex;
}
.left {
  background-color: #eee;
  min-width: 40px;
}
.middle {
  background-color: #ddd;
  max-width: 240px;
  flex: 1;
}
.right {
  background-color: #eee;
  display: none;
}
@media screen and (min-width: 420px) {
  .right {
    display: block;
    width: 120px;
  }
}
@media screen and (min-width: 460px) {
  .left {
    width: 80px;
  }
}
```

## 9. 多列文本

![alt](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408251453892.png)
:::tip 要求

- 分为 3 列
- 使用 #ddd 的 1px line 作为分隔符
- 在每列周围、容器边框和分隔符上添加 10px 空间
  :::

```css
.three-column-text {
  columns: 3 auto;
  column-rule: solid 1px #ddd;
  column-gap: 20px;
  padding: 10px;
}
```

## 10. 黄金比例矩形

![alt](https://raw.githubusercontent.com/iceicea/MyPic/master/blog/202408251455597.png)
::: code-group

```css [aspect-ratio属性]
.golden-ratio {
  background-color: #ccc;
  aspect-ratio: 1.618;
}
```

```css [伪元素]
.golden-ratio {
  background-color: #ccc;
}
.golden-ratio::before {
  content: "";
  display: block;
  padding-bottom: 61.8%;
}
```

:::
