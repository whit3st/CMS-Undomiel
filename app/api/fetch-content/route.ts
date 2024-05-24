// REMARK

import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import myUnifiedPluginHandlingYamlMatter from "@/example-md/unified-plugin";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
export async function GET(request: Request) {
    // const MARKDOWN_FRONTMATTER = await read(path.join(process.cwd(), "/example-md/welcome.md"));
    // matter(MARKDOWN_FRONTMATTER)
    // const MARKDOWN_TO_HTML = await unified()
    //     .use(remarkParse)
    //     .use(remarkFrontmatter)
    //     .use(remarkGfm)
    //     .use(remarkRehype)
    //     .use(rehypeStringify)
    //     .process(await read(path.join(process.cwd(), "/example-md/welcome.md")))
    // .then((file) => file.toString());

    // // console.log(file, md.data.matter);
    // return Response.json({ 
    //     _html: MARKDOWN_TO_HTML,
    //     _frontmatter: MARKDOWN_FRONTMATTER.data.matter
    //  });
    
    const MARKDOWN_FRONTMATTER = await read(path.join(process.cwd(), "/example-md/welcome.md"));

    return Response.json({ _file: MARKDOWN_FRONTMATTER.toString() });
}
