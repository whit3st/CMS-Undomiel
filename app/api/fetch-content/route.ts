// REMARK

import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { read } from "to-vfile";
import myUnifiedPluginHandlingYamlMatter from "@/example-md/unified-plugin";
import path from "path";
export async function GET(request: Request) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkFrontmatter, { type: "yaml", marker: "---" })
        .use(myUnifiedPluginHandlingYamlMatter)
        .process(await read(path.join(process.cwd(), "/example-md/welcome.md")));

    console.log(String(file));
    return Response.json({ changedFile: file });
}
