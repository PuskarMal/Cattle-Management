#include <DHT.h>
#include <DHT_U.h>
#include <Servo.h>
#include <Adafruit_SSD1306.h>
#include <splash.h>
#include <Adafruit_GFX.h>
#include <Adafruit_GrayOLED.h>
#include <Adafruit_SPITFT.h>
#include <Adafruit_SPITFT_Macros.h>
#include <gfxfont.h>
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
#define FLAME_SENSOR_1 2
#define FLAME_SENSOR_2 3
#define GAS_SENSOR A1
#define GAS_LED 8
#define WATER_LED 4
#define FIRE_LED 5
#define WATERSENSOR A0
#define SERVO1_PIN 9
#define SERVO2_PIN 10
#define DHTPIN 11
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
Servo servo1, servo2;
const int INP1 = 6;
const int INP2 = 13;
void setup() {
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("OLED Hardware not found"));
    for(;;); 
  }
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(10, 20);
  display.println("READY");
  display.display();
  delay(2000);
  dht.begin();
  pinMode(FLAME_SENSOR_1, INPUT);
  pinMode(FLAME_SENSOR_2, INPUT);  
    pinMode(GAS_SENSOR, INPUT);
    pinMode(WATERSENSOR, INPUT);
    pinMode(FIRE_LED, OUTPUT);
    pinMode(WATER_LED, OUTPUT);
    pinMode(GAS_LED, OUTPUT);
    servo1.attach(SERVO1_PIN);
    servo2.attach(SERVO2_PIN);
    servo1.write(0);
    servo2.write(0);
    digitalWrite(FIRE_LED, LOW);
    digitalWrite(WATER_LED, LOW);
    digitalWrite(GAS_LED, LOW);
    pinMode(INP1, OUTPUT);
    pinMode(INP2, OUTPUT);
  
}
void loop() {
  float temperature = dht.readTemperature();
  int gasValue = analogRead(GAS_SENSOR);
  int waterValue = analogRead(WATERSENSOR);
  bool fireDetected = (digitalRead(FLAME_SENSOR_1) == LOW || digitalRead(FLAME_SENSOR_2) == LOW);
  if (isnan(temperature)) {
    Serial.println("Failed to read DHT!");
    return;
  }
  if (fireDetected) {
    digitalWrite(FIRE_LED, HIGH);
    servo1.write(90);
    servo2.write(180);
    Serial.println("ALERT: FIRE!");
  } 
  else if (gasValue > 400) {
    digitalWrite(GAS_LED, HIGH);
    servo1.write(0);
    servo2.write(0);
    Serial.println("ALERT: GAS LEAK!");
    analogWrite(INP1, 180);
    delay(2000);
  } 
  else if (waterValue < 300) {
    digitalWrite(WATER_LED, HIGH);
    servo1.write(0);
    servo2.write(0);
    Serial.println("ALERT: LOW WATER!");
  } 
  else {
    // Normal State
    digitalWrite(GAS_LED, LOW);
    digitalWrite(WATER_LED, LOW);
    digitalWrite(FIRE_LED, LOW);
    servo1.write(0);
    servo2.write(0);
    Serial.println("STATUS: NORMAL");
  }
  if (temperature > 24){
    analogWrite(INP2,180);
  }
  else{
    analogWrite(INP2,40);
  }
  // 4. Update OLED Display
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Temp: "); display.print(temperature); display.println("C");
  display.print("Gas:  "); display.println(gasValue);
  display.print("Water:"); display.println(waterValue);
  display.println("----------------");
  display.setCursor(0, 45);
  display.setTextSize(2);
  if (fireDetected) display.print("FIRE!");
  else if (gasValue > 400) display.print("GAS!");
  else if (waterValue < 300) display.print("LOW H2O");
  else display.print("SYSTEM OK");
  display.display();
  delay(500);
}