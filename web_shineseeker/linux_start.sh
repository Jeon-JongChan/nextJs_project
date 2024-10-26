#!/bin/bash

# 현재 스크립트가 위치한 경로
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$script_dir"

# Node.js 버전과 다운로드 링크 설정
nodejs_version="20.10.0"
node_folder_name="node-v${nodejs_version}-linux-x64"
nodejs_url="https://nodejs.org/dist/v${nodejs_version}/${node_folder_name}.tar.xz"
output_path="${script_dir}/node_temp"
node_path="${script_dir}/node"
node_modules_path="${script_dir}/node_modules"  # node_modules 경로 지정

# 1. node 폴더가 존재하지 않으면 Node.js 다운로드
if [ ! -d "$node_path" ]; then
    echo "Node.js 폴더가 존재하지 않음. 다운로드 시작..."

    # 임시 디렉토리 생성
    mkdir -p "$output_path"

    # Node.js Portable 다운로드
    curl -o "${output_path}/nodejs.tar.xz" "$nodejs_url"

    # 2. 다운로드한 Node.js 압축 해제 및 폴더 이름 변경
    echo "Node.js 압축 해제 중..."
    tar -xf "${output_path}/nodejs.tar.xz" -C "$output_path"

    # 폴더 이름 변경
    mv "$output_path/$node_folder_name" "$node_path"

    # 3. 다운로드한 압축 파일 삭제
    rm "${output_path}/nodejs.tar.xz"
fi

# PATH 환경 변수에 Node.js 추가
export PATH="$node_path/bin:$PATH"

# 4. node_modules가 존재하지 않으면 npm install 실행
if [ ! -d "$node_modules_path" ]; then
    echo "node_modules가 존재하지 않음. npm install 실행 중..."
    npm install
fi

# 5. Git 저장소에서 최신 변경 사항 가져오기
echo "최신 변경 사항을 가져오는 중..."
git pull

# 6. 변경 사항이 있는지 확인
if [ "$(git diff --shortstat HEAD@{1} HEAD)" ]; then
    echo "변경 사항이 감지되었습니다. Next.js 애플리케이션 빌드 중..."
    npm run build
    # 권한문제로 미리 권한 준 파일에 붙여넣기
    cat linux_start.sh > start.sh
else
    echo "변경 사항이 없습니다. 빌드 생략."
fi

# 7. 프로덕션 모드로 실행
echo "Next.js 애플리케이션을 프로덕션 모드로 실행 중..."
npm run start -- -p 80
