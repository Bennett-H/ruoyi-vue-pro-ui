<template>
  <el-row :gutter="20">
    <el-col>
      <!-- 搜索 -->
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="户主名" prop="familyHeadName">
            <el-input
              v-model="queryParams.familyHeadName"
              placeholder="请输入户主名"
              clearable
            />
          </el-form-item>
          <el-form-item label="成员名" prop="familyMemberName">
            <el-input
              v-model="queryParams.familyMemberName"
              placeholder="请输入成员名"
              clearable
            />
          </el-form-item>
          <el-form-item label-width="100px" label="家庭总人数" prop="familyTotalNumsStart">
            <el-input
              v-model="queryParams.familyTotalNumsStart"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item prop="familyTotalNumsEnd">
            <el-input
              v-model="queryParams.familyTotalNumsEnd"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item label-width="100px" label="房屋总面积" prop="houseTotalAreasStart">
            <el-input
              v-model="queryParams.houseTotalAreasStart"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item prop="houseTotalAreasEnd">
            <el-input
              v-model="queryParams.houseTotalAreasEnd"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
            <el-button
              type="primary"
              plain
              @click="openForm('create')"
            >
              <Icon icon="ep:plus" /> 新增
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-table v-loading="loading" :data="list">
          <el-table-column label="序号" align="center" key="rowNumber" prop="rowNumber" />
          <el-table-column
            label="户主姓名"
            align="center"
            prop="familyHeadName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="户编号"
            align="center"
            prop="familyNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="户所在地"
            align="center"
            prop="familyAddress"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="家庭人员总人数"
            align="center"
            prop="familyTotalNum"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="房屋总面积"
            align="center"
            prop="familyTotalArea"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center" width="160">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button
                  type="primary"
                  link
                  @click="openForm('update', scope.row.id)"
                >
                  <Icon icon="ep:edit" />修改
                </el-button>
                <el-button
                  type="primary"
                  link
                  @click="handleDelete(scope.row.familyNo)"
                >
                  <Icon icon="ep:delete" />删除
                </el-button>
                <el-dropdown>
                  <el-button type="primary" link><Icon icon="ep:d-arrow-right" /> 更多</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        command="handleMember"
                      >
                        <router-link :to="'/family/manage/' + scope.row.id + '/' + scope.row.familyNo + '/member'">
                          <el-button link type="primary">家庭成员信息</el-button>
                        </router-link>
                      </el-dropdown-item>
                      <el-dropdown-item
                        command="handleHouse"
                      >
                        <router-link :to="'/family/manage/' + scope.row.id + '/' + scope.row.familyNo + '/house'">
                          <el-button link type="primary">房屋信息</el-button>
                        </router-link>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
  <FamilyForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as FamilyAPI from '@/api/family/family'
import FamilyForm from './FamilyForm.vue'

defineOptions({ name: 'Family' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  familyHeadName: undefined,
  familyMemberName: undefined,
  familyTotalNumsStart: undefined,
  familyTotalNumsEnd: undefined,
  houseTotalAreasStart: undefined,
  houseTotalAreasEnd: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FamilyAPI.getFamilyPage(queryParams)
    list.value = data.list
    list.value.forEach((item, index) => {
      item.rowNumber = index + 1;
    });
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (familyNo: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FamilyAPI.deleteFamily(familyNo)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
