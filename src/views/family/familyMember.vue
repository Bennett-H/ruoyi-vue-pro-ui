<template>
  <el-row :gutter="20">
    <el-col>
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :inline="true"
          label-width="68px"
        >
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create', undefined, queryParams.familyNo)"
          >
            <Icon icon="ep:plus" /> 新增
          </el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-table v-loading="loading" :data="list">
          <el-table-column label="序号" align="center" key="rowNumber" prop="rowNumber" />
          <el-table-column
            label="姓名"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="与户主关系" key="relationship">
            <template #default="scope">
              <el-select
                v-model="scope.row.relationship"
                placeholder="与户主关系"
                clearable
                disabled
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.FAMILY_RELATIONSHIP)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="身份证"
            align="center"
            prop="idNumber"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="出生日期"
            align="center"
            prop="birthDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" width="160">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button
                  type="primary"
                  link
                  @click="openForm('update', scope.row.id, scope.row.familyNo)"
                >
                  <Icon icon="ep:edit" />修改
                </el-button>
                <el-button
                  type="primary"
                  link
                  @click="handleDelete(scope.row.idNumber)"
                >
                  <Icon icon="ep:delete" />删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </ContentWrap>
    </el-col>
  </el-row>

  <!-- 添加或修改用户对话框 -->
  <FamilyMemberForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as FamilyMemberAPI from '@/api/family/familyMember'
import FamilyMemberForm from './FamilyMemberForm.vue'
import {propTypes} from "@/utils/propTypes"
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict"

defineOptions({ name: 'Family' })
const props = defineProps({
  familyNo: propTypes.string
})

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  familyNo: props.familyNo
})
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FamilyMemberAPI.getFamilyMemberPage(queryParams)
    list.value = data.list
    list.value.forEach((item, index) => {
      item.rowNumber = index + 1;
    });
    total.value = data.total
  } finally {
    loading.value = false
  }
  // 发送操作成功的事件
  emit('success')
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, familyNo?: string) => {
  formRef.value.open(type, id, familyNo)
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 删除按钮操作 */
const handleDelete = async (idNumber: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FamilyMemberAPI.deleteFamilyMember(idNumber)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
})

watch(
  () => props.familyNo,
  () => {
    getList()
  },
  { immediate: true }
)
</script>
