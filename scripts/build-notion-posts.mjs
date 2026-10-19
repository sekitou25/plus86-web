// Compatibility entry point. All editable content now lives in content/.
import {build} from './build-content.mjs';
const result=await build();
console.log(`已从 content/ 生成 ${result.posts.length} 篇文章；以后可运行 python3 scripts/preview.py。`);
