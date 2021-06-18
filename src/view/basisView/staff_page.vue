<template>
  <div>
    <Card>
      <Row>
        <Col span="1" push="22">
          <Button type="primary" @click="addStaff">添加职工</Button>
        </Col>
      </Row>
      <!--表格数据-->
      <Table :columns="columns" :data="tableStaff">
        <template slot-scope="{ row }" slot="sex">
          <span >{{ row.sex === '0' ? "男":"女" }}</span>
        </template>
        <template slot-scope="{ row }" slot="time">
          <span >{{parentData(row.time)}}</span>
        </template>
        <template slot-scope="{ index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="editStaff(index)">编辑</Button>
          <Button type="error" size="small" @click="removeStaff(index)">删除</Button>
        </template>
      </Table>
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
      <Form ref="formValidate" :model="staffVo"  :label-width="80">
        <FormItem label="职工号" :hidden="this.modalData.addOrEdit">
          <label>
            <Input v-model="staffVo.id" :readonly="!this.modalData.addOrEdit"/>
          </label>
        </FormItem>
        <FormItem label="姓名" >
          <label>
            <Input v-model="staffVo.name" />
          </label>
        </FormItem>
        <FormItem label="性别" >
          <RadioGroup v-model="staffVo.sex">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="年龄">
          <label>
            <Input v-model="staffVo.age"/>
          </label>
        </FormItem>
        <FormItem label="电话" >
          <label>
            <Input v-model="staffVo.telephone" />
          </label>
        </FormItem>
        <FormItem label="入职时间">
          <DatePicker type="date" v-model="staffVo.time"></DatePicker>
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
import { getListStaff, addStaff, updateStaff, removeByStaffId, findByStaffId } from '@/api/basisApi/staff'
export default {
  name: 'staff_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          title: '职工号',
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
          title: '联系方式',
          key: 'telephone'
        },
        {
          title: '入职时间',
          key: 'time',
          slot: 'time'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }],
      tableStaff: [], // 职工数据
      // 模态数据
      staffVo: {
        id: '',
        name: '',
        sex: '0',
        age: '',
        telephone: '',
        time: ''
      },
      // 模态组件
      modalData: {
        title: '', // 标题
        view: false, // 是否展示
        addOrEdit: true // 是新增还是修改
      }
    }
  },
  methods: {
    // 关闭模态框
    closeFrom () {
      this.modalData.view = false
      this.staffVo = {}
      this.staffVo.sex = 0
      this.tabelDate()
    },
    // 删除职工
    removeStaff (index) {
      removeByStaffId(this.tableStaff[index].id).then(res => {
        if (res.status !== 200) {
          this.$Message.error('删除失败!')
        } else {
          this.$Message.success('删除成功!')
          this.tabelDate()
        }
      })
    },
    // 修改职工信息
    editStaff (index) {
      findByStaffId(this.tableStaff[index].id).then(res => {
        this.staffVo = res.data
      })
      this.modalData.view = true
      this.modalData.title = '修改职工信息'
      this.modalData.addOrEdit = false
    },
    // 提交数据
    handleSubmit () {
      if (this.modalData.addOrEdit) {
        // 是新增
        addStaff(this.staffVo).then(res => {
          if (res.status !== 200) {
            this.$Message.error('添加失败!')
          } else {
            this.$Message.success('添加成功!')
          }
        })
      } else {
        // 是修改
        updateStaff(this.staffVo).then(res => {
          if (res.status !== 200) {
            this.$Message.error('修改失败!')
          } else {
            this.$Message.success('修改成功!')
          }
        })
      }
    },
    // 添加职工信息
    addStaff () {
      this.modalData.title = '添加职工信息'
      this.modalData.view = true
      this.modalData.addOrEdit = true
    },
    // 格式化时间
    parentData (value) {
      value = new Date(value)
      return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate()
    },
    // 更新表格数据
    tabelDate () {
      getListStaff().then(res => {
        this.tableStaff = res.data
      })
    }
  },
  mounted () {
    this.tabelDate()
  }
}

</script>
