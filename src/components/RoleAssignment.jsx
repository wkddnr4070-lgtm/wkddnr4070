import React, { useState, useEffect, useMemo } from 'react'
import { Users, Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react'
import { useAppContext } from '../App'

const RoleAssignment = () => {
  const { companyOrganizations, userProfile, roleAssignments, setRoleAssignments } = useAppContext()

  // 디버깅 정보
  console.log('RoleAssignment - companyOrganizations:', companyOrganizations)
  console.log('RoleAssignment - userProfile:', userProfile)

  // 에러 방어 코드
  if (!companyOrganizations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">역할 관리</h2>
          <p className="text-gray-600 mb-4">조직 데이터를 로딩하는 중입니다...</p>
          <div className="text-xs text-gray-500 mb-4">
            디버깅: companyOrganizations = {JSON.stringify(companyOrganizations)}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            새로고침
          </button>
        </div>
      </div>
    )
  }

  // 반별 역할 정의
  const roleDefinitions = {
    '관제운영반': {
      description: '상황실 운영 및 전체 상황 관리',
      responsibilities: ['상황 모니터링', '보고 체계 관리', '조정 업무'],
      requiredSkills: ['통신', '상황판단', '조정능력']
    },
    '현장출동반': {
      description: '현장 출동 및 초기 대응',
      responsibilities: ['현장 출동', '초기 상황 파악', '안전 확보'],
      requiredSkills: ['안전관리', '현장대응', '장비조작']
    },
    '안전관리반': {
      description: '안전 관리 및 위험 요소 통제',
      responsibilities: ['안전 확보', '위험 요소 관리', '대피 지시'],
      requiredSkills: ['안전관리', '위험평가', '대피계획']
    },
    '고객서비스반': {
      description: '고객 안내 및 민원 처리',
      responsibilities: ['고객 안내', '민원 처리', '정보 제공'],
      requiredSkills: ['커뮤니케이션', '고객서비스', '정보관리']
    },
    '기술반': {
      description: '기술적 문제 해결 및 설비 관리',
      responsibilities: ['기술 지원', '설비 점검', '복구 작업'],
      requiredSkills: ['기술지식', '설비관리', '문제해결']
    },
    '홍보반': {
      description: '대외 홍보 및 언론 대응',
      responsibilities: ['보도자료 작성', '언론 대응', '정보 공개'],
      requiredSkills: ['홍보', '언론대응', '문서작성']
    },
    '복구반': {
      description: '시설 복구 및 정상화 작업',
      responsibilities: ['복구 작업', '시설 점검', '정상화'],
      requiredSkills: ['복구작업', '시설관리', '품질관리']
    },
    '현장작업반': {
      description: '현장 작업 및 시설 관리',
      responsibilities: ['현장 작업', '시설 관리', '안전 확보'],
      requiredSkills: ['현장작업', '시설관리', '안전관리']
    },
    '현장관리반장': {
      description: '현장 관리 및 지휘',
      responsibilities: ['현장 지휘', '작업 관리', '안전 확보'],
      requiredSkills: ['지휘력', '현장관리', '안전관리']
    },
    '층별책임반장': {
      description: '층별 대피 및 안전 관리',
      responsibilities: ['층별 대피', '안전 관리', '인원 점검'],
      requiredSkills: ['대피관리', '인원관리', '안전관리']
    },
    '발견반': {
      description: '사고 발견 및 초기 신고',
      responsibilities: ['사고 발견', '초기 신고', '상황 전파'],
      requiredSkills: ['관찰력', '신고체계', '상황판단']
    }
  }

  // 로그인한 사용자의 회사 직원 정보만 추출
  const getAllEmployees = useMemo(() => {
    const employees = []
    const userCompany = userProfile?.company

    if (!userCompany || !companyOrganizations[userCompany]) {
      return employees
    }

    const companyData = companyOrganizations[userCompany]

    Object.keys(companyData).forEach(department => {
      const departmentData = companyData[department]
      if (departmentData && typeof departmentData === 'object') {
        Object.keys(departmentData).forEach(team => {
          const teamData = departmentData[team]
          if (Array.isArray(teamData)) {
            teamData.forEach(employee => {
              if (typeof employee === 'string') {
                const [name, position] = employee.split(' (')
                const cleanPosition = position?.replace(')', '') || ''

                employees.push({
                  id: `${userCompany}-${department}-${team}-${name}`,
                  name: name,
                  position: cleanPosition,
                  company: userCompany,
                  department: department,
                  team: team,
                  fullTeam: `${department} > ${team}`
                })
              }
            })
          }
        })
      }
    })

    return employees
  }, [companyOrganizations, userProfile?.company])

  // 초기 랜덤 배정 (컴포넌트 마운트 시)
  useEffect(() => {
    if (Object.keys(roleAssignments).length === 0 && getAllEmployees.length > 0) {
      const roles = Object.keys(roleDefinitions)
      const newAssignments = {}

      // 각 반에 7명씩 배정
      const employeesPerRole = 7
      let employeeIndex = 0

      roles.forEach(role => {
        for (let i = 0; i < employeesPerRole && employeeIndex < getAllEmployees.length; i++) {
          newAssignments[getAllEmployees[employeeIndex].id] = role
          employeeIndex++
        }
      })

      // 남은 직원들을 랜덤하게 배정
      while (employeeIndex < getAllEmployees.length) {
        const randomRole = roles[Math.floor(Math.random() * roles.length)]
        newAssignments[getAllEmployees[employeeIndex].id] = randomRole
        employeeIndex++
      }

      setRoleAssignments(newAssignments)
    }
  }, [getAllEmployees, roleAssignments, setRoleAssignments])

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [editingRole, setEditingRole] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // 역할 배정 저장
  useEffect(() => {
    localStorage.setItem('roleAssignments', JSON.stringify(roleAssignments))
  }, [roleAssignments])

  // 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    return getAllEmployees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.fullTeam.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !selectedRole || roleAssignments[employee.id] === selectedRole

      return matchesSearch && matchesRole
    })
  }, [getAllEmployees, searchTerm, selectedRole, roleAssignments])

  // 역할별 직원 수 계산
  const roleStats = useMemo(() => {
    const stats = {}
    Object.keys(roleDefinitions).forEach(role => {
      stats[role] = Object.values(roleAssignments).filter(assignment => assignment === role).length
    })
    return stats
  }, [roleAssignments, roleDefinitions])

  // 역할 배정/해제
  const assignRole = (employeeId, role) => {
    const newAssignments = { ...roleAssignments, [employeeId]: role }
    setRoleAssignments(newAssignments)
    localStorage.setItem('roleAssignments', JSON.stringify(newAssignments))
  }

  const removeRole = (employeeId) => {
    const newAssignments = { ...roleAssignments }
    delete newAssignments[employeeId]
    setRoleAssignments(newAssignments)
    localStorage.setItem('roleAssignments', JSON.stringify(newAssignments))
  }

  // 검색어 하이라이트 함수
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    )
  }

  // 랜덤 배정 함수 (각 반에 7명씩)
  const randomizeAssignments = () => {
    const roles = Object.keys(roleDefinitions)
    const employees = getAllEmployees
    const newAssignments = {}

    // 각 반에 7명씩 배정
    const employeesPerRole = 7
    let employeeIndex = 0

    roles.forEach(role => {
      for (let i = 0; i < employeesPerRole && employeeIndex < employees.length; i++) {
        newAssignments[employees[employeeIndex].id] = role
        employeeIndex++
      }
    })

    // 남은 직원들을 랜덤하게 배정
    while (employeeIndex < employees.length) {
      const randomRole = roles[Math.floor(Math.random() * roles.length)]
      newAssignments[employees[employeeIndex].id] = randomRole
      employeeIndex++
    }

    setRoleAssignments(newAssignments)
  }

  // 회사 목록 (로그인한 사용자의 회사만)
  const companies = userProfile?.company ? [userProfile.company] : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">역할 관리</h1>
          <p className="text-gray-600">비상상황 대응을 위한 역할 배정 및 관리</p>
        </div>

        {/* 검색 및 필터 - 상단으로 이동 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="직원명 또는 소속팀 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">전체 역할</option>
              {Object.keys(roleDefinitions).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedRole('')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              초기화
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            현재 회사: <span className="font-medium text-primary-600">{userProfile?.company}</span>
            <span className="mx-2">|</span>
            총 직원 수: <span className="font-medium text-primary-600">{getAllEmployees.length}명</span>
            <span className="mx-2">|</span>
            검색 결과: <span className="font-medium text-primary-600">{filteredEmployees.length}명</span>
          </div>
        </div>

        {/* 검색 결과 표시 */}
        {(searchTerm || selectedRole) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">
                {searchTerm && selectedRole
                  ? `검색 결과: "${searchTerm}" (${selectedRole})`
                  : searchTerm
                    ? `검색 결과: "${searchTerm}"`
                    : `${selectedRole} 역할`
                }
              </h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredEmployees.length}명
              </span>
            </div>

            {filteredEmployees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(employee => (
                  <div key={employee.id} className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {highlightText(employee.name, searchTerm)}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {highlightText(employee.fullTeam, searchTerm)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleAssignments[employee.id]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                          }`}>
                          {roleAssignments[employee.id] || '미배정'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {roleAssignments[employee.id] ? (
                        <button
                          onClick={() => removeRole(employee.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          역할 제거
                        </button>
                      ) : (
                        <div className="flex gap-1">
                          {Object.keys(roleDefinitions).map(role => (
                            <button
                              key={role}
                              onClick={() => assignRole(employee.id, role)}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors text-xs"
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-1">다른 검색어를 시도해보세요.</p>
              </div>
            )}
          </div>
        )}

        {/* 반별 인원 현황 */}
        <div className="space-y-6 mb-8">
          {Object.keys(roleDefinitions).map(role => {
            const roleEmployees = getAllEmployees.filter(emp => roleAssignments[emp.id] === role)

            return (
              <div key={role} className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{role}</h3>
                      <p className="text-gray-600 mt-1">{roleDefinitions[role].description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">{roleEmployees.length}명</div>
                      <div className="text-sm text-gray-500">현재 인원</div>
                    </div>
                  </div>

                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">소속 인원 ({roleEmployees.length}명)</h4>
                    <button
                      onClick={() => setShowAddModal(role)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      인원 추가
                    </button>
                  </div>
                  {roleEmployees.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>배정된 인원이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roleEmployees.map(employee => (
                        <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{employee.name}</h5>
                            <button
                              onClick={() => removeRole(employee.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="역할 제거"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
                          <p className="text-xs text-gray-500 mb-1">{employee.fullTeam}</p>
                          <p className="text-xs text-gray-400">{employee.company}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 전체 팀원 반 소속 현황 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">전체 팀원 반 소속 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAllEmployees.map(employee => (
              <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{employee.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleAssignments[employee.id]
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {roleAssignments[employee.id] || '미배정'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
                <p className="text-xs text-gray-500">{employee.fullTeam}</p>
                <p className="text-xs text-gray-400 mt-1">{employee.company}</p>
              </div>
            ))}
          </div>
        </div>



        {/* 인원 추가 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{showAddModal} 인원 추가</h3>
                <button
                  onClick={() => setShowAddModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {getAllEmployees
                  .filter(emp => !roleAssignments[emp.id] || roleAssignments[emp.id] === showAddModal)
                  .map(employee => (
                    <div key={employee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-600">{employee.position}</div>
                        <div className="text-xs text-gray-500">{employee.fullTeam} • {employee.company}</div>
                      </div>
                      <div className="flex gap-2">
                        {roleAssignments[employee.id] === showAddModal ? (
                          <button
                            onClick={() => removeRole(employee.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            제거
                          </button>
                        ) : (
                          <button
                            onClick={() => assignRole(employee.id, showAddModal)}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
                          >
                            배정
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleAssignment
