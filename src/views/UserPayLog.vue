<template>
  <Header />

  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />
      <div class="my_r">
        <div class="my_bookshelf">
          <div class="title cf">
            <h2 class="fl">我的充值</h2>
            <div class="fr"></div>
          </div>
          <!-- 充值列表 -->
          <div class="bookshelf-list">
            <!-- 空状态 -->
            <div v-if="total == 0" class="no_contet no_comment">
              暂无充值记录！
            </div>
            <!-- 有数据时显示 -->
            <div v-else class="bookshelf-content">
              <!-- 书架表格头部 -->
              <div class="bookshelf-header">
                <div class="header-item">订单号</div>
                <div class="header-item">充值金额</div>
                <div class="header-item">星币数量</div>
                <div class="header-item">支付时间</div>
              </div>

              <!-- 内容 -->
              <div class="bookshelf-items">
                <div v-for="(item, index) in payLogs" :key="item.outTradeNo" class="book-item"
                  :class="{ 'book-item-odd': (index + 1) % 2 === 0 }">
                  <div class="book-info">

                    <!-- 订单号 -->
                    <div>
                      {{ item.outTradeNo }}
                    </div>
                    <!-- 充值金额 -->
                    <div>
                      {{ item.productName }}
                    </div>

                    <!-- 书名 -->
                    <div>
                      {{ item.productValue }}
                    </div>

                    <!-- 支付时间 -->
                    <div class="update-time-col">
                      {{ item.payTime ? dateFormat('mm/dd HH:MM', new Date(item.payTime)) : '--' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
import { onMounted, reactive, toRefs } from "vue";
import { listPayLogs } from "@/api/user";
import { dateFormat } from '@/utils/index'

export default {
  name: "userPayLog",
  components: {
    Header,
    Footer,
    UserMenu
  },
  setup () {
    const state = reactive({
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      payLogs: [],
      // 分页相关
      pageNum: 1,
      pageSize: 8,
      total: 0,
    })

    const getPayLog = async () => {
      const { data } = await listPayLogs({
        pageNum: state.pageNum,
        pageSize: state.pageSize
      })
      console.log(data)
      state.payLogs = data.list
      state.total = Number(data.total)
    }
    // 页码改变
    const handleCurrentChange = (pageNum) => {
      state.pageNum = pageNum;
      getPayLog()
    };


    onMounted(() => {
      getPayLog()
    })
    return {
      ...toRefs(state),
      handleCurrentChange,
      dateFormat,
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

.bookshelf-list {
  border-radius: 0;
  border: none;
  font-size: 13px;
  margin-bottom: 10px;
}

/* 表格头部 */
.bookshelf-header {
  display: grid;
  grid-template-columns: 4fr 2fr 2fr 2fr;
  gap: 20px;
  padding: 14px 15px;
  background: #f9f9f9;
  color: #333;
}

/* 列表项 */
.book-item {
  display: grid;
  grid-template-columns: 4fr 2fr 2fr 2fr;
  gap: 20px;
  padding: 10px 15px;
  align-items: center;
  color: #666;
}

/* 奇数行背景色 */
.book-item-odd {
  background-color: #fafafa;
}

.book-info {
  display: contents;
}

.no_contet {
  padding: 190px 0 40px;
  text-align: center;
  color: #999;
  border-top: 1px solid #eee;
}
</style>