const { SUPABASE_URL, SUPABASE_SECRET_KEY, LINE_CHANNEL_ACCESS_TOKEN, LINE_USER_ID } = process.env;
if (SUPABASE_URL !== 'https://fxlbexjouxkbpibxhilc.supabase.co' || !SUPABASE_SECRET_KEY || !LINE_CHANNEL_ACCESS_TOKEN || !LINE_USER_ID) throw new Error('缺少必要的 GitHub Secrets 或 Supabase URL 不正確');
const headers = {apikey: SUPABASE_SECRET_KEY};
if (SUPABASE_SECRET_KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + SUPABASE_SECRET_KEY;
else if (!SUPABASE_SECRET_KEY.startsWith('sb_secret_')) throw new Error('Supabase Secret key 格式不正確');
const db = await fetch(SUPABASE_URL + '/rest/v1/ticket_watches?select=id&limit=1', {headers});
if (!db.ok) throw new Error('Supabase 連線失敗（HTTP '+db.status+'）');
console.log('Supabase 連線成功');
if (!/^U[0-9a-f]{32}$/i.test(LINE_USER_ID)) throw new Error('LINE_USER_ID 格式不正確：請使用 LINE Developers 的 Your user ID，不是 LINE ID 或 Channel ID。');
const line = await fetch('https://api.line.me/v2/bot/message/push',{method:'POST',headers:{Authorization:'Bearer '+LINE_CHANNEL_ACCESS_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({to:LINE_USER_ID,messages:[{type:'text',text:'✅ 票況通知測試成功！這是一則測試訊息，並非有票通知。'}]})});
if(!line.ok) {
  let info={}; try { info=await line.json(); } catch {}
  const fields=Array.isArray(info.details) ? info.details.map(x=>x.property).filter(x=>['to','messages','notificationDisabled'].includes(x)) : [];
  const hint=fields.includes('to') ? '請確認 LINE_USER_ID 是同一個 channel 的 Your user ID' : fields.includes('messages') ? 'LINE 回報訊息內容格式錯誤' : '請確認 LINE Token 和 User ID 屬於同一個 Messaging API channel';
  throw new Error('LINE 推播失敗（HTTP '+line.status+'）：'+hint);
}
console.log('已送出 LINE 測試訊息');
