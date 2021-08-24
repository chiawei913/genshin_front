<template>
<div class="login_body d-flex justify-content-center align-items-center">
  <div class="container d-flex justify-content-center">
    <div class="row">
      <div class="col">
        <form class="login_f1" @submit.prevent="submit" @reset="reset">
          <div class="box2 d-flex justify-content-center align-items-center">
            <img src="../assets/icon/user.png" class="login_icon">
          </div>
          <div class="p-5 d-flex flex-column justify-content-center">
            <span class="login_span d-flex justify-content-center">Sign In</span><br>
            <div class="col-12">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text"><img src='../assets/icon/user_black.png' class="login_input_icon"></div>
                </div>
                  <!-- <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Username"> -->
                <b-form-input
                  id="input-account"
                  v-model="form.account"
                  type="text"
                  required
                  placeholder="Username"
                  :state="state.account"
                >
                </b-form-input>
              </div>
            </div>
            <div class="col-12 justify-content-end">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text"><img src='../assets/icon/lock.png' class="login_input_icon"></div>
                </div>
                <!-- <input type="text" class="form-control" id="inputPassword" placeholder="Password"> -->
                <b-form-input
                  id="input-password"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="Password"
                  :state="state.password"
                >
                </b-form-input>
              </div>
            </div>
            <div class="col-12 d-flex flex-column mb-3">
              <b-button variant="primary" type="submit" class="mx-1">login</b-button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  computed: {
    state () {
      const account = this.form.account
      const password = this.form.password
      return {
        account: account.length === 0 ? null : account.length >= 4 && account.length <= 20,
        password: password.length === 0 ? null : password.length >= 4 && password.length <= 20
      }
    }
  },
  methods: {
    reset () {
      this.form.account = ''
      this.form.password = ''
    },
    async submit () {
      try {
        const { data } = await this.axios.post('/backusers/login', this.form)
        this.$swal({
          icon: 'success',
          title: '成功',
          text: '登入成功'
        })
        this.$store.commit('login', data)
        this.$router.push('/admin')
      } catch (error) {
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
