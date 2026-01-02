$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot"
$env:ANDROID_HOME = "C:\Users\milan\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:PATH"

Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "Testing Java..."
& java -version

Write-Host ""
Write-Host "Installing SDK 35..."
Set-Location "$env:ANDROID_HOME\cmdline-tools\latest\bin"
& .\sdkmanager.bat "platforms;android-35" "build-tools;35.0.0"

Write-Host ""
Write-Host "Building APK..."
Set-Location "C:\Users\milan\Downloads\LEDOVAC_DESIGN\android"
if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
if (Test-Path "app\build") { Remove-Item -Recurse -Force "app\build" }
if (Test-Path "capacitor-android\build") { Remove-Item -Recurse -Force "capacitor-android\build" }

& .\gradlew.bat assembleDebug

Write-Host ""
Write-Host "APK location:"
Get-ChildItem -Path "app\build\outputs\apk\debug\*.apk" -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName }
Write-Host ""
Write-Host "Done!"
