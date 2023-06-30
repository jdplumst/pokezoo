interface IDropdownItem {
  label: string;
  fn: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  colour: string;
}

export default function DrowpdownItem({
  label,
  fn,
  checked,
  colour
}: IDropdownItem) {
  return (
    <div
      className={`w-full border-x-2 border-b-2 border-black ${
        colour === "purple"
          ? `bg-purple-500`
          : colour === `green`
          ? `bg-green-500`
          : colour === `orange`
          ? `bg-orange-500`
          : `bg-white`
      } p-2 font-bold`}>
      <input
        onChange={fn}
        type="checkbox"
        checked={checked}
        className="mr-4"
        id={label}
        name={label}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}
