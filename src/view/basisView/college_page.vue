<template>
  <div class="demo-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-pane">
        <Row>
          <Col span="1" push="20">
            <Button type="primary" @click="addCollege">添加学院</Button>
          </Col>
        </Row>
        <!--表格数据-->
        <Table :columns="columnsCollege" :data="collegeList" @on-row-click="selectCollege">
          <template slot-scope="{ index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editCollege(index)">编辑</Button>
            <Button type="error" size="small" @click="removeCollege(index)">删除</Button>
          </template>
        </Table>
      </div>
      <div slot="right" class="demo-split-pane">
        <Row>
          <Col span="1" push="20">
            <Button type="primary" @click="addSubject">添加专业</Button>
          </Col>
        </Row>
        <!--表格数据-->
        <Table :columns="columnsSubject" :data="subjectList">
          <template slot-scope="{ index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="editStudent(index)">编辑</Button>
            <Button type="error" size="small" @click="removeSubject(index)">删除</Button>
          </template>
        </Table>
      </div>
    </Split>

    <Modal
      v-model="this.modalData.view"
      :title="this.modalData.title"
      :closable="false"
      :mask-closable="false"
      :draggable="true"
      :mask="false"
      :footer-hide="true"
    >
    <Form :model="collegeVo"  :label-width="80">
      <FormItem label="专业号" :hidden="this.modalData.addOrEdit" >
        <label>
          <Input v-model="collegeVo.id" :readonly="!this.modalData.addOrEdit"/>
        </label>
      </FormItem>
      <FormItem label="名称" >
        <label>
          <Input v-model="collegeVo.name" />
        </label>
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
import { getListCollege, getListSubject, updateCollege, addCollege, addSubject, removeById } from '@/api/basisApi/college'
export default {
  name: 'college_page',
  components: {
    Tables
  },
  data () {
    return {
      columnsCollege: [
        {
          title: '学院号',
          key: 'id'
        },
        {
          title: '学院名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      columnsSubject: [
        {
          title: '专业号',
          key: 'id'
        },
        {
          title: '专业名称',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      collegeList: [], // 学院
      subjectList: [], // 专业
      split: 0.4, // 分隔系数
      parent: 0, // 当前选中的学院
      modalData: {
        title: '', // 标题
        view: false, // 是否展示
        addOrEdit: true, // 是新增还是修改
        colOrSub: true // true: 学院 false：专业
      },
      collegeVo: {}
    }
  },
  methods: {
    // 选择学院
    selectCollege (index) {
      this.tableDataSubject(index.id)
    },
    // 加载专业
    tableDataSubject (collegeId) {
      this.parent = collegeId
      getListSubject(collegeId).then(res => {
        this.subjectList = res.data
      })
    },
    // 加载学院 默认选中第一个学院
    tableDataCollege () {
      getListCollege().then(res => {
        this.collegeList = res.data
        this.parent = 0
        getListSubject(this.collegeList[0].id).then(res => {
          this.subjectList = res.data
        })
      })
    },
    // 提交表单
    handleSubmit () {
      if (this.modalData.addOrEdit) {
        // 新增
        if (this.modalData.colOrSub) {
          // 学院
          addCollege(this.collegeVo).then(res => {
            if (res.status !== 200) {
              this.$Message.error('新增失败!')
            } else {
              this.$Message.success('新增成功!')
            }
          })
        } else {
          this.collegeVo.collegeId = this.parent
          // 专业
          addSubject(this.collegeVo).then(res => {
            if (res.status !== 200) {
              this.$Message.error('新增失败!')
            } else {
              this.$Message.success('新增成功!')
            }
          })
        }
      } else {
        // 修改
        updateCollege(this.collegeVo).then(res => {
          if (res.status !== 200) {
            this.$Message.error('修改失败!')
          } else {
            this.$Message.success('修改成功!')
          }
        })
      }
    },
    // 关闭模态框
    closeFrom () {
      this.modalData.view = false
      this.collegeVo = {}
      if (this.modalData.colOrSub) {
        // 操作的是学院
        this.tableDataCollege()
      } else {
        // 操作的是专业
        this.tableDataSubject(this.parent)
      }
    },
    // 删除
    removeCollege (index) {
      removeById(this.collegeList[index].id).then(res => {
        if (res.status !== 200) {
          this.$Message.error('删除失败!')
        } else {
          this.$Message.success('删除成功!')
          this.tableDataCollege()
        }
      })
    },
    removeSubject (index) {
      removeById(this.subjectList[index].id).then(res => {
        if (res.status !== 200) {
          this.$Message.error('删除失败!')
        } else {
          this.$Message.success('删除成功!')
          this.tableDataSubject(this.parent)
        }
      })
    },
    addCollege () {
      this.modalData.title = '新增学院信息'
      this.modalData.addOrEdit = true
      this.modalData.colOrSub = true
      this.modalData.view = true
    },
    addSubject () {
      this.modalData.title = '新增专业信息'
      this.modalData.addOrEdit = true
      this.modalData.colOrSub = false
      this.modalData.view = true
    },
    // 学院修改
    editCollege (index) {
      this.collegeVo = this.collegeList[index]
      this.modalData.title = '修改学院信息'
      this.modalData.addOrEdit = false
      this.modalData.view = true
    },
    // 专业修改
    editStudent (index) {
      this.collegeVo = this.subjectList[index]
      this.modalData.title = '修改专业信息'
      this.modalData.addOrEdit = false
      this.modalData.view = true
    }
  },
  mounted () {
    this.tableDataCollege()
  }
}

</script>
