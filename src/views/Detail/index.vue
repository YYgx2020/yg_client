<template>
  <div id="detail">
    <Header></Header>
    <main>
      <div class="main_area">
        <article class="article">
          <div class="article_main">
            <div class="article_title">
              <h1>{{articleData.title}}</h1>
            </div>
            <div class="article_info_panel">
              <div class="author_avatar">
                <img :src="articleData.authorAvatar" alt="">
              </div>
              <div class="author_info_box">
                <div class="author_name">
                  <span class="name">{{articleData.author}}</span>
                  <span class="copyright">原创</span>
                </div>
                <div class="meta_box">
                  <span class="time">{{articleData.createTime}}</span>
                  <span class="read"> · 阅读 {{articleData.read}}</span>
                </div>
              </div>
            </div>
            <!-- 文章封面 -->
            <div v-if="articleData.cover" class="article_cover">
              <img :src="articleData.cover" alt="">
            </div>
            <!-- 正文 -->
            <MarkdownPreview id="preview" ref="preview" :initialValue="articleData.content"></MarkdownPreview>
            <!-- 文章分类和标签 -->
            <div class="tag_list_container">
              <div class="tag_item">
                <span class="tag_item_title">分类：</span>
                <span class="tag_item_label">{{articleData.category}}</span>
              </div>
              <div class="tag_item">
                <span class="tag_item_title">标签：</span>
                <span class="tag_item_list" v-for="(item, index) in articleData.tag" :key="index">{{item}}</span>
              </div>
              <!-- 移动端点赞按钮 -->
              <div class="mobile_dianzan_panel" :class="isClicked? 'choosed': ''" @click="updateDianzan">
                <span class="iconfont icon-dianzan_kuai"></span>
                <span>&nbsp;{{articleData.like}}</span>
              </div>
            </div>

          </div>
          <!-- 留言板 -->
          <div id="comment" class="comment_container">
            <div class="comment_title">
              <h1>写留言</h1>
            </div>
            <MsgInput height="64px" padding="1rem" :title="articleData.title" :id="articleData.id"></MsgInput>
            <div v-if="articleData.comment" class="selected_message_box">
              <!-- <div class="selected_message_box_title">
                精选留言
              </div> -->
              <HotMessage :articleID="articleData.id" style="margin-top: 0px; padding-left: 1rem; padding-right: 1rem;">
              </HotMessage>
            </div>
          </div>
        </article>
        <div class="catalog_container" id="catalog" ref="catalog">
          <div class="catalog_block">
            <nav class="article_catalog">
              <div class="catalog_title">
                目录
              </div>
              <div class="catalog_body">
                <div @click="catalogItemClick(item, index)" class="catalog_item" v-for="(item, index) in catalogList"
                  :key="item.id" :class="item.choosed? `active ${item.padding}`: `${item.padding}`">
                  <a :href="'#' + item.tag" class="catalog_aTag">{{item.text}}</a>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div class="article_suspended_panel">
          <div class="suspended_item" :class="isClicked? 'choosed': ''" @click="updateDianzan">
            <span class="icon iconfont icon-dianzan_kuai"></span>
            <span class="num" :class="isClicked? 'choosed_2': ''">{{articleData.like}}</span>
          </div>
          <div class="suspended_item" @click="toCommentHref">
            <span class="icon iconfont icon-liuyanfill"></span>
            <span class="num">{{articleData.comment}}</span>
            <!-- <span class="num">24</span> -->
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/common/Header';
import MsgInput from '@/components/common/MsgInput';
import HotMessage from '@/components/common/HotMessage/index.vue';
import { MarkdownPreview } from "vue-meditor";
import { getArticleInfo, updateArticle_2 } from "@/api";
export default {
  components: {
    Header,
    MarkdownPreview,
    MsgInput,
    HotMessage
  },
  name: 'Detail',
  data() {
    return {
      articleData: {},
      isClicked: false,
      catalogList: [],
      scrollHeigh: 0,
      down: true,
      h_list: ['h0', 'h1', 'h2', 'h3', 'h4'],  // 目录只显示到 h4
    }
  },
  created() {
    // 先更新文章阅读量，然后再获取文章数据

    this.getArticleInfo()

  },
  mounted() {
    // 检测页面滚动的距离
    // console.log(document.body.scrollTop);
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll, true)
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      let catalog = document.getElementById('catalog');
      // 如果找不到当前的 dom 结构，则退出，不执行下面的代码
      if (!catalog) return
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      console.log(scrollTop)
      // console.log(this.down);
      if (this.down && scrollTop > 60) {
        // console.log(this.$refs);
        // this.$refs.catalog.style.position = 'fixed';
        catalog.style.position = 'fixed';
        // this.$refs.catalog.style.marginTop = '-60px';
        catalog.style.marginTop = '-60px';
        this.down = false;
      }
      if (!this.down && scrollTop < 60) {
        // console.log(this.$refs);
        // this.$refs.catalog.style.position = 'absolute';
        catalog.style.position = 'absolute';
        // this.$refs.catalog.style.marginTop = '0px';
        catalog.style.marginTop = '0px';
        this.down = true;
      }

      // 更改目录样式
      let index = 0;
      for (let i = 0; i < this.catalogList.length; i++) {
        // if (i == 0) continue;
        if (scrollTop + 1 < this.catalogList[i].offsetTop) {
          index = i - 1;
          break;
        }
      }
      console.log('index: ', index);
      if (index == -1) index = 0;
      if (scrollTop + 1 > this.catalogList[this.catalogList.length - 1].offsetTop) {
        index = this.catalogList.length - 1
      }
      this.catalogList = this.catalogList.map((itm, ind) => {
        if (ind == index) {
          itm.choosed = true;
        } else {
          itm.choosed = false;
        }
        return itm;
      })
    },

    // 时间戳处理函数
    timestampToTime(timestamp) {
      let date = new Date(timestamp * 1);  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m;
    },
    getArticleInfo() {
      let id = this.$route.params.id;
      getArticleInfo({ id }).then(res => {
        console.log(res);
        if (!res.data.res) {
          console.log('tiaozhaudn ');
          // 跳转到 404 页面
          this.$router.push({
            name: 'NotFound'
          })
        } else {
          this.articleData = res.data.res;
          this.articleData.createTime = this.timestampToTime(this.articleData.createTime);
          // 获取文章标题，然后修改页面的标题
          document.title = this.articleData.title;
          // 更新阅读量数据
          let read = this.articleData.read;
          console.log('阅读量+1');
          let data = { id, read }
          this.updateArticle_2(data)
          this.$nextTick(() => {
            console.log(this.$refs);
            let preview = document.getElementById('preview')

            console.log("preview: ", preview.childNodes[0].childNodes);
            let childNodes = preview.childNodes[0].childNodes;
            // let catalogList = [];
            let count = 0;
            childNodes.forEach((item, index) => {
              console.log(this.h_list.indexOf(item.localName));
              if (this.h_list.indexOf(item.localName) !== -1) {
                let data = {
                  tag: item.id,
                  id: count++,
                  text: item.innerText,
                  z_index: this.h_list.indexOf(item.localName),
                  padding: 'padding_' + this.h_list.indexOf(item.localName),
                  choosed: index == 0 ? true : false,
                  offsetTop: item.offsetTop,
                }
                this.catalogList.push(data);
              }
            })
            console.log(this.catalogList);
          })
        }

      }).catch(err => {
        console.log(err);
      })
    },
    updateArticle_2(data) {
      let { id, read, like } = data
      console.log(id, read, like);
      let updateData = { id }
      // read++
      console.log('read: ', read);
      console.log('like: ', like);
      read++
      Object.assign(updateData, { read })
      like && Object.assign(updateData, { like })
      updateArticle_2(updateData).then(res => {
        console.log(res);
        read && this.articleData.read++
      }).catch(err => {
        console.log(err);
      })
    },

    // 更新点赞数据
    updateDianzan() {
      // 没有点赞
      let id = this.articleData.id;
      let like = 0;
      if (!this.isClicked) {
        like = ++this.articleData.like;
        this.isClicked = true;
      } else {
        like = --this.articleData.like;
        this.isClicked = false;
      }
      let data = { id, like }
      this.updateArticle_2(data)
    },

    // 锚点定位
    toCommentHref() {
      window.location.href = '#comment';
    },

    // 目录点击事件 
    catalogItemClick(item, index) {
      this.$nextTick(() => {
        this.catalogList = this.catalogList.map((itm, ind) => {
          if (ind === index) {
            itm.choosed = true;
          } else {
            itm.choosed = false;
          }
          return itm;
        })
      })
    },
  },

  /* 
    未解决的 bug：
    1. 目录滚动条无法跟随页面移动
      参考：
      1. https://www.php.cn/js-tutorial-404002.html
    2. 目录滚动条样式不太好看，后期待修改
  */
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/detail.less');
</style>