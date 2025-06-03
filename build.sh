#/bin/bash

NO_STRIP=true cargo tauri build
if [ $? -ne 0 ]; then
    echo "Build failed. Please check the output for errors."
    exit 1
fi

cp src-tauri/target/release/bundle/appimage/*.AppImage .
name=$(basename *.AppImage)

# install it in .local/bin
ln -sf "$(pwd)/$name" ~/.local/bin/pomoclock.AppImage

