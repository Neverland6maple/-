<template>
  <div class="prod_container">

    <a href="javascript:;" @click="send">
      <div class="commodity">
        <img :src="img" alt="">
      </div>
    </a>
    <div class="title">
      <h4>
        <a href="#/details">
          {{prod.itemshorttitle}}
        </a>
      </h4>
    </div>

    <div class="price">
      <i class="style_red">￥</i><span class="now_price">{{prod.itemendprice}}</span>
      <span class="orig_price">￥{{itemoriprice}}</span>
    </div>
    <div class="goods">
      优惠券还剩{{prod.couponsurplus}}张
      <div class="bar">
        <div class="in_bar" ref="in_bar" :style="{width:rate}"></div>
      </div>
      <!-- 剩余<i class="style_red">{{}}</i>张 -->
    </div>
    <a href="#">
      <div class="buy">
        立刻抢购
      </div>
    </a>
  </div>
</template>

<script>
import bus from '@/components/eventbus.js'
export default {
  props:{
    prod:{
      type:Object
    }
  },
  data(){
    return{
      img:this.prod.itempic
    }
  },
  computed:{
    //原价
    itemoriprice(){
      return (parseFloat(this.prod.itemendprice)+parseFloat(this.prod.couponmoney)).toFixed(2);
    },
    rate(){
      let rate = parseInt(this.prod.couponsurplus)/parseInt(this.prod.couponnum)*100
      rate = rate > 100 ? 100:rate;
      return rate+'%'
    }
  },
  methods:{
    send(){
      // console.log('发送了数据到details');
      this.$router.push('/details')
      this.$nextTick(()=>{
        bus.$emit('todetails',{
        prod:this.prod
      })
      })
    }
  },
}
</script>

<style lang="less" scoped>
.title {
  height: 40px;
}
.commodity img {
    width: 270px;
    height: 300px;
}
.price .now_price {
    color: #e00825;
    font-size: 20px;
    font-weight: 700;
}
.price .orig_price {
    text-decoration: line-through;
    color: #848484
}
.goods {
    padding:5px 0;
}
.bar {
    height: 11px;
    width: 100px;
    border: 1px solid #e00825;
    border-radius: 6px;
    display: inline-block;
    margin: 0 10px;
    margin-bottom: -2px;
}
.in_bar {
    height: 11px;
    // width: 10px;
    background-color: #e00825;
    border-radius: 6px 6px 6px 6px;
}
.buy {
    margin-top: 5px;
    height: 50px;
    background-color: #b1181a;
    font-size: 18px;
    color: #fff;
    text-align: center;
    font-weight: 700;
    line-height: 49px;
}
</style>