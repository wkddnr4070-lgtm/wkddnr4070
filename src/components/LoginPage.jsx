import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, Users, User, Phone, CheckCircle, AlertCircle, Plus, Minus, Loader2 } from 'lucide-react'
import { useAppContext } from '../App'
import apiClient from '../utils/apiClient'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, companyOrganizations } = useAppContext()

  const [formData, setFormData] = useState({
    company: '',
    department: '',
    name: '',
    contact: ''
  })

  const [expandedDepartments, setExpandedDepartments] = useState({})
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 회사 목록
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

  // 선택된 회사의 부서 목록 생성 (대표이사 → 실 → 조직 구조)
  const getDepartments = useMemo(() => {
    try {
      if (!formData.company || !companyOrganizations || !companyOrganizations[formData.company]) {
        return []
      }

      const companyData = companyOrganizations[formData.company]
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
              // level2가 객체면 더 하위 팀이 있음 (예: 경영지원실)
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
  }, [formData.company, companyOrganizations, expandedDepartments])

  // 선택된 부서의 직원 목록 (3단계 구조: 대표이사 → 실 → 조직)
  const getEmployees = useMemo(() => {
    try {
      if (!formData.company || !formData.department || !companyOrganizations || !companyOrganizations[formData.company]) {
        return []
      }

      const companyData = companyOrganizations[formData.company]
      if (!companyData || typeof companyData !== 'object') {
        return []
      }

      // 3단계 구조에서 해당 팀 찾기
      for (const level1 in companyData) {
        const level1Data = companyData[level1]
        if (level1Data && typeof level1Data === 'object') {
          for (const level2 in level1Data) {
            const level2Data = level1Data[level2]
            if (level2Data && typeof level2Data === 'object') {
              // level2가 배열이면 바로 반환
              if (Array.isArray(level2Data)) {
                if (level2 === formData.department) {
                  return level2Data
                }
              } else {
                // level2가 객체면 하위 팀 찾기
                for (const team in level2Data) {
                  if (team === formData.department && Array.isArray(level2Data[team])) {
                    return level2Data[team]
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
  }, [formData.company, formData.department, companyOrganizations])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')

    if (field === 'company') {
      setFormData(prev => ({ ...prev, department: '', name: '' }))
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
      if (department.type === 'level2') {
        toggleDepartment(`${department.parent}>${department.name}`)
      } else {
        toggleDepartment(department.name)
      }
    } else {
      setFormData(prev => ({ ...prev, department: department.name, name: '' }))
      setShowEmployeeList(false)
    }
  }, [toggleDepartment])

  const handleEmployeeSelect = useCallback((employee) => {
    const name = employee.split(' (')[0]
    setFormData(prev => ({ ...prev, name }))
    setShowEmployeeList(false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.company) {
      setError('회사를 선택해주세요.')
      return
    }

    if (!formData.department) {
      setError('부서/팀을 선택해주세요.')
      return
    }

    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.')
      return
    }

    if (!formData.contact.trim()) {
      setError('전화번호를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 로그인 처리 (이름과 전화번호로 인증)
      const userData = {
        id: Date.now(),
        name: formData.name,
        company: formData.company,
        department: formData.department,
        contact: formData.contact,
        position: '사원' // 기본값
      }

      const token = 'login-token-' + Date.now()

      // App.jsx의 login 함수 사용
      login(userData, token)

      setSuccess('로그인 성공! 대시보드로 이동합니다...')

      setTimeout(() => {
        navigate('/', { replace: true })
      }, 1500)

      console.log('✅ 로그인 성공:', userData)
    } catch (error) {
      console.error('❌ 로그인 실패:', error)
      setError(error.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative">
      {/* 좌측 상단 로고 */}
      <div className="absolute top-6 left-6">
        <img
          src="/sk-innovation-logo.png"
          alt="SK 이노베이션 E&S"
          className="h-12 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex'
            }
          }}
        />
        <div className="hidden items-center gap-2">
          <Building className="h-8 w-8 text-white" />
          <span className="text-lg font-bold text-white">SK 이노베이션 E&S</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            SHE 디지털트윈 플랫폼
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            도시가스 비상대응 모의훈련 시스템
          </p>
        </div>

        {/* 에러/성공 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 회사 선택 */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              회사 <span className="text-red-500">*</span>
            </label>
            <select
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              disabled={isLoading}
            >
              <option value="">회사를 선택하세요</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* 부서/팀 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              부서/팀 <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto dark:bg-gray-700">
              {formData.company ? (
                getDepartments.length > 0 ? (
                  <div className="p-2">
                    {getDepartments.map((department, index) => {
                      const indentLevel =
                        department.type === 'level1' ? 0 :
                          department.type === 'level2' ? 1 :
                            department.type === 'team' && department.parent.includes('>') ? 2 :
                              1

                      const marginLeft = indentLevel === 0 ? '' :
                        indentLevel === 1 ? 'ml-4' :
                          'ml-8'

                      const isExpanded = department.type === 'level2'
                        ? expandedDepartments[`${department.parent}>${department.name}`]
                        : expandedDepartments[department.name]

                      return (
                        <div
                          key={`${department.name}-${index}`}
                          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${marginLeft} ${department.hasSubTeams
                              ? 'hover:bg-gray-50 dark:hover:bg-gray-600'
                              : `hover:bg-primary-50 dark:hover:bg-primary-900/20 ${formData.department === department.name
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
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
                              <Building className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                              <span className="font-medium text-gray-700 dark:text-gray-300">{department.name}</span>
                            </>
                          ) : (
                            <>
                              <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">{department.name}</span>
                              {formData.department === department.name && (
                                <CheckCircle className="h-4 w-4 ml-auto text-primary-600 dark:text-primary-400" />
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    선택한 회사의 조직도가 없습니다
                  </div>
                )
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  먼저 회사를 선택해주세요
                </div>
              )}
            </div>
          </div>

          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <div className="relative employee-dropdown">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => {
                  if (formData.department && getEmployees.length > 0) {
                    setShowEmployeeList(true)
                  }
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${error && !formData.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder={formData.department ? "이름을 입력하거나 목록에서 선택하세요" : "먼저 부서/팀을 선택해주세요"}
                disabled={!formData.department || isLoading}
              />

              {/* 직원 목록 드롭다운 */}
              {showEmployeeList && formData.department && getEmployees.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                      {formData.department} 소속 직원 목록
                    </div>
                    {getEmployees.map((employee, index) => {
                      const name = employee.split(' (')[0]
                      return (
                        <div
                          key={index}
                          onClick={() => handleEmployeeSelect(employee)}
                          className="flex items-center p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer rounded-md transition-colors"
                        >
                          <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            {formData.department && getEmployees.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                💡 {formData.department}에서 {getEmployees.length}명의 직원 중 선택하거나 직접 입력할 수 있습니다
              </p>
            )}
          </div>

          {/* 전화번호 입력 */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${error && !formData.contact ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="010-0000-0000"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                로그인
              </>
            )}
          </button>
        </form>

        {/* 푸터 */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 SHE Safety Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
