## fast-camera

Real-time FAST corner detector demo

### Deploy

```shell script
git clone https://github.com/peterdee/fast-camera
cd ./fast-camera
nvm use 20
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

Run the server

```shell script
npm run dev
```

Development server will be available at https://localhost:3000

### License

[MIT](./LICENSE.md)
