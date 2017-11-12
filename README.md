# Angular Universal PWA Starter
Angular Universal PWA Starter built with Angular Cli on Expressjs.

## Assumptions
- angular cli (project generated with version 1.3.1)
- yarn (dependency management)
- angular 4.3+ (new httpClient)
- The deployment scripts are written for a windows machine, simple commands like copying (robocopy) and delete (del) would need to be replaced with os equivalent.
- You have another folder called angular-universal-pwa-starter-deploy on the same level that you have angular-universal-pwa-starter.
	- angular-universal-pwa-starter-deploy contains:a git repo, .gitignore, and .gitattributes. It is the deployment folder that you pull from to update the server.
	- The various build scripts add server.js and the entire frontend dist folder to the angular-universal-pwa-starter-deploy folder.

## Files that require changes for a fresh project
- webpack.config.js change the output path from `'../angular-universal-pwa-starter-deploy'` to `your-project-name-deploy`
- package.json
	- script `copy-frontend-to-deploy-folder` & `push-dist-to-github` & `serverLocal` change any mentions of `angular-universal-pwa-starter` to your project name.
- /src/app/app.common.module.ts `{appId: 'angular-universal-pwa-starter'}`

## Useful Commands
- `ng serve` - Run in frontend development mode on port 4200.
- `npm run serverLocal` - Full build of frontend and backend, then serves frontend and backend on port 8000.
- `npm run serverRebuild` - Rebuild and run server on port 8000, assumes no frontend changes.
- `npm run deploy` - Build and push server & frontend assets to github deployment repo.
- `npm run analyze` - Bundle analysis of non-tree shaken bundle. lets you see the individual angular module pieces.
- `npm run analyze-deploy` - Bundle analysis of tree shaken bundle. kind of opaque, but truest to reality.
- `yarn upgrade-interactive` - Upgrade only what you want to.

## Build Scripts Explained
- `npm run deploy` or `npm run serverLocal` are idential, except deploy pushes to github, and serverLocal runs the local server on port 8000.
	- first it runs `prep`
		- first it runs `ng build prod --build-optimizer` to build the frontend production app.
		- second it runs `ng build --prod --app 1 --output-hashing none --build-optimizer` to build the server Aot Factory: `AppServerModuleNgFactory`
		- third it runs `localWebpackForServer` which bundles the backend server from the `webpack.config.js` settings file into a single file: `server.js` and places it into your `angular-universal-pwa-starter-deploy` folder.
	- second it runs `copy-frontend-to-deploy-folder` which does just as it is named.
	- third it pushes the deploy folder to github with `push-dist-to-github`. You may want to have a more robust commit message than what I am currently using: `"auto generated commit"`


creating deployment on digital ocean server:

- sudo git remote add origin https://github.com/EreckGordon/angular-universal-pwa-starter-deploy
- sudo git pull origin master

updating deployment:
```
ssh root@ipv4 address
su - web
cd /var/www/
sudo git pull origin master
pm2 restart server
```
