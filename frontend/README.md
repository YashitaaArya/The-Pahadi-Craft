# 🕯️ CandleLightDuke

**CandleLightDuke** is a sleek, elegant, and AI-integrated eCommerce website built with **React.js (Vite)**. It’s designed for home decor enthusiasts, offering high-end candles, fragrance guides, custom orders, and a smart shopping experience – all wrapped in cozy, candle-lit aesthetics.

![Banner](https://your-image-url.com/banner.png) <!-- Replace with an actual banner image if you have -->

---

## 🌐 Live Demo

> Coming soon...

---

## ✨ Features

- 🎯 **Elegant Home Page** with hero section and Instagram feed
- 🛒 **Shop Page** with product filters and Add-to-Cart functionality
- 🕯️ **Fragrance Guide** to choose the perfect scent
- 🧵 **Custom Order** form for personalized candles
- 📝 **Blog Page** with decor inspiration and tips
- 📞 **Contact Page** with email and inquiry form
- 🤖 **AI Chatbot** for 24/7 decor and shopping assistance
- 🧺 **Floating Cart/Basket** accessible site-wide

---

## 🛠️ Tech Stack

| Tech             | Usage                          |
|------------------|--------------------------------|
| React + Vite     | Frontend framework             |
| Tailwind CSS     | Styling and layout             |
| React Router DOM | Routing between pages          |
| Zustand / Context| Global state (cart/chatbot)    |
| OpenAI/Dialogflow| AI chatbot integration         |
| Shadcn/ui        | Modern UI components           |
| Framer Motion    | Smooth animations              |

---

## 🎨 Aesthetic Design

- **Colors**:
  - Warm Beige `#F5E9DA`
  - Soft Gold `#C9A66B`
  - Deep Brown `#5A4232`
  - Elegant White `#FFF8F2`
  - Olive Accent `#A8B5A2`

- **Typography**:
  - Headings: `Playfair Display`
  - Body: `Poppins`

- **Style**: Ambient, minimal, glowing UI elements with soft hover effects.

---

## 📁 Project Structure

candlelightduke/ ├── public/ ├── src/ │ ├── assets/ │ ├── components/ │ ├── pages/ │ ├── chatbot/ │ ├── context/ │ ├── App.jsx │ └── main.jsx ├── .env ├── index.html ├── package.json └── tailwind.config.js


---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/candlelightduke.git

# Navigate into the directory
cd candlelightduke

# Install dependencies
npm install

# Start development server
npm run dev


🔐 Environment Setup
Create a .env file and add:

env
Copy
Edit
VITE_CHATBOT_API_KEY=your_api_key
VITE_INSTAGRAM_EMBED_URL=https://instagram.com/yourprofile

📷 Instagram Integration
Make sure to include an embeddable Instagram feed on the home page using services like instafeed.js, embedapi, or custom iFrame.

🤖 Chatbot Integration
The chatbot slider (bottom right) is powered by OpenAI/Dialogflow and supports:

Product queries

Decor tips

Fragrance suggestions

Custom order guidance

📬 Contact
For issues, suggestions, or collaborations, feel free to open an issue or contact us on Instagram: @candlelightduke

📄 License
This project is licensed under the MIT License.
