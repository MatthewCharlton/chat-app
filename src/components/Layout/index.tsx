import { JSX } from "solid-js";

const Layout = (props: { children:  Node | JSX.ArrayElement | JSX.FunctionElement }) => {
  return (
    <div class="grid grid-cols-6 grid-rows-[3.5rem_minmax(900px,_1fr)] min-h-screen min-w-full">
      {props.children}
    </div>
  );
};

export default Layout;
