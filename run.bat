@echo off
title Verdiqo - Bail Management System Server
echo ========================================================
echo   VERDIQO: SMART BAIL VERIFICATION PLATFORM
#  Quantex Intelligence Systems (P) Ltd.
#  Starting secure local web server...
echo ========================================================
echo.

# Automatically opens their default web browser to the localhost port
echo Launching default web browser at http://localhost:8000/...
start "" "http://localhost:8000/"

# Starts the lightweight background PowerShell HTTP Server
powershell -ExecutionPolicy Bypass -File "scratch\server.ps1"

pause
