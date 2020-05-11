<template>
  <div class="test">
    <!-- 九宫格转盘 -->
    <h4>可指定样式九宫格4格随机抽奖</h4>
    <nine-prize
      :ds="dsNinePrize4"
      prize-background="#BFEFFF"
      prize-item-background="#F0F0F0"
      pointer-text="GO!"
      pointer-background="#EEB422"
      turn-background="blue"
    ></nine-prize>
    <h4>可指定样式九宫格9格随机抽奖</h4>
    <nine-prize :ds="dsNinePrize"></nine-prize>
    <h4>可指定样式九宫格12格随机抽奖</h4>
    <nine-prize :ds="dsNinePrize12"></nine-prize>
    <!-- 封装 -->
    <h4>自定义线形颜色 但只支持偶数个奖品显示为分割线</h4>
    <wheel-prize
      :ds="dsLinePrize"
      wheel-background-type="line"
      wheel-background="#0887f2"
      turn-table-background="#c6c7ca"
      turn-table-line-color="#333"
      pointer-background="yellow"
      pointer-text-color="#c6c7ca"
      pointer-text="GO!"
    ></wheel-prize>
    <h4>自定义颜色背景 支持1,2,3等任意奖品个数</h4>
    <wheel-prize :ds="dsSectorPrize" wheel-background-type="sector"></wheel-prize>
  </div>
</template>

<script>
import { floatDiv, floatMul, floatAdd } from 'Utils/common/'
import { px2vw } from 'Utils/common/'
import avatarIcon from 'Assets/images/common/default_head_icon.png'

import iconBill from 'Assets/images/home/bill@2x.png'
import iconEnterprise from 'Assets/images/home/enterprise@2x.png'
import iconApply from 'Assets/images/home/apply@2x.png'

import wheelPrize from './WheelPrize'
import NinePrize from './NinePrize'

export default {
  name: 'test',
  components: { 'wheel-prize': wheelPrize, 'nine-prize': NinePrize },
  data() {
    return {
      iconApply,
      iconEnterprise,
      iconBill,
      avatarIcon,
      dsLights: 30, // 跑马灯小点个数
      dsNinePrize: [
        { id: 1, isSelect: true, img: avatarIcon, text: '我是奖品1' },
        { id: 2, isSelect: false, img: iconBill, text: '我是奖品2' },
        { id: 3, isSelect: false, img: iconApply, text: '我是奖品3' },
        { id: 4, isSelect: false, img: iconEnterprise, text: '我是奖品4' },

        { id: 5, isSelect: false, img: avatarIcon, text: '我是奖品5' },
        { id: 6, isSelect: false, img: iconBill, text: '我是奖品6' },
        { id: 7, isSelect: false, img: iconApply, text: '我是奖品7' },
        { id: 8, isSelect: false, img: iconEnterprise, text: '我是奖品8' }

        // { id: 9, isSelect: false, img: iconEnterprise, text: '我是奖品9' },
        // { id: 10, isSelect: false, img: iconApply, text: '我是奖品10'  },
        // { id: 11, isSelect: false , img: iconBill, text: '我是奖品11'},
        // { id: 12, isSelect: false, img: avatarIcon, text: '我是奖品12' }
      ],
      dsNinePrize12: [
        { id: 1, isSelect: true, img: avatarIcon, text: '我是奖品1' },
        { id: 2, isSelect: false, img: iconBill, text: '我是奖品2' },
        { id: 3, isSelect: false, img: iconApply, text: '我是奖品3' },
        { id: 4, isSelect: false, img: iconEnterprise, text: '我是奖品4' },

        { id: 5, isSelect: false, img: avatarIcon, text: '我是奖品5' },
        { id: 6, isSelect: false, img: iconBill, text: '我是奖品6' },
        { id: 7, isSelect: false, img: iconApply, text: '我是奖品7' },
        { id: 8, isSelect: false, img: iconEnterprise, text: '我是奖品8' },

        { id: 9, isSelect: false, img: iconEnterprise, text: '我是奖品9' },
        { id: 10, isSelect: false, img: iconApply, text: '我是奖品10' },
        { id: 11, isSelect: false, img: iconBill, text: '我是奖品11' },
        { id: 12, isSelect: false, img: avatarIcon, text: '我是奖品12' }
      ],
      dsNinePrize4: [
        { id: 1, isSelect: true, img: avatarIcon, text: '我是奖品1' },
        { id: 2, isSelect: false, img: iconBill, text: '我是奖品2' },
        { id: 3, isSelect: false, img: iconApply, text: '我是奖品3' },
        { id: 4, isSelect: false, img: iconEnterprise, text: '我是奖品4' }
      ],
      dsLinePrize: [
        { img: avatarIcon },
        { img: iconBill },
        { img: avatarIcon },
        { img: iconBill },
        { img: avatarIcon },
        { img: iconBill }
      ],
      dsSectorPrize: [
        { img: iconApply },
        { img: iconEnterprise },
        { img: iconApply },
        { img: iconEnterprise },
        { img: iconApply },
        { img: iconEnterprise },
        { img: iconApply },
        { img: iconEnterprise }
      ],
      dsPrize: [
        {
          id: 1
        },
        {
          id: 2
        },
        {
          id: 3
        },
        {
          id: 4
        },
        {
          id: 5
        },
        {
          id: 6
        },
        {
          id: 7
        },
        {
          id: 8
        },
        {
          id: 9
        },
        {
          id: 10
        }
      ],
      ctx: null,
      trangleBase: 0, // 三角形底边
      trangleHeight: 0, // 三角形高
      rotateDegree: 0,
      ds: 0
    }
  },
  created() {
    // 1. 根据奖品数量 求每个奖品的圆心角
    const len = 6
    // const cDegree = floatDiv(360, len) // 圆心角度数
    // const cDegreeHalf = floatDiv(cDegree,2)
    // console.log('圆心角度数', cDegree)
    // const tHeight = 140 // 三角形高度（为圆的半径）
    // const PIDIV360 = floatDiv(Math.PI, 180) // 角度转弧度常量
    // console.log('角度转弧度常量', PIDIV360)
    // console.log('tan参数', floatMul(cDegree, PIDIV360))
    // console.log('弧度', floatDiv(floatMul(cDegree, Math.PI), 180))
    // const tWidth = Math.tan(floatDiv(floatMul(cDegree, Math.PI), 180))
    // console.log('宽度', tWidth * 140 * 2)

    const radian = Math.PI / len // 弧度
    const tHeight = 140 // 三角形高度（为圆的半径）
    const tWidth = Math.tan(radian) * tHeight
    // console.log('宽度', Math.ceil(tWidth))

    this.trangleBase = px2vw(Math.ceil(tWidth))
    this.trangleHeight = px2vw(tHeight)
    this.rotateDegree = Math.ceil(180 / len)
    this.ds = len
  },
  mounted() {
    //this.initCanvas()
  },
  methods: {
    // 初始化canvas画布
    initCanvas() {
      let domCanvas = document.querySelector('#canvas')
      let ctx = domCanvas.getContext('2d')
      if (ctx) {
        this.ctx = ctx
        this.initCenter()
      } else {
        console.log('当前不支持canvas')
      }
    },
    // 初始化画布中心
    initCenter() {
      this.ctx.translate(0, 0)
      this.drawPrize(this.ctx)
    },
    // 画出抽奖盘
    drawPrize(ctx) {
      // this.dsPrize.forEach(el => {
      //   this.ctx.beginPath()
      //   this.ctx.moveTo(0, 0)
      //   this.ctx.strokeStyle = '#111'
      //   this.ctx.closePath()
      // })

      ctx.save()
      ctx.moveTo(140, 140)
      ctx.lineTo(150, 0)
      ctx.stroke()
    },

    /**线盘转动 */
    onRun() {
      // 随机下标
      const n = ~~(Math.random() * 8)
      // console.log('当前内定奖品下标为：', n)
      console.log('当前内定奖品真实下标为：', 8 - n)
      // 需要旋转度数
      const degree = floatAdd(22.5, 45 * n)
      const fDegree = floatAdd(degree, 1800)

      this.$refs.myWheel.style = `transition: transform 5s ease-out 0s;transform: rotate(${fDegree}deg);`

      // 监听transition事件完
      this.$refs.myWheel.addEventListener('transitionend', () =>
        this.onTransitionEnd(degree)
      )
    },
    onTransitionEnd(d) {
      console.log('动画完')
      this.$refs.myWheel.style = `transition: transform 0s ease-out 0s;transform: rotate(${d}deg);`
      this.$refs.myWheel.removeEventListener(
        'transitionend',
        this.onTransitionEnd
      )
    }
  }
}
</script>

<style lang='scss' scoped>
.test {
  // 转盘主体
  .wheel-box {
    position: relative;
    width: 320px;
    height: 320px;
    margin: 0 auto;
    background-color: #ec9b16;
    border-radius: 50%;
    // 跑马灯
    &-light {
      position: absolute;
      width: 100%;
      height: 100%;
      & > span {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        width: 10px;
        height: 100%;
        margin: 0 auto;
        transform-origin: center center;
        // @keyframes white-to-yellow {
        //   0% {
        //     background: #fff;
        //   }
        //   100% {
        //     background: red;
        //   }
        // }
        // 跑马灯圆点
        &:before {
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
          animation: white-to-yellow 1s linear infinite;
        }
        &:nth-of-type(odd):before {
          background: red;
          animation: white-to-yellow 1s linear reverse infinite;
        }
      }
    }
    .rotate-box {
      position: absolute;
      overflow: hidden;
      width: 280px;
      height: 280px;
      margin: 20px;
      background: #fff;
      border-radius: 50%;
    }
    // 抽奖盘
    &-disc {
      position: absolute;
      overflow: hidden;
      width: 100%;
      height: 100%;

      // transform: rotate(90deg);

      // canvas来画
      .canvas {
        width: 280px;
        height: 280px;
      }

      // item 利用倾斜来画
      &__items {
        position: absolute;
        top: 0;
        left: 50%;
        width: 0;
        height: 0;
        background: #f07;
        // transform: rotate(-36deg) skewY(-50deg);
        // transform-origin: 0 100%;
      }

      // 利用线来画
      &__item {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        width: 1px;
        height: 50%;
        margin: 0 auto;
        background: #dfd8be;
        transform-origin: center bottom;
      }

      // 纯css来画
      &__trangle {
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

    // 奖品图容器
    &-prize {
      position: absolute;
      width: 100%;
      height: 100%;
      // 每项奖品
      &__item {
        position: absolute;
        top: 5%;
        left: 5%;
        width: 45%;
        height: 45%;
        transform-origin: right bottom;
        // 奖品扇形内容器
        .item-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          transform: rotate(-45deg);
          // 文字
          &-text {
            z-index: 1;
            margin-bottom: 5px;
            font-size: 12px;
          }
          // 图片
          &-img {
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
        display: flex;
        align-items: center;
        width: 66px;
        height: 66px;
        color: #fff;
        font-size: 20px;
        line-height: 20px;
        text-align: center;
        background-color: red;
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
        width: 0;
        border-color: transparent transparent #ec9b16 transparent;
        border-style: solid;
        border-width: 0 8px 20px 8px;
      }
    }
  }
  .test3 {
    // overflow: hidden;
    width: 0;
    height: 0;
    border-color: red transparent transparent transparent;
    border-style: solid;
    border-width: 100px 50px 0 50px;

// transform: rotate(45deg);
    // border-radius: 100px;
    cursor: pointer;
  }
  .test4 {
    width: 0;
    height: 0;
    border-color: transparent transparent red;
    border-style: solid;
    border-width: 0 40px 40px;
  }
  .test5 {
    width: 0;
    height: 0;
    border-color: red blue green yellow;
    border-style: solid;
    border-width: 40px 0 0 0;
  }
  h4 {
    margin: 0;
  }
  .nine {
    width: 100px;
    height: 100px;
    margin: 200px 30px;
    border: 2px solid yellow;
    transform-origin: right bottom;
  }
}
</style>
