<template>
  <Header />
  <div class="main box_center cf">
    <div class="userBox cf">
      <UserMenu />

      <div class="my_r">
        <div class="form-item">
          <label for="gender">我的性别</label>
          <div class="gender-options">
            <label class="gender-option">
              <input type="radio" v-model="state.userSex" value="0" class="gender-radio" />
              <span class="gender-label">男生</span>
            </label>
            <label class="gender-option">
              <input type="radio" v-model="state.userSex" value="1" class="gender-radio" />
              <span class="gender-label">女生</span>
            </label>
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
import { onMounted, reactive } from 'vue';
import { getUserinfo, updateUserInfo } from '@/api/user';
import { useRouter } from 'vue-router';

export default {
  name: 'setName',
  components: { Header, Footer, UserMenu },
  setup () {
    const router = useRouter()
    const state = reactive({
      userSex: "0",
    });

    // 获取用户信息
    const getUserInfo = async () => {
      const { data } = await getUserinfo();
      if (data.userSex !== null && data.userSex !== undefined) {
        state.userSex = data.userSex;
      } else {
        state.userSex = "0";
      }

    };

    // 处理性别修改逻辑
    const handleSubmit = async () => {
      await updateUserInfo({ userSex: state.userSex });
      router.back();
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

.form-item {
  margin-top: 34px;
  line-height: 1;
  padding: 5px 0 12px 0;
  display: flex;
  align-items: center;
}

.form-item label {
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 10px;
  color: #a6a6a6;
  font-size: 14px;
  flex-shrink: 0;
}

.gender-options {
  display: flex;
  align-items: center;
  gap: 20px;
}

.gender-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.gender-radio {
  width: 14px;
  height: 14px;
  margin-right: 10px;
  cursor: pointer;
}

.gender-label {
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.submit-btn {
  margin-left: 140px;
  margin-top: 30px;
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
</style>