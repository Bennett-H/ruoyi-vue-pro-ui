<template>
  <el-col :span="24"  shadow="hover">
    <el-card>
      <el-descriptions title="户基本信息" style="padding-bottom: 20px" :column="3" border>
        <el-descriptions-item label="户编号 :" style="width: 70px;">
          {{familyInfo.familyNo}}
        </el-descriptions-item>
        <el-descriptions-item label="户主姓名 :" style="width: 70px;">
          {{familyInfo.familyHeadName}}
        </el-descriptions-item>
        <el-descriptions-item label="户所在地 :" style="width: 70px;">
          {{familyInfo.familyAddress}}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="户实物指标信息">
        <el-descriptions-item>
          <el-tabs v-model="route.params.activeName" tab-position="left" style="height: 800px">
            <el-tab-pane :label="'家庭成员信息(' + familyInfo.familyTotalNum + ')'" name="member">
              <FamilyMember :familyNo="familyInfo.familyNo" @success="getInfo"/>
            </el-tab-pane>
            <el-tab-pane :label="'房屋信息(' + familyInfo.familyTotalHouseNum + ')'" name="house">
              <FamilyHouse :familyNo="familyInfo.familyNo" @success="getInfo"/>
            </el-tab-pane>
          </el-tabs>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-col>
</template>
<script lang="ts" setup>
import * as FamilyAPI from '@/api/family/family'
import {FamilyInfo} from "@/api/family/family"
import FamilyMember from './familyMember.vue'
import FamilyHouse from './familyHouse.vue'

const route = useRoute() // 路由
const familyInfo = ref<FamilyInfo>({
  id: route.params.id,
  familyNo: route.params.familyNo,
  familyHeadName: '',
  familyHeadNumber: '',
  familyAddress: '',
  familyTotalNum: 0,
  familyTotalArea: 0,
  familyTotalHouseNum: 0
}) // 户 主信息
const getInfo = async () => {
  FamilyAPI.getFamilyInfo(route.params.id).then(res => {
    familyInfo.value = res
  })
}
/** 初始化 */
onBeforeMount(() => {
  getInfo()
})

</script>
