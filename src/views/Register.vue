<template>
<div class="back_body">
  <div class="wrapper">
    <Sidebar></Sidebar>
    <div class="main-panel">
      <b-breadcrumb class="bread-default d-flex align-items-center" :items="items"></b-breadcrumb>
      <div class="content d-flex justify-content-center">
        <b-card bg-variant="light" class="d-flex w-50 pl-5 text-left">
          <b-form @submit.prevent="submit" @reset="reset">
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
              >
              </b-form-input>
            </b-form-group>
            <b-form-group
              label="密碼"
              label-for="input-password"
              :state="state.password"
              description="密碼長度限制為 4個字以上"
              invalid-feedback="密碼格式不正確"
            >
              <b-form-input
                id="input-password"
                v-model="form.password"
                type="password"
                required
                placeholder="請輸入密碼"
                :state="state.password"
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
              label="身分別"
            >
              <b-form-select v-model="form.role" class="mb-3">
                <template #first>
                  <option value="" disabled>-- 請選擇 --</option>
                </template>
                <b-form-select-option :value=0>一般使用者</b-form-select-option>
                <b-form-select-option :value=1>管理者</b-form-select-option>
              </b-form-select>
            </b-form-group>
            <div class="text-center">
              <b-button variant="success" type="submit" class="mx-1">註冊</b-button>
              <b-button variant="danger" type="reset" class="mx-1">重設</b-button>
            </div>
          </b-form>
        </b-card>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Sidebar from './Sidebar.vue'
import isEmail from 'validator/es/lib/isEmail'

export default {
  name: 'register',
  data () {
    return {
      items: [
        {
          text: '首頁',
          href: '/#/admin'
        },
        {
          text: '帳戶管理',
          href: '/#/BackAccount'
        },
        {
          text: '註冊帳戶',
          active: true
        }
      ],
      form: {
        account: '',
        password: '',
        accountname: '',
        email: '',
        role: ''
      }
    }
  },
  components: {
    Sidebar
  },
  computed: {
    state () {
      const account = this.form.account
      const password = this.form.password
      const accountname = this.form.accountname
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
    reset () {
      this.form.account = ''
      this.form.password = ''
      this.form.accountname = ''
      this.form.email = ''
      this.form.role = ''
    },
    async submit () {
      try {
        await this.axios.post('/backusers', this.form)
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '註冊成功'
        })
        this.$router.push('/admin')
      } catch (error) {
        console.log(this.form)
        this.$swal({
          icon: 'error',
          title: '失敗',
          text: error.response.data.message
        })
      }
    }
  }
}
</script>
