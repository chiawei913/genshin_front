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
                  <b-button variant="outline-primary" @click="$bvModal.show('modal-city')">新增地區</b-button>
                </b-col>
                <b-table
                  id="my-table"
                  :items="cities"
                  :fields="fields"
                  :striped="true"
                  ref="cityTable"
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
                  <template #cell(image)="data">
                    <img v-if="data.item" :src="data.item.image" style="height: 50px" /></template>
                  <template #cell(description)="data">
                     <span class="d-inline-block text-truncate" style="max-width: 400px;">{{ data.item.description }}</span>
                  </template>
                  <template #cell(show)="data">
                    <img v-if="data.item.show"  src="../assets/icon/show.png" style="height: 23px"/>
                    <img v-else src="../assets/icon/noshow.png" style="height: 23px"/>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editCity(data.item, data.index, $event.target)" width="30%">
                    <!-- <b-btn variant="success" @click="editCity(data.item, data.index, $event.target)">編輯</b-btn> -->
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
                <b-modal id="modal-city"
                  :title="form._id.length &gt; 0 ? '編輯地區' : '新增地區'"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <b-form-group
                    label="地區名"
                    label-for="input-name"
                    :state="state.name"
                    description="地區長度限制為 1 個字以上"
                    invalid-feedback="地區格式不正確">
                    <b-form-input
                      id="input-name"
                      v-model="form.name"
                      type="text"
                      required="required"
                      placeholder="請輸入地區"
                      :state="state.name">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="地區介紹"
                    label-for="input-description">
                    <b-form-textarea
                      id="input-description"
                      v-model="form.description"
                      type="text"
                      placeholder="請輸入地區介紹">
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
  name: 'city',
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
          text: '地區設定',
          active: true
        }
      ],
      filter: null,
      filterOn: ['country'],
      perPage: 7,
      currentPage: 1,
      totalRows: 1,
      cities: [],
      countries: [],
      findcountries: [],
      fields: [
        {
          key: 'image',
          label: '圖片'
        },
        {
          key: 'name',
          label: '地區'
        },
        {
          key: 'description',
          label: '地區介紹'
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
        country: '',
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
    editCity (item, index) {
      this.form = {
        name: item.name,
        description: item.description,
        country: item.country._id,
        image: item.image,
        show: item.show,
        _id: item._id,
        index
      }
      this.$bvModal.show('modal-city')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
        return
      }
      this.form = {
        name: '',
        description: '',
        country: '',
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
          await this.axios.post('/cities', fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          }).then((response) => {
            this.cities[this.cities.length] = {
              name: this.form.name,
              description: this.form.description,
              country: this.form.country,
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
          this.$refs.cityTable.refresh()
          console.log(this.form)
        } else {
          const { data } = await this.axios.patch('/cities/' + this.form._id, fd, {
            headers: {
              authorization: 'Bearer ' + this.$store.state.jwt.token
            }
          })
          this.cities[this.form.index] = {
            name: this.form.name,
            description: this.form.description,
            country: this.form.country,
            image: `${process.env.VUE_APP_API}/files/${data.result.image}`,
            show: this.form.show,
            _id: this.form._id
          }
          console.log(this.cities[this.form.index])
          this.$swal({
            icon: 'success',
            title: '成功',
            text: '修改成功'
          })
          this.$refs.cityTable.refresh()
        }
        this.$bvModal.hide('modal-city')
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

      // const data3 = await this.axios.get('/cities', {
      //   headers: {
      //     authorization: 'Bearer ' + this.$store.state.jwt.token
      //   }
      // })
      // this.cityids = data3.data.result.map(cityid => {
      //   return cityid
      // })

      const { data } = await this.axios.get('/cities/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.cities = data.result.map(city => {
        if (city.image) {
          city.image = `${process.env.VUE_APP_API}/files/${city.image}`
        }
        return city
      })
    } catch (error) {
      console.log(error)
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得資料失敗'
      })
    }
    this.totalRows = this.cities.length
  },
  components: {
    Sidebar
  }
}
</script>
