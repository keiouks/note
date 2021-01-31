# interface和type的区别

1. 一个interface可以被拓展(extends)也可以被实现(implements)，而type没有这种特性，type也不能做拓展(extends)和实现(implements)。

```typescript
// implements
interface ClockInterface {
    tick();
}
class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}

// extends
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

2. interface是确切创建了一种新类型，而type没有，它只是别名，这一点利用IDE的代码提示功能可以看到。写一个函数，参数的类型如果是一个interface，鼠标悬停到该变量上会提示该interface类型，但如果参数的类型是一个type，鼠标悬停提示的是定义type时的具体内容，而不是这个type的名字。

3. type可以作用于原始类型，interface不行

```typescript
type Name = string;
```

4. type可以作用于联合类型，interface不行

```typescript
type NameOrResolver = string | number;
```

5. type可以作用于交叉类型，interface不行

```typescript
interface Name {
  name: string;
}
type User = Name & {
  age: number;
}
```

6. type可以作用于元组，interface不行

```typescript
type something = [string, number];
```

7. type可以作用与字符串字面量类型或数字字面量类型，interface不行

```typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";
```

8. interface是实现面向对象的一种特性，一个`class`通过`implement`一个interface来规范这个`class`必须实现一些什么。而type跟面向对象没有什么关系。

一般建议能用interface实现的都用interface实现，遇到只能用type实现的时候才用type。
