<template>
  <div class="function-manage">
    <div class="function-container">
      <el-dropdown @command="clickFunctionMenu" class="function-manage">
        <div>
          <el-tooltip class="item" effect="dark" :content="userName" placement="top">
            <span class="title">{{userName}}</span>
          </el-tooltip>
          <img src="../assets/main/icon_gongnengguanli.png" alt="" class="fl mt-10">
          <i class="arrow-down el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="menu1"  style="width:150px;">
          <el-dropdown-item :command="3"><i class="component"></i>组件管理</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="clickFunctionMenu" class="user-dropdown fl">
        <i class="user-button"></i>
        <el-dropdown-menu slot="dropdown" class="menu2">
          <el-dropdown-item :command="5"><i class="logout"></i>注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :visible.sync="exitDialogVisible"
      @close="exitDialogVisible = false"
      class="exit-dialog"
      custom-class="prompt-dialog-style"
      z-index="1001"
      title="提示"
      top="273px">
      <div class="info-content">
        <!--<i class="info-icon"></i>-->
        <img src="../assets/main/info.png" alt="">
        <div>您确定要注销退出吗？</div>
      </div>
      <div style="margin-top: 20px">
        <el-button @click="exitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FunctionManage',
  data () {
    return {
      userName: 'admin',
      exitDialogVisible: false
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    clickFunctionMenu (value) {
      switch (value) {
        case 3:
          this.$store.dispatch('view/setComponentLibraryVisible', true)
          break
        case 5:
          this.openLogoutBox()
          break
        default:
          break
      }
    },
    openLogoutBox () {
      this.exitDialogVisible = true
    },
    logout () {
      console.log('用户退出')
    }
  }
}
</script>

<style lang="scss">
  .function-manage{
    z-index: 999;
    .function-container{
      float:right;
      width:270px;
      height:43px;
      background: url('../assets/main/function_bg_right.png') center no-repeat;
      .function-manage{
        .el-icon-arrow-down {
          transform: rotate(0deg);
          transition: transform 0.2s linear;
        }
        &:hover {
          .el-icon-arrow-down {
            transform: rotate(180deg);
            transition: transform 0.2s linear;
          }
        }
      }
      .title{
        height:43px;
        line-height: 43px;
        font-size:18px;
        font-family:MicrosoftYaHei;
        /*font-weight:bold;*/
        color:rgba(255,255,255,1);
        margin-left: 10px;
        margin-right: 10px;
        width: 100px;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        float: left;
      }

      .arrow-down{
        width: 13px;
        height: 9px;
        margin-left: 7px;
        display: inline-block;
        margin-top: 14px;
      }

      .user-button {
        background: url('../assets/main/function_user.png') center no-repeat;
        width: 32px;
        height: 32px;
        float: right;
        margin-right: 4px;
        margin-top: 5px;
        vertical-align: middle;
        margin-left: 11px;
        display: inline-block;
      }
    }
  }

  .el-dropdown-menu.menu1 {
    margin-top: 8px;
    width: 150px;
    border-radius: 0;
    position: absolute;
    float: right;
    margin-right: -80px;

    &:before {
      content: "";
      position: absolute;
      top: -6px;
      left: 20px;
      display: inline-block;
      width: 12px;
      height: 6px;
      background: url("../assets/main/icon-angle-black.png") no-repeat;
    }

    .el-dropdown-menu__item {
      text-align: left;
      line-height: 32px;
      &:hover {
        background: rgba(40,148,240,1);
      }
    }
    .component {
      margin-right: 5px;
      margin-top: -3px;
      display: inline-block;
      vertical-align: middle;
      width:17px;
      height:15px;
      background: url("../assets/main/component.png");
    }
  }

  .el-dropdown-menu.menu2 {
    margin-top: 8px;
    width: 130px;
    border-radius: 0;
    position: absolute;
    top: 10% !important;
    float: right;
    margin-right: -80px;

    &:before {
      content: "";
      position: absolute;
      top: -6px;
      left: 20px;
      display: inline-block;
      width: 12px;
      height: 6px;
      background: url("../assets/main/icon-angle-black.png") no-repeat;
    }

    .el-dropdown-menu__item {
      text-align: left;
      line-height: 32px;
      &:hover {
        background: rgba(40,148,240,1);
      }
    }
    .logout {
      margin-right: 5px;
      margin-top: -3px;
      display: inline-block;
      vertical-align: middle;
      width:16px;
      height:16px;
      background: url("../assets/main/logout.png");
    }
  }

  .exit-dialog {
    /*width: 1920px;
    height: 1080px;*/
    margin-left:-1050px !important;
    width:820px;
    height:500px;
    .info-content {
      width: 100%;
      height: 100px;
      color: #666;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
      div{
        color: #fff;
        font-size: 20px;
        font-family: "Microsoft YaHei";
        margin-top: 5px;
      }
    }

    /*.info-icon {
      margin-top: 1px;
      margin-right: 20px;
      font-size: 20px;
      position: relative;

      &:before {
        content: " ";
        width: 56px;
        height: 56px;
        display: inline-block;
        position: absolute;
        left: -20px;
        background: url("../assets/public/info.png");
      }
    }*/
  }

  .el-form-item__label {
    color: #fff;
  }
</style>
