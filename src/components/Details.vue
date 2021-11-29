<template>
  <div class="details_container">
    <router-view></router-view>
    <!-- 商品购买页主体 -->
    <div class="prod_details">
      <!-- 左视图 主要为展示区 -->
      <div class="lf_container">
        <div>
          <h3 class="cat"> <a :href="`#/shop?id=${prod.fqcat}`">{{cat}}</a> > {{prod.itemshorttitle}}</h3>
        </div>
        <div class="exhibition">
          <div class="prod_pic" @mousemove="move" @mouseenter="enlarge_fn" @mouseleave="enlarge_fn">
            <img :src="prod.itempic" alt="" class="pro_img">

            <div class="mask" v-if="enlarge"></div>
            <div class="bigger" v-if="enlarge">
              <img :src="prod.itempic" alt="">
            </div>
          </div>

          <div class="ex_toggle">
            <a-button-group>
              <a-button type="primary">
                <a-icon type="left" />商品图
              </a-button>
              <a-button type="primary" @click="tovideo">相关视频
                <a-icon type="right" />
              </a-button>
            </a-button-group>
          </div>

        </div>
        <div class="function">
          <span class="prod_id">商品编号：{{prod.itemid}}</span>
          <span class="report"><a href="javascript:;">举报</a></span>
        </div>
      </div>
      <!-- 右视图 主要为购买相关信息 -->
      <div class="rg_container">
        <!-- 标题 -->
        <h1 class="title">
          <a href="#" class="tianmao_icon">
            <img v-if="prod.shoptype=='B'" src="../../public/tianmao.png" alt="">
            <img v-if="prod.shoptype=='C'" src="../../public/taobao.png" style="height:20px" alt="">
          </a>
          <span>{{prod.itemtitle}}</span>
        </h1>
        <!-- 导购 -->
        <div class="shopping_guide">{{prod.itemdesc}}</div>
        <!-- 横幅 -->
        <div class="banner">此商品正在参加{{type}}，{{countdown}},请尽快购买！</div>
        <!-- 价格相关 -->
        <div class="discount">
          <div class="ori_price">价格 <span class="price_rg">￥<s>{{ itemoriprice}}</s></span></div>
          <!-- 折扣相关 -->
          <div class="dis_price">
            优惠价
            <span class="price_rg red">￥<span class="red disc">{{prod.itemendprice}}</span>
              <span class="activ_type">
                <s></s>
                {{type}}
              </span>
            </span>

          </div>
          <!-- 优惠券 -->
          <div class="coupon">
            优惠券
            <span class="price_rg">
              {{prod.couponexplain}}
              <a :href="prod.couponurl" target="blank">
                <a-button type="primary" size="small" class="con_icon">
                  优惠券
                </a-button>
              </a>
            </span>
            <span class="display_more" @click="show_more">
              查看更多相关
              <a-icon type="down" />
            </span>
          </div>
          <!-- 优惠券详情 -->
          <div class="coupon_more" style="display:none" ref="dropdown">
            优惠券
            <span class="right">
              {{prod.couponexplain}} 到{{endTime}}结束
              <a :href="prod.couponurl" target="blank">
                <a-button size="small" class="con_icon">
                  优惠券
                </a-button>
              </a>
            </span>
            <span class="display_more" @click="show_more">
              查看更多相关
              <a-icon type="down" />
            </span>
            <div class="row">
              <span class="left">优惠价格</span>
              <span class="right">
                可抵￥<span>{{prod.couponmoney}}</span>
              </span>
            </div>
            <div class="row">
              <span class="left">剩余量</span>
              <span class="right">{{prod.couponsurplus}}</span>
            </div>
            <div class="row">
              <span class="left">领取量</span>
              <span class="right">{{prod.couponreceive}}</span>
            </div>
          </div>

        </div>
        <!-- 数值面板 -->
        <ul class="panel">
          <li>月销量是<span class="red">{{prod.itemsale}}</span></li>
          <li>今日销量<span class="red">{{prod.todaysale}}</span></li>
          <li>折扣力度<span class="red">{{prod.discount || 0}}</span></li>
        </ul>
        <!-- 购买相关功能 -->
        <div class="ab_buy">
          <span class="fl_title">数量</span>
          <div class="buy">
            <div class="buy_num fl">
              <input type="text" v-model="count" @keyup="num_only">
              <a href="javascript:;" class="num_u" @click="add">+</a>
              <a href="javascript:;" class="num_d" @click="sub">-</a>
            </div>

            <a href="javascript:;" class="buying fr" @click="add_cart();openNotification()">
              加入购物车
            </a>
          </div>

        </div>
      </div>
    </div>
    <!-- 为你推荐 -->
    <div class="recommend">
      <div class="re_header">
        <div class="sp_recom">为你推荐</div>
        <div class="change_recom">
          <a-button type="primary" ghost @click="getRandom">
            换一批
          </a-button>
        </div>
      </div>
      <div class="re_main">
        <ul class="ex_recom">

          <li v-for="item in list" :key="item.itemid">
            <a><img :src="item.itempic" alt="" @click="send(item)"></a>
            <a href="javascript:;" class="title_recom" @click="send(item)">{{item.itemshorttitle}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '@/components/eventbus.js'
export default {
  data(){
    return {
      prod: this.$route.params.itemid ? this.$route.params : false || JSON.parse(localStorage.getItem('prod')),
      list:[],
      count:1,
      enlarge:false
    }
  },
  created(){
    this.getRandom();
    localStorage.setItem('prod',JSON.stringify(this.prod))
    bus.$on('todetails',val=>{
      this.prod = val.prod;
      localStorage.setItem('prod',JSON.stringify(this.prod))
    })
    bus.$on('toRandom',val=>{
      this.list = val
    })
  },
  computed:{
    cat(){
      switch(this.prod.fqcat){
        case '1':
          return '女装';
        case '2':
          return '男装';
        case '3':
          return '内衣';
        case '4':
          return '美妆';
        case '5':
          return '配饰';
        case '6':
          return '鞋品';
        case '7':
          return '箱包';
        case '8':
          return '儿童';
        case '9':
          return '母婴';
        case '10':
          return '居家';
        case '11':
          return '美食';   
        case '12':
          return '数码';
        case '13':
          return '家电';
        case '14':
          return '其他';
        case '15':
          return '车品';
        case '16':
          return '文体';
        case '17':
          return '宠物';
        default:
          return '全部';
      }
    },
    endTime(){
      let date = new Date().getTime();
      let time = new Date(date+parseInt(this.prod.end_time));
      let Y = time.getFullYear();
      let M = time.getMonth()+1
      let D = time.getDate()
      let h = time.getHours()
      let m = time.getMinutes()
      let s = time.getUTCSeconds();
      return ` ${Y}-${M}-${D} ${h}:${m}:${s} `
    },
    countdown(){
      let time = this.prod.end_time
      let D = Math.floor(time/1000/60/60/24)
      let h = Math.ceil(time/1000/60/60%24)
      return ` 活动${D}天${h}小时后结束 `
    },
    type(){
      let type = this.prod.activity_type;
      if(type === '普通活动'){
        type = '团购促销'
      }
      return type
    },
    //原价
    itemoriprice(){
      return (parseFloat(this.prod.itemendprice)+parseFloat(this.prod.couponmoney)).toFixed(2);
    },
  },
  methods:{
    getRandom(){
       bus.$emit('random_5',{
      page:Math.floor(Math.random()*19)+1,
      pageSize:5,
      type:0,
      to:1
    })
    },
    show_more(){
      if(this.$refs.dropdown.style.display === 'none'){
        this.$refs.dropdown.style.display = ''
      }else{
        this.$refs.dropdown.style.display = 'none'
      }
    },
    tovideo(){
      this.$router.push({
        name:'remv',
        params:{
          src:this.prod.dy_video_url,
          likes:this.prod.dy_video_like_count,
          shares:this.prod.dy_video_share_count
        }
      })
    },
    send(item){
      this.count = 1
      // this.$router.push('/details')
      // this.$nextTick(()=>{
        bus.$emit('todetails',{prod:item})  
      // })
    },
    //购买相关功能
    add_cart(){
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const flag = cart.some((cur,index,arr)=>{
        if(cur.itemid == this.prod.itemid){
          // cur.num += parseInt(this.count);
          cur.num = cur.num - 0 + parseInt(this.count);
          return true;
        }
      })
      console.log(flag);

      if(!flag){
        cart.push({
        itemid:this.prod.itemid,
        src:this.prod.itempic,
        title:this.prod.itemshorttitle,
        num:this.count,
        unit_price:this.prod.itemendprice,
        ori_price:this.itemoriprice,
        all:this.prod
      });
      }
      localStorage.setItem('cart',JSON.stringify(cart));
      bus.$emit('addcart');
    },
    add(){
      this.count = this.count -0 + 1
    },
    sub(){
      if(this.count <= 1){
        return 
      }
      this.count -=1
    },
    num_only(e){
      e.target.value = e.target.value.replace(/[^\d]/g,'')
      if(isNaN(parseInt(e.target.value-0)) || parseInt(e.target.value) <= 0 || e.target.value == ''){
        e.target.value = 1
        // console.log('nan');
      }
    },
    openNotification(){
      this.$notification.open({
        message: '通知',
        description:
          '加入购物城成功',
        placement:'bottomRight'
      });
    },
    //放大镜
    enlarge_fn(){
      this.enlarge = !this.enlarge;
    },
    move(e){
      const box = document.querySelector('.details_container')
      const img = document.querySelector('.prod_pic')
      const mask = document.querySelector('.mask');
      const big = document.querySelector('.bigger img');

      let l = box.offsetLeft;

      //如果侧边栏收缩了 则需要调整box据页面左侧的距离
      if(l == 40){
      l = 240;
      }

      let x = e.pageX - l - img.offsetLeft - mask.offsetWidth /2 ;
      let  y = e.pageY-box.offsetTop-img.offsetTop - mask.offsetHeight/2 ;

      if(x <= 0 ){
        x = 0
      }else if(x >= img.offsetWidth - mask.offsetWidth){
        x = img.offsetWidth - mask.offsetWidth
      }

      if(y <= 0){
        y = 0
      }else if(y >= img.offsetHeight -mask.offsetHeight){
        y=img.offsetHeight -mask.offsetHeight
      }

      mask.style.left = x + 'px';
      mask.style.top = y +'px';

      big.style.left = -x * 2.5 + 'px';
      big.style.top = -y * 2.5 + 'px';
    }
  }
}
</script>

<style scoped>
.prod_pic{
  position: relative;
  width: 370px;
  height: 460px;
}
.mask{
  position: absolute;
  left: 0;
  top: 0;
  width: 150px;
  height: 186px;
  background-color: #799bdd;
  opacity: 0.4;
  cursor: move;
}
.bigger{
  position: absolute;
  left: 380px;
  top: 0px;
  width: 375px;
  height: 465px;
  z-index: 1;
  overflow: hidden;
  border: 1px solid #f1f1f1;

}
.bigger img{
  position:absolute;
  left: 0;
  top: 0;
  width: 925px;
  height: 1150px;
}
.buy_num input{
  width: 37px;
  height: 48px;
  text-align: center;
  border: 1px solid #ccc;
  outline: none;
}
.details_container{
  position: relative;
  left: 0;
  top: 0;
}
.right{
  position: absolute;
  left: 100px;
}
.right span{ 
  font-size:20px;
}
.row{
  height: 32px;
  line-height: 32px;
}
.con_icon{
  margin-left: 10px;
} 
.coupon_more{
  position: absolute;
  bottom: -93px;
  width: 680px;
  height: 130px;
  padding: 2px 0;
  line-height: 30px;
  padding-left: 12px;
  background-color: #1890ff;
  border: 1px solid #fff;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.3);
  color: #fff;
  z-index: 1;
}
.title_recom{
  position:absolute;
  top: 245px;
  left: 5px;
  font-size: 12px;
  font-weight: 400;
}
.re_main{
  padding: 12px 0;
  height: 315px;
  border: 2px solid #f1f1f1;
}
.ex_recom {
  margin-left: -10px;
}
.ex_recom li {
  position: relative;
  display: flex;
  height: 300px;
  width: 180px;
  margin: 5px 18px;
}
.ex_recom img{
  width: 180px;
  height: 240px;
}
.recommend{
  margin-top: 80px;
  width: 1140px;
}
.re_header{
  height: 40px;
  background-color: #f1f1f1;
}
.sp_recom{
  float: left;
  height: 40px;
  width: 130px;
  background-color: #1890ff;
  color: #fff;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
}
.change_recom{
  float: right;
  margin-right: 20px;
  height: 40px;
  line-height: 40px;
}
a {
color: #000;
}
li {
  list-style: none;
  float: left;
}
.prod_details::after{
  content: ".";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.details_container{
  width: 1150px;
}
.lf_container{
  float:left;
  width: 400px;
  height: 580px;
  padding: 15px;
}
.rg_container{
  margin-top: 20px;
  margin-left: 50px;
  width: 680px;
  height: 580px;
  float: left;
}
.cat{
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  padding-left: 10px;
}
.pro_img{
  width: 370px;
  height: 460px;
  border:1px solid #f1f1f1
}
.ex_toggle{
  margin: 10px 0 30px 85px;

}
.title{
  padding: 0 0 0 10px;
  font-weight: 700;
  font-size: 20px;
}
.shopping_guide{
  padding: 0 12px;
  line-height: 30px;
  color: #FF0036;
  font-family: "microsoft yahei"
}
.discount{
  position: relative;
  padding: 3px 0;
  background-image: url('../../public/bg.png');
}
.banner{
  margin-top: 20px;
  height: 40px;
  background-color: #1890ff;
  color: #fff;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
}
.ori_price{
  position: relative;
  height: 30px;
  padding: 5px 0;
  margin-left: 12px;
  line-height: 20px;
}
.price_rg{
  position: absolute;
  left: 60px;
}
.price_rg s{
  font-size: 18px;
}
.dis_price{
  position: relative;
  height: 55px;
  padding: 5px 0 20px 0;
  margin-top: 8px;
  margin-left: 12px;
  line-height: 30px;
}
.red {
  color: #FF0036;
}
.dis_price .price_rg{
  font-size: 20px;
  line-height: 30px;
}
.disc{
  font-size: 30px;
  font-weight: 700;
}
.coupon{
  position: relative;
  height: 34px;
  padding: 2px 0;
  margin-left: 12px;
  line-height: 30px;
}
.display_more{
  cursor: pointer;
  float: right;
  margin-right: 10px;
}
.panel {
    border: 1px dotted #c9c9c9;
    border-width: 1px 0;
    margin: 25px 20px 20px 0;
    padding: 10px 0;
    position: relative;
    overflow: hidden;
    clear: both;
    display: flex;
}
.panel li {
    float: left;
    width: 33%;
    text-align: center;
    position: relative;
    left: -1px;
    border-left: 1px solid #e5dfda;
    flex: 1;
    line-height: 16px;
}
.buy {
  position: absolute;
  left: 60px;
  top: 0;
  height: 48px;


}
.buy_num {
    position: relative;
    width: 54px;
    height: 48px;
    border: 1px solid #ccc;
}
.buy_num a {
    position: absolute;
    right: 0;
    display: block;
    width: 17px;
    height: 24px;
    background-color: #f1f1f1;
    border: 1px solid #ccc;
    border-right: 0;
    line-height: 24px;
    text-align: center;
    color: black;
}
.buy_num>div {
    height: 48px;
    width: 37px;
    line-height: 48px;
    text-align: center;
}
.buy_num .num_u {
    top: 0;
    border-top: 0;
}
.buy_num .num_d {
    bottom: 0;
    border-bottom: 0;
}
.buying {
    position:absolute;
    left: 0;
    top: 70px;
    display: block;
    height: 48px;
    width: 200px;
    background-color: #1890ff;
    line-height: 48px;
    text-align: center;
    font-size: 18px;
    color: #fff;
}
.ab_buy{
  margin-top: 34px;
  position: relative;
  margin-left: 12px;
  line-height: 48px;
}
.activ_type{
  display: inline-block;
  position: absolute;
  top: 3px;
  right: -75px;
  background-color: #f47a86;
    border-radius: 1px;
    color: #fff;
    height: 24px;
    line-height: 24px;
    margin: 0px 0px 0px 20px;    
    padding: 1px 5px;
    font-size: 14px;
}
.activ_type s {
      position: absolute;
    width: 0;
    display: block;
    font-size: 0;
    left: -6px;
    bottom: 0;
    height: 0;
    border: 4px solid #f47a86;
    border-color: transparent #f47a86 #f47a86 transparent;
}
.tianmao_icon{
  display: inline-block;
}
.tianmao_icon img {
  margin-top: -2px;
  height: 12px;
  margin-right: 2px;
}
.prod_id {
  float: left;
}
.report{
  float: right;
}
</style>