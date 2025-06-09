# Adoptify UI

Adoptify UI is a modern, user-friendly web application for pet adoption and lost/found pet management. It is designed as the frontend for the Adoptify platform, enabling users to register, log in, manage their profiles, add pets for adoption, report lost or found pets, and interact with other users. The project is built with React, TypeScript, Vite, and Chakra UI, and communicates with a RESTful backend API.

---

## Table of Contents

- [Project Goals](#project-goals)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Key Files](#key-files)
- [Environment Variables](#environment-variables)
- [How to Run Locally](#how-to-run-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Project Goals

- **Facilitate pet adoption** by providing a platform for users and shelters to publish pets available for adoption.
- **Help reunite lost pets with their owners** through lost/found pet reporting and mapping.
- **Promote responsible pet ownership** and community involvement.
- **Offer a secure, accessible, and intuitive user experience** for all roles (adopters, owners, shelters, admins).

---

## Features

- **User Registration & Login**: Secure authentication with email verification.
- **Profile Management**: Edit user data, change password, and update email (with verification).
- **Pet Management**:
  - Add, edit, or delete pets for adoption.
  - Report lost or found pets, including last seen/found location (with map picker).
  - Mark pets as found and update their status.
- **Pet Browsing**:
  - Filter pets by species, breed, age, city, and status.
  - View detailed pet profiles.
- **Comment System**: Users can comment on pet profiles.
- **Responsive Design**: Fully responsive for desktop and mobile.
- **Notifications**: Toast notifications for actions and errors.
- **Admin & Moderation**: (If implemented) Manage users and pets.
- **API Integration**: All data is fetched and updated via a RESTful backend API.

---

## Technology Stack

- **Frontend Framework**: [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Chakra UI](https://chakra-ui.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **State Management**: React hooks (useState, useEffect, etc.)
- **Map Integration**: [React Leaflet](https://react-leaflet.js.org/) for interactive maps
- **Form Validation**: Custom logic and Chakra UI components
- **Notifications**: Custom toaster using Chakra UI
- **Testing**: (Optional) Jest, React Testing Library
- **Linting**: ESLint, with recommended TypeScript and React rules

---

## Folder Structure
```
Adoptify-UI/
├── .env                  # Environment variables (API URL, etc.)
├── .github/              # GitHub workflows (CI/CD)
│   └── workflows/
│       └── sync-branches.yml
├── .vscode/              # VSCode settings
├── public/               # Static assets (favicon, images)
├── src/
│   ├── api/              # API service modules (auth, etc.)
│   ├── assets/           # Static assets (SVGs, city lists, etc.)
│   ├── components/       # Reusable UI components
│   │   ├── maps/         # MapPicker and related map components
│   │   ├── multimedia/   # Multimedia helpers (e.g., Cloudinary)
│   │   └── ui/           # UI primitives (dialogs, fields, toasters, etc.)
│   ├── views/            # Main app views/pages
│   │   ├── auth/         # Auth pages (Login, Register, ForgotPassword)
│   │   ├── news/         # News articles
│   │   ├── pets/         # Pet detail and related views
│   │   ├── profile/      # User profile page
│   │   ├── AdoptablePets.tsx   # Adoptable pets listing
│   │   ├── LostPets.tsx        # Lost pets listing
│   │   ├── Index.tsx          # Main dashboard after login
│   │   └── Home.tsx           # Public landing page
│   ├── App.tsx          # Main app component and routes
│   ├── main.tsx         # App entry point
│   ├── theme.ts         # Chakra UI theme customization
│   └── vite-env.d.ts    # Vite TypeScript env types
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── index.html
```

## Key Files

- **src/App.tsx**: Main application component, defines all routes and layout.
- **src/views/auth/**: Contains Login, Register, and ForgotPassword pages, each with modals for email/code verification and password reset.
- **src/views/profile/Profile.tsx**: User profile management, including email change with verification.
- **src/views/pets/PetDetail.tsx**: Detailed pet view, including status changes, comments, and map integration.
- **src/components/ui/VerifyCodeModal.tsx**: Reusable modal for code verification (registration, email change, login, password reset).
- **src/components/ui/resetCodeModal.tsx**: Modal for entering code during password reset.
- **src/components/ui/resetPasswordModal.tsx**: Modal for setting a new password after code verification.
- **src/components/maps/MapPicker.tsx**: Interactive map for selecting locations (lost/found pets).
- **src/api/auth.ts**: API calls for authentication and user management.
- **src/assets/cities.tsx**: List of Spanish cities for filtering and forms.
- **src/components/Footer.tsx**: Footer with links to GitHub and API documentation (Swagger).

---

## Environment Variables

- **VITE_API_URL**: The base URL for the backend API (e.g., `https://petfinder-backend-nse4.onrender.com/api/v1`).

Example `.env`:
```env
VITE_API_URL=https://petfinder-backend-nse4.onrender.com/api/v1
```

---

## How to Run Locally

1. **Clone the repository:**
  ```sh
  git clone https://github.com/JMorenoPicon/adoptify-ui.git
  cd adoptify-ui
  ```

2. **Install dependencies:**
  ```sh
  npm install
  ```

3. **Configure environment variables:**
  - Create a `.env` file in the root directory.
  - Add your backend API URL:
    ```env
    VITE_API_URL=https://your-backend-api-url
    ```

4. **Start the development server:**
  ```sh
  npm run dev
  ```

5. **Open the app:**
  - Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment

- Vercel is recommended for deploying the frontend.
- Set the `VITE_API_URL` environment variable in your Vercel project settings to point to your deployed backend.
- The root directory should be `./` if your `package.json` and `src/` are in the root.

---

## API Documentation

- The backend API is documented with Swagger.
- Access the documentation at: [https://petfinder-backend-nse4.onrender.com/api-docs](https://petfinder-backend-nse4.onrender.com/api-docs)

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes with clear messages.
4. Push to your fork and open a Pull Request.

---

## License

This project is licensed under the MIT License.

---

## Author

Javier Moreno Picón (javier.moreno.picon@gmail.com)

---

## GitHub

[GitHub Repository](https://github.com/JMorenoPicon/adoptify-ui)
