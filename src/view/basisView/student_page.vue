<template>
  <div>
    <Card>
      <!--搜索框-->
      <Row>
        <Col span="4" push="2">学号：
          <label>
            <Input v-model="search.id" placeholder="学号..." style="width: 200px"/>
          </label>
        </Col>
        <Col span="4" push="2">姓名：
          <label>
            <Input v-model="search.name" placeholder="姓名..." style="width: 200px"/>
          </label>
        </Col>
        <Col span="4" push="2">学院：
          <label>
            <Select v-model="search.collegeId" size="small" style="width:200px" @on-select ="selectCollege" clearable @on-clear="clearSubject">
              <Option v-for="college in collegeList" :value="college.id" :key="college.id" >{{college.name}}</Option>
            </Select>
          </label>
        </Col>
        <Col span="4" push="2">专业：
          <label>
            <Select v-model="search.subjectId" size="small" style="width:200px" ref="subjectRef" clearable>
              <Option v-for="subject in subjectList" :value="subject.id" :key="subject.id">{{subject.name}}</Option>
            </Select>
          </label>
        </Col>
        <Col span="4" push="4">
          <Button type="primary" shape="circle" icon="ios-search" @click="searchData">搜索</Button>
        </Col>
        <Col span="4" push="2">
          <Button type="primary" @click="addStudent">添加</Button>
        </Col>
      </Row>
      <!--表格数据-->
      <Table :columns="columns" :data="tableStudent">
        <template slot-scope="{ row }" slot="sex">
          <span >{{ row.sex === 0 ? "男":"女" }}</span>
        </template>
        <template slot-scope="{ row }" slot="time">
          <span >{{parentData(row.time)}}</span>
        </template>
        <template slot-scope="{ index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="editStudent(index)">编辑</Button>
          <Button type="error" size="small" @click="removeStudent(index)">删除</Button>
        </template>
      </Table>
      <Page :total="total" @on-change="changePage" align="right"/>
    </Card>
    <!--组件-->
    <Modal
      v-model="this.modalData.view"
      :title="this.modalData.title"
      :closable="false"
      :mask-closable="false"
      :draggable="true"
      :mask="false"
      :footer-hide="true"
     >
      <Form ref="formValidate" :model="studentVo"  :label-width="80">
        <FormItem label="学号" >
          <label>
            <Input v-model="studentVo.id" :readonly="!this.modalData.addOrEdit"/>
          </label>
        </FormItem>
        <FormItem label="姓名" >
          <label>
            <Input v-model="studentVo.name" />
          </label>
        </FormItem>
        <FormItem label="性别" >
          <RadioGroup v-model="studentVo.sex">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="年龄">
          <label>
            <Input v-model="studentVo.age"/>
          </label>
        </FormItem>
        <FormItem label="学院">
          <label>
            <Select v-model="studentVo.collegeId" size="small" style="width:200px" @on-select ="selectCollege">
              <Option v-for="college in collegeList" :value="college.id" :key="college.id" >{{college.name}}</Option>
            </Select>
          </label>
        </FormItem>
        <FormItem label="专业">
          <label>
            <Select v-model="studentVo.subjectId" size="small" style="width:200px">
              <Option v-for="subject in subjectList" :value="subject.id" :key="subject.id">{{subject.name}}</Option>
            </Select>
          </label>
        </FormItem>
        <FormItem label="电话" >
          <label>
            <Input v-model="studentVo.telephone" />
          </label>
        </FormItem>
        <FormItem label="入学时间">
          <DatePicker type="date" v-model="studentVo.time"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">提交</Button>
          <Button @click="closeFrom" style="margin-left: 8px">关闭</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getListStudent, addStudent, updateStudent, findByStuId, removeByStuId} from '@/api/basisApi/student'
import { getListCollege, getListSubject } from '@/api/basisApi/college'
export default {
  name: 'student_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '学号',
          key: 'id'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '性别',
          key: 'sex',
          slot: 'sex'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '学院',
          key: 'collegeName'
        },
        {
          title: '专业',
          key: 'subjectName'
        },
        {
          title: '入学时间',
          key: 'time',
          slot: 'time'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      tableStudent: [],
      studentVo: {
        id: '',
        name: '',
        sex: '0',
        age: '',
        collegeName: '',
        subjectName: '',
        time: '',
        telephone: ''
      },
      search: {
        offset: 0,
        id: '',
        name: '',
        collegeId: '',
        subjectId: ''
      },
      collegeList: [],
      subjectList: [],
      total: 0,
      modalData: {
        title: '', // 标题
        view: false, // 是否展示
        addOrEdit: true // 是新增还是修改
      }
    }
  },
  methods: {
    // 格式化时间
    parentData(value){
      value=new Date(value)
      return value.getFullYear()+"-"+(value.getMonth()+1)+"-"+value.getDate()
    },
    // 更新表格
    tableData () {
      getListStudent(this.search).then(res => {
        this.tableStudent = res.data.rows
        this.total = res.data.total
      })
    },
    // 条件查询
    searchData () {
      this.search.offset = 0
      this.tableData(this.search)
    },
    // 关闭模态框
    closeFrom(){
      this.modalData.view = false
      this.subjectList=[]
      this.studentVo={}
      this.studentVo.sex=0
      this.searchData()
    },
    // 新增学生
    addStudent () {
      this.modalData.view = true
      this.modalData.title = '添加学生'
      this.modalData.addOrEdit = true
    },
    // 提交学生信息
    handleSubmit () {
      if (this.modalData.addOrEdit) {
        // 是新增
        addStudent(this.studentVo).then(res => {
          if (res.status !== 200) {
            this.$Message.error('添加失败!')
          } else {
            this.$Message.success('添加成功!')
          }
        })
      } else {
        // 是修改
        updateStudent(this.studentVo).then(res => {
          if (res.status !== 200) {
            this.$Message.error('修改失败!')
          } else {
            this.$Message.success('修改成功!')
          }
        })
      }
    },
    //删除学生
    removeStudent(index){
      removeByStuId(this.tableStudent[index].id).then( res => {
        if (res.status !== 200) {
          this.$Message.error('删除失败!')
        } else {
          this.$Message.success('删除成功!')
          this.searchData()
        }
      })
    },
    // 修改学生信息
    editStudent (index) {
      findByStuId(this.tableStudent[index].id).then(res => {
        this.studentVo = res.data
        getListSubject(this.studentVo.collegeId).then(res => {
          this.subjectList = res.data
        })
      })
      this.modalData.view = true
      this.modalData.title = '修改学生信息'
      this.modalData.addOrEdit = false
    },
    // 选择学院，更新专业
    selectCollege (value) {
      getListSubject(value).then(res => {
        this.subjectList = res.data
      })
    },
    clearSubject(){
      this.$refs.subjectRef.clearSingleSelect();
    },
    changePage (value) {
      this.search.offset = value
      this.tableData(this.search)
    }
  },
  mounted () {
    this.tableData()
    getListCollege().then(res => {
      this.collegeList = res.data
    })
  }
}
</script>
