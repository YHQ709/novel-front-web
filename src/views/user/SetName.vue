<template>
  <Header />
  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />

      <div class="my_r">
        <div class="form-item">
          <label for="nickname">我的昵称</label>
          <input type="text" id="nickname" class="s_input" v-model="state.nickName" placeholder="请输入昵称" />
          <div class="tip">用户名只能包括汉字、英文字母、数字和下划线</div>
        </div>
        <button class="submit-btn" @click="handleSubmit">修改</button>
      </div>
      <Footer />
    </div>
  </div>

</template>

<script>
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import UserMenu from '@/components/user/Menu';
import { onMounted, reactive } from 'vue';
import { getUserinfo, updateUserInfo } from '@/api/user';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default {
  name: 'setName',
  components: { Header, Footer, UserMenu },
  setup () {
    const router = useRouter()
    const state = reactive({
      nickName: "",
    });

    // 获取用户信息
    const getUserInfo = async () => {
      const { data } = await getUserinfo();
      state.nickName = data.nickName;
    };

    // 处理昵称修改逻辑
    const handleSubmit = async () => {
      // 表单验证
      if (!state.nickName) {
        ElMessage.error('请输入昵称');
        return;
      }

      // 验证昵称格式
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
      if (!reg.test(state.nickName)) {
        ElMessage.error('用户名只能包括汉字、英文字母、数字和下划线');
        return;
      }
      await updateUserInfo({ nickName: state.nickName });
      // ElMessage.success('昵称修改成功');
      router.back()
    };

    onMounted(() => {
      getUserInfo();
    });

    return {
      state,
      handleSubmit
    };
  }
};
</script>

<style scoped>
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

.form-item {
  margin-top: 34px;
  line-height: 1;
  padding: 5px 0 12px 0;
}

.form-item label {
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 10px;
  color: #a6a6a6;
  font-size: 14px;
}

.form-item .s_input {
  width: 318px;
  padding: 0 10px;
  height: 36px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

.form-item .tip {
  margin-left: 89px;
  margin-top: 34px;
  margin-bottom: 26px;
  font-size: 14px;
}

.submit-btn {
  margin-left: 89px;
  width: 100px;
  height: 36px;
  background: #f79415;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
}
</style>