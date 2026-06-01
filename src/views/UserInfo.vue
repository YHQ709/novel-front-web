<template>
  <Header />

  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />
      <div class="my_r">

        <!-- 用户信息展示区域 -->
        <div class="user-info-container">
          <!-- 左侧：头像区域 -->
          <div>
            <img id="imgLogo" class="user_img" alt="我的头像" :src="userPhoto ? (imgBaseUrl + userPhoto) : man" />
          </div>

          <!-- 右侧：个人信息展示区域 -->
          <div>
            <!-- 第一行：昵称 -->
            <div class="info-row">
              <span class="my_name">{{ nickName }}</span>
            </div>

            <!-- 第二行：账户余额 -->
            <div class="info-row">
              <span class="info-label">账户余额：</span>
              <span class="balance-value">{{ accountBalance }}</span>
              <span class="balance-unit">星币</span>

              <!-- 立即充值按钮 -->
              <router-link to="/pay" class="recharge-btn">
                立即充值
              </router-link>
            </div>
          </div>
        </div>

        <!-- 我的书架区域 -->
        <div class="bookshelf-section">
          <div class="section-header">
            <h3>我的书架</h3>
            <router-link to="/user/favorites" class="view-all">全部收藏 ></router-link>
          </div>

          <!-- 使用封装的书架列表组件 -->
          <BookshelfList :books="bookshelf" :is-favorites-page="false" />
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import "@/assets/styles/user.css";
import man from "@/assets/images/man.png";
import { dateFormat } from '@/utils/index';
import { reactive, onMounted, toRefs, ref } from 'vue'
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import UserMenu from "@/components/user/Menu";
import BookshelfList from "@/components/user/BookshelfList";
import { getUserinfo, listBookshelf } from '@/api/user'

export default {
  name: "userInfo",
  components: {
    Header,
    Footer,
    UserMenu,
    BookshelfList
  },
  setup () {
    // 响应式数据
    const state = reactive({
      userPhoto: "",
      nickName: "",
      accountBalance: 0,
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      bookshelf: [],
    })

    // 初始化数据
    const getUserInfo = async () => {
      // 获取用户信息
      const { data } = await getUserinfo()
      state.userPhoto = data.userPhoto
      state.nickName = data.nickName
      state.accountBalance = data.accountBalance
    }

    const getBookshelf = async () => {
      const { data } = await listBookshelf({
        pageNum: 1,
        pageSize: 10
      })
      state.bookshelf = data.list.slice(0, 3)
    }

    onMounted(() => {
      getUserInfo()
      getBookshelf()
    })

    return {
      ...toRefs(state),
      man,
      dateFormat,
    };
  }
}
</script>

<style scoped>
.userBox {
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 6px;
}

.my_r {
  width: 739px;
  padding: 0 30px 30px;
  float: right;
  border-left: 1px solid #efefef;
  min-height: 470px;
}

.my_r .my_name {
  font-size: 18px;
  line-height: 1;
  padding: 5px 0 12px 0;
}

.my_r .s_input {
  width: 318px;
  padding: 0 10px;
}

/* 用户信息容器 */
.user-info-container {
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 35px;
  gap: 30px;
}

.user-info-container .user_img {
  width: 85px;
  height: 85px;
  vertical-align: middle;
  border-radius: 50%;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.balance-value {
  font-size: 15px;
  color: #f79415;
  margin: 0 7px;
}

.balance-unit {
  color: #666;
  margin-right: 20px;
}

/* 充值按钮 */
.recharge-btn {
  background: #f79415;
  color: white;
  border: none;
  padding: 3px 5px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 13px;
}

.recharge-btn:hover {
  background: #e68510;
}

/* 我的书架区域 */
.bookshelf-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.view-all {
  color: #333;
  text-decoration: none;
  font-size: 13px;
}

.view-all:hover {
  color: #f79415;
}
</style>