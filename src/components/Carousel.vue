<template>
  <div class="carousel_container">
    <a-carousel arrows class="caro" autoplay>
      <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>

      <div v-for="item in prod" :key="item.itemid">
        <router-link :to="{name:'details',params:item}">
          <img :src="item.itempic" alt="" @mouseenter="disp" @mouseout="hide">
          <h3 class="intro" v-if="d_intro == true"><a href="javascript:;">{{item.itemtitle}}</a></h3>
        </router-link>
      </div>

    </a-carousel>
  </div>
</template>

<script>
import bus from '@/components/eventbus.js'
export default {
  data(){
    return {
      prod:[],
      d_intro:false
    }
  },
  watch:{
    '$route.query': {
      handler(newVal,oldVal){
        this.refresh +=1;
        this.$nextTick(()=>{
        bus.$emit('random_5',{
        page:Math.floor(Math.random()*19)+1,
        pageSize:5,
        type:0,
        to:2
        })
      })
      },
      immediate:true
    }
  },
  created(){
    bus.$on('toCaro',val=>{
      this.prod = val
    })
  },
  methods:{
    getRandom(){
      bus.$emit('random_5',{
      page:Math.floor(Math.random()*19)+1,
      pageSize:5,
      type:0
    })
    },
    disp(){
      this.d_intro = true;
    },
    hide(){
      this.d_intro = false;
    }
  }
}
</script>

<style scoped>
.caro{
  /* height: 500px; */
  width: 850px;
  margin: 0 auto;
}
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 500px;
  line-height: 500px;
  background: #f0f2f5;
  overflow: hidden;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 30px;
  height: 30px;
  font-size: 30px;
  color: #1890ff;
  /* background-color: rgba(31, 45, 61, 0.11); */
  /* opacity: 0.3; */
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  color: #1890ff !important;
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide  {
  position: relative;
}
.ant-carousel >>> .slick-slide img {
  display: block;
  margin: 0px auto 20px;
  height: 480px;
}
.ant-carousel >>> .slick-slide .intro {
  position: absolute;
  display: block;
  bottom: 12px;
  left: 185px;
  height: 40px;
  width: 480px;
  background-color: rgba(0, 0, 0, 0.3);
  text-align-last: left;
  padding: 0 10px;
  line-height: 18px;

}
.ant-carousel >>> .slick-slide .intro a{
  color: #f1f1f1;
  font-size: 14px;
  text-decoration: underline;

}
.ant-carousel >>> .slick-slide .intro a:hover{
    color: #fff;

}
</style>