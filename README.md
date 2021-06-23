# 小程序表格组件

- 基于 createSelectorQuery 实现固定列
- 支持表格内容可链接

```JavaScript
  /**
   * 组件的属性列表
   */
  properties: {
    // 表格数据
    data: {
      type: Array,
      value: [],
      observer: function(oldVal, newVal) {

      }
    },
    // 固定第一列或最后一列
    fixedCol: {
      type: String,
      value: ''
    },
    // 表格可滚动高度
    scrollHeight: {
      type: Number,
      value: 400
    },
    // 表格字段配置
    // {
    //   label: '字段',
    //   value: 'title',
    //   width: 135,
    //   canLink: true
    // },
    columns: {
      type: Array,
      value: [],
      observer: function(oldVal, newVal) {
      }
    }
  }
```