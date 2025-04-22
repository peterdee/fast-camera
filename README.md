## fast-camera

Real-time [FAST corner detector](https://docs.opencv.org/5.x/df/d0c/tutorial_py_fast.html) demo

Demo is available online: https://fast.dyum.in / https://fast-camera.vercel.app

Engines: Node **v22** & Golang **v1.24**

### Deploy

Clone the repository and install dependencies

```shell script
cd ./fast-camera
nvm use 22
npm ci
```

HTTPS is required in order to use camera (even for local development)

Create a directory for certificates

```shell script
mkdir certificates && cd ./certificates
```

Generate `key.pem` and `cert.pem` files in the `certificates` directory using OpenSSL

```shell script
openssl genrsa -out key.pem 2048
openssl req -new -sha256 -key key.pem -out csr.csr
openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out cert.pem
```

More details regarding certificates can be found [here](https://msol.io/blog/tech/create-a-self-signed-ssl-certificate-with-openssl/)

### Launch

- Run local development server

```shell script
npm run dev
```

Application will be available at https://localhost:3000

- Build static files for production

```shell script
npm run build
```

### Compile WASM binary

WASM binary is compiled from Golang source (Golang **v1.24** is required)

Golang FAST implementation is based on https://github.com/peterdee/go-fast

WASM binary is already included in the project, it can be recompiled with the following command

```shell script
npm run compile-wasm
```

### Cloud deployment

`release` branch of this repository is automatically deployed to [Vercel](https://vercel.com)

### License

[MIT](./LICENSE.md)
