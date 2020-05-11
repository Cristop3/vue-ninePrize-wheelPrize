<template>
  <!-- 抽奖盘主体 -->
  <div class="wheel-prize" :style="getWheelStyle">
    <!-- 跑马灯 -->
    <div class="wheel-prize-lamp" v-if="isShowLamp">
      <!-- 小灯泡 -->
      <span
        class="wheel-prize-lamp__item"
        v-for="index in lampQuantity"
        :key="index"
        :style="{transform:`rotate(${CIRCLEDEGREE/lampQuantity*(index)}deg)`}"
      ></span>
    </div>
    <!-- 转动盘 -->
    <div class="wheel-prize-turntable" ref="myWheelPrize" :style="getInnerStyle">
      <!-- 线型转动盘背景 -->
      <div class="wheel-prize-turntable__background">
        <!-- 利用旋转来画背景盘-->
        <template v-if="wheelBackgroundType==='line'">
          <div
            class="background-line-item"
            v-for="index in ds.length"
            :key="index"
            :style="{transform:`rotate(${CIRCLEDEGREE/ds.length*(index)}deg)`,backgroundColor:turnTableLineColor}"
          ></div>
        </template>
        <!-- 带背景颜色转动盘背景 -->
        <template v-else>
          <div
            class="background-sector-item"
            v-for="index in dsSector"
            :key="index"
            :style="[{borderTopColor:`${wheelBackgroundColor[index%wheelBackgroundColor.length]}`,borderWidth:`${borderHeight} ${borderWidth} 0 ${borderWidth}`,transform:`translate(-50%,0) rotate(${sectorRotateDegree+CIRCLEDEGREE*(index)/dsSector}deg)`},getSectorStyle(index)]"
          ></div>
        </template>
      </div>
      <!-- 奖品盘 -->
      <div class="wheel-prize-turntable__prize" :style="getPrizeRotate">
        <!-- 奖品项 -->
        <div
          class="prize-item"
          v-for="(item,index) in ds"
          :key="index"
          :style="{transform:`rotate(${eachSectorDegree*index}deg)`}"
        >
          <div class="prize-item-box">
            <span class="prize-item-box__text">{{index}}积分</span>
            <span class="prize-item-box__img">
              <img :src="item.img" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 指针 -->
    <div class="wheel-prize-pointer">
      <div class="wheel-prize-pointer__inner" :style="getInnerPinterStyle">
        <div class="inner-text" :style="getPinterTextStyle" v-debounce="onRun" v-show="!isStart">
          <span>{{pointerText}}</span>
        </div>
        <van-loading :color="wheelBackground" v-show="isStart" size="36px" />
      </div>
    </div>
  </div>
</template>

<script>
// utils
import { px2vw } from 'Utils/common/'

// instance
export default {
  name: 'wheelPrize',
  components: {},
  props: {
    /**奖盘主体相关参数 */
    // 抽奖组件宽度
    wheelWidth: {
      type: Number,
      default: 320
    },
    // 抽奖组件高度
    wheelHeight: {
      type: Number,
      default: 320
    },
    // 抽奖灯带背景(等通整个奖盘背景)
    wheelBackground: {
      type: String,
      default: '#ec9b16'
    },
    /**跑马灯相关参数 */
    // 是否显示跑马灯
    isShowLamp: {
      type: Boolean,
      default: true
    },
    // 跑马灯数量 最好传偶数
    lampQuantity: {
      type: Number,
      default: 30
    },
    /**转盘相关参数 */
    // 转盘背景
    turnTableBackground: {
      type: String,
      default: '#fff'
    },
    // 背景渲染方式 线型line 扇形sector
    wheelBackgroundType: {
      type: String,
      default: 'sector'
    },
    // 背景盘颜色
    wheelBackgroundColor: {
      type: Array,
      default: () => ['#fff', '#e0ddd1']
    },
    // 转盘背景线颜色
    turnTableLineColor: {
      type: String,
      default: '#CDC0B0'
    },
    // 整个抽奖过程持续时间 秒
    turnTableTimer: {
      type: Number,
      default: 5
    },
    // 整个抽奖过程转几圈才停
    turnTableCircle: {
      type: Number,
      default: 5
    },
    /**指针相关参数 */
    pointerText: {
      type: String,
      default: '开始抽奖'
    },
    pointerBackground: {
      type: String,
      default: 'red'
    },
    pointerTextColor: {
      type: String,
      default: '#fff'
    },
    /**奖品相关参数 */
    ds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isStart: false, // 是否开启转动
      CIRCLEDEGREE: 360, // 圆一周度数
      prizeRotateDegree: 45, // 奖品是正方形 则中心角为常量45
      eachSectorDegree: 0, // 扇形圆心角
      prizePlateRotate: 0, // 奖品盘自旋转度数
      innerWidth: 0, // 内圈转盘宽度
      innerHeight: 0, // 内圈转盘高度
      commonStyle: '', // 公共样式属性
      borderWidth: 0, // 三角形底边(border宽)
      borderHeight: 0, // 三角形高(border高)
      sectorRotateDegree: 0, // 整体扇形旋转度数
      dsSector: 0, // 扇形个数
      sectorWidth: 0, // “扇形”宽度
      sectorHeight: 0 // “扇形”高度
    }
  },
  computed: {
    // 获取奖盘基本属性
    getWheelStyle() {
      return {
        width: `${px2vw(this.wheelWidth)}`,
        height: `${px2vw(this.wheelHeight)}`,
        backgroundColor: this.wheelBackground
      }
    },
    // 根据外层盘大小计算内盘大小
    getInnerStyle() {
      return {
        width: `${px2vw(this.wheelWidth - 2 * 20)}`,
        height: `${px2vw(this.wheelHeight - 2 * 20)}`,
        backgroundColor: this.turnTableBackground
      }
    },
    getInnerWidth() {
      return `${px2vw(this.wheelWidth - 2 * 20)}`
    },
    getInnerHeight() {
      return `${px2vw(this.wheelWidth - 2 * 20)}`
    },
    // 获取奖品盘旋转度数
    getPrizeRotate() {
      return {
        transform: `rotate(${this.prizePlateRotate}deg)`
      }
    },
    // 获取当前“扇形”宽高
    getSectorStyle() {
      return index => {
        let backObj
        switch (this.ds.length) {
          case 1:
            backObj = {
              width: px2vw(this.sectorWidth),
              height: px2vw(this.sectorHeight),
              backgroundColor: this.wheelBackgroundColor[
                index % this.wheelBackgroundColor.length
              ],
              transformOrigin: 'center center'
            }
            break
          case 2:
            backObj = {
              width: px2vw(this.sectorWidth),
              height: px2vw(this.sectorHeight),
              backgroundColor: this.wheelBackgroundColor[
                index % this.wheelBackgroundColor.length
              ]
            }
            break
          default:
            backObj = {}
            break
        }
        return backObj
      }
    },
    // 获取抽奖按钮背景色
    getInnerPinterStyle() {
      return {
        backgroundColor: this.pointerBackground
      }
    },
    getPinterTextStyle() {
      return {
        color: this.pointerTextColor
      }
    }
  },
  created() {
    const len = this.ds.length // 奖品个数
    this.eachSectorDegree = this.CIRCLEDEGREE / len // 每个扇形圆心角
    this.innerWidth = px2vw(this.wheelWidth - 2 * 20)
    this.innerHeight = px2vw(this.wheelHeight - 2 * 20)
    // 整个奖品盘旋转量 （奖品起始于左上角 则旋转量为）
    // 这里目前该公式只适合锐角也就是奖品个数大于等于4
    // 这里公式是90 - 360/len - (45 - 360/len/2) 下面进行化简
    this.prizePlateRotate = this.prizeRotateDegree - this.CIRCLEDEGREE / 2 / len
    this.commonStyle = `background-color:${this.turnTableBackground};width:${this.innerWidth};height:${this.innerHeight};`
    if (this.wheelBackgroundType === 'sector') {
      this.renderSectorBackground()
    }
  },
  methods: {
    // 扇形背景渲染
    renderSectorBackground() {
      const len = this.ds.length
      if (len === 1) {
        // 此时扇形为正方形
        this.sectorWidth = this.wheelWidth - 2 * 20
        this.sectorHeight = this.wheelWidth - 2 * 20
      } else if (len === 2) {
        // 此时扇形为半圆的长方形
        this.sectorWidth = this.wheelWidth - 2 * 20
        this.sectorHeight = (this.wheelWidth - 2 * 20) / 2
      } else {
        const sectorR = (this.wheelWidth - 2 * 20) / 2 // 半径
        // 这里看似画的扇形其实是画的三角形 利用overflow显示出来就是扇形了
        // 画三角形 其实是利用Border来画的 这里的起始点在右上角开始画
        // 这里保留的是上border 不要下border 而上border高度就是半径 需要求一手border的宽度左右高度
        // 而宽度是已半径作高 作切线 公式：x/半径 = tan(360/len/2)
        // js的math三角函数的参数不是度数而是弧度参数 所以角度再转弧度 360deg/2 等于 PI
        const radian = Math.PI / len // 弧度
        const bWidth = Math.tan(radian) * sectorR // 宽度
        this.borderWidth = px2vw(Math.ceil(bWidth)) // border宽度(左右border)
        this.borderHeight = px2vw(sectorR) // border高度(上border)
      }
      this.sectorRotateDegree = Math.ceil(this.CIRCLEDEGREE / len / 2)
      this.dsSector = len
    },
    // 开始转
    onRun() {
      this.isStart = true
      const n = ~~(Math.random() * this.ds.length)
      // 这里有个区别 就是我渲染奖品是顺时针渲染
      // 但是旋转是逆时针的旋转 所以下标是反的
      let realN
      if (n === 0) {
        realN = 0
      } else {
        realN = this.ds.length - n
      }
      console.log('中奖下标为', realN)
      // 需要旋转度数
      // 这里公式是 i=0 -> 扇形圆心角 / 2 + 扇形圆心角 * 0
      //           i=1 -> 扇形圆心角 / 2 + 扇形圆心角 * 1
      const degree = this.eachSectorDegree / 2 + this.eachSectorDegree * n

      const fDegree = degree + this.turnTableCircle * this.CIRCLEDEGREE

      this.$refs.myWheelPrize.setAttribute(
        'style',
        `transition: transform ${this.turnTableTimer}s ease-out 0s;transform: rotate(${fDegree}deg);${this.commonStyle}`
      )
      // 监听transition事件完
      this.$refs.myWheelPrize.addEventListener('transitionend', () =>
        this.onTransitionEnd(degree)
      )
    },
    // 动画结束
    onTransitionEnd(d) {
      this.$refs.myWheelPrize.setAttribute(
        'style',
        `transition: transform 0s ease-out 0s;transform: rotate(${d}deg);${this.commonStyle}`
      )
      this.$refs.myWheelPrize.removeEventListener(
        'transitionend',
        this.onTransitionEnd
      )
      this.isStart = false
    }
  }
}
</script>

<style lang='scss' scoped>
.wheel-prize {
  position: relative;
  margin: 0 auto;
  border-radius: 50%;
  // 跑马灯
  &-lamp {
    position: absolute;
    width: 100%;
    height: 100%;
    // 小灯泡
    &__item {
      // 绝对居中来旋转
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 10px;
      height: 100%;
      margin: 0 auto;
      transform-origin: center center;
      @keyframes change-color {
        0% {
          background: #fff;
        }
        100% {
          background: red;
        }
      }
      // 画小圆点
      &::before {
        content: "";
        position: absolute;
        top: 5px;
        right: 0;
        left: 0;
        width: 10px;
        height: 10px;
        margin: 0 auto;
        border-radius: 50%;
      }
      // 圆点颜色
      &:nth-of-type(even):before {
        background: #fff;
        animation: change-color 1s linear infinite;
      }
      &:nth-of-type(odd):before {
        background: red;
        animation: change-color 1s linear reverse infinite;
      }
    }
  }
  // 转动盘
  &-turntable {
    position: absolute;
    overflow: hidden;
    margin: 20px;
    border-radius: 50%;
    // 背景盘
    &__background {
      position: absolute;
      overflow: hidden;
      width: 100%;
      height: 100%;
      // 画线
      .background-line-item {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 50%;
        margin: 0 auto;
        transform-origin: center bottom;
      }
      // 画扇
      .background-sector-item {
        position: absolute;
        top: 0;
        left: 50%;
        width: 0;
        height: 0;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-left-color: transparent;
        border-style: solid;
        transform-origin: center bottom;
      }
    }
    // 奖品
    &__prize {
      position: absolute;
      width: 100%;
      height: 100%;
      // 奖品项
      .prize-item {
        position: absolute;
        top: 5%;
        left: 5%;
        width: 45%;
        height: 45%;
        transform-origin: right bottom;
        // 奖品扇形内容器
        &-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          transform: rotate(-45deg);
          // 文字
          &__text {
            z-index: 1;
            margin-bottom: 5px;
            font-size: 12px;
          }
          // 图片
          &__img {
            width: 50px;
            height: 50px;
            & > img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  // 指针
  &-pointer {
    @include fcc;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 80px;
    margin: auto;
    background-color: #ec9b16;
    border-radius: 50%;
    // 指针内盘
    &__inner {
      @include fcc;
      width: 66px;
      height: 66px;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      text-align: center;
      background-color: red;
      box-shadow: 0 0 4px #333;
      border-radius: 50%;
      // 指针内盘文字
      .inner-text {
        padding: 5px;
        line-height: 24px;
        text-shadow: 1px 1px 2px black, -1px -1px 2px white;
      }
    }
    // 小指针
    &::before {
      content: "";
      position: absolute;
      top: -18px;
      right: 0;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      margin: 0 auto;
      border-color: transparent transparent #ec9b16 transparent;
      border-style: solid;
      border-width: 0 8px 20px 8px;
    }
  }
}

</style>
