import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, BookOpen, Award, CheckCircle, AlertCircle } from 'lucide-react';

const AIStudyTracker = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [studyRecords, setStudyRecords] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    hours: 1,
    understanding: 3,
    notes: ''
  });

  const phases = [
    {
      name: 'Phase 1: 코딩 기초',
      duration: '1-90일',
      weeks: [
        { title: 'Week 1-4: 리스트 완전정복', topics: ['1D/2D 리스트', '인덱싱/슬라이싱', '집합/순열/조합'] },
        { title: 'Week 5-8: 딕셔너리 & 반복문', topics: ['딕셔너리 순회', '확률 기초', '데이터 집계'] },
        { title: 'Week 9-13: NumPy & 선형대수', topics: ['NumPy 배열', '벡터/행렬', '이미지 처리'] }
      ]
    },
    {
      name: 'Phase 2: 데이터 분석',
      duration: '91-180일',
      weeks: [
        { title: 'Week 14-18: Pandas & 시각화', topics: ['DataFrame', 'Matplotlib', '통계 기초'] },
        { title: 'Week 19-23: 미적분 & 최적화', topics: ['미분/편미분', '경사하강법', '선형회귀'] },
        { title: 'Week 24-26: 머신러닝 입문', topics: ['Scikit-learn', '분류/회귀', '손실함수'] }
      ]
    },
    {
      name: 'Phase 3: 딥러닝 기초',
      duration: '181-250일',
      weeks: [
        { title: 'Week 27-30: 신경망 기초', topics: ['퍼셉트론', '역전파', 'MNIST'] },
        { title: 'Week 31-34: CNN', topics: ['합성곱', '풀링', '이미지 분류'] },
        { title: 'Week 35-36: 복습 & 정리', topics: ['포트폴리오', '논문 읽기'] }
      ]
    }
  ];

  const tips = [
    "💡 매일 같은 시간에 공부하면 습관이 됩니다",
    "💡 어려운 개념은 손으로 직접 써보세요",
    "💡 코드를 읽기만 하지 말고 직접 타이핑하세요",
    "💡 에러는 최고의 선생님입니다",
    "💡 15분 공부 → 5분 휴식 패턴을 활용하세요",
    "💡 배운 내용을 누군가에게 설명한다고 생각하며 정리하세요",
    "💡 완벽하게 이해하려 하지 말고 일단 앞으로 나아가세요"
  ];

  useEffect(() => {
    calculateStreak();
  }, [studyRecords]);

  const calculateStreak = () => {
    if (studyRecords.length === 0) {
      setStreak(0);
      return;
    }

    const sortedDates = [...new Set(studyRecords.map(r => r.date))].sort().reverse();
    let currentStreak = 0;
    let maxStreakCount = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (sortedDates[i] === expectedDate.toISOString().split('T')[0]) {
        currentStreak++;
      } else {
        break;
      }
    }

    let tempStreak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const date1 = new Date(sortedDates[i]);
      const date2 = new Date(sortedDates[i + 1]);
      const diffDays = (date1 - date2) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        tempStreak++;
        maxStreakCount = Math.max(maxStreakCount, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    setStreak(currentStreak);
    setMaxStreak(Math.max(maxStreakCount, currentStreak));
  };

  const handleSubmit = () => {
    if (!formData.topic.trim()) {
      alert('학습 주제를 입력해주세요');
      return;
    }
    const newRecord = { ...formData, id: Date.now() };
    setStudyRecords([...studyRecords, newRecord]);
    setShowRecordModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      topic: '',
      hours: 1,
      understanding: 3,
      notes: ''
    });
  };

  const getTotalHours = () => {
    return studyRecords.reduce((sum, record) => sum + parseFloat(record.hours), 0);
  };

  const getDaysStudied = () => {
    return new Set(studyRecords.map(r => r.date)).size;
  };

  const getCurrentPhase = () => {
    const days = getDaysStudied();
    if (days <= 90) return 0;
    if (days <= 180) return 1;
    return 2;
  };

  const getReviewItems = () => {
    const today = new Date();
    const reviewIntervals = [3, 7, 14];
    const items = [];

    studyRecords.forEach(record => {
      const recordDate = new Date(record.date);
      const daysDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
      
      reviewIntervals.forEach(interval => {
        if (daysDiff === interval) {
          items.push({ ...record, reviewDay: interval });
        }
      });
    });

    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🎯 250일 AI 학습 트래커</h1>
              <p className="text-gray-600 mt-1">PhD를 향한 여정, 하루하루 기록하세요</p>
            </div>
            <button
              onClick={() => setShowRecordModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              📝 학습 기록하기
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {['dashboard', 'roadmap', 'review'].map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  currentTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab === 'dashboard' && '📊 대시보드'}
                {tab === 'roadmap' && '🗺️ 로드맵'}
                {tab === 'review' && '📝 복습 알림'}
              </button>
            ))}
          </div>
        </div>

        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">학습한 날</p>
                    <p className="text-3xl font-bold text-indigo-600">{getDaysStudied()}</p>
                    <p className="text-gray-500 text-xs mt-1">/ 250일</p>
                  </div>
                  <Calendar className="text-indigo-600" size={40} />
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(getDaysStudied() / 250) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">총 학습 시간</p>
                    <p className="text-3xl font-bold text-green-600">{getTotalHours().toFixed(1)}</p>
                    <p className="text-gray-500 text-xs mt-1">시간</p>
                  </div>
                  <Clock className="text-green-600" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">연속 학습</p>
                    <p className="text-3xl font-bold text-orange-600">{streak}</p>
                    <p className="text-gray-500 text-xs mt-1">일 연속</p>
                  </div>
                  <Award className="text-orange-600" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">최고 기록</p>
                    <p className="text-3xl font-bold text-purple-600">{maxStreak}</p>
                    <p className="text-gray-500 text-xs mt-1">일 연속</p>
                  </div>
                  <TrendingUp className="text-purple-600" size={40} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📍 현재 단계</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-indigo-600">{phases[getCurrentPhase()].name}</p>
                  <p className="text-gray-600 text-sm">{phases[getCurrentPhase()].duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">Phase {getCurrentPhase() + 1}</p>
                  <p className="text-gray-500 text-sm">/ 3</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-xl font-bold mb-2">💡 오늘의 학습 팁</h3>
              <p className="text-lg">{tips[new Date().getDate() % tips.length]}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📚 최근 학습 기록</h3>
              {studyRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">아직 학습 기록이 없습니다. 첫 기록을 남겨보세요!</p>
              ) : (
                <div className="space-y-3">
                  {studyRecords.slice(-5).reverse().map(record => (
                    <div key={record.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{record.topic}</p>
                          <p className="text-sm text-gray-600">{record.date} • {record.hours}시간</p>
                          {record.notes && <p className="text-sm text-gray-500 mt-1">{record.notes}</p>}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < record.understanding ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'roadmap' && (
          <div className="space-y-6">
            {phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{phase.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    getCurrentPhase() === phaseIndex
                      ? 'bg-green-100 text-green-700'
                      : getCurrentPhase() > phaseIndex
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getCurrentPhase() === phaseIndex ? '진행 중' : getCurrentPhase() > phaseIndex ? '완료' : '예정'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{phase.duration}</p>
                <div className="space-y-4">
                  {phase.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="border-l-4 border-gray-300 pl-4">
                      <p className="font-semibold text-gray-800">{week.title}</p>
                      <ul className="mt-2 space-y-1">
                        {week.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle size={16} className="mr-2 text-gray-400" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'review' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📝 복습이 필요한 내용</h3>
            <p className="text-gray-600 mb-6">간격 반복 학습법에 따라 3일, 7일, 14일 후 복습을 권장합니다</p>
            {getReviewItems().length === 0 ? (
              <p className="text-gray-500 text-center py-8">복습할 내용이 없습니다</p>
            ) : (
              <div className="space-y-3">
                {getReviewItems().map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle size={20} className="text-yellow-600" />
                          <span className="font-semibold text-yellow-800">
                            {item.reviewDay}일차 복습
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800">{item.topic}</p>
                        <p className="text-sm text-gray-600">학습일: {item.date}</p>
                        {item.notes && <p className="text-sm text-gray-500 mt-1">{item.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showRecordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 오늘의 학습 기록</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">학습 주제</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="예: 리스트 슬라이싱"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">학습 시간</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="3"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    이해도: {formData.understanding}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.understanding}
                    onChange={(e) => setFormData({...formData, understanding: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>어려움</span>
                    <span>완벽히 이해</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">메모 (선택)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="어려웠던 부분이나 중요한 내용을 기록하세요"
                    className="w-full border rounded-lg px-3 py-2 h-20"
                  />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowRecordModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStudyTracker;