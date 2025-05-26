// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Add environment variable for fixing the issue in tauri
    // see https://github.com/tauri-apps/tauri/issues/10702
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");

    pomoclock_lib::run()
}
