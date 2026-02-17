# Innofolio iOS App

Native iOS app for Innofolio - track your innovation ideas on the go!

## Features

- 🎨 Modern gradient UI matching the web app design
- 🔐 User authentication (login/signup)
- 💡 Create, view, and manage ideas
- 🏷️ Tag and categorize ideas
- 🎯 Stage gate tracking (Idea → In Development → Launched → Sidelined)
- 🔍 Search and filter ideas
- 👥 View collaborators
- 📱 Native iOS experience with SwiftUI

## Requirements

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+

## Setup

### 1. Backend Configuration

Before running the app, you need to deploy your backend or update the API URL:

1. Open `ios-app/Innofolio/Services/APIService.swift`
2. Update the `baseURL` constant:

```swift
// For local development
private let baseURL = "http://localhost:3000/api"

// For production (replace with your deployed backend URL)
private let baseURL = "https://your-backend-url.com/api"
```

### 2. Open in Xcode

1. Navigate to the `ios-app` folder
2. Double-click `Innofolio.xcodeproj` to open in Xcode
3. Select your development team in Signing & Capabilities
4. Choose a simulator or connected device
5. Press Cmd+R to build and run

## Project Structure

```
ios-app/
├── Innofolio/
│   ├── InnofolioApp.swift          # App entry point
│   ├── ContentView.swift            # Root view
│   ├── Models/
│   │   └── Idea.swift               # Data models
│   ├── Services/
│   │   └── APIService.swift         # Backend API integration
│   ├── Managers/
│   │   └── AuthManager.swift        # Authentication state
│   ├── Views/
│   │   ├── LoginView.swift          # Login screen
│   │   ├── SignupView.swift         # Signup screen
│   │   ├── DashboardView.swift      # Main dashboard
│   │   ├── IdeaCardView.swift       # Idea card component
│   │   ├── IdeaDetailView.swift     # Idea details
│   │   ├── CreateIdeaView.swift     # Create new idea
│   │   └── ProfileView.swift        # User profile
│   ├── Assets.xcassets/             # Images and colors
│   └── Info.plist                   # App configuration
└── README.md
```

## Key Features

### Authentication
- Login with email and password
- Sign up with username, email, and optional team
- Persistent authentication with token storage
- Automatic token refresh

### Dashboard
- Grid view of all ideas
- Search functionality
- Filter by stage gate
- Pull to refresh
- Beautiful gradient cards

### Idea Management
- Create new ideas with title, description, opportunity, and tags
- View detailed idea information
- Edit existing ideas
- Delete ideas
- Stage gate progression

### Design
- Modern gradient UI inspired by the web app
- Smooth animations and transitions
- Native iOS components
- Dark mode support (automatic)

## API Integration

The app connects to your existing Express/PostgreSQL backend. All data is synced between web and mobile platforms.

### Endpoints Used
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/ideas` - List all ideas
- `GET /api/ideas/:id` - Get idea details
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea

## Development

### Running Locally

1. Start your backend server:
```bash
cd server
npm run dev
```

2. Update the API URL in `APIService.swift` to point to your local server
3. Run the iOS app in Xcode

### Testing on Device

To test on a physical device:
1. Connect your iPhone via USB
2. Select it as the run destination in Xcode
3. Ensure your Mac and iPhone are on the same network
4. Update the API URL to use your Mac's local IP address instead of `localhost`

Example:
```swift
private let baseURL = "http://192.168.1.100:3000/api"
```

## Deployment

### Backend Deployment

Before deploying the iOS app, deploy your backend to a production server (Render, Railway, Heroku, etc.) and update the `baseURL` in `APIService.swift`.

### App Store Submission

1. Update bundle identifier in Xcode
2. Add app icons to Assets.xcassets
3. Configure signing with your Apple Developer account
4. Archive the app (Product → Archive)
5. Submit to App Store Connect

## Troubleshooting

### "Cannot connect to server"
- Ensure your backend is running
- Check the API URL in `APIService.swift`
- For local development, use your Mac's IP address, not `localhost`
- Verify `NSAppTransportSecurity` settings in Info.plist for HTTP connections

### Authentication issues
- Clear app data by deleting and reinstalling
- Check that JWT tokens are being properly stored
- Verify backend authentication endpoints are working

## Future Enhancements

- [ ] Offline mode with local caching
- [ ] Push notifications for idea updates
- [ ] Collaboration features
- [ ] File attachments
- [ ] Comments on ideas
- [ ] iPad optimization
- [ ] Widgets for home screen
- [ ] Siri shortcuts

## License

Same as the main Innofolio project.
