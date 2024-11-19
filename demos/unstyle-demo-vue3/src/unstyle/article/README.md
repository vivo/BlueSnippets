# 页面 Article

页面容器

## list 页面基本骨架

:::demo list 页面基本骨架
```html
<template>
    <us-article biz="list">
        <us-module biz="header">
            <us-section biz="title">
                <div>页面标题</div>
            </us-section>
            <us-section biz="query">
                <div>Form 查询区域</div>
            </us-section>
        </us-module>
        <us-module biz="body">
            <us-section biz="header">
                <span biz="title">汇总项</span>
            </us-section>
            <us-section biz="body">
                <div>Table</div>
            </us-section>
            <us-section biz="footer">
                <div>底部区域</div>
            </us-section>
        </us-module>
        <us-module biz="footer">
            Footer
        </us-module>
    </us-article>
</template>

<script>
    export default {}
</script>
```
:::

## list 页面分模块展示

:::demo list 页面分模块展示
```html
<template>
    <us-article biz="list">
        <us-module biz="header">
            <us-section biz="title">
                <div>页面标题</div>
            </us-section>
            <us-section biz="query">
                <div>Form 查询区域</div>
            </us-section>
        </us-module>
        <us-module biz="chunk">
            <us-section biz="header">
                <span biz="title">模块一</span>
            </us-section>
            <us-section biz="body">
                <div>Table1</div>
            </us-section>
            <us-section biz="footer">
                <div>底部区域1</div>
            </us-section>
        </us-module>
        <us-module biz="chunk">
            <us-section biz="header">
                <span biz="title">模块二</span>
            </us-section>
            <us-section biz="body">
                <div>Table2</div>
            </us-section>
            <us-section biz="footer">
                <div>底部区域2</div>
            </us-section>
        </us-module>
        <us-module biz="footer">
            Footer
        </us-module>
    </us-article>
</template>

<script>
    export default {}
</script>
```
:::

## form 页面基本骨架

:::demo 页面基本骨架
```html
<template>
    <us-article biz="form">
        <us-module biz="header">
            <us-section>Header区域</us-section>
        </us-module>
        <us-module biz="body">
            <us-section>Body区域</us-section>
        </us-module>
        <us-module biz="footer">
            Footer
        </us-module>
    </us-article>
</template>

<script>
    export default {}
</script>
```
:::

## form 页面分模块展示

:::demo form 页面分模块展示
```html
<template>
    <us-article biz="form">
        <us-module biz="chunk">
            <us-section biz="header">
                <span biz="title">模块一</span>
            </us-section>
            <us-section>
                模块一的内容
            </us-section>
        </us-module>

        <us-module biz="chunk">
            <us-container biz="header">
                <us-section biz="header">
                    <span biz="title">模块二</span>
                </us-section>
                <us-section>
                    <span>处理人：张三</span>
                    <span>处理时间：2023.03.22 10:20:30</span>
                </us-section>
            </us-container>
            <us-section>
                模块二的内容
            </us-section>
        </us-module>
    </us-article>
</template>

<script>
    export default {}
</script>
```
:::

## form 页面二级模块展示

:::demo form 页面二级模块展示
```html
<template>
    <us-article biz="form">
        <us-module biz="chunk">
            <us-container>
                <us-section biz="header">
                    <span biz="title">模块三</span>
                </us-section>
                <us-section>
                    <span>处理人：张三</span>
                    <span>处理时间：2023.03.22 10:20:30</span>
                </us-section>
            </us-container>
            <us-container biz="body" gap="20px">
                <us-module biz="chunk">
                    <us-section biz="header">
                        <span biz="title">子模块一</span>
                    </us-section>
                    <us-section>
                        子模块一的内容
                    </us-section>
                </us-module>
                <us-module biz="chunk">
                    <us-container biz="header">
                        <us-section biz="header">
                            <span biz="title">子模块二</span>
                        </us-section>
                        <us-section>
                            <span>处理人：张三</span>
                            <span>处理时间：2023.03.22 10:20:30</span>
                        </us-section>
                    </us-container>
                    <us-section>
                        子模块二的内容
                    </us-section>
                </us-module>
            </us-container>
        </us-module>
        <us-module biz="chunk">
            <us-section biz="header">
                <span biz="title">模块四</span>
            </us-section>
            <us-container biz="body">
                <us-module biz="chunk">
                    <us-section>模块四的内容1</us-section>
                </us-module>
                <us-module biz="chunk">
                    <us-section>模块四的内容2</us-section>
                </us-module>
            </us-container>
        </us-module>
        <us-module biz="chunk">
            <us-section biz="header">
                <span biz="title">模块五</span>
            </us-section>
            <us-container biz="body" gap="20px">
                <us-section biz="chunk">模块五的内容1</us-section>
                <us-section biz="chunk">模块五的内容2</us-section>
                <us-section biz="chunk">模块五的内容3</us-section>
                <us-section biz="chunk">模块五的内容4</us-section>
            </us-container>
        </us-module>
    </us-article>
</template>

<script>
    export default {}
</script>
```
:::

## Article 属性
| 参数     | 说明         | 类型 | 可选值         | 默认值 |
|--------|------------|--|-------------|-----|
| biz    | 业务类型       | string | list / form / common | -   |
| gap    | 容器内各元素间隙   | string | 如：`10px` 或 `5%`    | 0   |
| pad    | 当前元素内边距    | string     | 如：`10px` 或 `12px 5%`                    | 0 |
| bgc | 是否显示背景色 | boolean |  true / false    | true   |
| align | 容器内各元素水平位置，默认居中 | string |  left / center/ right    | -   |

## Module 属性
| 参数       | 说明                               | 类型       | 可选值                                      | 默认值         |
|----------|----------------------------------|----------|------------------------------------------|-------------|
| biz      | 业务类型                             | string   | header / body / chunk / footer / common  | -           |
| gap      | 容器内各元素间隙                         | string   | 如：`10px` 或 `5%`                          | 0           |
| pad      | 当前元素内边距                          | string   | 如：`10px` 或 `12px 5%`                     | `12px 16px` |
| width    | 容器宽度                             | string   | 如：`100px`、`20%` 等                        | 100%        |
| fill     | 与 `biz=body` 搭配使用，表示容器布满屏幕剩余高度   | boolean  | true                                     | -           |
| bgc      | 与 `biz=body/chunk` 搭配使用，表示容器显示背景 | boolean  | true                                     | -           |

## Section 属性
| 参数     | 说明       | 类型         | 可选值                                      | 默认值        |
|--------|----------|------------|------------------------------------------|------------|
| biz    | 业务类型     | string     | header / body / chunk / footer / common  | -          |
| gap    | 容器内各元素间隙 | string     | 如：`10px` 或 `5%`                          | 0          |
| pad    | 当前元素内边距  | string     | 如：`10px` 或 `12px 5%`                     | `8px 12px` |
| width  | 容器宽度     | string     | 如：`100px`、`20%` 等                        | 100%       |
