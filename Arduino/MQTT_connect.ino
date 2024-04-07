#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Arduino_JSON.h>

JSONVar doc;
JSONVar response;

#define LED_PIN1 15
#define LED_PIN2 2
#define DHT_PIN 19
#define BELL_PIN 5
#define DHT_TYPE DHT11

#define LUX_PIN 34


// Khai bao network
// const char* ssid = "Android 2024";// tên mạng WIFI
const char* ssid = "NATO";// tên mạng WIFI
// const char* ssid = "Ngoc Chi";

// const char* password = "12345678";// Password truy cập
const char* password = "hust2004";
// const char* password = "19071969";

const char* username = "manhptit";
const char* passwd = "123";

// const char* mqtt_server = "172.20.10.2";
const char* mqtt_server = "192.168.1.6";
// const char* mqtt_server = "192.168.1.12";
// Địa chỉ IP của Broker.
const char* topicLed = "device/control/led";
const char* topicFan = "device/control/fan";
const char* topicResponse = "device/response";
const char* topicSensor = "sensor";
const char* topicWarning = "warning";
const char* topicTemp = "temp";
const char* topicHum = "hum";
const char* topicLight = "light  ";

WiFiClient espClient;
PubSubClient client(espClient);

DHT dht(DHT_PIN, DHT_TYPE);

bool ledState = false;
bool previousLedState = false;

bool addLedState = false;
bool addPreviousLedState = false;

bool fanState = false;
bool previousFanState = false;

void setup_wifi() {
  delay(10);
  // Bat dau ket noi voi wifi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Da ket noi WiFi");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a client ID
    String clientId = "ESP32Client-01";
    if (client.connect(clientId.c_str(), username, passwd)) {
      Serial.println("MQTT connected");
      
      if(client.subscribe(topicLed)) {
        Serial.printf("Subcribe to topic led \n");
      } else {
        Serial.println("Fail to sub to topic led!");
      }

      if(client.subscribe(topicFan)) {
        Serial.printf("Subcribe to topic fan\n");
      } else {
        Serial.println("Fail to sub to topic fan");
      }

      // if(client.subscribe(topicDevice)) {
      //   Serial.printf("Subcribe to topic device\n");
      // } else {
      //   Serial.println("Fail to sub to topic device");
      // }
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  String message ="";

  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println(message);

  if (strcmp(topic, "device/control/fan") == 0) {
    if (message == "on") {
      digitalWrite(LED_PIN2, HIGH);
      fanState = true;
    } else if (message == "off") {
      digitalWrite(LED_PIN2, LOW);
      fanState = false;
    }
    Serial.println("FAN State: " + String(fanState ? "ON" : "OFF"));
  }

  if (strcmp(topic, "device/control/led") == 0) {
    if (message == "on") {
      digitalWrite(LED_PIN1, HIGH);
      ledState = true;
    } else if (message == "off") {
      digitalWrite(LED_PIN1, LOW);
      ledState = false;
    }
  }
  Serial.println("LED State: " + String(ledState ? "ON" : "OFF"));

  // if (strcmp(topic, "device") == 0) {
  //   if (message == "on") {
  //     digitalWrite(LED_PIN1, HIGH);
  //     digitalWrite(LED_PIN2, HIGH);
  //   } else if (message == "off") {
  //     digitalWrite(LED_PIN1, LOW);
  //     digitalWrite(LED_PIN2, LOW);
  //   }
  // }
  // Serial.println("LED State: " + String(ledState ? "ON" : "OFF"));
}


void setup() {
  Serial.begin(9600);//Tốc độ truyền UART giữa ESP và PC
  setup_wifi();

  dht.begin();

  pinMode(LED_PIN1, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
  pinMode(BELL_PIN, OUTPUT);

  pinMode(LUX_PIN, INPUT);

  client.setServer(mqtt_server, 2002);
  client.setCallback(callback); 
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  delay(2000);

  if (ledState != previousLedState) {
    previousLedState = ledState;
    String ledMessage = (ledState ? "on" : "off");
    response = JSONVar();
    response["led"] = ledMessage.c_str();
    client.publish(topicResponse, JSON.stringify(response).c_str());
    Serial.println("Published LED State: " + ledMessage);
  }

  if (fanState != previousFanState) {
    previousFanState = fanState;
    String fanMessage = (fanState ? "on" : "off");
    response = JSONVar();
    response["fan"] = fanMessage.c_str();
    client.publish(topicResponse, JSON.stringify(response).c_str());
    Serial.println("Published fan State: " + fanMessage);
  }
  // put your main code here, to run repeatedly:

  int h = (int)dht.readHumidity();
  int t = (int)dht.readTemperature();

  int lux = analogRead(LUX_PIN);

  if(t > 30 ){
    String canhbao = "on";
    digitalWrite(BELL_PIN, HIGH);

    client.publish(topicWarning, canhbao.c_str());
  }
  else {
    String canhbao = "off";
    digitalWrite(BELL_PIN, LOW);

    client.publish(topicWarning, canhbao.c_str());
  }

  if (isnan(h) || isnan(t) || isnan(lux)) {
    Serial.println("Read data failed !!");
  } else {
    doc["temp"] = t;
    doc["hum"] = h;
    doc["light"] = lux;

    String jsonString = JSON.stringify(doc);
    client.publish(topicSensor, jsonString.c_str());
    
    client.publish(topicTemp, String(t).c_str());
    client.publish(topicHum,String(h).c_str());
    client.publish(topicLight, String(lux).c_str());
    // Serial.println(jsonString);
  }
}
