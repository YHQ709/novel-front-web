<template>
  <Header />

  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />
      <div class="my_r">
        <div class="my_bookshelf">
          <div class="title cf">
            <h2 class="fl">我的书架</h2>
            <div class="fr"></div>
          </div>
          <!-- 使用封装的书架列表组件 -->
          <BookshelfList :books="bookshelf" :is-favorites-page="true" empty-description="书架空空如也，快去添加喜欢的书籍吧~"
            @remove-from-shelf="removeFromshelf" />

          <!-- 分页组件 -->
          <el-pagination v-if="total > 0" small layout="prev, pager, next" :background="true" :page-size="pageSize"
            :total="total" class="mt-4" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import UserMenu from "@/components/user/Menu";
import BookshelfList from "@/components/user/BookshelfList";
import { onMounted, reactive, toRefs } from "vue";
import { listBookshelf, removeBookshelf } from "@/api/user";
import { ElMessageBox } from "element-plus";

export default {
  name: "userFavorites",
  components: {
    Header,
    Footer,
    UserMenu,
    BookshelfList
  },
  setup () {
    const state = reactive({
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      bookshelf: [],
      // 分页相关
      pageNum: 1,
      pageSize: 6,
      total: 0,
    })

    const getBookshelf = async () => {
      const { data } = await listBookshelf({
        pageNum: state.pageNum,
        pageSize: state.pageSize
      })
      console.log(data)
      state.bookshelf = data.list
      state.total = Number(data.total)
    }
    // 页码改变
    const handleCurrentChange = (pageNum) => {
      state.pageNum = pageNum;
      getBookshelf()
    };

    const removeFromshelf = async (bookId) => {
      await ElMessageBox.confirm(
        '删除后无法恢复，确定要移出书架吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );
      await removeBookshelf(bookId)
      // 重新获取书架列表
      getBookshelf()
    }

    onMounted(() => {
      getBookshelf()
    })
    return {
      ...toRefs(state),
      removeFromshelf,
      handleCurrentChange,
    };
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

.my_bookshelf .title {
  padding: 20px 0 15px;
  line-height: 30px;
}

.my_bookshelf h4 {
  font-size: 14px;
  color: #666;
}

.my_bookshelf h2 {
  font-size: 18px;
  font-weight: normal;
}

.fast_tit .title {
  background: #fff;
  font-size: 16px;
  padding: 3px 14px;
  position: relative;
  display: inline-block;
  z-index: 999;
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

.book_tit .fr {
  font-size: 14px;
}
</style>