// 로컬 스토리지를 쉽게 사용할 수 있는 도구(훅)
// 초보자 설명: 이 파일은 브라우저에 데이터를 저장하고 불러오는 기능을 제공합니다

import { useState, useEffect } from 'react'

// useLocalStorage 훅 정의
// 매개변수: key(저장할 이름), initialValue(처음 값)
const useLocalStorage = (key, initialValue) => {
  // 1. 저장된 값이 있는지 확인하고, 없으면 초기값 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 브라우저에서 저장된 데이터 가져오기
      const item = window.localStorage.getItem(key)
      
      // 데이터가 없거나 "undefined" 문자열인 경우 초기값 사용
      if (!item || item === 'undefined' || item === 'null') {
        return initialValue
      }
      
      // 데이터가 있으면 JSON으로 변환해서 사용
      return JSON.parse(item)
    } catch (error) {
      // 오류 발생 시 초기값 사용
      console.error('로컬 스토리지 읽기 오류:', error)
      return initialValue
    }
  })

  // 2. 값을 설정하는 함수
  const setValue = (value) => {
    try {
      // 상태 업데이트
      setStoredValue(value)
      // 브라우저에 저장 (JSON 문자열로 변환)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // 오류 발생 시 콘솔에 출력
      console.error('로컬 스토리지 저장 오류:', error)
    }
  }
  
  // 3. localStorage 정리 함수
  const clearValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error('로컬 스토리지 삭제 오류:', error)
    }
  }
  
  // 4. 저장된 값과 설정 함수 반환
  return [storedValue, setValue, clearValue]
}

export default useLocalStorage
