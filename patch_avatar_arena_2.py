import re

def main():
    try:
        with open('src/App.tsx', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # 1. Update arena sprites position - higher up!
    # Player sprite
    target_player = """lg:top-[40%] lg:-translate-y-1/2 lg:left-24 lg:bottom-auto pointer-events-auto z-10"""
    replacement_player = """lg:top-[35%] xl:top-[30%] lg:-translate-y-1/2 lg:left-24 xl:left-32 lg:bottom-auto pointer-events-auto z-10"""
    if target_player in content:
        content = content.replace(target_player, replacement_player)
        print("Patched player sprite.")
    else:
        print("Player sprite target not found.")

    # Opponent sprite
    target_opponent = """lg:top-[40%] lg:-translate-y-1/2 lg:right-24 lg:bottom-auto pointer-events-auto z-10"""
    replacement_opponent = """lg:top-[35%] xl:top-[30%] lg:-translate-y-1/2 lg:right-24 xl:right-32 lg:bottom-auto pointer-events-auto z-10"""
    if target_opponent in content:
        content = content.replace(target_opponent, replacement_opponent)
        print("Patched opponent sprite.")
    else:
        print("Opponent sprite target not found.")

    # 2. Update Avatar Modal - Left Sidebar to ensure no cuts
    target_left_sidebar = """className="w-full lg:w-[320px] xl:w-[400px] bg-slate-950/80 p-3 sm:p-5 lg:p-6 xl:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative\""""
    replacement_left_sidebar = """className="w-full lg:w-[300px] xl:w-[360px] 2xl:w-[400px] bg-slate-950/80 p-3 sm:p-5 lg:p-4 xl:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative overflow-y-auto\""""
    if target_left_sidebar in content:
        content = content.replace(target_left_sidebar, replacement_left_sidebar)
        print("Patched left sidebar width.")
    else:
        print("Left sidebar target not found.")

    # 3. Update Avatar Image Container Size - make it slightly smaller on smaller PC screens
    target_avatar_img_container = """className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-52 xl:h-52 mx-auto mb-0 lg:mb-4 xl:mb-6 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group shrink-0\""""
    replacement_avatar_img_container = """className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-48 xl:h-48 mx-auto mb-0 lg:mb-3 xl:mb-5 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group shrink-0\""""
    if target_avatar_img_container in content:
        content = content.replace(target_avatar_img_container, replacement_avatar_img_container)
        print("Patched avatar image container size.")
    else:
        print("Avatar image container size target not found.")

    # 4. Update Avatar Image Size
    target_avatar_img = """className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-44 xl:h-44 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]\""""
    replacement_avatar_img = """className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-40 xl:h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]\""""
    if target_avatar_img in content:
        content = content.replace(target_avatar_img, replacement_avatar_img)
        print("Patched avatar image size.")
    else:
        print("Avatar image size target not found.")

    # 5. Update Avatar Details flex-1 max-height fix
    target_avatar_details = """<div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling pr-1 sm:pr-2 lg:pr-4 flex flex-col max-h-[22vh] lg:max-h-none">"""
    replacement_avatar_details = """<div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling pr-1 sm:pr-2 lg:pr-4 flex flex-col max-h-[22vh] lg:max-h-[35vh] xl:max-h-none">"""
    if target_avatar_details in content:
        content = content.replace(target_avatar_details, replacement_avatar_details)
        print("Patched avatar details wrapper.")
    else:
        print("Avatar details target not found.")
        
    # 6. Adjust grid columns for Right Side Selection to be more spacious on PC
    target_grid = """<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 sm:gap-6 pb-20">"""
    replacement_grid = """<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-5 xl:gap-6 pb-20">"""
    if target_grid in content:
        content = content.replace(target_grid, replacement_grid)
        print("Patched avatar grid.")
    else:
        print("Avatar grid target not found.")

    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("All patches applied.")

if __name__ == '__main__':
    main()
