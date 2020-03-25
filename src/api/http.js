import axios from 'axios'

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
