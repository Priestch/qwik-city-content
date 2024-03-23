import {component$, useStyles$, useVisibleTask$} from "@builder.io/qwik";
import styles from './posts.scss?inline';
import {toNow} from "~/datetime";

export interface Props {
  posts: any[]
}

function getExcerpt(post, length = 280) {
  if (post._text.length <= length) {
    return post._text;
  }
  let index = length;
  while (post._text[index] !== " ") {
    index += 1;
  }
  return post._text.slice(0, index) + "...";
}

function getRoute(post) {
  const directory = `${post._directory.replace(/(s$|s\/)/, '/')}`;
  return `/${directory}/${post._slug}`
}

export default component$((props: Props) => {
  useStyles$(styles);
  useVisibleTask$(() => {

  })

  return (
    <ul class="posts no-bullet">
      {props.posts.map((post, index) => {
        return (
          <li class="post" key={index}>
            <h3 class="post-title"><a href={getRoute(post)}>{ post.title }</a></h3>
            <div class="summary">
              <span class="published-at">Published {toNow(post.date)}</span>
              <span></span>
            </div>
            <p class="post-excerpt text-truncate">{getExcerpt(post)}</p>
          </li>
        )
      })}
    </ul>
  )
})