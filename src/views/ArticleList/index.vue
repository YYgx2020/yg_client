<template>
  <div id="article_list_container">
    <Header></Header>
    <!-- 主要内容区域 -->
    <main>
      <!-- 头部导航 -->
      <nav ref="nav" id="nav">
        <ul class="nav_list">
          <!-- navList -->
          <li class="nav_item" v-for="(item, index) in navList" :key="item.id" @click="navClick(item, index)">
            <span :class="item.choosed ? 'active' : ''">{{ item.label }}</span>
          </li>
        </ul>
      </nav>
      <div class="article_list">
        <div class="left">
          <li class="list_item skeleton" v-if="showSkeleton">
            <el-skeleton :rows="4" animated />
          </li>
          <li v-if="articleList.length === 0 && !showSkeleton" class="no_data">
            <svg-icon class="li_svg" style="height: 160px;" iconClass="no_data"></svg-icon>
          </li>
          <li class="list_item" v-for="(item) in articleList" :key="item.id" @click="toDetailPage(item.id)">
            <div class="meta_container">
              <span class="date">{{ item.createTime }}</span>
              <!-- <a href=""></a> -->
              <!-- <router-link to=""></router-link> -->
              <span class="tag_link">{{ item.category }}</span>
            </div>
            <div class="content_wrapper">
              <div class="content_main">
                <div class="title_row">
                  <span class="title">{{ item.title }}</span>
                </div>
                <div class="abstract">
                  <div>
                    {{ item.abstract }}
                  </div>
                </div>
                <ul class="action_list">
                  <li class="item">
                    <i class="iconfont icon-ico_yueduliang"></i>
                    <span>{{ item.read }}</span>
                  </li>
                  <li class="item">
                    <i class="iconfont icon-good"></i>
                    <span>{{ item.like }}</span>
                  </li>
                  <li class="item">
                    <i class="iconfont icon-pinglun"></i>
                    <span>{{ item.comment }}</span>
                  </li>
                </ul>
              </div>
              <img v-if="item.cover" class="cover" :src="item.cover" alt="" />
            </div>
          </li>
        </div>
        <div class="right" ref="right" id="right">
          <div class="person_info">
            <div class="person_panel">
              <div class="avatar">
                <img :src="userInfo.user_avatar" alt="">
              </div>
              <div class="name_panel">
                <span class="name">{{ userInfo.username }}</span>
                <span class="motto">{{ userInfo.motto }}</span>
              </div>
            </div>
            <div class="person_achievement">
              <div class="person_data">
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
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/common/Header';
// import Cookies from "js-cookie";
import { getArticleList, getInfoLimit, getTotalData } from '@/api';
import { timeago } from '@/utils/timeago';
export default {
  components: {
    Header
  },
  data() {
    return {
      navList: [
        {
          id: 0,
          choosed: true,
          label: '全部',
        },
        {
          id: 1,
          choosed: false,
          label: "前端",
        },
        {
          id: 2,
          choosed: false,
          label: "计算机网络",
        },
        {
          id: 3,
          choosed: false,
          label: "后端",
        },
        {
          id: 4,
          choosed: false,
          label: "数据结构与算法",
        },
        {
          id: 5,
          choosed: false,
          label: "求职",
        },
        {
          id: 6,
          choosed: false,
          label: "人生感悟",
        },
        {
          id: 7,
          choosed: false,
          label: "其他",
        },
      ],
      userInfo: {},
      articleList: [],
      showSkeleton: true,
      down2: true,
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
    // 获取文章列表
    this.getArticleList()
    // 获取用户信息
    this.getUserInfo()
  },
  mounted() {
    // 检测页面滚动的距离
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScrollx, true)
    })
  },
  destroyed() {
    console.log('页面销毁');
    window.removeEventListener('scroll', this.handleScrollx)
    /* 
      为什么页面销毁之后，refs 中还保留有之前页面的 ref？
    */
  },
  methods: {
    handleScrollx() {
      let nav = document.getElementById('nav')
      let right = document.getElementById('right')
      if (!nav) return
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrollTop)
      // console.log(this.$refs);
      if (this.down2 && scrollTop > 60) {
        console.log("文章列表：", this.$refs);
        // this.$refs.nav.style.position = 'fixed';
        // this.$refs.nav.style.marginTop = '-60px';
        // this.$refs.right.style.position = 'fixed';
        // this.$refs.right.style.marginTop = '-12px';
        nav.style.position = 'fixed';
        nav.style.marginTop = '-60px';
        right.style.position = 'fixed';
        right.style.marginTop = '-12px';
        this.down2 = false;
      }
      if (!this.down2 && scrollTop < 60) {
        // console.log("文章列表：", this.$refs);
        // this.$refs.nav.style.position = 'relative';
        // this.$refs.nav.style.marginTop = '0px';
        // this.$refs.right.style.position = 'absolute';
        // this.$refs.right.style.marginTop = '0px';
        nav.style.position = 'relative';
        nav.style.marginTop = '0px';
        right.style.position = 'absolute';
        right.style.marginTop = '0px';
        this.down2 = true;
      }
    },
    // 获取文章列表
    getArticleList() {
      let data = {
        offset: 0,
        limit: 10,
      }
      getArticleList(data).then(res => {
        console.log(res);
        this.articleList = res.data.res;
        this.articleList = this.articleList.map(item => {
          item.createTime = timeago(item.createTime)
          return item
        })
        this.showSkeleton = false;
      }).catch(err => {
        console.log(err);
        this.showSkeleton = false;
      })
    },
    // 获取用户信息
    getUserInfo() {
      let data = { id: 1 }
      getInfoLimit(data).then(res => {
        console.log(res);
        this.userInfo = res.data.res;
      }).catch(err => {
        console.log(err);
      })
    },
    // test(id) {
    //   console.log(id);
    // },
    toDetailPage(id) {
      // 跳转到文章详情列表
      this.$router.push(`/detail/${id}`)
    },

    // 导航栏点击事件
    navClick(item, index) {
      this.articleList = []
      this.showSkeleton = true
      // console.log(item);
      // 改变状态，然后请求分类数据
      this.navList = this.navList.map((itm, idx) => {
        if (index == idx) {
          itm.choosed = true;
        } else {
          itm.choosed = false;
        }
        return itm;
      })
      if (item.label !== '全部') {
        let data = {
          offset: 0,
          limit: 10,
          category: item.label,
        }
        getArticleList(data).then(res => {
          this.showSkeleton = false;
          this.articleList = res.data.res;
          this.articleList = this.articleList.map(item => {
            item.createTime = timeago(item.createTime)
            return item
          })
        }).catch(err => {
          this.articleList = [];
          this.showSkeleton = false
        })
      } else {
        this.getArticleList()
      }
    },
  },
  name: 'ArticleList',
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/articleList.less');
</style>