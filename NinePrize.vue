<template>
  <div class="nine-prize" :style="getPrizeStyle">
    <!-- 盒子 -->
    <div class="nine-prize-box">
      <div
        class="nine-prize-box__item"
        v-for="(item,index) in ds"
        :key="index"
        :style="getPosition(index,item.isSelect)"
      >
        <div :style="childCommonStyle" class="item-child">
          <!-- img -->
          <div class="item-child-img">
            <img :src="item.img" />
          </div>
          <!-- text -->
          <div class="item-child-text">
            <span>{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 开始按钮 -->
    <div class="nine-prize-pointer" :style="whichPointerWH">
      <div class="nine-prize-pointer__btn" :style="{backgroundColor:pointerBackground}">
        <div :style="{color:pointerTextColor}" v-debounce="onRun" v-show="!isStart">
          <span>{{pointerText}}</span>
        </div>
        <van-loading :color="prizeBackground" v-show="isStart" size="36px" />
      </div>
    </div>
  </div>
</template>

<script>
// utils
import { px2vw } from 'Utils/common/'

// instance
export default {
  name: 'ninePrize',
  components: {},
  props: {
    // 奖盘宽度
    prizeWidth: {
      type: Number,
      default: 330
    },
    // 奖盘高度
    prizeHeight: {
      type: Number,
      default: 330
    },
    // 奖品集合
    ds: {
      type: Array,
      default: () => []
    },
    // 固定转几圈
    defaultCircle: {
      type: Number,
      default: 5
    },
    // 奖盘背景
    prizeBackground: {
      type: String,
      default: '#E5E5E5'
    },
    // 中心按钮背景
    pointerBackground: {
      type: String,
      default: '#EE2C2C'
    },
    // 奖品项背景
    prizeItemBackground: {
      type: String,
      default: '#fff'
    },
    // 中心按钮描述
    pointerText: {
      type: String,
      default: '开始抽奖'
    },
    // 中心按钮颜色
    pointerTextColor: {
      type: String,
      default: '#fff'
    },
    // 转动框颜色
    turnBackground: {
      type: String,
      default: '#333'
    }
  },
  data() {
    return {
      isStart: false, // 是否开启转动
      curRafID: null, // 当前rafid
      BIAN: 4, // 正方形有4条边
      DINGDIAN: 4, // 正方形有4个顶点
      tWidth: 0, // 每项宽度
      tHeight: 0, // 每项高度
      firstTurn: 0, // 第一次转弯处
      secondNeedNumber: 0, // 第二条边需再画几个
      abHeight: 0, // 渲染出的正方形固定高度
      abWidth: 0, // 渲染出的正方形固定宽度
      commonStyle: '', // 奖品项的公共样式
      curSelect: 0, // 转圈过程中当前奖品项
      spaceTimer: 0, // 初始间隔200ms
      lastSuccessTimer: Date.now(), // 上一次执行移动时间 ms
      countCircle: 0, // 圈数记录
      isFinalCircle: false, // 是否已执行完固定圈数
      bingoIndex: 0, // 中奖位置
      onOff: true,
      eachTimer: 17, // 到达指定圈数后最后转动连续基础加值
      finalStartTimer: 150 // 到达指定圈数后最后转动连续基础值
    }
  },
  computed: {
    // 9宫格样式
    getPrizeStyle() {
      return {
        width: px2vw(this.prizeWidth),
        height: px2vw(this.prizeHeight),
        backgroundColor: this.prizeBackground
      }
    },
    // 4 9分别起始间隔时间
    whichStartSpaceTimer() {
      return this.ds.length > 4 ? 34 : 150
    },
    // 指针宽高
    whichPointerWH() {
      return this.ds.length === 8
        ? {
            width: px2vw(this.tWidth - 4),
            height: px2vw(this.tHeight - 4)
          }
        : {
            width: px2vw(80),
            height: px2vw(80)
          }
    }
  },
  created() {
    // 初始化
    this.initAnimation()

    // 获取几次幂方阵
    this.firstTurn = (this.ds.length + this.DINGDIAN) / this.BIAN

    // 获取画第二条边 最多可画几个
    this.secondNeedNumber = this.firstTurn - 1

    // 计算出

    // 计算出每项宽高
    this.tWidth = this.prizeWidth / this.firstTurn
    this.tHeight = this.prizeHeight / this.firstTurn

    // 可得出边固定高或者宽
    this.abHeight = (this.firstTurn - 1) * this.tWidth
    this.abWidth = (this.firstTurn - 1) * this.tWidth

    // 公共宽高
    this.commonStyle = `width:${px2vw(this.tWidth)};height:${px2vw(
      this.tHeight
    )};background-color:${this.prizeBackground}`

    // 子元素公共宽高
    this.childCommonStyle = {
      width: px2vw(this.tWidth - 4),
      height: px2vw(this.tHeight - 4),
      backgroundColor: this.prizeItemBackground
    }

    // 赋值初始间隔
    this.spaceTimer = this.whichStartSpaceTimer
  },
  destroyed() {
    this.curRafID && window.cancelAnimation(this.curRafID)
  },
  methods: {
    // 获取位置
    getPosition(index, isSelect) {
      // 选中样式
      let selectStyle = ``
      if (isSelect) {
        const selectWidth = this.tWidth - 4
        const selectHeight = this.tHeight - 4
        selectStyle = `width:${px2vw(selectWidth)};height:${px2vw(
          selectHeight
        )};border:${px2vw(2)} solid ${this.turnBackground}`
      }

      // 第一条边 index 0 1 2
      if (index < this.firstTurn) {
        let i = index - 0 * (this.firstTurn - 1)
        return `top:0;left:${px2vw(i * this.tWidth)};${
          this.commonStyle
        };${selectStyle}`
      }
      // 第二条边 index值从 3 4
      if (index - this.firstTurn < this.secondNeedNumber) {
        let i = index - 1 * (this.firstTurn - 1)
        return `top:${px2vw(i * this.tWidth)};left:${px2vw(this.abWidth)};${
          this.commonStyle
        };${selectStyle}`
      }
      // 第三条边 5 6
      if (index <= 3 * (this.firstTurn - 1)) {
        let i = index - 2 * (this.firstTurn - 1)
        return `top:${px2vw(this.abHeight)};left:${px2vw(
          this.abWidth - i * this.tWidth
        )};${this.commonStyle};${selectStyle}`
      }
      // 第四条边 7
      if (index < this.ds.length) {
        let i = index - 3 * (this.firstTurn - 1)
        return `top:${px2vw(this.abHeight - i * this.tWidth)};left:0;${
          this.commonStyle
        };${selectStyle}`
      }
    },
    initAnimation() {
      // 兼容性raf初始化
      window.requestAniFrame = (function() {
        return window.requestAnimationFrame

        // Older versions Chrome/Webkit
        window.webkitRequestAnimationFrame ||
          // Firefox < 23
          window.mozRequestAnimationFrame ||
          // opera
          window.oRequestAnimationFrame ||
          // ie
          window.msRequestAnimationFrame ||
          function(callback) {
            return window.setTimeout(callback, 1000 / 60)
          }
      })()

      // 兼容性取消初始化
      window.cancelAnimation = (function() {
        return (
          window.cancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.cancelRequestAnimationFrame ||
          function(id) {
            clearTimeout(id)
          }
        )
      })()
    },
    // run
    onRun() {
      this.isStart = true
      this.bingoIndex = ~~(Math.random() * this.ds.length)
      this.onRunFunc()
    },
    // runfunc
    onRunFunc() {
      let rafId = window.requestAniFrame(this.onRunFunc)
      this.curRafID = rafId
      let nowTimer = Date.now()
      if (nowTimer - this.lastSuccessTimer >= this.spaceTimer) {
        this.onRender(() => {
          window.cancelAnimation(rafId)
          // 恢复时间间隔
          this.spaceTimer = this.whichStartSpaceTimer
          this.isFinalCircle = false
          this.onOff = true
          this.isStart = false
        })
      }
    },
    onRender(cb) {
      if (this.isFinalCircle) {
        // 固定圈数转完后 在1位置
        if (this.curSelect === this.bingoIndex && this.onOff) {
          cb()
          return
        }
        this.spaceTimer += this.eachTimer
        this.curSelect++
        if (this.curSelect < this.ds.length) {
          this.ds[this.curSelect]['isSelect'] = true
          this.ds[this.curSelect - 1]['isSelect'] = false
        } else if (this.curSelect === this.ds.length) {
          this.ds[this.curSelect - 1]['isSelect'] = false
          this.ds[0]['isSelect'] = true
        } else {
          // 转完一圈
          this.curSelect = 0
          this.onOff = true
        }
        this.$nextTick(() => {
          this.lastSuccessTimer = Date.now()
        })
      } else {
        this.curSelect++
        if (this.curSelect < this.ds.length) {
          this.ds[this.curSelect]['isSelect'] = true
          this.ds[this.curSelect - 1]['isSelect'] = false
        } else if (this.curSelect === this.ds.length) {
          this.ds[this.curSelect - 1]['isSelect'] = false
          this.ds[0]['isSelect'] = true
        } else {
          // 转完一圈
          this.curSelect = 1
          this.ds[0]['isSelect'] = false
          this.ds[1]['isSelect'] = true
          this.countCircle++
          if (this.countCircle === this.defaultCircle) {
            this.countCircle = 0
            this.spaceTimer = this.finalStartTimer
            this.isFinalCircle = true
            if (this.bingoIndex === 1) {
              this.onOff = false
            }
          }
        }
        this.$nextTick(() => {
          this.lastSuccessTimer = Date.now()
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.nine-prize {
  position: relative;
  padding: 2px;
  margin: 0 auto;
  // item
  &-box {
    position: absolute;
    // item
    &__item {
      @include fcc;
      position: absolute;
      // child
      .item-child {
        @include fcc(column);
        // img
        &-img {
          width: 50px;
          height: 50px;
          & > img {
            width: 100%;
            height: 100%;
          }
        }
        // text
        &-text {
          z-index: 1;
          margin-top: 5px;
          font-size: 12px;
        }
      }
    }
  }
  &-pointer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    // 内部按钮
    &__btn {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      & > div {
        @include fcc;
        width: 100%;
        height: 100%;
        text-shadow: 1px 1px 2px black, -1px -1px 2px white;
      }
    }
  }
}

</style>
