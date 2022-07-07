# :no_entry: DEPRECATED :no_entry:

This repository is no longer being maintained. Further developments to this repository can be made by forking the project.

Serverless JSON Environment Plugin
=============================
[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) 
[![npm version](https://badge.fury.io/js/serverless-plugin-jsonenv.svg)](https://badge.fury.io/js/serverless-plugin-jsonenv)
[![npm downloads](https://img.shields.io/npm/dm/serverless-plugin-jsonenv.svg)](https://www.npmjs.com/package/serverless-plugin-jsonenv)
[![license](https://img.shields.io/npm/l/serverless-plugin-jsonenv.svg)](https://raw.githubusercontent.com/FidelLimited/serverless-plugin-jsonenv/master/LICENSE)

Merge a JSON file with your provider or functions environment objects.

**Requirements:**
* Serverless *v1.12.x* or higher.
* AWS provider

## How it works

JSON Environment plugin will parse and merge with your environment objects whatever JSON string you pass.
This plugin is useful to use with the new S3 variables syntax avoiding the hassle to add individually all environment Key/Value to S3. 

## Setup

 Install via npm in the root of your Serverless service:
```
npm install serverless-plugin-jsonenv --save-dev
```

* Add the plugin to the `plugins` array in your Serverless `serverless.yml`:

```yml
plugins:
  - serverless-plugin-jsonenv
```

* Add `environmentJSON: ${s3:myBucket/myEnvironment.json}` property to `provider` or `function`:

```yml
provider:
  environmentJSON: ${s3:myBucket/providerEnvironment.json}
```

```yml
functions:
  hello:
    environmentJSON: ${s3:myBucket/helloEnvironment.json}
```

* All done! JSON Environment will run on SLS `deploy` and `invoke local` commands

## Contribute

Help us making this plugin better and future proof.

* Clone the code
* Install the dependencies with `npm install`
* Create a feature branch `git checkout -b new_feature`
* Lint with standard `npm run lint`

## License

This software is released under the MIT license. See [the license file](LICENSE) for more details.
