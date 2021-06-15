import axios from '@/libs/api.request'

export const getListCollege = () => {
  return axios.request({
    url: 'college/college',
    method: 'get'
  })
}
export const getListSubject = (collegeId) => {
  return axios.request({
    url: 'college/subject',
    method: 'get',
    params: {
      collegeId: collegeId
    }
  })
}
