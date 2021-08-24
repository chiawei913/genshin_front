<template>
<div class="home" id="home">
  <Navbar></Navbar>
  <div class="poster">
    <div class="bgwrap">
      <video id="background-video" autoplay loop muted playsinline webkit-playsinline poster="../assets/img/videobg.jpg">
        <source src="../assets/img/bg.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="m_poster">
    <div class="bgwrap">
      <video id="background-video" autoplay loop muted playsinline webkit-playsinline poster="../assets/img/videobg.jpg">
        <source src="../assets/img/m_bg.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="container pt-5 pc_news" id="section01">
    <h2>
      <img src="../assets/img/news.png" class="title_img">
      <img src="../assets/img/m_new.png" class="m_title_img">
    </h2>
    <div class="row m-row">
      <div class="col new-carousel">
        <b-carousel
          id="carousel-1"
          :interval="3500"
          fade
          indicators
          img-width="530"
          img-height="100"
          style="text-shadow: 1px 1px 2px #333;"
        >
          <b-carousel-slide v-for="newscarousel in newscarousels" :key="newscarousel._id">
            <template #img>
              <a :href="newscarousel.hyperlink">
                <img
                  class="d-block img-fluid imgsize"
                  :src="newscarousel.image"
                  alt="image slot"
                >
              </a>
            </template>
          </b-carousel-slide>
        </b-carousel>
      </div>
      <div class="col news-all" id="new">
        <ul class="nav tabNav" role="tablist">
          <li class="nav-item tab_nav" :class="li_focus" role="presentation">
            <a class="nav-link" :class="{ active: isNewmessage }" id="newmessage-tab" data-toggle="tab" href="#newmessage" role="tab" @click="newmessage">最新</a>
          </li>
          <li class="nav-item tab_nav" :class="li_focus1" role="presentation">
            <a class="nav-link" :class="{ active: isNews }" id="News-tab" data-toggle="tab" href="#News" role="tab" @click="News">資訊</a>
          </li>
          <li class="nav-item tab_nav" :class="li_focus2" role="presentation">
            <a class="nav-link" :class="{ active: isAnnouncement }" id="announcement-tab" data-toggle="tab" href="#announcement" role="tab" @click="announcement">公告</a>
          </li>
          <li class="nav-item tab_nav" :class="li_focus3" role="presentation">
            <a class="nav-link" :class="{ active: isActivity }" id="activity-tab" data-toggle="tab" href="#activity" role="tab" @click="activity">活動</a>
          </li>
          <a class="btn_more" href="#">MORE</a>
        </ul>
        <div class="tab-content tabs" id="myTabContent">
          <div class="tab-pane fade tab" :class="showNewmessage" id="newmessage" role="tabpanel">
            <div class="list" v-for='(news1, idx) in news.slice(0,6)' :key="idx">
              <a href="/zh-tw/news/detail/14835">
                <span>{{news1.category}}</span>
                <p class="newstitle">{{news1.title}}</p>
                <p class="newsdate">{{news1.ins_date}}</p>
              </a>
            </div>
          </div>
          <div class="tab-pane fade" :class="showNews" id="News" role="tabpanel">
            <div class="list" v-for='(news1, idx) in news.slice(0,6)' :key="idx">
              <a href="/zh-tw/news/detail/14835" v-if="news1.category ==='資訊'">
                <span>{{news1.category}}</span>
                <p class="newstitle">{{news1.title}}</p>
                <p class="newsdate">{{news1.ins_date}}</p>
              </a>
            </div>
          </div>
          <div class="tab-pane fade" :class="showannouncement" id="announcement" role="tabpanel">
            <div class="list" v-for='(news1, idx) in news.slice(0,6)' :key="idx">
              <a href="/zh-tw/news/detail/14835" v-if="news1.category ==='公告'">
                <span>{{news1.category}}</span>
                <p class="newstitle">{{news1.title}}</p>
                <p class="newsdate">{{news1.ins_date}}</p>
              </a>
            </div>
          </div>
          <div class="tab-pane fade" :class="showactivity" id="activity" role="tabpanel">
            <div class="list" v-for="news1 in news.slice(0,6)" :key="news1._id">
              <a href="/zh-tw/news/detail/14835" v-if="news1.category ==='活動'">
                <span>{{news1.category}}</span>
                <p class="newstitle">{{news1.title}}</p>
                <p class="newsdate">{{news1.ins_date}}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container pt-5 pc_character" id="section02">
    <h2>
      <img src="../assets/img/charater.png" class="title_img">
    </h2>
    <div class="row flex-column ">
      <div class="character_flex">
        <!-- <b-carousel
          id="carousel-3"
          :interval="0"
          controls
        >
          <b-carousel-slide v-for="(character, idx) in filtercharacter" :key="idx">
            <template #img>
              <img :src="character.attribute.image" class="character_attribute">
              <img :src="character.big_image" class="character_bimg">
            </template>
             <p class="character_name">{{ character.name }}</p>
             <div class="character_cv">
               <p> CV: {{character.seiyuu }}</p>
               <div class="character_voice" @click="playaudio(idx)"></div>
               <div class="character_voice character_voice--active"  @click="stopaudio()" :style="seiyuu_audio"></div>
             </div>
             <div class="character_intro">
               <div class="character_description">{{ character.description }}</div>
             </div>
          </b-carousel-slide>
        </b-carousel> -->
        <div class="character_bk" v-for="(character, idx) in filtercharacter" :key="idx" :style="[character._id === changebimg ? {'display':'block'} : {'display':'none'}]">
          <div>
            <img :src="character.attribute.image" class="character_attribute">
            <img :src="character.big_image" class="character_bimg">
          </div>
          <p class="character_name">{{ character.name }}</p>
          <div class="character_cv">
            <p> CV: {{character.seiyuu }}</p>
            <div class="character_voice" @click="playaudio(idx)"></div>
            <div class="character_voice character_voice--active"  @click="stopaudio()" :style="seiyuu_audio"></div>
          </div>
          <div class="character_intro">
            <div class="character_description">{{ character.description }}</div>
          </div>
        </div>
      </div>
      <ul class="character_sidebar">
        <li class="charcter_city" v-for="country in countries" :key="country._id" @click="onChange(country._id)">
          <p class="character_city_name">{{ country.name }}</p>
        </li>
      </ul>
      <div class="character_small_out">
        <div class="character_small_bg" v-for="(character, idx) in filtercharacter" :key="idx">
          <img :src="character.small_image" class="character_small" role="button" @click="changeimg(character._id)">
        </div>
      </div>
    </div>
    <div class="sakura1"></div>
  </div>
  <div class="container pt-5 m_character" id="section05">
    <h2>
      <img src="../assets/img/m_character.png" class="m_title_img">
    </h2>
    <div class="row flex-column">
      <div class="character_flex">
        <div class="character_bk" v-for="(character, idx) in filtercharacter" :key="idx" :style="[character._id === changebimg ? {'display':'block'} : {'display':'none'}]">
          <div>
            <img :src="character.attribute.image" class="character_attribute">
            <img :src="character.phone_image" class="character_pimg">
          </div>
          <p class="character_name">{{ character.name }}</p>
          <div class="character_cv">
            <p> CV: {{character.seiyuu }}</p>
            <div class="character_voice" @click="playaudio(idx)"></div>
            <div class="character_voice character_voice--active"  @click="stopaudio()" :style="seiyuu_audio"></div>
          </div>
        </div>
        <div class="character_option">
          <b-form-select v-model="selected" :options="findcountries" @change="onChange(selected)"></b-form-select>
        </div>
        <div class="character_small_all">
          <div class="character_small_out">
            <div class="character_small_bg" v-for="(character, idx) in filtercharacter" :key="idx">
              <img :src="character.small_image" class="character_small" role="button" @click="changeimg(character._id)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container pt-5 pc_world" id="section03">
    <h2>
      <img src="../assets/img/world.png" class="title_img">
      <img src="../assets/img/m_world.png" class="m_title_img">
    </h2>
    <div class="row">
      <div class="col d-flex justify-content-center">
        <b-carousel
          id="carousel-2"
          :interval="0"
          controls
        >
          <b-carousel-slide v-for="country in countries" :key="country._id">
            <template #img>
              <div class="worldname">
                <span>{{country.name}}</span>
              </div>
              <p v-html="country.description" class="world-content"></p>
              <img :src="country.image" class="world-bg">
              <button class="city_detail"  @click="showcities(country._id, country.name)"><p>查看詳情</p></button>
            </template>
          </b-carousel-slide>
        </b-carousel>
      </div>
      <div class="t_modal">
        <b-modal id="modal-city" scrollable size="lg"
          :title="showcitycountry[1]"
          hide-footer
        >
          <div v-for="city in filtercity" :key="city._id">
            <h1 class="h_city">{{ city.name }}</h1>
            <p v-html="city.description"></p>
            <img :src="city.image" class="cityimg">
          </div>
        </b-modal>
      </div>
    </div>
    <div class="sakura"></div>
  </div>
  <div class="container pt-2 pb-5 pc_features" id="section04">
    <h2>
      <img src="../assets/img/feature.png" class="title_img">
      <img src="../assets/img/m_feature.png" class="m_title_img">
    </h2>
    <div class="row">
      <div class="features-bg-o">
        <b-carousel
          id="carousel-2"
          :interval="2500"
          fade
          controls
        >
          <b-carousel-slide v-for="feature in features" :key="feature._id">
            <template #img>
              <img :src="feature.image" class="features-bg">
            </template>
          </b-carousel-slide>
        </b-carousel>
      </div>
    </div>
  </div>
  <Footer></Footer>
</div>
</template>
<script>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
export default {
  name: 'home',
  data () {
    return {
      showNewmessage: 'show active',
      showNews: '',
      showannouncement: '',
      showactivity: '',
      isNewmessage: true,
      isNews: false,
      isAnnouncement: false,
      isActivity: false,
      li_focus: 'focus',
      li_focus1: '',
      li_focus2: '',
      li_focus3: '',
      newscarousels: [],
      news: [],
      countries: [],
      cities: [],
      showcitycountry: [],
      characters: [],
      selected: '',
      findcountries: [],
      features: [],
      seiyuu_audio: 'display:none',
      show: [],
      changebimg: ''
    }
  },
  methods: {
    newmessage (event) {
      event.preventDefault()
      this.isNewmessage = true
      this.isNews = false
      this.isAnnouncement = false
      this.isActivity = false
      this.showNewmessage = 'show active'
      this.showNews = ''
      this.showannouncement = ''
      this.showactivity = ''
      this.li_focus = 'focus'
      this.li_focus1 = ''
      this.li_focus2 = ''
      this.li_focus3 = ''
    },
    News (event) {
      event.preventDefault()
      this.isNewmessage = false
      this.isNews = true
      this.isAnnouncement = false
      this.isActivity = false
      this.showNewmessage = ''
      this.showNews = 'show active'
      this.showannouncement = ''
      this.showactivity = ''
      this.li_focus = ''
      this.li_focus1 = 'focus'
      this.li_focus2 = ''
      this.li_focus3 = ''
    },
    announcement (event) {
      event.preventDefault()
      this.isNewmessage = false
      this.isNews = false
      this.isAnnouncement = true
      this.isActivity = false
      this.showNewmessage = ''
      this.showNews = ''
      this.showannouncement = 'show active'
      this.showactivity = ''
      this.li_focus = ''
      this.li_focus1 = ''
      this.li_focus2 = 'focus'
      this.li_focus3 = ''
    },
    activity (event) {
      event.preventDefault()
      this.isNewmessage = false
      this.isNews = false
      this.isAnnouncement = false
      this.isActivity = true
      this.showNewmessage = ''
      this.showNews = ''
      this.showannouncement = ''
      this.showactivity = 'show active'
      this.li_focus = ''
      this.li_focus1 = ''
      this.li_focus2 = ''
      this.li_focus3 = 'focus'
    },
    onChange (value) {
      this.selected = value
      this.changebimg = this.filtercharacter[0]._id
    },
    showcities (id, value) {
      this.showcitycountry = [id, value]
      this.$bvModal.show('modal-city')
    },
    playaudio (idx) {
      this.audio = new Audio(this.filtercharacter[idx].seiyuu_audio)
      if (this.audio) {
        this.audio.play()
        this.audio.currentTime = 0
        this.seiyuu_audio = 'display:block'
      }
      this.audio.onended = () => {
        this.seiyuu_audio = 'display:none'
      }
    },
    stopaudio () {
      this.audio.pause()
      this.seiyuu_audio = 'display:none'
    },
    changeimg (id) {
      this.changebimg = id
      if (this.seiyuu_audio === 'display:block') {
        this.audio.pause()
        this.seiyuu_audio = 'display:none'
      }
    }
  },
  computed: {
    filtercharacter () {
      return this.characters.filter(character => {
        if (character.country._id === this.selected) {
          return true
        } else {
          return false
        }
      })
    },
    filtercity () {
      return this.cities.filter(city => {
        if (city.country._id === this.showcitycountry[0]) return true
        else return false
      })
    }
  },
  async mounted () {
    try {
      const data2 = await this.axios.get('/newscarousel')
      this.newscarousels = data2.data.result.map(newscarousel => {
        if (newscarousel.image) {
          newscarousel.image = `${process.env.VUE_APP_API}/files/${newscarousel.image}`
        }
        return newscarousel
      })
      const data3 = await this.axios.get('/news')
      this.news = data3.data.result.map(news => {
        news.ins_date = new Date(news.ins_date).getFullYear() + '/' + (new Date(news.ins_date).getMonth() + 1) + '/' + new Date(news.ins_date).getDate()
        if (news.category === '0') {
          news.category = '資訊'
        } else if (news.category === '1') {
          news.category = '公告'
        } else {
          news.category = '活動'
        }
        return news
      })
      const data5 = await this.axios.get('/countries')
      this.countries = data5.data.result.map(country => {
        if (country.image) {
          country.image = `${process.env.VUE_APP_API}/files/${country.image}`
        }
        if (country.description) {
          country.description = country.description.replaceAll(/[.,，、。？*+?^${}()|[\]\\]/g, '<br>')
        }
        return country
      })
      this.findcountries = data5.data.result.map(findcountry => {
        return { value: findcountry._id, text: findcountry.name }
      })
      this.selected = data5.data.result[0]._id

      const data6 = await this.axios.get('/characters')
      this.characters = data6.data.result.filter(character => {
        if (character.small_image) {
          character.small_image = `${process.env.VUE_APP_API}/files/${character.small_image}`
        }
        if (character.big_image) {
          character.big_image = `${process.env.VUE_APP_API}/files/${character.big_image}`
        }
        if (character.phone_image) {
          character.phone_image = `${process.env.VUE_APP_API}/files/${character.phone_image}`
        }
        if (character.seiyuu_audio) {
          character.seiyuu_audio = `${process.env.VUE_APP_API}/files/${character.seiyuu_audio}`
        }
        if (character.attribute.image) {
          character.attribute.image = `${process.env.VUE_APP_API}/files/${character.attribute.image}`
        }
        return character
      })
      this.changebimg = data6.data.result[0]._id

      const data7 = await this.axios.get('/cities')
      this.cities = data7.data.result.map(city => {
        if (city.image) {
          city.image = `${process.env.VUE_APP_API}/files/${city.image}`
        }
        if (city.description) {
          city.description = city.description.replaceAll(/[。]/g, '<br>')
        }
        return city
      })

      const data8 = await this.axios.get('/features')
      this.features = data8.data.result.map(feature => {
        if (feature.image) {
          feature.image = `${process.env.VUE_APP_API}/files/${feature.image}`
        }
        return feature
      })
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: '錯誤',
        text: '取得資料失敗'
      })
    }
  },
  components: {
    Navbar,
    Footer
  }
}
</script>
