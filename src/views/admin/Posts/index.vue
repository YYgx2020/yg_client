<template>
  <div id="posts">
    <div class="list">
      <li class="list_item skeleton" v-if="showSkeleton">
        <el-skeleton :rows="4" animated />
      </li>
      <!-- , 2, 3, 4, 5, 6, 7, 8 -->
      <li @click="toDetailPage(item.id)" class="list_item" v-for="(item, index) in articleList" :key="index">
        <div class="meta_container">
          <span class="date">{{item.createTime}}</span>
          <!-- <a href=""></a> -->
          <!-- <router-link to=""></router-link> -->
          <span class="tag_link">{{item.category}}</span>
        </div>
        <div class="content_wrapper">
          <div class="content_main">
            <div class="title_row">
              <span class="title">{{item.title}}</span>
            </div>
            <div class="abstract">
              <div>
                {{item.abstract}}
              </div>
            </div>
            <ul class="action_list">
              <li class="item">
                <i class="iconfont icon-ico_yueduliang"></i>
                <span>{{item.read}}</span>
              </li>
              <li class="item">
                <i class="iconfont icon-good"></i>
                <span>{{item.like}}</span>
              </li>
              <li class="item">
                <i class="iconfont icon-pinglun"></i>
                <span>{{item.comment}}</span>
              </li>
              <!-- 阻止冒泡，关闭弹窗 -->
              <li class="item" @click.stop>
                <i class="more iconfont icon-gengduo" @click="moreClick($event, index)"></i>
                <!-- <div class="bgc" @click.stop>
                  
                </div> -->
                <ul class="tag_2" v-if="index === current">
                  <li v-if="isShowEdit" class="more_list_item" @click="editPosts(item)">编辑</li>
                  <li class="more_list_item" @click="deletePosts(item)">删除</li>
                </ul>
              </li>

            </ul>
          </div>
          <img v-if="item.cover" class="cover" :src="item.cover" alt="" />
        </div>
      </li>
    </div>
  </div>
</template>

<script>
import { getArticleList, deleteArticle, deleteImg } from '@/api';
import { timeago } from '@/utils/timeago';
export default {
  data() {
    return {
      current: '',
      index: 0,
      showMore: false,
      articleList: [],
      showSkeleton: true,
      isShowEdit: true,
    }
  },
  created() {
    // 获取文章列表
    this.getArticleList()
    this.$nextTick(() => {
      // if ()
      console.log('屏幕宽度为：', screen.width);
      if (screen.width < 840) {
        this.isShowEdit = false;
      }
    })
  },
  mounted() {
    document.addEventListener("click", this.bodyCloseMenus);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bodyCloseMenus);
  },
  methods: {
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
    moreClick(event, index) {
      if (this.index === this.current) {
        this.current = ''
        return
      }
      // console.log('event:', event.currentTarget.dataset.current);
      console.log('index:', index);
      // this.showMore = !this.showMore
      this.index = this.current = index
    },
    bodyCloseMenus(e) {
      let self = this;
      if (self.index === self.current) {
        // console.log("13");
        self.current = ''
        return
      }
    },

    // 编辑文章按钮
    editPosts(item) {
      console.log('跳转到编辑器界面，并传递文章的id', item);
      this.$router.push({
        name: 'editor',
        query: {
          id: item.id,
        }
      })
    },

    // 删除文章按钮
    deletePosts(item) {
      console.log('item: ', item);
      console.log('删除文章');
      // deleteArticle()
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求删除文章
        let data = {
          id: item.id,
        }
        deleteArticle(data).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取数据
          this.getArticleList()
          
        }).catch(err => {
          this.$message.error('文章删除失败!')
        })
        // 删除文章封面
        if (item.cover) {
          const fileName = item.cover.split("img/")[1];
          deleteImg({fileName}).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    toDetailPage(id) {
      // 跳转到文章详情列表
      this.$router.push(`/detail/${id}`)
    },
  }
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/posts.less');
</style>