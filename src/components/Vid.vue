<template>
  <div class="vid_container">
    <!-- 视频 -->
    <div class="v_bd">
      <video controls="controls" class="dy" crossorigin="anonymous" @pause="changestate(0)" @play="changestate(1)" ref='dy'>
        <source :src="item.dy_video_url" type="video/mp4">
      </video>
    </div>
    <!-- 隐藏区域加保护罩 -->
    <div :class="`mask ${mask}`"></div>
    <!-- 暂停图标 -->
    <div class="pause_icon aside" v-if="state == 0 && mask == 'active'" @click="start">
      <a-icon type="play-circle" />
    </div>
    <!-- 点击控制上下切换 -->
    <div class="control aside" v-if="mask == 'active'">
      <div class="arrow" @click="handle(1)">
        <a-icon type="up-circle" />
      </div>
      <div class="arrow" @click="handle(-1)">
        <a-icon type="down-circle" />
      </div>
    </div>
    <!-- 点赞评论转发 -->
    <div class="interaction aside" v-if="mask == 'active'">
      <!-- 点赞 -->
      <div class="item" v-if="!clicked" @click="change">
        <a-icon type="heart" />
        <div class="item_num">{{item.dy_video_like_count}}</div>
      </div>
      <div class="item item_clicked" v-else @click="change">
        <a-icon type="heart" />
        <div class="item_num">{{item.dy_video_like_count -0 + 1}}</div>
      </div>
      <!-- 评论 -->
      <div class="item" v-if="!clicked_c" @click="change(1)">
        <a-icon type="message" />
        <div class="item_num">{{item.dy_video_share_count}}</div>
      </div>
      <div class="item item_clicked" v-else @click="change(1)">
        <a-icon type="message" />
        <div class="item_num">{{item.dy_video_share_count-0+1}}</div>
      </div>
      <!-- 转发 -->
      <div class="item" @mouseenter="showlink(true)" @mouseleave="showlink(false)">
        <a-icon type="share-alt" />
      </div>
    </div>
    <!-- 视频链接 -->
    <div id="copy_container" class="copy_container" v-if="onicon" @mouseenter="showlink(true)" @mouseleave="showlink(false)">
      <div class="sub_title">点击复制视频链接</div>
      <div class="copy_cont">
        <input type="text" :value="item.dy_video_url" ref="ipt">
        <button @click="copy()">
          复制
        </button>
      </div>
    </div>
    <!-- 截图、跳转详情页 -->
    <div class="function" ref="drawer" @mouseleave="pull">
      <div class="item_l" @click="cut">
        <a-icon type="camera" />
      </div>
      <div class="item_l">
        <router-link :to="{name:'details',params:item}">
          <a-icon type="shopping-cart" />
        </router-link>
      </div>

      <div class="drawer_handle" @mouseenter="pull" v-if="shrink">
        <a-icon type="right" />
      </div>
      <div class="drawer_handle" v-else>
        <a-icon type="left" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    //父组件传来的上下切换动画
    handle:{},
    //通过父组件来判断哪个组件处于显示区
    mask:{
      type:String
    },
    item:{}
  },
  data(){
    return {
      //视频播放状态
      state:0,
      //链接框是否显示
      onicon:false,
      //点赞
      clicked:false,
      //评论
      clicked_c:false,
      //功能栏状态
      shrink:true
    }
  },
  methods: {
    changestate(s){
      this.state = s;
    },
    //复制功能
    copy(){
      this.$refs.ipt.select();
      document.execCommand("Copy");
       this.$refs.ipt.blur();
       this.$message.success('复制成功');
    },
    showlink(p){
      this.onicon = p;
    },
    start(){
      this.$refs.dy.play();
    },
    change(s){
      if(s == '1'){
        this.clicked_c = !this.clicked_c
      }else{
        this.clicked = !this.clicked 
      }
    },
    pull(){
      this.shrink = !this.shrink;
      if(this.shrink){
      this.$refs.drawer.style = "";
      }else{
      this.$refs.drawer.style = "left:0px"
      }
    },
    cut(){
      const scale = 0.6;
      const video = this.$refs.dy;
      let canvas = document.createElement('canvas');
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight *scale;
      canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
      //VueNode
      const img = <img src=""/>
      img.data.attrs.src = canvas.toDataURL("image/png",2.0);
      this.$notification.open({
        message: '右键保存图片',
        description: img,
        class:'innerbox',
        style:{
          width:'165px',
          marginLeft:'150px',
          textAlign: 'center',
          padding:'10px 0'
        }
      });
    }
  },
}
</script>

<style scoped>
.innerbox img {
  width: 120px;
}
.drawer_handle{
  position: absolute;
  height: 100%;
  right: 0;
  top: 0;
  background-color: rgba(255, 255, 255, 0.05);
  line-height: 62px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 4px;
}
.function{
  position: absolute;
  display: flex;
  left: -200px;
  top: 40px;
  background-color: rgba(255,255,255,0.2);
  width: 225px;
  height: 62px;
  padding: 10px 38px 10px 28px;
  z-index: 3;
  transition: all 0.5s;
}
.item_l{
  color: #1890ff;
  font-size: 40px;
  flex: 1;
  line-height: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 5px;
  background-color: rgba(255, 255, 255, 0.1);
}
.item_l a{
  color: rgba(255, 255, 255, 0.6);
}
.item_l:hover{
  background-color: rgba(255, 255, 255, 0.2);
}
.aside{
  z-index: 4;
}
.mask{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 580px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 1s;
  z-index: 3;
}
.vid_container .active{
  background-color: rgba(255, 255, 255, 0);
  z-index: 1;
}
.item_clicked{
  color:#1890ff!important;
}
.copy_cont{
  line-height: 38px;
}
.sub_title{
  text-align: left;
  width: 265px;
  height: 18px;
  font-size: 14px;
  margin-bottom: 10px;
}
#copy_container{
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 24px rgba(0,0,0,.2);
    flex-direction: column;
    font-weight: 400;
    padding: 20px 0;
    position: absolute;
    width: 340px;
    right: 94px;
    bottom: 95px;  
  vertical-align: baseline; 
  z-index: 100;
}
.copy_container input {
  float: left;
  background-color: #eff0f3;
  height: 35px;
  outline: none;
  border-radius: 6px 0 0 6px;
  border: none;
  width: 200px;
  color: rgba(47,48,53,.4);
  padding-left: 12px;
  font-size: 20px;
  line-height: 35px;

}
#copy_container button{
  float: left;
  cursor: pointer;
  background-color: #1e94ff;
  border-radius: 0 6px 6px 0;
  border: none;
  height: 35px;
  line-height: 35px;
  width: 70px;
  color: #fff;
}
#copy_container button:hover{
  background-color: #40a9ff;
}
.arrow{
  color: rgba(255, 255, 255, 0.4);
  font-size: 32px;
}
.control{
  position:absolute;
  display: flex;
  flex-direction: column;
  top: 80px;
  right: 48px;
  width: 44px;
  text-align: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3px 6px;
}
.control:hover{
  background-color: rgba(255, 255, 255, 0.12);
}
.control:hover .arrow{
  color: rgba(255, 255, 255, 0.7);
}
.pause_icon{
  position: absolute;
  left:50%;
  top: 50%;
  color: rgba(255, 255, 255, 0.8);
  font-size: 50px;
  margin-left: -25px;
  margin-top: -40px;
}
.item_num{
  font-size: 18px;
  text-align: center; 
}
.item{
  cursor: pointer;
  width: 50px;
  height: 50px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 40px;
  margin: 25px 0;
  text-align: center;
  transition: all 0.3 ease-out;
}
.item:hover{
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.05);
}
.interaction{
  position: absolute;
  align-items: center;
  display: flex;
  flex-direction: column;
  right: 44px;
  top: 180px;
}
.dy{
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 1160px;
  height: 580px;
  margin: 0 auto;
  background-color: black;
  z-index: 2;
}
.vid_container {
  cursor: pointer;
  height: 580px;
  width: 1160px;
  background-color: pink;
  margin: 0px 0 20px 0;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
