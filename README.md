<!-- ## Document
Api doc: [http://hostname/apidoc](http://hostname/apidoc) \

## Installation
Install Node14, pm2, docker, docker-compose
```bash
cd nest-base
npm install
```

## Config & Pre-Run
Create  file `.env` from file `.env.example`. \

## Running the app
### dev mode
```
docker-compose up -d
npm run start:dev -->

# PROJECT IOT-2024

Project được thực hiện với các nền tảng NodeJS - NestJS, PostgreSQL, MQTT Broker, Arduino IDE, NextJS14, Socket.IO cùng các thư viện khác.

## Cài đặt project

Tiến hành clone project bằng câu lệnh git clone trong terminal. Sau đó, thực hiện các câu lệnh sau trong terminal của Visual Studio Code:

### Vào thư mục server, sau đó cài đặt các thư viện của npm

1. Installation

```bash
cd server_iot
npm install
```

2. Confif & Pre-Run
   Create file `.env` from file '.env.example'. \

3. Running the app

```bash
docker-compose up -d
npm run start:dev
```

### Vào thư mục iot-app, sau đó cài đặt các thư viện của npm

1. Installation

```bash
npm install
```

2. Running the app

```bash
npm run dev
```

## Arduino

1. [Cài đặt Arduino](https://www.arduino.cc/en/software)
2. [Arduino Configuration](https://cedalo.com/blog/how-to-install-mosquitto-mqtt-broker-on-windows/)
3. [Bật tắt đèn](https://www.emqx.com/en/blog/esp8266_mqtt_led)
4. [Pub Sub dữ liệu bằng MQTT](https://randomnerdtutorials.com/esp32-mqtt-publish-subscribe-arduino-ide/)
5. [DHT11 với ESP32](https://randomnerdtutorials.com/esp32-dht11-dht22-temperature-humidity-sensor-arduino-ide/)
6. [Light Sensor Module với ESP32](https://esp32io.com/tutorials/esp32-ldr-module)
7. Thay đổi các giá trị sau trong file "reconnectIOT.ino" ở folder arduino cho phù hợp với Wifi và MQTT Broker:

```
const char *ssid = "<YOUR_WIFI_SSID>";
const char *password = "<YOUR WIFI PASSWORD>";
const char *mqtt_server= "<YOUR HOST>";
const int mqtt_port = <YOUR MQTT PORT NUMBER>;
const char *mqtt_username = "<YOUR MQTT USERNAME>";
const char *mqtt_password = "<YOUR MQTT PASSWORD>";
```

## Database trong PostgreSQL

- Tạo database với tên "iot",

## API Documentations

- Sau khi khởi động server, truy cập vào:
  [API Docs](https://documenter.getpostman.com/view/29359206/2sA2xpRogP)

```

```
