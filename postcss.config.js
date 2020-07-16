module.exports = {
  plugins: {
    // "postcss-import": {}, 
    // "postcss-url": {}, 
    //autoprefixer: {}, 
    'postcss-cssnext': {}, 
    'postcss-viewport-units': {
      filterRule: rule =>
        rule.selector.indexOf('::after') === -1 &&
        rule.selector.indexOf('::before') === -1 &&
        rule.selector.indexOf(':after') === -1 &&
        rule.selector.indexOf(':before') === -1
    }, //  自动添加content属性 （但是注意使用伪类的里面同时带了after,before，需要排除）
    cssnano: {
      preset: 'advanced',
      autoprefixer: true, // 同上3
      'postcss-zindex': false
    },
    'postcss-px-to-viewport': {
      viewportWidth: 375, //视口宽度，对应的是我们设计稿的宽度，一般是750
      //viewportHeight: 1334,    //视口高度
      unitPrecision: 3, //单位精度
      viewportUnit: 'vw', //单位名称
      selectorBlackList: [
        '.ignore',
        '.hairlines'
      ], //配置白名单拥有该类名的元素保留px单位
      minPixelValue: 1, //小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false //允许在媒体查询中转换`px`
    }
  }
};
