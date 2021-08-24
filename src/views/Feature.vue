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
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-feature')">新增特色</b-button>
                </b-col>
                <b-table
                  :items="features"
                  :fields="fields"
                  :striped="true"
                  ref="featureTable"
                  head-variant="dark"
                  class="table-hover bka_tb"
                >
                  <template #cell(image)="data">
                    <img v-if="data.item" :src="data.item.image" style="height: 50px" /></template>
                  <template #cell(show)="data">
                    <img v-if="data.item.show"  src="../assets/icon/show.png" style="height: 23px"/>
                    <img v-else src="../assets/icon/noshow.png" style="height: 23px"/>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editFeature(data.index)" role="button" width="20%">
                    <!-- <b-btn variant="success" @click="editFeature(data.index)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-modal id="modal-feature"
                  :title="form._id.length &gt; 0 ? '編輯特色' : '新增特色'"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <b-form-group
                    label="特色標題"
                    label-for="input-title"
                    :state="state.title"
                    description="特色標題長度限制為 1 個字以上"
                    invalid-feedback="特色標題格式不正確">
                    <b-form-input
                      id="input-title"
                      v-model="form.title"
                      type="text"
                      required="required"
                      placeholder="請輸入特色標題"
                      :state="state.title">
                    </b-form-input>
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
  name: 'feature',
  data () {
    return {
      items: [
        {
          text: '首頁',
          href: '/#/admin'
        },
        {
          text: '特色管理',
          active: true
        }
      ],
      features: [],
      fields: [
        {
          key: 'title',
          label: '標題'
        },
        {
          key: 'image',
          label: '圖片'
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
        image: null,
        show: false,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        title: this.form.title.length === 0 ? null : true
      }
    }
  },
  methods: {
    editFeature (index) {
      this.form = {
        title: this.features[index].title,
        image: this.features[index].image,
        show: this.features[index].show,
        _id: this.features[index]._id,
        index
      }
      this.$bvModal.show('modal-feature')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        title: '',
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
          await this.axios.post('/features', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.features[this.features.length] = {
              title: this.form.title,
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
          this.$refs.featureTable.refresh()
        } else {
          const { data } = await this.axios.patch('/features/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.features[this.form.index] = {
            title: this.form.title,
            _id: this.form._id,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            show: this.form.show
          }
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          console.log(this.features[this.form.index])
          this.$refs.featureTable.refresh()
        }
        this.$bvModal.hide('modal-feature')
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
      const { data } = await this.axios.get('/features/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.features = data.result.map(feature => {
        if (feature.image) {
          feature.image = `${process.env.VUE_APP_API}/files/${feature.image}`
        }
        return feature
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得國家失敗'
      })
    }
  },
  components: {
    Sidebar
  }
}
</script>
