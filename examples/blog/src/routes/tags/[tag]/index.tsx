import { component$ } from "@builder.io/qwik";
import Testimonial from "../../../components/testimonial"
import {routeLoader$, useLocation} from "@builder.io/qwik-city";
import * as Taxonomies from "@content/taxonomies";
import Posts from '@components/posts/posts';

export const usePosts = routeLoader$(async (requestEvent) => {
  // This code runs only on the server, after every navigation
  return Taxonomies.posts;
});

export default component$(() => {
  const { params } = useLocation();
  const tag = params.tag;
  const posts = usePosts();
  const tagPosts = posts.value.filter((post) => post.tags.includes(tag));
  return <>
    <Posts posts={tagPosts} />
  </>
})