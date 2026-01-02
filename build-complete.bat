@echo off
setlocal

echo Setting environment variables...
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set ANDROID_HOME=C:\Users\milan\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo JAVA_HOME=%JAVA_HOME%
echo ANDROID_HOME=%ANDROID_HOME%

echo.
echo Installing SDK components...
cd /d "%ANDROID_HOME%\cmdline-tools\latest\bin"
echo y | sdkmanager.bat --licenses >nul 2>&1
sdkmanager.bat "platforms;android-34" "build-tools;34.0.0" "platform-tools"

echo.
echo Building APK...
cd /d C:\Users\milan\Downloads\LEDOVAC_DESIGN\android
call gradlew.bat assembleDebug

echo.
echo APK location:
dir /b /s app\build\outputs\apk\debug\*.apk 2>nul

echo.
echo Done!
pause
