<template>
  <div id="login_container" v-if="$store.state.showLoginPop" @touchmove.prevent>
    <div class="login_form_wrapper" :class="out? 'out': ''">
      <form action="" class="auth_form">
        <i class="guanbi iconfont icon-yuyinguanbi" @click="closeLoginPop" title="关闭"></i>
        <!-- :class="entry? 'login_out': 'login_entry'" -->
        <div class="panel" v-if="!toForgetPwd">
          <h1 class="title">账密登录</h1>
          <!-- 输入框 -->
          <div class="input_group">
            <div class="input_box">
              <input maxlength="64" :class="inputSign.indexOf('1') !== -1 ? 'shake' : ''" type="text" placeholder="邮箱"
                v-model="formData.email" data-sign="1" />
            </div>
            <div class="input_box">
              <input maxlength="16" class="pwd_input" type="password" v-model="formData.password" placeholder="密码" />
            </div>
            <!-- 获取验证码 -->
            <div class="input_box">
              <input class="code_input" type="text" v-model="formData.verifyCode" placeholder="验证码" maxlength="6" />
              <button type="button" :class="canSendCode ? 'cannot_send_code send_code_btn' : 'send_code_btn'"
                @click="getAuthCode()">
                {{ canSendCode ? captchaTime + ' 秒后重试' : '获取验证码' }}
              </button>
            </div>
          </div>
          <button type="button" :disabled="loginBtn" :class="!loginBtn ? 'login_btn' : 'login_btn loading'"
            @click="loginEvent()">
            {{ !loginBtn ? '登录' : '正在登录中...' }}
          </button>
          <div class="prompt_box">
            <el-checkbox v-model="checked">记住我</el-checkbox>
            <span class="forget_password" @click="toResetPassword()">忘记密码</span>
          </div>
        </div>
        <!-- :class="entry? 'reset_entry': 'reset_out'" -->
        <div class="panel" v-if="toForgetPwd">
          <h1 class="title">重置密码</h1>
          <div class="input_group">
            <div class="input_box">
              <input v-model="formData.email" maxlength="64" :class="inputSign === '10012' ? 'shake' : ''"
                class="email_input" type="text" placeholder="请输入注册邮箱" />
            </div>
            <div class="input_box">
              <input v-model="formData.password" maxlength="16" :class="inputSign.indexOf('3') !== -1 ? 'shake' : ''"
                class="pwd_input" type="password" placeholder="请输入密码" />
            </div>
            <div class="input_box">
              <input v-model="formData.password_again" maxlength="16"
                :class="inputSign.indexOf('3') !== -1 ? 'shake' : ''" class="pwd_input" type="password"
                placeholder="请确认密码" />
            </div>
            <!-- 获取验证码 -->
            <div class="input_box">
              <input v-model="formData.verifyCode" class="code_input" type="text" placeholder="验证码" maxlength="6" />
              <button type="button" :class="canSendCode ? 'cannot_send_code send_code_btn' : 'send_code_btn'"
                @click="getAuthCode()">
                {{ canSendCode ? captchaTime + ' 秒后重试' : '获取验证码' }}
              </button>
            </div>
          </div>
          <button type="button" class="reset_pwd_btn" :class="!changing ? '' : 'loading'" @click="changePassword">
            {{ !changing ? '立即重置' : '正在重置中...' }}
          </button>
          <div class="prompt_box">
            <span class="has_account" @click="toResetPassword()">取消重置</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getVerifyCode, login, changePassword } from "@/api";
import { Notification } from "element-ui";
import Cookies from "js-cookie";  // 登录或者注册后使用 cookie 保存 token
import md5 from 'js-md5';  // 对密码进行 md5 加密后再传给后端

const reg = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
const shakeTime = 800;
const expire_time = 15  // cookie 过期时间 15 天

export default {
  name: 'Login',
  data() {
    return {
      // 表单数据
      formData: {
        email: "",
        username: "",
        password: "",
        verifyCode: "",
        password_again: '',
      },
      checked: false,
      canSendCode: false, // 设置是否可以发送验证码
      interval: null,  // 验证码定时器
      captchaTime: 60,  // 验证码倒计时
      fixedSecond2: 60,  // 固定时间
      inputSign: "0",  // 表单抖动标志
      toForgetPwd: false, // 切换到忘记密码页面的标志
      loginBtn: false,  // 设置不可重复点击
      out: false,
      entry: false,
      changing: false, // 标志是否正在重置密码
      // toLogin: false,
    }
  },
  created() {
    console.log('登录弹窗弹出');
  },
  methods: {
    // 关闭登录弹窗
    closeLoginPop() {
      let timer = null
      clearTimeout(timer)
      this.out = true;
      timer = setTimeout(() => {
        this.out = false
        this.$store.commit("showLoginPop");
        this.toForgetPwd = false
      }, 500);
      this.move()
    },
    // 关闭登录弹窗后，开启页面滑动
    move() {
      console.log('恢复滑动');
      let m = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", m, { passive: true });
    },
    // 获取邮箱验证码
    async getAuthCode() {
      let timer1 = null;
      if (this.canSendCode) return;
      clearTimeout(timer1);
      console.log("邮箱：", this.formData.email);
      let { email } = this.formData;
      console.log("email: ", email);
      // 先查看邮箱是否填写
      if (email === "") {
        return;
      } else {
        // 判断邮箱格式是否正确
        if (!reg.test(email)) {
          console.log("请输入有效的邮箱地址");
          Notification({
            title: "警告",
            type: "warning",
            message: "请输入有效的邮箱地址",
            offset: 100,
          });
          // 抖动提示邮箱填写错误
          this.inputSign = "1";
          timer1 = setTimeout(() => {
            this.inputSign = "0";
          }, shakeTime);
          return;
        }
      }
      try {
        let res = await getVerifyCode({ email });
        console.log("验证码获取结果：", res);
        Notification({
          title: "成功",
          type: "success",
          message: res.data.message,
          offset: 100
        });
        this.canSendCode = true;
        this.countdownFun60()
      } catch (error) {
        console.log(error);
        Notification({
          title: '错误',
          type: 'error',
          message: error.response.data.message,
          offset: 100
        })
      }
      /* 
        邮箱获取成功之后显示倒计时，
        这里不需要保存到本地存储，
        直接在页面显示就可以了，页面刷新了也没事。
      */

    },

    // 倒计时函数
    countdownFun60() {
      this.interval = setInterval(() => {
        this.captchaTime = this.captchaTime - 1;
        if (this.captchaTime === 0) {
          clearInterval(this.interval);
          this.canSendCode = false;
          this.captchaTime = this.fixedSecond2;
        }
      }, 1000);
    },
    // 登录事件
    async loginEvent() {
      console.log("查看选中没有：", this.checked);
      // 登录事件，查看邮箱、密码、验证码是否填写
      let { email, password, verifyCode, } = this.formData
      if (email === '' || password === '' || verifyCode === '') {
        console.log('请填写完整的表单');
        return
      }
      // 登录状态应该保存到 store 中
      this.loginBtn = true
      let timer = null;
      clearTimeout(timer)
      // md5 加密
      password = md5(password)
      try {
        let res = await login({ email, password, verifyCode })
        console.log('登录成功后返回的数据：', res);
        Notification({
          title: '成功',
          type: 'success',
          message: '登录成功',
          offset: 100
        })
        const { userInfo } = res.data.result
        if (this.checked) {
          // 1. 将 token 和用户基本信息保存到 localStorage 和 cookie 中
          // localStorage.setItem("yg_l_token", res.data.result.token)
          // localStorage.setItem("userInfo", JSON.stringify(userInfo))
          // 设置 cookie 5分钟后过期
          Cookies.set('yg_c_token', res.data.result.token, {
            expires: expire_time
          })
          Cookies.set('userInfo', JSON.stringify(userInfo), {
            expires: expire_time
          })
        } else {
          console.log('不设置过期时间');
          // 不设置过期时间，浏览器一旦关闭，cookie 就会被清除
          Cookies.set('yg_c_token', res.data.result.token)
          Cookies.set('userInfo', JSON.stringify(userInfo))
        }

        // this.$store.commit('setToken', res.data.result.token)
        // this.$store.commit('setUserInfo', userInfo)
        // 2. 关闭登录弹出层
        // this.$store.commit('showLoginPop')
        // if (userInfo.isAdmin) {
        //   this.$store.commit('changeIsAdmin')
        // }
        // 3. 跳转回首页并且刷新页面
        // this.$router.replace({
        //   name: 'home'
        // })
        // 4.刷新页面
        // 
        timer = setTimeout(() => {
          window.location.reload();
        }, 500)
      } catch (error) {
        console.log('看这里执不执行', error);
        Notification({
          title: '错误',
          type: 'error',
          message: error.response.data.message,
          offset: 100
        })
        this.loginBtn = false
      }
    },
    // 切换找回密码页面
    toResetPassword() {
      this.toForgetPwd = !this.toForgetPwd;
      this.entry = !this.entry;
      this.formData = {
        email: "",
        username: "",
        password: "",
        verifyCode: "",
        password_again: '',
      }
    },

    // 重置密码
    async changePassword() {
      if (this.changing) return
      // console.log('立即重置啊');
      let timer = null
      clearTimeout(timer)
      for (let k in this.formData) {
        if (k === 'username') continue
        if (this.formData[k] === '') {
          return
        }
      }
      let { password_again, ...data } = this.formData
      // 两次输入的密码是否一致
      if (this.formData.password !== password_again) {
        Notification({
          title: '提示',
          type: 'warning',
          message: "两次输入的密码不一致，请重新输入",
          offset: 100
        })
        this.inputSign = '3'
        timer = setTimeout(() => {
          this.inputSign = "0";
        }, shakeTime);
        return
      }

      try {
        this.changing = true
        data.password = md5(data.password)
        console.log('加密后的密码：', data.password);
        let res = await changePassword(data)
        console.log('密码修改成功后返回的数据：', res);
        Notification({
          title: '成功',
          type: 'success',
          message: '密码修改成功，请重新登录',
          offset: 100
        })
        // 关闭登录弹出层
        this.$store.commit('showLoginPop')
        // 刷新页面
        timer = setTimeout(() => {
          window.location.reload();
        }, 500)
      } catch (error) {
        this.changing = false
        console.log("失败", error);
        Notification({
          title: '错误',
          type: 'error',
          message: error.response.data.message,
          offset: 100,
        })
        // 账号已注册
        if (error.response.data.code === '10012') {
          this.inputSign = '10012'
          this.timer1 = setTimeout(() => {
            this.inputSign = "0";
          }, shakeTime);
        }
        // 用户名已使用 
        else if (error.response.data.code === '10002') {
          this.inputSign = '10002'
          this.timer1 = setTimeout(() => {
            this.inputSign = "0";
          }, shakeTime);
        }
      }

    }
  }
}
</script>

<style lang="less" scoped>
@import url('@/assets/css/login.less');
</style>