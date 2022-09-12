<template>
  <div id="not_found">
    <Header></Header>
    <svg-icon class="not_found_svg" iconClass="404"></svg-icon>
    <div class="back_to_home" @click="toHomePage">
      回到首页
      <!-- <a href="#" @></a>
      <router-link to="/">回到首页</router-link> -->
    </div>
  </div>
</template>

<script>
import Header from '@/components/common/Header/index.vue';
export default {
    components: { Header },
    methods: {
      toHomePage() {
        this.$router.replace({
          name: 'home',
        })
      },
    }
}
</script>

<style lang="less" scoped>
#not_found {
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .not_found_svg {
    margin-top: 20px;
    height: 600px;
  }
  .back_to_home {
    position: relative;
    top: -100px;
    font-size: 18px;
    font-family: '皇室战争 Bold';
    font-weight: 500;
    cursor: pointer;
  }
  .back_to_home:hover {
    color: #1e80ff;
  }

}
</style>