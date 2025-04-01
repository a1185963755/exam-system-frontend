import { useDrag } from "react-dnd";

export function MateriaItem(props: { name: string; type: string }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: props.type,
    item: {
      type: props.type,
    },

    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={dragRef} className="p-2 border rounded text-center" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {props.name}
    </div>
  );
}
