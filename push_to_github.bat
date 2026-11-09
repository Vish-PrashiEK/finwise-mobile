@echo off
title Push FinWise to GitHub
cls
echo ===================================================
echo     FinWise Mobile - 1-Click Push to GitHub
echo ===================================================
echo.
echo Pehle https://github.com/new par jakar ek new repo banayein.
echo Us repo ka link yahan paste karein.
echo.
set /p REPO_URL="GitHub Repository URL daalein: "

if "%REPO_URL%"=="" (
    echo [ERROR] Koi URL nahi diya gaya! Script band ho rahi hai.
    pause
    exit /b
)

echo.
echo Git remote set kiya ja raha hai...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main
echo.
echo GitHub par code upload (push) ho raha hai...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo [SUCCESS] Code safaltapoorvak GitHub par chala gaya!
    echo ===================================================
    echo.
    echo Ab GitHub repo me jakar:
    echo 1. Settings me jayein
    echo 2. Pages me jakar Branch "main" chunein
    echo 3. Aapka mobile app 1 minute me online live ho jayega!
) else (
    echo.
    echo [ERROR] Code push karte samay dikkat aayi. Kripya URL aur internet connection check karein.
)

echo.
pause

