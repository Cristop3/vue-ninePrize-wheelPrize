/**
 *  @module  自定义指令
 *  @author ljxin
 *  @desc 扩展vue指令，根据实际情况来定，比如函数的节流防抖可以用指令来做,还有我遇到的按钮权限等
 */
import Vue from 'vue';
import { debounce } from '../utils';

Vue.directive('debounce', {
  bind(el, binding) {
    const func = debounce(binding.value, 1000);
    el.addEventListener('click', func);
  },
});
