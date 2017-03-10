const socket = io()
const Vue = require('vue')





Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus
    }
});


var bus = new Vue({})

var vm = new Vue({
  el: "#app",
  data:{
    message: "test test"
  }
})
