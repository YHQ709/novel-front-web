<template>
  <Header />
  <div class="main box_center cf mb50">
    <div class="channelBookContent cf">
      <div class="wrap_left fl">
        <div class="wrap_bg">
          <!--作品评论区 start-->
          <div class="pad20">
            <div class="bookComment">
              <div class="book_tit">
                <div class="fl">
                  <h3>作品评论区</h3>
                  <span id="bookCommentTotal">({{ total }}条)</span>
                </div>
                <a class="fr" @click="goToAnchor('txtComment')" href="javascript:void(0)">发表评论</a>
              </div>
              <div v-if="total == 0" class="no_comment" id="noCommentPanel">
                <img :src="no_comment" alt="" />
                <span class="block">暂无评论</span>
              </div>
              <div v-if="total > 0" class="commentBar" id="commentPanel">
                <div class="comment_list cf" v-for="item in newestComments" :key="item.id">
                  <div class="user_heads fl" vals="389">
                    <img :src="item.commentUserPhoto
                      ? imgBaseUrl + item.commentUserPhoto
                      : man
                      " class="user_head" alt="" /><span class="user_level1" style="display: none">见习</span>
                  </div>
                  <ul class="pl_bar fr">
                    <li class="name">{{ item.commentUser }}</li>
                    <li class="dec" v-html="item.commentContent"></li>
                    <li class="other cf">
                      <span class="time fl">{{ timeAgo(item.commentTime) }}</span><span class="fr">
                        <router-link :to="`/book/comment/reply/${bookId}/${item.id}`" class="zan">回复<i class="num">({{
                          item.replyCount || 0 }})</i></router-link>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 分页组件 -->
              <el-pagination v-if="total > 0" small layout="prev, pager, next" :background="true" :page-size="pageSize"
                :total="total" class="mt-4" @current-change="handleCurrentChange" />

              <!--无评论时此处隐藏-->
              <div class="more_bar" id="moreCommentPanel" style="display: none">
                <a href="/book/comment-1431636283466297344.html">查看全部评论&gt;</a>
              </div>

              <div class="reply_bar" id="reply_bar">
                <div class="tit">
                  <span class="fl font16">发表评论</span>

                  <span class="fr black9" style="display: none">请先 <a class="orange" href="/user/login.html">登录</a><em
                      class="ml10 mr10">|</em><a class="orange" href="/user/register.html">注册</a></span>
                </div>

                <textarea v-model="commentContent" name="txtComment" rows="2" cols="20" id="txtComment"
                  class="replay_text" placeholder="我来说两句..."></textarea>
                <div class="reply_btn">
                  <span class="fl black9"><em class="ml5" id="emCommentNum">0/1000</em> 字</span>
                  <span class="fr"><a class="btn_ora" href="javascript:void(0);" @click="userComment">发表</a></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--作品评论区 end-->
      </div>
      <div class="wrap_right fr">
        <!--作者专栏s-->
        <div class="wrap_inner author_info mb20">
          <div class="author_head cf">
            <a href="javascript:void(0);" class="head"><img :src="author_head" alt="作者头像" id="authorLogoImg" /></a>
            <div class="msg">
              <span class="icon_qyzz">签约作家</span>
              <h4>
                <a href="javascript:searchByK('冷漠的天蝎')">{{
                  book.authorName
                }}</a>
              </h4>
            </div>
          </div>
          <div class="author_intro cf">
            <h4>作者有话说</h4>
            <div class="intro_txt" id="authorNote">
              亲亲们，你们的支持是我最大的动力！求点击、求推荐、求书评哦！
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import "@/assets/styles/book.css";
import man from "@/assets/images/man.png";
import { reactive, toRefs, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { getBookById, listNewestComments } from "@/api/book";
import { comment, deleteComment, updateComment } from "@/api/user";
import { getUid } from "@/utils/auth";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import author_head from "@/assets/images/author_head.png";
import no_comment from "@/assets/images/no_comment.png";
import { goToAnchor, timeAgo } from "@/utils";
export default {
  name: "bookComment",
  components: {
    Header,
    Footer,
  },
  setup () {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      uid: getUid(),
      book: {},
      bookId: "",
      commentContent: "",
      newestComments: {},
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      dialogUpdateCommentFormVisible: false,
      commentId: "",
      updateComment: "",
      // 分页相关
      pageNum: 1,
      pageSize: 5,
      total: 0,
    });
    onMounted(() => {
      const bookId = route.params.bookId;
      loadBook(bookId);
      loadNewestComments(bookId);
    });

    const loadNewestComments = async (bookId) => {
      const { data } = await listNewestComments({
        bookId: bookId,
        pageNum: state.pageNum,
        pageSize: state.pageSize
      });
      state.newestComments = data.list;
      state.total = Number(data.total)
    };

    // 页码改变
    const handleCurrentChange = (pageNum) => {
      state.pageNum = pageNum;
      listNewestComments(route.params.bookId)
    };

    const userComment = async () => {
      if (!state.commentContent) {
        ElMessage.error("用户评论不能为空！");
        return;
      }
      if (state.commentContent.length < 10) {
        ElMessage.error("评论不能少于 10 个字符！");
        return;
      }
      if (state.commentContent.length > 512) {
        ElMessage.error("评论不能多于 512 个字符！");
        return;
      }
      await comment({
        bookId: state.book.id,
        commentContent: state.commentContent,
      });
      state.commentContent = "";
      loadNewestComments(state.book.id);
    };

    const updateUserComment = async (id, comment) => {
      state.dialogUpdateCommentFormVisible = true;
      state.updateComment = comment;
      state.commentId = id;
    };

    const deleteUserComment = async (id) => {
      await deleteComment(id);
      loadNewestComments(state.book.id);
    };

    const goUpdateComment = async (id) => {
      state.dialogUpdateCommentFormVisible = false;
      await updateComment(state.commentId, { content: state.updateComment });
      loadNewestComments(state.book.id);
    };

    const loadBook = async (bookId) => {
      const { data } = await getBookById(bookId);
      state.book = data;
      state.bookId = data.id;
    };

    return {
      ...toRefs(state),
      author_head,
      no_comment,
      goToAnchor,
      timeAgo,
      userComment,
      deleteUserComment,
      man,
      updateUserComment,
      goUpdateComment,
      loadBook,
      handleCurrentChange
    };
  },
  mounted () {
    $(".icon_show").click(function () {
      $(this).hide();
      $(".icon_hide").show();
      $(".intro_txt").innerHeight("auto");
    });
    $(".icon_hide").click(function () {
      $(this).hide();
      $(".icon_show").show();
      $(".intro_txt").innerHeight("");
    });

    $("#AuthorOtherNovel li").unbind("mouseover");

    $("#txtComment").on("input propertychange", function () {
      var count = $(this).val().length;
      $("#emCommentNum").html(count + "/1000");
      if (count > 1000) {
        $("#txtComment").val($("#txtComment").val().substring(0, 1000));
      }
    });
  },
};
</script>

<style scoped>
:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #f80 !important;
}

:deep(.el-pagination) {
  --el-pagination-hover-color: #f80 !important;
}

.el-button:not(.is-text) {
  border: #f80;
  border-color: #f80;
}

.el-button--primary {
  --el-button-hover-bg-color: #f80;
}

.el-button--primary {
  --el-button-bg-color: #f70;
}

.el-button {
  --el-button-hover-text-color: #fafafa;
}

.el-button {
  --el-button-hover-bg-color: #ff880061;
}
</style>
