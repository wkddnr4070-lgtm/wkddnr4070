import React, { useState, useEffect } from 'react'
import { Building2, Users, Briefcase, User, Plus, Search, Filter, Eye, Edit, Trash2, ChevronRight } from 'lucide-react'
import { useAppContext } from '../App'
import apiClient from '../utils/apiClient'

const OrganizationManagement = () => {
  const { currentUser } = useAppContext()
  const [activeTab, setActiveTab] = useState('companies')
  const [organizations, setOrganizations] = useState({
    companies: [],
    departments: [],
    teams: [],
    employees: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  // 조직 데이터 로드
  useEffect(() => {
    loadOrganizationData()
  }, [])

  const loadOrganizationData = async () => {
    setIsLoading(true)
    try {
      console.log('🏢 조직 데이터 로딩 시작...')

      // 병렬로 모든 조직 데이터 가져오기
      const [companiesRes, departmentsRes, teamsRes, employeesRes] = await Promise.all([
        apiClient.get('/organization/companies'),
        apiClient.get('/organization/departments'),
        apiClient.get('/organization/teams'),
        apiClient.get('/organization/employees')
      ])

      setOrganizations({
        companies: companiesRes.success ? companiesRes.data : [],
        departments: departmentsRes.success ? departmentsRes.data : [],
        teams: teamsRes.success ? teamsRes.data : [],
        employees: employeesRes.success ? employeesRes.data : []
      })

      console.log('✅ 조직 데이터 로드 완료')
    } catch (error) {
      console.error('❌ 조직 데이터 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 탭 설정
  const tabs = [
    { id: 'companies', name: '회사', icon: Building2, count: organizations.companies.length },
    { id: 'departments', name: '부서', icon: Briefcase, count: organizations.departments.length },
    { id: 'teams', name: '팀', icon: Users, count: organizations.teams.length },
    { id: 'employees', name: '직원', icon: User, count: organizations.employees.length }
  ]

  // 검색 필터링
  const filteredData = organizations[activeTab]?.filter(item => {
    if (!searchTerm) return true
    const searchFields = ['name', 'company_name', 'department_name', 'team_name', 'position']
    return searchFields.some(field => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }) || []

  // 회사 카드 렌더링
  const CompanyCard = ({ company }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedCompany(company)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Building2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{company.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">설립일: {new Date(company.created_at).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{company.department_count}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">부서</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-2xl font-bold text-success-600 dark:text-success-400">{company.employee_count}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">직원</p>
        </div>
      </div>
    </div>
  )

  // 부서 카드 렌더링
  const DepartmentCard = ({ department }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
            <Briefcase className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{department.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{department.company_name}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xl font-bold text-warning-600 dark:text-warning-400">{department.team_count}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">팀</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xl font-bold text-info-600 dark:text-info-400">{department.employee_count}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">직원</p>
        </div>
      </div>
    </div>
  )

  // 팀 카드 렌더링
  const TeamCard = ({ team }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
            <Users className="h-5 w-5 text-success-600 dark:text-success-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{team.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{team.department_name} • {team.company_name}</p>
          </div>
        </div>
      </div>
      
      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-xl font-bold text-success-600 dark:text-success-400">{team.employee_count}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">팀원</p>
      </div>
    </div>
  )

  // 직원 카드 렌더링
  const EmployeeCard = ({ employee }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-info-100 dark:bg-info-900 rounded-full">
          <User className="h-6 w-6 text-info-600 dark:text-info-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
            {employee.is_active && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                계정 있음
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {employee.team_name} • {employee.department_name}
          </p>
          {employee.contact && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              📧 {employee.contact}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          조직 관리
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          회사, 부서, 팀, 직원을 체계적으로 관리합니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`${tabs.find(t => t.id === activeTab)?.name} 검색...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          추가
        </button>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">데이터 로딩 중...</span>
        </div>
      ) : (
        /* 데이터 표시 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'companies' && filteredData.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
          
          {activeTab === 'departments' && filteredData.map(department => (
            <DepartmentCard key={department.id} department={department} />
          ))}
          
          {activeTab === 'teams' && filteredData.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
          
          {activeTab === 'employees' && filteredData.map(employee => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
          
          {filteredData.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                {tabs.find(t => t.id === activeTab)?.icon && 
                  React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "h-12 w-12 mx-auto" })
                }
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? '검색 결과가 없습니다.' : `등록된 ${tabs.find(t => t.id === activeTab)?.name}가 없습니다.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 통계 요약 */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">조직 현황 요약</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <div key={tab.id} className="text-center">
                <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tab.count}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tab.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OrganizationManagement
