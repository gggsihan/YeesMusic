import axios from 'axios'

// axios.create({
//   baseURL: 'http://localhost:3000',
//   timeout: 10000,
//   withCredentials: true
// })

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(data => {
      resolve(data.data)
    }).catch(err => {
      reject(err)
    })
  })
}
