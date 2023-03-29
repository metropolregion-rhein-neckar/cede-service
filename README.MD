# cede-service - CKAN External DCAT-AP.de Endpoint Service

## What is this?

cede-service is a simple web service which provides a basic DCAT-AP.de interface
for CKAN. It was specifically designed to be harvested by the german GovData 
portal ( https://www.govdata.de/ ) and contains some features which are specific to this use case. 
However, it can also be used as a generic DCAT-AP.de endpoint for CKAN, without a specific target harvester in mind.


cede-service is not a true, "native" CKAN extension. It runs as a standalone service and communicates with CKAN through CKAN's JSON HTTP API.

cede-service is written in TypeScript, a superset of JavaScript. Its source code is compiled to plain JavaScript by the TypeScript compiler. 
The compiled JS code then runs on Node.js, a JavaScript runtime environment for software like command line tools, web services and others.

## Installation, Step 1: Prerequisites

To install and run cede-service, you need the following prerequisites installed on your computer:

- Node.js
- npm
- The TypeScript compiler

For all software listed above, "recent" versions are expected. We haven't tested what
exactly "recent" means in each case, but if you install the latest versions available at the time
when you read this, you are probably fine.

## Installation, Step 2: Cloning and Compiling

To set up cede-service on your computer, complete the following steps:

1. Clone the repository to your disk

2. Point your command line to the repository folder and run the command "`npm install`". This will download required third-party JS packages.

3. Open the file `src/index.ts` in your text editor. Find the `config` object near the beginning of the file and change its properties according to your requirements:

    `ckanBaseUrl`: The base URL of the CKAN instance you'd like to expose with this service

    `contributorId`: Your organization's GovData contributor ID. Contact GovData to get one.

    `publisherFoafName`: The name of your organization as specified by the "Friend of a Friend" (FOAF) ontology.

    `publisherId`: Your organization's publisher ID. This must be an URI.

    `port`: The network port on which you want this service to listen.

4. Run the command "`tsc`". This invokes the TypeScript compiler and generates runnable JS code from the original TypeScript (.ts) source file. The generated JS files will be placed in a subfolder named `dist`.

## Installation, Step 3: Running

To start the program, run the command "`node .`". This tells the Node.js runtime environment to
run the file `index.js` in the current working directory. index.js is a "wrapper" file which
simply calls the actual program code which resides in the `dist` folder.

The output of the service can now be requested by submitting a HTTP request to 

`http://<your server hostname>:<your configured port>`.

## Setting up as a system service

If you plan to use cede-service as a permanently running web service (which is the only really meaningful way to use it), you'll probably want to set it up as a system service on your server machine, for example using a solution like systemd on
Linux. Please refer to the documentation of your server operating system for information on
how to achieve this.
