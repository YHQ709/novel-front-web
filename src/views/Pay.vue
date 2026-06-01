<template>
  <Header />

  <div class="main box_center cf">
    <div class="channelWrap channelPay cf">
      <div class="payBox cf">
        <div class="payHead cf">
          <div class="fl">
            充值账号：<span class="user_name" id="my_name">{{ nickName }}</span>
            余额：<em class="red">{{ accountBalance }}</em> 星币
          </div>
        </div>
        <div class="payCon">
          <h5>选择充值方式</h5>
          <ul class="pay_way cf" id="ulPayType">
            <li :class="{ on: payType === 1 }" @click="selectPayType(1)" valp="1">
              <img src="@/assets/images/pay_zfb.png" alt="支付宝支付" class="pay_pic">
            </li>
            <li :class="{ on: payType === 2 }" @click="selectPayType(2)" valp="2">
              <img src="@/assets/images/pay_wx.png" alt="微信支付" class="pay_pic">
            </li>
          </ul>
          <h5>选择充值金额</h5>
          <!-- 人民币充值选项 -->
          <ul class="pay_way cf" id="ulZFWX">
            <li v-for="item in amountOptions" :key="item.value" :vals="item.value"
              :class="{ on: selectedAmount === item.value }" @click="selectAmount(item.value)">
              <strong>{{ item.value }}元</strong>
              <span class="pay_mn">{{ item.value * 100 }}星币</span>
            </li>
          </ul>

          <ul class="pay_Checkout" id="ulZFWXXJ">
            <li>当前汇率：1元=100星币</li>
            <li>
              总计金额：<em class="red" id="showTotal">￥{{ selectedAmount }}元</em>
              获得 <em class="red" id="showRemark">{{ selectedAmount * 100 }}星币</em>
            </li>
            <li>
              <a href="javascript:void(0);" class="btn_red" @click="handlePay" :class="{ disabled: isPaying }">
                {{ isPaying ? '支付处理中...' : '立即支付' }}
              </a>
            </li>
          </ul>
        </div>
        <div class="payFoot">
          <strong class="tip_tit">温馨提示</strong>
          <ul class="tip_list">
            <li>1. 充值阅读权限仅限本书城使用</li>
            <li>2. 充值支持信用卡、借记卡、支付宝余额等支付</li>
            <li>3. 包年时间是365天，重复购买时间会累加</li>
            <li>4. 若充值遇到问题，<router-link :to="{ name: 'feedback' }" target="_blank"
                class="unlink black9">点此留言</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import "@/assets/styles/book.css";
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from 'element-plus';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getUserinfo } from "@/api/user";
import { createAlipay } from "@/api/pay";

export default {
  name: "pay",
  components: {
    Header,
    Footer,
  },
  setup () {
    const route = useRoute();
    const router = useRouter();

    // 充值金额选项
    const amountOptions = [
      { value: 1 },
      { value: 10 },
      { value: 30 },
      { value: 50 },
      { value: 100 },
      { value: 200 },
      { value: 500 }
    ];

    const state = reactive({
      nickName: "",
      accountBalance: 0,
      payType: 1, // 支付方式：1-支付宝，2-微信
      selectedAmount: 1, // 默认选中1元
      isPaying: false, // 是否正在支付中
      amountOptions: amountOptions
    });

    onMounted(() => {
      getUserInfo();
      // 检查是否有支付结果参数
      checkPayResult();
    });

    // 获取用户信息
    const getUserInfo = async () => {
      const { data } = await getUserinfo();
      state.nickName = data.nickName;
      state.accountBalance = data.accountBalance;

    };

    // 检查支付结果
    const checkPayResult = () => {
      const query = route.query;

      // 检查是否有支付宝返回的参数（同步通知）
      if (query.out_trade_no) {
        // 显示成功消息
        ElMessage.success({
          message: `支付成功！金额：${query.total_amount}元`,
          duration: 3000
        });

        // 刷新用户余额
        getUserInfo();

        // 使用 Vue Router 清除所有查询参数
        router.replace({ path: '/pay', query: {} });
        console.log('已清除URL参数');
      }
      // 兼容原有的 success 参数
      else if (query.success === 'true') {
        ElMessage.success(`支付成功！订单号：${query.outTradeNo}，金额：${query.totalAmount}元`);
        getUserInfo();
        router.replace({ path: '/pay', query: {} });
      } else if (query.success === 'false') {
        ElMessage.error(query.msg || '支付失败');
        router.replace({ path: '/pay', query: {} });
      }
    };

    // 选择支付方式
    const selectPayType = (type) => {
      if (type === 2) {
        ElMessage.warning('微信支付暂未开放，请使用支付宝支付');
        return;
      }
      state.payType = type;
    };

    // 选择充值金额
    const selectAmount = (amount) => {
      state.selectedAmount = amount;
    };

    // 处理支付
    const handlePay = async () => {
      if (state.isPaying) return;

      if (!state.selectedAmount) {
        ElMessage.warning('请选择充值金额');
        return;
      }

      // 检查支付方式
      if (state.payType === 2) {
        ElMessage.warning('微信支付暂未开放，请使用支付宝支付');
        state.isPaying = false;
        return;
      }

      state.isPaying = true;

      try {
        const payParams = {
          amount: state.selectedAmount,
          productType: 1,
          productId: 0,
          productName: `充值${state.selectedAmount}元`,
          productValue: state.selectedAmount * 100,
          payChannel: state.payType.toString()
        };

        const response = await createAlipay(payParams);

        if (response.code === '00000' && response.data) {
          const payForm = response.data.payForm;

          // 表单提交方式
          const formContainer = document.createElement('div');
          formContainer.innerHTML = payForm;
          document.body.appendChild(formContainer);

          const form = formContainer.querySelector('form');
          if (form) {
            console.log('找到表单，准备提交...');
            setTimeout(() => {
              form.submit();
            }, 100);
          } else {
            console.error('未找到表单元素', payForm);
            ElMessage.error('支付表单创建失败');
            state.isPaying = false;
          }
        } else {
          ElMessage.error(response.message || '创建支付订单失败');
          state.isPaying = false;
        }
      } catch (error) {
        console.error('支付失败', error);
        ElMessage.error('支付失败，请稍后重试');
        state.isPaying = false;
      }
    };

    // 搜索功能
    const searchByK = (keywords) => {
      router.push({ path: '/bookclass', query: { keywords } });
    };

    return {
      ...toRefs(state),
      selectPayType,
      selectAmount,
      handlePay,
      searchByK
    };
  },
};
</script>

<style scoped>
/* 支付按钮禁用样式 */
.btn_red.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>