<template>
  <div class="prod_container">
    <!-- 商品宣传图 -->
    <router-link :to="{name:'details',params:prod}">
      <div class="commodity">
        <img :src="prod.itempic" alt="">
      </div>
    </router-link>
    <!-- 标题 -->
    <div class="title">
      <router-link :to="{name:'details' ,params:prod}">
        {{prod.itemshorttitle}}
      </router-link>
    </div>
    <!-- 价格 -->
    <div class="price">
      <i class="style_red">￥</i><span class="now_price">{{prod.itemendprice}}</span>
      <span class="orig_price">￥{{itemoriprice}}</span>
    </div>
    <div class="goods">
      优惠券还剩{{prod.couponsurplus}}张
      <div class="bar">
        <div class="in_bar" :style="{width:rate}"></div>
      </div>
    </div>
    <router-link :to="{name:'details',params:prod}">
      <div class="buy">
        立刻抢购
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props:{
    prod:{
      type:Object
    }
  },
  computed:{
    //原价
    itemoriprice(){
      return (parseFloat(this.prod.itemendprice)+parseFloat(this.prod.couponmoney)).toFixed(2);
    },
    //优惠券领取剩余百分比
    rate(){
      let rate = parseInt(this.prod.couponsurplus)/parseInt(this.prod.couponnum)*100
      rate = rate > 100 ? 100:rate;
      return rate+'%'
    }
  },
}
</script>

<style  scoped>
.title {
  text-align: left;
  height: 40px;
  margin-left: 5px;
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
    overflow: hidden;
}
.in_bar {
    float: left;
    height: 10px;
    background-color: #e00825;
    border-radius: 6px;
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