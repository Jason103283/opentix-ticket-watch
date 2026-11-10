export function validCartUrl(url) { return /^https:\/\/www\.opentix\.life\/cart\/\d+\/\d+$/.test(url); }
export function decideObservation(snapshot) {
  if (!snapshot || !Number.isInteger(snapshot.total) || snapshot.total < 1 || snapshot.total !== snapshot.expected || !Number.isInteger(snapshot.enabled) || snapshot.enabled < 0 || snapshot.enabled > snapshot.total) throw new Error('座位資料不完整，無法判定');
  return snapshot.enabled > 0 ? 'available' : 'unavailable';
}
export function shouldNotify(previous, now) {
  if (previous.status !== 'available') return true;
  if (!previous.last_notified_at) return true;
  return now - new Date(previous.last_notified_at).getTime() >= 30 * 60 * 1000;
}
