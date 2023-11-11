import {component$, useSignal, useVisibleTask$} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Foundation from 'foundation-sites';
import {routeLoader$} from "@builder.io/qwik-city";
import * as Taxonomies from "@content/taxonomies";
import Posts from "@components/posts";
// import $ from 'jquery';

export const usePosts = routeLoader$(async (requestEvent) => {
  // This code runs only on the server, after every navigation
  return Taxonomies.posts;
});

export default component$(() => {
  const elRef = useSignal<Element>();

  // useVisibleTask$(async () => {
  //   const tabsEl = elRef.value?.querySelector('#example-tabs');
  //   console.log(elRef.value, tabsEl);
  //   new Foundation.Tabs($(tabsEl));
  // });
  const signal = usePosts();

  return (
    <div ref={elRef}>
      <h2>Welcome to Qwik City Blog</h2>

      <p>The blog meta-framework for Qwik.</p>

      <h3 id="recent-posts">Recent Posts</h3>
      <Posts posts={signal.value} />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik City',
};
