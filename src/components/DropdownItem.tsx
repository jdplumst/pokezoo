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
      className={`w-full border-x-2 border-black ${
        colour === "purple"
          ? `bg-purple-btn-unfocus`
          : colour === `green`
          ? `bg-green-btn-unfocus`
          : colour === `orange`
          ? `bg-orange-btn-unfocus`
          : colour === `blue`
          ? `bg-blue-btn-unfocus`
          : colour === "lime"
          ? `bg-lime-btn-unfocus`
          : colour === "red"
          ? `bg-red-btn-unfocus`
          : `bg-white`
      } flex px-2 py-[1px] font-bold`}>
      <input
        onChange={fn}
        type="checkbox"
        checked={checked}
        className="flex-none hover:cursor-pointer"
        id={label === "Select All" ? "all" + colour : label}
        name={label === "Select All" ? "all" + colour : label}
      />
      <label
        htmlFor={label === "Select All" ? "all" + colour : label}
        className="inline-block w-32 flex-auto pl-4 capitalize hover:cursor-pointer">
        {label}
      </label>
    </div>
  );
}
