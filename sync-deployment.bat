@echo off
echo Syncing changes to deployment folder...

REM Sync app folder
xcopy app deployment\app /E /I /Y /Q
echo ✓ App folder synced

REM Sync components folder
xcopy components deployment\components /E /I /Y /Q
echo ✓ Components folder synced

REM Sync lib folder
xcopy lib deployment\lib /E /I /Y /Q
echo ✓ Lib folder synced

REM Sync public folder
xcopy public deployment\public /E /I /Y /Q
echo ✓ Public folder synced

REM Sync configuration files
copy package.json deployment\ /Y
copy next.config.js deployment\ /Y
copy tsconfig.json deployment\ /Y
copy tailwind.config.js deployment\ /Y
copy postcss.config.mjs deployment\ /Y
copy next-env.d.ts deployment\ /Y
copy supabase.types.ts deployment\ /Y
echo ✓ Configuration files synced

echo.
echo ✅ Deployment folder updated successfully!
echo.
pause 