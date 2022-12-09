
# 폴더 내부에서 실행할 때는 아래와 같이 실행하면 된다.
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

# 폴더 외부에서 실행할 때는 아래와 같이 실행하면 된다.

# echo "*********************************************>> THE BREAK Z START "

# export NODEJS=/home/user/nextJs_project/the_breake_z/node
# export PATH=$PATH:$NODEJS:$NODEJS/bin

# project=/home/user/nextJs_project

# echo "node localtion : " $NODEJS "| project folder : " ${project}

# echo "git pull start"

# cd ${project}
# git pull origin main

# echo "git pull complete."
# echo "npm run build and start"

# cd ${project}/the_breake_z

# if [ -d ./node_modules ] ; then
#     echo "*********************************************>> NODE_MODULES EXIST. START SUCCESS"
# else    echo "+++++++++++++++++++++++++++++++++++++++++++++>> NODE_MODULES NOT EXIST. INSTALL PROCESS"
#     npm i
# fi

# npm run build && npm run start