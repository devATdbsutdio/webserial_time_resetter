# web_serial_time_resetter

### prerequisite for testing locally:
**Generate ssl keys:**
```shell
mkdir ssl
cd ssl
openssl genrsa -out server.key 2048
openssl req -new -x509 -key server.key -out server.cert -days 365
```