import request from '@/config/axios'

export interface FamilyMemberVO {
  id: number
  familyNo: string
  name: string
  relationship: number
  idNumber: string
}

// 查询用户管理列表
export const getFamilyMemberPage = (params: PageParam) => {
  return request.get({ url: '/family-member/page', params })
}

// 查询用户详情
export const getFamilyMemberInfo = (id: number) => {
  return request.get({ url: '/family-member/info?id=' + id })
}

// 查询用户详情
export const getFamilyMemberList = (familyNo: string) => {
  return request.get({ url: '/family-member/list?familyNo=' + familyNo })
}

// 新增用户
export const addFamilyMember = (data: FamilyMemberVO) => {
  return request.post({ url: '/family-member/add', data })
}

// 修改用户
export const updateFamilyMember = (data: FamilyMemberVO) => {
  return request.post({ url: '/family-member/update', data })
}

// 删除用户
export const deleteFamilyMember = (idNumber: string) => {
  return request.delete({ url: '/family-member/delete?idNumber=' + idNumber })
}
