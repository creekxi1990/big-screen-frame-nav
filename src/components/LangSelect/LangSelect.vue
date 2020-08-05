<template>
  <el-radio-group v-if="type === 'radio'" v-model="language" @change="handleSetLanguage">
    <el-radio-button
      :key="item.value"
      :label="item.value"
      v-for="item in languageOptions">{{item.label}}</el-radio-button>
  </el-radio-group>
  <el-dropdown v-else @command="handleSetLanguage">
    <el-tooltip :content="$t('langSelect.title')" placement="left">
      <span class="el-dropdown-link">
        <i slot="reference" class="iconfont2 iconyuyanqiehuan language-change"></i>
      </span>
    </el-tooltip>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language===item.value" :command="item.value" v-for="(item,index) in languageOptions" :key="index">
        {{item.label}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>

  export default {
    props: {
      type: {
        type: String,
        default: 'radio'
      }
    },
    data() {
      return {
        languageOptions: sysConfig.language,
        language: this.$store.getters.language
      }
    },
    methods: {
      handleSetLanguage(lang) {
        this.$i18n.locale = lang
        this.language = lang
        this.$store.dispatch('setLanguage', lang)
        this.$message({
          message: this.$t('langSelect.warning'),
          type: 'success'
        })
      }
    }
  }
</script>
<style lang="scss">
  .language-change{
    margin-right: 15px;
    cursor: pointer;
  }
  .iconyuyanqiehuan:hover{
    color: var(--color-primary);
  }
</style>
