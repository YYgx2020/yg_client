import axios from '../utils/request'

/* 
  get 请求的参数放在 params 中
  post 请求的参数放在 body 中
*/
/* 登录接口 */
export function login(data) {
  // console.log("发送过去的数据：", data);
  return axios({
    url: '/api/login',
    method: 'post',
    data,
  })
}

/* 注册接口 */
export function register(data) {
  return axios({
    url: '/api/register',
    method: 'post',
    data,
  })
}

/* 获取验证码接口 */
export function getVerifyCode(data) {
  return axios({
    url: '/api/register/code',
    method: 'get',
    params: data
  })
}

// 上传图片接口
export function uploadImg(data) {
  return axios({
    url: '/api/image/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 删除图片接口
export function deleteImg(data) {
  return axios({
    url: '/api/image/delete',
    method: 'post',
    data,
  })
}

// 判断用户身份
export async function verifyUser() {
  return await axios({
    url: '/api/auth/verifyUser',
    method: 'post',
  })
}

// 忘记密码
export function changePassword(data) {
  return axios({
    url: '/api/changePassword',
    method: 'post',
    data,
  })
}

// 发送留言消息
export function sendMessage(data) {
  return axios({
    url: '/api/message/send',
    method: 'post',
    data,
  })
}

// 获取留言消息
export function getMessage(data) {
  return axios({
    url: '/api/message/get',
    method: 'get',
    params: data,
  })
}

// 更新留言消息，主要更新点赞数和是否被精选
export function updateMessage(data) {
  return axios({
    url: '/api/message/update',
    method: 'post',
    data,
  })
}

// 删除留言消息
export function deleteMessage(data) {
  return axios({
    url: '/api/message/delete',
    method: 'post',
    data,
  })
}

// 创建草稿文章
export function createDraft(data) {
  return axios({
    url: '/api/draft/create',
    method: 'post',
    data,
  })
}

// 获取草稿文章数据
export function getDraftList(data) {
  return axios({
    url: '/api/draft/get',
    method: 'get',
    params: data,
  })
}

// 更新草稿文章
export function updateDraft(data) {
  return axios({
    url: "/api/draft/update",
    method: 'post',
    data,
  })
}

// 删除草稿文章
export function deleteDraft(data) {
  return axios({
    url: '/api/draft/delete',
    method: 'post',
    data,
  })
}

// 创建文章
export function createArticle(data) {
  return axios({
    url: '/api/article/create',
    method: 'post',
    data,
  })
}

// 获取文章列表
export function getArticleList(data) {
  return axios({
    url: '/api/article/getAll',
    method: 'get',
    params: data,
  })
}

// 获取文章信息
export function getArticleInfo(data) {
  return axios({
    url: '/api/article/getSingle',
    method: 'get',
    params: data,
  })
}

// 更新文章数据
export function updateArticle(data) {
  return axios({
    url: '/api/article/update',
    method: 'post',
    data,
  })
}

// 更新文章评论数据
export function updateComment(data) {
  return axios({
    url: '/api/article/updateComment',
    method: 'post',
    data,
  })
}

// 删除文章
export function deleteArticle(data) {
  return axios({
    url: '/api/article/delete',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getUserInfo(data) {
  return axios({
    url:'/api/user/get',
    method: 'get',
    params: data,
  })
}

// 获取指定的用户信息
export function getInfoLimit(data) {
  return axios({
    url: '/api/user/getLimit',
    method: 'get',
    params: data,
  })
}


// 获取所有文章的数据
export function getTotalData() {
  return axios({
    url: '/api/article/getTotalData',
    method: 'get',
  })
}
