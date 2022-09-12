<template>
  <div id="Home">
    <div class="container">
    </div>
    <div class="logo_img">
      <img src="../../assets/img/logo_img_white.png" alt="">
    </div>
    <!-- 文字 -->
    <div class="logo_font">
      <span>溢狗之家</span>
    </div>
    <div class="nav">
      <ul>
        <li data-name="articleList" @click="toPage">文章列表</li> |
        <li data-name="messageBoard" @click="toPage">留言板</li> |
        <li data-name="self" @click="toPage">关于溢狗</li>
      </ul>
    </div>
    <button v-if="!$store.state.isLogin" class="login_box" @click="loginEvent">登录</button>
    <button v-if="$store.state.isLogin" class="login_box" @click="toPersonalPage">个人中心</button>
    <div class="related_link">
      <ul>
        <li>
          <div class="icon1">
            <span class="iconfont icon-weixin"></span>
          </div>
          <svg-icon class="li_svg" iconClass="weixin_logo"></svg-icon>
          <div id="my_wechat">
            <img src="../../assets/img/my_wechat.jpg" alt="">
          </div>
        </li>
        <li>
          <div class="icon1">
            <span class="iconfont icon-weixingongzhonghao"></span>
          </div>
          <svg-icon class="li_svg" iconClass="wechat_public_account"></svg-icon>
          <div id="my_wechat_official_account">
            <span>我的微信公众号</span>
            <img src="@/assets/img/qrcode_for_gh_f53b6f0da166_258.jpg" alt="">
          </div>
        </li>
        <li>
          <a class="icon1" href="https://github.com/YYgx2020/yg_client.git">
            <span class="iconfont icon-github"></span>
          </a>
          <svg-icon class="li_svg" iconClass="GitHub"></svg-icon>
          <div id="github_link">
            <span>项目的开源地址</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <a href="https://www.beianx.cn/search/桂ICP备2021001752号-1">
        <h2>桂ICP备2021001752号-1</h2>
      </a>
      
    </div>
    <!-- 登录弹窗 -->
    <Login></Login>
  </div>
</template>

<script>
import Login from '@/components/common/Login';
import Cookies from 'js-cookie';

export default {
  components: {
    Login,
  },
  data() {
    return {
    }
  },
  created() {
    // 获取用户登录信息
    // 判断 token 是否过期
    const token = Cookies.get('yg_c_token')
    console.log('查看更新');
    if (token) {
      console.log('token没有过期');
      let userInfo = JSON.parse(Cookies.get('userInfo'))
      this.$store.commit('changeLoginState', true)
      console.log('用户信息：', userInfo);
      this.$store.commit('setToken', token)
      this.$store.commit('setUserInfo', userInfo)
    } else {
      this.$store.commit('changeLoginState', false)
    }
  },
  methods: {
    toPage(e) {
      const { name } = e.currentTarget.dataset
      this.$router.push({
        name,
      })
    },
    loginEvent() {
      console.log('弹出登录弹窗');
      this.$store.commit('showLoginPop', true)
      this.stopMove();
    },
    // 禁止页面滑动
    stopMove() {
      let m = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", m, { passive: false }); //禁止页面滑动
    },

    // 个人中心页
    toPersonalPage() {
      console.log('跳到个人中心页');
      this.$router.push({
        name: 'admin',
        meta: {
          title: '个人中心'
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/home.less');
</style>