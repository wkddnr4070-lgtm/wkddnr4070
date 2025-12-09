import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, User, Mail, Lock, Phone, Briefcase, Users, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import apiClient from '../utils/apiClient'

const Register = () => {
  const navigate = useNavigate()
  
  // 3단계 폼 상태
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // 1단계: 기본 정보
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    
    // 2단계: 개인 정보
    name: '',
    employeeId: '',
    position: '',
    contact: '',
    
    // 3단계: 조직 정보
    company: '',
    department: '',
    team: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  
  // 조직 데이터
  const [companies, setCompanies] = useState([])
  const [departments, setDepartments] = useState([])
  const [teams, setTeams] = useState([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  // 회사, 부서, 팀 옵션 로드
  useEffect(() => {
    loadOrganizationOptions()
  }, [])

  // 회사 선택 시 부서 로드
  useEffect(() => {
    if (formData.company) {
      loadDepartments(formData.company)
      setFormData(prev => ({ ...prev, department: '', team: '' }))
    } else {
      setDepartments([])
      setTeams([])
    }
  }, [formData.company])

  // 부서 선택 시 팀 로드
  useEffect(() => {
    if (formData.department && formData.company) {
      loadTeams(formData.company, formData.department)
      setFormData(prev => ({ ...prev, team: '' }))
    } else {
      setTeams([])
    }
  }, [formData.department, formData.company])

  const loadOrganizationOptions = async () => {
    try {
      setIsLoadingOptions(true)
      const response = await apiClient.get('/organization/companies')
      if (response.success && response.data) {
        setCompanies(response.data)
      }
    } catch (error) {
      console.error('회사 목록 로드 실패:', error)
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const loadDepartments = async (companyId) => {
    try {
      setIsLoadingOptions(true)
      const response = await apiClient.get(`/organization/companies/${companyId}/departments`)
      if (response.success && response.data) {
        setDepartments(response.data)
      }
    } catch (error) {
      console.error('부서 목록 로드 실패:', error)
      setDepartments([])
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const loadTeams = async (companyId, departmentId) => {
    try {
      setIsLoadingOptions(true)
      const response = await apiClient.get(`/organization/departments/${departmentId}/teams`)
      if (response.success && response.data) {
        setTeams(response.data)
      }
    } catch (error) {
      console.error('팀 목록 로드 실패:', error)
      setTeams([])
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 입력 시 해당 필드의 에러 메시지 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateStep = (stepNumber) => {
    const newErrors = {}
    
    if (stepNumber === 1) {
      if (!formData.username) newErrors.username = '사용자명을 입력해주세요'
      if (!formData.password) newErrors.password = '비밀번호를 입력해주세요'
      if (formData.password && formData.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
      }
      if (!formData.email) newErrors.email = '이메일을 입력해주세요'
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다'
      }
    } else if (stepNumber === 2) {
      if (!formData.name) newErrors.name = '이름을 입력해주세요'
      if (!formData.employeeId) newErrors.employeeId = '사번을 입력해주세요'
      if (!formData.position) newErrors.position = '직급을 입력해주세요'
      if (!formData.contact) newErrors.contact = '연락처를 입력해주세요'
    } else if (stepNumber === 3) {
      if (!formData.company) newErrors.company = '회사를 선택해주세요'
      if (!formData.department) newErrors.department = '부서를 선택해주세요'
      if (!formData.team) newErrors.team = '팀을 선택해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await apiClient.post('/auth/register', {
        // 기본 정보
        username: formData.username,
        password: formData.password,
        email: formData.email,
        
        // 개인 정보
        name: formData.name,
        employeeId: formData.employeeId,
        position: formData.position,
        contact: formData.contact,
        
        // 조직 정보
        company: formData.company,
        department: formData.department,
        team: formData.team
      })

      if (response.success) {
        setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setErrors({ submit: response.message || '회원가입에 실패했습니다.' })
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      setErrors({ submit: error.message || '회원가입 중 오류가 발생했습니다.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            SHE 디지털트윈 플랫폼 회원가입
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 1 && '기본 정보를 입력해주세요'}
            {step === 2 && '개인 정보를 입력해주세요'}
            {step === 3 && '조직 정보를 선택해주세요'}
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {step > num ? <CheckCircle className="h-6 w-6" /> : num}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    {num === 1 && '기본정보'}
                    {num === 2 && '개인정보'}
                    {num === 3 && '조직정보'}
                  </span>
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > num ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 에러/성공 메시지 */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{errors.submit}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* 1단계: 기본 정보 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  사용자명 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.username ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="사용자명을 입력하세요"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="비밀번호를 입력하세요 (최소 6자)"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* 2단계: 개인 정보 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  사번 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.employeeId ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="사번을 입력하세요"
                  />
                </div>
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  직급 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.position ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="직급을 입력하세요 (예: 과장, 대리)"
                  />
                </div>
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.contact ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="연락처를 입력하세요 (예: 010-1234-5678)"
                  />
                </div>
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>
            </div>
          )}

          {/* 3단계: 조직 정보 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  회사 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isLoadingOptions}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.company ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">회사를 선택하세요</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  부서 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!formData.company || isLoadingOptions}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.department ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } ${!formData.company ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">부서를 선택하세요</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  팀 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    disabled={!formData.department || isLoadingOptions}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.team ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    } ${!formData.department ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">팀을 선택하세요</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.team && <p className="text-red-500 text-xs mt-1">{errors.team}</p>}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
                이전
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
              >
                다음
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    가입 중...
                  </>
                ) : (
                  <>
                    회원가입 완료
                    <CheckCircle className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register


