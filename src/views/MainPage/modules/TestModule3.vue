<template>
    <div class="test-module3">
      <el-tabs v-model="activeName" type="card" class="znv-module-tab">
        <el-tab-pane label="用户管理3" name="first"></el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
export default {
  name: 'TestModule3',
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style scoped>
.test-module3{
  width: 100%;
  height: 100%;
  font-size: 24px;
}
</style>
