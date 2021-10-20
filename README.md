# Commerce.js for Contentful

This app enables the selection of products from you Commerce.js store on **Short text** or **Short text, list** fields.

## Installing the app

### One click:

[![Install to Contentful](https://www.ctfstatic.com/button/install-small.svg)](https://app.contentful.com/deeplink?link=apps&id=6RSa3c0pIawfk9yAXsIYzQ)

### Manual

1. In your Contentful organization, create a new private app called 'Commerce.js App'.
2. Enter `https://contentful-app.chec.io` in the **App URL** field.
3. Under Locations, select **App configuration screen**, **Entry field**, and the **Short text** and/or **Short text, list** field types.
4. Save the configuration and click **Install to space**
5. Enter your Commerce.js public key.
6. Click **Save**. The app is now ready to use.

---

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run upload`

Uploads the build folder to contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is   
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set: 

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)

## Libraries to use

To make your app look and feel like Contentful use the following libraries:

- [Forma 36](https://f36.contentful.com/) – Contentful's design system
- [Contentful Field Editors](https://www.contentful.com/developers/docs/extensibility/field-editors/) – Contentful's field editor React components

## Using the `contentful-management` SDK

With the SDK and the `contentful-management` package installed, you can also 
create an instance of the `contentful-management` client using the `cmaAdapter`, 
which is part of the SDK, without passing the access token.

Install the package

```bash
npm i @contentful/contentful-management@latest @contentful/app-sdk@canary
```

Use it in your app

```js
import { init } from '@contentful/app-sdk'
import { createClient } from 'contentful-management'


init(sdk => {
  // Create the client scoped to current space-environment
  const cma = createClient(
    { apiAdapter: sdk.cmaAdapter },
    {
      type: 'plain',
      defaults: {
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
    }
  );

  // Use the client
  cma.locale.getMany({}).then((locales) => console.log(locales))
})

```

Visit the [`contentful-management` documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library)
to find out more.

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.
