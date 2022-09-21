<template>
  <div id="hot_message_box" ref="Hot">
    <div class="title">
      <span>精选</span><span>留言</span>
    </div>
    <ul class="hot_messsage_ul">
      <el-skeleton :rows="6" animated v-if="showSkeleton" />
      <li v-if="hotMessageList.length === 0 && !showSkeleton" class="no_data">
        <span>暂无新的留言消息</span>
      </li>
      <li class="message_item" v-for="(item, index) in hotMessageList" :key="item.id">
        <div class="web_info_container">
          <div class="basic_info">
            <div class="web_avator">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="other_info">
              <span class="web_pet_name">{{ item.nickName }}</span>
              <span class="web_email">{{ item.email }}</span>
            </div>
            <div class="date">
              {{ item.sendTime }}
            </div>
          </div>
          <div class="content_box">
            <div v-html="item.content"></div>
          </div>
          <div class="like_row">
            <span :style="!item.likeClick? '': 'color: #1e80ff;'" @click="dianzanEvent(index, item)"><i
                class="iconfont icon-good"></i>&nbsp;{{item.like}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getMessage, updateMessage, } from '@/api';
import { timeago } from '@/utils/timeago';

export default {
  props: ['articleID',],
  data() {
    return {
      hotMessageList: [],
      showSkeleton: true,
    }
  },

  created() {
    this.getMessageData()
  },

  methods: {
    // 获取精选消息
    getMessageData() {
      let data = {
        offset: 0,  // 分页
        limit: 10,  // 获取的实例个数
        isSelected: 1,  // 获取那些被精选的留言
      }
      this.articleID && Object.assign(data, { articleId: this.articleID * 1 })
      getMessage(data).then(res => {
        this.showSkeleton = false;
        console.log("精选留言数据：", res);
        let data = res.data.result;

        // 数据预处理
        data = data.map(item => {
          let email = item.email;
          item.email = email.slice(0, 4) + '**********' + email.slice(email.length - 6, email.length)
          item.sendTime = timeago(item.sendTime);
          item.likeClick = false;  // 标志是否已经点赞过
          return item;
        })

        this.hotMessageList = data;
      }).catch(err => {
        console.log(err);
        this.$message.error('留言消息获取失败')
        this.showSkeleton = false;
      })
    },

    // 点赞事件
    dianzanEvent(index, item) {
      // 如果已经点赞，则取消点赞
      let like = item.like;
      if (item.likeClick) {
        like--
        item.likeClick = false
        console.log(1);
        console.log(this.$refs.dianzan);
      } else {
        like++
        item.likeClick = true
        console.log(2);
      }

      // 更新数据
      // 先更新数据库中的数据再更新当前页面的 data
      let id = item.id;
      let isSelected = item.isSelected;
      updateMessage({ id, isSelected, like }).then(res => {
        console.log(res);
        this.hotMessageList[index].like = like;
      }).catch(err => {
        console.log(err);
        this.$message.error("数据更新失败")
      })
    },
  },
}
</script>

<style lang="less" scoped>
#hot_message_box {
  border-radius: 4px;
  padding: 2rem;
  background-color: #fff;
  margin-top: 2rem;

  .title {
    color: #252933;
    font-size: 1.5rem;

    span:first-child {
      font-family: "皇室战争 Bold";
      color: #1e80ff;
    }
  }

  .hot_messsage_ul {
    padding: 1rem 0px;

    .no_data {
      text-align: center;
      padding-bottom: 2rem;
      font-size: 16px;
      color: #8a919f;
      list-style: none;
    }

    .message_item {
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      // border-bottom: 1px solid #e5e6eb;
      .source_label {
        font-size: 1.166667rem;
        width: auto;
        line-height: 22px;
        margin-bottom: 10px;

        a:hover {
          color: #1e80ff;
          cursor: pointer;
        }
      }

      .web_info_container {

        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        .basic_info {
          position: relative;
          display: flex;
          margin-bottom: 10px;

          .web_avator {
            width: 3.333333rem;
            height: 3.333333rem;

            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }

          .other_info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: .833333rem;

            .web_pet_name {
              font-size: 16px;
            }

            .web_email {
              // padding: 0px .833333rem;
              font-size: 1.166667rem;
              color: #8a919f;
            }

            // align-items: center;
          }

          .date {
            position: absolute;
            right: 0px;
            line-height: 3.5rem;
            color: #8a919f;
            font-size: 1.2rem;
            text-align: center;
          }
        }

        .content_box {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
          font-size: 14px;
          color: #515767;
          line-height: 2rem;
          margin-bottom: 1.666667rem;
          padding-left: 50px;
        }

        .like_row {
          margin-left: 50px;
          color: #8a919f;

          // box-sizing: border-box;
          span {
            cursor: pointer;
            padding-left: 4px;
          }

          span:hover {
            color: #1e80ff;
          }
        }
      }

      .btn_list {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 2rem;

        .btn_list_item {
          margin-left: 2rem;

          button {
            cursor: pointer;
            width: 6rem;
            line-height: 2.6rem;
            border-radius: 4px;
            color: #fff;
            font-size: 1.23333rem;
            // padding: 1rem 1.5rem;
            background-color: #1e80ff;
          }

          button:hover {
            opacity: .8;
          }

        }

        .btn_list_item_choose {
          margin-left: 2rem;

          button {
            // cursor: not-allowed;
            cursor: pointer;
            width: 6rem;
            line-height: 2.6rem;
            border-radius: 4px;
            color: #fff;
            font-size: 1.23333rem;
            // padding: 1rem 1.5rem;
            background-color: #e60012;
            // opacity: .6;
          }

          button:hover {
            opacity: .8;
          }
        }

        .btn_list_item:first-child {
          button {
            color: #333;
            background-color: #f2f3f5 !important;
          }
        }
      }
    }
  }
}
</style>