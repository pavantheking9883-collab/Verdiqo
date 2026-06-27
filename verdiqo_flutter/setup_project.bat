@echo off
echo =======================================================
echo Verdiqo Flutter Project Setup Script
echo Quantex Intelligence Systems (P) Ltd.
echo =======================================================
echo.
echo Checking for Flutter SDK...
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Flutter SDK was not found in your system PATH.
    echo Please make sure you download Flutter from:
    echo https://docs.flutter.dev/get-started/install
    echo and add it to your environment variables before running this script.
    echo.
    pause
    exit /b 1
)

echo Flutter SDK found. Initializing project directories...
flutter create --org com.quantex.verdiqo --project-name verdiqo_app .
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to run "flutter create".
    echo.
    pause
    exit /b 1
)

echo.
echo Fetching dependencies (provider, cupertino_icons)...
flutter pub get
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to run "flutter pub get".
    echo.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo SUCCESS: Project platform directories initialized!
echo You can now open "verdiqo_flutter" inside Android Studio
echo or VS Code to run and debug the application.
echo =======================================================
echo.
pause
