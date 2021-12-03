<template>
  <div class="carousel_container">
    <a-carousel arrows class="caro" autoplay dots-class="slick-dots slick-thumb">
      <!-- 左按钮 -->
      <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
        <a-icon type="left-circle" />
      </div>
      <!-- 右按钮 -->
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <a slot="customPaging" slot-scope="props">
        <img :src="getImgUrl(props.i)" />
      </a>
      <!-- 轮播图 -->
      <div v-for="item in prod" :key="item.itemid" @mouseenter="disp" @mouseleave="hide">
        <router-link :to="{name:'details',params:item}">
          <img :src="item.itempic" alt="">
          <h3 class="intro" v-if="d_intro"><a href="javascript:;">{{item.itemtitle}}</a></h3>
        </router-link>
      </div>

    </a-carousel>
  </div>
</template>

<script>
export default {
  data(){
    return {
      prod:[],
      d_intro:false,
      // baseUrl:'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/'
    }
  },
  created(){
    this.$bus.$on('toCaro',val=>{
      this.prod = val
    }),
    this.getRandom();
  },
  methods:{
    getRandom(){
      this.$bus.$emit('random_5',{
        page:Math.floor(Math.random()*20)+1,
        pageSize:5,
        type:0,
        to:2
    })
    },
    //鼠标进入图片显示标题
    disp(){
      this.d_intro = true;
    },
    hide(){
      this.d_intro = false;
    },
    getImgUrl(i) {
      return this.imglist[i];
    },
  },
  computed:{
    imglist(){
      const arr = [];
      this.prod.forEach(item=>{
        arr.push(item.itempic);
      })
      return arr;
    }
  }
}
</script>

<style scoped>
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-thumb {
  position: absolute;
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 48px;
  margin: 0 1px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  border: 2px solid #1890ff;
}

.caro{
  width: 850px;
  height: 560px;
  margin: 0 auto;
  background: #f0f2f5;

}
.ant-carousel >>> .slick-slide {
  position: relative;
  text-align: center;
  height: 510px;
  line-height: 500px;
  background: #f0f2f5;
  overflow: hidden;
}
.ant-carousel >>> .custom-slick-arrow {
  width: 30px;
  height: 30px;
  font-size: 30px;
  color: #1890ff;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  color: #1890ff !important;
  opacity: 0.5;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: 0px auto 20px;
  height: 510px;
  max-width: 80%;
}
.ant-carousel >>> .slick-slide .intro {
  position: absolute;
  display: block;
  bottom: 0px;
  left: 178px;
  height: 40px;
  width: 494px;
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