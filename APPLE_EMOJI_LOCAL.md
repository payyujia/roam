# Local Apple emoji image support (Windows)

Roam's emoji picker and chat messages can display emoji images that you save locally, in place of Windows' emoji artwork.

No Apple artwork is included. Apple emoji images displayed on Emojipedia are owned by their respective rights holders; a private repository does not automatically grant permission to redistribute them. Check applicable rights before reusing artwork.

## Setup

1. Pull the latest Roam files to your Windows computer.
2. Next to index.html, create a folder called assets/apple-emojis/.
3. Visit https://emojipedia.org/apple and open an emoji. If you have the right to use its image for your purpose, save the image locally. Emojipedia's Copy button only copies the Unicode character, which Windows will display in its own style.
4. Name the image using the emoji's Unicode code points in lowercase hexadecimal, separated by dashes. Omit fe0f / fe0e variation selectors.
5. Put the image in assets/apple-emojis/, retaining its true file extension (.png or .webp).
6. Open index.html in Chrome, then open the emoji picker or send that emoji in chat. Refresh after adding files.

## Example filenames

| Emoji | Local filename |
|---|---|
| 😀 | assets/apple-emojis/1f600.png |
| 😂 | assets/apple-emojis/1f602.png |
| 😊 | assets/apple-emojis/1f60a.png |
| ❤️ | assets/apple-emojis/2764.png |
| 👍 | assets/apple-emojis/1f44d.png |
| 👍🏽 | assets/apple-emojis/1f44d-1f3fd.png |
| 🇸🇬 | assets/apple-emojis/1f1f8-1f1ec.png |

WebP images are also supported (e.g. 1f600.webp). Do not simply rename a JPG to .png: use the correct extension and convert formats if necessary.

No manual code edits are required when you add more images. Roam first tries the matching PNG, then WebP. If neither exists, it displays the original Unicode emoji instead. Emojis are still sent and copied as Unicode.

The folder is ignored by .gitignore, so these images are not uploaded by normal Git commits. Do not force-add or distribute copyrighted images without appropriate permission. Each computer must have its own local artwork files.
