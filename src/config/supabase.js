import { createClient } from '@supabase/supabase-js'

// Supabase 환경변수
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.')
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 미설정')
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ 설정됨' : '❌ 미설정')
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// 연결 테스트 함수
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Supabase 연결 테스트 시작...')
    
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase
      .from('users')  // 테스트용 테이블 (없어도 됨)
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') { // 테이블이 없는 경우는 정상
      throw error
    }
    
    console.log('✅ Supabase 연결 성공!')
    return true
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error)
    return false
  }
}

// 사용자 관련 함수들
export const userService = {
  // 사용자 생성
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('사용자 생성 실패:', error)
      return { success: false, error: error.message }
    }
  },

  // 사용자 조회
  async getUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('사용자 조회 실패:', error)
      return { success: false, error: error.message }
    }
  }
}

// 훈련 세션 관련 함수들
export const trainingService = {
  // 훈련 세션 저장
  async saveTrainingSession(sessionData) {
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .insert([sessionData])
        .select()
      
      if (error) throw error
      console.log('✅ 훈련 세션 저장 성공:', data[0])
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('❌ 훈련 세션 저장 실패:', error)
      return { success: false, error: error.message }
    }
  },

  // 사용자별 훈련 기록 조회
  async getUserTrainingSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('훈련 기록 조회 실패:', error)
      return { success: false, error: error.message }
    }
  }
}

console.log('📦 Supabase 클라이언트 초기화 완료')


