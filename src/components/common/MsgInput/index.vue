<template>
  <div id="message_box" ref="messageBox">
    <!-- 留言内容输入框 -->
    <div class="info">
      <div class="nick_name_input info_item">
        <input :value="formData.nickName" @blur="getNickName" id="nick_name_input" type="text" placeholder="您的昵称"
          maxlength="16">
      </div>
      <!-- <span class="important">*</span> -->
      <div class="email_input info_item">
        <span class="important">*</span>
        <input :value="formData.email" @blur="getEmail" id="email_name_input" type="text" placeholder="您的邮箱地址"
          maxlength="64">
      </div>
    </div>
    <div id="content" ref="content" @focus="getFocus" @blur="getContentText" contenteditable="true">
    </div>
    <div class="action_box" ref="actionBox" v-if="actionBox">

      <!-- @click="showEmojiPop" -->
      <div class="emoji_box" id="emoji_box" ref="emojiBox">
        <i class="iconfont icon-biaoqing"></i>
        <span>表情</span>
      </div>
      <div class="emoji_pop_box" ref="emojiPopBox" v-if="showEmojiPicker">
        <div class="emojipicker">
          <p>全部</p>
          <div class="list">
            <div class="item" v-for="(item, index) in emojiList" :key="index">
              <img @click="addEmoji(index)" class="image" type="gif"
                :src="'http://127.0.0.1:6001/emoji/' + (index + 1) + '.gif'" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="submit_button" ref="submitButton">
        <button @click="submitBtn">{{ sending ? '发送中...' : '留言' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessage } from '@/api';
import { Notification } from "element-ui";
export default {
  name: 'MsgInput',
  props: ['height', 'padding', 'title', 'id'],
  data() {
    return {
      formData: {
        nickName: '',
        email: '',
        content: '',
      },
      emojiList: new Array(35).fill('2'),
      value: '',
      pos: '',
      showEmojiPicker: false,
      actionBox: false,
      emojiOffset: 0,
      sending: false,
    }
  },

  created() {
    console.log(this.height);
    console.log(this.padding);
    // console.log("ref: ", this.$refs);
    this.$nextTick(() => {
      let content = this.$refs.content;
      let messageBox = this.$refs.messageBox;
      content.style.minHeight = this.height;
      messageBox.style.padding = this.padding;
    })
  },

  methods: {
    // 获取昵称
    getNickName(e) {
      console.log(e.target.value);
      this.formData.nickName = e.target.value;
    },
    getEmail(e) {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(e.target.value) && e.target.value !== '') {
        // Notification({
        //   title: '错误',
        //   message: '请输入正确格式的邮箱地址',
        //   type: 'error'
        // })
        this.$message({
          message: '请输入正确格式的邮箱地址',
          type: 'warning'
        })
        this.formData.email = ''
        return
      } else {
        this.formData.email = e.target.value;
      }
    },

    // 获得焦点
    getFocus() {
      this.actionBox = true;
      this.$refs.content.className = 'active';
      // this.showEmojiPicker = false
      // console.log(this.showEmojiPicker);
    },

    // 失去焦点时获取
    getContentText(e) {
      // console.log(e.target);
      this.pos = window.getSelection().getRangeAt(0);
      // console.log(this.pos);
      let content = this.$refs.content;
      if (content.innerHTML) {
        this.formData.content = content.innerHTML;
      }
      // 没有表情包
      else {
        this.actionBox = false;
        content.className = '';
      }
    },

    // 控制表情弹窗的显示与隐藏
    emojiHide(e) {
      console.log(e.target);
      // 控制输入框的样式
      if (this.$refs.content.innerHTML === '' && this.$refs.emojiBox.contains(e.target)) {
        console.log(1);
        this.showEmojiPop();
        this.actionBox = true;
        // content.className = 'active';
      } else if (this.$refs.content.innerHTML === '' && !this.$refs.content.contains(e.target)) {
        console.log(1.2);
        this.actionBox = false;
        content.className = '';
      }
      else if (this.$refs.emojiBox !== undefined && this.$refs.emojiBox.contains(e.target)) {
        console.log(2);
        this.showEmojiPop();
        this.actionBox = true;
      }
      else if (this.$refs.emojiPopBox !== undefined && !this.$refs.emojiPopBox.contains(e.target)) {
        console.log(3);
        this.showEmojiPicker = false;
        this.$refs.emojiBox.style = '';
      }
    },

    // 展示表情框
    showEmojiPop() {
      let emoji_box = document.getElementById('emoji_box')
      if (this.showEmojiPicker) {
        emoji_box.style.color = "#515767"
      } else {
        emoji_box.style.color = "#409eff"
      }
      this.showEmojiPicker = !this.showEmojiPicker;
      console.log(this.showEmojiPicker);

    },

    // 插入表情
    addEmoji(index) {
      // console.log("查看选区", window.getSelection().getRangeAt(0));
      // console.log('未改变之前：', this.pos);
      // console.log('改变之后：', window.getSelection().getRangeAt(0));
      this.showEmojiPicker = true;
      // 添加自定义表情
      let content = this.$refs.content;
      let img = document.createElement('img');
      img.style.width = '22px';
      img.style.height = '22px';
      img.style.verticalAlign = 'sub';
      img.style.marginLeft = '2px';
      img.style.marginRight = '2px';
      img.type = 'gif';
      img.src = `http://127.0.0.1:6001/emoji/${index + 1}.gif`;
      img.style.cursor = 'default'
      content.className = 'active';
      let endOffset = this.pos.endOffset;
      let nodeName = this.pos.endContainer.nodeName;

      let container = this.pos.endContainer;
      if (nodeName === '#text') {
        container = this.pos.endContainer.parentNode
      }
      this.pos.insertNode(img)

      this.$nextTick(() => {
        console.log('next');
        let s = window.getSelection()
        console.log('container: ', container);
        console.log('endOffset: ', endOffset);
        if (nodeName !== '#text') {

          s.extend(container, endOffset++)
          s.collapse(container, endOffset)
        } else {
          s.extend(container, endOffset++)
          s.collapse(container, endOffset)
        }
      })
    },

    // 提交留言内容和信息到数据库
    submitBtn() {
      // if (this.formData.content)
      console.log(this.formData);
      if (!this.formData.email) {
        Notification({
          title: '提示',
          message: '请输入一个邮箱地址',
          type: 'warning',
        })
        return
      }
      if (!this.formData.nickName) {
        this.formData.nickName = '匿名网友';
      }
      this.$refs.submitButton.style.opacity = '0.6'
      this.sending = true
      if (this.title) {
        this.formData.origin = '文章-' + this.title;
        this.formData.articleId = this.id * 1;
      } else {
        this.formData.origin = '留言板';
        this.formData.origin = 0;
      }
      sendMessage(this.formData).then(res => {
        this.sending = false;
        console.log(res);
        this.$alert(
          '您的留言消息已成功发送至本站点，待溢狗审核通过之后即可展示在下方的精选留言中',
          '消息提示',
          {
            confirmButtonText: '确定',
            callback: action => {
              // this.$message({
              //   type: 'info',
              //   message: `action: ${action}`
              // });
              this.$refs.submitButton.style.opacity = '1'
              // this.formData = {
              //   nickName: '',
              //   email: '',
              //   content: '',
              // }
              // 清空输入框内容
              // this.$refs.content.innerHTML = '';
              // this.$refs.content.className = '';
              // 不清空输入框内容
            }
          });
      }).catch(err => {
        console.log(err);
      })

    },
  }
}
</script>

<style lang="less" scoped>

#message_box {
  // margin-top: 2rem;
  // padding: 2rem;
  background-color: #fff;
  border-radius: 0px 0px 4px 4px;

  .info {
    line-height: 4rem;
    margin-bottom: 1rem;
    // padding-right: 2rem;
    display: flex;

    // #nick_name_input[type=text] {
    //   padding: .8rem 1rem;
    //   outline: none;
    //   margin-right: 2rem;
    //   font-size: 14px;
    //   border: 0;
    //   border-radius: 4px;
    //   background-color: #f2f3f5;
    //   position: relative;
    //   width: 8rem;
    // }

    .email_input {
      position: relative;
      flex-grow: 1;
      width: 15rem;
      margin-right: 0px;

      span {
        position: absolute;
        color: red;
        left: -9px;
        top: -9px;
        font-size: 1.4rem;
      }

      #email_name_input {
        width: -webkit-fill-available;
        margin-right: 0px;
      }
    }

    input[type=text] {
      padding: .8rem 1rem;
      outline: none;
      margin-right: 2rem;
      font-size: 14px;
      border: 0;
      border-radius: 4px;
      background-color: #f2f3f5;
      position: relative;
      width: 8rem;
    }

    .important {
      position: absolute;
      color: red;
      left: 0px;
      // width: 20px;
      // height: 20px;
      // background-color: rgb(40, 37, 37);
    }

    // #email_name_input::after {
    //   position: absolute;
    //   content: "";
    //   color: red;
    //   left: 0px;
    //   width: 20px;
    //   height: 20px;
    //   background-color: rgb(40, 37, 37);
    // }

    input[type=text]:focus {
      background-color: #ffffff;
      outline: 1px solid #409eff;
    }

    // input[type=text]:first-child {
    //   width: 8rem;
    // }

    // input[type=text]:last-child {
    //   flex-grow: 1;
    //   width: 15rem;
    //   margin-right: 0px;
    // }

    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #8a919f;
    }

    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #8a919f;
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #8a919f;
    }

    input:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #8a919f;
    }

  }

  .noactive {}

  .noactive:empty::before {
    content: "来都来了，留下你想说的话再走吧 ^_^";
    color: #8a919f;
    // background-color: #f2f3f5;
  }

  .active {
    background-color: #ffffff !important;
    outline: 1px solid #409eff !important;
  }

  .active:empty::before {
    // content: "来都来了，留下你想说的话再走吧 ^_^";
    // color: #8a919f;
  }

  .active:focus::before {
    content: '';
  }

  #content {
    padding: 8px 12px;
    border-radius: 4px;
    min-height: 192px;
    font-size: 14px;
    color: #252933;
    background-color: #f2f3f5;
    line-height: 22px;
    outline: none;
    resize: both;
    box-sizing: border-box;

    img {
      margin-top: 10rpx;
      line-height: 22px;
    }

    .emoji {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-image: url("https://unpkg.com/emoji-datasource-messenger@4.0.4/img/messenger/sheets-256/64.png");
      background-size: 5200%;
      background-position: 58.8235% 47.0588%;
    }

    .emoji2 {
      vertical-align: sub;
      cursor: default;
      height: 20px;
      margin: 0 2px;
    }
  }

  #content:empty::before {
    content: "来都来了，留下你想说的话再走吧 ^_^";
    color: #8a919f;
  }

  #content:focus::before {
    // content: "来都来了，留下你想说的话再走吧 ^_^";
    // color: #8a919f;
    // content: '';
  }

  #content:focus {
    background-color: #ffffff;
    outline: 1px solid #409eff;
  }

  .action_box {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    justify-content: flex-end;
    margin-top: 8px;
    // padding: 8px ;
    position: relative;

    .emoji_box {
      // display: flex;
      display: none;
      align-items: center;
      font-size: 13px;
      cursor: pointer;

      span {
        padding-left: 4px;
      }
    }

    .emoji_box:hover {
      color: #1e80ff !important;
    }

    // 表情选择弹窗
    .emoji_pop_box {
      position: absolute;
      width: 548px;
      top: 50%;
      margin-top: 30px;
      position: absolute;
      left: 0;
      background: #fff;
      box-shadow: 0 8px 24px rgb(0 0 0 / 16%);
      border-radius: 4px;

      p {
        font-size: 12px;
        line-height: 20px;
        color: #4e5969;
        margin: 0;
        padding: 0 12px 8px;
      }

      // width: 416px;
      .emojipicker {
        overflow-x: hidden;
        // overflow-y: scroll;
        height: 160px;
        box-sizing: border-box;
        margin: 12px 4px;

        .list {
          padding-left: 12px;
          padding-bottom: 12px;
          display: flex;
          flex-wrap: wrap;

          .item {
            position: relative;
            width: 32px;
            height: 32px;
            margin-bottom: 8px;
            margin-right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .image {
              transform: translateZ(0);
              transition: transform .3s;
              display: block;
              height: 28px;
              transition: all .2s;
            }

            .image:hover {
              width: 36px;
              height: 36px;
            }

            @keyframes big {
              from {
                width: 32px;
                height: 32px;
              }

              to {
                width: 36px;
                height: 36px;
              }
            }
          }
        }
      }
    }

    .emoji_pop_box::before {
      content: "";
      width: 12px;
      height: 12px;
      background-color: inherit;
      position: absolute;
      left: 24px;
      top: -6px;
      transform: rotate(135deg);
    }

    .submit_button {
      button {
        padding: 8px 2rem;
        border-radius: 4px;
        font-size: 14px;
        color: #fff;
        background-color: #1e80ff;
        cursor: pointer;
        border: 0;
        outline: none;

      }
    }
  }



  /deep/ .emoji-mart {
    .emoji-mart-scroll {
      .emoji-mart-category {
        .emoji-mart-category-label {
          span {
            display: none;
          }
        }
      }
    }
  }
}
</style>