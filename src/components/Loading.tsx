export default function Loading() {
  return (
    <div className="absolute flex min-h-screen w-screen items-center justify-center bg-black text-center text-slate-500">
      <div
        className="absolute h-52 w-52 rounded-full
                      ring before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-full
                      before:shadow-[0_0_5px_5px_rgba(255,255,255,0.3)]"
      ></div>
      <span className="change-text uppercase">loading...</span>
    </div>
  );
}
