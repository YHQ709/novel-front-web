<template>
  <Header />
  <div class="main box_center cf mb50">
    <div class="channelBookContent cf">
      <div class="wrap_left fl">
        <div class="wrap_bg">
          <!--评论回复区 start-->
          <div class="pad20">
            <div class="bookComment">
              <div class="book_tit">
                <div class="fl">
                  <h3>评论回复区</h3>
                  <span id="bookCommentTotal">({{ total }}条)</span>
                </div>
                <a class="fr" @click="goToAnchor('txtComment')" href="javascript:void(0)">发表回复</a>
              </div>
              <!-- 原评论内容显示区域 -->
              <div class="original_comment" v-if="commentDetail && commentDetail.commentContent">
                <div class="comment_content_only">
                  <p class="content_text" v-html="commentDetail.commentContent"></p>
                </div>
              </div>
              <div v-if="total == 0" class="no_comment" id="noCommentPanel">
                <img :src="no_comment" alt="" />
                <span class="block">暂无回复</span>
              </div>

              <div v-if="total > 0" class="commentBar" id="commentPanel">
                <div class="comment_list cf" v-for="(item, index) in newestReplies" :key="item.id">
                  <div class="user_heads fl" vals="389">
                    <img :src="item.replyUserPhoto
                      ? imgBaseUrl + item.replyUserPhoto
                      : man
                      " class="user_head" alt="" /><span class="user_level1" style="display: none">见习</span>
                  </div>
                  <ul class="pl_bar fr">
                    <li class="name">{{ item.replyUser }}</li>
                    <li class="dec" v-html="item.replyContent"></li>
                    <li class="other cf">
                      <span class="time fl">{{ getFloorNumber(index) }}楼 {{ timeAgo(item.replyTime) }}</span>
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
                  <span class="fl font16">发表回复</span>

                  <span class="fr black9" style="display: none">请先 <a class="orange" href="/user/login.html">登录</a><em
                      class="ml10 mr10">|</em><a class="orange" href="/user/register.html">注册</a></span>
                </div>

                <textarea v-model="replyContent" name="txtComment" rows="2" cols="20" id="txtComment"
                  class="replay_text" placeholder="我来说两句..."></textarea>
                <div class="reply_btn">
                  <span class="fl black9"><em class="ml5" id="emCommentNum">0/1000</em> 字</span>
                  <span class="fr"><a class="btn_ora" href="javascript:void(0);" @click="userCommentReply">发表</a></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--评论回复区 end-->
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
import { getCommentDetail, listNewestCommentReply } from "@/api/book";
import { commentReply } from "@/api/user";
import { getUid } from "@/utils/auth";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import author_head from "@/assets/images/author_head.png";
import no_comment from "@/assets/images/no_comment.png";
import { goToAnchor, timeAgo } from "@/utils";
export default {
  name: "bookCommentReply",
  components: {
    Header,
    Footer,
  },
  setup () {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      uid: getUid(),
      replyContent: "",
      commentDetail: {},
      newestReplies: {},
      imgBaseUrl: process.env.VUE_APP_BASE_IMG_URL,
      // 分页相关
      pageNum: 1,
      pageSize: 5,
      total: 0,
    });
    onMounted(() => {
      const commentId = route.params.commentId
      loadCommentDetail(commentId);
      loadNewestCommentReply(commentId)
    });

    const loadCommentDetail = async (commentId) => {
      const { data } = await getCommentDetail(commentId);
      state.commentDetail = data;
    };

    const loadNewestCommentReply = async (commentId) => {
      const { data } = await listNewestCommentReply({
        commentId: commentId,
        pageNum: state.pageNum,
        pageSize: state.pageSize
      });
      state.newestReplies = data.list;
      state.total = Number(data.total)
    };

    // 页码改变
    const handleCurrentChange = (pageNum) => {
      state.pageNum = pageNum;
      loadNewestCommentReply(route.params.commentId)
    };

    // 计算正确的楼层号
    const getFloorNumber = (index) => {
      // 当前页的起始楼层号 = 总回复数 - (当前页码-1) * 每页大小
      const startFloor = state.total - (state.pageNum - 1) * state.pageSize;
      // 当前页内的楼层号 = 起始楼层 - 当前索引
      return startFloor - index;
    };

    const userCommentReply = async () => {
      if (!state.replyContent) {
        ElMessage.error("用户回复不能为空！");
        return;
      }
      if (state.replyContent.length < 10) {
        ElMessage.error("回复不能少于 10 个字符！");
        return;
      }
      if (state.replyContent.length > 512) {
        ElMessage.error("回复不能多于 512 个字符！");
        return;
      }
      await commentReply({
        commentId: state.commentDetail.id,
        replyContent: state.replyContent,
      });
      state.replyContent = "";
      loadNewestCommentReply(state.commentDetail.id);
    };

    return {
      ...toRefs(state),
      author_head,
      no_comment,
      goToAnchor,
      timeAgo,
      userCommentReply,
      man,
      handleCurrentChange,
      getFloorNumber
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

.original_comment {
  background-color: #fafafa;
  padding: 18px;
  margin-bottom: 20px;
  border-left: 5px solid #f80;
}

.comment_content_only {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.content_text {
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
