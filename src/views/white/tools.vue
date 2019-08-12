<template>
  <div class="tools-wrap">
    <el-button size='small' type='text'  
      v-for="(item,i) in list"
      :key="i"
      @click="changeTool(item,i)">
      <g-icon class="icon" :color="i===activeIndex?'rgb(236, 52, 85)':''"  :icon="item.icon"></g-icon>
    </el-button>
    <!-- <el-button size='small' type='text'  @click="changeTool('pencil')">
      <g-icon class="icon"  icon="iconpencil"></g-icon>
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
    </el-button> -->
  </div>
</template>

<script>
import gIcon from '@/components/icon'
export default {
  components: {gIcon},
  data() {
    return {
      activeIndex: 0,
      list: [
        {text: 'selector',icon: 'iconxuanze' },
        {text: 'pencil',icon: 'iconpencil' },
        {text: 'rectangle',icon: 'iconrectangle' },
        {text: 'ellipse',icon: 'iconellipse' },
        {text: 'eraser',icon: 'iconeraser1' },
        {text: 'text',icon: 'icontext1' },
      ]
    }
  },
  methods: {
    changeTool(item,i ) {
      this.activeIndex =  i
      this.$emit('changeTool', item.text)
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
}
</style>
