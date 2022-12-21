import { JSX } from "solid-js";

const Button = (props: JSX.IntrinsicAttributes & JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      class={'px-3 py-2 border-2'.concat(' ' + props.class)}
    >
      {props.children}
    </button>
  );
};

export default Button;
