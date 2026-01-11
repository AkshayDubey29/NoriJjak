'use client';

import { useState } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';

interface RatingFormProps {
  gameId?: string;
  targetUserId?: string;
  targetVenueId?: string;
  targetClubId?: string;
  targetName: string;
  onSuccess?: () => void;
}

export default function RatingForm({ gameId, targetUserId, targetVenueId, targetClubId, targetName, onSuccess }: RatingFormProps) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS['ko-KR'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ gameId, targetUserId, targetVenueId, targetClubId, score, comment })
      });
      if (res.ok) {
        alert('평가가 등록되었습니다.');
        onSuccess?.();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
      <h4 className="font-bold">{targetName} {t.chat.report_msg}</h4>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => setScore(num)}
            className={`w-10 h-10 rounded-full border font-bold ${score === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400'}`}
          >
            {num}
          </button>
        ))}
      </div>
      <textarea
        className="w-full border rounded-lg p-2 text-sm"
        placeholder="평가 내용을 입력하세요 (선택 사항)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={300}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-300"
      >
        {loading ? '제출 중...' : '평가 제출'}
      </button>
    </form>
  );
}

