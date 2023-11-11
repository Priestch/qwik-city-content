import { component$ } from "@builder.io/qwik";
import {StaticGenerate, useLocation} from "@builder.io/qwik-city";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import * as Taxonomies from "@content/taxonomies";

export default component$(() => {
  const { params } = useLocation();
  const post: any = Taxonomies.posts.find((post) => {
    return post._slug === params.id.toLowerCase();
  });
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        {!!post.description && <p>{post.description}</p>}
      </header>

      <div class="content" dangerouslySetInnerHTML={post?._content}/>

      <h2 id="tags">Tags</h2>

      <div class="button-group clear">
        {post.tags.map((tag: string) => {
          return <a class="button primary" href={`/tags/${tag}`}>{tag}</a>
        })}
      </div>
    </article>
  )
})

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: Taxonomies.posts.map((post) => {
      return {id: post._slug};
    }),
  } as StaticGenerate;
};