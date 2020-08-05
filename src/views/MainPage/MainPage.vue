<template>
  <div class="main-page-container">
    <map-view></map-view>
    <div class="title-container">
      <page-title :systemTitle="systemTitle"></page-title>
    </div>
    <div class="system-config">
      <function-manage></function-manage>
    </div>
    <div class="left-container">
      <div v-for="index in 3" :key="index" class="module-content">
        <drop @dragleave="dragleave" @dragover="dragover" @drop="handleDrop"
              class="drop side-tab-panel"
              :data-view="'view'+index">
          <drag :id="view['view'+index].name" key="index" :transfer-data="view['view'+index]" class="drag" @dragstart="componentDragstart" @dragend="componentDragend">
            <div :is="view['view'+index].name" draggable="true"></div>
          </drag>
        </drop>
      </div>
    </div>
    <!--<div class="middle-container">
      <echarts-map-view></echarts-map-view>
    </div>-->
    <div class="right-container">
      <div v-for="index in 3" :key="index" class="module-content">
        <drop @dragleave="dragleave" @dragover="dragover" @drop="handleDrop"
              class="drop side-tab-panel"
              :data-view="'view'+(index+3)">
          <drag :id="view['view'+(index+3)].name" key="index" :transfer-data="view['view'+(index+3)]" class="drag" @dragstart="componentDragstart" @dragend="componentDragend">
            <div :is="view['view'+(index+3)].name" draggable="true"></div>
          </drag>
        </drop>
      </div>
    </div>
    <div class="realtime-alarm-container">
      <realtime-alarm></realtime-alarm>
    </div>
    <transition :name="transitionName">
      <div class="component-library-container" v-if="componentLibraryVisible">
        <div class="close-container">
          <i @click="componentLibraryVisible = false" class="el-icon-close"></i>
        </div>
        <div class="title">组件管理</div>
        <el-scrollbar>
          <div class="component-container">
            <template v-for="(item,index2) in componentArr">
              <drag :key="index2"
                    :title="item.name" :transfer-data="item"
                    class="drag" @dragstart="componentLibraryDragstart" @dragend="componentLibraryDragend">
                <div class="component-library-content">
                  <div class="component-library" draggable="true">
                    <img :src="item.component | imgFilter" alt="">
                  </div>
                </div>
              </drag>
            </template>
          </div>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import EchartsMapView from '@/components/EchartsMapView'
import MapView from '@/components/MapView'
import FunctionManage from '@/components/FunctionManage'
import { Drag, Drop } from 'vue-drag-drop'
import componentList from '../../../public/componentLibrary/json/componentLibrary'
import homePageView from '../../../public/componentLibrary/json/homePageView'
const requireContext = require.context('./modules/', false, /\.vue$/)
const components = requireContext.keys().reduce((acc, key) => {
  const component = requireContext(key).default
  acc[component.name] = component
  return acc
}, {})
export default {
  name: 'MainPage',
  components: Object.assign({
    PageTitle,
    EchartsMapView,
    MapView,
    FunctionManage,
    Drag,
    Drop
  },components),
  data () {
    return {
      // eslint-disable-next-line
      systemTitle: sysConfig.systemTitle,
      view: {},
      componentArr: [], // 未在页面显示的组件放在组件库里
      componentList: componentList, // 全部组件列表
      homePageView: homePageView, // 初始页面加载的组件
      componentLibraryVisible: false,
      dargType: 1, // 1为菜单拖动 0为组件拖动
      nowView: {}, // 当dargType == 0 时 代表当前鼠标拖动的组件
      transitionName: 'nav-left'
    }
  },
  filters: {
    imgFilter (v) {
      return require('../../../public/componentLibrary/images/' + v + '.png') // 图片名称与模块名称保持一致
    }
  },
  created () {
    // localStorage.removeItem('homePageView')
    this.initView()
    this.initDragComponent()
  },
  watch: {
    '$store.getters.componentLibraryVisible': {
      handler (v) {
        if (v) {
          this.componentLibraryVisible = true
          this.$store.dispatch('view/setComponentLibraryVisible', false)
        }
      }
    }
  },
  methods: {
    initDragComponent () {
      this.componentArr = []
      for (let i = 0; i < this.componentList.length; i++) {
        if (!this.searchComponent(this.componentList[i].component)) {
          // if (!this.componentObj[this.componentList[i].class]) this.componentObj[this.componentList[i].class] = [];
          this.componentArr.push(this.componentList[i])
          // this.componentObj[this.componentList[i].class].push(this.componentList[i])
        }
      }
    },
    initView () {
      if (localStorage.homePageView) {
        this.view = JSON.parse(localStorage.getItem('homePageView'))
      } else {
        this.view = this.homePageView
      }
    },
    dragover (data, e) {
      e.currentTarget.style.opacity = '0.8'
    },
    dragleave (data, e) {
      e.currentTarget.style.opacity = '1'
    },
    handleDrop (data, e) {
      if (this.dargType) {
        e.currentTarget.style.opacity = '1'
        if (this.searchComponent(data.component)) {
          this.$message({
            message: '此模块已存在页面中',
            type: 'warning'
          })
          // return;
        }
        this.view[e.currentTarget.dataset.view].name = data.component
      } else {
        e.currentTarget.style.opacity = '1'
        let name = data.name
        this.nowView.name = this.view[e.currentTarget.dataset.view].name
        this.view[e.currentTarget.dataset.view].name = name
      }
      this.initDragComponent()
      localStorage.setItem('homePageView', JSON.stringify(this.view))
    },
    // 判断页面是否已存在拖拽的模块
    searchComponent (component) {
      for (let i in this.view) {
        if (this.view[i].name === component) {
          return true
        }
      }
      return false
    },
    // 区别菜单拖动和组件相互拖动
    componentDragstart (data, e) {
      e.currentTarget.style.opacity = '.99' // 防止鼠标拖拽框出现其他框的虚影
      this.dargType = 0
      this.nowView = data
    },
    componentDragend (data, e) {
      e.currentTarget.style.opacity = '1'
    },
    componentLibraryDragstart (data, e) {
      e.currentTarget.style.opacity = '0.3'
      this.dargType = 1
    },
    componentLibraryDragend (data, e) {
      e.currentTarget.style.opacity = '1'
    }
  }
}
</script>

<style scoped lang="scss">
.main-page-container{
  width: 100%;
  height: 100%;
  .title-container{
    position: absolute;
    top: 0;
    width: 100%;
  }
  .system-config{
    width: 273px;
    height: 43px;
    position: absolute;
    top: 70px;
    right: 32px;
    z-index: 999;
    cursor: pointer;
  }
  .left-container{
    position: absolute;
    width: 500px;
    height: 970px;
    left: 10px;
    top: 100px;
  }
  .middle-container{
    position: absolute;
    left: 490px;
    top: 200px;
    width: calc( 100% - 980px);
    height: 860px;
  }
  .right-container{
    position: absolute;
    width: 530px;
    height: 970px;
    right: 10px;
    top: 100px;
    text-align: right;
  }
  .realtime-alarm-container{
    width: 858px;
    position: absolute;
    bottom: 20px;
    margin: auto;
    left: 0;
    right: 0;
  }
  .component-library-container {
    position: absolute;
    width: 340px;
    height: 100%;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999;

    .el-scrollbar {
      height: calc(100% + 20px);
      .component-container{
        padding-left: 20px;
      }
    }
    .close-container {
      width: 76px;
      height: 76px;
      position: absolute;
      right: -38px;
      top: -38px;
      background: #4766B3;
      border-radius: 38px;

      .el-icon-close {
        position: absolute;
        left: 16px;
        top: 45px;
        font-size: 22px;
        color: #fff;
        cursor: pointer;
      }
    }
    .title {
      font-size: 20px;
      font-family: "Microsoft Yahei";
      font-weight: 400;
      color: #fff;
      line-height: 70px;
      padding-left: 30px;
    }

    .el-collapse-item {
      border-bottom: 1px solid #E3E3E3;
      margin-left: 20px;
    }

    .el-collapse-item__header {
      margin-left: 0;
      font-size: 16px;

      &:hover {
        color: #6288D9;
      }
    }

    .el-collapse-item__wrap {
      background: transparent !important;
    }
    .component-library-content {
      margin: 15px 0 10px 0px;

      .component-library {
        width: 300px;
        height: 190px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .module-content{
    display: inline-block;
    width: 470px;
    height: 300px;
    margin-top: 20px;
    text-align: left;
    .drag {
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
    .drop.over {
      opacity: 0.8;
    }

    .side-tab-panel {
      width: 100%;
      height: 100%;
    }

  }
  /*过度动画*/
  .nav-left-enter-active,
  .nav-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }
  .nav-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .nav-left-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
