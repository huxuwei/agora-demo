<template>
  <div class="tools-wrap">
     <el-button size='small' type='text'  @click="changeTool('selector')">
      <g-icon class="icon" color='rgb(236, 52, 85)' icon="selector"></g-icon>
    </el-button>
    <el-button size='small' type='text'  @click="changeTool('pencil')">
      <g-icon class="icon" color='rgb(236, 52, 85)' icon="iconpencil"></g-icon>
    </el-button>
    <el-button size='small' type="text"  @click="changeTool('rectangle')">
      <g-icon class="icon" icon="iconrectangle"></g-icon>
    </el-button>
    <el-button size='small' type="text"  @click="changeTool('ellipse')">
      <g-icon class="icon" icon="iconellipse"></g-icon>
    </el-button>
    <el-button size='small' type="text"  @click="changeTool('eraser')">
      <g-icon class="icon" icon="iconeraser1"></g-icon>
    </el-button>
    <el-button size='small' type="text"  @click="changeTool('text')">
      <g-icon class="icon" icon="icontext1"></g-icon>
    </el-button>
  </div>
</template>

<script>
import gIcon from '@/components/icon'
export default {
  components: {gIcon},
  methods: {
    changeTool(val) {
      this.$emit('changeTool', val)
    }
  },
}
</script>

<style lang="less" scoped>
.tools-wrap{
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 10px;
  width: 400px;
  .active{
    color: rgb(236, 52, 85);
  }
}
</style>
