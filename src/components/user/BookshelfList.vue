<template>
  <!-- 书架书籍列表 -->
  <div class="bookshelf-list">

    <!-- 有数据时显示 -->
    <div v-if="books.length > 0" class="bookshelf-content">
      <!-- 书架表格头部 -->
      <div class="bookshelf-header">
        <div class="header-item">类名</div>
        <div class="header-item">书名</div>
        <div class="header-item">最新章节</div>
        <div class="header-item">更新时间</div>
        <div class="header-item">{{ isFavoritesPage ? '操作' : '书签' }}</div>
      </div>

      <!-- 书架书籍内容 -->
      <div class="bookshelf-items">
        <div v-for="(item, index) in books" :key="item.bookId" class="book-item"
          :class="{ 'book-item-odd': (index + 1) % 2 === 0 }">
          <div class="book-info">
            <!-- 类名 -->
            <router-link :to="{
              path: '/bookclass',
              query: {
                categoryId: item.categoryId,
                workDirection: item.workDirection
              }
            }" class="book-category-col">
              [{{ item.categoryName }}]
            </router-link>

            <!-- 书名 -->
            <router-link :to="`/book/${item.bookId}`" class="book-name-col">
              {{ textFormat(item.bookName, 15) }}
            </router-link>

            <!-- 最新章节 -->
            <router-link :to="`/book/${item.bookId}/${item.lastChapterId}`" class="latest-chapter-col">
              {{ textFormat(item.lastChapterName, 15) }}
            </router-link>

            <!-- 更新时间 -->
            <div class="update-time-col">
              {{ item.updateTime ? dateFormat('mm/dd HH:MM', new Date(item.updateTime)) : '--' }}
            </div>

            <!-- 操作按钮区域 -->
            <div class="action-buttons-col">
              <!-- 继续阅读按钮（两个页面都显示） -->
              <router-link
                :to="item.preContentId ? `/book/${item.bookId}/${item.preContentId}` : `/book/${item.bookId}`"
                class="action-btn continue-read-btn">
                继续阅读
              </router-link>

              <!-- 移除书架按钮（只在favorites页面显示） -->
              <button v-if="isFavoritesPage" @click="handleRemove(item.bookId)" class="action-btn remove-btn">
                移除书架
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-bookshelf">
      <el-empty :description="emptyDescription" />
      <div class="empty-actions">
        <router-link to="/bookclass">
          <button class="empty-btn">
            去书城逛逛
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/index'

export default {
  name: 'BookshelfList',

  props: {
    // 书籍列表数据
    books: {
      type: Array,
      default: () => []
    },
    // 是否为favorites页面（用来区分表头文字和是否显示移除按钮）
    isFavoritesPage: {
      type: Boolean,
      default: false
    },
    // 空状态描述文字
    emptyDescription: {
      type: String,
      default: '书架空空如也，快去添加喜欢的书籍吧~'
    }
  },

  setup (props, { emit }) {
    // 处理移除书架操作
    const handleRemove = (bookId) => {
      emit('remove-from-shelf', bookId)
    }

    const textFormat = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }


    return {
      dateFormat,
      handleRemove,
      textFormat
    }
  }
}
</script>

<style scoped>
.bookshelf-list {
  border-radius: 0;
  border: none;
  font-size: 13px;
  margin-bottom: 10px;
}

/* 书架表格头部 */
.bookshelf-header {
  display: grid;
  grid-template-columns: 1fr 3fr 3.5fr 1.5fr 1fr;
  gap: 20px;
  padding: 14px 15px;
  background: #f9f9f9;
  color: #333;
}

.bookshelf-header .header-item:last-child {
  text-align: right;
  padding-right: 16px;
}

/* 书籍列表项 */
.book-item {
  display: grid;
  grid-template-columns: 1fr 3fr 3.5fr 1.5fr 1fr;
  gap: 20px;
  padding: 10px 15px;
  align-items: center;
  color: #333;
}

.book-item:hover {
  color: #f79415;
}

/* 奇数行背景色 */
.book-item-odd {
  background-color: #fafafa;
}

.book-info {
  display: contents;
}

.book-category-col {
  color: #666;
}

.book-category-col:hover {
  color: #e11c14;
}

.update-time-col {
  color: #999;
}

.action-buttons-col {
  text-align: right;
}

.action-btn {
  color: #333;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.continue-read-btn:hover {
  color: #f79415 !important;
}

.remove-btn:hover {
  color: #f79415 !important;
}

/* 空状态 */
.empty-bookshelf {
  text-align: center;
  padding: 40px 0;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.empty-actions {
  margin-top: 20px;
}

.el-empty {
  margin-bottom: 20px;
}

.empty-btn {
  background-color: #f80;
  color: #fff;
  padding: 5px 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}
</style>