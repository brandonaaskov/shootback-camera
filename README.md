# Shootback Camera

A clip-on, battery-powered video/audio recording device that continuously buffers footage and saves on demand. Designed to be buildable by anyone without soldering skills using off-the-shelf components.

## Project Motivation

This project was conceived in 2014 following the Michael Brown shooting. The observation: incidents of police misconduct only receive meaningful attention when clear civilian video evidence exists. The goal is to create an accessible, open-source device that enables anyone to capture and preserve footage of events *after* they realize something significant is happening.

Inspired by the YakBak toy from the 1990s, the core concept is a continuous ring buffer that can be "saved" at any moment, preserving the preceding minutes of footage.

## Project History

The original Shootback Camera project was created on **September 5, 2014** and published on Hackaday.io.

**Original project description:**
> "A worn camera (based on the Pi) that captures the last 30s (or more?) that just happened, directly to the card. Don't miss a moment."

**From the original details page:**
> "Have you ever seen something happen where you wished you had a camera rolling? There are many events that occur where cameras are turned on, *just* after the important moment. The Mike Brown shooting is a prime example of this, and what inspired this project to be completely open. If someone wants to take the concept private, by all means. In fact, I hope dearly that GoPro just enables this as a feature on its fleet of cameras. It could probably do so with a straightforward firmware upgrade."

### Original 2014 Components
- Raspberry Pi Model B(+)
- Momentary Push Button
- Raspberry Pi Camera Module
- Ninja Pibow Case

### Original Concepts (2014)
- Use the Raspberry Pi Compute Module for a smaller form factor
- Potential Kickstarter for manufacturing
- Earth magnets on the case for quick mounting
- RF keyfob to trigger multiple mounted cameras simultaneously (predating the current ESP32/iBeacon concept)
- Used the PiCamera Python library for circular buffer recording

### Project Logs
- **October 2, 2014:** GitHub repository created at https://github.com/brandonaaskov/shootback-camera
- **October 17, 2014:** Final log entry discussing finding time for the project

### Links
- Original Hackaday.io project: https://hackaday.io/project/2961-shootback-camera
- Original GitHub repo: https://github.com/brandonaaskov/shootback-camera

---

## 2025 Revival

After 10+ years, the project is being revisited with significantly improved hardware options:
- Pi Zero 2 W (vs original Pi Model B) - dramatically smaller and more powerful
- Voice Bonnet for audio capture (original concept had no audio solution)
- Mature software tooling (FFmpeg segment muxer, picamera2, libcamera)
- 3D printing accessibility for custom enclosures
- Ubiquitous smartphone hotspots for cloud upload

## Core Requirements

- No soldering required for assembly
- Off-the-shelf components from normal US retailers (Adafruit, SparkFun, etc.)
- Clips to backpack strap, purse strap, or seatbelt
- Battery powered with ability to extend via external battery pack
- Physical on/off switch
- Physical trigger button to save buffer
- Synchronized audio and video capture
- Continuous recording uninterrupted by save operations

## System Architecture

```
[Pi Camera] ──► [Hardware H.264 encoder] ──┐
                                           ├──► [FFmpeg Muxer] ──► [.ts segments in RAM]
[MEMS Microphone] ──► [AAC encoder] ───────┘                              │
                                                                          ▼
                                                    [Ring buffer manager: keeps N segments]
                                                                          │
                                                               [Button press trigger]
                                                                          │
                                                                          ▼
                                                    [Copy segments to SD card]
                                                    (recording continues uninterrupted)
```

### Key Technical Decisions

- **Video encoding:** Hardware H.264 via VideoCore GPU (not CPU)
- **Audio/video sync:** Single FFmpeg muxer handles both streams; no separate ring buffers to synchronize
- **Ring buffer format:** MPEG-TS segments (~10 seconds each) stored in RAM (/dev/shm)
- **Save operation:** Concatenate existing segments to SD card while new segments continue writing
- **Buffer duration:** 2-3 minutes (constrained by Pi Zero 2 W's 512MB RAM)

### Conceptual FFmpeg Command

```bash
ffmpeg \
  -f v4l2 -i /dev/video0 \
  -f alsa -i hw:1,0 \
  -c:v h264_v4l2m2m \
  -c:a aac \
  -f segment \
  -segment_time 10 \
  -segment_wrap 6 \
  -segment_format mpegts \
  /dev/shm/buffer_%03d.ts
```

## Bill of Materials (Prototype)

| Part | Purpose | Adafruit # |
|------|---------|------------|
| Pi Zero 2 W with Pre-Soldered Headers | Main processor | 5291 |
| Pi Camera Module v1/v2 (v3 Wide recommended for final) | Video capture | — |
| Voice Bonnet for Raspberry Pi | Audio capture (dual MEMS mics) | 4757 |
| PowerBoost 1000C | Charge + boost, run while charging | 2465 |
| Lithium Ion Battery 3.7V 2000mAh | Power | 2011 |
| Breadboard-friendly SPDT Slide Switch | On/off | 805 |
| Tactile Button Switch (6mm) | Trigger | 367 |
| MicroSD Card 32GB | OS + saved recordings | 2820 |

### For Breadboard Prototyping Only

| Part | Adafruit # |
|------|------------|
| Half-size Breadboard | 64 |
| Premium Jumper Wires | 1957 |

## Hardware Assembly (Prototype)

### 1. Pi Zero 2 W + Voice Bonnet
Press the Voice Bonnet directly onto the Pi Zero 2 W's GPIO headers. Friction fit, no tools required.

### 2. Camera Module
Connect ribbon cable to CSI port on Pi Zero 2 W (located between HDMI port and board edge). Lift plastic tab, slide ribbon in with contacts facing board, press tab down.

### 3. Power Circuit (on breadboard for prototype)
- Connect battery to PowerBoost 1000C via JST connector
- Wire slide switch between PowerBoost 5V output and Pi's 5V pin (physical pin 2 or 4)
- Wire PowerBoost GND to Pi GND (physical pin 6)

### 4. Trigger Button (on breadboard for prototype)
- One leg to GPIO 17 (physical pin 11)
- Other leg to GND (physical pin 9 or any ground)
- Internal pull-up resistor used in software; no external resistor needed

## Enclosure Design (Concept)

### Form Factor Goals
- Linear layout along strap axis to prevent flopping/rotation
- Thin profile sits flat against bag/body
- Camera points outward when clipped

### Layout (Top-Down View)

```
┌─────────────────────────────┬───────────────────────────────┐
│   Pi Zero 2 W + Bonnet      │   Battery + PowerBoost        │
│   + Camera on top           │                               │
└─────────────────────────────┴───────────────────────────────┘
                    ▲
              strap clip(s)
```

### Estimated Dimensions
- **Length:** ~140mm
- **Width:** ~40mm
- **Thickness:** ~35mm

Comparable to a TV remote or thick smartphone in a rugged case.

### Case Requirements
- Clip mechanism for strap attachment (custom design required)
- Small holes for Voice Bonnet microphones
- Camera lens opening on top surface
- USB port access for PowerBoost (charging)
- Slide switch and trigger button accessible externally
- Thermal separation between PowerBoost and battery (air gap or foam divider, NOT thermal conductive pads)

### Camera Module Comparison (for final build)

| Version | Resolution | Focus | Low-light | Notes |
|---------|------------|-------|-----------|-------|
| v1 | 5MP | Fixed | Poor | Fine for prototyping |
| v2 | 8MP | Fixed | Decent | Proven, widely available |
| v3 | 12MP | Auto | Better | Adds thickness |
| v3 Wide | 12MP | Auto | Better | 120° FOV, recommended for this use case |

All versions share the same mounting holes (21mm x 12.5mm) and CSI ribbon cable.

## Future Considerations (Not in Prototype Scope)

- Cloud upload via phone hotspot (WiFi preferred over Bluetooth for speed)
- Voice-activated trigger ("Hey Shootback, save that")
- Network trigger for multi-device setups (home use case)
- Home Assistant integration
- Custom PCB to reduce size and cost
- ESP32/iBeacon button for household "I did not say that!" trigger

## Open Source Intent

This project is intended to be open source. Community contributions welcome, especially:
- Enclosure designs optimized for 3D printing
- Alternative component suggestions
- Software development
- Documentation and build guides

---

*Originally conceived September 2014. Hackaday.io project published September 5, 2014. Prototype revival documented January 2026.*
