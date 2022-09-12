<template>
  <div class="msg_board_container">
    <Header></Header>
    <main>
      <div class="title">
        <span>留言板</span>
      </div>
      <!-- @click.self="clickOutside" -->
      <MsgInput height="192px" padding="2rem"></MsgInput>
      <!-- 精选留言展示 -->
      <HotMessage></HotMessage>
    </main>
  </div>
</template>

<script>
import Header from '@/components/common/Header'
import MsgInput from '@/components/common/MsgInput';
import {getMessage} from "@/api";
import HotMessage from '@/components/common/HotMessage/index.vue';

export default {
  components: {
    Header,
    MsgInput,
    HotMessage
},
  data() {
    return {

    }
  },

  mounted() {
    // 创建 click 监听
    document.addEventListener('click', this.emojiHide)
  },

  beforeDestroy() {
    // 清除 click 监听
    document.removeEventListener('click', this.emojiHide)
  },
  methods: {


    // 展示留言，查看效果
    showMessage() {
      // console.log(this.formData.content);
      // let msgList = document.getElementById('message_list')
      // let div = document.createElement('div')
      // div.appendChild(this.formData.content)
      // msgList.appendChild(div)
      // 获取留言
      let data = {
        offset: 0,  // 分页
        limit: 10,  // 获取的实例个数
        isSelected: 0,  // 获取那些已经被精选的留言
      }
      getMessage(data).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
  }
}
</script>

<style lang="less" scoped>
.msg_board_container {
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 840px) {
    main {
      width: 100% !important;
    }
  }

  main {
    width: 700px;

    .title {
      border-radius: 4px 4px 0 0;
      padding: 2rem 2rem 0rem 2rem;
      font-family: "皇室战争 Bold";
      font-size: 2.5rem;
      background-color: #fff;
      margin-top: 2rem;
    }
  }

}
</style>