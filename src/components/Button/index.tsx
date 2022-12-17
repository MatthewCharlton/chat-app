const Button = (props) => {
  return (
    <button
      {...props}
      onClick={props.onClick}
      class={'px-3 py-2 border-2'.concat(' ' + props.class)}
    >
      {props.children}
    </button>
  );
};

export default Button;
