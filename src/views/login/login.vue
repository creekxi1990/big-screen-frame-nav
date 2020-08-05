<template>
  <div class="login-wrap">
    <div class="login-container">
      <lang-select class="set-language"/>
      <div class="login-box">
        <el-form
          :model="loginForm"
          :rules="rules"
          class="demo-ruleForm"
          ref="loginForm"
          status-icon
        >
          <el-form-item>
            <div class="system-logo"></div>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              :placeholder="$t('login.usernamePlaceholder')"
              autocomplete="off"
              prefix-icon="iconfont2 icondenglu_yonghuming"
              type="text"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :placeholder="$t('login.passwordPlaceholder')"
              autocomplete="off"
              prefix-icon="iconfont2 icondenglu_mima"
              type="password"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="disable"
              @click="submitForm('loginForm')"
              class="login-btn"
              style="width:100%"
              type="primary"
            >{{$t('login.login')}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import LangSelect from '@/components/LangSelect/LangSelect'

  export default {
    components: { LangSelect },
    data () {
      return {
        disable: false,
        loginForm: {
          username: '',
          password: ''
        }
      }
    },
    mounted () {
      document.onkeyup = (e) => {
        if (e.keyCode === 13) {
          !this.disable && this.submitForm('loginForm')
        }
      }
    },
    computed: {
      rules () {
        return {
          username: [
            {
              required: true,
              message: this.$t('login.usernamePlaceholder'),
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: this.$t('login.passwordPlaceholder'),
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.disable = true
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.loginForm.username === sysConfig.user.userName && this.loginForm.password === sysConfig.user.password) {
              Cookies.set('token', 11111) // 放置token到Cookie // token无作用
              this.$router.push('/main')
            } else {
              this.$message({
                message: this.$t('login.loginError'),
                type: 'error'
              })
            }
            this.disable = false
          } else {
            this.disable = false
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .login-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("../../assets/login/bg.png");
    background-size: 100% 100%;

    .set-language {
      position: absolute;
      right: 8%;
      top: 10%;

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: transparent;
        color: #1690FB;
        border: 0;
        padding: 0 10px;
        box-shadow: -1px 0 0 0 transparent;
      }

      .el-radio-button {
        &:first-child {
          border-right: 1px solid #ccc;
        }

        .el-radio-button__inner {
          border: 0;
          padding: 0 10px;

          &:hover {
            color: #1690FB;
          }
        }
      }
    }

    .system-logo {
      width: 100%;
      height: 35px;
      background: url("../../assets/login/logo.png") no-repeat center top;
      margin-bottom: 20px;
    }

    .login-container {
      position: relative;
      width: 75%;
      height: 90%;
      min-height: 675px;
      background: url("../../assets/login/login.png");
      background-size: 100% 100%;
    }

    .login-box {
      width: 30%;
      position: absolute;
      right: 10%;
      top: 50%;
      transform: translateY(-50%);
    }

    .login-btn {
      height: 59px;
      background: linear-gradient(270deg, rgba(22, 144, 251, 1) 0%, rgba(87, 188, 254, 1) 100%);
      box-shadow: 0px 4px 12px 1px rgba(76, 180, 253, 0.46);
      border-radius: 30px;
      font-size: 18px;
      border: 0;

      &:hover,
      &:focus {
        background: linear-gradient(270deg, rgba(22, 144, 251, 0.8) 0%, rgba(87, 188, 254, 0.8) 100%);
        box-shadow: 0px 4px 12px 1px rgba(76, 180, 253, 0.46);
      }
    }

    .code {
      width: 133px;
      height: 40px;
      display: inline-block;
      vertical-align: -15px;
      border-radius: 5px;
      margin-left: 7px;
    }

    .el-input__inner {
      border: 0;
      border-bottom: 1px solid #E1E2E6;
      border-radius: 0;
      padding-left: 40px;
      box-shadow: inset 0 0 0 1000px #fff !important;

      &:focus {
        border-color: #1690FB;
      }
    }

    .captcha-container {
      position: relative;

      img {
        position: absolute;
        right: 0;
        top: -2px;
      }
    }
  }
</style>
