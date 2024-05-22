<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="权属人">
            <el-select
              v-model="formData.idNumber"
              placeholder="权属人"
              clearable
              :onfocus="getOptions(formData.familyNo)"
            >
              <el-option
                v-for="item in memberList"
                :key="item.idNumber"
                :label="item.name"
                :value="item.idNumber"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="所在行政区划">
            <el-input v-model="formData.region" placeholder="请输入所在行政区划"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="房屋面积">
            <el-input v-model="formData.houseArea" type="number" placeholder="请输入房屋面积"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as FamilyHouseAPI from '@/api/family/familyHouse'
import * as FamilyMemberAPI from '@/api/family/familyMember'
import { FormRules } from 'element-plus'
import { FamilyHouseVO } from "@/api/family/familyHouse"

defineOptions({ name: 'SystemUserForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const memberList = ref([]) // memberList
const formData = ref({
  id: 0,
  familyNo: '',
  name: '',
  idNumber: '',
  region: '',
  houseArea: 0
})
const formRules = reactive<FormRules>({
  familyNo: [{ required: true, message: '户编号不能为空', trigger: 'blur' }],
  idNumber: [{ required: true, message: '身份证不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  region: [{ required: true, message: '所在行政区划', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, familyNo?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FamilyHouseAPI.getFamilyHouseInfo(id)
    } finally {
      formLoading.value = false
    }
  } else {
    formData.value = {
      id: 0,
      familyNo: familyNo,
      name: '',
      idNumber: '',
      region: '',
      houseArea: 0
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FamilyHouseVO
    data.name = memberList.value.find(
      (option) => option.idNumber === data.idNumber
    ).name
    if (formType.value === 'create') {
      await FamilyHouseAPI.addFamilyHouse(data)
      message.success(t('common.createSuccess'))
    } else {
      await FamilyHouseAPI.updateFamilyHouse(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const getOptions = (familyNo) => {
  FamilyMemberAPI.getFamilyMemberList(familyNo).then(res => {
    memberList.value = res;
  })
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: 0,
    familyNo: '',
    name: '',
    idNumber: '',
    region: '',
    houseArea: 0
  }
  formRef.value?.resetFields()
}
</script>
