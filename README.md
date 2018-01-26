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
- [Postgres Config](https://github.com/EreckGordon/angular-universal-pwa-starter/blob/master/server/modules/database/database.providers.ts) You have a database with the same configuration as linked, or you change that config to database user info of your choosing.

## Files that require changes for a fresh project
- /src/app/app.common.module.ts `{appId: 'angular-universal-pwa-starter'}`
- /server/modules/database/database.providers.ts set your database `username`, `password`, and  `database` fields.
- `private.key` and `public.key` generate your own. Don't store your production keys on github.
- dotenv: create a file called `.env` in the root of the project (ie next to readme.md). Do not save it to source control. Give it the following variables:
	```
	SESSION_ID_SECURE_COOKIE=false
	POSTGRES_PORT=5432
	POSTGRES_USERNAME=postgres
	POSTGRES_PASSWORD=testingpass
	POSTGRES_DATABASE=testingDB
	MAILGUN_API_KEY=yourAPIKey
	MAILGUN_EMAIL_DOMAIN=mail.yourwebsite.com
	SITENAME_BASE=yourwebsite.com	
	SITE_URL=http://localhost:4200
	```
- create another `.env` file in your deploy folder, it will have the same variable names, but with values suited for a production environment.

## Thoughts
- why bother with a depoyment repo? precompile everything on your dev environment, it is probably a beefier machine.

## Useful Commands
- `ng serve --aot` - Run in frontend aot development mode on port 4200.
- `npm run dev-server` - Runs server on port 8000 via ts-node, assumes no frontend changes in regards to rendering with universal. 
- `npm run prep-dev-server` - Full build of frontend, then serves frontend and backend on port 8000 via ts-node.
- `npm run deploy` - Build and push server & frontend assets to github deployment repo.
- `npm run analyze-aot` - Bundle analysis of non-tree shaken bundle. lets you see the individual angular module pieces.
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
- ~linting + standardize code formatting~ <-- tsfmt
- testing
	- ~frontend~ <-- angular-cli has working tests now.
	- backend
- ~configure environment variable for server like cli. This would allow insecure cookies during dev and secure during prod without fiddling by hand.~ <-- dotenv
- ~`Error: Could not extract user from request: jwt expired` need to deal with expired JWT.~
	- ~attempt to renew token, if user no longer exists on db flush cookies~
	- ~refactor auth-service so it isn't just one large file.~
- ~frontend auth module~
	- ~observable auth service~
	- ~guards~
	- request password reset
		- component
		- ~server functionality~
	- password reset
		- component
		- server functionality
- refactor backend auth to handle multiple types of logins.
	- ~email and password~
	- ~anonymous~
	- social: google
	- social: facebook
	- social: twitter
	- social: github
- ~baseUrl as a part of environment~
- database migrations
- websocket
- comments / chat system
- copy over only a barebones package.json that just gives the dependencies, rather than the entire copy of package.json as currently implemented.
- SEO Stuff: remove keywords (useless apparently), add the og: and other static meta stuff to index.
- auth controller: delete user
- auto delete anonymous users over a certain age. maybe a cron job? maybe with a subject.

- test prerequisite: wipe out testing database.
- needed tests
	- username / password auth
		- login non-existent user (fails)
		- create new user(1)
		- create same user (fails)
		- logout
		- login user(1)
		- logout
		- create user(2)
		- logout
		- login user(2)
		- create user(3) rapidly. first time success, subsequent fails -- to verify not caching something we shouldn't
	- anonymous auth
		- create anonymous user(1)
		- logout attempt (fail, insufficient permission)
		- upgrade user to username / password, user id stays same
		- upgrade anonymous user when not logged in (fails)
		- upgrade anonymous user when account already has associated email (fails)