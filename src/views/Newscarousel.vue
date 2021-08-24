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
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-newcarousel')">新增新聞輪播圖</b-button>
                </b-col>
                <b-table
                  id="my-table"
                  :items="newscarousel"
                  :fields="fields"
                  :striped="true"
                  ref="newcarouselTable"
                  head-variant="dark"
                  class="table-hover bka_tb"
                  :per-page="perPage"
                  :current-page="currentPage"
                  first-number
                  last-number
                >
                  <template #cell(hyperlink)="data">
                    <a :href= data.item.hyperlink class="d-inline-block text-truncate text-start" style="max-width: 400px;">{{ data.item.hyperlink }}</a>
                  </template>
                  <template #cell(image)="data">
                    <img v-if="data.item" :src="data.item.image" style="height: 50px" />
                  </template>
                  <template #cell(show)="data">
                    <img v-if="data.item.show"  src="../assets/icon/show.png" style="height: 23px"/>
                    <img v-else src="../assets/icon/noshow.png" style="height: 23px"/>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editNewcarousel(data.item, data.index, $event.target)" role="button" width="30%">
                    <!-- <b-btn variant="success" @click="editNewcarousel(data.item, data.index, $event.target)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
                <b-modal id="modal-newcarousel"
                  :title="form._id.length &gt; 0 ? '編輯輪播圖' : '新增輪播圖'"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <img-inputer
                    v-model="form.image"
                    theme="dark"
                    size="large"
                    placeholder="點擊或拖曳選擇圖片"
                    bottom-text="點擊或拖曳以修改">
                  </img-inputer>
                  <b-form-group
                    label="輪播超連結"
                    label-for="input-hyperlink"
                    :state="state.hyperlink"
                    description="輪播超連結長度限制為 1 個字以上"
                    invalid-feedback="輪播超連結格式不正確">
                    <b-form-input
                      id="input-hyperlink"
                      v-model="form.hyperlink"
                      type="text"
                      required="required"
                      placeholder="請輸入輪播超連結"
                      :state="state.hyperlink">
                    </b-form-input>
                  </b-form-group>
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
  name: 'newscarousel',
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
          text: '新聞輪播管理',
          active: true
        }
      ],
      perPage: 7,
      currentPage: 1,
      newscarousel: [],
      fields: [
        {
          key: 'image',
          label: '圖片'
        },
        {
          key: 'hyperlink',
          label: '輪播圖超連結'
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
        hyperlink: '',
        image: null,
        show: false,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        hyperlink: this.form.hyperlink.length === 0 ? null : true
      }
    },
    rows () {
      return this.newscarousel.length
    }
  },
  methods: {
    editNewcarousel (item, index) {
      this.form = {
        hyperlink: item.hyperlink,
        image: item.image,
        show: item.show,
        _id: item._id,
        index
      }
      this.$bvModal.show('modal-newcarousel')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        hyperlink: '',
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
          await this.axios.post('/newscarousel', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.newscarousel[this.newscarousel.length] = {
              hyperlink: this.form.hyperlink,
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
          this.$refs.newcarouselTable.refresh()
        } else {
          const { data } = await this.axios.patch('/newscarousel/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.newscarousel[this.form.index] = {
            hyperlink: this.form.hyperlink,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            show: this.form.show,
            _id: this.form._id
          }
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          this.$refs.newcarouselTable.refresh()
        }
        this.$bvModal.hide('modal-newcarousel')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
      this.submitDisable = false
    }
  },
  async mounted () {
    try {
      const { data } = await this.axios.get('/newscarousel/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.newscarousel = data.result.map(newscarousel => {
        if (newscarousel.image) {
          newscarousel.image = `${process.env.VUE_APP_API}/files/${newscarousel.image}`
        }
        return newscarousel
      })
    } catch (error) {
      console.log(error)
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得資料失敗'
      })
    }
  },
  components: {
    Sidebar
  }
}
</script>
