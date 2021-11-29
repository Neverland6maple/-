<template>
  <div class="shop_container">
    <div>
      <ul>

        <li v-for="item in list" :key="item.itemid">
          <Product :prod='item'></Product>
        </li>

      </ul>
    </div>
    <div id="components-pagination-demo-mini">
      <a-pagination :key="refresh" size="small" :total="200" show-size-changer :pageSizeOptions="['10', '20','50','100']" show-quick-jumper @change="page" />
    </div>
  </div>
</template>

<script>
import Product from '@/components/Product.vue'
import bus from '@/components/eventbus.js'
export default {
  name:'shop',
   data(){
    return{
      list:[],
      refresh:1
    }
  },
  watch:{
    '$route.query': {
      handler(newVal,oldVal){
        this.refresh +=1;
        this.$nextTick(()=>{
        bus.$emit('changecat',{
        cat:this.$route.query.id,
        page:1,
        pageSize:10,
        order:this.$route.query.sort})
      })
      },
      immediate:true
    }
  },
  components:{
    Product,
  },
  created(){
    bus.$on('share',val=>{
      this.list = val;
    })
  },
  methods:{
    page(page, pageSize){
      bus.$emit('changepage',{
        page,
        pageSize
      })
    }
  },

}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
li {
  display: inline-flex;
  margin-left: 12px;
  margin-bottom: 10px;
  list-style: none;
  width: 270px;
}

#components-pagination-demo-mini .ant-pagination:not(:last-child) {
  margin-bottom: 24px;
}
</style>