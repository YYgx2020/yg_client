<template>
  <div id="editor" @click="menuHide">
    <header class="editor_header">
      <div class="left_box"></div>
      <input type="text" placeholder="输入文章标题..." class="title_input" v-model="articleData.title" @blur="titleInput" />
      <div class="right_box">
        <div class="status_text with_padding">{{edited? saving? '正在保存中': saveFail? '保存失败': '保存成功' : '文章将自动保存至草稿箱中'}}
        </div>
        <button class="xitu_btn xitu_btn_outline with_padding" @click="toDraftPage">
          草稿箱
        </button>
        <div class="publish_popup">
          <button class="xitu_btn with_padding" @click="showPanelBtn">
            {{this.id? '更新': '发布'}}
          </button>
          <div class="panel" ref="panel" v-if="showPanel">
            <div class="title">{{this.id? '更新文章': '发布文章'}}</div>
            <!-- 文章分类 -->
            <div class="form_item">
              <div class="label required category_label">分类：</div>
              <div class="form_item_content category_list">
                <div :class="item.choosed ? 'active' : ''" class="category_item" v-for="(item, index) in categoryList"
                  :key="item.id" @click="choosedEvent(index, item)">
                  {{ item.label }}
                </div>
              </div>
            </div>
            <!-- 文章标签 -->
            <div class="form_item">
              <div class="label required">添加标签：</div>
              <div class="form_item_content">
                <div class="tag_input" v-for="(item, index) in tagList" :key="item.id">
                  <input :value="item.text" ref="tagInput" type="text" placeholder="输入一个标签"
                    @blur="tagInputBlur($event, index, item)" />
                  <i @click="tagInputEvent($event, index, item)" class="iconfont" :class="item.icon"></i>
                </div>
              </div>
            </div>
            <!-- 文章封面 -->
            <div class="form_item">
              <div class="label">文章封面：</div>
              <div class="form_item_content">
                <div class="coverselector_container">
                  <div>
                    <!-- http://127.0.0.1:6001/api/upload -->
                    <el-upload v-if="!articleData.cover" class="avatar-uploader" :action="uploadUrl"
                      :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                      :on-error="uploadError">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-if="articleData.cover" class="preview_box">
                      <img :src="articleData.cover" class="avatar" />
                      <div class="delete_btn">
                        <button @click="handledeleteImg">
                          <i class="iconfont icon-shanchu"></i>
                        </button>
                      </div>
                    </div>
                    <div v-if="!articleData.cover" class="advice">
                      建议尺寸：1303*734px
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 文章摘要 -->
            <div class="form_item">
              <div class="label required">编辑摘要：</div>
              <div class="form_item_content">
                <el-input type="textarea" v-model="articleData.abstract" placeholder="" @input="getlength()"
                  @blur="abstractInput" maxlength="100" show-word-limit rows="4">
                </el-input>
              </div>
            </div>
            <!-- 底部按钮 -->
            <div class="footer">
              <div class="btn_container">
                <button class="ui_btn btn line medium default" style="margin-right: 16px" @click="cancelBtn">
                  取消
                </button>
                <button class="ui_btn btn primary medium default" @click="submitBtn">
                  {{this.id? '确定并更新': '确定并发布'}}
                </button>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <div ref="avatar" class="toggle_btn with_padding" @click="showPersonSetting">
            <img :src="$store.state.userInfo.user_avatar" alt="" />
          </div>
          <div v-if="isShow" class="root_menu" ref="menus">
            <div class="item_group">
              <router-link class="item" to="admin/drafts" replace>
                <span>草稿箱</span>
              </router-link>
              <router-link class="item" to="admin">
                <span>个人中心</span>
              </router-link>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <MarkdownPro id="mark" @input="markInput" @on-save="handleOnSave" @on-upload-image="uploadImage"
      @on-ready="onReadyEvent" :value="articleData.content" :toolbars="toolbars" v-model="articleData.content">
    </MarkdownPro>
    <!-- 官方文档：https://zhaoxuhui1122.github.io/vue-markdown-docs/ -->
    <!-- <MarkdownPreview :initialValue="articleData.content"></MarkdownPreview> -->
  </div>
</template>

<script>
import { MarkdownPro } from "vue-meditor";
import { MarkdownPreview } from "vue-meditor"; // 在回显页面添加这个预览组件即可回显数据
import Cookies from "js-cookie";
import { Notification } from "element-ui";
import {
  uploadImg,
  deleteImg,
  createDraft,
  updateDraft,
  createArticle,
  deleteDraft,
  getArticleInfo,
  updateArticle,
  updateMessage
} from "@/api";
export default {
  components: {
    MarkdownPro,
    MarkdownPreview,
  },
  data() {
    return {
      // 编辑器设置
      toolbars: {
        // uploadImage: true,
        save: true,
      },
      autoSave: false, // 设置是否自动保存
      isShow: false,
      uploadUrl: "",
      articleData: {
        title: "",
        content: "",
        category: "",
        tag: [], // 文章标签
        cover: "", // 文章封面
        abstract: "", // 文章摘要
      },
      saveFail: false,
      edited: false,
      saving: true,
      categoryList: [
        {
          id: 0,
          choosed: false,
          label: "前端",
        },
        {
          id: 1,
          choosed: false,
          label: "计算机网络",
        },
        {
          id: 2,
          choosed: false,
          label: "后端",
        },
        {
          id: 3,
          choosed: false,
          label: "数据结构与算法",
        },
        {
          id: 4,
          choosed: false,
          label: "求职",
        },
        {
          id: 5,
          choosed: false,
          label: "人生感悟",
        },
        {
          id: 6,
          choosed: false,
          label: "其他",
        },
      ],
      tagList: [
        {
          id: 0,
          text: "",
          icon: "icon-jiahao",
        },
      ],

      imageUrl: "",
      residueNum: 100,
      showPanel: false, // 是否展示发布文章的弹窗
      timer: null,
    };
  },
  mounted() {
    document.addEventListener("click", this.bodyCloseMenus);
    // document.addEventListener()
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bodyCloseMenus);
  },
  created() {
    const token = Cookies.get("yg_c_token");
    if (token) {
      console.log("token没有过期");
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      this.$store.commit("changeLoginState", true);
      console.log("用户信息：", userInfo);
      this.$store.commit("setToken", token);
      this.$store.commit("setUserInfo", userInfo);
      // console.log(userInfo);
      let { id, new_draft } = this.$route.query;
      this.id = id;
      this.new_draft = new_draft;
      if (new_draft) {
        // 创建/更新草稿文章
        this.createDraft(userInfo.user_avatar, new_draft);
      }
      if (id) {
        // 更新已经发布的文章
        // 先获取文章的内容
        console.log('先获取文章的内容');
        this.getArticleInfo(id);
      }
    }
    console.log(process.env);
    this.$nextTick(() => {
      // this.$refs.mark.style = '';
      let mark = document.getElementById("mark");
      mark.style = "height: calc(100vh - 5rem);";
      this.uploadUrl = process.env.VUE_APP_URL + "/image/upload";
    });
  },

  methods: {
    // 创建草稿文章
    createDraft(avatar, createTime) {
      let data = {
        authorAvatar: avatar,
        createTime,
      };
      createDraft(data)
        .then((res) => {
          console.log("草稿文章创建成功: ", res);
          if (res.data.exit) {
            let { id, title, content, category, tag, abstract, cover } =
              res.data.res;
            // console.log();
            console.log(res.data.res.tag);
            tag = JSON.parse(tag);
            this.articleData = {
              id,
              title,
              content,
              category,
              tag,
              abstract,
              cover,
            };

            this.tagList = [];
            let that = this;
            tag.forEach((item, index) => {
              // console.log(item);
              let tagItem = {
                id: index,
                text: item,
                icon: "icon_active icon-quxiao",
              };
              that.tagList.push(tagItem);
            });

            if (this.tagList.length !== 3) {
              this.tagList.push({
                id: this.tagList.length,
                item: "",
                icon: "icon-jiahao",
              });
            }

            // 更新分类数据
            // console.log(this.categoryList);
            this.categoryList = this.categoryList.map((item) => {
              if (item.label === this.articleData.category) {
                item.choosed = true;
              }
              return item;
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "草稿文章创建失败",
            type: "error",
          });
        });
    },

    // 获取文章内容
    getArticleInfo(id) {
      let data = { id };
      getArticleInfo(data).then(res => {
        this.articleData = res.data.res;
        this.tagList = [];
        let that = this;
        this.articleData.tag.forEach((item, index) => {
          // console.log(item);
          let tagItem = {
            id: index,
            text: item,
            icon: "icon_active icon-quxiao",
          };
          that.tagList.push(tagItem);
        });

        if (this.tagList.length !== 3) {
          this.tagList.push({
            id: this.tagList.length,
            item: "",
            icon: "icon-jiahao",
          });
        }

        // 更新分类数据
        // console.log(this.categoryList);
        this.categoryList = this.categoryList.map((item) => {
          if (item.label === this.articleData.category) {
            item.choosed = true;
          }
          return item;
        });
      }).catch(err => {
        console.log('文章获取失败', err);
        this.$message.error('文章信息获取失败');
      })
    },

    // 获取文章标题
    titleInput(e) {
      this.articleData.title = e.target.value;
      console.log(e);
      // 自动保存（更新）
      this.saveAuth();
      // 更新留言消息
      this.updateMessage(e.target.value)
    },

    // 更新留言消息中的来源
    updateMessage(origin) {
      if (this.id) {
        let data = {
          articleId: this.id,
          origin,
        }
        updateMessage(data).then(res => {
          console.log('查看留言消息更新成功了吗', res);
        }).catch(err => {
          console.log(err);
        })

      } else {
        return
      }
    },

    // 跳转到草稿箱
    toDraftPage() {
      this.$router.replace({
        name: "drafts",
      });
      // window.open(routeUrl.href, "_blank");
    },
    // 展示弹出层
    showPersonSetting(event) {
      event.stopPropagation();
      this.isShow = !this.isShow;
      this.showPanel = false;
    },

    menuHide(e) {
      // console.log(e.target);
      if (this.$refs.menus && this.$refs.menus.contains(e.target)) {
        console.log(1);
      } else if (this.$refs.avatar.contains(e.target)) {
        console.log(2);
      } else {
        this.isShow = false;
      }

      if (this.$refs.panel && !this.$refs.panel.contains(e.target)) {
        // console.log("看啊可能");
        this.showPanel = false;
      }
    },

    // on-ready 事件
    onReadyEvent(e) {
      // console.log('on-ready: ', e.insertContent());
      console.log('on-ready: ', e);
      // e.insertContent()
    },

    // 获取编辑器文章内容
    markInput(value) {
      if (this.timer !== null) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // console.log(value);
        this.articleData.content = value;
        console.log(value);
        this.saveAuth();
      }, 1000);
    },

    // 上传图片
    uploadImage(e) {
      console.log("image: ", e);
      console.log(this.onReadyEvent(e));
    },

    // 设置一个自动保存的方法

    handleOnSave({ value, theme }) {
      // console.log(e);
      console.log(value, theme);
      this.articleData.content = value;
      // 如果有变动，则自动保存，没有则不自动保存
      // if (value === "") {
      //   return;
      // }
      // console.log(e);
      this.saveAuth()
    },

    showPanelBtn(event) {
      event.stopPropagation();
      this.showPanel = !this.showPanel;
      this.isShow = false;
    },

    // 文章类别选择
    choosedEvent(ind) {
      // 当前选中
      console.log("当前选中: ", ind);
      this.categoryList = this.categoryList.map((item, index) => {
        if (index == ind) {
          item.choosed = true;
          this.articleData.category = item.label;
          this.saveAuth();
        } else {
          item.choosed = false;
        }
        return item;
      });
    },

    tagInputBlur(e, index, item) {
      console.log(e.target.value);
      if (e.target.value === "" && item.icon.indexOf("quxiao") !== -1) {
        this.tagList.splice(index, 1);
        this.articleData.tag.splice(index, 1);
        this.saveAuth();
      } else if (e.target.value && item.icon.indexOf("quxiao") === -1) {
        this.articleData.tag.push(e.target.value);
        this.saveAuth();
      }
    },

    // 标签选择器
    tagInputEvent(event, index, item) {
      event.stopPropagation();
      console.log(index, item);
      let tag = this.$refs.tagInput;
      console.log("tag: ", tag[index].value);
      if (!tag[index].value) return;
      console.log(item.icon.indexOf("quxiao"));
      if (item.icon.indexOf("quxiao") !== -1) {
        this.tagList.splice(index, 1);
        this.articleData.tag.splice(index, 1);
        this.saveAuth();
      } else {
        // this.articleData.tag.push(tag[index].value);
        this.tagList[index].text = tag[index].value;
        if (this.tagList.length === 3) {
          this.$message({
            message: "最多支持添加3个标签",
            type: "warning",
          });
        } else {
          this.tagList[index].icon = "icon_active icon-quxiao";
          this.tagList.push({ id: index + 1, item: "", icon: "icon-jiahao" });
        }
      }

      // 如果当前项目没有输入文字则不给添加
    },
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      // // this.articleData.coverImg = URL.createObjectURL(file.raw);
      // this.articleData.coverImg = res.url;
      // console.log("图片路径：", this.articleData.coverImg);
      // // this.saveAuth()
    },

    // 上传失败
    uploadError() {
      this.$message.error("图片上传失败");
    },

    beforeAvatarUpload(file) {
      console.log(process.env);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      let fileData = new FormData();
      console.log(file);
      fileData.append("file", file);
      console.log("fileData: ", fileData.get("file"));
      uploadImg(fileData)
        .then((res) => {
          console.log(res);
          this.articleData.cover = res.data.url;
          this.saveAuth();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("图片上传失败");
        });
      return isJPG && isLt2M;
    },

    handledeleteImg() {
      // 删除图片
      console.log("删除文件");
      console.log(this.articleData.cover);
      const fileName = this.articleData.cover.split("img/")[1];
      deleteImg({ fileName })
        .then((res) => {
          console.log(res);
          this.articleData.cover = "";
          this.saveAuth();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err.response.data.message);
        });
    },

    // 获取输入框的字数
    getlength() {
      this.residueNum = 100 - this.articleData.abstract.length;
    },

    abstractInput(e) {
      console.log(e);
      this.articleData.abstract = e.target.value;
      this.saveAuth();
    },

    // 取消发布
    cancelBtn() {
      this.showPanel = false;
    },

    // 确定并发布按钮
    async submitBtn() {
      let { title, category, tag, abstract } = this.articleData;
      if (title === "") {
        Notification({
          title: "警告",
          type: "warning",
          message: "请输入文章的标题",
          offset: 100,
        });
        return;
      }
      if (category === "") {
        Notification({
          title: "警告",
          type: "warning",
          message: "请选择文章分类",
          offset: 100,
        });
        return;
      }
      if (tag.length === 0) {
        Notification({
          title: "警告",
          type: "warning",
          message: "请输入至少一个标签",
          offset: 100,
        });
        return;
      }
      if (abstract === "") {
        Notification({
          title: "警告",
          type: "warning",
          message: "请输入文章的摘要",
          offset: 100,
        });
        return;
      }
      if (this.new_draft) {
        // 开始创建文章，文章创建成功后删除当前草稿
        let articleData = JSON.parse(JSON.stringify(this.articleData));
        articleData.createTime = new Date().getTime();
        articleData.authorAvatar = this.$store.state.userInfo.user_avatar;
        createArticle(articleData)
          .then((res) => {
            console.log(res);
            console.log(this.articleData.id);
            // 删除草稿，然后跳转到文章列表页面
            deleteDraft({ id: this.articleData.id }).then((res) => {
              console.log(res);
              // 跳转到文章列表页面
              this.$router.replace({
                name: "articleList",
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // 更新文章然后跳转回 admin 页面
        this.saveAuth(true);
        // console.log('123');
      }
    },

    // 自动保存
    saveAuth(to) {
      this.edited = true;
      console.log('自动保存');
      let updateData = JSON.parse(JSON.stringify(this.articleData));
      updateData.tag = JSON.stringify(updateData.tag);
      updateData.updateTime = new Date().getTime();
      if (this.new_draft) {
        updateData.createTime = this.new_draft;
        // 更新草稿文章
        updateDraft(updateData)
          .then((res) => {
            this.saving = false;
            console.log(res);
            this.createDraft(this.$store.state.userInfo.user_avatar, updateData.createTime)
          })
          .catch((err) => {
            // 更新失败
            this.saveFail = true;
            this.saving = false;
            console.log(err);
          });
      }
      if (this.id) {
        // 更新已经发布过的文章
        updateArticle(this.articleData).then(res => {
          this.saving = false;
          console.log(res);
          if (to) {
            // 跳转到 admin 页面
            this.$router.replace({
              name: 'posts',
            })
          }
        }).catch(err => {
          // 更新失败
          this.saveFail = true;
          this.saving = false;
          console.log(err);
        })
      }
    },
  },

  // handleAvatarSuccess(res, file) {
  //   // console.log();
  //   this.imageUrl = URL.createObjectURL(file.raw);
  //   console.log('图片路径：', this.imageUrl);
  // },
};
</script>

<style lang="less" scoped>
@import url("@/assets/css/editor.less");
</style>