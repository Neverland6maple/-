<template>
  <div class="remv_container">
    <!-- 后退 -->
    <div class="back" @click="back">
      <a-icon class="back_icon" type="arrow-left" />
    </div>
    <!-- 视频 -->
    <video controls="controls" :src="src" class="rem_video">
    </video>
    <!-- 点赞转发 -->
    <div class="data">
      <div class="heart">
        <span v-if="clicked == false">
          <a-icon type="heart" class="icon" @click="change" />
          <span>{{likes}}</span>
        </span>
        <span v-else>
          <a-icon type="heart" style="color:#1890ff" class="icon " theme="filled" @click="change" />
          <span>{{likes + 1}}</span>
        </span>
      </div>
      <div class="share">
        <span v-if="clicked_s == false">
          <a-icon type="share-alt" class="icon" @click="change('1')" />
          <span>{{shares}}</span>
        </span>
        <span v-else>
          <a-icon type="share-alt" style="color:#1890ff" class="icon" @click="change('1')" />
          <span>{{shares+1}}</span>
        </span>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      likes:parseInt(this.$route.params.likes)|| JSON.parse(localStorage.getItem('prod')).dy_video_like_count,
      src:this.$route.params.src || JSON.parse(localStorage.getItem('prod')).dy_video_url,
      shares:parseInt(this.$route.params.shares) || JSON.parse(localStorage.getItem('prod')).dy_video_share_count,
      //点赞状态
      clicked:false,
      //分享状态
      clicked_s:false
    }
  },
  methods:{
    change(s){
      if(s == '1'){
        this.clicked_s = !this.clicked_s
      }else{
        this.clicked = !this.clicked 
      }
    },
    back(){
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.back{
  position: absolute;
  left: 30px;
  top: 22px;
  color: #fff;
}
.back_icon{
  font-size: 38px;
  transition: all 0.2s linear;
}
.back_icon:hover{
  color: #92b3f5;
}
.icon:hover{
  color: #1890ff;
  transform: scale(1.2);
}
.icon{
  cursor: pointer;
  margin: 0 5px;
  transition: all 0.3s ease-out;
}
.data{
  position: relative;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 22px;
}
.heart{
  position:absolute;
  left: 35%;
}
.share{
  position: absolute;
  right: 35%;
}
  .remv_container{
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 10;
  }
  .rem_video{
    display: block;
    width: 800px;
    height: 500px;
    margin: 50px auto 0;
    background-color:powderblue;
  }
</style>