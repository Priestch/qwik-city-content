import { component$ } from "@builder.io/qwik";
import {routeLoader$} from "@builder.io/qwik-city";
import * as Taxonomies from "@content/taxonomies";
import Posts from '@components/posts/posts';

export const usePosts = routeLoader$(async (requestEvent) => {
  return Taxonomies.posts;
});

export default component$(() => {
  const signal = usePosts();
  return (
  <Posts posts={signal.value} />
  )
})

export type Content = {
  post: any
  testimonial: any | undefined
}
