# Angular Universal PWA Starter
Angular Universal PWA Starter built with Angular Cli on Nestjs with TypeORM + Postgres. Auth with jsonwebtoken library.

## Assumptions
- angular cli (project generated with version 1.6.0-rc.0)
- yarn (dependency management)
- angular 5.0+ (new service worker)
- I have provided public and private keys for demonstration purposes only. Please do not use them in your project.
	- don't even check your real keys into source control.
- You have another folder called angular-universal-pwa-starter-deploy on the same level that you have angular-universal-pwa-starter.
	- [Example deploy repo](https://github.com/EreckGordon/angular-universal-pwa-starter-deploy)
	- angular-universal-pwa-starter-deploy contains:a git repo, .gitignore, and .gitattributes. You will copy over the needed files with build scripts. It is the deployment folder that you pull from to update the server.
	- The various build scripts compile the server and move the dist folder & package.json to the angular-universal-pwa-starter-deploy folder.

## Files that require changes for a fresh project
- /src/app/app.common.module.ts `{appId: 'angular-universal-pwa-starter'}`
- /server/modules/database/database.providers.ts set your database `username`, `password`, and  `database` fields.
- `private.key` and `public.key` generate your own. Don't store your production keys on github.

## Thoughts
- in `/server/modules/api/api.controller.ts` you may want to turn the session id setting from `secure:true` to `secure:false` to test if you are able to properly log in and out. For Production you want both `httpOnly` and `secure` to be true.
- why bother with a depoyment repo? precompile everything on your dev environment, it is probably a beefier machine.

## Useful Commands
- `ng serve --aot` - Run in frontend aot development mode on port 4200.
- `npm run dev-server` - Runs server on port 8000 via ts-node, assumes no frontend changes.
- `npm run prep-dev-server` - Full build of frontend, then serves frontend and backend on port 8000 via ts-node.
- `npm run deploy` - Build and push server & frontend assets to github deployment repo.
- `npm run analyze` - Bundle analysis of non-tree shaken bundle. lets you see the individual angular module pieces.
- `npm run analyze-deploy` - Bundle analysis of tree shaken bundle. kind of opaque, but truest to reality.
- `yarn upgrade-interactive` - Upgrade only what you want to.
- `npm run format` - formats with tsfmt (typescript-formatter) based on tsfmt.json settings. This script gets called automatically before `prep-dev-server` and `deploy`.

## Build Script Explained
- `npm run deploy`
	- first it runs `format` whichs reads options from tsfmt.json and formats code for consistent style.
	- second it runs `prep-front-end`
		- a: it runs `ng build prod` to build the frontend production app.
		- b: it runs `ng build --prod --app 1 --output-hashing=false` to build the server Aot Factory: `AppServerModuleNgFactory`
	- third it runs `prep-server` which uses nestjs.tsconfig.json to compile the server assets to js.
	- fourth it runs `copy-needed-files-to-deploy-folder` which copies yarn.lock and package.json for installing dependencies on server and moves the dist folder to angular-universal-pwa-starter-deploy (or whatever you name your folder ending in -deploy)
	- fifth it runs `deploy-to-github` which changes your directory to the deploy folder, then makes an auto generated commit of the contents of the deploy folder.

creating deployment on vps:
```
cd /var/www/
sudo git remote add origin https://github.com/EreckGordon/angular-universal-pwa-starter-deploy
sudo git pull origin master
yarn
```

updating deployment:
```
ssh root@ipv4 address
su - web
cd /var/www/
sudo git pull origin master
yarn
pm2 restart dist/server
```

## To Do List
- testing
- ~linting + standardize code formatting~ <-- tsfmt
- database migrations
- websocket
- comments / chat system
- configure environment variable for server like cli. This would allow insecure cookies during dev and secure during prod without fiddling by hand.
- copy over only a barebones package.json that just gives the dependencies, rather than the entire copy of package.json as currently implemented.