#include <Servo.h>

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int SERVO1_PIN = 6;  // Fence-side
const int SERVO2_PIN = 7;  // Top-of-plant
const float SENSOR_HEIGHT = 60.0;  // Height of sensor from base in cm

Servo servo1;
Servo servo2;
bool rotated = false;

void setup() {
  // Initialize serial
  Serial.begin(9600);
  
  // Setup pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  // Attach servos
  servo1.attach(SERVO1_PIN);
  servo2.attach(SERVO2_PIN);
}

float measureHeight() {
  // Clear trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Send pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Get echo duration
  long duration = pulseIn(ECHO_PIN, HIGH);
  
  // Calculate distance
  float distance = duration * 0.034 / 2.0;
  
  // Convert to height
  return SENSOR_HEIGHT - distance;
}

void loop() {
  // Initial servo movement
  if (!rotated) {
    servo1.write(90);
    servo2.write(180);
    delay(1000);
    servo1.write(0);
    servo2.write(0);
    rotated = true;
  }
  
  // Check for reset command
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    if (command == "RESET") {
      rotated = false;
    }
  }
  
  // Measure and send height
  float height = measureHeight();
  Serial.println(height);
  
  // Update every 1 second
  delay(1000);
}
