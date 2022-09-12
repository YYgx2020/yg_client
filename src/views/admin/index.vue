<template>
  <div id="admin">
    <Header></Header>
    <!-- pc 端个人信息布局 -->
    <div class="personal_info_panel_pc">
      <div class="user_avatar">
        <img :src="$store.state.userInfo.user_avatar" alt="">
      </div>
      <div class="user_name">
        <h1>{{$store.state.userInfo.username}}</h1>
        <span>{{$store.state.userInfo.motto}}</span>
      </div>
      <div class="data_list">
        <div class="data_item">
          <h4>个人成就</h4>
        </div>
        <div class="data_item">
          <span class="icon iconfont icon-wenzhang-copy"></span>
          <span>发表文章数<span class="num1">&nbsp;&nbsp;{{personData.articleNum}}</span></span>
        </div>
        <div class="data_item">
          <span class="icon iconfont icon-ico_yueduliang"></span>
          <span>文章被阅读<span class="num1">&nbsp;&nbsp;{{personData.read}}</span></span>
        </div>
        <div class="data_item">
          <span class="icon iconfont icon-good"></span>
          <span>文章被点赞<span class="num2">&nbsp;&nbsp;{{personData.like}}</span></span>
        </div>
      </div>
      <div class="btn_list">
        <button class="write_article_btn" @click="toEditorPage">写文章</button>
        <!-- <button class="draft_box_btn">草稿箱</button> -->
        <button class="layout_btn" @click="layoutEvent">退出登录</button>
      </div>
    </div>
    <div class="personal_info_panel_mobile">
      <div class="user_info_panel">
        <div class="user_avatar">
          <img :src="$store.state.userInfo.user_avatar" alt="">
        </div>
        <div class="other_info">
          <div class="user_name">
            <h1>溢狗</h1>
          </div>
          <div class="motto">
            <span>开发、学习、成长...</span>
          </div>
        </div>
        <div class="layout">
          <button @click="layoutEvent">退出</button>
        </div>
      </div>
      <div class="person_data">
        <div class="title">
          <h2>个人成就</h2>
        </div>
        <div class="data_item">
          <span class="icon iconfont icon-wenzhang-copy"></span>
          <span>发表文章数<span class="num1">&nbsp;&nbsp;{{personData.articleNum}}</span></span>
        </div>
        <div class="data_item">
          <span class="icon iconfont icon-ico_yueduliang"></span>
          <span>文章被阅读<span class="num1">&nbsp;&nbsp;{{personData.read}}</span></span>
        </div>
        <div class="data_item">
          <span class="icon iconfont icon-good"></span>
          <span>文章被点赞<span class="num2">&nbsp;&nbsp;{{personData.like}}</span></span>
        </div>
      </div>
    </div>
    <div class="detail_list">
      <ul class="nav_ul">
        <li class="nav_item">
          <router-link active-class="active" exact to="/admin">我的文章</router-link>
        </li>
        <li class="nav_item">
          <router-link active-class="active" to="/admin/message">网友留言</router-link>
        </li>
        <li class="nav_item">
          <router-link active-class="active" to="/admin/drafts">草稿文案</router-link>
        </li>
      </ul>
      <div class="detail_content_list">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/common/Header'
import Cookies from "js-cookie";
import {getTotalData} from '@/api';
export default {
  components: {
    Header
  },
  data() {
    return {
      personData: {
        articleNum: 0,
        read: 0,
        like: 0
      },
    }
  },
  created() {
    getTotalData().then(res => {
      console.log(res);
      this.personData = res.data.result
    }).catch(err => {
      console.log(err);
    })
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
    // 退出登录事件
    layoutEvent() {
      // 清除cookie信息，然后返回首页
      Cookies.remove('userInfo');
      Cookies.remove('yg_c_token');
      this.$router.replace({
        name: 'home',
      })
    },
    // 进入写文章页面
    toEditorPage() {
      let routeUrl = this.$router.resolve({
        name: 'editor',
        query: {
          new_draft: new Date().getTime(),
        },
      })
      // localStorage.setItem('type', '1')
      window.open(routeUrl.href, '_blank')
    },
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/admin.less');
</style>