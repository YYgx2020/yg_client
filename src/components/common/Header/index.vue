<template>
  <div class="header">
    <div class="logo">
      <router-link to="/">
        <img src="../../../assets/img/logo_img.png" alt="" />
      </router-link>
    </div>
    <ul class="right_nav">
      <li class="nav_item">
        <router-link to="/" title="首页">
          <span class="iconfont icon-shouye"></span>
        </router-link>
      </li>
      <li class="nav_item">
        <router-link to="/articleList" title="文章列表">
          <span class="iconfont icon-yuedu-2"></span>
        </router-link>
      </li>
      <li class="nav_item">
        <router-link to="/messageBoard" title="留言板">
          <span class="iconfont icon-liuyan1"></span>
        </router-link>
      </li>
      <li class="nav_item">
        <router-link to="/self" title="关于我">
          <span class="iconfont icon-guanyu"></span>
        </router-link>
      </li>
      <li class="nav_item">
        <!-- iconfont icon-denglu -->
        <!-- <router-link to="/login" title="登录">
          <span class="no_login_text">登</span>
        </router-link> -->
        <button v-if="!$store.state.isLogin" class="no_login_btn" @click="loginEvent">登</button>
        <router-link to="/admin" title="个人中心">
          <img class="user_avatar" v-if="$store.state.isLogin" :src="$store.state.userInfo.user_avatar" alt="">
        </router-link>
      </li>
    </ul>
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
  name: 'Header',
  data() {
    return {

    }
  },
  created() {
    // 从cookie中获取用户信息
    const token = Cookies.get('yg_c_token')
    if (token) {
      console.log('token没有过期');
      let userInfo = JSON.parse(Cookies.get('userInfo'))
      this.$store.commit('changeLoginState', true)
      console.log('用户信息：', userInfo);
      this.$store.commit('setToken', token)
      this.$store.commit('setUserInfo', userInfo)
    }

  },
  methods: {

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
  },
}
</script>

<style lang="less" scoped>
li {
  list-style: none;
}

.header {
  width: 100%;
  height: 5rem;
  background-color: #fff;
  box-shadow: rgba(178, 178, 178, 0.35) 1px 1px 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    width: 3rem;
    height: 3rem;
    margin-left: 1rem;
    border-radius: 50%;
    box-shadow: 6px 6px 12px #f2f2f2,
      -6px -6px 12px #ffffff;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .right_nav {
    display: flex;
    width: auto;
    margin-right: 1rem;
    cursor: pointer;

    .nav_item {
      width: 3rem;
      height: 3rem;
      margin: 0 1rem;
      line-height: 3rem;
      text-align: center;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 6px 6px 12px #f2f2f2,
        -6px -6px 12px #ffffff;

      .user_avatar {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }

      button {
        height: 100%;
        width: 100%;
        font-size: 16px;
        font-weight: 700;
        font-family: '皇室战争 Bold';
        outline: none;
        background: transparent;
        border: 0px;
        cursor: pointer;
      }

      a {
        display: inline-block;
        width: 3rem;
        height: 3rem;

        span {
          font-size: 1.5rem;
        }
      }
    }

    .nav_item:hover {
      background: linear-gradient(145deg, #e6e6e6, #ffffff);
      box-shadow: 6px 6px 12px #f2f2f2,
        -6px -6px 12px #ffffff;
    }

    @media screen and(min-width: 1200px) {
      .nav_item:hover::after {}
    }
  }
}
</style>