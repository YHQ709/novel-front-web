<template>
  <div class="income-summary">
    <div class="income-table">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="month" label="月份" width="180">
          <template #default="{ row }">
            {{ formatMonth(row.incomeMonth) }}
          </template>
        </el-table-column>
        <el-table-column prop="preTaxIncome" label="税前收入" width="180">
          <template #default="{ row }">
            ￥{{ formatAmount(row.preTaxIncome) }}
          </template>
        </el-table-column>
        <el-table-column prop="afterTaxIncome" label="税后收入" width="180">
          <template #default="{ row }">
            ￥{{ formatAmount(row.afterTaxIncome) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="支付状态">
          <template #default="{ row }">
            {{ row.payStatus === "0" ? "待支付" : "已支付" }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination small v-if="total > 0" background layout="prev, pager, next" :page-size="pageSize" :total="total"
        class="mt-4" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { listIncomes } from "@/api/author";

export default {
  name: "IncomeSummary",
  setup () {
    const state = reactive({
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      totalIncome: 0,
      monthIncome: 0,
      pendingIncome: 0,
    });

    onMounted(() => {
      loadData();
    });

    const loadData = async () => {
      const { data } = await listIncomes({
        pageNum: state.pageNum,
        pageSize: state.pageSize
      });
      console.log("稿费汇总数据", data)
      state.list = data.list;
      state.total = Number(data.total);
    };

    const handlePageChange = (pageNum) => {
      state.pageNum = pageNum;
      loadData();
    };

    const formatMonth = (dateStr) => {
      if (!dateStr) return "";
      // 如果传入的是 "2026-02-01" 格式
      const [year, month] = dateStr.split('-');
      return `${year}年${month}月`;
    };

    const formatAmount = (amount) => {
      if (!amount && amount !== 0) return "0.00";
      return Number(amount).toFixed(2);
    };

    // 暴露方法给父组件
    return {
      ...toRefs(state),
      handlePageChange,
      formatMonth,
      formatAmount,
      loadData,
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
.stat-cards {
  margin: 20px 0;
}

.stat-card {
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}

.stat-label {
  color: #999;
  font-size: 13px;
  margin-bottom: 10px;
}

.stat-value {
  color: #f80;
  font-size: 24px;
  font-weight: 500;
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