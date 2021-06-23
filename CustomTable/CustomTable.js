// extension/Components/CustomerTable/CustomerTable.js

const FIXED_LEFT = 'left'
const FIXED_RIGHT = 'right'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
      observer: function(oldVal, newVal) {
        this.showFixList()
        this.checkOdd()
      }
    },
    // 固定第一列或最后一列
    fixedCol: {
      type: String,
      value: ''
    },
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
        this.calc_col_width();
        this.setFixedColIndex();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // columnInfo: [], //每列的宽度
    bodyWidth: 0, // 总宽度
    fixedList: [], //侧边栏数据
    showFixedLeft: false, //显示侧边栏
    fixedListTop: 0, //侧边栏滚动位置
    isOdd: false,
    topGridData: {},
    fixedColIndex: {},
    FIXED_LEFT,
    FIXED_RIGHT
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkOdd() {
      this.setData({
        isOdd: (this.data.data || []).length % 2 === 1
      })
    },

    setFixedColIndex() {
      const { fixedCol, columns } = this.data;
      if (!fixedCol) return;
      const fixedColIndex = fixedCol === FIXED_LEFT ? 0 : columns.length - 1
      this.setData({ fixedColIndex })
    },
    /**
     * 计算单元格与scroll-view宽度
     */
    calc_col_width() {
      let {
        columns
      } = this.data;
      let bodyWidth = 0
      columns.map(item => bodyWidth += item.width)
      this.setData({
        bodyWidth
      });
    },
    /**
     * 根据内容返回单元格宽度
     * @param str 单元格数据
     */
    get_str_length(str) {
      var length = 0;
      for (let i = 0; i < str.length; i++) {
        let c = str.charAt(i);
        if (/^[\u0000-\u00ff]$/.test(c)) {
          length += 0.8;
        } else {
          length += 1;
        }
      }
      return length * 16
    },
    /**
     * 显示侧边栏
     */
    showFixList() {
      const {
        data,
        columns,
        fixedCol
      } = this.data;
      if (!fixedCol) return;
      const fixedList = [];
      // setTimeout(() => {
      const fixedColIndex = fixedCol === FIXED_LEFT ? 0 : columns.length - 1
        this.createSelectorQuery().selectAll(`#table-body > .body > .tr > .${columns[fixedColIndex].key}`).boundingClientRect(rects => {
          rects.map((r, i) => {
            fixedList.push({
              height: r.height,
              width: r.width,
              data: data[i] ? (data[i][columns[fixedColIndex].key] ? data[i][columns[fixedColIndex].key] : '') : '',
              label: columns[fixedColIndex].label,
              key: columns[fixedColIndex].key
            })
          });
          let topGridData = {}
          this.createSelectorQuery().selectAll(`#thead > .${columns[fixedColIndex].key}`).boundingClientRect(rects => {
            topGridData = {
              height: rects[0].height,
              width: rects[0].width,
              label: columns[fixedColIndex].label,
              key: columns[fixedColIndex].key
            }
            this.setData({
              fixedList,
              showFixed: true,
              topGridData
            })
          }).exec();
        }).exec();
      // }, 0);
    },
    /**
     * 设置左边固定栏目的滚动位置
     */
    setFixedListPosition(e) {
      if (!this.data.fixedCol) return;
      this.setData({
        fixedListTop: e.detail.scrollTop
      })
    },
    link(e) {
      const { row, col } = e.currentTarget.dataset
      const { columns, fixedCol } = this.data
      const fixedColIndex = fixedCol === FIXED_LEFT ? 0 : columns.length - 1
      const findCol = columns.find(item => item.key === col)
      console.log({findCol, row, col})
      if (findCol && findCol.canLink || columns[fixedColIndex].canLink) {
        this.triggerEvent('onLink', {
          colField: findCol.canLink ? col : columns[fixedColIndex].key,
          row
        });
      }
    },
    loadMore(e) {
      this.triggerEvent('loadMore')
    }
  }
})