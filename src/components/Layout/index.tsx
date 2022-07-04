const Layout = (props) => {
  return (
    <div class="grid grid-cols-6 grid-rows-[3.5rem_minmax(900px,_1fr)] min-h-screen min-w-full">
      {props.children}
    </div>
  );
};

export default Layout;
