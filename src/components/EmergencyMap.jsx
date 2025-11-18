import React, { useState, useEffect, useRef } from 'react'
import { MapPin, AlertTriangle, Settings, Eye, EyeOff } from 'lucide-react'

const EmergencyMap = ({ scenario, currentStep, userActions = [] }) => {
  const [mapData, setMapData] = useState(null)
  const [affectedValves, setAffectedValves] = useState(new Set())
  const [showValveInfo, setShowValveInfo] = useState(true)
  const [selectedValve, setSelectedValve] = useState(null)
  const canvasRef = useRef(null)

  // 가스 배관 네트워크 데이터 (실제 상황을 모델링)
  const gasNetworkData = {
    1: { // 도시가스 중압배관 파손 시나리오
      accidentLocation: { x: 400, y: 300, name: 'OO동 OOO아파트 인근' },
      mainValves: [
        { id: 'MV001', x: 300, y: 250, name: '메인차단밸브 MV001', type: 'main', status: 'normal', pressure: '7bar' },
        { id: 'MV002', x: 450, y: 200, name: '분기밸브 MV002', type: 'branch', status: 'normal', pressure: '4bar' },
        { id: 'MV003', x: 350, y: 350, name: '분기밸브 MV003', type: 'branch', status: 'normal', pressure: '4bar' },
        { id: 'MV004', x: 500, y: 350, name: '분기밸브 MV004', type: 'branch', status: 'normal', pressure: '4bar' },
        { id: 'MV005', x: 250, y: 300, name: '공급밸브 MV005', type: 'supply', status: 'normal', pressure: '2bar' },
        { id: 'MV006', x: 400, y: 150, name: '공급밸브 MV006', type: 'supply', status: 'normal', pressure: '2bar' },
        { id: 'MV007', x: 550, y: 300, name: '공급밸브 MV007', type: 'supply', status: 'normal', pressure: '2bar' },
        { id: 'MV008', x: 350, y: 400, name: '공급밸브 MV008', type: 'supply', status: 'normal', pressure: '2bar' }
      ],
      pipelines: [
        { from: 'MV001', to: 'MV002', type: 'main', diameter: '300mm' },
        { from: 'MV001', to: 'MV003', type: 'main', diameter: '300mm' },
        { from: 'MV002', to: 'MV004', type: 'branch', diameter: '200mm' },
        { from: 'MV002', to: 'MV006', type: 'supply', diameter: '150mm' },
        { from: 'MV003', to: 'MV005', type: 'supply', diameter: '150mm' },
        { from: 'MV003', to: 'MV008', type: 'supply', diameter: '150mm' },
        { from: 'MV004', to: 'MV007', type: 'supply', diameter: '150mm' }
      ],
      buildings: [
        { x: 200, y: 280, width: 60, height: 40, name: 'A아파트', residents: 120, type: 'residential' },
        { x: 380, y: 280, width: 80, height: 60, name: 'OOO아파트', residents: 300, type: 'residential', isAccidentSite: true },
        { x: 480, y: 180, width: 50, height: 30, name: 'B상가', residents: 0, workers: 50, type: 'commercial' },
        { x: 320, y: 380, width: 40, height: 30, name: 'C학교', students: 200, type: 'school' },
        { x: 520, y: 320, width: 60, height: 40, name: 'D아파트', residents: 180, type: 'residential' },
        { x: 250, y: 350, name: '지하주차장', type: 'parking', isUnderground: true }
      ],
      riskAreas: [
        { x: 400, y: 300, radius: 50, level: 'critical', description: '폭발 위험 구역' },
        { x: 400, y: 300, radius: 100, level: 'warning', description: '대피 권고 구역' },
        { x: 400, y: 300, radius: 150, level: 'caution', description: '주의 구역' }
      ]
    }
  }

  // 밸브 차단 시 영향 범위 계산
  const calculateAffectedArea = (closedValveId) => {
    const network = gasNetworkData[scenario?.id]
    if (!network) return new Set()

    const affected = new Set()
    const valveMap = new Map(network.mainValves.map(v => [v.id, v]))
    
    // 메인 차단밸브가 닫히면 모든 하위 밸브 영향
    if (closedValveId === 'MV001') {
      network.mainValves.forEach(valve => {
        if (valve.id !== 'MV001') {
          affected.add(valve.id)
        }
      })
    } else {
      // 분기/공급 밸브 차단 시 해당 라인만 영향
      const affectedPipes = network.pipelines.filter(
        pipe => pipe.from === closedValveId || pipe.to === closedValveId
      )
      
      affectedPipes.forEach(pipe => {
        if (pipe.from !== closedValveId) affected.add(pipe.from)
        if (pipe.to !== closedValveId) affected.add(pipe.to)
      })
    }

    return affected
  }

  // 사용자 행동에 따른 지도 상태 업데이트
  useEffect(() => {
    if (!scenario) return

    setMapData(gasNetworkData[scenario.id])
    
    // 사용자가 수행한 차단 작업 확인
    const shutdownActions = userActions.filter(action => 
      action.action.includes('차단') || 
      action.action.includes('밸브') ||
      action.action.includes('메인 차단') ||
      action.action.includes('가스 공급 차단')
    )

    if (shutdownActions.length > 0) {
      // 메인 차단밸브 차단 시뮬레이션
      const affected = calculateAffectedArea('MV001')
      setAffectedValves(affected)
    } else {
      setAffectedValves(new Set())
    }
  }, [scenario, userActions])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas || !mapData) return

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    // 배경 초기화
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // 격자 그리기
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 0.5
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 배관 라인 그리기
    mapData.pipelines.forEach(pipeline => {
      const fromValve = mapData.mainValves.find(v => v.id === pipeline.from)
      const toValve = mapData.mainValves.find(v => v.id === pipeline.to)
      
      if (fromValve && toValve) {
        ctx.beginPath()
        ctx.moveTo(fromValve.x, fromValve.y)
        ctx.lineTo(toValve.x, toValve.y)
        
        // 배관 타입별 스타일
        if (pipeline.type === 'main') {
          ctx.strokeStyle = '#374151'
          ctx.lineWidth = 8
        } else if (pipeline.type === 'branch') {
          ctx.strokeStyle = '#6b7280'
          ctx.lineWidth = 6
        } else {
          ctx.strokeStyle = '#9ca3af'
          ctx.lineWidth = 4
        }
        
        ctx.stroke()

        // 배관 규격 표시
        const midX = (fromValve.x + toValve.x) / 2
        const midY = (fromValve.y + toValve.y) / 2
        ctx.fillStyle = '#374151'
        ctx.font = '10px Arial'
        ctx.fillText(pipeline.diameter, midX + 5, midY - 5)
      }
    })

    // 위험 구역 그리기
    if (mapData.riskAreas) {
      mapData.riskAreas.forEach(area => {
        ctx.beginPath()
        ctx.arc(area.x, area.y, area.radius, 0, 2 * Math.PI)
        
        if (area.level === 'critical') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'
          ctx.strokeStyle = '#dc2626'
        } else if (area.level === 'warning') {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)'
          ctx.strokeStyle = '#d97706'
        } else {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
          ctx.strokeStyle = '#2563eb'
        }
        
        ctx.fill()
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
      })
    }

    // 건물 그리기
    mapData.buildings.forEach(building => {
      if (building.width && building.height) {
        // 건물 박스
        ctx.fillStyle = building.isAccidentSite ? '#fef2f2' : building.type === 'school' ? '#eff6ff' : '#f9fafb'
        ctx.fillRect(building.x, building.y, building.width, building.height)
        
        ctx.strokeStyle = building.isAccidentSite ? '#dc2626' : '#d1d5db'
        ctx.lineWidth = building.isAccidentSite ? 3 : 1
        ctx.strokeRect(building.x, building.y, building.width, building.height)
        
        // 건물명
        ctx.fillStyle = building.isAccidentSite ? '#dc2626' : '#374151'
        ctx.font = 'bold 11px Arial'
        ctx.fillText(building.name, building.x + 2, building.y + building.height + 15)
        
        // 인원 정보
        const people = building.residents || building.workers || building.students || 0
        if (people > 0) {
          ctx.font = '9px Arial'
          ctx.fillStyle = '#6b7280'
          ctx.fillText(`${people}명`, building.x + 2, building.y + building.height + 27)
        }
      } else {
        // 특수 시설 (지하주차장 등)
        ctx.fillStyle = building.isUnderground ? '#1f2937' : '#6b7280'
        ctx.beginPath()
        ctx.arc(building.x, building.y, 8, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.fillStyle = building.isUnderground ? '#1f2937' : '#374151'
        ctx.font = '10px Arial'
        ctx.fillText(building.name, building.x + 12, building.y + 3)
      }
    })

    // 밸브 그리기
    mapData.mainValves.forEach(valve => {
      const isAffected = affectedValves.has(valve.id)
      const isSelected = selectedValve?.id === valve.id
      
      // 밸브 상태별 색상
      let fillColor, strokeColor
      if (valve.id === 'MV001' && userActions.some(a => a.action.includes('차단'))) {
        // 차단된 메인 밸브
        fillColor = '#dc2626'
        strokeColor = '#991b1b'
      } else if (isAffected) {
        // 영향받는 밸브
        fillColor = '#1f2937'
        strokeColor = '#111827'
      } else {
        // 정상 밸브
        fillColor = '#6b7280'
        strokeColor = '#4b5563'
      }

      // 밸브 원형
      ctx.beginPath()
      ctx.arc(valve.x, valve.y, valve.type === 'main' ? 12 : 8, 0, 2 * Math.PI)
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2
      ctx.stroke()

      // 선택된 밸브 하이라이트
      if (isSelected) {
        ctx.beginPath()
        ctx.arc(valve.x, valve.y, valve.type === 'main' ? 18 : 14, 0, 2 * Math.PI)
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.setLineDash([3, 3])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // 밸브 ID
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(valve.id.slice(-3), valve.x, valve.y + 2)
      ctx.textAlign = 'left'

      // 밸브명 (옵션)
      if (showValveInfo) {
        ctx.fillStyle = '#374151'
        ctx.font = '9px Arial'
        ctx.fillText(valve.name, valve.x + 15, valve.y - 5)
        ctx.font = '8px Arial'
        ctx.fillStyle = '#6b7280'
        ctx.fillText(valve.pressure, valve.x + 15, valve.y + 8)
      }
    })

    // 사고 지점 마킹
    if (mapData.accidentLocation) {
      const { x, y } = mapData.accidentLocation
      
      // 사고 지점 원
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
      ctx.fill()
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 3
      ctx.stroke()

      // 경고 아이콘 (삼각형)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(x, y - 8)
      ctx.lineTo(x - 7, y + 6)
      ctx.lineTo(x + 7, y + 6)
      ctx.closePath()
      ctx.fill()
      
      ctx.fillStyle = '#dc2626'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('!', x, y + 3)
      ctx.textAlign = 'left'

      // 사고 지점 라벨
      ctx.fillStyle = '#dc2626'
      ctx.font = 'bold 12px Arial'
      ctx.fillText('사고 지점', x + 25, y - 10)
      ctx.font = '10px Arial'
      ctx.fillText(mapData.accidentLocation.name, x + 25, y + 5)
    }
  }

  // 밸브 클릭 핸들러
  const handleCanvasClick = (event) => {
    if (!mapData) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // 클릭된 밸브 찾기
    const clickedValve = mapData.mainValves.find(valve => {
      const distance = Math.sqrt((x - valve.x) ** 2 + (y - valve.y) ** 2)
      return distance <= (valve.type === 'main' ? 12 : 8)
    })

    setSelectedValve(clickedValve)
  }

  useEffect(() => {
    drawMap()
  }, [mapData, affectedValves, selectedValve, showValveInfo, userActions])

  if (!mapData) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">지도 데이터를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 지도 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary-600" />
            <div>
              <h3 className="font-medium text-gray-900">실시간 상황 지도</h3>
              <p className="text-sm text-gray-600">
                사고 지점 및 가스 공급 네트워크 현황
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowValveInfo(!showValveInfo)}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                showValveInfo 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {showValveInfo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              밸브 정보
            </button>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>사고 지점</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span>차단된 밸브</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
            <span>영향받는 밸브</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span>정상 밸브</span>
          </div>
        </div>
      </div>

      {/* 지도 캔버스 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full cursor-pointer"
          onClick={handleCanvasClick}
        />
        
        {/* 선택된 밸브 정보 */}
        {selectedValve && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-48">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{selectedValve.name}</h4>
              <button 
                onClick={() => setSelectedValve(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div>ID: {selectedValve.id}</div>
              <div>타입: {selectedValve.type === 'main' ? '메인' : selectedValve.type === 'branch' ? '분기' : '공급'}</div>
              <div>압력: {selectedValve.pressure}</div>
              <div className="flex items-center gap-2">
                상태: 
                <span className={`inline-block w-2 h-2 rounded-full ${
                  selectedValve.id === 'MV001' && userActions.some(a => a.action.includes('차단'))
                    ? 'bg-red-500'
                    : affectedValves.has(selectedValve.id)
                    ? 'bg-gray-800'
                    : 'bg-gray-500'
                }`}></span>
                {selectedValve.id === 'MV001' && userActions.some(a => a.action.includes('차단'))
                  ? '차단됨'
                  : affectedValves.has(selectedValve.id)
                  ? '공급중단'
                  : '정상'
                }
              </div>
            </div>
          </div>
        )}

        {/* 영향 범위 안내 */}
        {affectedValves.size > 0 && (
          <div className="absolute bottom-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">가스 공급 중단 영향</span>
            </div>
            <p className="text-sm text-yellow-700">
              {affectedValves.size}개 밸브 영향 • 약 {Math.floor(affectedValves.size * 150)}세대 공급 중단
            </p>
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="p-4 bg-gray-50 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <span>💡 밸브를 클릭하면 상세 정보를 볼 수 있습니다</span>
          <span>마지막 업데이트: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}

export default EmergencyMap
