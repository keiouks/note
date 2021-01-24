# css实现垂直居中

## 绝对定位 + 负外边距

```html
<div id="out">
  <div id="in"></div>
</div>
```

```css
#out {
  width: 500px;
  height: 500px;
  background: black;
  position: relative;
}
#in {
  position: absolute;
  top: 50%;
  margin-top: -50px;
  width: 150px;
  height: 100px;
  background: green;
}
```

兼容性不错，但要先知道里面元素的高度。

## 绝对定位 + transform

```html
<div id="out">
  <div id="in">skdjfkskdfjksdkf</div>
</div>
```

```css
#out {
  width: 500px;
  height: 500px;
  background: black;
  position: relative;
}
#in {
  position: absolute;
  top: 50%;
  transfrom: translate(0, -50%);
  background: green;
}
```

不需要预先知道里面元素高度，至于兼容性，现在的浏览器基本都支持

## 绝对定位 + margin: auto

```html
<div id="out">
  <div id="in">skdjfkskdfjksdkf</div>
</div>
```

```css
#out {
  width: 500px;
  height: 500px;
  background: black;
  position: relative;
}
#in {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100px;
  height: 100px;
  background: green;
}
```

里面元素的top和bottom取值相同就行

## 父元素用padding

```html
<div id="out">
  <div id="in">skdjfkskdfjksdkf</div>
</div>
```

```css
#out {
  width: 500px;
  background: black;
  padding: 150px 0;
}
#in {
  width: 100px;
  height: 100px;
  background: green;
}
```

父元素让上下padding相同，不设高度，让子元素填充，子元素当然就是显示成垂直居中了。

## 用flex布局

```html
<div id="out">
  <div id="in">skdjfkskdfjksdkf</div>
</div>
```

```css
#out {
  display: flex;
  align-items: center;
  width: 500px;
  height: 500px;
  background: black;
}
#in {
  width: 100px;
  height: 100px;
  background: green;
}
```

## flex布局另一种实现

```html
<div id="out">
  <div id="in">skdjfkskdfjksdkf</div>
</div>
```

```css
#out {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  height: 500px;
  background: black;
}
#in {
  width: 100px;
  height: 100px;
  background: green;
}
```

## 用line-height让单行文本垂直居中

```html
<div id="out">sdf</div>
```

```css
#out {
  display: block;
  height: 300px;
  line-height: 300px;
  background: black;
}
```

## line-height + vertical-align让图片垂直居中

```html
<div id="out">
  <img id="in" src="xxx.jpg" />
</div>
```

```css
#out {
  width: 500px;
  height: 500px;
  line-height: 500px;
  background: black;
}
#in {
  width: 100px;
  height: 100px;
  background: green;
  vertical-align: middle;
}
```

## display: table; + vertical-align:middle; 垂直居中文字

```html
<div id="out">
  <div id="in">xxxxx</div>
</div>
```

```css
#out {
  display: table;
  width: 500px;
  height: 500px;
  background: black;
}
#in {
  display: table-cell;
  vertical-align: middle;
}
```

## Grid

```html
<div id="out">
  <div id="one"></div>
  <div id="two"></div>
  <div id="three"></div>
</div>
```

```css
#out {
  display: grid;
  width: 500px;
  height: 500px;
  background: black;
}
#one, #three {
  background: black;
}
#two {
  background: red;
}
```