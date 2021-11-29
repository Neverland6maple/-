import axios from 'axios'

const request = axios.create({
  baseURL:'http://api.tbk.dingdanxia.com/spk/get_trill_data'
})

export default request