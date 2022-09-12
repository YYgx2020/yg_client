<template>
  <div id="message_box">
    <ul class="choose_ul">
      <li class="choose_item">
        <button :class="choose ? 'choose' : ''" @click="chooseBtn()">最新</button>
      </li>
      <li class="choose_item">
        <button :class="!choose ? 'choose' : ''" @click="chooseBtn()">精选</button>
      </li>
    </ul>
    <div v-if="choose">
      <ul class="message_box_ul">
        <el-skeleton :rows="6" animated v-if="showSkeleton_1" />
        <li v-if="messageData.length === 0 && !showSkeleton_1" class="no_data">
          <span>暂无新的留言消息</span>
        </li>
        <!-- 切换的时候更新数据 -->
        <li class="message_item" v-for="(item, index) in messageData" :key="item.id">
          <div class="source_label">
            来自&nbsp;<span @click="toArticlePage(item.articleId)">{{ item.origin }}</span>
          </div>
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
              <!-- Angular其实是一个很有意思的框架，只不过相对来说上手难度大一点，而且不适合中国企业家们的短平快的"优良"做事风格，再加上在国内各种Google不流畅的网络体验，所以在国内知名度就不行了。另外，让人不甚唏嘘的是，当年也是Angular最先支持TypeScript和RxJS，结果过了几年TypseScript和RxJS火了，反而Angular却越来越少人讨论了，也是可惜Angular其实是一个很有意思的框架，只不过相对来说上手难度大一点，而且不适合中国企业家们的短平快的"优良"做事风格，再加上在国内各种Google不流畅的网络体验，所以在国内知名度就不行了。另外，让人不甚唏嘘的是，当年也是Angular最先支持TypeScript和RxJS，结果过了几年TypseScript和RxJS火了，反而Angular却越来越少人讨论了，也是可惜。 -->
            </div>
          </div>
          <ul class="btn_list" v-if="choose">
            <li class="btn_list_item">
              <button @click="deleteMessage(item.id, index)">不精选</button>
            </li>
            <li class="btn_list_item">
              <button @click="selectedMessage(item, index)">精选</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 以下是已经精选的数据 -->
    <div v-if="!choose">
      <ul class="message_box_ul">
        <el-skeleton :rows="6" animated v-if="showSkeleton_2" />
        <li v-if="selectedData.length === 0 && !showSkeleton_2" class="no_data">
          <span>暂无新的留言消息</span>
        </li>
        <!-- 切换的时候更新数据 -->
        <li class="message_item" v-for="(item, index) in selectedData" :key="item.id">
          <div class="source_label">
            来自&nbsp;<span @click="toArticlePage(item.articleId)">{{ item.origin }}</span>
          </div>
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
              <!-- Angular其实是一个很有意思的框架，只不过相对来说上手难度大一点，而且不适合中国企业家们的短平快的"优良"做事风格，再加上在国内各种Google不流畅的网络体验，所以在国内知名度就不行了。另外，让人不甚唏嘘的是，当年也是Angular最先支持TypeScript和RxJS，结果过了几年TypseScript和RxJS火了，反而Angular却越来越少人讨论了，也是可惜Angular其实是一个很有意思的框架，只不过相对来说上手难度大一点，而且不适合中国企业家们的短平快的"优良"做事风格，再加上在国内各种Google不流畅的网络体验，所以在国内知名度就不行了。另外，让人不甚唏嘘的是，当年也是Angular最先支持TypeScript和RxJS，结果过了几年TypseScript和RxJS火了，反而Angular却越来越少人讨论了，也是可惜。 -->
            </div>
          </div>
          <ul class="btn_list">
            <li class="btn_list_item_choose">
              <button @click="deleteMessage(item, index)">删除</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getMessage, updateMessage, deleteMessage, updateComment } from '@/api';
import { timeago } from '@/utils/timeago';
export default {
  data() {
    return {
      choose: true,
      messageData: [],
      selectedData: [],
      showSkeleton_1: true,
      showSkeleton_2: true,
    }
  },
  computed: {
    changeEmail(email) {
      console.log(email);
      return email.slice(0, 4) + '**********' + email.slice(email.length - 4, email.length)
    },
  },
  created() {
    // 先看 store 里面有没有数据，如果没有再发送请求去获取
    // 如果有则直接从 store 里面取，以减少页面内切换时的请求次数，减轻服务器压力
    // let messageData = [];

    // if ()
    // 获取留言数据
    this.$nextTick(() => {
      this.getMessageData()
    })
  },
  methods: {
    // 获取数据
    getMessageData() {
      // if (this.$store.state.messageData.length) {
      //   this.messageData = this.$store.state.messageData;
      //   this.showSkeleton_1 = false;
      // } else {

      // }
      let data = {
        offset: 0,  // 分页
        limit: 10,  // 获取的实例个数
        isSelected: 0,  // 获取那些没有被精选的留言
      }
      getMessage(data).then(res => {
        this.showSkeleton_1 = false;
        console.log(res);
        let data = res.data.result;
        // this.messageData = res.data.result;

        // 数据预处理
        data = data.map(item => {
          let email = item.email;
          item.email = email.slice(0, 4) + '**********' + email.slice(email.length - 6, email.length)
          item.sendTime = timeago(item.sendTime);
          return item;
        })

        // 存到 store 中
        this.$store.commit('setMessageData', data);
        this.messageData = data;
      }).catch(err => {
        console.log(err);
        // 出错处理
        this.$message.error("数据获取失败")
        this.showSkeleton_1 = false;
      })
    },
    chooseBtn() {
      console.log(this.choose);
      this.choose = !this.choose
      if (!this.choose) {
        // 获取精选的数据
        let data = {
          offset: 0,  // 分页
          limit: 10,  // 获取的实例个数
          isSelected: 1,  // 获取那些没有被精选的留言
        }
        getMessage(data).then(res => {
          console.log(res);
          let data = res.data.result;
          // this.selectedData = res.data.result;
          this.showSkeleton_2 = false;

          // 数据预处理
          data = data.map(item => {
            let email = item.email;
            item.email = email.slice(0, 4) + '**********' + email.slice(email.length - 6, email.length)
            item.sendTime = timeago(item.sendTime);
            return item;
          })

          // 存到 store 中
          // this.$store.commit('setMessageData', data);
          this.selectedData = data;
        }).catch(err => {
          console.log(err);
          // 出错处理
          this.$message.error("数据获取失败")
          this.showSkeleton_2 = false;
        })
      } else {
        this.showSkeleton_1 = false;
      }
    },

    // 删除留言，不精选
    deleteMessage(item, index) {
      let _this = this;
      let id = item.id
      // 获取当前留言的编号
      console.log('当前留言编号：', id);
      deleteMessage({ id }).then(res => {
        console.log(res);
        if (_this.choose) {
          _this.messageData.splice(index, 1)
          _this.$store.commit('setMessageData', _this.messageData);
          // 如果当前留言消息是从文章来的，则更新文章的评论数目
          if (item.articleId) {
            let data = {
              id: item.articleId,
              sign: 'subtract',
            }
            updateComment(data).then(res => {
              console.log('文章评论信息更新成功：', res);
            }).catch(err => {
              console.log(err);
            })
          }
        } else {
          _this.selectedData.splice(index, 1)
        }
      })
    },
    // 精选留言
    selectedMessage(item, index) {
      let _this = this
      let id = item.id
      console.log('当前留言编号：', id);
      updateMessage({ id, isSelected: 1, like: 0, }).then(res => {
        console.log(res);
        // 更新成功之后把当前数据项删掉
        _this.messageData.splice(index, 1)
        _this.$store.commit('setMessageData', _this.messageData);
        // 如果当前留言消息是从文章来的，则更新文章的评论数目
        if (item.articleId) {
          let data = {
            id: item.articleId,
            sign: 'add',
          }
          updateComment(data).then(res => {
            console.log('文章评论信息更新成功：', res);
          }).catch(err => {
            console.log(err);
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },

    // 跳转到文章详情页面
    toArticlePage(id) {
      // console.log('125675');
      // console.log('id:', id);
      if (id) {
        this.$router.push(`/detail/${id}`)
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/messageBox.less');
</style>