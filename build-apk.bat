@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
cd /d C:\Users\milan\Downloads\LEDOVAC_DESIGN\android
call gradlew.bat assembleDebug
echo.
echo APK subor je v: android\app\build\outputs\apk\debug\app-debug.apk
pause
