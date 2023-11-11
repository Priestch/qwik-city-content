import {component$} from "@builder.io/qwik";

export interface Props {
  posts: any[]
}

export default component$((props: Props) => {
  return (
    <ul>
      {props.posts.map((post, index) => {
        return <li key={index}>
          <div>{post.title}</div>
          <article dangerouslySetInnerHTML={post._content.join('\n')}>
          </article>
        </li>
      })}
    </ul>
  )
})