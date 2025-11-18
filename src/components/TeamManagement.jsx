import React, { useState, useEffect, useMemo } from 'react'
import { Users, Plus, UserPlus, Crown, Trash2, Edit, Save, X, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'

const TeamManagement = () => {
  const navigate = useNavigate()
  const { userProfile, companyOrganizations, roleAssignments } = useAppContext()

  // 디버깅 정보
  console.log('TeamManagement - companyOrganizations:', companyOrganizations)
  console.log('TeamManagement - userProfile:', userProfile)

  // 에러 방어 코드
  if (!companyOrganizations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">팀 관리</h2>
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

  // 팀 관리 상태
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams')
    return saved ? JSON.parse(saved) : []
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(null)
  const [editingTeam, setEditingTeam] = useState(null)

  // 새 팀 생성 폼
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    maxMembers: 5,
    scenarioType: 'gas_leak'
  })

  // 팀 초대 폼
  const [inviteForm, setInviteForm] = useState({
    searchTerm: '',
    selectedMembers: []
  })

  // 현재 회사의 직원 목록
  const availableEmployees = useMemo(() => {
    if (!userProfile?.company || !companyOrganizations[userProfile.company]) {
      return []
    }

    const employees = []
    const companyData = companyOrganizations[userProfile.company]

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
                  id: `${userProfile.company}-${department}-${team}-${name}`,
                  name: name,
                  position: cleanPosition,
                  company: userProfile.company,
                  department: department,
                  team: team,
                  fullTeam: `${department} > ${team}`,
                  assignedRole: roleAssignments[`${userProfile.company}-${department}-${team}-${name}`] || '미배정'
                })
              }
            })
          }
        })
      }
    })

    return employees
  }, [userProfile?.company, companyOrganizations, roleAssignments])

  // 팀 생성
  const createTeam = () => {
    if (!newTeam.name.trim()) return

    const team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      maxMembers: newTeam.maxMembers,
      scenarioType: newTeam.scenarioType,
      leader: userProfile?.name || 'Unknown',
      members: [userProfile?.name || 'Unknown'],
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    setTeams(prev => [...prev, team])
    setNewTeam({ name: '', description: '', maxMembers: 5, scenarioType: 'gas_leak' })
    setShowCreateModal(false)
  }

  // 팀원 초대
  const inviteMembers = (teamId) => {
    const team = teams.find(t => t.id === teamId)
    if (!team) return

    const newMembers = inviteForm.selectedMembers.filter(member =>
      !team.members.includes(member.name)
    )

    if (newMembers.length === 0) return

    setTeams(prev => prev.map(t =>
      t.id === teamId
        ? { ...t, members: [...t.members, ...newMembers.map(m => m.name)] }
        : t
    ))

    setInviteForm({ searchTerm: '', selectedMembers: [] })
    setShowInviteModal(null)
  }

  // 팀원 제거
  const removeMember = (teamId, memberName) => {
    setTeams(prev => prev.map(t =>
      t.id === teamId
        ? { ...t, members: t.members.filter(m => m !== memberName) }
        : t
    ))
  }

  // 팀 삭제
  const deleteTeam = (teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId))
  }

  // 팀 상태 저장
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams))
  }, [teams])

  // 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    return availableEmployees.filter(emp =>
      emp.name.toLowerCase().includes(inviteForm.searchTerm.toLowerCase()) ||
      emp.fullTeam.toLowerCase().includes(inviteForm.searchTerm.toLowerCase()) ||
      emp.assignedRole.toLowerCase().includes(inviteForm.searchTerm.toLowerCase())
    )
  }, [availableEmployees, inviteForm.searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">팀 관리</h1>
          <p className="text-gray-600">팀 단위 비상대응 훈련을 위한 팀 구성 및 관리</p>
        </div>

        {/* 팀 생성 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            새 팀 생성
          </button>
        </div>

        {/* 팀 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTeam(team)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">팀장: {team.leader}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    멤버: {team.members.length}명 / 최대 {team.maxMembers}명
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">팀원 목록</h4>
                  <div className="space-y-1">
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{member}</span>
                        {member !== team.leader && (
                          <button
                            onClick={() => removeMember(team.id, member)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInviteModal(team.id)}
                    disabled={team.members.length >= team.maxMembers}
                    className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    초대
                  </button>
                  <button
                    onClick={() => navigate(`/team-training/${team.id}`)}
                    className="flex-1 px-3 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 text-sm"
                  >
                    훈련 시작
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 생성된 팀이 없습니다</h3>
            <p className="text-gray-600 mb-4">새 팀을 생성하여 팀 단위 훈련을 시작해보세요.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              첫 번째 팀 생성하기
            </button>
          </div>
        )}

        {/* 팀 생성 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">새 팀 생성</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">팀명</label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="팀명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">팀 설명</label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows="3"
                    placeholder="팀 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최대 멤버 수</label>
                  <select
                    value={newTeam.maxMembers}
                    onChange={(e) => setNewTeam(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={3}>3명</option>
                    <option value={4}>4명</option>
                    <option value={5}>5명</option>
                    <option value={6}>6명</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">훈련 시나리오</label>
                  <select
                    value={newTeam.scenarioType}
                    onChange={(e) => setNewTeam(prev => ({ ...prev, scenarioType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="gas_leak">가스 누출 사고</option>
                    <option value="fire">화재 사고</option>
                    <option value="customer_complaint">고객 민원</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={createTeam}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  생성
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 팀원 초대 모달 */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">팀원 초대</h2>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="이름, 부서, 역할로 검색"
                  value={inviteForm.searchTerm}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredEmployees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-600">{employee.position}</div>
                      <div className="text-xs text-gray-500">{employee.fullTeam}</div>
                      <div className="text-xs text-primary-600">{employee.assignedRole}</div>
                    </div>
                    <button
                      onClick={() => {
                        const isSelected = inviteForm.selectedMembers.some(m => m.id === employee.id)
                        if (isSelected) {
                          setInviteForm(prev => ({
                            ...prev,
                            selectedMembers: prev.selectedMembers.filter(m => m.id !== employee.id)
                          }))
                        } else {
                          setInviteForm(prev => ({
                            ...prev,
                            selectedMembers: [...prev.selectedMembers, employee]
                          }))
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm ${inviteForm.selectedMembers.some(m => m.id === employee.id)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {inviteForm.selectedMembers.some(m => m.id === employee.id) ? '선택됨' : '선택'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => inviteMembers(showInviteModal)}
                  disabled={inviteForm.selectedMembers.length === 0}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  초대 ({inviteForm.selectedMembers.length}명)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamManagement
