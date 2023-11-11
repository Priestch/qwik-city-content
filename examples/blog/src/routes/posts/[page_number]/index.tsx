import { component$ } from "@builder.io/qwik";
import type {StaticGenerateHandler} from "@builder.io/qwik-city";
import * as Taxonomies from "@content/taxonomies";

export default component$(() => {
  const content = '';
  return (
    <div>
      Post page
    </div>
  )
})

export type Content = {
  post: any
  testimonial: any | undefined
}
