import request from '@/config/axios'

export interface FamilyVO {
  id: number
  familyNo: string
  familyAddress: string
}

export interface FamilyInfo {
  id: number
  familyNo: string
  familyHeadName: string
  familyHeadNumber: string
  familyAddress: string
  familyTotalNum: number
  familyTotalArea: number
  familyTotalHouseNum: number
}

// 查询用户管理列表
export const getFamilyPage = (params: PageParam) => {
  return request.get({ url: '/family/page', params })
}

// 查询用户详情
export const getFamilyInfo = (id: number) => {
  return request.get({ url: '/family/info?id=' + id })
}

// 新增用户
export const addFamily = (data: FamilyVO) => {
  return request.post({ url: '/family/add', data })
}

// 修改用户
export const updateFamily = (data: FamilyVO) => {
  return request.post({ url: '/family/update', data })
}

// 删除用户
export const deleteFamily = (familyNo: string) => {
  return request.delete({ url: '/family/delete?familyNo=' + familyNo })
}
