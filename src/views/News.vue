<template>
<div class="back_body">
  <div class="wrapper">
    <Sidebar></Sidebar>
    <div class="main-panel">
      <b-breadcrumb class="bread-default d-flex align-items-center" :items="items"></b-breadcrumb>
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card d-flex justify-content-between align-items-center">
                <b-col class="my-4 w-75 mx-5 d-flex justify-content-between align-items-center">
                  <div class="d-flex w-50">
                  <span class="w-50 my-2">新聞類別查詢</span>
                    <b-form-select v-model="filter" :options="options" class="mb-2">
                      <template #first>
                        <b-form-select-option :value="null">全部</b-form-select-option>
                      </template>
                    </b-form-select>
                  </div>
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-new')">新增新聞</b-button>
                </b-col>
                <b-table
                  id="my-table"
                  :items="news"
                  :fields="fields"
                  :striped="true"
                  ref="newTable"
                  head-variant="dark"
                  class="table-hover bka_tb"
                  :per-page="perPage"
                  :current-page="currentPage"
                  first-number
                  last-number
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  @filtered="onFiltered"
                >
                  <template #cell(category)="data">
                    <span v-if='data.item.category == 0'>資訊</span>
                    <span v-else-if='data.item.category == 1'>公告</span>
                    <span v-else >活動</span>
                  </template>
                  <template #cell(image)="data">
                    <img v-if="data.item" :src="data.item.image" style="height: 50px; width:100px" />
                  </template>
                  <template #cell(content)="data">
                     <span class="d-inline-block text-truncate text-start" style="max-width: 400px;">{{ data.item.content }}</span>
                  </template>
                  <template #cell(show)="data">
                    <img v-if="data.item.show"  src="../assets/icon/show.png" style="height: 23px"/>
                    <img v-else src="../assets/icon/noshow.png" style="height: 23px"/>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editNew(data.item, data.index, $event.target)" role="button" width="50%">
                    <!-- <b-btn variant="success" @click="editNew(data.item, data.index, $event.target)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
                <b-modal id="modal-new"
                  :title="form._id.length &gt; 0 ? '編輯新聞' : '新增新聞'"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <b-form-group
                    label="新聞標題"
                    label-for="input-title"
                    :state="state.title"
                    description="新聞標題長度限制為 1 個字以上"
                    invalid-feedback="新聞標題格式不正確">
                    <b-form-input
                      id="input-title"
                      v-model="form.title"
                      type="text"
                      required="required"
                      placeholder="請輸入新聞標題"
                      :state="state.title">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="新聞內容"
                    label-for="input-content">
                    <b-form-textarea
                      id="input-content"
                      v-model="form.content"
                      type="text"
                      placeholder="請輸入新聞內容">
                    </b-form-textarea>
                  </b-form-group>
                  <b-form-group
                    label="類別"
                  >
                    <b-form-select v-model="form.category" :options="category" class="mb-3">
                      <template #first>
                        <option value="" disabled>-- 請選擇 --</option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <img-inputer
                    v-model="form.image"
                    theme="dark"
                    size="large"
                    placeholder="點擊或拖曳選擇圖片"
                    bottom-text="點擊或拖曳以修改">
                  </img-inputer>
                  <b-form-group
                    label="顯示"
                    label-for="input-show">
                      <b-form-radio v-model="form.show" :value="true">顯示</b-form-radio>
                      <b-form-radio v-model="form.show" :value="false">未顯示</b-form-radio>
                  </b-form-group>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Sidebar from './Sidebar.vue'
export default {
  name: 'news',
  data () {
    return {
      items: [
        {
          text: '首頁',
          href: '/#/admin'
        },
        {
          text: '新聞管理',
          href: '#'
        },
        {
          text: '新聞文章管理',
          active: true
        }
      ],
      filter: null,
      filterOn: ['category'],
      perPage: 7,
      currentPage: 1,
      totalRows: 1,
      news: [],
      options: [
        { value: '0', text: '資訊' },
        { value: '1', text: '公告' },
        { value: '2', text: '活動' }
      ],
      category: [
        { value: 0, text: '資訊' },
        { value: 1, text: '公告' },
        { value: 2, text: '活動' }
      ],
      fields: [
        {
          key: 'image',
          label: '圖片'
        },
        {
          key: 'title',
          label: '新聞標題'
        },
        {
          key: 'content',
          label: '新聞內容'
        },
        {
          key: 'category',
          label: '類別'
        },
        {
          key: 'show',
          label: '顯示/未顯示'
        },
        {
          key: 'action',
          label: '操作'
        }
      ],
      submitDisable: false,
      form: {
        title: '',
        content: '',
        category: '',
        image: null,
        show: false,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        title: this.form.title.length === 0 ? null : true,
        content: this.form.content.length === 0 ? null : true
      }
    }
  },
  methods: {
    editNew (item, index) {
      this.form = {
        title: item.title,
        content: item.content,
        category: item.category,
        image: item.image,
        show: item.show,
        _id: item._id,
        index
      }
      this.$bvModal.show('modal-new')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        title: '',
        content: '',
        category: '',
        image: null,
        show: false,
        _id: ''
      }
    },
    async submitModal () {
      this.submitDisable = true
      try {
        const fd = new FormData()
        for (const key in this.form) {
          fd.append(key, this.form[key])
        }
        if (this.form._id.length === 0) {
          console.log(this.form)
          await this.axios.post('/news', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.news[this.news.length] = {
              title: this.form.title,
              content: this.form.content,
              category: this.form.category,
              image: `${process.env.VUE_APP_API}/files/${response.data.result.image}`,
              show: this.form.show,
              _id: response.data.result._id
            }
            this.form._id = response.data.result._id
          })
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '新增成功'
          })
          this.$refs.newTable.refresh()
        } else {
          const { data } = await this.axios.patch('/news/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.news[this.form.index] = {
            title: this.form.title,
            content: this.form.content,
            category: this.form.category,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            show: this.form.show,
            _id: this.form._id
          }
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          this.$refs.newTable.refresh()
        }
        this.$bvModal.hide('modal-new')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
      this.submitDisable = false
    },
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/news/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.news = data.result.map(news => {
        if (news.image) {
          news.image = `${process.env.VUE_APP_API}/files/${news.image}`
        }
        return news
      })
    } catch (error) {
      console.log(error)
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得資料失敗'
      })
    }
    this.totalRows = this.news.length
  },
  components: {
    Sidebar
  }
}
</script>
