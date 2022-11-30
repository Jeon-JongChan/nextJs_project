
echo "*********************************************>> THE BREAK Z START BAT"

export NODEJS=$(pwd)/node
export PATH=$NODEJS;$PATH

if [ ! -d $(pwd)/node_modules ] ; then
    echo "*********************************************>> NODE_MODULES EXIST. START SUCCESS" 
else 
    echo "*********************************************>> NODE_MODULES NOT EXIST. INSTALL PROCESS. ENTER key please"
    $(pwd)/node/npm i
fi
$(pwd)/node/npm run dev
