export const colors = {
  ink: '#1d1d1f',
  muted: '#6b6b72',
  line: '#e4e4e8',
  bg: '#f5f5f7',
  card: '#ffffff',
  accent: '#d62828',
  ok: '#2e7d4f',
  warn: '#b7791f',
};

export const formatVND = (n) => (n || 0).toLocaleString('vi-VN') + 'đ';

export const STATUS_LABEL = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  delivering: 'Đang giao',
  done: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const STATUS_COLOR = {
  pending: '#b7791f',
  confirmed: '#2b6cb0',
  delivering: '#6b46c1',
  done: '#2e7d4f',
  cancelled: '#d62828',
};
