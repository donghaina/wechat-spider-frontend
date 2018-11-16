<template>
  <div class="page">
    <Card class="page-content">
      <section class="option-line">
        <div>
          <Select size="small" v-model="wx_id" placeholder="请选择公众号" style="width:150px" clearable filterable>
            <Option v-for="item in feedOptions" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
          <DatePicker type="date" placeholder="请选择日期" v-model="update_date"
                      @on-change="handleChange" size="small"></DatePicker>
          <Button type="primary" @click="handleGetData" size="small">获取指定日期公众号更新</Button>
        </div>
        <Button type="primary" @click="handleGetTodayData" size="small">获取今日所有公众号更新</Button>

      </section>
      <Table :columns="feed_columns" :data="feed_list" border></Table>
      <div class="pagination">
        <Page :total="total" @on-change="handlePage"/>
      </div>

    </Card>
  </div>

</template>
<script>
  import '@/assets/style/commen.less'
  import uAxios from '@/libs/api'
  import moment from 'moment'

  export default {
    name: 'feed_list',
    data() {
      return {
        wx_id: 'all',
        feedOptions: [],
        update_date: '',
        feed_columns: [
          {
            title: '公众号ID',
            key: 'wx_id',
            align: 'center'
          },
          {
            title: '公众号标题',
            key: 'wx_title',
            align: 'center'
          },
          {
            title: '爬取时间',
            key: 'scraping_time',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 220,
            align: 'center',
            render: (h, params) => {
              let _this = this
              return h('div', [
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
                      _this.$router.push({
                        name: 'feed_post_list',
                        params: {
                          wx_id: params.row.wx_id
                        }
                      })
                    }
                  }
                }, '查看文章列表'),
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
                      _this.$router.push({
                        name: 'feed_edit',
                        params: {
                          feed_id: params.row.id
                        }
                      })
                    }
                  }
                }, '编辑'),
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
                          uAxios.delete('/api/feed/' + params.row.id).then(res => {
                            _this.getFeedList(1)
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
        ],
        feed_list: [],
        all_feed_list: [],
        current_page: 1,
        total: 1,
      }
    },
    methods: {
      handlePage(num) {
        this.current_page = num;
        this.getFeedList(num)
      },
      getAllFeedList() {
        uAxios('/api/all/feed').then(res => {
          let result = res.data.data;
          this.all_feed_list = result;
          this.feedOptions = result.map(item => {
            return {
              label: item.wx_title,
              value: item.wx_id
            }
          });
          this.feedOptions.unshift({
            label: '全部',
            value: 'all'
          })
        })
      },
      handleChange(date) {
        console.log(date);
        // this.formValidate.on_day = date;
      },
      getFeedList(page) {
        uAxios('/api/feed', {
          params: {
            page: page
          }
        }).then(res => {
          let result = res.data.data;
          this.feed_list = result.feed_list;
          this.total = result.total;
          this.current_page = result.page
        })
      },
      handleGetData() {
        let feed_list = [];
        if (this.wx_id === 'all') {
          feed_list = this.all_feed_list.map(item => {
            return item.wx_title
          })
        } else {
          feed_list = [this.wx_id]
        }
        let update_date = moment(this.update_date).format('YYYY-MM-DD');
        uAxios.get('/api/data', {
          params: {
            feed_list: feed_list.join(','),
            update_date: update_date
          }
        }).then(res => {
          if (res.data.code === 1) {
            this.$Message.success(res.data.msg)
          }
        })
      },
      handleGetTodayData() {
        let feed_list = this.all_feed_list.map(item => {
          return item.wx_title
        });
        let update_date = moment().format('YYYY-MM-DD');
        uAxios.get('/api/data', {
          params: {
            feed_list: feed_list.join(','),
            update_date: update_date
          }
        }).then(res => {
          if (res.data.code === 1) {
            this.$Message.success(res.data.msg)
          }
        })
      }
    },
    created() {
      this.getFeedList(1);
      this.getAllFeedList();
    }
  }
</script>
<style lang="less">
  .option-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
</style>
