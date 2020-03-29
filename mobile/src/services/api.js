import axios from 'axios'

//Run with real device
export const baseURL = 'http://192.168.0.6:3333'

//Run with android emulator
// export const baseURL = 'http://10.0.2.2:3333'

//Run with ios emulator
// export const baseURL = 'http://localhost:3333'


export default api = axios.create({
    baseURL,
})