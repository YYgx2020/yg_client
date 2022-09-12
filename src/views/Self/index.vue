<template>
  <div id="self">
    <Header></Header>
    <main>
      <div class="self_content">
        <div class="spacing">
          <h1>Hello!</h1>
        </div>
        <div class="spacing">
          <h2>关于我</h2>
        </div>
        <div class="about_me">
          <p>你好，我是溢狗，本站点的开发者、博主，一只正在艰苦求职的前端<img class="cai_dog" src="@/assets/img/emoji/cai_dog.gif" alt=""></p>
          <p>我喜欢代码、热爱开发，平常也会打打🏀，锻炼身体💪</p>
          <p>大学三年,</p>
          <ul>
            <li>出过国</li>
            <li>拿过奖学金</li>
            <li>参加过各种比赛</li>
            <li>拿过各种奖</li>
            <li>搞过不少项目</li>
            <li>也赚了不少💴</li>
            <li>......</li>
          </ul>
          <p>2021年初，开始0基础自学前端，开学后因为课业繁忙，中断了一个学期的学习。。。</p>
          <p>2021年暑假开始自学原生微信小程序开发，后帮学校物理实验中心独立开发了一套物理实验数据检测的微信小程序(<a style="color: #1f84ff;"
              href="https://gitee.com/yghome/physics-experiment-assistant.git">项目地址</a>，好久没更新了)</p>
        </div>
        <div class="spacing">
          <h2>关于本站</h2>
        </div>
        <div class="about_website">
          <h3 class="spacing">启动时间</h3>
          <p>2022年8月中旬</p>
          <h3 class="spacing">主要功能</h3>
          <ul>
            <li>登录、重置密码</li>
            <li>编写、发布、展示、更新、删除博客</li>
            <li>写留言、管理留言</li>
          </ul>
          <p style="margin-top: 10px;">一些说明：</p>
          <p>由于本站目前提供的内容和服务较少，因此一些常见的网站功能还有待开发......</p>
        </div>
        <div class="spacing">
          <h2>最后</h2>
        </div>
        <div class="last">
          <p>感谢你能看到这里，本站点的所有代码已经开源分享在我的 Github 上，欢迎下载查看更多<s>细节</s>（bug）😂</p>
        </div>
        <div class="contact">
          <div class="related_link">
            <ul>
              <li>
                <svg-icon class="li_svg" iconClass="weixin_logo"></svg-icon>
                <div id="my_wechat">
                  <img src="../../assets/img/my_wechat.jpg" alt="">
                </div>
              </li>
              <li>
                <svg-icon class="li_svg" iconClass="wechat_public_account"></svg-icon>
                <div id="my_wechat_official_account">
                  <span>我的微信公众号</span>
                  <img src="@/assets/img/qrcode_for_gh_f53b6f0da166_258.jpg" alt="">
                </div>
              </li>
              <li>
                <a href="https://github.com/YYgx2020/yg_client.git">
                  <svg-icon class="li_svg" iconClass="GitHub"></svg-icon>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="time">
          <p>——2022年9月10日</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/common/Header/index.vue';
export default {
  components: { Header },
  created() {
    // console.log(document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight));
    this.$nextTick(() => {
      let scroll = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
      if (scroll) {
        // 有滚动条
        document.getElementById('self').style.height = '100%';
      } else {
        document.getElementById('self').style.height = '100vh';
      }
    })
  }
}
</script>

<style lang="less" scoped>
#self {
  background-color: #fff;
  height: 100vh;

  main {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;

    .self_content {
      width: 800px;
      padding: 40px 2rem;
      box-sizing: border-box;

      .spacing {
        padding-bottom: 10px;
      }

      p {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 10px;
      }

      ul {
        padding-left: 24px;
      }

      li {
        font-size: 16px;
        margin-bottom: 6px;
        // padding-left: 24px;
      }

      .about_me {
        margin-bottom: 20px;

        img {
          width: 24px;
          height: 24px;
          vertical-align: bottom;
        }
        ul {
          margin-bottom: 10px;
          li:first-child::marker {
            content: '🌏';
          }
          li:nth-child(2)::marker {
            content: '💯';
          }
          li:nth-child(3)::marker {
            content: '🆚';
          }
          li:nth-child(4)::marker {
            content: '🏆';
          }
          li:nth-child(5)::marker {
            content: '💻';
          }
          li:nth-child(6)::marker {
            content: '💸';
          }
          li:nth-child(7) {
            // content: '💸';
            list-style: none;
          }
        }
      }

      .contact {

        // 公众号、微信、等的展示
        .related_link {
          margin-top: 2.4rem;

          ul {
            display: flex;
            padding-left: 0px !important;

            li {
              display: flex;
              flex-direction: column;
              position: relative;
              align-items: center;
              width: 3rem;
              height: 3rem;
              margin: 0rem 1rem;
              cursor: pointer;

              a {
                height: 36px;
              }

              .li_svg {
                width: 100%;
                height: 100%;
                // position: relative;
              }

              #my_wechat {
                display: none;
              }

              #my_wechat_official_account {
                display: none;
              }
            }

            li:first-child:hover #my_wechat {
              display: block;
              width: 12.5rem;
              height: 12.5rem;
              position: absolute;
              top: -16rem;
              left: 0px;
              border-radius: 8px;
              padding: 1rem;
              z-index: 22;
              animation: 500ms opacity2 forwards;
              -webkit-animation: 500ms opacity2 forwards;
              -moz-animation: 500ms opacity2 forwards;
              gap: 20px;
              border-radius: 8px;
              background-color: #000;

              img {
                width: 100%;
                height: 100%;
              }
            }

            li:first-child:hover .li_svg {
              // display: none;
            }

            // 第二个图标
            li:nth-child(2):hover #my_wechat_official_account {
              z-index: 22;
              display: block;
              position: absolute;
              top: -18rem;
              width: 12.5rem;
              height: 15.5rem;
              padding: 0 1rem 1rem 1rem;
              gap: 20px;
              border-radius: 8px;
              background-color: #000;

              span {
                color: #fff;
                display: block;
                height: 2rem;
                line-height: 2rem;
                text-align: center;
                padding: .5rem 0rem;
                font-size: 1.3334rem;
              }

              img {
                position: absolute;
                left: 0;
                padding: 0 1rem 1rem 1rem;
                width: calc(100% - 2rem);
                bottom: 0rem;
              }
            }

            @keyframes opacity2 {
              0% {
                opacity: 0
              }

              50% {
                opacity: .8;
              }

              100% {
                opacity: 1;
              }
            }

            @-webkit-keyframes opacity2 {
              0% {
                opacity: 0
              }

              50% {
                opacity: .8;
              }

              100% {
                opacity: 1;
              }
            }

            @-moz-keyframes opacity2 {
              0% {
                opacity: 0
              }

              50% {
                opacity: .8;
              }

              100% {
                opacity: 1;
              }
            }
          }
        }
      }

      .time {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

}

@media screen and(max-width: 840px) {
  #self {
    height: 100% !important;
  }

  .self_content {
    width: 100% !important;
  }
}
</style>