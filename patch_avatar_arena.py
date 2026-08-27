import re

def main():
    try:
        with open('src/App.tsx', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # 1. Update arena sprites position
    # Player sprite
    target_player = """lg:top-1/2 lg:-translate-y-1/2 lg:left-24 lg:bottom-auto pointer-events-auto z-10"""
    replacement_player = """lg:top-[40%] lg:-translate-y-1/2 lg:left-24 lg:bottom-auto pointer-events-auto z-10"""
    if target_player in content:
        content = content.replace(target_player, replacement_player)
        print("Patched player sprite.")
    else:
        print("Player sprite target not found.")

    # Opponent sprite
    target_opponent = """lg:top-1/2 lg:-translate-y-1/2 lg:right-24 lg:bottom-auto pointer-events-auto z-10"""
    replacement_opponent = """lg:top-[40%] lg:-translate-y-1/2 lg:right-24 lg:bottom-auto pointer-events-auto z-10"""
    if target_opponent in content:
        content = content.replace(target_opponent, replacement_opponent)
        print("Patched opponent sprite.")
    else:
        print("Opponent sprite target not found.")

    # 2. Update Avatar Modal - Left Sidebar Width
    target_left_sidebar = """className="w-full lg:w-[400px] xl:w-[450px] bg-slate-950/80 p-3 sm:p-5 lg:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative\""""
    replacement_left_sidebar = """className="w-full lg:w-[320px] xl:w-[400px] bg-slate-950/80 p-3 sm:p-5 lg:p-6 xl:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative\""""
    if target_left_sidebar in content:
        content = content.replace(target_left_sidebar, replacement_left_sidebar)
        print("Patched left sidebar width.")
    else:
        print("Left sidebar target not found.")

    # 3. Update Avatar Image Container Size
    target_avatar_img_container = """className="relative w-20 h-20  sm:w-28 sm:h-28 lg:w-56 lg:h-56 mx-auto mb-0 lg:mb-6 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group shrink-0\""""
    replacement_avatar_img_container = """className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-52 xl:h-52 mx-auto mb-0 lg:mb-4 xl:mb-6 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group shrink-0\""""
    if target_avatar_img_container in content:
        content = content.replace(target_avatar_img_container, replacement_avatar_img_container)
        print("Patched avatar image container size.")
    else:
        print("Avatar image container size target not found.")

    # 4. Update Avatar Image Size
    target_avatar_img = """className="w-16 h-16 sm:w-24 sm:h-24 lg:w-48 lg:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]\""""
    replacement_avatar_img = """className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-44 xl:h-44 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]\""""
    if target_avatar_img in content:
        content = content.replace(target_avatar_img, replacement_avatar_img)
        print("Patched avatar image size.")
    else:
        print("Avatar image size target not found.")

    # 5. Update Avatar Text Sizes
    target_avatar_name = """<h3 className="text-base sm:text-2xl lg:text-5xl font-hud font-black text-left lg:text-center text-cyan-300 uppercase tracking-[0.2em] mb-1 sm:mb-2 drop-shadow-lg shrink-0">"""
    replacement_avatar_name = """<h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-hud font-black text-left lg:text-center text-cyan-300 uppercase tracking-[0.2em] mb-1 sm:mb-2 drop-shadow-lg shrink-0">"""
    if target_avatar_name in content:
        content = content.replace(target_avatar_name, replacement_avatar_name)
        print("Patched avatar name.")
    else:
        print("Avatar name target not found.")

    target_avatar_role = """<div className="text-[9px] sm:text-xs lg:text-lg text-emerald-400 font-bold uppercase tracking-widest text-center mb-1.5 sm:mb-6 py-0.5 sm:py-1 px-2 sm:px-4 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-start lg:self-center shrink-0">"""
    replacement_avatar_role = """<div className="text-[9px] sm:text-xs lg:text-sm xl:text-base text-emerald-400 font-bold uppercase tracking-widest text-center mb-1.5 sm:mb-4 py-0.5 sm:py-1 px-2 sm:px-4 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-start lg:self-center shrink-0">"""
    if target_avatar_role in content:
        content = content.replace(target_avatar_role, replacement_avatar_role)
        print("Patched avatar role.")
    else:
        print("Avatar role target not found.")

    target_avatar_lore = """<p className="text-[11px] sm:text-sm lg:text-xl font-serif italic text-slate-300 leading-relaxed opacity-90 text-left lg:text-center lg:text-left mb-1 sm:mb-6">"""
    replacement_avatar_lore = """<p className="text-[11px] sm:text-sm lg:text-base xl:text-lg font-serif italic text-slate-300 leading-relaxed opacity-90 text-left lg:text-center mb-1 sm:mb-6">"""
    if target_avatar_lore in content:
        content = content.replace(target_avatar_lore, replacement_avatar_lore)
        print("Patched avatar lore.")
    else:
        print("Avatar lore target not found.")

    # 6. Avatar layout flex wrapper on PC
    target_flex_wrapper = """<div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-3 lg:gap-0 h-full mb-3 lg:mb-0">"""
    replacement_flex_wrapper = """<div className="flex flex-row lg:flex-col items-center lg:items-center xl:items-stretch gap-3 lg:gap-0 h-full mb-3 lg:mb-0">"""
    if target_flex_wrapper in content:
        content = content.replace(target_flex_wrapper, replacement_flex_wrapper)
        print("Patched avatar flex wrapper.")
    else:
        print("Avatar flex wrapper target not found.")

    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("All patches applied.")

if __name__ == '__main__':
    main()
