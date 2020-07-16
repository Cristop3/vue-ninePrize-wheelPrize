<template>
  <div id="app">
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
    <wheel-prize
      :ds="dsSectorPrize"
      wheel-background-type="sector"
    ></wheel-prize>
  </div>
</template>

<script>
import wheelPrize from "./components/WheelPrize";
import NinePrize from "./components/NinePrize";
import iconBill from './assets/bill@2x.png'
import iconEnterprise from './assets/enterprise@2x.png'
import iconApply from './assets/apply@2x.png'
import avatarIcon from './assets/default_head_icon.png'
export default {
  name: "app",
  components: { 'wheel-prize': wheelPrize, 'nine-prize': NinePrize },
  data(){
    return {
      iconApply,
      iconEnterprise,
      iconBill,
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
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
