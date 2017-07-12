# shazam-middleware

## What is shazam?
* Shazam it's a `express` middleware to print on console of your application. His difference is that it notify the slack channel when occurs errors without validation.

## Requirements
* Node
* [Express](https://www.npmjs.com/package/express)

## Installation
```bash
npm install --save shazam-middleware
```

## Code Example
```js
const app = require('express')();
const package = require('./package.json');
// Don't forget to configure the paramters
const shazam = require('shazam-middleware')({
    slack: {
        urlHook: process.env.urlHook,
        channel: process.env.channel,
        iconUrl: process.env.iconUrl,
        botusername: process.env.botusername
    },
    api: {
        name: 'My App',
        version: package.version
    }
});

app.use(shazam.log);

// Look Here, one route with error
app.get("/error", (req, res, next) => {
    travel
    res.status(200).send({ retorno: 'ok' })
})

app.use(shazam.exception);

app.listen(4600, () => {
    console.log('APP WORKS http://localhost:4600')
})

```

## Example of console log
![alt text](https://image.prntscr.com/image/3KmzXvsjQfC-6TfHrMwx1A.png "Log Exemple")

## Return of JSON
![alt text](https://image.prntscr.com/image/ATA3JtYjSs6MzIsQKBSE2Q.png "Log Exemple")

