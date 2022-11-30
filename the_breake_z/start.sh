
echo "*********************************************>> THE BREAK Z START BAT"

export NODEJS=$(pwd)/node
export PATH=$PATH:$NODEJS:$NODEJS/bin

if [ -d $(pwd)/node_modules ] ; then
    echo "*********************************************>> NODE_MODULES EXIST. START SUCCESS" 
else 
    echo "*********************************************>> NODE_MODULES NOT EXIST. INSTALL PROCESS. ENTER key please"
    $(pwd)/node/bin/npm i
fi
$(pwd)/node/bin/npm run dev
