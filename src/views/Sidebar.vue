<template>
  <div class="sidebar" data-color="azure" data-image>
    <div class="sidebar-wrapper">
      <div class="logo">
        <router-link to="/admin">
          <img src="../assets/img/genshin.png" class="w-50" style="height: 100px">
        </router-link>
      </div>
      <ul class="nav">
        <li>
          <router-link to="#" v-b-toggle.collapse-4 class="hit d-flex justify-content-center align-items-center">
            <img src="../assets/icon/world.png">
            <p>國家管理</p>
          </router-link>
        </li>
        <b-collapse id="collapse-4">
           <div class="d-flex flex-column ml-3">
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/country.png">
               <router-link to="/Country" class="pl-2 text-white text-decoration-none"><span>國家設定</span></router-link>
             </div>
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/city.png">
               <router-link to="/City" class="pl-2 text-white text-decoration-none"><span>地區設定</span></router-link>
             </div>
           </div>
        </b-collapse>
        <li>
          <router-link to="#" v-b-toggle.collapse-3 class="hit d-flex justify-content-center align-items-center">
            <img src="../assets/icon/news.png">
            <p>新聞管理</p>
          </router-link>
        </li>
        <b-collapse id="collapse-3">
           <div class="d-flex flex-column ml-3">
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/news.png">
               <router-link to="/News" class="pl-2 text-white text-decoration-none"><span>新聞文章管理</span></router-link>
             </div>
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/carousel.png">
               <router-link to="/Newscarousel" class="pl-2 text-white text-decoration-none"><span>新聞輪播管理</span></router-link>
             </div>
           </div>
        </b-collapse>
        <li>
          <router-link to="#" v-b-toggle.collapse-2 class="hit d-flex justify-content-center align-items-center">
            <img src="../assets/icon/chars.png">
            <p>角色管理</p>
          </router-link>
        </li>
        <b-collapse id="collapse-2">
           <div class="d-flex flex-column ml-3">
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/article.png">
               <router-link to="/Character" class="pl-2 text-white text-decoration-none"><span>角色管理</span></router-link>
             </div>
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/textsms.png">
               <router-link to="/Attribute" class="pl-2 text-white text-decoration-none"><span>屬性管理</span></router-link>
             </div>
           </div>
        </b-collapse>
        <li>
          <router-link to="/Feature" class="hit d-flex justify-content-center align-items-center">
            <img src="../assets/icon/game.png">
            <p>特色管理</p>
          </router-link>
        </li>
        <!-- <li>
          <router-link to="#" v-b-toggle.collapse-2 class="hit d-flex justify-content-center align-items-center">
            <img src="../assets/icon/message.png">
            <p>討論區管理</p>
          </router-link>
        </li>
        <b-collapse id="collapse-2">
           <div class="d-flex flex-column ml-3">
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/article.png">
               <router-link to="/Article" class="pl-2 text-white text-decoration-none"><span>文章管理</span></router-link>
             </div>
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/textsms.png">
               <router-link to="/Message" class="pl-2 text-white text-decoration-none"><span>留言管理</span></router-link>
             </div>
           </div>
        </b-collapse> -->
        <li v-if="user.isAdmin">
          <router-link to="#" v-b-toggle.collapse-1 class="hit d-flex justify-content-center align-items-center">
            <img src="../assets/icon/user_setting.png">
            <p>帳戶管理</p>
          </router-link>
        </li>
        <b-collapse id="collapse-1" v-if="user.isAdmin">
           <div class="d-flex flex-column ml-3">
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/account.png">
               <router-link to="/BackAccount" class="pl-2 text-white text-decoration-none"><span>後台帳戶管理</span></router-link>
             </div>
             <!-- <div class="afont d-flex align-items-center">
               <img src="../assets/icon/account.png">
               <router-link to="/FrontAccount" class="pl-2 text-white text-decoration-none"><span>前台帳戶管理</span></router-link>
             </div>
             <div class="afont d-flex align-items-center">
               <img src="../assets/icon/black_person.png">
               <router-link to="/Badperson" class="pl-2 text-white text-decoration-none"><span>黑名單</span></router-link>
             </div> -->
           </div>
        </b-collapse>
        <li class="active-pro">
          <a href="#" class="hit d-flex justify-content-center align-items-center" @click="logout">
            <img src="../assets/icon/logout.png">
            <p>登出</p>
          </a>
        </li>
      </ul>
    </div>
    <div class="sidebar-background backimage"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    async logout () {
      try {
        await this.axios.delete('/backusers/logout', {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$store.commit('logout')
        if (this.$route.path !== '/login') this.$router.push('/login')
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '發生錯誤'
        })
      }
    }
  },
  async mounted () {
    if (this.$store.state.jwt.token.length === 0) return
    const diff = Date.now() - this.$store.state.jwt.received
    try {
      // 如果進入網頁時，距離收到 jwt 過了六天，重新取得一次新的 jwt
      // 1000 * 60 * 60 * 24 * 6 = 6 天的毫秒數
      if (diff > 1000 * 60 * 60 * 24 * 6) {
        const { data } = await this.axios.post('/backusers/extend', {}, {
          headers: {
            authorization: 'Bearer ' + this.$store.state.jwt.token
          }
        })
        this.$store.commit('extend', data.result)
      }
      // 進入網頁時重新取一次使用者資料
      const { data } = await this.axios.get('/backusers/', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.$store.commit('getinfo', data.result)
    } catch (error) {
      this.$store.commit('logout')
    }
  }
}
</script>

<style lang="stylus">
  @import url("https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap")
</style>
