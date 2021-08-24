<template>
  <div>
    <div class="topBar">
      <div class="barBox">
        <div class="bar_left">
          <a class="logo" id="btn-logo-toOfficial" href="#">
            <img src="../assets/img/navbar_logo.png" alt="原神">
          </a>
          <ul class="menu">
            <li class="m1">
              <a class="menuBtn menu_m_close focus" id="btn-to-home" href="#">
                <span>首頁</span><span>Home</span>
              </a>
            </li>
            <li class="m2">
              <a class="menuBtn" href="#" @click="gsap_news()">
                <span>新聞</span><span>News</span>
              </a>
            </li>
            <li class="m3">
              <a class="menuBtn" href="#" @click="gsap_character()">
                <span>人物介紹</span><span>Charater</span>
              </a>
            </li>
            <li class="m4">
              <a class="menuBtn" href="#" @click="gsap_world()">
                <span>世界</span><span>World</span>
              </a>
            </li>
            <li class="m5">
              <a class="menuBtn" href="#" @click="gsap_feature()">
                <span>遊戲特色</span><span>Featrues</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="bar_right">
          <img src="../assets/icon/facebook.png" width="12%">
          <img src="../assets/icon/twitter.png" width="12%">
          <img src="../assets/icon/youtube.png" width="12%">
          <img src="../assets/icon/instagram.png" width="12%">
          <img src="../assets/icon/discord.png" width="12%">
        </div>
      </div>
    </div>

    <div class="topBar_m">
      <div class="barBox">
        <div class="bar_left">
           <a class="headIcon" href="#">
            <img src="../assets/img/genshin.png" alt="原神" style="width:100px; height:77px;">
           </a>
        </div>
        <div class="bar_right">
          <img v-if="navopen == 'menu_m'" src="../assets/icon/menu.png" style="width:30px; z-index:100" @click="open()">
          <img v-else src="../assets/icon/closemenu.png" style="width:30px; z-index:100" @click="close()">
        </div>
        <div :class='navopen'>
          <div class="menuBox">
            <li class="m1">
              <a class="menuBtn focus" href="/" @click="close()">
                <span>首頁</span><span>Home</span>
              </a>
            </li>
            <li class="m2">
             <a class="menuBtn" href="#" @click="gsap_news()">
               <span>新聞</span><span>News</span>
             </a>
            </li>
            <li class="m3">
              <a class="menuBtn" href="#" @click="gsap_mcharacter()">
               <span>人物介紹</span><span>Charater</span>
              </a>
            </li>
            <li class="m4">
              <a class="menuBtn" href="#" @click="gsap_world()">
                <span>世界</span><span>World</span>
              </a>
            </li>
            <li class="m5">
              <a class="menuBtn" href="#" @click="gsap_feature()">
                <span>遊戲特色</span><span>Featrues</span>
              </a>
            </li>
          </div>
          <div class="icon pt-5">
            <img src="../assets/icon/facebook.png" width="10%">
            <img src="../assets/icon/twitter.png" width="10%">
            <img src="../assets/icon/youtube.png" width="10%">
            <img src="../assets/icon/instagram.png" width="10%">
            <img src="../assets/icon/discord.png" width="10%">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Draggable from 'gsap/Draggable'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, Draggable, ScrollToPlugin)
export default {
  name: 'Navbar',
  data () {
    return {
      showWorld: false,
      m_showWorld: false,
      navopen: 'menu_m'
    }
  },
  methods: {
    Worldover () {
      this.showWorld = true
    },
    Worldleave () {
      this.showWorld = false
    },
    mc_showWorld () {
      this.m_showWorld = !this.m_showWorld
    },
    open () {
      this.navopen = 'menu_m open'
    },
    close () {
      this.navopen = 'menu_m'
    },
    gsap_news () {
      gsap.to(window, {
        scrollTo: {
          y: '#section01',
          offsetY: -60
        },
        duration: 1
      })
      this.navopen = 'menu_m'
    },
    gsap_character () {
      gsap.to(window, {
        scrollTo: {
          y: '#section02',
          offsetY: -60
        },
        duration: 1
      })
    },
    gsap_mcharacter () {
      gsap.to(window, {
        scrollTo: {
          y: '#section05',
          offsetY: -60
        },
        duration: 1
      })
      this.navopen = 'menu_m'
    },
    gsap_world () {
      gsap.to(window, {
        scrollTo: {
          y: '#section03',
          offsetY: -60
        },
        duration: 1
      })
      this.navopen = 'menu_m'
    },
    gsap_feature () {
      gsap.to(window, {
        scrollTo: {
          y: '#section04',
          offsetY: -60
        },
        duration: 1
      })
      this.navopen = 'menu_m'
    }
  }
}
</script>
