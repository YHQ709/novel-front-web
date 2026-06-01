<template>
  <div class="topMain">
    <div class="box_center cf">
      <router-link :to="{ name: 'home' }" class="logo fl"><img :src="logo" alt="在线小说服务系统" /></router-link>
      <div class="searchBar fl">
        <div class="search cf">
          <input v-model="keyword" type="text" placeholder="书名、作者、关键字" class="s_int" v-on:keyup.enter="searchByK" />
          <label class="search_btn" id="btnSearch" @click="searchByK()"><i class="icon"></i></label>
        </div>
      </div>

      <div class="bookShelf fr" id="headerUserInfo">

        <router-link class="sj_link" :to="{ name: 'userFavorites' }">我的书架</router-link>
        <span v-if="!token" class="user_link"><i class="line mr20">|</i>
          <router-link :to="{ name: 'login' }" class="mr15">登录</router-link>
          <router-link :to="{ name: 'register' }" class="mr15">注册</router-link>
        </span>
        <span v-if="token" class="user_link"><i class="line mr20">|</i><router-link :to="{ name: 'userInfo' }"
            class="mr15">{{ nickName }}</router-link>
          <a @click="logout" href="javascript:void(0)">退出</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/images/logo.png";
// import logo from "@/assets/images/logo.jpg";
import { reactive, toRefs, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getToken, getNickName, removeToken, removeNickName, removeUid } from "@/utils/auth";
import { getUserinfo } from "@/api/user";
export default {
  name: "Top",
  setup (props, context) {
    const state = reactive({
      keyword: "",
      nickName: getNickName(),
      token: getToken(),
    });
    state.nickName = getNickName();
    state.token = getToken();
    const route = useRoute();
    const router = useRouter();
    state.keyword = route.query.key;
    // 从后端获取最新的用户信息
    const fetchUserInfo = async () => {
      const token = getToken();
      if (token) {
        try {
          const { data } = await getUserinfo();
          state.nickName = data.nickName;
          state.token = token;
        } catch (error) {
          console.error('获取用户信息失败', error);
          // 如果获取失败，尝试从 localStorage 读取
          state.nickName = getNickName() || "";
          state.token = token;
        }
      } else {
        state.nickName = "";
        state.token = "";
      }
    };
    const searchByK = () => {
      router.push({ path: "/bookclass", query: { key: state.keyword } });
      context.emit("eventSerch", state.keyword);
    };
    const logout = () => {
      removeToken();
      removeNickName();
      removeUid()
      state.nickName = "";
      state.token = "";
      router.push('/login')
    };

    // 监听路由变化，当从修改昵称页面返回时重新获取用户信息
    watch(
      () => route.fullPath,
      (newPath, oldPath) => {
        // 当从任何页面返回时，重新获取用户信息
        // 特别是从 setName 页面返回时
        if (oldPath && (oldPath.includes('/setName') || newPath !== oldPath)) {
          fetchUserInfo();
        }
      }
    );

    onMounted(() => {
      fetchUserInfo();
    });
    return {
      ...toRefs(state),
      logo,
      searchByK,
      logout,
    };
  },
};
</script>