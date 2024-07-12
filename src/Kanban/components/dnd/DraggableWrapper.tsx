import { Draggable } from "@hello-pangea/dnd";

const DraggableWrapper = (props: DROP) => {
  const { index, draggableId, isDragDisabled, className, children: CH , title} = props;
  return (
    <Draggable {...{ index, draggableId, isDragDisabled }}>
      {({ innerRef, dragHandleProps, draggableProps }) => (
        <div
          title={title}
          className={className}
          ref={innerRef}
          {...dragHandleProps}
          {...draggableProps}
        >
          {CH}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableWrapper;

type DROP = {
  children: React.ReactNode;
  className?: string;
  draggableId: string;
  index: number;
  isDragDisabled: boolean;
  title?:string;
};
