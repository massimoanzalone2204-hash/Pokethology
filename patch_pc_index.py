import re
import sys

def main():
    try:
        with open('src/App.tsx', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Patch listMode === 'home' wrapper
    target_home_wrapper = """className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 py-3 sm:py-5 px-3 sm:px-4 text-center relative overflow-y-auto custom-scrollbar optimize-scrolling select-none w-full h-full my-auto max-w-5xl mx-auto min-h-0\""""
    replacement_home_wrapper = """className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-2 xl:gap-3 py-3 sm:py-5 px-3 sm:px-4 text-center relative overflow-y-auto lg:overflow-hidden custom-scrollbar optimize-scrolling select-none w-full h-full my-auto max-w-5xl mx-auto min-h-0\""""
    
    if target_home_wrapper in content:
        content = content.replace(target_home_wrapper, replacement_home_wrapper)
    else:
        print("Could not find target_home_wrapper")

    # Patch logo wrapper
    target_logo = """className="relative w-52 h-52 xxs:w-60 xxs:h-60 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] flex items-center justify-center shrink max-h-[35vh] sm:max-h-[45vh] -mt-8 sm:-mt-16 mb-2 sm:mb-6\""""
    replacement_logo = """className="relative w-52 h-52 xxs:w-60 xxs:h-60 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-[28rem] md:h-[28rem] lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] flex items-center justify-center shrink-0 max-h-[35vh] sm:max-h-[45vh] lg:max-h-[35vh] xl:max-h-[40vh] -mt-8 sm:-mt-16 lg:mt-0 mb-2 sm:mb-6 lg:mb-1 xl:mb-3\""""
    
    if target_logo in content:
        content = content.replace(target_logo, replacement_logo)
    else:
        print("Could not find target_logo")
        
    # Patch text wrapper
    target_text_wrapper = """<div className="flex flex-col gap-2 sm:gap-3 relative z-10 shrink-0 w-full max-w-4xl px-2 sm:px-4">"""
    replacement_text_wrapper = """<div className="flex flex-col gap-2 sm:gap-3 lg:gap-1 xl:gap-2 relative z-10 shrink-0 w-full max-w-4xl px-2 sm:px-4">"""
    
    if target_text_wrapper in content:
        content = content.replace(target_text_wrapper, replacement_text_wrapper)
    else:
        print("Could not find target_text_wrapper")

    # Patch h1
    target_h1 = """lg:text-7xl font-hud"""
    replacement_h1 = """lg:text-6xl xl:text-7xl font-hud"""
    if target_h1 in content:
        content = content.replace(target_h1, replacement_h1)
        
    # Patch OS span
    target_os = """lg:text-6xl font-black text-glow"""
    replacement_os = """lg:text-5xl xl:text-6xl font-black text-glow"""
    if target_os in content:
        content = content.replace(target_os, replacement_os)
        
    # Patch subtitle p
    target_p = """lg:text-2xl text-cyan-400 select-none px-4 mt-0.5 tracking-wider"""
    replacement_p = """lg:text-xl xl:text-2xl text-cyan-400 select-none px-4 mt-0.5 lg:mt-0 tracking-wider"""
    if target_p in content:
        content = content.replace(target_p, replacement_p)

    # Patch button wrapper
    target_btn = """<div className="flex justify-center items-center mt-3 sm:mt-5 md:mt-5 w-full max-w-md mx-auto px-4">"""
    replacement_btn = """<div className="flex justify-center items-center mt-3 sm:mt-5 md:mt-5 lg:mt-2 xl:mt-4 w-full max-w-md mx-auto px-4">"""
    if target_btn in content:
        content = content.replace(target_btn, replacement_btn)
    else:
        print("Could not find target_btn")
        
    # Patch disclaimer wrapper
    target_disc = """<div className="flex flex-col items-center justify-center mt-12 sm:mt-16 md:mt-24 mb-2 select-none px-2">"""
    replacement_disc = """<div className="flex flex-col items-center justify-center mt-12 sm:mt-16 md:mt-24 lg:mt-6 xl:mt-10 mb-2 select-none px-2">"""
    if target_disc in content:
        content = content.replace(target_disc, replacement_disc)
    else:
        print("Could not find target_disc")

    # Patch arena player sprite
    target_player_sprite = """<div className="absolute bottom-20 left-2 xs:bottom-24 xs:left-4 sm:bottom-28 sm:left-12 md:bottom-32 md:left-16 lg:bottom-40 lg:left-24 pointer-events-auto z-10">"""
    replacement_player_sprite = """<div className="absolute bottom-20 left-2 xs:bottom-24 xs:left-4 sm:bottom-28 sm:left-12 md:bottom-32 md:left-16 lg:top-1/2 lg:-translate-y-1/2 lg:left-24 lg:bottom-auto pointer-events-auto z-10">"""
    if target_player_sprite in content:
        content = content.replace(target_player_sprite, replacement_player_sprite)
    else:
        print("Could not find target_player_sprite")

    # Patch arena opponent sprite
    target_opponent_sprite = """<div className="absolute top-[12%] right-2 xs:top-[15%] xs:right-4 sm:top-[20%] sm:right-12 md:top-[25%] md:right-16 lg:top-[25%] lg:right-24 pointer-events-auto z-10">"""
    replacement_opponent_sprite = """<div className="absolute top-[12%] right-2 xs:top-[15%] xs:right-4 sm:top-[20%] sm:right-12 md:top-[25%] md:right-16 lg:top-1/2 lg:-translate-y-1/2 lg:right-24 lg:bottom-auto pointer-events-auto z-10">"""
    if target_opponent_sprite in content:
        content = content.replace(target_opponent_sprite, replacement_opponent_sprite)
    else:
        print("Could not find target_opponent_sprite")

    try:
        with open('src/App.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Patch successful.")
    except Exception as e:
        print(f"Error writing file: {e}")

if __name__ == '__main__':
    main()
