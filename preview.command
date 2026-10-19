#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
python3 scripts/preview.py "$@"
status_code=$?
if [ "$status_code" -ne 0 ]; then
  read -r "?预览未启动，按回车关闭窗口。"
fi
