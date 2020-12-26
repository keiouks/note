# 测试或使用还没发布的npm包

## 1.项目在本地

本地开发好了项目，所在目录名为`test`，想在另一个项目`B`中安装使用，只要在`B`中使用以下命令就能安装

```bash
npm link ../test
```

通过这种方式安装，实时修改`test`后，不需要重新安装，因为安装到`B`上的实际上是一个链接文件，是`test`的快捷方式。

安装本地的`test`还有一种方法

```bash
npm i -D ../test
```

同样也能实时修改不需要重新安装

## 2.项目在线上库某个分支

项目开发后发到了线上某个分支(可以是master分支)，通过以下命令安装

```bash
npm i -D git+https://github.com/keiouks/note.git#test
```