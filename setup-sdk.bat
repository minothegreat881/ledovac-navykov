@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\milan\Android\Sdk
set PATH=%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo Accepting licenses...
echo y | call sdkmanager.bat --licenses

echo Installing Android platform and build tools...
call sdkmanager.bat "platforms;android-34" "build-tools;34.0.0" "platform-tools"

echo Done!
