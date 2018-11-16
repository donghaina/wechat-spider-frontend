<template>
  <div class="page">
    <Card class="page-content">
      <h3 class="post-title">{{post.title}}</h3>
      <div>
        <span class="post-author">{{post.author || '佚名'}}</span>
        <span class="post-wx">{{post.wx_title}}</span>
        <span class="post-time">{{post.time}}</span>
      </div>
      <div v-html="post.html" class="post-detail"></div>
    </Card>
  </div>

</template>
<script>
  import "@/assets/style/commen.less";
  import uAxios from '@/libs/api'
  import moment from 'moment'

  export default {
    name: 'post_detail',
    data() {
      return {
        post_id: '',
        post: {}
      }
    },
    methods: {
      getPost(id) {
        uAxios('/api/post/' + id).then(res => {
          this.post = res.data.data;
          this.post.time = moment.unix(this.post.published_at).format('YYYY-MM-DD')
        })

      }
    },
    created() {
      this.post_id = this.$route.params.post_id;
      this.getPost(this.post_id)
    }
  }
</script>
<style lang="less">
  .post-title {
    text-align: center;
  }

  .post-author, .post-time {
    color: #999999;
  }

  .post-wx {
    color: #348EED;
    margin: 0 10px;
  }
  .post-detail *{
    box-sizing: border-box;
    max-width: 100%;
  }
  .post-detail {
    max-width: 100%;
    margin: 10px auto;
    img {
      width: 100%;
    }
  }
</style>
