# WeWeb Dashboard Layout Component

A professional dashboard layout component for WeWeb with sidebar navigation, topbar, and customizable themes - Shadcn UI style.

![Dashboard Layout](https://img.shields.io/badge/WeWeb-Component-blue)
![Vue 3](https://img.shields.io/badge/Vue-3.x-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Responsive Sidebar** - Collapsible sidebar with smooth animations
- **Menu Sections** - Organized navigation with section labels
- **Icon Support** - Lucide icons with visual picker in WeWeb editor
- **User Profile** - User section with dropdown menu
- **Top Bar** - Search, notifications, theme toggle, settings
- **Promo Card** - Optional promotional card in sidebar
- **Drop Zone** - Content area accepts any WeWeb elements
- **Customizable** - Colors, sizes, and visibility options
- **Events** - Trigger workflows on menu clicks, search, etc.

## 🚀 Installation

### In WeWeb Editor

1. Go to **Plugins & Extensions** > **Extensions**
2. Click **Add custom component**
3. Enter the GitHub repository URL: `https://github.com/0x10a/weweb-dashboard-layout`
4. Click **Add**
5. The component will appear in your elements panel under "Custom"

### Local Development

```bash
# Clone the repository
git clone https://github.com/0x10a/weweb-dashboard-layout.git
cd weweb-dashboard-layout

# Install dependencies
npm install

# Start development server
npm run serve
```

Then in WeWeb:
1. Go to **Settings > Custom code**
2. Add `https://localhost:8080` as custom element
3. Drag & drop the component to test

## 📖 Usage

### Basic Setup

1. Drag the **Dashboard Layout** component to your page
2. Configure the logo, menu items, and user info in the Settings panel
3. Drop your page content inside the content area

### Menu Items Configuration

Menu items are configured as a flat array with section grouping:

| Property | Type | Description |
|----------|------|-------------|
| `section` | String | Section label (items are grouped by this) |
| `label` | String | Menu item label |
| `route` | String | Navigation route |
| `icon` | SystemIcon | Lucide icon (use picker) |
| `id` | String | Unique identifier |
| `badge` | String | Optional badge text |

### Available Events (Triggers)

| Event | Payload | Description |
|-------|---------|-------------|
| `menu-item-click` | `{ item, index, route }` | User clicks a menu item |
| `toggle-collapse` | `{ collapsed }` | Sidebar collapse toggled |
| `logout-click` | `{}` | Logout button clicked |
| `user-menu-click` | `{ item, action }` | User menu item clicked |
| `search` | `{ query }` | Search input changed |
| `notification-click` | `{}` | Notification bell clicked |
| `theme-toggle` | `{}` | Theme toggle clicked |
| `settings-click` | `{}` | Settings button clicked |
| `promo-click` | `{}` | Promo button clicked |

### Customization Options

#### Logo
- Logo URL (image) or Icon (Lucide)
- Logo text
- Logo color

#### Colors
- Sidebar background
- Text color / Muted text
- Section label color
- Active item background/color
- Hover background
- Badge colors
- Promo card colors

#### Layout
- Sidebar width (expanded/collapsed)
- Content border radius
- Content margin top

#### Visibility
- Show/hide topbar
- Show/hide search
- Show/hide notifications
- Show/hide theme toggle
- Show/hide settings
- Show/hide promo card
- Allow collapse

## 🛠 Development

### Project Structure

```
weweb-dashboard-layout/
├── src/
│   └── wwElement.vue      # Main component
├── ww-config.js           # WeWeb configuration
├── package.json
└── README.md
```

### Build

```bash
npm run build
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run serve` | Start WeWeb dev server |
| `npm run build` | Build for production |
| `npm run preview` | Local Vite preview |

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request
