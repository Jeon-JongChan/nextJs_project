@ECHO OFF
ECHO "*********************************************>> THE BREAK Z START BAT"

@REM powershell version
@REM $env:PATH += ";" + (Join-Path (Get-Location) "node") 
@REM $env:NODEJS = ";" + (Join-Path (Get-Location) "node") 
SET NODEJS=%cd%/node
SET PATH=%NODEJS%;%PATH%

IF EXIST %cd%/node_modules (
    ECHO "*********************************************>> NODE_MODULES EXIST. START SUCCESS" 
) ELSE (
    ECHO "*********************************************>> NODE_MODULES NOT EXIST. INSTALL PROCESS. ENTER key please"
    %cd%/node/npm i
)
%cd%/node/npm run dev
