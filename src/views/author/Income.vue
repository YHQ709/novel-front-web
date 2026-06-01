<template>
  <AuthorHeader />
  <div class="main box_center cf">
    <div class="userBox cf">
      <div class="my_l">
        <ul class="log_list">
          <li>
            <router-link class="link_4" :class="{ on: $route.name === 'authorBookList' }"
              :to="{ name: 'authorBookList' }">
              小说管理
            </router-link>
          </li>
          <li>
            <router-link class="link_2" :class="{ on: $route.name === 'authorIncome' }" :to="{ name: 'authorIncome' }">
              稿费收入
            </router-link>
          </li>
        </ul>
      </div>
      <div class="my_r">
        <div class="my_bookshelf">
          <!-- Tab 切换 -->
          <div class="title cf">
            <div class="tab-nav">
              <span class="tab-item" :class="{ active: activeTab === 'subscribe' }" @click="switchTab('subscribe')">
                订阅明细
              </span>
              <span class="tab-separator">|</span>
              <span class="tab-item" :class="{ active: activeTab === 'summary' }" @click="switchTab('summary')">
                稿费汇总
              </span>
            </div>
          </div>

          <!-- 订阅明细组件 -->
          <SubscribeIncome v-show="activeTab === 'subscribe'" ref="subscribeRef" />

          <!-- 稿费汇总组件 -->
          <IncomeSummary v-show="activeTab === 'summary'" ref="summaryRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import AuthorHeader from "@/components/author/Header.vue";
import SubscribeIncome from "@/views/author/SubscribeIncome.vue";
import IncomeSummary from "@/views/author/IncomeSummary.vue";

export default {
  name: "Income",
  components: {
    AuthorHeader,
    SubscribeIncome,
    IncomeSummary,
  },
  setup () {
    const route = useRoute();
    const activeTab = ref("subscribe"); // 默认显示订阅明细
    const subscribeRef = ref(null);
    const summaryRef = ref(null);

    const switchTab = (tab) => {
      activeTab.value = tab;

      // 如果切换到稿费汇总且没有数据，可以触发加载
      if (tab === "summary" && summaryRef.value) {
        // 可以调用子组件的方法
        // summaryRef.value.loadData();
      }

      // 如果切换到订阅明细且没有数据，可以触发加载
      if (tab === "subscribe" && subscribeRef.value) {
        // subscribeRef.value.loadData();
      }
    };

    return {
      activeTab,
      subscribeRef,
      summaryRef,
      switchTab,
    };
  },
};
</script>

<style scoped>
.tab-nav {
  padding: 20px 0 15px;
  font-size: 16px;
}

.tab-item {
  cursor: pointer;
  transition: color 0.3s;
}

.tab-item:hover {
  color: #f80;
}

.tab-item.active {
  color: #f80;
  font-weight: 500;
}

.tab-separator {
  margin: 0 15px;
}

.userBox {
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 6px;
}

.my_l {
  width: 198px;
  float: left;
  font-size: 13px;
  padding-top: 20px;
}

.my_l li a {
  display: block;
  height: 42px;
  line-height: 42px;
  padding-left: 62px;
  border-left: 4px solid #fff;
  margin-bottom: 5px;
  color: #666;
}

.my_l li .on {
  background-color: #fafafa;
  border-left: 2px solid #f80;
  color: #000;
  border-radius: 0 2px 2px 0;
}

.my_l .link_2 {
  background-position: 32px -230px;
}

.my_l .link_4 {
  background-position: 32px -314px;
}

.my_r {
  width: 739px;
  padding: 0 30px 30px;
  float: right;
  border-left: 1px solid #efefef;
  min-height: 470px;
}

.my_bookshelf .title {
  padding: 0 0 15px;
  line-height: 30px;
}

/* 覆盖 Element Plus 的橙色主题 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #f80 !important;
}

:deep(.el-pagination) {
  --el-pagination-hover-color: #f80 !important;
}

:deep(.el-select) {
  --el-color-primary: #f80;
}

:deep(.el-date-picker) {
  --el-color-primary: #f80;
}
</style>