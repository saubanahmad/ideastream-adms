@echo off
REM SocialConnect Web - Quick Setup Script for Windows

echo =========================================
echo    SocialConnect Web Setup (Windows)
echo =========================================
echo.

REM Step 1: Download cpp-httplib
echo Step 1: Download cpp-httplib header
echo ---------------------------------------
echo Please download httplib.h from:
echo https://github.com/yhirose/cpp-httplib/releases
echo.
echo Or use this direct link:
echo https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
echo.
echo Place httplib.h in this directory:
echo %CD%
echo.
pause

REM Step 2: Check if file exists
if not exist "httplib.h" (
    echo ERROR: httplib.h not found in current directory!
    echo Please download it and try again.
    pause
    exit /b 1
)

echo ✓ httplib.h found!
echo.

REM Step 3: Compile
echo Step 2: Compiling SocialConnectWeb.cpp
echo ---------------------------------------

where g++ >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using g++ compiler...
    g++ -o SocialConnectWeb.exe SocialConnectWeb.cpp -std=c++11 -lws2_32
    
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Compilation successful!
    ) else (
        echo ✗ Compilation failed. Check errors above.
        pause
        exit /b 1
    )
) else (
    echo ERROR: g++ compiler not found!
    echo Please install MinGW-w64 and add it to PATH
    echo Download from: https://winlibs.com/
    pause
    exit /b 1
)

echo.

REM Step 4: Run server
echo Step 3: Starting server
echo ---------------------------------------
echo Server will start on http://localhost:8080
echo.
echo Open your browser and go to:
echo   → http://localhost:8080/login_new.html
echo.
echo Press Ctrl+C to stop the server
echo.
echo =========================================
echo.

SocialConnectWeb.exe
pause
