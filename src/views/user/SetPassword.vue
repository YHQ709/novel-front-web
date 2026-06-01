<template>
  <Header />
  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />

      <div class="my_r">
        <div class="form-item">
          <label for="password">我的密码</label>
          <div class="set-password">
            <el-input type="password" size="large" class="s_input" v-model="oldPassword" placeholder="请输入原密码"
              show-password> </el-input>
            <el-input type="password" size="large" class="s_input" v-model="newPassword" placeholder="请输入新密码"
              show-password> </el-input>
            <el-input type="password" size="large" class="s_input" v-model="confirmPassword" placeholder="请确认新密码"
              show-password> </el-input>
          </div>
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
import { onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { setPassword } from '@/api/user';

export default {
  name: 'setName',
  components: { Header, Footer, UserMenu },
  setup () {
    const router = useRouter()
    const state = reactive({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // 处理密码修改逻辑
    const handleSubmit = async () => {
      // 表单验证
      if (!state.oldPassword.trim()) {
        ElMessage.warning('请输入原密码');
        return;
      }
      if (!state.newPassword.trim()) {
        ElMessage.warning('请输入新密码');
        return;
      }
      if (state.newPassword.length < 6 || state.newPassword.length > 20) {
        ElMessage.warning('新密码长度在6-20位之间');
        return;
      }
      if (!state.confirmPassword.trim()) {
        ElMessage.warning('请确认新密码');
        return;
      }
      if (state.newPassword !== state.confirmPassword) {
        ElMessage.warning('两次输入的新密码不一致');
        return;
      }
      // 调用API
      const res = await setPassword({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword
      });

      if (res.code === '00000') {
        // 清空输入框
        state.oldPassword = '';
        state.newPassword = '';
        state.confirmPassword = '';

        router.push('/login');
      } else {
        ElMessage.error(res.message);
      }
    };


    onMounted(() => {

    });

    return {
      ...toRefs(state),
      handleSubmit,
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
  padding: 0;
}

.form-item {
  margin-top: 34px;
  line-height: 1;
  padding: 5px 0 12px 0;
  display: flex;
  align-items: flex-start;
}

.form-item label {
  display: inline-block;
  width: 80px;
  text-align: center;
  margin-right: 10px;
  color: #a6a6a6;
  font-size: 14px;
  flex-shrink: 0;
  line-height: 36px;
}

.set-password {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.submit-btn {
  margin-top: 10px;
  margin-left: 91px;
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