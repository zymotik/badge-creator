# How to Use this Application

The application generates passes from the template files in the `./templates` directory. You will notice that it is a simple find and replace mechanism for both the name and department on each badge. We recommend that you save the template files in PDF 1.4 compatibility mode, disable any advance features and embedded all fonts in the template. Templates can be edited in Adobe Illustrator.

## Microsoft Windows

1. Add names to the `pass-list.xlsx` file, paying special attention to the pass type column: this should only be one of the following options `Early`, `Backstage` or `Early & Backstage`.
2. Double click the `badge-creator-win.exe` file to generate printable files.
3. When the program completes, look inside the `./export` folder for a list of PDF files generated.
4. To print on the back side of these passes, turn the pages over and print again with the `./templates/back-of-pass.pdf` PDF file.

## Linux

As above, but for step 2, use a terminal window to execute `./badge-creator-linux`.

## Mac

Untested. Core M not supported without emulation enabled.
