interface INoteProps {
  note: string;
}

export default function Note({ note }: INoteProps) {
  return <p className="px-4">{note}</p>;
}
