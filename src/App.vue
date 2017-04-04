<template>
  <div id="app">
    <loading :show="loadingShow"></loading>
    <!-- 子路由组件 -->
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      <v-tips :show="tipsShow"></v-tips>
    <v-nav></v-nav>
  </div>
</template>

<script>
  import vHeader from './components/Header.vue';
  import loading from './components/loading.vue';
  import vNav from './components/Nav.vue';
  import vTips from './components/Tips.vue';
  import vHello from './components/Hello.vue';
  import { mapState } from 'vuex';
export default {
  name: 'app',
  components: {
    vHeader,
    loading,
    vNav,
    vHello,
    vTips
  },
  created(){
    this.$router.push('home');
  },
  data(){
    return {
      firstShow: true,
      showDismiss: false,
      showReturn: true
    };
  },
  computed: {
    ...mapState([
      'loadingShow','tipsShow'
      ])
  },
  methods: {

  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 50px;
}
::-webkit-scrollbar{
     display:none;
}
.fade-enter-active, .fade-leave-active{
  transition:all .5s ease;
  transform:translate(0px, 0);
}
  
.fade-enter, .fade-leave-active{
  opacity: 0;
  transform:translate(30px, 0);
}
</style>
