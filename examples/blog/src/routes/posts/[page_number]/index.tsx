import { component$ } from "@builder.io/qwik";

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
