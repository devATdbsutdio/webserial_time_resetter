# web_serial_time_resetter

### prerequisite for testing locally:
**Generate ssl keys:**
```shell
mkdir ssl
cd ssl
openssl genrsa -out server.key 2048
openssl req -new -x509 -key server.key -out server.cert -days 365
```
### How to avoid self certificate related botheration?
1. macOS: chrome won't see the `proceed anyway` button even you click `advanced` button. To still proceed, make sure the page is selected (click anywhere on the screen), and just type `thisisunsafe`
2. macOS: Alternatively, one can also launch chrome from terminal like this: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --ignore-certificate-errors --ignore-urlfetcher-cert-requests &> /dev/null`