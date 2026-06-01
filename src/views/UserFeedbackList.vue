<template>
  <Header />

  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />
      <div class="my_r">
        <div class="my_feedback">
          <div class="title cf">
            <h2 class="fl">我的反馈</h2>
            <router-link :to="{ name: 'feedback' }" class="fr">写反馈</router-link>
          </div>
          <!-- 反馈列表 -->
          <div class="feedback-list">
            <!-- 空状态 -->
            <div v-if="total == 0" class="no_contet no_comment">
              暂无反馈记录！
            </div>

            <!-- 列表内容 -->
            <div v-else>
              <div v-for="(item, index) in feedbackList" :key="index" class="feedback-item">
                <div class="feedback-left">
                  <div class="feedback-time">
                    <p>{{ item.feedbackTime }}</p>
                  </div>
                  <div class="feedback-content">
                    <p>{{ item.feedbackContent }}</p>
                  </div>
                </div>
                <button class="delete-btn" @click="handleDelete(item.id)">删除</button>
              </div>
            </div>

            <!-- 分页 -->
            <el-pagination v-if="total > 0" small :background="true" layout="prev, pager, next" :total="total"
              :page-size="pageSize" class="mt-4" @current-change="handleCurrentChange" />

          </div>
        </div>

      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import "@/assets/styles/user.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import UserMenu from "@/components/user/Menu";
import { onMounted, reactive, toRefs } from "vue";
import { deleteFeedback, listFeedbacks } from "@/api/user";
import { ElMessageBox } from "element-plus";

export default {
  name: "userFeedbackList",
  components: {
    Header,
    Footer,
    UserMenu
  },
  setup () {
    const state = reactive({
      pageNum: 1,
      total: 0,
      pageSize: 5,
      feedbackList: [],
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
    });

    onMounted(async () => {
      loadFeedbacks(0);
    });

    const loadFeedbacks = async () => {
      const { data } = await listFeedbacks({ pageNum: state.pageNum, pageSize: state.pageSize });
      state.feedbackList = data.list;
      state.total = Number(data.total);
    };


    const handleCurrentChange = (pageNum) => {
      state.pageNum = pageNum;
      loadFeedbacks();
    };

    const handleDelete = async (id) => {
      await ElMessageBox.confirm(
        '删除后无法恢复，确定要删除这条反馈吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );

      // 用户点击确定后执行删除
      await deleteFeedback(id);

      // 重新加载当前页
      await loadFeedbacks(state.currentPage);

      // 如果当前页删除后没有数据了，自动跳转到上一页
      if (state.feedbackList.length === 0 && state.currentPage > 1) {
        await loadFeedbacks(state.currentPage - 1);
      }
    };

    return {
      ...toRefs(state),
      handleCurrentChange,
      handleDelete
    }
  }
}
</script>

<style scoped>
:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #f80 !important;
}

:deep(.el-pagination) {
  --el-pagination-hover-color: #f80 !important;
}

.userBox {
  /*width: 998px; border: 1px solid #eaeaea;*/
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 6px;
}

.channelViewhistory .userBox {
  margin: 0 auto;
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


.my_feedback .title {
  padding: 20px 0 15px;
  line-height: 30px;
}

.my_feedback h4 {
  font-size: 14px;
  color: #666;
}

.my_feedback h2 {
  font-size: 18px;
  font-weight: normal;
}

.book_tit .fl {
  font-size: 14px;
  color: #999;
}

.book_tit .fl h3 {
  font-size: 18px;
  color: #333;
  font-weight: normal;
  margin-right: 5px;
  display: inline;
}

.my_feedback .fr {
  padding-top: 4px;
  text-align: center;
  width: 100px;
  height: 36px;
  background: #f79415;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 反馈列表样式 */
.feedback-list {
  min-height: 400px;
}

.no_contet {
  padding: 190px 0 40px;
  text-align: center;
  color: #999;
  border-top: 1px solid #eee;
}

.feedback-item {
  padding: 20px;
  border-top: 1px solid #efefef;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.feedback-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.feedback-time {
  color: #999;
}

.feedback-content {
  padding-top: 4px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  word-break: break-all;
}

.delete-btn {
  margin-left: 20px;
  padding: 4px 16px;
  background: none;
  border: 1px solid #f80;
  color: #f80;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  outline: none;
  white-space: nowrap;
  align-self: center;
}

.delete-btn:hover {
  background: #f80;
  color: #fff;
  border-color: #f80;
}
</style>