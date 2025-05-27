#[derive(Default)]
struct AppState {}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn notify(app_handle: tauri::AppHandle, text: &str) {
    // Send a notification with the given text
    use tauri_plugin_notification::NotificationExt;

    app_handle
        .notification()
        .builder()
        .title("Pomoclock")
        .body(text)
        .show()
        .unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![notify])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
