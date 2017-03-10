import Vue from 'vue'
import App from './App'


Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus
    }
});


var bus = new Vue({})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  data: { bus: bus}
})
