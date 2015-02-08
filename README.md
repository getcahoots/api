# cahoots.pw

This repository contains the API of the [cahoots.pw](http://cahoots.pw) project.

You find a rough architecture description in the [wiki](https://github.com/cahoots-extension/api/wiki).

## Usage

We use [docker](https://docker.io) in order to run the API.

After cloning the repository

```sh
$ git clone https://github.com/cahoots-extension/api
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


## Authors

  * [Jonas Bergmeier](mailto:jonas.bergmeier@gmail.com)
  * [Alexander Barnickel](mailto:alex@alba.io)
  * [André König](mailto:andre.koenig@posteo.de)
