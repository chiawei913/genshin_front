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
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-attribute')">新增屬性</b-button>
                </b-col>
                <b-table
                  :items="attributes"
                  :fields="fields"
                  :striped="true"
                  ref="attributeTable"
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
                    <img src='../assets/icon/edit.png' @click="editAttribute(data.index)" role="button" width="10%">
                    <!-- <b-btn variant="success" @click="editAttribute(data.index)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-modal id="modal-attribute"
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
                    label="屬性名稱"
                    label-for="input-name"
                    :state="state.name"
                    description="屬性名稱長度限制為 1 個字以上"
                    invalid-feedback="屬性名稱格式不正確">
                    <b-form-input
                      id="input-name"
                      v-model="form.name"
                      type="text"
                      required="required"
                      placeholder="請輸入屬性名稱"
                      :state="state.name">
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
  name: 'attribute',
  data () {
    return {
      items: [
        {
          text: '首頁',
          href: '/#/admin'
        },
        {
          text: '角色管理',
          href: '#'
        },
        {
          text: '屬性管理',
          active: true
        }
      ],
      attributes: [],
      fields: [
        {
          key: 'name',
          label: '屬性名稱'
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
        name: '',
        image: null,
        show: false,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        title: this.form.name.length === 0 ? null : true
      }
    }
  },
  methods: {
    editAttribute (index) {
      this.form = {
        name: this.attributes[index].name,
        image: this.attributes[index].image,
        show: this.attributes[index].show,
        _id: this.attributes[index]._id,
        index
      }
      this.$bvModal.show('modal-attribute')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        name: '',
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
          await this.axios.post('/attributes', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.attributes[this.attributes.length] = {
              name: this.form.name,
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
          this.$refs.attributeTable.refresh()
        } else {
          const { data } = await this.axios.patch('/attributes/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.attributes[this.form.index] = {
            name: this.form.name,
            _id: this.form._id,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            show: this.form.show
          }
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          console.log(this.attributes[this.form.index])
          this.$refs.attributeTable.refresh()
        }
        this.$bvModal.hide('modal-attribute')
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
      const { data } = await this.axios.get('/attributes/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.attributes = data.result.map(attribute => {
        if (attribute.image) {
          attribute.image = `${process.env.VUE_APP_API}/files/${attribute.image}`
        }
        return attribute
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
