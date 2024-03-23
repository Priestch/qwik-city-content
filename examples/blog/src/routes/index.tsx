import {component$, useSignal, useVisibleTask$} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Foundation from 'foundation-sites';
import {routeLoader$} from "@builder.io/qwik-city";
import * as Taxonomies from "@content/taxonomies";
import Posts from "@components/posts/posts";
import $ from 'jquery';

export const usePosts = routeLoader$(async (requestEvent) => {
  // This code runs only on the server, after every navigation
  return Taxonomies.posts;
});

export default component$(() => {
  const elRef = useSignal<Element>();

  useVisibleTask$(async () => {
    const tabsEl = elRef.value?.querySelector('#example-tabs');
    console.log(elRef.value, tabsEl);
    new Foundation.Tabs($(tabsEl));
  });
  const signal = usePosts();

  return (
    <div ref={elRef}>
      <ul class="tabs" data-tabs id="example-tabs">
        <li class="tabs-title is-active"><a href="#panel1" aria-selected="true">Tab 1</a></li>
        <li class="tabs-title"><a data-tabs-target="panel2" href="#panel2">Tab 2</a></li>
      </ul>
      <div class="tabs-content" data-tabs-content="example-tabs">
        <div class="tabs-panel is-active" id="panel1">
          <p>Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
            porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
            Suspendisse dictum feugiat nisl ut dapibus.</p>
        </div>
        <div class="tabs-panel" id="panel2">
          <p>Suspendisse dictum feugiat nisl ut dapibus. Vivamus hendrerit arcu sed erat molestie vehicula. Ut in nulla
            enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Sed auctor neque eu tellus
            rhoncus ut eleifend nibh porttitor.</p>
        </div>
      </div>
      <Posts posts={signal.value}/>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik City',
};
