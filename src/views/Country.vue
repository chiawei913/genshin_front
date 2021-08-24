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
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-country')">新增國家</b-button>
                </b-col>
                <b-table
                  :items="countries"
                  :fields="fields"
                  :striped="true"
                  ref="countryTable"
                  head-variant="dark"
                  class="table-hover bka_tb"
                >
                  <template #cell(image)="data">
                    <img v-if="data.item" :src="data.item.image" style="height: 50px" /></template>
                  <template #cell(description)="data">
                     <span class="d-inline-block text-truncate text-start" style="max-width: 400px;">{{ data.item.description }}</span>
                  </template>
                  <template #cell(show)="data">
                    <img v-if="data.item.show"  src="../assets/icon/show.png" style="height: 23px"/>
                    <img v-else src="../assets/icon/noshow.png" style="height: 23px"/>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editCountry(data.index)" width="30%" role="button">
                    <!-- <b-btn variant="success" @click="editCountry(data.index)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-modal id="modal-country"
                  :title="form._id.length &gt; 0 ? '編輯國家' : '新增國家'"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <b-form-group
                    label="國家名"
                    label-for="input-name"
                    :state="state.name"
                    description="國家名長度限制為 1 個字以上"
                    invalid-feedback="國家名格式不正確">
                    <b-form-input
                      id="input-name"
                      v-model="form.name"
                      type="text"
                      required="required"
                      placeholder="請輸入國家名"
                      :state="state.name">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="國家介紹"
                    label-for="input-description">
                    <b-form-textarea
                      id="input-description"
                      v-model="form.description"
                      type="text"
                      placeholder="請輸入國家介紹">
                    </b-form-textarea>
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
                    label-for="input-show"
                  >
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
  name: 'country',
  data () {
    return {
      items: [
        {
          text: '首頁',
          href: '/#/admin'
        },
        {
          text: '國家管理',
          href: '#'
        },
        {
          text: '國家設定',
          active: true
        }
      ],
      countries: [],
      fields: [
        {
          key: 'image',
          label: '圖片'
        },
        {
          key: 'name',
          label: '國家'
        },
        {
          key: 'description',
          label: '國家介紹'
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
        name: '',
        description: '',
        image: null,
        show: false,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        name: this.form.name.length === 0 ? null : true,
        description: this.form.description.length === 0 ? null : true
      }
    }
  },
  methods: {
    editCountry (index) {
      this.form = {
        name: this.countries[index].name,
        description: this.countries[index].description,
        image: this.countries[index].image,
        show: this.countries[index].show,
        _id: this.countries[index]._id,
        index
      }
      this.$bvModal.show('modal-country')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        name: '',
        description: '',
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
          await this.axios.post('/countries', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.countries[this.countries.length] = {
              name: this.form.name,
              description: this.form.description,
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
          this.$refs.countryTable.refresh()
        } else {
          const { data } = await this.axios.patch('/countries/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.countries[this.form.index] = {
            name: this.form.name,
            description: this.form.description,
            _id: this.form._id,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            show: this.form.show
          }
          console.log(this.countries[this.form.index])
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          this.$refs.countryTable.refresh()
        }
        this.$bvModal.hide('modal-country')
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
      const { data } = await this.axios.get('/countries/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.countries = data.result.map(country => {
        if (country.image) {
          country.image = `${process.env.VUE_APP_API}/files/${country.image}`
        }
        return country
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
