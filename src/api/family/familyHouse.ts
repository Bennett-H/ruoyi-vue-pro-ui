import request from '@/config/axios'

export interface FamilyHouseVO {
  id: number
  familyNo: string
  name: string
  idNumber: string
  region: string
  houseArea: number
}

// 查询用户管理列表
export const getFamilyHousePage = (params: PageParam) => {
  return request.get({ url: '/family-house/page', params })
}

// 查询用户详情
export const getFamilyHouseInfo = (id: number) => {
  return request.get({ url: '/family-house/info?id=' + id })
}

// 新增用户
export const addFamilyHouse = (data: FamilyHouseVO) => {
  return request.post({ url: '/family-house/add', data })
}

// 修改用户
export const updateFamilyHouse = (data: FamilyHouseVO) => {
  return request.post({ url: '/family-house/update', data })
}

// 删除用户
export const deleteFamilyHouse = (id: number) => {
  return request.delete({ url: '/family-house/delete?id=' + id })
}
