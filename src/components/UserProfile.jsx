import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Building, Users, User, CheckCircle, Edit, Save, X, Plus, Minus, Loader2 } from 'lucide-react'

const UserProfile = ({ onProfileComplete, companyOrganizations }) => {
  // 에러 방어 코드
  if (!companyOrganizations) {
    console.error('UserProfile: companyOrganizations is undefined')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">데이터 로딩 중 오류가 발생했습니다.</div>
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
  const [profile, setProfile] = useState({
    name: '',
    company: '',
    department: '',
    position: '',
    contact: '',
    employeeId: ''
  })

  const [isEditing, setIsEditing] = useState(true)
  const [errors, setErrors] = useState({})
  const [expandedDepartments, setExpandedDepartments] = useState({})
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // 외부 클릭 시 직원 목록 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmployeeList && !event.target.closest('.employee-dropdown')) {
        setShowEmployeeList(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmployeeList])

  // 기본 회사 목록 (확장 가능)
  const companies = [
    'SK E&S',
    '코원에너지서비스',
    '충청에너지서비스',
    '부산도시가스',
    '영남에너지서비스(구미)',
    '영남에너지서비스(포항)',
    '전북에너지서비스',
    '전남도시가스',
    '강원도시가스'
  ]

  // 회사별 조직 구조 데이터 (props로 받아옴)
  const organizationData = companyOrganizations || {}
  
  // 디버깅을 위한 로그
  console.log('UserProfile - companyOrganizations:', companyOrganizations)
  console.log('UserProfile - organizationData:', organizationData)

  // 선택된 회사의 부서 목록 생성
  // 선택된 회사와 부서의 직원 목록 가져오기 (메모이제이션)
  const getEmployees = useMemo(() => {
    try {
      if (!profile.company || !profile.department || !organizationData[profile.company]) {
        return []
      }
      
      const companyData = organizationData[profile.company]
      if (!companyData || typeof companyData !== 'object') {
        return []
      }
      
      // 3단계 구조: 부서에서 해당 팀 찾기
      for (const dept in companyData) {
        if (companyData[dept] && typeof companyData[dept] === 'object') {
          // 직원 배열이면 반환
          if (Array.isArray(companyData[dept])) {
            if (dept === profile.department) {
              return companyData[dept]
            }
          } else {
            // 객체면 더 깊이 들어가서 찾기
            for (const subDept in companyData[dept]) {
              if (companyData[dept][subDept]) {
                // 직원 배열이면 반환
                if (Array.isArray(companyData[dept][subDept])) {
                  if (subDept === profile.department) {
                    return companyData[dept][subDept]
                  }
                } else if (typeof companyData[dept][subDept] === 'object') {
                  // 4단계 구조 (전북에너지서비스)
                  for (const team in companyData[dept][subDept]) {
                    if (team === profile.department && Array.isArray(companyData[dept][subDept][team])) {
                      return companyData[dept][subDept][team]
                    }
                  }
                }
              }
            }
          }
        }
      }
      return []
    } catch (error) {
      console.error('getEmployees error:', error)
      return []
    }
  }, [profile.company, profile.department, organizationData])

  const getDepartments = useMemo(() => {
    try {
      if (!profile.company || !organizationData[profile.company]) {
        return []
      }
      
      const companyData = organizationData[profile.company]
      if (!companyData || typeof companyData !== 'object') {
        return []
      }
      
      const departments = []
      
      Object.keys(companyData).forEach(level1 => {
        // 1단계 (예: 대표이사)
        departments.push({
          name: level1,
          type: 'level1',
          hasSubTeams: true
        })
        
        // 1단계가 확장되어 있으면 하위 레벨 추가
        if (expandedDepartments[level1] && companyData[level1]) {
          Object.keys(companyData[level1]).forEach(level2 => {
            const level2Data = companyData[level1][level2]
            
            // level2가 배열이면 바로 선택 가능한 팀
            if (Array.isArray(level2Data)) {
              departments.push({
                name: level2,
                type: 'team',
                parent: level1,
                hasSubTeams: false
              })
            } else if (typeof level2Data === 'object') {
              // level2가 객체면 더 하위 팀이 있음 (예: 사업운영실)
              departments.push({
                name: level2,
                type: 'level2',
                parent: level1,
                hasSubTeams: true
              })
              
              // level2가 확장되어 있으면 하위 팀들 추가
              const level2Key = `${level1}>${level2}`
              if (expandedDepartments[level2Key] && level2Data) {
                Object.keys(level2Data).forEach(team => {
                  departments.push({
                    name: team,
                    type: 'team',
                    parent: level2Key,
                    hasSubTeams: false
                  })
                })
              }
            }
          })
        }
      })
      
      return departments
    } catch (error) {
      console.error('getDepartments error:', error)
      return []
    }
  }, [profile.company, organizationData, expandedDepartments])

  const positions = [
    '대표이사',
    '실장',
    '팀장',
    '차장',
    '과장',
    '대리',
    '사원'
  ]

  const validateProfile = () => {
    const newErrors = {}
    
    if (!profile.name.trim()) newErrors.name = '이름을 입력해주세요'
    if (!profile.company) newErrors.company = '회사를 선택해주세요'
    if (!profile.department) newErrors.department = '부서/팀을 선택해주세요'
    if (!profile.position) newErrors.position = '직급을 선택해주세요'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateProfile()) {
      setIsLoading(true)
      setTimeout(() => {
        setIsEditing(false)
        if (onProfileComplete) {
          onProfileComplete(profile)
        }
        setIsLoading(false)
      }, 500) // 프로필 완료 로딩
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setErrors({})
  }

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // 회사가 변경되면 부서와 확장 상태 초기화
    if (field === 'company') {
      setProfile(prev => ({ ...prev, department: '' }))
      setExpandedDepartments({})
    }
  }

  const toggleDepartment = useCallback((departmentName) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [departmentName]: !prev[departmentName]
    }))
  }, [])

  const handleDepartmentSelect = useCallback((department) => {
    if (department.hasSubTeams) {
      // 하위 팀이 있으면 토글 (level1, level2)
      if (department.type === 'level2') {
        // level2는 부모와 함께 키 생성
        toggleDepartment(`${department.parent}>${department.name}`)
      } else {
        toggleDepartment(department.name)
      }
    } else {
      // 팀을 클릭하면 선택
      setIsLoading(true)
      setTimeout(() => {
        setProfile(prev => ({ ...prev, department: department.name, name: '' }))
        setShowEmployeeList(false)
        setIsLoading(false)
      }, 200) // 짧은 로딩 시뮬레이션
    }
  }, [toggleDepartment])

  const handleEmployeeSelect = useCallback((employee) => {
    // 직원명에서 이름만 추출 (직급 제거)
    const name = employee.split(' (')[0]
    setProfile(prev => ({ ...prev, name }))
    setShowEmployeeList(false)
  }, [])

  if (!isEditing && profile.name) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">내 프로필</h2>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Edit className="h-4 w-4" />
            수정
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">이름</p>
                <p className="font-medium text-gray-900">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">회사</p>
                <p className="font-medium text-gray-900">{profile.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">부서</p>
                <p className="font-medium text-gray-900">{profile.department}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">직급</p>
              <p className="font-medium text-gray-900">{profile.position}</p>
            </div>

            {profile.contact && (
              <div>
                <p className="text-sm text-gray-600">연락처</p>
                <p className="font-medium text-gray-900">{profile.contact}</p>
              </div>
            )}

            {profile.employeeId && (
              <div>
                <p className="text-sm text-gray-600">사번</p>
                <p className="font-medium text-gray-900">{profile.employeeId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* 좌측 상단 로고 */}
        <div className="absolute top-6 left-6">
          <img 
            src="/sk-innovation-logo.png" 
            alt="SK 이노베이션 E&S" 
            className="h-12 object-contain"
            onError={(e) => {
              // 로고 파일이 없을 경우 기본 아이콘 표시
              e.target.style.display = 'none'
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex'
              }
            }}
          />
          <div className="hidden items-center gap-2">
            <Building className="h-8 w-8 text-primary-600" />
            <span className="text-lg font-bold text-primary-600">SK 이노베이션 E&S</span>
          </div>
        </div>

        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              프로필 설정
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              도시가스 비상대응 모의훈련 플랫폼에 오신 것을 환영합니다.<br/>
              먼저 기본 정보를 입력해주세요.
            </p>
          </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                회사 <span className="text-red-500">*</span>
              </label>
              <select
                value={profile.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.company ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">회사를 선택하세요</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                부서/팀 <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                {profile.company ? (
                  getDepartments.length > 0 ? (
                    <div className="p-2">
                      {getDepartments.map((department, index) => {
                        // 들여쓰기 레벨 계산
                        const indentLevel = 
                          department.type === 'level1' ? 0 :
                          department.type === 'level2' ? 1 :
                          department.type === 'team' && department.parent.includes('>') ? 2 :
                          1;
                        
                        const marginLeft = indentLevel === 0 ? '' : 
                                          indentLevel === 1 ? 'ml-4' : 
                                          'ml-8';
                        
                        // 확장 상태 확인
                        const isExpanded = department.type === 'level2' 
                          ? expandedDepartments[`${department.parent}>${department.name}`]
                          : expandedDepartments[department.name];
                        
                        return (
                          <div
                            key={`${department.name}-${index}`}
                            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${marginLeft} ${
                              department.hasSubTeams
                                ? 'hover:bg-gray-50'
                                : `hover:bg-primary-50 ${
                                    profile.department === department.name
                                      ? 'bg-primary-100 text-primary-700'
                                      : ''
                                  }`
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isLoading && handleDepartmentSelect(department)}
                          >
                            {department.hasSubTeams ? (
                              <>
                                {isExpanded ? (
                                  <Minus className="h-4 w-4 mr-2 text-gray-400" />
                                ) : (
                                  <Plus className="h-4 w-4 mr-2 text-gray-400" />
                                )}
                                <Building className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="font-medium text-gray-700">{department.name}</span>
                              </>
                            ) : (
                              <>
                                <Users className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-600">{department.name}</span>
                                {profile.department === department.name && (
                                  <CheckCircle className="h-4 w-4 ml-auto text-primary-600" />
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      선택한 회사의 조직도가 없습니다
                    </div>
                  )
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    먼저 회사를 선택해주세요
                  </div>
                )}
              </div>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative employee-dropdown">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => {
                  if (profile.department && getEmployees.length > 0) {
                    setShowEmployeeList(true)
                  }
                }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={profile.department ? "이름을 입력하거나 목록에서 선택하세요" : "먼저 부서/팀을 선택해주세요"}
                  disabled={!profile.department}
                />
                
                {/* 직원 목록 드롭다운 */}
                {showEmployeeList && profile.department && getEmployees.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2 px-2">
                        {profile.department} 소속 직원 목록
                      </div>
                      {getEmployees.map((employee, index) => {
                        // 이름만 추출 (직급 제거)
                        const name = employee.split(' (')[0]
                        return (
                          <div
                            key={index}
                            onClick={() => handleEmployeeSelect(employee)}
                            className="flex items-center p-2 hover:bg-primary-50 cursor-pointer rounded-md transition-colors"
                          >
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-gray-700">{name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              {profile.department && getEmployees.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 {profile.department}에서 {getEmployees.length}명의 직원 중 선택하거나 직접 입력할 수 있습니다
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                직급 <span className="text-red-500">*</span>
              </label>
              <select
                value={profile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.position ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">직급을 선택하세요</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
            </div>
          </div>

          {/* 선택 정보 */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">추가 정보 (선택사항)</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처
              </label>
              <input
                type="tel"
                value={profile.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사번
              </label>
              <input
                type="text"
                value={profile.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="사번을 입력하세요"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  저장하고 시작하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('UserProfile render error:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">프로필 설정 중 오류가 발생했습니다.</div>
          <div className="text-sm text-gray-600 mb-4">오류: {error.message}</div>
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
}

export default React.memo(UserProfile)
