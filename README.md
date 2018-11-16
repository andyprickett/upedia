# Upedia ("ooo-pedia")

#### Full-stack web application that allows users to create, collaborate, and share wikis.

## Features
* Public wikis and user profiles, available to be read by any user/visitor.
* User accounts available at both "Standard" and "Premium" levels.
* Signed-in user accounts allow creation, updating, and deleting of wikis.
* Signed-in "Premium" users can create private wikis, and share collaboration on them with other users (including "Standard" users).
* Private wikis are not exposed to public viewing, or non-collaborator "Standard" users.
* Wikis can be written in markdown syntax and will render properly.
* User Signup produces a welcome email to the user.
* Upgrading to a "Premium" account handled by a pay system.
* Downgrading user accounts to "Standard" available, and user's private wikis (if any) returned to being pubic.

## Technologies
* Node backend with Express framework.
* Server-rendered pages using EJS templates.
* Sequelize ORM with PostgreSQL database.
* SendGrid service for user signup email.
* Stripe service for user account upgrade payment.
* Markdown rendered by [markdown-js](https://www.npmjs.com/package/markdown).
* Tests written in Jasmine.
* User authentication via Passport.
* Styling (or lack therof) with Bootstrap. Just enough to get things up and running, as the name indicates.

## Comments and Complications
This application is based on a project completed for the Bloc Web Developer Track program. It is operational on my local machine, and in a [live deployment on Heroku](https://upedia.herokuapp.com/). There are some problems, however, and some improvements to be made:

* The tests do not pass when they are all run at once. Something is amiss in the order of events, and I've yet to track it down.
* The landing page has "Free Plan" and "Premium Plan" buttons that are intended to go somewhere useful eventually, but currently go nowhere.
* I intend to add a "markdown live preview" window on the wiki "new" and "edit" pages.
* I'm not positive that the project as it stands is robust enough for a true, real-world production deployment.

## Usage
I am using this project for learning and experimentation with technologies. If you choose to clone it, please be aware of some things:

* You'll need to create a `.env` file in the root folder of your version of the project, and add a `cookieSecret` variable set to equal a string of your choosing.
* You'll need to create an account with Stripe, and API keys that you will use in your version of the application, per this guide: [Stripe quickstart](https://stripe.com/docs/quickstart).
* You'll need to create an account with SendGrid, and an API key that you will use in your version of the project. This includes needing to create a `sendgrid.env` file in the root folder, per this guide: [SendGrid setup](https://app.sendgrid.com/guide/integrate/langs/nodejs).
* The email sent out to new users will need to be customized by hand with your branding/message.
* The versions of all packages in `package.json` are carefully restricted. Allowing some of them to update to anything other than bug-fix versions will/may result in breaking changes (I'm lookin' at you Sequelize, express-validator and Request).
* Create and configure your local databases using the Sequelize CLI and the `src/db/config/congig.json` file.
* Seed files are included. Run using `sequelize db:seed:all`.
* Run a test for each resource individually with `npm test spec/(integration || unit)/(test file name)`.

