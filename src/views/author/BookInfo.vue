<template>
  <AuthorHeader />
  <div class="main box_center cf">
    <div class="userBox cf">
      <div class="my_l">
        <ul class="log_list">
          <li>
            <router-link class="link_4 on" :to="{ name: 'authorBookList' }">小说管理</router-link>
          </li>
        </ul>
      </div>
      <div class="my_r">
        <div class="my_bookshelf">
          <div class="title cf">
            <h2 class="fl">作品信息 - {{ bookInfo?.bookName }}</h2>
          </div>

          <div class="book-info-form">
            <el-form :model="bookInfo" label-width="100px" ref="formRef" v-if="bookInfo.id">

              <el-form-item label="作品封面">
                <div class="cover-upload">
                  <img alt="作品封面" :src="bookInfo.picUrl ? (imgBaseUrl + bookInfo.picUrl) : pic" class="cover-preview">
                  <el-upload class="cover-uploader" :action="baseUrl + '/front/resource/image'" :show-file-list="false"
                    :before-upload="beforeCoverUpload" :on-success="handleCoverSuccess">
                    <el-button class="redBtn" size="small">更换封面</el-button>
                  </el-upload>
                </div>
              </el-form-item>

              <el-form-item label="作品方向">
                <el-radio-group v-model="bookInfo.workDirection" disabled>
                  <el-radio label="0">男频</el-radio>
                  <el-radio label="1">女频</el-radio>
                </el-radio-group>
                <div class="form-tip">作品方向不可修改</div>
              </el-form-item>

              <el-form-item label="作品名称">
                <el-input v-model="bookInfo.bookName" placeholder="请输入作品名称" maxlength="50" show-word-limit />
              </el-form-item>

              <el-form-item label="作品分类">
                <el-select v-model="bookInfo.categoryId" placeholder="请选择分类" filterable @change="handleCategoryChange">
                  <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <span class="category-name" v-if="bookInfo.categoryName">当前分类：{{ bookInfo.categoryName }}</span>
              </el-form-item>

              <el-form-item label="作品简介">
                <el-input type="textarea" v-model="bookInfo.bookDesc" :rows="6" placeholder="请输入作品简介" maxlength="500"
                  show-word-limit />
              </el-form-item>

              <el-form-item label="作品状态">
                <el-radio-group v-model="bookInfo.bookStatus">
                  <el-radio label="0">连载中</el-radio>
                  <el-radio label="1">已完结</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 操作按钮 -->
              <el-form-item class="form-actions">
                <el-button class="redBtn" @click="saveBookInfo">保存修改</el-button>
                <el-button class="redBtn" @click="resetForm">重置</el-button>
                <el-button class="redBtn" @click="confirmDeleteBook">删除小说</el-button>
              </el-form-item>
            </el-form>

            <!-- 空状态显示 -->
            <el-empty v-else description="暂无小说信息" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pic from "@/assets/images/default.gif";
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getBook, listCategorys, updateBook, deleteBook } from "@/api/author";
import AuthorHeader from "@/components/author/Header.vue";

export default {
  name: "BookInfo",
  components: {
    AuthorHeader,
  },
  setup () {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      bookId: route.query.id,
      picUrl: "",
      bookInfo: {}, // 空对象初始化
      categories: [],
      originalBookInfo: null,
      baseUrl: process.env.VUE_APP_BASE_API_URL,
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
    });

    onMounted(() => {
      loadBookInfo();
    });

    const loadBookInfo = async () => {
      const res = await getBook(state.bookId);
      state.bookInfo = res.data;
      console.log(state.bookInfo)
      // 保存原始数据用于重置
      state.originalBookInfo = JSON.parse(JSON.stringify(state.bookInfo));
      // 加载分类
      loadCategories(res.data.workDirection);

    };

    const loadCategories = async (workDirection) => {

      const res = await listCategorys({ workDirection });
      state.categories = res.data;

    };

    const handleCategoryChange = (categoryId) => {
      const selected = state.categories.find(c => c.id === categoryId);
      if (selected) {
        state.bookInfo.categoryName = selected.name;
      }
    };

    const beforeCoverUpload = (rawFile) => {
      if (rawFile.type !== "image/jpeg") {
        ElMessage.error("必须上传 JPG 格式的图片!");
        return false;
      } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error("图片大小最多 5MB!");
        return false;
      }
      return true;
    };
    const handleCoverSuccess = (response, uploadFile) => {
      state.bookInfo.picUrl = response.data;
    };


    const saveBookInfo = async () => {
      // 检查 bookInfo 是否为空
      if (Object.keys(state.bookInfo).length === 0) {
        ElMessage.warning('没有可保存的数据');
        return;
      }

      // 表单验证
      if (!state.bookInfo.bookName?.trim()) {
        ElMessage.warning('请输入作品名称');
        return;
      }
      if (!state.bookInfo.categoryId) {
        ElMessage.warning('请选择作品分类');
        return;
      }
      if (!state.bookInfo.bookDesc?.trim()) {
        ElMessage.warning('请输入作品简介');
        return;
      }


      // 准备要提交的数据
      const submitData = {
        categoryId: Number(state.bookInfo.categoryId),
        categoryName: state.bookInfo.categoryName,
        picUrl: state.bookInfo.picUrl,
        bookName: state.bookInfo.bookName,
        bookDesc: state.bookInfo.bookDesc,
        bookStatus: Number(state.bookInfo.bookStatus)
      };

      await updateBook(state.bookInfo.id, submitData);
      ElMessage.success('更新成功');

      router.push({ name: 'authorBookList' });
    };

    const resetForm = () => {
      if (!state.originalBookInfo) return;

      ElMessageBox.confirm('确定要重置所有修改吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        state.bookInfo = JSON.parse(JSON.stringify(state.originalBookInfo));
        ElMessage.success('已重置');
      }).catch(() => { });
    };

    const confirmDeleteBook = () => {
      ElMessageBox.confirm(
        `确定要删除小说《${state.bookInfo.bookName}》吗？<br>删除后将无法恢复，所有章节数据将一并删除！`,
        '警告',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'error',
          dangerouslyUseHTMLString: true
        }
      ).then(async () => {
        await deleteBookFunc();
      }).catch(() => { });
    };

    const deleteBookFunc = async () => {
      await deleteBook(state.bookId);
      ElMessage.success('删除成功');
      router.push({ name: 'authorBookList' });

    };


    return {
      ...toRefs(state),
      pic,
      beforeCoverUpload,
      handleCoverSuccess,
      handleCategoryChange,
      saveBookInfo,
      resetForm,
      confirmDeleteBook,
    };
  }
};
</script>

<style scoped>
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #f80;
  border-color: #f80;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #f80;
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

.book-info-form {
  padding-top: 10px;
}

.cover-upload {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cover-preview {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 4px;
}

.cover-uploader {
  display: inline-block;
}

.category-name {
  margin-left: 10px;
  color: #999;
  font-size: 13px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  margin-left: 10px;
}

.stat-item {
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.stat-label {
  color: #999;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-value {
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions .el-button {
  min-width: 100px;
  margin: 0 10px;
}

.redBtn {
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid #f80;
  background: #f80;
  color: #fff;
  display: inline-block;
  text-decoration: none;
}

.redBtn:hover {
  background: #ff9933;
  border-color: #ff9933;
  color: #fff;
}
</style>