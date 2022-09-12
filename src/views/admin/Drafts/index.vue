<template>
  <div id="drafts">
    <ul class="drafts_ul">
      <!-- v-if="showSkeleton" -->
      <li class="drafts_item skeleton" v-if="showSkeleton">
        <el-skeleton :rows="3" animated />
      </li>
      <li v-if="draftList.length === 0 && !showSkeleton" class="no_data">
        <span>暂无新的草稿文案</span>
      </li>
      <li class="drafts_item" v-for="(item, index) in draftList" :key="index">
        <div class="drafts_main">
          <span href="" class="title" @click="toDraftPage(item.createTime)">{{ item.title }}</span>
          <div class="info_box">
            <div class="date">{{ item._createTime }}</div>
            <div class="more_item" @click.stop>
              <i class="more iconfont icon-gengduo" @click="moreClick($event, index)"></i>
              <ul class="tag_2" v-if="index === current">
                <li class="more_list_item" @click="editPosts(item)">编辑</li>
                <li class="more_list_item" @click="deletePosts(item)">删除</li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDraftList, deleteDraft, deleteImg } from '@/api';
export default {
  data() {
    return {
      index: 0,
      current: '',
      draftList: [],
      showSkeleton: true,
    }
  },
  created() {
    // 获取草稿文章
    this.getDraftList()
  },
  mounted() {
    document.addEventListener("click", this.bodyCloseMenus);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bodyCloseMenus);
  },
  methods: {
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
    getDraftList() {
      let data = {
        offset: 0,
        limit: 10,
      }
      getDraftList(data).then(res => {
        this.showSkeleton = false;
        // console.log(res);
        this.draftList = JSON.parse(JSON.stringify(res.data.res))
        this.draftList = this.draftList.map(item => {
          if (item.title === '') {
            item.title = '无标题'
          }
          item._createTime = this.timestampToTime(item.createTime)
          return item;
        })

      }).catch(err => {
        // console.log(err);
        this.$message.error('获取失败')
        this.showSkeleton = false;
      })
    },

    toDraftPage(createTime) {
      console.log('1');
      this.$router.push({
        name: 'editor',
        query: {
          new_draft: createTime * 1
        }
      })
    },

    moreClick($event, index) {
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
      // console.log('跳转到编辑器界面，并传递文章的id', item);
      this.toDraftPage(item.createTime);
    },

    // 删除文章按钮
    deletePosts(item) {
      console.log('item: ', item);
      console.log('删除文章');
      deleteDraft({ id: item.id }).then(res => {
        // console.log('删除成功');
        if (item.cover) {
          const fileName = item.cover.split("img/")[1];
          deleteImg({ fileName }).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
        }
        this.getDraftList()
      }).catch(err => {
        // console.log(err);
        this.$message.error('删除失败')
        // 删除后重新获取数据
        this.getDraftList()
      })
    },
  }
}
</script>

<style lang="less" scoped>
li {
  list-style: none;
}

#drafts {
  .drafts_ul {
    .skeleton {
      padding-bottom: 2rem !important;
    }

    .no_data {
      margin-top: 2rem;
      text-align: center;
      padding-bottom: 2rem;
      font-size: 16px;
      color: #8a919f;
    }

    .drafts_item {
      padding: 2rem 2.5rem 0;

      // margin-bottom: 2rem;
      .drafts_main {
        border-bottom: 1px solid #e5e6eb;
        padding-bottom: 1.6rem;

        .title {
          line-height: 2rem;
          font-size: 1.33334rem;
          font-weight: 700;
          cursor: pointer;
        }

        .title:hover {
          color: #1e80ff;
        }

        .info_box {
          position: relative;
          display: flex;
          margin: .3rem 0;
          padding: .8333rem 0;

          .date {
            font-size: 1.2rem;
            color: #86909c;
            cursor: default;
            margin-right: 2rem;
          }

          .more_item {
            position: relative;

            .more {
              z-index: 100;
              color: #86909c;
              font-weight: 700;
              cursor: pointer;
            }

            .more:hover {
              border-radius: 2px;
              background-color: #e5e6eb;
            }

            .tag_2 {
              display: inline-block;
              position: absolute;
              top: 100%;
              left: -100%;
              padding: 2px 0;
              margin-top: 4px;
              background: #fff;
              border: 1px solid #e5e6eb;
              box-shadow: 0 4px 10px rgb(0 0 0 / 10%);
              border-radius: 4px;
              z-index: 10;

              .more_list_item {
                box-sizing: border-box;
                font-size: 12px;
                line-height: 32px;
                color: #4e5969;
                padding: 0 12px;
                min-width: 48px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
              }

              .more_list_item:hover {
                background-color: #fafafa;
              }
            }
          }
        }
      }
    }
  }
}
</style>