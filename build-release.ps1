#!/usr/bin/env pwsh
# Build Nuravya Signed Release AAB for Play Store

$webDir = "D:\Haven-Adv\NuravyaWeb"
$capDir = "D:\NuravyaApp"
$androidDir = "$capDir\android"
$wrapperJar = "$androidDir\gradle\wrapper\gradle-wrapper.jar"

Write-Host "[START] Starting Production Release Build Process..." -ForegroundColor Cyan

# Step 1: Build the Web App (Static Export)
Push-Location $webDir
Write-Host "`n[STEP 1] Building Next.js Web App (Production Export)..." -ForegroundColor Cyan
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
Write-Host "`n[STEP 2] Syncing production assets to Android... ($capDir)" -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Capacitor sync failed. Aborting." -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}

# Step 2.5: Generate Android Icons/Splash
Write-Host "`n[STEP 2.5] Generating Android assets (Icons/Splash)..." -ForegroundColor Cyan
npx capacitor-assets generate --android
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Asset generation failed." -ForegroundColor Yellow
}
Pop-Location

# Step 3: Instruction for Signing
Write-Host "`n[STEP 3] Final Step: Manual Signing" -ForegroundColor Cyan
Write-Host "Because signing requires your private keystore password, please run the following command in your terminal:" -ForegroundColor Yellow
Write-Host "`ncd D:\NuravyaApp"
Write-Host ".\2-build-release-aab.bat"
Write-Host "`nAlternatively, you can build it directly in Android Studio via 'Build > Generate Signed Bundle / APK'." -ForegroundColor Gray

Write-Host "`n[INFO] After running the batch file, your Play Store file will be at:" -ForegroundColor Yellow
Write-Host "D:\NuravyaApp\NuravyaAI-release.aab"
