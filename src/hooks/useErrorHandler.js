// 에러 처리를 쉽게 관리할 수 있는 훅
// 초보자 설명: 이 훅은 에러 메시지를 쉽게 표시하고 숨길 수 있게 해줍니다

import { useState, useCallback } from 'react'

const useErrorHandler = () => {
  // 에러 메시지 상태 관리
  const [error, setError] = useState({
    show: false,
    type: 'error', // error, success, warning, info
    title: '',
    message: ''
  })

  // 에러 메시지 숨기기 (먼저 정의)
  const hideError = useCallback(() => {
    console.log('hideError 호출됨')
    setError(prev => ({ ...prev, show: false }))
  }, [])

  // 에러 메시지 표시 함수들
  const showError = useCallback((title, message) => {
    console.log('showError 호출됨:', { title, message })
    setError({
      show: true,
      type: 'error',
      title: title || '오류가 발생했습니다',
      message: message || '알 수 없는 오류가 발생했습니다.'
    })
    
    // 5초 후 자동으로 숨기기
    setTimeout(() => {
      hideError()
    }, 5000)
  }, [hideError])

  const showSuccess = useCallback((title, message) => {
    console.log('showSuccess 호출됨:', { title, message })
    setError({
      show: true,
      type: 'success',
      title: title || '성공!',
      message: message || '작업이 완료되었습니다.'
    })
    
    // 3초 후 자동으로 숨기기
    setTimeout(() => {
      hideError()
    }, 3000)
  }, [hideError])

  const showWarning = useCallback((title, message) => {
    console.log('showWarning 호출됨:', { title, message })
    
    const newError = {
      show: true,
      type: 'warning',
      title: title || '주의!',
      message: message || '주의가 필요한 상황입니다.'
    }
    
    console.log('새로운 error 상태:', newError)
    setError(newError)
    
    // 4초 후 자동으로 숨기기
    setTimeout(() => {
      console.log('자동으로 에러 숨기기')
      hideError()
    }, 4000)
  }, [hideError])

  const showInfo = useCallback((title, message) => {
    setError({
      show: true,
      type: 'info',
      title: title || '알림',
      message: message || '정보를 확인해주세요.'
    })
    
    // 4초 후 자동으로 숨기기
    setTimeout(() => {
      hideError()
    }, 4000)
  }, [hideError])

  // 에러 처리 함수 (try-catch와 함께 사용)
  const handleError = useCallback((error, customMessage) => {
    console.error('Error:', error)
    
    let message = customMessage || '알 수 없는 오류가 발생했습니다.'
    
    // 일반적인 에러 메시지 처리
    if (error?.message) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }
    
    showError('오류 발생', message)
  }, [showError])

  return {
    error,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hideError,
    handleError
  }
}

export default useErrorHandler
