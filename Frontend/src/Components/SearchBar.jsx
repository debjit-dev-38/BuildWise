import { Search, SlidersHorizontal } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="group relative">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 opacity-0 blur-md transition-all duration-300 group-focus-within:opacity-100" />

        <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#0A0A0A]">
          <Search
            size={20}
            className="absolute left-5 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search projects, technologies, or learning paths..."
            className="
              h-14
              w-full
              bg-transparent
              pl-14
              pr-16
              text-white
              placeholder:text-zinc-500
              outline-none
            "
          />

          <button
            className="
              mr-2
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-zinc-900
              transition-all
              duration-200
              hover:border-violet-500/30
              hover:bg-zinc-800
            "
          >
            <SlidersHorizontal
              size={18}
              className="text-zinc-400"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;