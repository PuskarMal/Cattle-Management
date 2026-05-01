#include <Wire.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Servo.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// ---------------- SENSOR PINS ----------------
#define FLAME_SENSOR_1 2
#define FLAME_SENSOR_2 3
#define GAS_SENSOR      A1
#define WATER_SENSOR    A0

// ---------------- LED PINS ----------------
#define GAS_LED   8
#define WATER_LED 4
#define FIRE_LED  5

// ---------------- SERVO PINS ----------------
#define SERVO1_PIN 9
#define SERVO2_PIN 10

// ---------------- DHT ----------------
#define DHTPIN 11
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// ---------------- FAN PINS ----------------
// Cooling fan controlled by temperature
#define COOLING_FAN 6

// Exhaust fan controlled by gas sensor
#define EXHAUST_FAN 13

Servo servo1, servo2;

void setup() {

  Serial.begin(9600);

  // OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED not found");
    while (1);
  }

  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(10, 20);
  display.println("READY");
  display.display();

  delay(2000);

  // Sensors
  pinMode(FLAME_SENSOR_1, INPUT);
  pinMode(FLAME_SENSOR_2, INPUT);
  pinMode(GAS_SENSOR, INPUT);
  pinMode(WATER_SENSOR, INPUT);

  // LEDs
  pinMode(GAS_LED, OUTPUT);
  pinMode(WATER_LED, OUTPUT);
  pinMode(FIRE_LED, OUTPUT);

  // Fans
  pinMode(COOLING_FAN, OUTPUT);
  pinMode(EXHAUST_FAN, OUTPUT);

  // Servos
  servo1.attach(SERVO1_PIN);
  servo2.attach(SERVO2_PIN);

  servo1.write(0);
  servo2.write(0);

  // DHT
  dht.begin();
}

void loop() {

  // ---------------- READ SENSORS ----------------
  float temperature = dht.readTemperature();

  int gasValue = analogRead(GAS_SENSOR);
  int waterValue = analogRead(WATER_SENSOR);

  bool fireDetected =
    (digitalRead(FLAME_SENSOR_1) == LOW ||
     digitalRead(FLAME_SENSOR_2) == LOW);

  if (isnan(temperature)) {
    Serial.println("DHT Error");
    return;
  }

  // ---------------- RESET OUTPUTS ----------------
  digitalWrite(FIRE_LED, LOW);
  digitalWrite(GAS_LED, LOW);
  digitalWrite(WATER_LED, LOW);

  digitalWrite(EXHAUST_FAN, LOW);

  // ---------------- FIRE CONDITION ----------------
  if (fireDetected) {

    Serial.println("ALERT: FIRE DETECTED");

    digitalWrite(FIRE_LED, HIGH);

    // Turn OFF cooling fan during fire
    analogWrite(COOLING_FAN, 0);

    // Servo action
    servo1.write(90);
    servo2.write(180);
  }

  // ---------------- GAS CONDITION ----------------
  else if (gasValue > 400) {

    Serial.println("ALERT: GAS LEAK");

    digitalWrite(GAS_LED, HIGH);

    // Turn ON exhaust fan
    digitalWrite(EXHAUST_FAN, HIGH);

    // Cooling fan based on temperature
    controlCoolingFan(temperature);

    servo1.write(0);
    servo2.write(0);
  }

  // ---------------- LOW WATER ----------------
  else if (waterValue < 300) {

    Serial.println("ALERT: LOW WATER");

    digitalWrite(WATER_LED, HIGH);

    // Cooling fan still works normally
    controlCoolingFan(temperature);

    servo1.write(0);
    servo2.write(0);
  }

  // ---------------- NORMAL CONDITION ----------------
  else {

    Serial.println("SYSTEM NORMAL");

    // Cooling fan works based on temperature
    controlCoolingFan(temperature);

    servo1.write(0);
    servo2.write(0);
  }

  // ---------------- OLED DISPLAY ----------------
  display.clearDisplay();

  display.setTextSize(1);
  display.setCursor(0, 0);

  display.print("Temp: ");
  display.print(temperature);
  display.println(" C");

  display.print("Gas: ");
  display.println(gasValue);

  display.print("Water: ");
  display.println(waterValue);

  display.println("----------------");

  display.setCursor(0, 45);
  display.setTextSize(2);

  if (fireDetected) {
    display.print("FIRE!");
  }
  else if (gasValue > 400) {
    display.print("GAS!");
  }
  else if (waterValue < 300) {
    display.print("LOW H2O");
  }
  else {
    display.print("SYSTEM OK");
  }

  display.display();

  delay(500);
}

// ====================================================
// FUNCTION: CONTROL COOLING FAN USING TEMPERATURE
// ====================================================
void controlCoolingFan(float temp) {

  // Fire condition handled separately

  if (temp < 24) {

    // Low speed
    analogWrite(COOLING_FAN, 80);

    Serial.println("Cooling Fan: LOW");
  }

  else if (temp >= 24 && temp < 30) {

    // Medium speed
    analogWrite(COOLING_FAN, 150);

    Serial.println("Cooling Fan: MEDIUM");
  }

  else {

    // High speed
    analogWrite(COOLING_FAN, 255);

    Serial.println("Cooling Fan: HIGH");
  }
}
