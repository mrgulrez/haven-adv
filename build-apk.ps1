#!/usr/bin/env pwsh
# Build Nuravya Android APK: Web Build -> Sync -> Gradle

$webDir = "D:\Haven-Adv\NuravyaWeb"
$capDir = "D:\NuravyaApp"
$androidDir = "$capDir\android"
$wrapperJar = "$androidDir\gradle\wrapper\gradle-wrapper.jar"

Write-Host "[START] Starting Full Android Build Process..." -ForegroundColor Cyan

# Step 1: Build the Web App (Static Export)
Push-Location $webDir
Write-Host "`n[STEP 1] Building Next.js Web App..." -ForegroundColor Cyan
$env:CAPACITOR_BUILD = "true"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Web build failed. Aborting." -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location

# Step 2: Sync to Capacitor
Push-Location $capDir
Write-Host "`n[STEP 2] Syncing web assets to Android... ($capDir)" -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Capacitor sync failed. Aborting." -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}
Pop-Location

# Step 3: Build the APK
Write-Host "`n[STEP 3] Compiling APK with Gradle... ($androidDir)" -ForegroundColor Cyan
Push-Location $androidDir
try {
    # Specify the Android Studio JBR path to avoid incompatibility with system JDK 24
    $javaPath = "C:\Program Files\Android\Android Studio\jbr\bin\java.exe"
    if (-not (Test-Path $javaPath)) {
        $javaPath = "java" # Fallback to system java if Android Studio isn't in default path
    }

    $javaArgs = @(
        "-Xmx2048m",
        "-Dorg.gradle.appname=gradlew",
        "-Dgradle.user.home=$HOME/.gradle",
        "-classpath", $wrapperJar,
        "org.gradle.wrapper.GradleWrapperMain",
        "assembleDebug"
    )
    & $javaPath $javaArgs

    if ($LASTEXITCODE -eq 0) {
        $apkPath = Join-Path $androidDir "app\build\outputs\apk\debug\app-debug.apk"
        Write-Host "`n[SUCCESS] APK built successfully!" -ForegroundColor Green
        
        # Copy APK to specified locations
        Copy-Item $apkPath "$capDir\NuravyaAI-debug.apk" -Force
        Copy-Item $apkPath "C:\Users\gulre\OneDrive\my documents\App\NuravyaAI-debug.apk" -Force
        
        Write-Host "`n[INFO] APK saved to:" -ForegroundColor Yellow
        Write-Host "1. $capDir\NuravyaAI-debug.apk"
        Write-Host "2. C:\Users\gulre\OneDrive\my documents\App\NuravyaAI-debug.apk"
    } else {
        Write-Host "`n[ERROR] Gradle build failed." -ForegroundColor Red
    }
} finally {
    Pop-Location
    # Clean up the environment variable
    Remove-Item Env:\CAPACITOR_BUILD -ErrorAction SilentlyContinue
}
