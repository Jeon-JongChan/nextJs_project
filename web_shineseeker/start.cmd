@ECHO OFF
ECHO "*********************************************>> NODE START BAT"

REM powershell version
REM $env:PATH += ";" + (Join-Path (Get-Location) "node"); $env:NODEJS = ";" + (Join-Path (Get-Location) "node") 
REM $env:NODEJS="$PWD\node";$env:PATH="$env:NODEJS;$env:PATH"     # powershell version

SET nodejsVersion=20.10.0
SET nodeFolderName=node-v%nodejsVersion%-win-x64
SET nodejsUrl=https://nodejs.org/dist/v%nodejsVersion%/%nodeFolderName%.zip
SET outputPath=%cd%\node_temp
SET NODEPATH=%cd%\node

IF NOT EXIST "%outputPath%.zip" (
    REM Node.js Portable download
    curl -o "%outputPath%.zip" "%nodejsUrl%"
)

IF NOT EXIST "%NODEPATH%" (
    MKDIR "%NODEPATH%"
    REM ZIP file extract to node folder and delete zip file
    powershell -command "& {Expand-Archive -Path '%outputPath%.zip' -DestinationPath '%outputPath%' -Force}"
    REM Extracted files move to the desired folder
    xcopy /E /Y "%outputPath%\%nodeFolderName%\*" "%NODEPATH%"
    REM Delete ZIP file and extracted folder
    DEL /Q "%outputPath%.zip"
    RMDIR /S /Q "%outputPath%"
)

SET PATH=%NODEPATH%;%PATH%


IF EXIST %cd%/node_modules (
    ECHO "*********************************************>> NODE_MODULES EXIST. START SUCCESS" 
) ELSE (
    ECHO "*********************************************>> NODE_MODULES NOT EXIST. INSTALL PROCESS. ENTER key please"
    %NODEPATH%\npm i
)
%NODEPATH%\npm run dev
