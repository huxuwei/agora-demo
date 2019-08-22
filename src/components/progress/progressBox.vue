<template>
    <div class="progress-box" ref="progressBox" @mousedown="down">
        <div class="btn"></div>
    </div>    
</template>

<script>
export default {
    props:{
        percentageWidth: {
            type: Number,
            default: 0
        },
        maxWidth: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isMove: false
        }
    },
    watch: {
        percentageWidth(val) {
            if(this.isMove)return
            this.$refs.progressBox.style['transform'] = `translateX(${val}px)`
             this.$emit('move', val)
        }
    },
    methods: {
        down(e) {
            this.isMove = true
            this.startX = e.pageX
            document.body.addEventListener('mousemove', this.move)
            document.body.addEventListener('mouseup', this.up)
        },
        move(e) {
           if(this.isMove){
                let disX = e.pageX - this.startX
                let translateX = this.percentageWidth + disX
                translateX = Math.max(translateX, 0)
                translateX = Math.min(translateX, this.maxWidth)
                this.$refs.progressBox.style['transform'] = `translateX(${translateX}px)`
                this.$emit('move', translateX)
           }
           e.preventDefault()
        },
        up(e) {
            this.isMove = false
            document.body.removeEventListener('mousemove',this.move)
            document.body.removeEventListener('mouseup', this.up)
            this.$emit('up',e.pageX)
        }
    }
}
</script>

<style lang="less" scoped>
.progress-box{
    position: absolute;
    top: -6px;
    left: 0;
    cursor: pointer;
    .btn{
        width: 10px;
        height: 10px;
        background: #ffcd32;
        border: 3px solid #ffffff;
        border-radius: 50%;
    }
}
</style>