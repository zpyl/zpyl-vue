import axios from '@/libs/api.request'

// 查询所有的学院信息
export const getListCollege = () => {
  return axios.request({
    url: 'college/college',
    method: 'get'
  })
}
// 根据学院查询专业
export const getListSubject = (collegeId) => {
  return axios.request({
    url: 'college/subject',
    method: 'get',
    params: {
      collegeId: collegeId
    }
  })
}
// 修改学院或专业信息
export const updateCollege = (college) => {
  return axios.request({
    url: 'college/updateCollege',
    method: 'post',
    data: college
  })
}
// 新增学院信息
export const addCollege = (college) => {
  return axios.request({
    url: 'college/addCollege',
    method: 'post',
    data: college
  })
}
// 新增专业信息
export const addSubject = (college) => {
  return axios.request({
    url: 'college/addSubject',
    method: 'post',
    data: college
  })
}

// 根据号码进行删除
export const removeById = (id) => {
  return axios.request({
    url: 'college/remove',
    method: 'get',
    params: {
      id: id
    }
  })
}
