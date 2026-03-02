#!/usr/bin/env pwsh
# Build Nuravya Android APK using direct Java invocation of gradle-wrapper.jar

$androidDir = "D:\NuravyaApp\android"
$wrapperJar = "$androidDir\gradle\wrapper\gradle-wrapper.jar"
$wrapperProps = "$androidDir\gradle\wrapper\gradle-wrapper.properties"

Write-Host "Building Nuravya AI debug APK..." -ForegroundColor Cyan
Write-Host "Android dir: $androidDir" -ForegroundColor Gray

Push-Location $androidDir
try {
    # Invoke Gradle directly through Java, using the wrapper jar
    & java `
        -Xmx2048m `
        -Dorg.gradle.appname=gradlew `
        "-Dgradle.user.home=$HOME/.gradle" `
        -classpath $wrapperJar `
        org.gradle.wrapper.GradleWrapperMain `
        assembleDebug

    if ($LASTEXITCODE -eq 0) {
        $apkPath = Join-Path $androidDir "app\build\outputs\apk\debug\app-debug.apk"
        Write-Host "`n✅ APK built successfully!" -ForegroundColor Green
        Write-Host "APK Location: $apkPath" -ForegroundColor Yellow

        # Copy APK to easy-access location
        Copy-Item $apkPath "D:\NuravyaApp\NuravyaAI-debug.apk" -Force
        Write-Host "Copied to: D:\NuravyaApp\NuravyaAI-debug.apk" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ Build failed. Check the output above for errors." -ForegroundColor Red
    }
} finally {
    Pop-Location
}
