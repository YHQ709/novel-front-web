<template>
  <div class="subscribe-income">
    <div class="income-table">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="incomeDate" label="日期" width="200">
          <template #default="{ row }">
            {{ formatDate(row.incomeDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="incomeAccount" label="订阅总额" width="200">
          <template #default="{ row }">
            ￥{{ formatAmount(row.incomeAccount) }}
          </template>
        </el-table-column>
        <el-table-column prop="incomeCount" label="订阅次数" width="200" />
        <el-table-column prop="incomeNumber" label="订阅人数" />
      </el-table>

      <el-pagination small v-if="total > 0" background layout="prev, pager, next" :page-size="pageSize" :total="total"
        class="mt-4" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { listSubscribe } from "@/api/author";
import dayjs from "dayjs";

export default {
  name: "SubscribeIncome",
  setup () {
    const state = reactive({
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      startDate: "",
      endDate: "",
    });

    onMounted(() => {
      loadData();
    });

    const loadData = async () => {

      const { data } = await listSubscribe({
        pageNum: state.pageNum,
        pageSize: state.pageSize
      });
      state.list = data.list;
      console.log("订阅明细数据", data)
      state.total = Number(data.total);

    };

    const handlePageChange = (pageNum) => {
      state.pageNum = pageNum;
      loadData();
    };

    const formatDate = (date) => {
      if (!date) return "";
      return dayjs(date).format("YYYY-MM-DD");
    };

    const formatAmount = (amount) => {
      if (!amount && amount !== 0) return "0.00";
      return Number(amount).toFixed(2);
    };

    // 暴露方法给父组件
    return {
      ...toRefs(state),
      handlePageChange,
      formatDate,
      formatAmount,
      loadData, // 暴露给父组件调用
    };
  },
};
</script>

<style>
.el-pagination {
  justify-content: center;
  margin-top: 15px;
}

.el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
  background-color: #f80 !important;
}

.el-pagination {
  --el-pagination-hover-color: #f80 !important;
}
</style>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}

:deep(.el-table th) {
  background-color: #f9f9f9;
  color: #333;
  font-weight: normal;
}

:deep(.el-table td) {
  color: #999;
}
</style>