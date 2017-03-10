const socket = io()





Object.defineProperty(Vue.prototype, '$bus', {
    get() {
        return this.$root.bus
    }
});


var bus = new Vue({})

var vm = new Vue({
  el: "#app",
  data:{
    quiz: {},
  },
  created: function () {
    axios.get()
  }
})
