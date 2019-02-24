# MT frontend

This is the store page && cast page for CRM Project

## Code scaffolding

Check the full generators on <https://github.com/angular/angular-cli>

## Prerequisites

- [Git](https://git-scm.com/)
- [NVM](https://github.com/creationix/nvm)
- NodeJS: v8.9 LST
- [EditorConfig](http://editorconfig.org/)
- yarn: v1.7.0

## libraries

- [angular](https://angular.io/docs)
- [bootstrap](http://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/)

## How to setup

1. Clone the repos

   ```
   git clone git@bitbucket.org:mtdanang/mt-hotel-frontend.git
   ```

2. Apply NodeJS and yarn

   - install node && use target version node

   ```
   nvm install v8.9 && nvm use v8.9
   ```

   - install yarn package

   ```
   npm install -g yarn@1.7.0
   ```

3. Install all required packages

   ```
   yarn install
   ```

4. Clonning new environment file from **src/environments/environment.ts** and change add the corresponding values

   - clone evironment

   ```
   cp src/environments/environment.ts src/environments/environment.<mode>.ts
   ```

5. Run the project and view the site

   ```
   yarn serve:<mode>
   ```

6. Build project
   ```
   yarn build:<mode>
   ```
