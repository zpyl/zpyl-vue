import axios from '@/libs/api.request'

// 获取所有的学生列表
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
// 新增学生信息
export const addStudent = (student) => {
  return axios.request({
    url: 'student/addStudent',
    method: 'post',
    data: student
  })
}
// 修改学生信息
export const updateStudent = (student) => {
  return axios.request({
    url: 'student/updateStudent',
    method: 'post',
    data: student
  })
}
// 根据学号进行查询
export const findByStuId = (stuId) => {
  return axios.request({
    url: 'student/findByStuId',
    method: 'get',
    params: {
      stuId: stuId
    }
  })
}
// 根据学号进行删除
export const removeByStuId = (stuId) => {
  return axios.request({
    url: 'student/remove',
    method: 'get',
    params: {
      stuId: stuId
    }
  })
}
