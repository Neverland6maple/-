<template>
  <div class="drawer_container">
    <a-drawer :title="slot" placement="right" :closable="false" :visible="visible" @close="onClose" class="drawer_bd">
      <ul>

        <li class="cart" v-for="item in cart" :key="item.itemid">
          <div class="prod_cart">
            <div class="prod_pic">
              <img :src="item.src" alt="">
            </div>
            <div class="prod_title">

              <h3 @click="send(item.all)">{{item.title}}</h3>

            </div>
            <div class="prod_data">
              <span class="num">
                数量:
                <span class="sub_prod" :data-pid="item.itemid" @click="update_num(-1,$event)" v-if="update">
                  -
                </span>
                <i @dblclick="update_dir">
                  {{item.num}}
                </i>
                <input type="text" class="item_num" @input="num_only" v-model.lazy="item.num" @blur="hide_inp" style="display:none">

                <span @click="update_num(1,$event)" :data-pid="item.itemid" class="add_prod" v-if="update">+</span>
              </span>
              <span class="total_count">总计：￥<i>{{(parseFloat(item.unit_price) + parseInt(item.num-1)*parseFloat(item.ori_price)).toFixed(2)}}</i></span>

            </div>
            <span class="remove" :data-pid="item.itemid" @click="remove">移除该商品</span>
          </div>
        </li>

      </ul>
      <div class="barrier"></div>
      <div class="im_buy">
        <a-button type="primary" size="large" class="buy_btn">
          立刻购买
        </a-button>
        <span class="total">总计:￥<i>{{total_price.toFixed(2)}}</i></span>
      </div>

    </a-drawer>
  </div>
</template>

<script>
import bus from '@/components/eventbus.js'
export default {
  data(){
    return{
      cart:JSON.parse(localStorage.getItem('cart')) || [],
       update:true,
      slot:<span><a-icon type="shopping-cart" style="marginRight:8px;fontSize:18px"/>您的购物车</span>,
      visible:false
    }
  },
  methods:{
    send(val){
      this.$router.push('/details');
      bus.$emit('todetails',{
        prod:val
      })
    },
    update_dir(e){
      this.update = !this.update 
      this.$nextTick(()=>{
        e.path[1].querySelector('.item_num').style.display = '';
        e.path[1].querySelector('.item_num').focus()
      })
    },
    update_num(val,e){
      const id =e.target.dataset.pid;
      this.cart.some(cur=>{
        if(cur.itemid == id){
          if(val == -1 && cur.num <= 1 ){
            return true
          } 
          cur.num = parseInt(cur.num) + parseInt(val)
          return true;
        }
      })
    },
    remove(e){
      const id =e.target.dataset.pid;
      let index ;
      this.cart.some((cur,ind)=>{
        if(cur.itemid == id){
          index = ind;
          return true;
        }
      })
      if(index !== undefined){
        this.cart.splice(index,1);
      }
    },
    hide_inp(e){
      this.update = !this.update
      e.target.style.display = "none";
      },
        num_only(e){
      e.target.value = e.target.value.replace(/[^\d]/g,'')
      if(isNaN(parseInt(e.target.value-0)) || parseInt(e.target.value) <= 0 || e.target.value == ''){
        e.target.value = 1
        // console.log('nan');
      }
    },
    onClose() {
      this.visible = false;
    },
  },
  created(){
    bus.$on('addcart',()=>{
      this.cart = JSON.parse(localStorage.getItem('cart'));
    })
    bus.$on('showdrawer',val=>{
      this.visible = val;
    })
  },
  computed:{
    total_price(){
      let top = 0;
      this.cart.forEach(item => {
        top += parseFloat(item.unit_price) + parseInt(item.num-1)*parseFloat(item.ori_price);
      });
      return top;
    }
  },
  directives:{
    focus:{
      inserted(el){
        el.focus();
      }
    }
  },
  watch:{
    cart:{
      handler(e){
        localStorage.setItem('cart',JSON.stringify(this.cart))
      },
      deep:true
    }
  },
}
</script>

<style scoped>
.total{
  position: absolute;
  left: 115px;
  font-size: 12px;
  line-height: 20px;
  bottom: 10px;
}
.total i {
  color: #FF0036;
  font-size: 20px;
  line-height: 12px;
}
.buy_btn{
  margin-left: 15px;
}
.num span{
  cursor: pointer;
  display: none;
  padding: 0 2px;
}
.num:hover span{
  display: inline-block;
  background-color: #f1f1f1;
  color: #000;
}
.num span:hover{
box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
}
.num .sub_prod{
  position: absolute;
  padding: 0 3px;
  left: 30px;
}
.add_prod{
  position: absolute;
  left: 70px;
}
i{
  font-style: normal;
}
*{
  margin: 0;
  padding: 0;
}
li{
  list-style: none;
}
.prod_title{
  padding: 0 10px;
  
}
.prod_title h3 {
  color: #777;
  font-size: 13px;
  line-height: 16px;
  cursor: pointer;
}
.prod_title h3:hover{
  text-decoration: underline;
  
}
.prod_pic{
  text-align: center;
}
.prod_pic img{
  width: 170px;
}
.num{
  position: absolute;
  left: 5px;
  bottom: -20px;
  
}
.num i{
  position: absolute;
  display: inline-block;
  width: 40px;
  text-align: center;
  left: 34px;
}
.item_num {
  position: absolute;
  width: 24px;
  text-align: center;
  left: 44px;
  height: 16px;
  outline: none;
  /* border: none; */
}
.prod_data{
  font-size: 12px;
  line-height: 16px;
}
.total_count{
  position: absolute;
  left: 90px;
  bottom: -20px;
}
.total_count i {
  font-size: 16px;
  line-height: 12px;
  color: #FF0036;
}
.prod_data{
  position: relative;
}
.prod_cart{
  margin-bottom: 28px;
  position: relative;
  height: 230px;
  width: 208px;
  /* background-color: powderblue; */
  border-bottom: 1px dotted #999;
}
.remove{
  position: absolute;
  right: -5px;
  top:-21px;
  color: #1890ff;
  font-size: 12px;
}
.remove:hover{
  text-decoration: underline;
}
.barrier{
  height: 60px;
}
.im_buy{
  position: absolute;
  background-color: #fff;
  width: 240px;
  height: 60px;
  line-height: 60px;
  bottom: 0;
  right: 17px;
}
</style>