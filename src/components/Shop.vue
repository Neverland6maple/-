<template>
  <div class="shop_container">
    <div>
      <ul>
        <!-- 单个商品li -->
        <li v-for="item in list" :key="item.itemid">
          <Product :prod='item'></Product>
        </li>
      </ul>
    </div>
    <div id="components-pagination-demo-mini">
      <!-- 借助更新key来刷新组件 -->
      <a-pagination v-model="current" size="small" :total="count" show-size-changer :defaultPageSize=20 :pageSizeOptions="['10', '20','50','100']" show-quick-jumper @change="page" @showSizeChange="changepagesize" />
    </div>
  </div>
</template>

<script>
import Product from '@/components/Product.vue'
export default {
  name:'shop',
   data(){
    return{
      list:[],
      count:100,
      current:1,
      currentsize:20
    }
  },
  watch:{
    '$route.query': {
      handler(newVal,oldVal){
        this.current = 1;
        this.$bus.$emit('changepage',{
        cat:this.$route.query.id,
        page:this.current,
        pageSize:this.currentsize,
        order:this.$route.query.sort})
        //用于计算总数 更换一次类目计算一次
        this.$bus.$emit('totalnum',{
        pageSize:100,
        cat:this.$route.query.id,
        order:this.$route.query.sort,
        to:6})
        
      },
      //进入页面时先请求一次
      immediate:true
    }
  },
  components:{
    Product,
  },
  created(){
    this.$bus.$on('share',val=>{
      this.list = val;
    });
    //类目数据总数
    this.$bus.$on('share2',res=>{
      this.count = res.length;
    })
  },
  methods:{
    //更换页数请求数据
    page(page, pageSize){
      this.$bus.$emit('changepage',{
        page,
        pageSize
      })
    },
    //更改单页数据数 请求数据
    changepagesize(current,size){
      this.current = 1;
      this.currentsize = size;
      this.$bus.$emit('changepage',{
        page:this.current,
        pageSize:this.currentsize
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