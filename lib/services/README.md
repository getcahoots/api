# Cahoots - RESTful API - Services

The service layer of the Cahoots backend.

## Usage

```js
var services = require('cahoots-api-services');

var accountService = services('account');

```

## API

### AccountService

```js
var services = require('cahoots-api-services');

var accountService = services('account');

```

**Important note:** Please note that each method in the `AccountService` does not expose password hashes. The `password` and `salt` attributes will be removed from the account objects before passing them to the respective callback function.

#### `register(account, callback)`

Will register a new account. Please note that this method will hash the password internally (salt-based hashing):

```js

var service = services('account');
var account = {
    name: {first: 'André', last: 'König', password: 'test123'}
};

function onRegister (err, account) {
    if (err) {
        return console.error(err);
    }

    console.log(account.id); // => new id
    console.log(account.password); // => `undefined`
}

service.register(account, onRegister);

```

#### `authenticate(email, password, callback)`

Checks if the given user credentials are valid.

```js
var service = services('account');

function onAuth (err, account) {
    if (err) {
        return console.error(err); // Database error occurred
    }

    if (!account) {
        // Auth failed
    } else {
        // Auth successful
    }
}

```

#### `generatePassword(length)`

Generates a new random password where the optional `length` parameter specifies the password length (default = 10).

#### `findAll(callback)`

Finds all available account objects.

```js
var service = services('account');

function onFind (err, accounts) {
    if (err) {
        return console.error(err);
    }

    console.log(accounts); // Array with account objects (empty array when no account available).
}

service.findAll(onFind);
```

#### `findByEmail(email, callback)`

Finds an account object by a given email address.

```js
var service = services('account');

function onFind (err, account) {
    if (err) {
        return console.error(err);
    }

    console.log(account); // `undefined` when not found
}

service.findByEmail('andre@cahoots.ninja', onFind);
```

#### `findSuperuser(callback)`

Finds the one and only superuser.

```js
var service = services('account');

function onFind (err, superuser) {
    if (err) {
        return console.error(err);
    }

    console.log(superuser); // `undefined` when not found
}

service.findSuperuser(onFind);
```

### PersonService

#### `save(person, callback)`

Inserts or updates a person.

```js
var service = services('person');

var person = {
    name: 'André König',
    info: 'http://andrekoenig.info',
    cahoots: [
        {
            organization: '58b1a1a19a4365df2fa509092cd656719230669',
            source: 'http://cahoots.pw/about.html',
            role: 'Software Engineer'
        }
    ]
};

function onSave (err, person) {
    if (err) {
        return console.error(err);
    }

    console.log(person.id); // => e.g. f1000fa10c847b7599c9d0560d3d41e60b773164
}

service.save(person, onSave);
```

#### `findAll(callback)`

Finds all available persons.

```js
var service = services('person');

function onFind (err, persons) {
    if (err) {
        return console.error(err);
    }

    console.log(persons); // Array with person objects (empty array when no person available).
}

service.findAll(onSave);
```

#### `findById(id, callback)`

Find a person by a particular id.

```js
var service = services('person');

function onFind (err, person) {
    if (err) {
        return console.error(err);
    }

    console.log(person); // `undefined` when not found
}

service.findById('f1000fa10c847b7599c9d0560d3d41e60b773164', onFind);
```

### OrganizationService

#### `save(organization, callback)`

Inserts or updates an organization.

```js
var service = services('organization');

var organization = {
    name: 'Reporter ohne Grenzen',
    info: 'http://de.wikipedia.org/wiki/Reporter_ohne_Grenzen',
};

function onSave (err, organization) {
    if (err) {
        return console.error(err);
    }

    console.log(organization.id); // => e.g. e76ca9f8359f31bd4a99e01465c44b1a8ce35c09
}

service.save(organization, onSave);
```

#### `findAll(callback)`

Finds all available organizations.

```js
var service = services('organization');

function onFind (err, organizations) {
    if (err) {
        return console.error(err);
    }

    console.log(organizations); // Array with organization objects (empty array when no organization available).
}

service.findAll(onSave);
```

#### `findById(id, callback)`

Finds an organization by id.

```js
var service = services('organization');

function onFind (err, organization) {
    if (err) {
        return console.error(err);
    }

    console.log(organization); // `undefined` when not found
}

service.findById('e76ca9f8359f31bd4a99e01465c44b1a8ce35c09', onFind);
```

#### `findByIds(ids, callback)`

Finds multiple organizations an array of organization id's.

```js
var service = services('organization');

var ids = [
    'e76ca9f8359f31bd4a99e01465c44b1a8ce35c09',
    '95ed680482fe70b74753d356209dd6868f071052'
];

function onFind (err, organizations) {
    if (err) {
        return console.error(err);
    }

    console.log(organizations); // Array with organization objects (empty array when no organization available).
}

service.findByIds(ids, onFind);
```

## License

The MIT License (MIT)

Copyright (c) 2014-2015 Cahoots, Germany <info@cahoots.pw>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
