# Angular Universal PWA Starter
Angular Universal PWA Starter built with Angular Cli on Nestjs with TypeORM + Postgres. Auth with jsonwebtoken library.

## Demo:
[Universal PWA Starter Demo](https://universal-demo.ereckgordon.com)

## Assumptions
- angular cli
- yarn (dependency management)
- angular 5.0+ (new service worker)
- I have provided public and private keys for demonstration purposes only. Please do not use them in your project.
	- don't even check your real keys into source control.
- You have another folder called angular-universal-pwa-starter-deploy on the same level that you have angular-universal-pwa-starter.
	- [Example deploy repo](https://github.com/EreckGordon/angular-universal-pwa-starter-deploy)
	- angular-universal-pwa-starter-deploy contains:a git repo, .gitignore, and .gitattributes. You will copy over the needed files with build scripts. It is the deployment folder that you pull from to update the server.
	- The various build scripts compile the server and move the dist folder & package.json to the angular-universal-pwa-starter-deploy folder.
- [Postgres Config](https://github.com/EreckGordon/angular-universal-pwa-starter/blob/master/server/modules/database/database.providers.ts) You have a database with the same configuration as linked, or you change that config to database user info of your choosing.
- [Change SEO Defaults](https://github.com/EreckGordon/angular-universal-pwa-starter/blob/master/src/app/shared/seo/seo.service.ts#L13)

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
- why bother with a depoyment repo? precompile everything on your dev environment, it is probably a beefier machine. A $5 Digital Ocean droplet runs out of memory when trying to run `ng build --prod`, so let's just skip that pain entirely.

## e2e testing in watch mode
- 3 terminals: 
	- `npm run dev-server` to run the api
	- `ng serve --aot --env=e2e` to run the frontend which protracter will use in watch mode
	- `npm run e2e:watch` e2e tests which rerun upon file save.

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
- ~linting + standardize code formatting~ <-- ~tsfmt~ prettier
- ~testing~
	- ~frontend~ <-- angular-cli has working tests now.
	- ~backend~ <-- e2e is only coverage currently.
- ~configure environment variable for server like cli. This would allow insecure cookies during dev and secure during prod without fiddling by hand.~ <-- dotenv
- ~`Error: Could not extract user from request: jwt expired` need to deal with expired JWT.~
	- ~attempt to renew token, if user no longer exists on db flush cookies~
	- ~refactor auth-service so it isn't just one large file.~
- ~frontend auth module~
	- ~observable auth service~
	- ~guards~
	- ~request password reset~
		- ~component~
		- ~server functionality~
	- ~password reset~
		- ~component~
		- ~server functionality~
	- ~account management component~
		- ~delete user modal~
		- ~change password inline (\*ngIf)~
	- ~logout component~
	- ~inform user of errors with snackbar~
	- ~add recaptchaV2~
		- ~create account~
		- ~login~
		- ~request password reset~
- refactor backend auth 
	- to handle multiple types of logins.
		- ~email and password~
		- ~anonymous~
		- ~social: google~
		- ~social: facebook~
		- social: twitter
		- social: github
	- ~to email users~
		- ~to reset their password upon forgetting it~
	- change return user info -- currently giving email of logged in user (even if they have multiple emails associated with their account)
		- maybe give array of all account emails?
		- notify user of their currently logged in method
			- maybe have little svgs of each type of login method associated with account
			- and logged in method is highlighted, or maybe explicitly called out as logged in
	- identify common functionality and refactor. I know there are a good amount of times where I repeat code that I shouldn't.
	- inconsistency - upgrading from anonymous to various users.
		- social users delete the old anonymous user from database after taking what they need.
			- this is because i assume that there could be an existing user that you just forgot to sign in as, and the server takes care of the rest
		- username/password users use the uid of the anonymous user. 
			- it never assumes you have an existing account.
		- i think this would be best resolved by having username / pw more closely mimic the way social providers handle it.
			- this will take some refactoring i believe.	
		- ps: does this even matter at all?
- ~baseUrl as a part of environment~
- ~social provider upgrades:~
	- ~upgrade anonymous user to social account~
	- ~fix account management page~
		- ~edit pw only if you have a username/password combo for our site.~
		- ~merge accounts - if you have 2+ accounts, login as one to merge with other.~
			- ~link google provider~
			- ~link facebook provider~
			- ~link email and password provider~
				- ~also need frontend built, making sure to send email, password, and `provider: 'emailAndPassword'`~
	- ~delete account:~
		- ~make sure to clean up all login providers when deleting account.~
			- ~delete providers~
			- ~unauthorize account from provider permissions~			    		
- ~recaptchas everywhere that you can sign in or create account. missing in a few areas:~
	- ~social sign in page~
	- ~social link page~
	- ~username/password link page~	
- ~SEO Stuff:~ 
	- ~remove keywords (useless apparently)~
	- ~add og:~ 
	- ~add twitter:~
	- ~add itemprop (schema.org)~
    - ~read up on json-ld to determine what properties it requires~
- ~ssr module -- currently AppController eats any get requests. Put it into its own module and import it last, so it only eats unused routes, letting us use get requests.~
- ~wipe out frontent functions except create anonymous user as hello world to server + db~
- ~frontend has an unauthorize function. i think it may be useless, because the server should just handle unauthorize upon account deletion.~
- ~websocket~ <-- see auth gateway + auth cache.
- ~update auth module middleware usage~

- Move shared interfaces to dedicated shared folder.
- Rename from `src` to `frontend` to clarify intentions.

- google analytics
- file uploads with dropzone
- flesh out blog
- service worker push
- second theme - simultaneously active for additional color options
- comments / chat system
- database migrations
- copy over only a barebones package.json that just gives the dependencies, rather than the entire copy of package.json as currently implemented.
- auto delete anonymous users over a certain age. maybe a cron job? maybe with a subject.
- self-hosted fonts, icons (maybe?)

- needed tests
	- username / password auth
		- forgotten password reset
	- anonymous auth
		- create anonymous user
		- upgrade user to username / password, user id stays same
		- upgrade anonymous user when account already has associated email (fails)
	- social auth
		- google
		- facebook
	- unit tests front and backend
