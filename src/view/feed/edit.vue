<template>
  <div class="page">
    <Card class="page-content">
      <Form ref="feedForm" :model="feedForm" :rules="feedRule" label-position="right" :label-width="100"
            style="width: 400px">
        <FormItem prop="wx_id" label="公众号ID">
          <Input type="text" v-model="feedForm.wx_id" placeholder="请输入公众号ID">
          </Input>
        </FormItem>
        <FormItem prop="wx_title" label="公众号标题">
          <Input type="password" v-model="feedForm.wx_title" placeholder="请输入公众号标题">
          </Input>
        </FormItem>
        <FormItem prop="scraping_time" label="爬取时间">
          <TimePicker type="time" placeholder="请选择爬取时间" v-model="feedForm.scraping_time"></TimePicker>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('feedForm')">提交</Button>
        </FormItem>
      </Form>
    </Card>
  </div>

</template>
<script>
  import '@/assets/style/commen.less'
  import uAxios from '@/libs/api'

  export default {
    name: 'feed_create',
    data () {
      return {
        feed_id: '',
        feedForm: {
          wx_id: '',
          wx_title: '',
          scraping_time: '',
        },
        feedRule: {
          wx_id: [
            {required: true, message: '请输入公众号ID', trigger: 'blur'}
          ],
          wx_title: [
            {required: true, message: '请输入公众号标题', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleSubmit (name) {
        const _this = this
        _this.$refs[name].validate((valid) => {
          if (valid) {
            uAxios.post('/api/feed/' + _this.feed_id, _this.feedForm).then(res => {
              if (res.data.code === 1) {
                _this.$Message.success('修改公众号成功')
                setTimeout(() => {
                  _this.$router.push({
                    name: 'feed_list'
                  })
                }, 3000)
              }
            })
          }
        })
      },
      getFeed (feed_id) {
        const _this = this
        uAxios.get('/api/feed/' + feed_id).then(res => {
          // if (res.data.code === 1) {
          _this.feedForm = res.data.data
          // }
        })
      }
    },
    created () {
      this.feed_id = this.$route.params.feed_id
      this.getFeed(this.feed_id)
    }
  }
</script>
<style lang="less">

</style>
