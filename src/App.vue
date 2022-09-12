<template>
  <div id="app">
    <!-- 设置页面过渡动画 -->
    <transition :name="transitionName">
      <keep-alive include="Header">
        <router-view>
          <!-- 这里是会被缓存的视图组件-->
        </router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      transitionName: ''//默认动画
    }
  },
  watch: {
    '$route'(to, from) {
      //页面切换动画
      console.log(to)
      let toName = to.name

      const toIndex = to.meta.index
      console.log('toIndex: ', toIndex);
      const fromIndex = from.meta.index
      console.log('fromIndex: ', fromIndex);
      if (fromIndex) {
        this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left'
      }
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html {
  font-size: 12px;
}

/* html,body{
    width: 100%;
    height: 100%;
} */

a {
  text-decoration: none;
  /* 去除默认的下划线 */
  outline: none;
  /* 去除旧版浏览器的点击后的外虚线框 */
  color: #000;
  /* 去除默认的颜色和点击后变化的颜色 */
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #8a919f;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #8a919f;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #8a919f;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #8a919f;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  /* height: 100vh; */
  /* background-color: #f7f7f7; */
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

@media screen and (max-width: 840px) {
  .el-message-box__wrapper .el-message-box {
    width: 340px !important;
  }
}
</style>
