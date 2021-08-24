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
                   <span class="w-50 my-2">國家查詢</span>
                  <b-form-select v-model="filter" :options="findcountries" class="mb-2">
                    <template #first>
                      <b-form-select-option :value="null">全部</b-form-select-option>
                    </template>
                  </b-form-select>
                </div>
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-character')">新增角色</b-button>
                </b-col>
                <b-table
                  id="my-table"
                  :items="characters"
                  :fields="fields"
                  :striped="true"
                  ref="characterTable"
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
                  <template #cell(country)="data">
                    <span>
                      {{ data.item.country.name }}
                    </span>
                  </template>
                  <template #cell(attribute)="data">
                    <span>
                      {{ data.item.attribute.name }}
                    </span>
                  </template>
                  <template #cell(description)="data">
                     <span class="d-inline-block text-truncate" style="max-width: 300px;">{{ data.item.description }}</span>
                  </template>
                  <template #cell(small_image)="data">
                    <img v-if="data.item" :src="data.item.small_image" style="height: 50px" />
                  </template>
                  <template #cell(show)="data">
                    <img v-if="data.item.show"  src="../assets/icon/show.png" style="height: 23px"/>
                    <img v-else src="../assets/icon/noshow.png" style="height: 23px"/>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editCharacter(data.item, data.index, $event.target)" role="button" width="45%">
                    <!-- <b-btn variant="success" @click="editCharacter(data.item, data.index, $event.target)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
                <b-modal id="modal-character"
                  :title="form._id.length &gt; 0 ? '編輯角色' : '新增角色'"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <b-form-group
                    label="角色名"
                    label-for="input-name"
                    :state="state.name"
                    description="角色名長度限制為 1 個字以上"
                    invalid-feedback="角色名格式不正確">
                    <b-form-input
                      id="input-name"
                      v-model="form.name"
                      type="text"
                      required="required"
                      placeholder="請輸入角色名"
                      :state="state.name">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="角色介紹"
                    label-for="input-description">
                    <b-form-textarea
                      id="input-description"
                      v-model="form.description"
                      type="text"
                      placeholder="請輸入角色介紹">
                    </b-form-textarea>
                  </b-form-group>
                  <b-form-group
                    label="隸屬國家"
                  >
                    <b-form-select v-model="form.country" :options="countries" class="mb-3">
                      <template #first>
                        <option value="" disabled>-- 請選擇 --</option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group
                    label="角色屬性"
                  >
                    <b-form-select v-model="form.attribute" :options="attributes" class="mb-3">
                      <template #first>
                        <option value="" disabled>-- 請選擇 --</option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group
                    label="角色聲優"
                    label-for="input-seiyuu"
                    :state="state.seiyuu"
                    description="角色聲優長度限制為 1 個字以上"
                    invalid-feedback="角色聲優格式不正確">
                    <b-form-input
                      id="input-seiyuu"
                      v-model="form.seiyuu"
                      type="text"
                      required="required"
                      placeholder="請輸入角色聲優"
                      :state="state.seiyuu">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="角色聲優音效檔"
                  >
                    <b-form-file
                      v-model="form.seiyuu_audio"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                  </b-form-group>
                  <b-form-group
                    label="角色大圖"
                  >
                  <img-inputer
                    v-model="form.big_image"
                    theme="dark"
                    size="large"
                    placeholder="點擊或拖曳選擇圖片"
                    bottom-text="點擊或拖曳以修改">
                  </img-inputer>
                  </b-form-group>
                  <b-form-group
                    label="角色小圖"
                  >
                  <img-inputer
                    v-model="form.small_image"
                    theme="dark"
                    size="large"
                    placeholder="點擊或拖曳選擇圖片"
                    bottom-text="點擊或拖曳以修改">
                  </img-inputer>
                  </b-form-group>
                  <b-form-group
                    label="角色手機版圖"
                  >
                  <img-inputer
                    v-model="form.phone_image"
                    theme="dark"
                    size="large"
                    placeholder="點擊或拖曳選擇圖片"
                    bottom-text="點擊或拖曳以修改">
                  </img-inputer>
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
  name: 'character',
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
          text: '角色管理',
          active: true
        }
      ],
      filter: null,
      filterOn: ['country'],
      perPage: 7,
      currentPage: 1,
      totalRows: 1,
      characters: [],
      countries: [],
      attributes: [],
      findcountries: [],
      fields: [
        {
          key: 'small_image',
          label: '角色圖'
        },
        {
          key: 'name',
          label: '角色'
        },
        {
          key: 'description',
          label: '角色介紹'
        },
        {
          key: 'attribute',
          label: '角色屬性'
        },
        {
          key: 'seiyuu',
          label: '角色聲優'
        },
        {
          key: 'country',
          label: '隸屬國家'
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
        seiyuu: '',
        seiyuu_audio: null,
        country: '',
        attribute: '',
        big_image: null,
        small_image: null,
        phone_image: null,
        show: false,
        _id: ''
      }
    }
  },
  computed: {
    state () {
      return {
        name: this.form.name.length === 0 ? null : true,
        description: this.form.description.length === 0 ? null : true,
        seiyuu: this.form.seiyuu.length === 0 ? null : true
      }
    }
  },
  methods: {
    editCharacter (item, index) {
      this.form = {
        name: item.name,
        description: item.description,
        seiyuu: item.seiyuu,
        seiyuu_audio: null,
        country: item.country._id,
        attribute: item.attribute._id,
        big_image: item.big_image,
        small_image: item.small_image,
        phone_image: item.phone_image,
        show: item.show,
        _id: item._id,
        index
      }
      console.log(item)
      this.$bvModal.show('modal-character')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        name: '',
        description: '',
        seiyuu: '',
        seiyuu_audio: null,
        country: '',
        attribute: '',
        big_image: null,
        small_image: null,
        phone_image: null,
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
          await this.axios.post('/characters', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.characters[this.characters.length] = {
              name: this.form.name,
              description: this.form.description,
              seiyuu: this.form.seiyuu,
              seiyuu_audio: `${process.env.VUE_APP_API}/files/${response.data.result.seiyuu_audio}`,
              country: this.form.country,
              attribute: this.form.attribute,
              big_image: `${process.env.VUE_APP_API}/files/${response.data.result.big_image}`,
              small_image: `${process.env.VUE_APP_API}/files/${response.data.result.small_image}`,
              phone_image: `${process.env.VUE_APP_API}/files/${response.data.result.phone_image}`,
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
          this.$refs.characterTable.refresh()
        } else {
          const { data } = await this.axios.patch('/characters/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.characters[this.form.index] = {
            name: this.form.name,
            description: this.form.description,
            seiyuu: this.form.seiyuu,
            seiyuu_audio: `${process.env.VUE_APP_API}/files/${data.result.seiyuu_audio}`,
            country: this.form.country,
            attribute: this.form.attribute,
            big_image: `${process.env.VUE_APP_API}/files/${data.result.big_image}`,
            small_image: `${process.env.VUE_APP_API}/files/${data.result.small_image}`,
            phone_image: `${process.env.VUE_APP_API}/files/${data.result.phone_image}`,
            show: this.form.show,
            _id: this.form._id
          }
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          this.$refs.characterTable.refresh()
        }
        this.$bvModal.hide('modal-character')
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
      const data2 = await this.axios.get('/countries/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.countries = data2.data.result.map(country => {
        return { value: country._id, text: country.name }
      })
      this.findcountries = data2.data.result.map(findcountry => {
        return { value: findcountry.name, text: findcountry.name }
      })

      const data3 = await this.axios.get('/attributes/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.attributes = data3.data.result.map(attribute => {
        return { value: attribute._id, text: attribute.name }
      })

      const { data } = await this.axios.get('/characters/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.characters = data.result.map(character => {
        if (character.small_image) {
          character.small_image = `${process.env.VUE_APP_API}/files/${character.small_image}`
        }
        return character
      })
    } catch (error) {
      console.log(error)
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得資料失敗'
      })
    }
    this.totalRows = this.characters.length
  },
  components: {
    Sidebar
  }
}
</script>
