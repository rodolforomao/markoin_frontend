type Props = {
  label: string;
  labelClass?: string;
  children: JSX.Element;
  margin?: string;
};

const WithLabel = (props: Props) => {
  const { label, margin, labelClass, children: Children } = props;
  return (
    <div className={margin ?? "mt-5"}>
      {label && (
        <span
          className={
            "ml-2 mb-2 block text-ml text-c-1" + labelClass
          }
          style={{color: 'var(--c-5)'}}
        >
          {label}
        </span>
      )}
      {Children} 
    </div>
  );
};

export default WithLabel;
