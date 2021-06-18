import axios from '@/libs/api.request'

// 查询所有职工的信息
export const getListStaff = () => {
  return axios.request({
    url: 'staff/list',
    method: 'get'
  })
}
// 新增职工信息
export const addStaff = (staff) => {
  return axios.request({
    url: 'staff/addStaff',
    method: 'post',
    data: staff
  })
}
// 修改职工信息
export const updateStaff = (staff) => {
  return axios.request({
    url: 'staff/updateStaff',
    method: 'post',
    data: staff
  })
}
// 根据职工号进行删除
export const removeByStaffId = (staffId) => {
  return axios.request({
    url: 'staff/removeByStaffId',
    method: 'get',
    params: {
      staffId: staffId
    }
  })
}
// 根据职工号进行查询
export const findByStaffId = (staffId) => {
  return axios.request({
    url: 'staff/findByStaffId',
    method: 'get',
    params: {
      staffId: staffId
    }
  })
}
