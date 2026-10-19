#!/usr/bin/env python3
"""Start the content-aware preview, using installed Node or the bundled Codex runtime."""
import os
from pathlib import Path
import shutil
import sys

root = Path(__file__).resolve().parent.parent
node = shutil.which("node")
if not node:
    bundled = Path.home() / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
    if bundled.is_file():
        node = str(bundled)
if not node:
    sys.exit("需要 Node.js 20 或更高版本。安装后重新运行此命令，无需 npm install。")
arguments = sys.argv[1:]
script = "build-content.mjs" if "--build" in arguments else "dev.mjs"
arguments = [arg for arg in arguments if arg != "--build"]
os.chdir(root)
os.execv(node, [node, str(root / "scripts" / script), *arguments])
