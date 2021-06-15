import axios from '@/libs/api.request'

export const getListStudent = (search) => {
  return axios.request({
    url: 'student/list',
    method: 'get',
    params: {
      offset: search.offset,
      pageNumber: 10,
      id: search.id,
      name: search.name,
      collegeId: search.collegeId,
      subjectId: search.subjectId
    }
  })
}
export const addStudent = (student) => {
  return axios.request({
    url: 'student/addStudent',
    method: 'post',
    data:student
  })
}
export const updateStudent = (student) => {
  return axios.request({
    url: 'student/updateStudent',
    method: 'post',
    data: student
  })
}
export const findByStuId = (stuId) => {
  return axios.request({
    url: 'student/findByStuId',
    method: 'get',
    params: {
      stuId: stuId
    }
  })
}
export const removeByStuId = (stuId) => {
  return axios.request({
    url: 'student/remove',
    method: 'get',
    params: {
      stuId: stuId
    }
  })
}
