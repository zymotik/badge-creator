# node badge-creator

PDF badge creator intended for IBSA/Watchtower regional convention backstage/early pass generation.

## Concept

Take a list of people with their assigned departments and generate professional looking lapel badges for the local event security team to authorize personnel at the venue.

## How it works

Fill the included Excel list ([pass-list.xlsx](./pass-list.xlsx)) with authorised names, departments and type of pass. This could be collected from a [Google form](https://www.google.com/forms/about/) for example. This application will then take the template files in the `./templates` and replace the tokens with real names and departments. Three example templates are included for different kinds of access.

## Create the distributable application

To create a distributable file for Windows/Apple Mac/Linux users you will first need to install [Git](https://git-scm.com/downloads) to clone this repository and [Node.js](https://nodejs.org/en/download/) to compile the code. 

1. Clone the repository to your computer: `git clone https://github.com/zymotik/badge-creator.git`
2. Compile code: `npm run build`

Distributable files will be in the `./bin` folder. Edit the templates in the `./bin/templates` folder. Zip all the files in the `./bin` folder and distrubute to those wishing to generate badges.

## Instructions for Users Printing Passes

[Instructions can be found here](./application-readme.md)