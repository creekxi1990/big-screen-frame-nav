<template>
    <div class="realtime-alarm">
      <header class="alarm-title">
        <span class="title">实时告警</span>
        <i class="show-all-switch icon-open-btn" v-show="!isShowAllAlarm" @click="isShowAllAlarm=true"></i>
        <i class="show-all-switch icon-close-btn" v-show="isShowAllAlarm" @click="isShowAllAlarm=false"></i>
      </header>
      <div class="alarm-content znv-panel" :style="{height: alarmPanelHeight}">
        <transition-group :name="isShowAllAlarm?'transition-alarm':'transition-single-alarm'" tag="ul" class="alarm-list">
          <li v-for="alarm in alarmShow" :key="alarm.alarmId" @click="findDeviceInMap(alarm)">
          <span class="alarm-info" :style="{width: alarmDataWidth[0]}">
            <span :class="'alarm-level-icon ' + 'level-' + ((alarm.alarmLevel === '一般') ? 'normal' : 'abnormal')"></span>
          </span>
            <el-tooltip effect="dark" :disabled="alarm.alarmTime ? disabled : !disabled" :content="alarm.alarmTime" placement="top">
              <span class="alarm-info" :style="{width: alarmDataWidth[1]}">{{ alarm.alarmTime.split(' ')[1] }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" :disabled="alarm.alarmTypeName ? disabled : !disabled" :content="alarm.alarmName || alarm.alarmTitle" placement="top">
              <span class="alarm-info" :style="{width: alarmDataWidth[2]}">{{ alarm.alarmName || alarm.alarmTitle }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" :disabled="(alarm.alarmPlace || alarm.address) ? disabled : !disabled" :content="alarm.alarmPlace || alarm.address" placement="top">
              <span class="alarm-info" :style="{width: alarmDataWidth[3]}">{{ alarm.alarmPlace || alarm.address }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" :content="alarm.alarmProcessState | alarmProcessStateFilter" placement="top">
              <span :class="'alarm-info state-field state-' + alarm.alarmProcessState" :style="{width: alarmDataWidth[4]}" @click.stop="showAlarmDialog(alarm)">{{ alarm.alarmProcessState | alarmProcessStateFilter }}</span>
            </el-tooltip>
          </li>
        </transition-group>
        <div class="more-alarm"
             title="更多告警"
             @click="goToAlarmPage">
          <i class="more-alarm-icon el-icon-arrow-right"></i>
          <i class="more-alarm-icon el-icon-arrow-right"></i>
        </div>
      </div>
      <audio id="alarmMP3" :src="alarmAudio" preload="preload" style="margin-top: -20px;"></audio>
    </div>
</template>

<script>
export default {
  name: 'RealtimeAlarm',
  data () {
    return {
      alarmData: [], // 展示的告警列表
      alarmDataWidth: ['3%', '17%', '35%', '35%', '10%'],
      isShowAllAlarm: false,
      alarmAudio: require('../../../../public/audio/xiaofanggaojing.mp3'),
      disabled: false
    }
  },
  computed: {
    alarmShow () {
      return this.isShowAllAlarm ? this.alarmData : (this.alarmData.length > 0 ? [this.alarmData[0]] : [])
    },
    alarmPanelHeight () {
      return this.isShowAllAlarm ? `${70 + (sysConfig.alarmShowNum - 1) * 50}px` : '70px'
    }
  },
  methods: {
    goToAlarmPage () {

    }
  }
}
</script>

<style scoped lang="scss">
  .realtime-alarm {
    width: 100%;
    position: relative;
    overflow: hidden;
    .hot-area {
      position: absolute;
      top: 30px;
      left: 0;
      width: 100%;
      height: 8px;
      cursor: n-resize;
      z-index: 15;
    }
    .alarm-title {
      width: 208px;
      height: 44px;
      display: block;
      margin: 0 auto;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        background: $el-tabs-item-active-background;
        transform: perspective(1em) rotateX(5deg);
        transform-origin:bottom;
      }
      .title {
        display: block;
        position: absolute;
        left: 17px;
        width: 175px;
        height: 44px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        font-size: 18px;
      }
      .show-all-switch {
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        top: calc(50% - 3px);
        right: 20px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        cursor: pointer;
        &:before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          position: absolute;
          top: calc(50% - 4px);
          left: calc(50% - 4px);
          background-size: 100% 100%;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.6);
        }
      }
    }
    .alarm-content {
      width: 100%;
      text-align: left;
      padding: 20px;
      font-size: 0; // 消除空格占位
      position: relative;
      transition: height .5s;
      background: $el-tab-pane-background;
      border: 2px solid $el-tab-pane-border;
    }
    .alarm-list {
      display: inline-block;
      vertical-align: bottom;
      width: calc(100% - 46px);
      position: relative;
      li {
        display: block;
        width: 100%;
        height: 30px;
        margin-top: 20px;
        line-height: 30px;
        text-align: center;
        font-size: 0;
        cursor: pointer;
        &:first-child {
          margin-top: 0;
        }
        &:hover .alarm-info {
          color: #249BFF;
        }
        &:hover .highlight-field {
          color: #249BFF;
        }
      }
      .alarm-info {
        display: inline-block;
        vertical-align: top;
        color: #fff;
        font-size: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .alarm-level-icon {
        display: block;
        width: 12px;
        height: 12px;
        margin: 9px auto;
        border-radius: 6px;
        &.level-abnormal {
          background-color: #F39800;
        }
        &.level-normal {
          background-color: #2EB8FF;
        }
      }
    }
    .transition-alarm-enter-active,
    .transition-alarm-leave-active,
    .transition-alarm-move,
    .transition-single-alarm-enter-active,
    .transition-single-alarm--leave-active {
      transition: transform 1s, opacity 1s;
    }
    .transition-alarm-move {
      margin-top: 20px;
    }
    .transition-alarm-leave-active {
      position: absolute;
      left: 0;
    }
    .transition-alarm-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }
    .transition-alarm-move {
      transition: transform 1s;
    }
    .transition-alarm-enter,
    .transition-single-alarm-enter,
    .transition-single-leave-to {
      opacity: 0;
      transform: translateY(-30px);
    }
    .more-alarm {
      display: inline-block;
      width: 36px;
      height: 36px;
      position: absolute;
      top: calc(50% - 18px);
      right: 20px;
      text-align: center;
      cursor: pointer;
      @keyframes changeOpacity {
        0% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.5;
        }
      }
      @keyframes changeOpacity2 {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 1;
        }
      }
      .more-alarm-icon {
        display: inline-block;
        float: left;
        width: 9px;
        font-size: 30px;
        font-weight: bold;
        line-height: 36px;
        color: #BBD0F2;
        animation-name: changeOpacity;
        animation-duration: 1s;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        & + .more-alarm-icon {
          animation-name: changeOpacity2;
          animation-duration: 1s;
          animation-delay: 0s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      }
    }
    .alarm-content .state-field {
      display: inline-block;
      width: 100%;
      height: 30px;
      color: #fff !important;
      border-radius: 15px;
      background: #E62129;
      &.state-00,
      &.state-01 {
        background: #F6A21D;
      }
      &.state-02 {
        background: #2894F0;
      }
      &.state-03 {
        background: #3eb93e;
      }
    }
    .icon-close-btn:before {
       background-image: url("../../../assets/main/icon-close.png");
     }
    .icon-open-btn:before {
      background-image: url("../../../assets/main/icon-open.png");
    }
  }
</style>
