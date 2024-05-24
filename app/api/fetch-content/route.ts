// REMARK

import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import myUnifiedPluginHandlingYamlMatter from "@/example-md/unified-plugin";
import path from "path";
export async function GET(request: Request) {
    const md = await read(path.join(process.cwd(), "/example-md/welcome.md"));

    const fm = matter(md);
    return Response.json({
        markdown: md.value.toLocaleString() as string,
        frontmatter: md.data.matter as typeof md
    });
}
