# position

## static

默认值，正常布局

## relative

相对定位，原来的位置空间会继续占有，显示上相对原来位置的移动

## absolute

绝对定位，移出正常文档流，不预留空间，坐标相对于`最近非static祖先`位置，可以设置margin，不会与其他边距合并

## fixed

固定定位，移出正常文档流，不占位置，坐标相对`视口(viewport)`位置。当元素祖先的 transform, perspective 或 filter 属性非 none 时，容器由视口改为该祖先。

## sticky

有正常文档流，相对它的最近滚动祖先(该祖先的overflow 是 hidden, scroll, auto, 或 overlay时)。坐标是一个阈值，比如：

```css
.some { position: sticky; top: 10px;}
```

当元素上方离它最近滚动祖先的上方边界大于10px，元素就正常显示，元素滚动到上方离最近滚动祖先的距离小于10px,也就是9px的时候，元素就固定住，不再滚动，不影响其它元素滚动
