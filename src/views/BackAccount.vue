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
                  <b-form-group
                    label="使用者ID"
                    label-for="filter-input"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    class="mb-0"
                  >
                    <b-input-group size="sm">
                      <b-form-input
                        id="filter-input"
                        v-model="filter"
                        type="search"
                        placeholder="Type to Search"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                  <b-button variant="outline-primary" to="/Register">新增後台使用者</b-button>
                </b-col>
                <b-table
                  id="my-table"
                  :items="items2"
                  :fields="fields"
                  :striped="true"
                  ref="accountTable"
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
                  <template #cell(role)="data">
                    <span v-if='data.item.role == 0' style="color:#1E90FF">文章編輯者</span>
                    <span v-else-if='data.item.role == 1' style="color:#20B2AA">管理者</span>
                    <span v-else style="color:#DC143C">停權</span>
                  </template>
                  <template #cell(action)="data">
                    <img src='../assets/icon/edit.png' @click="editAccount(data.item, data.index, $event.target)" width="10%" role="button">
                    <span class="p-1"> | </span>
                    <!-- <b-btn variant="success" @click="editAccount(data.item, data.index, $event.target)">編輯</b-btn> -->
                    <img src='../assets/icon/key.png' @click="editPassword(data.item, data.index, $event.target)" width="10%" role="button">
                    <span role="button" @click="editPassword(data.item, data.index, $event.target)">修改密碼</span>
                    <!-- <b-btn variant="success" @click="editPassword(data.item, data.index, $event.target)">修改密碼</b-btn> -->
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="totalRows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
                <b-modal id="modal-password"
                  :title= form1.account
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitPassword"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable"
                >
                  <b-form-group
                    label="密碼"
                    label-for="input-password"
                    :state="state.password"
                    description="密碼長度限制為 4個字以上"
                    invalid-feedback="密碼格式不正確"
                  >
                    <b-form-input
                      id="input-password"
                      v-model="form1.password"
                      type="password"
                      required
                      placeholder="請輸入密碼"
                      :state="state.password"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-modal>
                <b-modal id="modal-account"
                  title="編輯使用者資料"
                  ok-variant="success"
                  ok-title="送出"
                  cancel-variant="danger"
                  cancel-title="取消"
                  @ok="submitModal"
                  @hidden="resetForm"
                  :ok-disabled="submitDisable"
                  :cancel-disabled="submitDisable">
                  <b-form-group
                    label="帳號"
                    label-for="input-account"
                    :state="state.account"
                    description="帳號長度限制為 4 到 20 個字"
                    invalid-feedback="帳號格式不正確"
                  >
                    <b-form-input
                      id="input-account"
                      v-model="form.account"
                      type="text"
                      required
                      placeholder="請輸入帳號"
                      :state="state.account"
                      disabled
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="信箱"
                    label-for="input-email"
                    :state="state.email"
                    description="請輸入有效的信箱"
                    invalid-feedback="信箱格式不正確"
                  >
                    <b-form-input
                      id="input-email"
                      v-model="form.email"
                      type="text"
                      required
                      placeholder="請輸入信箱"
                      :state="state.email"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="使用者名稱"
                    label-for="input-accountname"
                    :state="state.accountname"
                    description="名稱長度限制為 1 到 20 個字"
                    invalid-feedback="使用者名稱格式不正確"
                  >
                    <b-form-input
                      id="input-accountname"
                      v-model="form.accountname"
                      type="text"
                      required
                      placeholder="請輸入使用者名稱"
                      :state="state.accountname"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group
                    label="身分別"
                  >
                    <b-form-select v-model="form.role" class="mb-3">
                      <b-form-select-option :value=0>文章編輯者</b-form-select-option>
                      <b-form-select-option :value=1>管理者</b-form-select-option>
                      <b-form-select-option :value=2>停權</b-form-select-option>
                    </b-form-select>
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
import isEmail from 'validator/es/lib/isEmail'
import md5 from 'md5'

export default {
  name: 'backaccount',
  data () {
    return {
      items: [
        {
          text: '首頁',
          href: '/#/admin'
        },
        {
          text: '帳號管理',
          href: '#'
        },
        {
          text: '後台帳戶管理',
          active: true
        }
      ],
      filter: null,
      filterOn: ['account'],
      perPage: 7,
      currentPage: 1,
      totalRows: 1,
      items2: [],
      fields: [
        {
          key: 'account',
          label: '使用者ID'
        },
        {
          key: 'accountname',
          label: '使用者名稱'
        },
        {
          key: 'email',
          label: 'E-mail'
        },
        {
          key: 'role',
          label: '身分別'
        },
        {
          key: 'action',
          label: '操作'
        }
      ],
      submitDisable: false,
      form: {
        account: '',
        accountname: '',
        email: '',
        role: '',
        _id: ''
      },
      form1: {
        password: '',
        _id: ''
      }
    }
  },
  components: {
    Sidebar
  },
  computed: {
    state () {
      const account = this.form.account
      const accountname = this.form.accountname
      const password = this.form1.password
      const email = this.form.email
      return {
        account: account.length === 0 ? null : account.length >= 4 && account.length <= 20,
        password: password.length === 0 ? null : password.length >= 4,
        accountname: accountname.length === 0 ? null : accountname.length >= 1 && accountname.length <= 20,
        email: email.length === 0 ? null : isEmail(email)
      }
    }
  },
  methods: {
    editAccount (item, index) {
      this.form = {
        account: item.account,
        accountname: item.accountname,
        email: item.email,
        role: item.role,
        _id: item._id,
        index
      }
      this.$bvModal.show('modal-account')
    },
    editPassword (item, index) {
      this.form1 = {
        account: item.account,
        password: '',
        _id: item._id
      }
      this.$bvModal.show('modal-password')
    },
    resetForm (event) {
      if (this.submitDisable) {
        event.preventDefault()
      }
    },
    async submitModal () {
      this.submitDisable = true
      try {
        await this.axios.patch('/backusers/' + this.form._id, this.form, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })

        this.items2[this.form.index] = {
          account: this.form.account,
          accountname: this.form.accountname,
          email: this.form.email,
          role: this.form.role,
          _id: this.form._id
        }
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '修改成功'
        })
        console.log(this.items2[this.form.index])
        this.$refs.accountTable.refresh()
        this.$bvModal.hide('modal-account')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: error.response.data.message
        })
      }
      this.submitDisable = false
    },
    async submitPassword () {
      this.submitDisable = true
      try {
        await this.axios.patch('/backusers/' + this.form1._id + '/password', { password: md5(this.form1.password) }, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '修改成功'
        })
        this.$bvModal.hide('modal-password')
      } catch (error) {
        console.log(this.form1)
        console.log(error)
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
      const { data } = await this.axios.get('/backusers/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.items2 = data.result.map(item => {
        return item
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得使用者失敗'
      })
    }
    this.totalRows = this.items2.length
  }
}
</script>
