# cahoots.pw

This repository contains the API of the [cahoots.pw](http://cahoots.pw) project.

You find a rough architecture description in the [wiki](https://github.com/cahoots-extension/api/wiki).

## Usage

We use [docker](https://docker.io) in order to run the API.

After cloning the repository

```sh
$ git clone https://github.com/getcahoots/api
```

you have to build the Docker image first:

```sh
$ docker build -t cahoots.pw/api .
```

Afterwards you're able to spin-off a container out of the image via:

```sh
$ docker run -d -p 9090:9090 cahoots.pw/api
```

Now you can send HTTP requests to the API. An example:

```sh
$ curl http://localhost:9090/v1/persons
```

Should be an empty response at the moment :)


## License

The MIT License (MIT)

Copyright (c) 2014-2015 cahoots.pw, Germany <info@cahoots.pw>

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
