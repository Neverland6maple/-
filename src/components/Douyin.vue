<template>
  <div class="dy_container">
    <div class="move_div" :style="{top:distance+'px'}">
      <Vid v-for="(item,index) in total" :item="item" :key="index" :handle="handle" class="mask" :mask="current == index ? 'active': ''"></Vid>
    </div>
  </div>
</template>

<script>
import Vid from '@/components/Vid.vue'
export default {
  components:{
    Vid
  },
  data(){
    return {
      current:0,
      //节流阀
      flag:true,
      //可拖动板块
      dv:null,
      // 鼠标的y坐标
      y:0,
      //板块的style.top
      t:0,
      distance:0,
      //判断是在规定区域拖拽
      cl:false,
      //视频数据数组
      total:[],
      //总渲染视频数
      count:0
    }
  },
  created(){
    this.$bus.$on('toDy',res=>{
      this.total.push(...res);
      this.count+=5;
    })
    this.update();
  },
  mounted(){
    // 当dom加载完毕后，监听鼠标滚轮事件 兼容性写法
    this.dv = document.querySelector('.move_div')
    if (window.addEventListener)//FF,火狐浏览器会识别该方法
    window.addEventListener('DOMMouseScroll', this.wheel, false);
    window.onmousewheel  = this.wheel;

      //按下鼠标
      this.dv.addEventListener('mousedown',e=>{
      //关闭延缓动画，允许拖拽
      this.dv.style.transition = 'none';
      this.y = e.clientY;
      this.t = this.dv.style.top;
      //在规定区域按下鼠标
      this.cl = true;
      if(this.t){
        this.t = parseInt(this.t.slice(0,-2)); 
      } 
      // 监听鼠标移动
      this.dv.addEventListener('mousemove',this.drag)
      this.dv.style.cursor = 'move';
      })
      //松开鼠标
      window.addEventListener('mouseup',e=>{
      //移出鼠标移动监听
      this.dv.removeEventListener('mousemove',this.drag);
      this.dv.style.cursor = 'default';
      //恢复延缓动画
      this.dv.style.transition = 'all 0.8s';
      //在规定区域内拖拽
      if(this.cl){
        if((this.distance-this.current*-600)%600 > 100){
        this.handle(1)
        }else if((this.distance-this.current*-600)%600 < -100){
        this.handle(-1)
        }else if((this.distance-this.current*-600)%600 != 0){
        this.dv.style.transition = 'all 0.3s';
        this.distance = this.current*-600
        }
      }
    })
  },
  methods: {
  //滚轮事件
  wheel(event){
    if(this.flag){
    var delta = 0;
    if (!event) event = window.event;
     //判断鼠标滚轮滚动方向
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
  //拖拽事件
  drag(e){
    const ny = e.clientY;
    this.distance = parseInt(this.t + (ny - this.y));
  },
  //加载更多视频
  update(){
    this.$bus.$emit('random_5',{
      page:Math.ceil(Math.random()*50),
      pageSize:5,
      type:0,
      to:4
    })
  }
  },
  watch:{
    current(n,o){
      //不允许current小于0 即页面不能在第一个视频更往上
      if(n < 0){
        this.distance = ++this.current * -600 
      } 
      //侦听看是否需要加载更多视频
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