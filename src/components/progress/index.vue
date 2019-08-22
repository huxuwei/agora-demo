<template>
    <div class="progress-bar">
        <div class="bar-inner" ref="progressWrap">
            <div class="progress" ref="progress" :style="{background}"></div>
            <g-progress-box
                :maxWidth="maxWidth" 
                ref="progressBox"
                :percentageWidth="width" @move="move" @up='up'></g-progress-box>
        </div>
    </div>
</template>

<script>
import GProgressBox from './progressBox'
export default {
    name: 'GProgress',
    components: {GProgressBox},
    props:{
        percentage: {
            type: Number,
            default: 0
        },
        background: {
            type: String,
            default: '#ffcd32'
        }
    },
    data() {
        return {
            width: 0,
            newWidth: 0,
            maxWidth: 0
        }
    },
    watch: {
        percentage: {
            immediate: true,
            handler(val) {
                this.$nextTick(()=>{
                    let progress = this.$refs.progress
                    if(progress){
                       
                        this.maxWidth = this.$refs.progressWrap.clientWidth - this.progressBoxWidth
                         this.width = this.maxWidth * val/100
                        progress.style.width = this.width
                    }
                })
                
            }
        }
    },
    computed: {
        nowpercentage() {
            return parseInt(this.newWidth / this.$refs.progressWrap.clientWidth * 100)
        },
        progressBoxWidth() {
            return this.$refs.progressBox.$el.clientWidth
        }
    },
    methods: {
        move(val) {
            this.$refs.progress.style['width'] = val +'px' 
            this.newWidth = val
            this.$emit('move', this.nowpercentage)
        },
        up(up) {
            this.width =  this.newWidth
            this.$emit('end', this.nowpercentage)
        }
    }
}
</script>

<style lang="less" scoped>
.progress-bar {
    height: 30px;
    .bar-inner{
        position: relative;
        top: 14px;
        height: 4px;
        background-color: rgba(0,0,0,0.3);
        .progress{
            position: absolute;
            height: 100%;
        }
    }
}
</style>