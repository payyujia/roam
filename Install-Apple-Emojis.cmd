@echo off
setlocal
echo ROAM local emoji importer
echo This tool only imports images already saved to your PC.
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\install-apple-emojis.ps1" %*
echo.
pause
