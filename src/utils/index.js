/**
 * @func 手动处理px转为vw,目前先写死默认值，此处应该可postcss中的options设置一致,后面再优化
 * @method  px 需要转换的px数值
 * @method  viewportSize 基于多少视口宽度 默认375
 * @method  unitPrecision 保留小数 默认3位
 * @method  viewportUnit 转换的视口单位值 默认vw
 * @method  minPixelValue 小于多少不转换了 默认1
 */
const px2vw = function(
  px,
  viewportSize = 375,
  unitPrecision = 3,
  viewportUnit = "vw",
  minPixelValue = 1
) {
  let pixels = parseFloat(px);
  if (pixels <= minPixelValue) return;
  return toFixed((pixels / viewportSize) * 100, unitPrecision) + viewportUnit;
};
function toFixed(number, precision) {
  let multiplier = Math.pow(10, precision + 1);
  let wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
const debounce = function(func, wait, immediate = true) {
  let timeout;
  return function() {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(this, arguments);
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  };
};

export {
  px2vw,
  debounce
}