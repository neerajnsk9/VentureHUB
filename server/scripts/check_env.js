require('dotenv').config();
const vars=['DATABASE_URL','DIRECT_URL','CLERK_PUBLISHABLE_KEY','CLERK_SECRET_KEY','IMAGEKIT_PUBLIC_KEY','IMAGEKIT_PRIVATE_KEY','IMAGEKIT_URL_ENDPOINT','INNGEST_EVENT_KEY','INNGEST_SIGNING_KEY','INNGEST_DEV','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','SENDER_EMAIL','ADMIN_EMAILS','FRONTEND_URL'];
const mask=(s)=>{if(!s) return ''; if(s.length<10) return '*****'; return s.slice(0,6)+'...'+s.slice(-4)};
console.log('Server env check:');
vars.forEach(v=>{
  const val=process.env[v];
  const ok= !!val;
  let info='';
  if(ok){ if(/KEY|SECRET|TOKEN|PASSWORD|PASS/i.test(v)) info=mask(val); else info=val }
  console.log(v.padEnd(22), ok? 'PRESENT':'MISSING ', info);
});
