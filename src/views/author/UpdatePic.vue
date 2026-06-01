<template>
  <div class="batch-update-pic">
    <!-- 添加一个按钮来打开对话框 -->
    <el-button type="primary" @click="showDialog">批量修改封面路径</el-button>

    <el-dialog title="批量修改封面路径" v-model="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="form" label-width="100px">
        <el-form-item label="替换前路径" required>
          <el-input v-model="form.oldPath" placeholder="例如：/localPic/" clearable>
            <template #prepend>http://...</template>
          </el-input>
          <div class="form-tip">需要被替换的旧路径片段</div>
        </el-form-item>

        <el-form-item label="替换后路径" required>
          <el-input v-model="form.newPath" placeholder="例如：/images/" clearable>
            <template #prepend>http://...</template>
          </el-input>
          <div class="form-tip">替换后的新路径片段</div>
        </el-form-item>

        <el-form-item label="预览效果">
          <div class="preview-box">
            <p><span class="preview-label">原路径示例：</span>
              <span class="old-path">{{ form.oldPath || '/localPic/' }}2020/12/03/xxx.jpg</span>
            </p>
            <p><span class="preview-label">新路径示例：</span>
              <span class="new-path">{{ form.newPath || '/images/' }}2020/12/03/xxx.jpg</span>
            </p>
            <p v-if="form.oldPath && form.newPath" class="preview-result">
              <span class="preview-label">替换后效果：</span>
              <span class="result-path">{{ previewResult }}</span>
            </p>
          </div>
        </el-form-item>

        <!-- 可选：添加作者选择（如果需要） -->
        <el-form-item label="选择作者" v-if="showAuthorSelect">
          <el-select v-model="form.authorId" placeholder="请选择作者" clearable filterable>
            <el-option v-for="item in authorList" :key="item.id" :label="item.penName" :value="item.id" />
          </el-select>
          <div class="form-tip">不选择则更新所有作者的作品</div>
        </el-form-item>

        <!-- 显示更新统计信息 -->
        <el-form-item label="影响范围" v-if="updateStats">
          <el-alert :title="`将更新 ${updateStats.bookCount} 本小说的封面路径`" type="info" :closable="false" show-icon />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchUpdate" :loading="loading" :disabled="!canUpdate">
            批量更新
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { updatePic } from '@/api/author';  // 导入你的 API
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'BatchUpdatePic',
  props: {
    // 接收作者ID（如果是在作者后台使用）
    authorId: {
      type: [String, Number],
      default: null
    },
    // 是否显示作者选择下拉框
    showAuthorSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        oldPath: '',
        newPath: '',
        authorId: this.authorId  // 使用传入的 authorId
      },
      authorList: [], // 作者列表（如果需要）
      updateStats: null // 更新统计信息
    };
  },
  computed: {
    // 是否可以执行更新
    canUpdate () {
      return this.form.oldPath && this.form.newPath && !this.loading;
    },
    // 预览替换结果
    previewResult () {
      if (!this.form.oldPath || !this.form.newPath) return '';
      const example = '/localPic/2020/12/03/xxx.jpg';
      return example.replace(this.form.oldPath, this.form.newPath);
    }
  },
  methods: {
    // 显示对话框
    showDialog () {
      this.dialogVisible = true;
      this.form.oldPath = '';
      this.form.newPath = '';
      this.form.authorId = this.authorId;
      this.updateStats = null;

      // 如果需要加载作者列表
      if (this.showAuthorSelect) {
        this.loadAuthorList();
      }
    },

    // 加载作者列表（如果需要）
    async loadAuthorList () {
      try {
        const { data } = await getAuthorList(); // 你需要实现这个API
        this.authorList = data;
      } catch (error) {
        console.error('加载作者列表失败', error);
      }
    },

    // 批量更新
    async batchUpdate () {
      if (!this.form.oldPath || !this.form.newPath) {
        ElMessage.warning('请填写完整的替换路径');
        return;
      }

      try {
        // 确认对话框
        await ElMessageBox.confirm(
          `确定要将所有封面路径中的 "${this.form.oldPath}" 替换为 "${this.form.newPath}" 吗？`,
          '确认更新',
          {
            confirmButtonText: '确定更新',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        this.loading = true;

        // 调用 API
        const response = await updatePic({
          oldPath: this.form.oldPath,
          newPath: this.form.newPath,
          authorId: this.form.authorId || undefined
        });

        // 处理响应
        if (response.code === '00000') {
          ElMessage.success('封面路径更新成功');
          this.dialogVisible = false;

          // 触发刷新事件
          this.$emit('update-success', response.data);
        } else {
          ElMessage.error(response.message || '更新失败');
        }
      } catch (error) {
        // 用户取消操作
        if (error === 'cancel') return;

        console.error('批量更新失败', error);
        ElMessage.error(error.response?.data?.message || '更新失败，请重试');
      } finally {
        this.loading = false;
      }
    },

    // 关闭对话框
    closeDialog () {
      this.dialogVisible = false;
    }
  },
  watch: {
    // 监听路径变化，实时预览
    'form.oldPath': function () {
      this.updateStats = null; // 清空统计，等待用户确认
    },
    'form.newPath': function () {
      this.updateStats = null;
    }
  }
};
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.preview-box {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 13px;
}

.preview-box p {
  margin: 8px 0;
}

.preview-label {
  color: #666;
  display: inline-block;
  width: 80px;
}

.old-path {
  color: #f56c6c;
  word-break: break-all;
}

.new-path {
  color: #67c23a;
  word-break: break-all;
}

.preview-result {
  border-top: 1px dashed #dcdfe6;
  padding-top: 8px;
  margin-top: 8px;
}

.result-path {
  color: #409eff;
  font-weight: bold;
  word-break: break-all;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>