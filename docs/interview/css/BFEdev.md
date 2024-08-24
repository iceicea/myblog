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

## 4.实现两列布局

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
