@ECHO OFF
ECHO "*********************************************>> THE BREAK Z START BAT"

IF EXIST .\node_modules (
    ECHO "*********************************************>> NODE_MODULES EXIST. START SUCCESS" 
) ELSE (
    ECHO "*********************************************>> NODE_MODULES NOT EXIST. INSTALL PROCESS"
    %cd%/node/npm i
)
./node/npm run dev