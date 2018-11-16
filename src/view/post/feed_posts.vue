<template>
  <div class="page">
    <Card class="page-content">
      <Tabs v-model="activeTab">
        <TabPane label="已采用" name="1">
          <Table :columns="post_columns" :data="post_list" border></Table>
        </TabPane>
        <TabPane label="未采用" name="0">
          <Table :columns="post_columns" :data="post_list" border></Table>
        </TabPane>
      </Tabs>
      <div class="pagination">
        <Page :total="total" @on-change="handlePage"/>
      </div>
    </Card>

    <Modal
      v-model="showModal"
      title="请选择合适的标签"
      @on-ok="handleOk"
      @on-cancel="handleCancel">
      <Tag v-for="(item,index) in tagList" :key="index" :name="item" closable @on-close="handleClose">{{ item }}</Tag>
      <Input v-model="newTag" placeholder="请输入新的标签" size="small" style="width: 100px" @on-enter="handleAdd"/>
    </Modal>
  </div>

</template>
<script>
  import '@/assets/style/commen.less'
  import uAxios from '@/libs/api'
  import moment from 'moment'

  export default {
    name: 'list',
    data() {
      return {
        activeTab: '0',
        currentPostId: '',
        newTag: '',
        wx_id: '',
        showModal: false,
        tagList: [],
        post_columns: [
          {
            title: '文章标题',
            key: 'title',
            align: 'center'
          },
          {
            title: '发布时间',
            key: 'published_at',
            align: 'center',
            width: 100,
          },
          {
            title: '标签',
            key: 'keywords',
            align: 'center',
          },
          {
            title: '操作',
            key: 'action',
            maxWidth: 200,
            align: 'center',
            render: (h, params) => {
              let _this = this;
              if(_this.activeTab==='0'){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        _this.tagList = params.row.keywords.split(',')
                        _this.currentPostId = params.row.id
                        _this.showModal = true
                      }
                    }
                  }, '打标签'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        uAxios.post('/api/post/' + params.row.id + '/mark', {
                          is_marked: 1
                        }).then(res => {
                          if (res.data.code === 1) {
                            _this.$Message.success('文章标记成功')
                            this.getPostList(this.wx_id)
                          }
                        })
                      }
                    }
                  }, '采用'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        _this.$Modal.confirm({
                          title: '提示',
                          content: '确认删除该数据?',
                          onOk: () => {
                            uAxios.delete('/api/post/' + params.row.id).then(res => {
                              _this.getPostList()
                              _this.$Message.success('删除成功！')
                            })
                          },
                          onCancel: () => {
                            _this.$Message.info('取消删除啊')
                          }
                        })
                      }
                    }
                  }, '删除')
                ])
              }else{
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        _this.$Modal.confirm({
                          title: '提示',
                          content: '确认删除该数据?',
                          onOk: () => {
                            uAxios.delete('/api/post/' + params.row.id).then(res => {
                              _this.getPostList()
                              _this.$Message.success('删除成功！')
                            })
                          },
                          onCancel: () => {
                            _this.$Message.info('取消删除啊')
                          }
                        })
                      }
                    }
                  }, '删除')
                ])
              }
            }
          }
        ],
        post_list: [],
        current_page: 1,
        total: 1
      }
    },
    watch: {
      activeTab: {
        handler() {
          this.getPostList(this.wx_id,1)
        }
      }
    },
    methods: {
      handlePage(num) {
        this.current_page = num;
        this.getPostList(this.wx_id, num)
      },
      handleAdd() {
        if (this.tagList.length) {
          this.tagList.push(this.newTag)
          this.newTag = ''
        } else {
          this.tagList.push(0)
        }
      },
      handleClose(event, name) {
        const index = this.tagList.indexOf(name)
        this.tagList.splice(index, 1)
      },
      handleOk() {
        uAxios.post('/api/post/' + this.currentPostId + '/tag', {
          keywords: this.tagList.join(',')
        }).then(res => {
          if (res.data.code === 1) {
            this.$Message.success('标签修改成功')
            this.getPostList(this.wx_id)
          }
        })
        this.showModal = true
      },
      handleCancel() {
        this.showModal = false
      },
      getPostList(wx_id, page) {
        uAxios.get('/api/' + wx_id + '/post', {
            params: {
              is_marked: parseInt(this.activeTab),
              page: page
            }
          }
        ).then(res => {
          let result = res.data.data;
          this.post_list = result.post_list;
          this.total = result.total;
          this.post_list.forEach(item => {
            item.published_at = moment.unix(item.published_at).format('YYYY-MM-DD')
          })
        })
      }
    },
    created() {
      this.wx_id = this.$route.params.wx_id;
      this.getPostList(this.wx_id, 1)
    }
  }
</script>
<style lang="less">

</style>
