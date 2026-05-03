@echo off
set NEXT_TELEMETRY_DISABLED=1
npm install
npx prisma generate
npm run dev
