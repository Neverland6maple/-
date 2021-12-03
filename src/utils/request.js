import axios from 'axios'

const request = axios.create({
  baseURL:'http://api.tbk.dingdanxia.com/spk/get_trill_data',
  params:{
    apikey:'JBu2ajrAhjPbGOd42FgiCpUxT25o75ZK'
  }
})

export default request