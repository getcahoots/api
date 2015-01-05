# cahoots.pw

This repository contains the backend system of the [cahoots.pw](http://cahoots.pw) project.

You find a rough architecture description in the [wiki](https://github.com/akoenig/cahoots-backend/wiki).

## Usage

We use [docker]() in order to run the backend.

After cloning the repository

```sh
$ git clone https://github.com/cahoots-extension/backend
```

you have to build the Docker image first:

```sh
$ docker build -t cahoots.pw/backend .
```

Afterwards you're able to spin-off a container out of the image via:

```sh
$ docker run -d -p 8080:8080 cahoots.pw/backend
```

Now you can send HTTP requests to the API. An example:

```sh
$ curl http://localhost:8080/persons
```

Should be an empty response at the moment :)


## Authors

  * [Jonas Bergmeier](mailto:jonas.bergmeier@gmail.com)
  * [Alexander Barnickel](mailto:alex@alba.io)
  * [André König](mailto:andre.koenig@posteo.de)
