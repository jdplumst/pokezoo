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
          ? `bg-purple-btn-unfocus`
          : colour === `green`
          ? `bg-green-btn-unfocus`
          : colour === `orange`
          ? `bg-orange-btn-unfocus`
          : colour === `blue`
          ? `bg-blue-btn-unfocus`
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
      <label htmlFor={label} className="capitalize">
        {label}
      </label>
    </div>
  );
}
