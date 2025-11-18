-- 도시가스 비상대응 모의훈련 플랫폼 데이터베이스 스키마
-- PostgreSQL 기반

-- 1. 회사 관리
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 부서 관리
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

-- 3. 팀 관리
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, name)
);

-- 4. 직원 관리
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    contact VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 사용자 계정 (직원과 연결)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 역할 정의
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    responsibilities JSONB,
    required_skills JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 역할 배정
CREATE TABLE role_assignments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES users(id),
    UNIQUE(user_id, role_id)
);

-- 8. 훈련 시나리오
CREATE TABLE scenarios (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('low', 'medium', 'high')),
    estimated_duration INTEGER, -- 분 단위
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 시나리오 단계
CREATE TABLE scenario_steps (
    id SERIAL PRIMARY KEY,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    stage VARCHAR(50), -- 'I', 'II', 'III'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    step_type VARCHAR(20) CHECK (step_type IN ('descriptive', 'multiple_choice')),
    time_limit INTEGER, -- 초 단위
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scenario_id, step_order)
);

-- 10. 시나리오 액션 (선택지)
CREATE TABLE scenario_actions (
    id SERIAL PRIMARY KEY,
    step_id INTEGER NOT NULL REFERENCES scenario_steps(id) ON DELETE CASCADE,
    action_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    points INTEGER DEFAULT 0,
    action_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. 훈련 세션
CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    total_score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. 훈련 응답
CREATE TABLE training_responses (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    step_id INTEGER NOT NULL REFERENCES scenario_steps(id) ON DELETE CASCADE,
    user_response TEXT,
    selected_action_id INTEGER REFERENCES scenario_actions(id),
    score INTEGER DEFAULT 0,
    response_time INTEGER, -- 초 단위
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. 팀 관리
CREATE TABLE teams_training (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. 팀 멤버
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams_training(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_team VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- 인덱스 생성
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_role_assignments_user_id ON role_assignments(user_id);
CREATE INDEX idx_scenario_steps_scenario_id ON scenario_steps(scenario_id);
CREATE INDEX idx_scenario_actions_step_id ON scenario_actions(step_id);
CREATE INDEX idx_training_sessions_user_id ON training_sessions(user_id);
CREATE INDEX idx_training_responses_session_id ON training_responses(session_id);
CREATE INDEX idx_training_responses_step_id ON training_responses(step_id);

-- 초기 데이터 삽입
INSERT INTO companies (name) VALUES 
('SK E&S'),
('코원에너지서비스'),
('충청에너지서비스'),
('부산도시가스'),
('영남에너지서비스(구미)'),
('영남에너지서비스(포항)'),
('전북에너지서비스'),
('전남도시가스'),
('강원도시가스');

INSERT INTO roles (name, description, responsibilities, required_skills) VALUES 
('관제운영반장', '비상상황 총괄 지휘', '["비상상황 총괄 지휘", "유관기관 협조", "상위 보고"]', '["상황 판단", "지시 전파", "의사결정"]'),
('현장출동반', '현장 안전 확보 및 초기 대응', '["현장 안전 확보", "초기 대응", "상황 보고"]', '["현장 진단", "안전 조치", "차단 작업"]'),
('안전관리반', '안전 관리 및 점검', '["안전 관리", "점검", "보고"]', '["안전 점검", "위험 평가", "보고서 작성"]'),
('고객서비스반', '고객 응대 및 안내', '["고객 응대", "안내", "상담"]', '["고객 응대", "커뮤니케이션", "상황 안내"]'),
('기술반', '기술적 문제 해결', '["기술적 문제 해결", "장비 점검", "복구 작업"]', '["기술 진단", "장비 조작", "복구 기술"]'),
('홍보반', '홍보 및 대외 소통', '["홍보", "대외 소통", "보도자료 작성"]', '["홍보 기획", "커뮤니케이션", "문서 작성"]');

-- 시퀀스 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenario_steps_updated_at BEFORE UPDATE ON scenario_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenario_actions_updated_at BEFORE UPDATE ON scenario_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_responses_updated_at BEFORE UPDATE ON training_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_training_updated_at BEFORE UPDATE ON teams_training FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
