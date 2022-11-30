
echo "*********************************************>> THE BREAK Z START BAT"

export NODEJS=$(pwd)/node
export PATH=$NODEJS;$PATH

if [ ! -d $(pwd)/node_modules ] ; then
    ECHO "*********************************************>> NODE_MODULES EXIST. START SUCCESS" 
else 
    ECHO "*********************************************>> NODE_MODULES NOT EXIST. INSTALL PROCESS. ENTER key please"
    %cd%/node/npm i
fi
%cd%/node/npm run dev
