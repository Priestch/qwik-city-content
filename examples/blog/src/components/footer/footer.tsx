import { component$, useStyles$ } from '@builder.io/qwik';
import styles from './footer.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <footer>
      <ul>
        <li>
          <a href="/blog">Blog</a>
        </li>
        <li>
          <a class="footer-home" href="/">
            Home
          </a>
        </li>
      </ul>
    </footer>
  );
});
