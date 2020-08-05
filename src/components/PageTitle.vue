<template>
  <div class="page-title">
    <transition name="nav-transition">
      <div class="title-nav-container" v-show="ismenuShow">
        <div class="menu-bottom">
          <div class="menu-nav">
            <el-menu
              :default-active=curRouteIndex
              :router="false"
              @select="selectMenu"
              active-text-color="transparent"
              background-color="rgba(0, 0, 0, 0)"
              mode="horizontal"
              text-color="#fff">
              <el-menu-item :index="index" :route="item.path" v-for="(item,index) in menuList" :key="index">
                <el-dropdown placement="top" @command="clickChildMenu" v-if="item.hasChildren">
                  <el-tooltip class="item" :content="item.title" effect="dark" placement="top">
                    <div @mouseover="menuMouseOver(index)" class="icon">
                      <i class="menu-drop-common" :class="item.icon + '1'"></i>
                      <i class="menu-drop-common rotate1" :class="item.icon + '2'"></i>
                      <i class="menu-drop-common rotate2" :class="item.icon + '3'"></i>
                      <i class="menu-drop-common rotate1" :class="item.icon + '4'"></i>
                    </div>
                  </el-tooltip>
                  <el-dropdown-menu class="nav-dropdown-menu nav-dropdown-menu2" slot="dropdown">
                    <el-dropdown-item :command="v" :key="i" v-for="(v,i) in childMenu">
                      <div class="el-dropdown-item-inner">
                        <span class="el-dropdown-item-title">{{v.title}}</span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="el-dropdown" v-else>
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                    <div class="icon">
                      <i class="menu-drop-common" :class="item.icon + '1'"></i>
                      <i class="menu-drop-common rotate1" :class="item.icon + '2'"></i>
                      <i class="menu-drop-common rotate2" :class="item.icon + '3'"></i>
                      <i class="menu-drop-common rotate1" :class="item.icon + '4'"></i>
                    </div>
                  </el-tooltip>
                </div>
              </el-menu-item>
            </el-menu>
          </div>
          <div @click="hideMenu" class="top-up"
               title="收起"
               v-show="ismenuShow">
            <i class="more-alarm-icon el-icon-arrow-up"></i>
            <i class="more-alarm-icon el-icon-arrow-up"></i>
          </div>
        </div>
      </div>
    </transition>
    <transition name="nav-transition">
      <div @click="showMenu" class="show-menu"
           title="展开"
           v-show="!ismenuShow">
        <i class="more-alarm-icon el-icon-arrow-down"></i>
        <i class="more-alarm-icon el-icon-arrow-down"></i>
      </div>
    </transition>
    <div class="menu-top">
      <div class="title">
        <img class="znv-logo" :src="systemIcon"/>
        <span>{{ systemTitle }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import menu from '../../public/config/menuConfig'

export default {
  name: 'PageTitle',
  props: ['systemTitle'],
  components: {},
  data () {
    return {
      ismenuShow: true,
      curRouteIndex: '13',
      childMenu: [],
      navMenu: menu,
      menuList: {},
      systemIcon: sysConfig.systemIcon
    }
  },
  watch: {
    $route (to, from) {
      this.initNav()
    }
  },
  created () {
    this.initNav()
  },
  mounted () {
    this.$nextTick(function () {
      this.initNavStyle() // 根据导航数量调节间距
    })
  },
  methods: {
    initNav () {
      this.navMenu.forEach((v) => {
        if (v.level === '1') {
          this.menuList[v.id] = v
        } else if (this.menuList[v.parent]) {
          this.menuList[v.parent].hasChildren = true
        }
      })
    },
    initNavStyle () {
      let $dom = $('.page-title .el-menu--horizontal > .el-menu-item')
      $dom.css('width', 790 / $dom.length)
    },
    hideMenu () {
      this.ismenuShow = false
    },
    showMenu () {
      this.ismenuShow = true
    },
    selectMenu (index, indexPath, component) {
      if (component.route === this.$route.path) {
        this.$nextTick(() => {
          this.$router.replace('/refresh')
        })
      } else {
        this.clickChildMenu(component)
      }
    },
    clickChildMenu (v) {
      let path = v.path || v.route
      if (path.indexOf('http') > -1) {
        window.open(path, '_blank')
      } else {
        this.$router.replace(path)
      }
    },
    menuMouseOver (value) {
      this.childMenu = this.navMenu.filter((item) => {
        return item.level === '2' && item.parent === value
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .page-title {
    z-index: 1;
    width: 100%;
    height: 190px;
    color: $color-font-1;

    .menu-top {
      width: 100%;
      height: 72px;
      background: url("../assets/pageTitle/header_top.png");
      position: absolute;
      top: 0;
      .znv-logo {
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
        width: 85px;
        height: 36px;
        /*background: url('../assets/pageTitle/znv-logo.png') no-repeat 50%;*/
        /*background-size: contain;*/
      }
      .title {
        z-index: 999;
        position: absolute;
        width: 100%;
        text-align: center;
        top: 10px;
        font-size: 34px;
        font-weight: bold;
        height: 36px;
      }
    }

    .menu-bottom {
      width: 100%;
      height: 184px;
      position: absolute;
      top: 0;
      background: url("../assets/pageTitle/header3.png");
    }

    .show-menu {
      cursor: pointer;
      width: 26px;
      position: absolute;
      top: 75px;
      left: 942px;
    }

    .title-nav-container {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .nav-transition-enter-active, .nav-transition-leave-active {
      transition: all .7s ease;
    }

    .nav-transition-enter, .nav-transition-leave-to {
      margin-top: -190px;
    }

    .top-up {
      cursor: pointer;
      width: 26px;
      margin-left: 942px;
      margin-top: 7px;
    }

    .menu-nav {
      width: 790px;
      height: 90px;
      margin: 71px auto 0;
    }

    .sub-menu-nav {
      display: block;
    }

    .icon {
      display: inline-block;
      width: 84px;
      height: 100%;

      &:hover {
        /*&:before{
          content: "";
          width: 20px;
          height: 20px;
          background: url("../assets/public/triangle-down.png") no-repeat center center;
          position: absolute;
          left: 32px;
          top: 75px;
        }*/
        .rotate1 {
          transform: rotate(90deg);
        }

        .rotate2 {
          transform: rotate(-90deg);
        }
      }

      .rotate1 {
        transition: transform 0.5s linear;
        transform: rotate(0deg);
      }

      .rotate2 {
        transition: transform 0.5s linear;
        transform: rotate(0deg);
      }
    }

    .el-menu.el-menu--horizontal {
      border-bottom: 0px;
      .el-menu-item {
        display: inline-block;
        height: 84px;
        line-height: 84px;
        padding: 0;
        .el-dropdown {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        &:first-child {
          &:before {
            background: transparent;
          }
        }

        &:before {
          content: '';
          position: absolute;
          top: 20px;
          width: 1px;
          height: 53px;
          background: linear-gradient(to bottom, transparent, rgba(84, 169, 255, 0.5), transparent);
        }

        &.el-menu-item2 {
          &:hover {
            &:after {
              border-top: 5px solid transparent;
            }
          }

          &.is-active {
            &:hover {
              &:after {
                border-top: 5px solid transparent;
              }
            }
          }
        }

        &:hover {
          &:after {
            content: "";
            width: 0;
            height: 0;
            border-top: 5px solid #249BFF;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        .menu-common {
          width: 84px;
          height: 84px;
          position: absolute;
        }

        .menu-drop-common {
          width: 84px;
          height: 84px;
          margin-top: -42px;
          position: absolute;
        }

        .home1 {
          background: url("../assets/pageTitle/1_shouye.png") no-repeat center center;
        }

        .home2 {
          background: url("../assets/pageTitle/1_1_1.png") no-repeat center center;
        }

        .home3 {
          background: url("../assets/pageTitle/1_1_2.png") no-repeat center center;
        }

        .home4 {
          background: url("../assets/pageTitle/1_1_3.png") no-repeat center center;
        }

        .ybliu1 {
          background: url("../assets/pageTitle/2_six.png") no-repeat center center;
        }

        .ybliu2 {
          background: url("../assets/pageTitle/2_1_1.png") no-repeat center center;
        }

        .ybliu3 {
          background: url("../assets/pageTitle/2_1_2.png") no-repeat center center;
        }

        .ybliu4 {
          background: url("../assets/pageTitle/2_1_3.png") no-repeat center center;
        }

        .people1 {
          background: url("../assets/pageTitle/3_person.png") no-repeat center center;
        }

        .people2 {
          background: url("../assets/pageTitle/3_1_1.png") no-repeat center center;
        }

        .people3 {
          background: url("../assets/pageTitle/3_1_2.png") no-repeat center center;
        }

        .people4 {
          background: url("../assets/pageTitle/3_1_3.png") no-repeat center center;
        }

        .car1 {
          background: url("../assets/pageTitle/4_car.png") no-repeat center center;
        }

        .car2 {
          background: url("../assets/pageTitle/4_1_1.png") no-repeat center center;
        }

        .car3 {
          background: url("../assets/pageTitle/4_1_2.png") no-repeat center center;
        }

        .car4 {
          background: url("../assets/pageTitle/4_1_3.png") no-repeat center center;
        }

        .house {
          background: url("../assets/pageTitle/house.png");
        }

        .warning1 {
          background: url("../assets/pageTitle/5_info.png") no-repeat center center;
        }

        .warning2 {
          background: url("../assets/pageTitle/5_1_1.png") no-repeat center center;
        }

        .warning3 {
          background: url("../assets/pageTitle/5_1_2.png") no-repeat center center;
        }

        .warning4 {
          background: url("../assets/pageTitle/5_1_3.png") no-repeat center center;
        }

        .model1 {
          background: url("../assets/pageTitle/6_model.png") no-repeat center center;
        }

        .model2 {
          background: url("../assets/pageTitle/6_1_1.png") no-repeat center center;
        }

        .model3 {
          background: url("../assets/pageTitle/6_1_2.png") no-repeat center center;
        }

        .model4 {
          background: url("../assets/pageTitle/6_1_3.png") no-repeat center center;
        }

        .jiaotong {
          background: url("../assets/pageTitle/jiaotong.png");
        }

        .shiju {
          background: url("../assets/pageTitle/shiju.png");
        }

        &.is-active {
          .icon {
            width: 84px;
            height: 84px;
          }

          &:hover {
            &:after {
              border-top: 5px solid #fff;
            }
          }

          .menu-drop-common {
            width: 84px;
            height: 84px;
            position: absolute;
            margin-top: 0px;
          }

          .home1 {
            background: url("../assets/pageTitle/1_shouye.png") no-repeat center center;
          }

          .home2 {
            background: url("../assets/pageTitle/1_2_1.png") no-repeat center center;
          }

          .home3 {
            background: url("../assets/pageTitle/1_2_2.png") no-repeat center center;
          }

          .home4 {
            background: url("../assets/pageTitle/1_2_3.png") no-repeat center center;
          }

          .ybliu1 {
            background: url("../assets/pageTitle/2_six.png") no-repeat center center;
          }

          .ybliu2 {
            background: url("../assets/pageTitle/2_2_1.png") no-repeat center center;
          }

          .ybliu3 {
            background: url("../assets/pageTitle/2_2_2.png") no-repeat center center;
          }

          .ybliu4 {
            background: url("../assets/pageTitle/2_2_3.png") no-repeat center center;
          }

          .people1 {
            background: url("../assets/pageTitle/3_person.png") no-repeat center center;
          }

          .people2 {
            background: url("../assets/pageTitle/3_2_1.png") no-repeat center center;
          }

          .people3 {
            background: url("../assets/pageTitle/3_2_2.png") no-repeat center center;
          }

          .people4 {
            background: url("../assets/pageTitle/3_2_3.png") no-repeat center center;
          }

          .car1 {
            background: url("../assets/pageTitle/4_car.png") no-repeat center center;
          }

          .car2 {
            background: url("../assets/pageTitle/4_2_1.png") no-repeat center center;
          }

          .car3 {
            background: url("../assets/pageTitle/4_2_2.png") no-repeat center center;
          }

          .car4 {
            background: url("../assets/pageTitle/4_2_3.png") no-repeat center center;
          }

          .house1 {
            background: url("../assets/pageTitle/house02.png");
          }

          .warning1 {
            background: url("../assets/pageTitle/5_info.png") no-repeat center center;
          }

          .warning2 {
            background: url("../assets/pageTitle/5_2_1.png") no-repeat center center;
          }

          .warning3 {
            background: url("../assets/pageTitle/5_2_2.png") no-repeat center center;
          }

          .warning4 {
            background: url("../assets/pageTitle/5_2_3.png") no-repeat center center;
          }

          .model1 {
            background: url("../assets/pageTitle/6_model.png") no-repeat center center;
          }

          .model2 {
            background: url("../assets/pageTitle/6_2_1.png") no-repeat center center;
          }

          .model3 {
            background: url("../assets/pageTitle/6_2_2.png") no-repeat center center;
          }

          .model4 {
            background: url("../assets/pageTitle/6_3_3.png") no-repeat center center;
          }

          .jiaotong {
            background: url("../assets/pageTitle/jiaotong02.png");
          }

          .shiju {
            background: url("../assets/pageTitle/shiju02.png");
          }
        }
      }
    }

    .el-menu, .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
      background: transparent !important;
    }
  }
</style>
