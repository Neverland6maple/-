<template>
  <div class="dy_container">
    <div class="move_div" :style="{top:distance+'px'}">

      <Vid v-for="(item,index) in total" :item="item" :key="index" :handle="handle" class="mask" :mask="current == index ? 'active': ''"></Vid>

    </div>
  </div>
</template>

<script>
import Vid from '@/components/Vid.vue'
import bus from '@/components/eventbus.js'
export default {
  components:{
    Vid
  },
  data(){
    return {
      current:0,
      flag:true,
      dv:null,
      y:0,
      t:0,
      distance:0,
      cl:false,
      total:[],
      count:0
    }
  },
  created(){
    bus.$on('toDy',res=>{
      this.total.push(...res);
      this.count+=5;
      console.log(this.count);
    })
    this.update();
  },
  mounted(){
    //兼容性写法，该函数也是网上别人写的，不过找不到出处了，蛮好的，所有我也没有必要修改了
    //判断鼠标滚轮滚动方向
    this.dv = document.querySelector('.move_div')
    if (window.addEventListener)//FF,火狐浏览器会识别该方法
    window.addEventListener('DOMMouseScroll', this.wheel, false);
    window.onmousewheel  = this.wheel;

    //统一处理滚轮滚动事件
    this.dv.addEventListener('mousedown',e=>{
      this.dv.style.transition = 'none';
      this.y = e.clientY;
      this.t = this.dv.style.top;
      this.cl = true;

      if(this.t){
        this.t = parseInt(this.t.slice(0,-2)); 
      } 

      this.dv.addEventListener('mousemove',this.drag)
      this.dv.style.cursor = 'move';
    })
    window.addEventListener('mouseup',e=>{
      
      this.dv.removeEventListener('mousemove',this.drag);
      this.dv.style.cursor = 'default';
      this.dv.style.transition = 'all 0.8s';
      if(this.cl){
        if((this.distance-this.current*-600)%600 > 0){
        this.handle(1)
      }else if((this.distance-this.current*-600)%600 < 0){
        this.handle(-1)
      }
      }
      this.cl = false;
    })
  },
  methods: {
    wheel(event){
    if(this.flag){
    this.flag = false;
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
        delta = event.wheelDelta/120; 
        if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
    } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
        delta = -event.detail/3;
    }
    if (delta)
        this.handle(delta);
    }
  },
  handle(delta) {
    if (delta <0){//向下滚动
        this.distance = ++this.current * -600 
    }else{//向上滚动
        this.distance = --this.current * -600
    };
    this.flag = false;
    var open = setInterval(()=>{
      this.flag = true;
      clearInterval(open);
    },800);

  },
  drag(e){
    const ny = e.clientY;
    this.distance = parseInt(this.t + (ny - this.y));
  },
  update(){
    bus.$emit('random_5',{
      page:Math.ceil(Math.random()*50),
      pageSize:5,
      type:0,
      to:4
    })
  }
  },
  watch:{
    current(n,o){
      if(n < 0){
        this.distance = ++this.current * -600 
      } 
      if(this.count - n <= 3){
        this.update()
      }
    },

  }
}
</script>

<style>
.move_div{
  position: absolute;
  top: 0px;
  width: 100%;
  transition: all 0.8s;

}
.dy_container{
  position: relative;
  width: 100%;
  height: 580px;
  overflow: hidden;
}
</style>