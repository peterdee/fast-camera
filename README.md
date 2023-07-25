## fast-camera

Real-time [FAST corner detector](https://docs.opencv.org/5.x/df/d0c/tutorial_py_fast.html) demo

Demo is available online: https://fast.dyum.in / https://fast-camera.vercel.app

### Deploy

```shell script
git clone https://github.com/peterdee/fast-camera
cd ./fast-camera
nvm use 18
npm ci
```

### Launch

#### Development

Create a directory for certificates

```shell script
mkdir certificates && cd ./certificates
```

Generate `key.pem` and `cert.pem` files in the `certificates` directory

```shell script
openssl genrsa -out key.pem 2048
openssl req -new -sha256 -key key.pem -out csr.csr
openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out cert.pem
```

More details regarding certificates can be found [here](https://msol.io/blog/tech/create-a-self-signed-ssl-certificate-with-openssl/)

Run the server

```shell script
npm run dev
```

Development server will be available at https://localhost:3000

### WASM

WASM binary is compiled from Golang source (Golang **v1.20** is required)

Golang FAST implementation is based on https://github.com/peterdee/go-fast

WASM binary is already included in the project, it can be recompiled with the following command

```shell script
npm run compile
```

WASM binary can be compiled with [TinyGO](https://tinygo.org), in that case the [public/wasm_exec.js](./public/wasm_exec.js) file should be replaced

### Vercel

`release` branch of this repository is automatically deployed to [Vercel](https://vercel.com)

### License

[MIT](./LICENSE.md)
