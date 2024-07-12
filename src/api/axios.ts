import axios from 'axios'
import config from '../config/config';

const base_url_backend = config.ip + ':' + config.port_backend

const axiosDf = axios.create({
	 baseURL: 'http://'+ base_url_backend +'/',
	withCredentials: true,
})

export default axiosDf
