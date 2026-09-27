// A caveat, marked with a yellow caution-sign diamond. Use it wherever a number
// needs context before a reader can trust it.
import s from "./Note.module.css";

export default function Note({ title = "Caveat", children }) {
  return (
    <aside className={s.note}>
      <span className={s.diamond} aria-hidden="true"><span>!</span></span>
      <p className={s.body}>
        <strong className={s.title}>{title}.</strong> {children}
      </p>
    </aside>
  );
}
