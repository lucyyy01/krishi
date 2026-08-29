<div align="center">

# 🌾 Krishi Copilot (कृषि को-पायलट)
### *AI-Powered Integrated Farming Decision Support & Precision Agritech Platform*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Languages](https://img.shields.io/badge/Languages-9_Indian_Dialects-FF9933?style=for-the-badge)](https://github.com/)

<p align="center">
  <strong>Transforming complex agricultural data into timely, jargon-free STOP / DO decisions for Indian farmers.</strong>
</p>

</div>

---

## 🗺️ System Blueprint & Visual Index

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                     KRISHI COPILOT ARCHITECTURE                         │
   └────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
    ▼                               ▼                               ▼
[1. DATA TELEMETRY]         [2. AI DECISION CORE]          [3. RURAL ACTUATORS]
├── 🛰️ Satellite Multi-Spectral  ├── 🧠 Priority Action Engine   ├── 🌾 Today's Action Plan
├── 📡 Dual-Depth Soil IoT       ├── 🌦️ What-If Simulation       ├── 🚚 Harvest Truck Rental
├── 🌧️ Hyper-Local Weather 1km   ├── 📸 Vision Disease CNN       ├── 👷 Farm Labour Crew
├── 🏛️ APMC Mandi e-NAM Auctions ├── 💰 Scheme Matcher (Why/Not) ├── 🤝 1% P2P Micro-Loans
└── 🧪 DBT Subsidized Fertilizers└── 🎙️ Vernacular Voice AI      └── 🚰 Smart Drip Solenoid
```

---

## 🏗️ 1. End-to-End Agritech Ecosystem Architecture

```mermaid
graph TB
    subgraph SENSORS_INPUTS ["📡 LAYER 1: DATA ACQUISITION & TELEMETRY"]
        A1["🛰️ Multi-Spectral Satellites<br/>(Sentinel-2 / NDVI Vegetation Index)"]
        A2["📡 Ground IoT Probes<br/>(15cm Root & 30cm Subsoil Moisture)"]
        A3["🌧️ Hyper-Local Weather Grid<br/>(IMD Radar, Rain mm, Humidity %, Temp)"]
        A4["🏛️ APMC Mandi Live Feed<br/>(Modal Rates & Price Momentum)"]
        A5["🧪 Fertilizer DBT Portal<br/>(Fixed MRP: Urea ₹266.5, DAP ₹1350)"]
        A6["📸 Mobile Camera Uploads<br/>(Leaf Pest & Fungal Photos)"]
    end

    subgraph AI_BRAIN ["🧠 LAYER 2: AI DECISION & REASONING ENGINE"]
        B1["🌾 Priority Action Plan Generator<br/>(Rules + Sensor Thresholds)"]
        B2["🌦️ 'What-If' Sandbox Simulator<br/>(Physics & Consequence Engine)"]
        B3["📸 Crop Vision CNN Diagnostic<br/>(Disease Spotting + Spray Window)"]
        B4["💰 Government Scheme Matcher<br/>(Eligibility & Disqualification Engine)"]
        B5["🎙️ Vernacular Speech Synthesizer<br/>(9 Indian Languages Audio Voice)"]
    end

    subgraph ACTION_PORTALS ["📱 LAYER 3: ACTIONABLE RURAL MODULES"]
        C1["🌾 Today's Priority Action Plan<br/>(DO / STOP / CAUTION Badges)"]
        C2["🚚 Rental Truck Service<br/>(Tata Ace / Bolero / Trolley Booking)"]
        C3["👷 Farm Labour & Crew Hub<br/>(Hire Workers or Apply as Labour)"]
        C4["🤝 P2P Kisan Micro-Lending<br/>(1.0% Monthly Peer Loans via UPI)"]
        C5["🏛️ Mandi GPS Locator<br/>(Distance km & Sell vs Store Advisor)"]
        C6["👥 Kisan Community Chopal<br/>(KVK Q&A & Secondhand Machinery)"]
        C7["🧪 Fertilizer & NPK Calculator<br/>(Exact Bag Dosage & PKVY Bio Formulas)"]
    end

    A1 & A2 & A3 --> B1 & B2
    A6 --> B3
    A4 --> B1 & C5
    A5 --> C7
    B1 --> C1
    B2 --> C1
    B3 --> C1
    B4 --> C1
    B5 --> C1 & C2 & C3 & C4 & C5 & C6 & C7
```

---

## ⚡ 2. AI Prescriptive Decision Flowchart (Stop vs Do)

```mermaid
flowchart TD
    Start([⏰ 05:00 AM Daily Diagnostic Run]) --> Step1[Fetch 24-Hour Weather & Soil Telemetry]
    Step1 --> CheckRain{Upcoming Rain > 60%<br/>within 24 Hours?}
    
    CheckRain -- YES --> RainBranch1[🚨 HOLD IRRIGATION TODAY]
    RainBranch1 --> RainDetail1["💧 Reason: Soil will naturally saturate.<br/>💰 Saves ~24,000L Water & ₹450 Electricity."]
    CheckRain -- YES --> RainBranch2[🛑 DO NOT SPRAY PESTICIDES]
    RainBranch2 --> RainDetail2["🐛 Reason: Chemical will wash into soil.<br/>💰 Saves ₹1,200 Chemical Loss & Crop Toxicity."]
    CheckRain -- YES --> RainBranch3[✅ CLEAR FURROW DRAINAGE]
    RainBranch3 --> RainDetail3["🚜 Action: Prevent Waterlogging in low elevation slope."]
    
    CheckRain -- NO --> CheckMoisture{Root Zone Soil Moisture<br/>at 15cm < 35%?}
    CheckMoisture -- YES --> WaterBranch1[✅ SAFE IRRIGATION WINDOW ACTIVE]
    WaterBranch1 --> WaterDetail1["💧 Action: Run Drip Irrigation for 2.5 Hours before 11:00 AM."]
    CheckMoisture -- NO --> CheckMoistureHigh{Soil Moisture > 75%?}
    CheckMoistureHigh -- YES --> WaterBranch2[🟡 HOLD IRRIGATION - OPTIMAL MOISTURE]
    CheckMoistureHigh -- NO --> CheckPest{Humidity > 80% & Temp > 28°C?}
    
    CheckPest -- YES --> PestBranch[🐛 HIGH PEST & FUNGAL THREAT]
    PestBranch --> PestDetail["🌿 Action: Spray 5% Organic Neem Seed Kernel Extract (NSKE)."]
    CheckPest -- NO --> NormalBranch[🌱 CROPS OPTIMAL HEALTH]

    RainDetail1 & RainDetail2 & RainDetail3 & WaterDetail1 & WaterDetail2 & PestDetail & NormalBranch --> SpeechGen[🔊 Synthesize Vernacular Voice Narration in 9 Dialects]
    SpeechGen --> Deliver[📱 Deliver to Farmer Mobile Screen & WhatsApp]
```

---

## 🌦️ 3. 'What-If' Sandbox Decision Simulation Engine

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as 👨🏽‍🌾 Farmer
    participant UI as 📱 Simulator UI (Sliders)
    participant Engine as ⚙️ What-If Physics Engine
    participant Verdict as ⚖️ Verdict Synthesizer
    participant Voice as 🔊 Audio Speech

    Farmer->>UI: Selects Scenario: "💧 Irrigate Field Today?"
    Farmer->>UI: Adjusts Rain Probability Slider: 85%
    Farmer->>UI: Adjusts Soil Moisture Slider: 72%
    UI->>Engine: Evaluate (Rain=85%, Moisture=72%, Crop=Cotton, Stage=Boll)
    
    rect rgb(254, 226, 226)
        Note over Engine: Calculates Consequence Physics
        Engine->>Engine: Water Wasted = 24,000 Litres / Acre
        Engine->>Engine: Financial Loss = ₹450 (Pumping electricity)
        Engine->>Engine: Root Rot Risk = +45% (Anoxic soil conditions)
        Engine->>Engine: Disease Surge = +30% (Fungal spore germination)
    end

    Engine->>Verdict: Generate Farmer-Friendly Verdict
    Verdict-->>UI: ❌ VERDICT: NOT RECOMMENDED (आज पानी न दें)
    Verdict-->>UI: Prescribe Best Alternative: "Clear drainage trenches before 5 PM."
    Farmer->>UI: Clicks "🔊 Listen"
    UI->>Voice: Play Vernacular Audio: "नमस्ते रमेश जी, आज खेत में पानी न दें..."
    Voice-->>Farmer: Speaks in Hindi / Marathi / Telugu / Tamil
```

---

## 🔐 4. Multi-Role Authentication & Access Flow

```mermaid
stateDiagram-v2
    [*] --> LoginPage: User Opens App (1st Screen)

    state LoginPage {
        [*] --> SelectAuthChannel
        SelectAuthChannel --> MobileSmsOtp: 📱 Phone SMS
        SelectAuthChannel --> EmailOtp: 📧 Email OTP
        
        MobileSmsOtp --> DispatchOtp: Click "OTP प्राप्त करें"
        EmailOtp --> DispatchOtp: Click "OTP प्राप्त करें"
        DispatchOtp --> VerifyCode: 6-Digit OTP Banner Delivered
        VerifyCode --> ValidateSuccess: Matches Code (or 1-Click Preset)
    }

    ValidateSuccess --> RoleRouter: Route Based on Selected Role

    state RoleRouter {
        [*] --> CheckRole
        CheckRole --> FarmerDashboard: 👨🏽‍🌾 Role = Farmer
        CheckRole --> LabourDashboard: 👷 Role = Labour
        CheckRole --> DualRoleMode: 🔄 Role = Both
    }

    state FarmerDashboard {
        [*] --> ActionPlan
        ActionPlan --> WhatIfSimulator
        WhatIfSimulator --> RentalTrucks
        RentalTrucks --> SchemesAndMandi
    }

    state LabourDashboard {
        [*] --> LiveJobOffers
        LiveJobOffers --> AcceptWork
        AcceptWork --> TrackEarnings
        TrackEarnings --> ToggleAvailability
    }

    state DualRoleMode {
        FarmerMode <--> LabourMode: 🔄 1-Click Mode Toggle in Header
    }

    FarmerDashboard --> Logout: 🚪 Click Logout
    LabourDashboard --> Logout: 🚪 Click Logout
    DualRoleMode --> Logout: 🚪 Click Logout
    Logout --> LoginPage
```

---

## 📸 5. Crop Disease AI & Weather-Linked Spraying Pipeline

```mermaid
flowchart LR
    subgraph INGESTION ["1. PHOTO CAPTURE"]
        P1["📸 Camera Photo / Leaf Sample"] --> P2["🖼️ 224x224 RGB Normalization"]
    end

    subgraph VISION_MODEL ["2. NEURAL NETWORK CNN"]
        P2 --> M1["MobileNet-V3 / YOLOv8 Backbone"]
        M1 --> M2["Feature Extractor: Chlorosis, Necrosis, Spores"]
        M2 --> M3{"Classification Confidence > 92%?"}
        M3 -- YES --> M4["Detected: Cotton Whitefly & Leaf Curl (CLCuV)"]
        M3 -- NO --> M5["Prompts Farmer for Closer Angle"]
    end

    subgraph WEATHER_VALIDATION ["3. SAFE SPRAY WINDOW ENGINE"]
        M4 --> W1["Check 6h Rain Forecast: 80% Expected"]
        W1 --> W2{"Rain Window < 4 Hours?"}
        W2 -- YES --> W3["🛑 DO NOT SPRAY NOW<br/>(Pesticide will wash into soil)"]
        W2 -- NO --> W4["✅ SAFE SPRAYING WINDOW ACTIVE"]
    end

    subgraph PRESCRIPTION ["4. DUAL REMEDY DOSAGE"]
        W3 & W4 --> R1["🧪 Chemical: Diafenthiuron 50% WP @ 20g / 15L Pump"]
        W3 & W4 --> R2["🌿 Bio-Organic: 5% Neem Seed Kernel Extract (PKVY)"]
    end
```

---

## 🚚 6. Farm Logistics & Labour Supply Chain Interaction

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as 👨🏽‍🌾 Farmer (Harvest Ready)
    actor Worker as 👷 Labour Crew (Savitribai Toli)
    actor Driver as 🚚 Truck Driver (Tata Ace)
    participant Platform as 🌾 Krishi Copilot Hub
    participant Mandi as 🏛️ APMC Mandi Auction

    Farmer->>Platform: Step 1: Browse Labour Hub & Hire 8 Cotton Pickers
    Platform->>Worker: Dispatch Job Offer (₹450/day in Sawangi Field)
    Worker-->>Platform: Accept Job Offer & Confirm Attendance
    
    Note over Farmer,Worker: Harvesting 45 Quintals of Raw Cotton in Field

    Farmer->>Platform: Step 2: Open "Rental Trucks" & Book Tata Ace
    Platform->>Driver: Dispatch Pickup Request (2.1 km away • Est ₹680)
    Driver-->>Farmer: Truck Arrives at Field with Tarpaulin Cover
    
    Driver->>Mandi: Step 3: Transport Produce to Ghatanji APMC
    Mandi-->>Farmer: Real-time Modal Price Realization: ₹7,450 / Quintal
    Farmer->>Platform: Step 4: Record Sale in Harvest Ledger
```

---

## 💰 7. Government Scheme Matcher State Machine

```mermaid
stateDiagram-v2
    [*] --> FarmerProfileInput: Reads Landholding, Caste, Crop & Irrigation

    state SchemeEvaluation {
        [*] --> PM_KISAN: Landholding < 2 Hectares?
        PM_KISAN --> PM_KISAN_YES: YES -> ₹6,000/yr Eligible
        PM_KISAN --> PM_KISAN_NO: NO -> Institutional Land Disqualified

        [*] --> PM_KUSUM: Has Drip Grid & High Grid Power Cost?
        PM_KUSUM --> PM_KUSUM_YES: YES -> 90% Solar Pump Subsidy
        PM_KUSUM --> PM_KUSUM_NO: NO -> Grid Already Subsidized

        [*] --> PMFBY: Enrolled before Sep 15 Deadline?
        PMFBY --> PMFBY_YES: YES -> 2% Kharif Premium Active
        PMFBY --> PMFBY_NO: NO -> Application Window Closed

        [*] --> SMAM: Small/Marginal Farmer Category?
        SMAM --> SMAM_YES: YES -> 50% Machinery Subsidy
    }

    SchemeEvaluation --> MatchReport: Generate Transparency Cards
    MatchReport --> WhyEligible: 🟢 Lists Exact Criteria Met
    MatchReport --> WhyNotEligible: 🔴 Explains Exact Disqualification Reason
```

---

## 📡 8. IoT Hardware Hub & Dual-Depth Closed-Loop Actuation

```mermaid
graph TD
    subgraph FIELD_PROBES ["🌱 IN-SITU SOIL SENSORS"]
        S1["Sensor Node A: 15cm Depth (Root Zone)"]
        S2["Sensor Node B: 30cm Depth (Subsoil)"]
        S3["Optical NPK Spectrometer (mg/kg)"]
        S4["Leaf Wetness & Dew Sensor"]
    end

    subgraph TELEMETRY_GATEWAY ["📶 TELEMETRY HUB"]
        S1 & S2 & S3 & S4 --> G1["Solar-Powered ESP32 / LoRaWAN Node"]
        G1 --> G2["MQTT Broker / 4G GSM Telemetry Stream"]
    end

    subgraph SMART_ACTUATOR ["🚰 SMART DRIP ACTUATION LOOP"]
        G2 --> DecisionEngine{"Moisture < 35% AND Rain < 30%?"}
        DecisionEngine -- YES --> ValveOpen["🟢 Trigger Solenoid Valve: OPEN (2.5h)"]
        DecisionEngine -- NO (Rain Expected) --> RainCutoff["🔴 Auto-Rain Guard: ISOLATE VALVE POWER"]
        DecisionEngine -- NO (Moisture Normal) --> ValveClosed["⚪ Maintain Valve: CLOSED"]
    end

    ValveOpen --> DripPipes["💦 Precision Drip Emitters in Farm"]
    RainCutoff --> SafeGuard["🛡️ Zero Energy & Water Wastage"]
```

---

## 🎙️ 9. Vernacular Voice AI Processing Pipeline

```mermaid
flowchart LR
    A["🗣️ Farmer Voice Question<br/>(e.g., 'आज पानी द्यावे का?')"] --> B["🎤 Audio Stream Capture"]
    B --> C["🌐 Web Speech Synthesis & NLP Tokenizer"]
    C --> D["🧠 Krishi Agronomist Decision Brain"]
    D --> E["⚡ Formulate Jargon-Free Answer with DO/STOP Badges"]
    E --> F["🔊 Vernacular Speech Playback<br/>(0.8x / 1.0x / 1.2x Speed Control)"]
    E --> G["📊 Sound Wave Equalizer Animation"]
```

---

## 🇮🇳 10. Multi-Dialect Regional Matrix (9 Languages)

```
                            KRISHI COPILOT MULTILINGUAL MATRIX
    ┌──────────────┬───────────────────────────────┬──────────────────────────────────┐
    │ Language     │ Script & Native Name          │ Key Audio & UI Locale            │
    ├──────────────┼───────────────────────────────┼──────────────────────────────────┤
    │ Hindi        │ 🇮🇳 हिन्दी                      │ hi-IN (Standard Kisan Dialect)   │
    │ Marathi      │ 🇮🇳 मराठी                      │ mr-IN (Vidarbha / Marathwada)    │
    │ Telugu       │ 🇮🇳 తెలుగు                     │ te-IN (Andhra & Telangana)       │
    │ Tamil        │ 🇮🇳 தமிழ்                      │ ta-IN (Tamil Nadu Delta)         │
    │ Kannada      │ 🇮🇳 ಕನ್ನಡ                      │ kn-IN (Karnataka Raitha)         │
    │ Gujarati     │ 🇮🇳 ગુજરાતી                    │ gu-IN (Saurashtra / Gujarat)     │
    │ Punjabi      │ 🇮🇳 ਪੰਜਾਬੀ                     │ pa-IN (Malwa / Doaba Belt)       │
    │ Bengali      │ 🇮🇳 বাংলা                      │ bn-IN (West Bengal Agri)         │
    │ English      │ 🌐 English                    │ en-IN (Agronomist / FPO Lead)    │
    └──────────────┴───────────────────────────────┴──────────────────────────────────┘
```

---

## 🏆 Hackathon Judge Cheat Sheet (60-Second Evaluation Guide)

| Test Goal | What to Click in the App | Expected Demonstration Result |
| :--- | :--- | :--- |
| **1. Smart Login Gateway** | Open **[http://localhost:5173/](http://localhost:5173/)** $\to$ Click **"👨🏽‍🌾 Ramesh Patil"** preset. | Immediate 1-click entrance into personalized Cotton farmer dashboard. |
| **2. Prescriptive Action Plan** | Go to **"Today's Action Plan"** tab $\to$ Click **"🔊 Listen"**. | Synthesizes and narrates prioritized actions & rupee savings in native dialect. |
| **3. What-If Decision Sandbox** | Go to **"What-If Simulator"** $\to$ Drag Rain slider to 90% $\to$ Select **"💧 Irrigate Field Today?"**. | AI renders **"❌ NOT RECOMMENDED"**, calculating ₹450 electricity loss & root rot risk. |
| **4. Rental Truck Booking** | Go to **"🚚 Rental Trucks"** $\to$ Click **"Book Truck for Farm"** on Tata Ace. | Dispatches nearest driver (2.1 km) with transparent ₹/km and confetti confirmation. |
| **5. Farm Labour Hub** | Go to **"👷 Farm Labour"** $\to$ Click **"Apply as Farm Labour"** or hire a crew. | Opens worker registration modal or books labour crews with transparent daily wages. |
| **6. Crop Disease Vision AI** | Go to **"📸 Crop Disease"** $\to$ Select **"Cotton Whitefly / Leaf Curl"**. | Displays weather-linked safe spray window + exact 15L pump tank dosage. |
| **7. Dual-Role Switching** | Click **"🚪 Logout"** $\to$ Login with **"🔄 Both"** $\to$ Click **"Switch to Labour View"**. | Header toggles live between Farmer decisions and Labour job offers. |

---

## ⚡ Quickstart Guide

### 1. Installation
```bash
git clone https://github.com/lucyyy01/Krishi-Seva.git
cd Krishi-Seva
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 3. Production Build
```bash
npm run build
```

---

<div align="center">
  <strong>Made with ❤️ for Indian Farmers (जय जवान, जय किसान)</strong>
</div>
