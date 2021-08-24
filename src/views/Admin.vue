<template>
<div class="back_body">
  <div class="wrapper">
    <Sidebar></Sidebar>
    <div class="main-panel">
      <b-breadcrumb class="bread-default d-flex align-items-center" :items="items"></b-breadcrumb>
      <div class="content">
        <div class="container-fluid admin_home">
          <div class="row">
            <div class="col-6 d-flex align-items-center justify-content-end p-5">
              <div class="admin_title_box">
                <img src="../assets/icon/world.png" class="admin_icon">
              </div>
              <p class="admin_title">國家</p>
              <div class="admin_box">
                <router-link to="/Country" class="admin_hyperlink"><p class="admin_content">{{ countries.length }}</p></router-link>
                <span class="admin_unit">/個</span>
              </div>
            </div>
            <div class="col-6 d-flex align-items-center justify-content-start p-5">
              <div class="admin_title_box">
                <img src="../assets/icon/city.png" class="admin_icon">
              </div>
              <p class="admin_title">地區</p>
              <div class="admin_box">
                <router-link to="/City" class="admin_hyperlink"><p class="admin_content">{{ cities.length }}</p></router-link>
                <span class="admin_unit">/個</span>
              </div>
            </div>
            <div class="col-6 d-flex align-items-center justify-content-end p-5">
              <div class="admin_title_box">
                <img src="../assets/icon/chars.png" class="admin_icon">
              </div>
              <p class="admin_title">角色</p>
              <div class="admin_box">
                <router-link to="/Character" class="admin_hyperlink"><p class="admin_content">{{characters.length}}</p></router-link>
                <span class="admin_unit">/位</span>
              </div>
            </div>
            <div class="col-6 d-flex align-items-center justify-content-start p-5">
              <div class="admin_title_box">
                <img src="../assets/icon/news.png" class="admin_icon">
              </div>
              <p class="admin_title">新聞</p>
              <div class="admin_box">
                <router-link to="/News" class="admin_hyperlink"><p class="admin_content">{{ news.length }}</p></router-link>
                <span class="admin_unit">/則</span>
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
  name: 'admin',
  data () {
    return {
      items: [
        {
          text: '首頁',
          active: true
        }
      ],
      countries: [],
      cities: [],
      characters: [],
      news: []
    }
  },
  async mounted () {
    try {
      const data1 = await this.axios.get('/characters/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.characters = data1.data.result.map(character => {
        return character
      })

      const data2 = await this.axios.get('/cities/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.cities = data2.data.result.map(city => {
        return city
      })

      const data4 = await this.axios.get('/countries/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.countries = data4.data.result.map(country => {
        return country
      })

      const data5 = await this.axios.get('/news/all', {
        headers: {
          authorization: 'Bearer ' + this.$store.state.jwt.token
        }
      })
      this.news = data5.data.result.map(news => {
        return news
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得使用者失敗'
      })
    }
  },
  components: {
    Sidebar
  }
}
</script>
