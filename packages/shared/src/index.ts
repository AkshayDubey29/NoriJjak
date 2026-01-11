export type Locale = 'ko-KR' | 'en-US';

export interface User {
  id: string;
  email: string;
  displayName: string;
  locale: Locale;
  createdAt: Date;
}

export const TRANSLATIONS = {
  'ko-KR': {
    app_name: '놀이짝',
    nav: {
      home: '홈',
      explore: '탐색',
      profile: '프로필'
    },
    landing: {
      find_games: '게임 찾기',
      book_venues: '경기장 예약',
      achievements: '업적'
    },
    labels: {
      language: '언어',
      share: '공유하기'
    },
    onboarding: {
      title: '환영합니다!',
      subtitle: '시작하기 전에 몇 가지 정보를 설정해주세요.',
      display_name: '사용자 이름',
      home_area: '활동 지역',
      radius: '선호 반경 (km)',
      select_sports: '관심 종목 선택',
      complete: '설정 완료'
    },
    profile: {
      edit: '프로필 수정',
      bio: '소개',
      save: '저장'
    },
    games: {
      create_title: '새 경기 만들기',
      list_title: '경기 찾기',
      detail_title: '경기 상세',
      title_label: '제목',
      sport_label: '종목',
      capacity_label: '정원',
      time_label: '시간',
      place_label: '장소',
      join_button: '참가하기',
      leave_button: '참가 취소',
      cancel_button: '경기 취소',
      host_label: '개설자',
      participants_label: '참가자',
      status_open: '모집 중',
      status_cancelled: '취소됨',
      status_completed: '종료됨',
      visibility_public: '공개',
      visibility_private: '비공개',
      join_policy_open: '자유 참가',
      join_policy_approval: '승인 후 참가',
      request_pending: '승인 대기 중',
      request_denied: '참가 거절됨',
      invite_title: '초대 코드',
      generate_invite: '초대 코드 생성',
      notifications_title: '알림',
      no_notifications: '알림이 없습니다.',
      notification_game_request: '{{userName}}님이 "{{gameTitle}}" 경기에 참가를 신청했습니다.',
      notification_game_approved: '"{{gameTitle}}" 경기 참가가 승인되었습니다!',
      notification_game_denied: '"{{gameTitle}}" 경기 참가가 거절되었습니다.',
      notification_game_cancelled: '"{{gameTitle}}" 경기가 취소되었습니다.',
      notification_waitlist_promoted: '"{{gameTitle}}" 경기 참가가 확정되었습니다! (대기 순번 승계)'
    },
    venues: {
      list_title: '장소 찾기',
      detail_title: '장소 상세',
      search_placeholder: '장소 이름으로 검색',
      no_venues: '검색 결과가 없습니다.',
      amenities_label: '편의 시설',
      address_label: '주소',
      contact_label: '연락처',
      select_venue: '장소 선택',
      change_venue: '장소 변경',
      open_games: '진행 중인 경기'
    },
    clubs: {
      list_title: '클럽 찾기',
      detail_title: '클럽 상세',
      create_title: '클럽 생성',
      search_placeholder: '클럽 이름으로 검색',
      no_clubs: '검색 결과가 없습니다.',
      members_count: '멤버 {{count}}명',
      join_button: '가입 신청',
      leave_button: '클럽 탈퇴',
      request_pending: '가입 승인 대기 중',
      hosted_games: '클럽 경기',
      about_club: '클럽 소개',
      home_area: '활동 지역',
      sports_label: '종목'
    },
    chat: {
      title: '경기 채팅',
      placeholder: '메시지를 입력하세요...',
      send: '전송',
      load_older: '이전 메시지 불러오기',
      no_messages: '아직 메시지가 없습니다.',
      not_eligible: '채팅에 참여할 수 없습니다 (승인된 참가자만 가능)',
      delete_msg: '삭제',
      report_msg: '신고',
      block_user: '차단'
    },
    safety: {
      report_title: '신고하기',
      report_reason: '신고 사유',
      report_submit: '신고 제출',
      block_confirm: '이 사용자를 차단하시겠습니까?',
      unblock: '차단 해제'
    }
  },
  'en-US': {
    app_name: 'NoriJjak',
    nav: {
      home: 'Home',
      explore: 'Explore',
      profile: 'Profile'
    },
    landing: {
      find_games: 'Find Games',
      book_venues: 'Book Venues',
      achievements: 'Achievements'
    },
    labels: {
      language: 'Language',
      share: 'Share'
    },
    onboarding: {
      title: 'Welcome!',
      subtitle: 'Please set up a few things before you start.',
      display_name: 'Display Name',
      home_area: 'Home Area',
      radius: 'Preferred Radius (km)',
      select_sports: 'Select Sports',
      complete: 'Complete Setup'
    },
    profile: {
      edit: 'Edit Profile',
      bio: 'Bio',
      save: 'Save'
    },
    games: {
      create_title: 'Create New Game',
      list_title: 'Find Games',
      detail_title: 'Game Detail',
      title_label: 'Title',
      sport_label: 'Sport',
      capacity_label: 'Capacity',
      time_label: 'Time',
      place_label: 'Place',
      join_button: 'Join Game',
      leave_button: 'Leave Game',
      cancel_button: 'Cancel Game',
      host_label: 'Host',
      participants_label: 'Participants',
      status_open: 'Open',
      status_cancelled: 'Cancelled',
      status_completed: 'Completed',
      visibility_public: 'Public',
      visibility_private: 'Private',
      join_policy_open: 'Open Join',
      join_policy_approval: 'Host Approval',
      request_pending: 'Awaiting Approval',
      request_denied: 'Request Denied',
      invite_title: 'Invite Code',
      generate_invite: 'Generate Invite',
      notifications_title: 'Notifications',
      no_notifications: 'No notifications.',
      notification_game_request: '{{userName}} requested to join "{{gameTitle}}".',
      notification_game_approved: 'Your request for "{{gameTitle}}" was approved!',
      notification_game_denied: 'Your request for "{{gameTitle}}" was denied.',
      notification_game_cancelled: 'The game "{{gameTitle}}" was cancelled.',
      notification_waitlist_promoted: 'You joined "{{gameTitle}}" from the waitlist!'
    },
    venues: {
      list_title: 'Find Venues',
      detail_title: 'Venue Detail',
      search_placeholder: 'Search by venue name',
      no_venues: 'No venues found.',
      amenities_label: 'Amenities',
      address_label: 'Address',
      contact_label: 'Contact',
      select_venue: 'Select Venue',
      change_venue: 'Change Venue',
      open_games: 'Ongoing Games'
    },
    clubs: {
      list_title: 'Find Clubs',
      detail_title: 'Club Detail',
      create_title: 'Create Club',
      search_placeholder: 'Search by club name',
      no_clubs: 'No clubs found.',
      members_count: '{{count}} Members',
      join_button: 'Join Club',
      leave_button: 'Leave Club',
      request_pending: 'Approval Pending',
      hosted_games: 'Club Games',
      about_club: 'About Club',
      home_area: 'Base Area',
      sports_label: 'Sports'
    },
    chat: {
      title: 'Game Chat',
      placeholder: 'Type a message...',
      send: 'Send',
      load_older: 'Load older messages',
      no_messages: 'No messages yet.',
      not_eligible: 'Not eligible to chat (approved participants only)',
      delete_msg: 'Delete',
      report_msg: 'Report',
      block_user: 'Block'
    },
    safety: {
      report_title: 'Report',
      report_reason: 'Reason',
      report_submit: 'Submit Report',
      block_confirm: 'Block this user?',
      unblock: 'Unblock'
    }
  }
} as const;

export type TranslationKeys = typeof TRANSLATIONS['en-US'];

