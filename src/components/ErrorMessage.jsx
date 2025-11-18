// 사용자 친화적인 에러 메시지 컴포넌트
// 초보자 설명: 이 컴포넌트는 오류가 발생했을 때 사용자에게 예쁘게 보여주는 역할을 합니다

import React from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

const ErrorMessage = ({ 
  type = 'error', // error, success, warning, info
  title = '', 
  message = '', 
  onClose = null,
  show = false 
}) => {
  // 디버깅 로그
  console.log('ErrorMessage 렌더링:', { type, title, message, show })
  
  // 에러 메시지가 보이지 않으면 아무것도 렌더링하지 않음
  if (!show) {
    console.log('ErrorMessage: show가 false이므로 렌더링하지 않음')
    return null
  }
  
  console.log('ErrorMessage: 실제로 렌더링 중')
  
  // 타입별 스타일 설정
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#dcfce7',
          borderColor: '#16a34a',
          iconColor: '#166534',
          titleColor: '#166534',
          messageColor: '#15803d',
          icon: '✅'
        }
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          iconColor: '#92400e',
          titleColor: '#92400e',
          messageColor: '#a16207',
          icon: '⚠️'
        }
      case 'info':
        return {
          backgroundColor: '#dbeafe',
          borderColor: '#3b82f6',
          iconColor: '#1e40af',
          titleColor: '#1e40af',
          messageColor: '#1d4ed8',
          icon: 'ℹ️'
        }
      default: // error
        return {
          backgroundColor: '#fee2e2',
          borderColor: '#ef4444',
          iconColor: '#dc2626',
          titleColor: '#dc2626',
          messageColor: '#b91c1c',
          icon: '❌'
        }
    }
  }

  const styles = getStyles()

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      backgroundColor: styles.backgroundColor,
      border: `2px solid ${styles.borderColor}`,
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '24px' }}>{styles.icon}</div>
        <div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: styles.titleColor,
            margin: '0 0 8px 0'
          }}>
            {title}
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: styles.messageColor,
            margin: '0'
          }}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: styles.iconColor
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage