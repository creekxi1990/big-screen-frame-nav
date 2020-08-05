<template>
    <div class="test-module1">
      <el-tabs v-model="activeName" type="card" class="znv-module-tab">
        <el-tab-pane label="用户管理1" name="first"></el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
export default {
  name: 'TestModule1',
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style scoped>
.test-module1{
  width: 100%;
  height: 100%;
  font-size: 24px;
}
</style>
