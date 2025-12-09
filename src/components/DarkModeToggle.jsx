import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className="flex items-center gap-2">
      {/* 다크모드 레이블 (작은 화면에서는 숨김) */}
      <span className="hidden sm:block text-xs font-medium text-gray-600 dark:text-gray-400">
        DARKMODE
      </span>
      
      {/* 토글 스위치 */}
      <button
        onClick={toggleDarkMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-300 border-gray-400'
        }`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* 토글 핸들 */}
        <span
          className={`inline-block h-4 w-4 transform rounded-full transition-all duration-300 ease-in-out ${
            isDarkMode 
              ? 'translate-x-6 bg-gray-200' 
              : 'translate-x-1 bg-white'
          }`}
        >
          {/* 아이콘 */}
          <span className="flex items-center justify-center h-full w-full">
            {isDarkMode ? (
              <Moon className="h-2.5 w-2.5 text-gray-700" />
            ) : (
              <Sun className="h-2.5 w-2.5 text-yellow-500" />
            )}
          </span>
        </span>
      </button>

      {/* 현재 모드 표시 (작은 화면용) */}
      <div className="flex sm:hidden items-center">
        {isDarkMode ? (
          <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </div>
    </div>
  )
}

export default DarkModeToggle
