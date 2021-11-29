<template>
  <div class="chart_container" ref="container">
    <div class="chart_pie">
      <a-skeleton active />
    </div>
    <div class="feat">
      <a-button type="primary" class="btn" @click="active('itemsale',$event)">
        本月
      </a-button>
      <a-button type="primary" class="btn act" @click="active('todaysale',$event)">
        本日
      </a-button>
      <a-button type="primary" class="btn" @click="active('itemsale2',$event)">
        近2小时
      </a-button>
    </div>
    <div class="transition" @click="move">
      <a-icon type="double-right" />
    </div>
  </div>
</template>

<script>

import * as echarts from 'echarts';
import request from '@/utils/request.js'
export default {
  data(){
    return{
      type:['女装','男装','内衣','美妆','配饰','鞋品','箱包','儿童','母婴','居家','美食','数码','家电','其他','车品','文体','宠物'],
      num:[],
      inter:'todaysale' ,
     
    }
  },
  created(){
    this.loopitem(this.inter);
  },
  mounted(){
  //  this.creat_chart();
  },
  methods:{
    async loopitem(interval){
      let a_num= new Array(17).fill(0);
      const { data:{data:res} } = await request.get('/',{
        params:{
          apikey:'JBu2ajrAhjPbGOd42FgiCpUxT25o75ZK',
          back:100
        }});
      res.forEach(item=>{ 
        a_num[item.fqcat-1] += item[interval]-0;
      });
      this.num = a_num
      this.creat_chart();
    },
    creat_chart(){
        var chartdom = document.querySelector('.chart_pie');
  var mychart = echarts.init(chartdom);
  var option;
  option =  {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '0%',
      left: '2%',
      orient:'vertical',
      itemHeight:14,
      itemWidth:20,
      textStyle:{
        fontSize:14
      },
      itemGap:19
    },
    series: [
      {
        name: '商品销售类型分布图',
        type: 'pie',
        radius: ['40%', '70%'],
        // avoidLabelOverlap: false,
        center:["50%","50%"],
        itemStyle: {
          borderRadius: 2,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          fontSize:'20px'
          // position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            // fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          length:20,
          length2:50
        },
        data: this.pie_data
      }
    ],
    title: {
    text: '商品销售类型分布',
    textStyle:{
      fontSize:'40'
    },
    left: 'center'
    },
    color:['#E5FFF6','#E6F7FF','#E5E6FF','#FFEEE5','#FFE5E6','#FFF6E5','#F2F2F2','#FFFFE5','#FF7E38','#38B9FF','#3877FF','#38FF7E','#E7A840','#F85659','#9C9C9C','#C98E6E','#7E38FF']
    };
    option && mychart.setOption(option);
    window.addEventListener('resize',function(){
      mychart.resize();
    })
    },
    active(inte,e){
      let btnlist = document.querySelector('.feat').children;
      for(const item of btnlist){
        item.classList.remove('act')
      }
      e.target.classList.add('act')
      this.inter = inte;
      this.loopitem(this.inter);
    },
    move(){
      this.$refs.container.classList.add('styl');
      setTimeout(()=>{
        this.$router.push('/data');
      },800);
    }
  },
  computed:{
    pie_data(){
      let data = [];
      this.type.forEach((item,index)=>{
        data.push({value:this.num[index],name:item})
      })
      return data;
    }
  }
}
  </script>

<style scoped>
.styl{
  transform:translateX(1300px);
}
.transition{
  top: -25px;
  position: absolute;
  right: -24px;
  height: 108%;
  width: 40px;
  background-image: linear-gradient(to right,#fff,rgba(24,144,255,0.1),rgba(24,144,255,0.2),rgba(24,144,255,0.30) , rgba(24,144,255,0.45));
  font-size: 35px;
  line-height: 630px;
  color: #59b7e2;
  transition: all 0.3s;
  cursor: pointer;
  }
.transition:hover{
 font-size: 40px;
}
.chart_container{
  position: relative;
  transition: all 0.8s;
}
.feat{
  position: absolute;
  top: 6px;
  right: 40px;
}
.btn {
  margin: 0 2px;
}
.feat .act{
  background-color: #883cff;
  border-color: #883cff;
}
  .chart_pie{
    height: 600px;
    width: 100%;
  }
</style>