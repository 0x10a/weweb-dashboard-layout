export default {
  inherit: { type: 'ww-layout' },

  editor: {
    label: {
      en: "Dashboard Layout",
      fr: "Layout Dashboard"
    },
    icon: "layout-dashboard",
    bubble: {
      icon: "layout-dashboard"
    }
  },

  triggerEvents: [
    {
      name: "menu-item-click",
      label: { en: "On menu item click", fr: "Au clic sur un item" },
      event: { item: {}, index: 0, route: "" },
      default: true
    },
    {
      name: "toggle-collapse",
      label: { en: "On toggle collapse", fr: "Au toggle collapse" },
      event: { collapsed: false }
    },
    {
      name: "logout-click",
      label: { en: "On logout click", fr: "Au clic déconnexion" },
      event: {}
    },
    {
      name: "user-menu-click",
      label: { en: "On user menu click", fr: "Au clic menu utilisateur" },
      event: { item: {}, action: "" }
    },
    {
      name: "promo-click",
      label: { en: "On promo button click", fr: "Au clic bouton promo" },
      event: {}
    },
    {
      name: "breadcrumb-click",
      label: { en: "On breadcrumb click", fr: "Au clic sur breadcrumb" },
      event: { item: {}, index: 0, route: "" }
    },
    {
      name: "notification-click",
      label: { en: "On notification click", fr: "Au clic notifications" },
      event: {}
    },
    {
      name: "theme-toggle",
      label: { en: "On theme toggle", fr: "Au changement de thème" },
      event: {}
    },
    {
      name: "settings-click",
      label: { en: "On settings click", fr: "Au clic paramètres" },
      event: {}
    },
    {
      name: "language-change",
      label: { en: "On language change", fr: "Au changement de langue" },
      event: { language: "" }
    }
  ],

  properties: {
    // ========== CONTENT SLOT (hidden, for wwLayout) ==========
    dashboardContent: {
      hidden: true,
      defaultValue: [],
    },

    // ========== LOGO SECTION ==========
    logoUrl: {
      label: { en: "Logo URL", fr: "URL du logo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: ""
    },
    logoIcon: {
      label: { en: "Logo icon (if no URL)", fr: "Icône logo (si pas d'URL)" },
      type: "SystemIcon",
      section: "settings",
      defaultValue: "lucide/layers"
    },
    logoText: {
      label: { en: "Logo text", fr: "Texte du logo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "Shadcn UI Kit"
    },
    logoColor: {
      label: { en: "Logo icon color", fr: "Couleur icône logo" },
      type: "Color",
      section: "settings",
      defaultValue: "#0f172a"
    },

    // ========== MENU ==========
    menuItems: {
      label: { en: "Menu items", fr: "Items du menu" },
      type: "Array",
      section: "settings",
      bindable: true,
      defaultValue: [
        { section: "ÉVÉNEMENTS", label: "Liste des événements", route: "/events", icon: "lucide/calendar", id: "events-list", badge: "" },
        { section: "ÉVÉNEMENTS", label: "Créer un événement", route: "/events/new", icon: "lucide/calendar-plus", id: "events-create", badge: "" },
        { section: "ÉVÉNEMENTS", label: "Kanban", route: "/kanban", icon: "lucide/kanban-square", id: "kanban", badge: "New" },
        { section: "TÂCHES", label: "Gérer les tâches", route: "/tasks", icon: "lucide/list-checks", id: "tasks", badge: "" },
        { section: "ÉQUIPE", label: "Gestion des utilisateurs", route: "/users", icon: "lucide/users", id: "users", badge: "" }
      ],
      options: {
        item: {
          type: "Object",
          defaultValue: { section: "", label: "Item", route: "/", icon: "lucide/circle", id: "", badge: "" },
          options: {
            item: {
              section: {
                label: { en: "Section" },
                type: "Text"
              },
              label: {
                label: { en: "Label" },
                type: "Text"
              },
              route: {
                label: { en: "Route" },
                type: "Text"
              },
              icon: { 
                label: { en: "Icon" }, 
                type: "SystemIcon"
              },
              id: {
                label: { en: "ID" },
                type: "Text"
              },
              badge: {
                label: { en: "Badge" },
                type: "Text"
              }
            }
          }
        }
      }
    },

    defaultActiveItem: {
      label: { en: "Default active item ID", fr: "ID item actif par défaut" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "events-list"
    },

    // ========== USER SECTION ==========
    userName: {
      label: { en: "User name", fr: "Nom utilisateur" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "Toby Belhome"
    },
    userEmail: {
      label: { en: "User email", fr: "Email utilisateur" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "hello@tobybelhome.com"
    },
    userAvatar: {
      label: { en: "User avatar URL", fr: "URL avatar utilisateur" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "https://i.pravatar.cc/40?img=12"
    },
    userMenuItems: {
      label: { en: "User menu items", fr: "Items menu utilisateur" },
      type: "Array",
      section: "settings",
      bindable: true,
      defaultValue: [
        { label: "Account", icon: "lucide/user", action: "account" },
        { label: "Notifications", icon: "lucide/bell", action: "notifications" }
      ],
      options: {
        item: {
          type: "Object",
          defaultValue: { label: "Item", icon: "lucide/circle", action: "" },
          options: {
            item: {
              label: { label: { en: "Label", fr: "Label" }, type: "Text" },
              icon: { label: { en: "Icon", fr: "Icône" }, type: "SystemIcon" },
              action: { label: { en: "Action", fr: "Action" }, type: "Text" }
            }
          }
        }
      }
    },
    logoutLabel: {
      label: { en: "Logout label", fr: "Label déconnexion" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "Log out"
    },

    // ========== PROMO CARD ==========
    showPromoCard: {
      label: { en: "Show promo card", fr: "Afficher carte promo" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    promoTitle: {
      label: { en: "Promo title", fr: "Titre promo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "Open Source"
    },
    promoDescription: {
      label: { en: "Promo description", fr: "Description promo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "This dashboard layout is free and open source. Star us on GitHub!"
    },
    promoButtonText: {
      label: { en: "Promo button text", fr: "Texte bouton promo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "⭐ Star on GitHub"
    },
    promoButtonUrl: {
      label: { en: "Promo button URL", fr: "URL bouton promo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "https://github.com/0x10a/weweb-dashboard-layout"
    },

    // ========== TOPBAR ==========
    showTopbar: {
      label: { en: "Show top bar", fr: "Afficher barre supérieure" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    showBreadcrumb: {
      label: { en: "Show breadcrumb", fr: "Afficher breadcrumb" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    breadcrumbItems: {
      label: { en: "Breadcrumb items", fr: "Items du breadcrumb" },
      type: "Array",
      section: "settings",
      bindable: true,
      defaultValue: [
        { label: "Home", route: "/", id: "home" },
        { label: "Événements", route: "/events", id: "events" },
        { label: "Liste des événements", route: "/events/list", id: "events-list" }
      ],
      options: {
        item: {
          type: "Object",
          defaultValue: { label: "Item", route: "/", id: "" },
          options: {
            item: {
              label: {
                label: { en: "Label" },
                type: "Text"
              },
              route: {
                label: { en: "Route" },
                type: "Text"
              },
              id: {
                label: { en: "ID" },
                type: "Text"
              }
            }
          }
        }
      }
    },
    showNotifications: {
      label: { en: "Show notifications", fr: "Afficher notifications" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    notificationCount: {
      label: { en: "Notification count", fr: "Nombre notifications" },
      type: "Number",
      section: "settings",
      bindable: true,
      defaultValue: 1
    },
    showThemeToggle: {
      label: { en: "Show theme toggle", fr: "Afficher toggle thème" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    showSettings: {
      label: { en: "Show settings button", fr: "Afficher paramètres" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    showLanguageSwitcher: {
      label: { en: "Show language switcher", fr: "Afficher sélecteur de langue" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },

    // ========== SIDEBAR BEHAVIOR ==========
    collapsed: {
      label: { en: "Collapsed by default", fr: "Réduite par défaut" },
      type: "OnOff",
      section: "settings",
      defaultValue: false
    },
    allowCollapse: {
      label: { en: "Allow collapse", fr: "Permettre réduction" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    sidebarWidth: {
      label: { en: "Sidebar width", fr: "Largeur sidebar" },
      type: "Text",
      section: "settings",
      defaultValue: "260px"
    },
    collapsedWidth: {
      label: { en: "Collapsed width", fr: "Largeur réduite" },
      type: "Text",
      section: "settings",
      defaultValue: "68px"
    },

    // ========== COLORS ==========
    sidebarBgColor: {
      label: { en: "Sidebar background", fr: "Fond sidebar" },
      type: "Color",
      section: "settings",
      defaultValue: "#F4F4F6"
    },
    textColor: {
      label: { en: "Text color", fr: "Couleur texte" },
      type: "Color",
      section: "settings",
      defaultValue: "#0f172a"
    },
    mutedTextColor: {
      label: { en: "Muted text color", fr: "Couleur texte atténué" },
      type: "Color",
      section: "settings",
      defaultValue: "#64748b"
    },
    sectionLabelColor: {
      label: { en: "Section label color", fr: "Couleur label section" },
      type: "Color",
      section: "settings",
      defaultValue: "#475569"
    },
    activeItemBg: {
      label: { en: "Active item background", fr: "Fond item actif" },
      type: "Color",
      section: "settings",
      defaultValue: "rgba(0,0,0,0.08)"
    },
    activeItemColor: {
      label: { en: "Active item color", fr: "Couleur item actif" },
      type: "Color",
      section: "settings",
      defaultValue: "#0f172a"
    },
    hoverBg: {
      label: { en: "Hover background", fr: "Fond au survol" },
      type: "Color",
      section: "settings",
      defaultValue: "rgba(0,0,0,0.04)"
    },
    badgeBgColor: {
      label: { en: "Badge background", fr: "Fond badge" },
      type: "Color",
      section: "settings",
      defaultValue: "#22c55e"
    },
    badgeTextColor: {
      label: { en: "Badge text color", fr: "Couleur texte badge" },
      type: "Color",
      section: "settings",
      defaultValue: "#ffffff"
    },
    promoCardBg: {
      label: { en: "Promo card background", fr: "Fond carte promo" },
      type: "Color",
      section: "settings",
      defaultValue: "rgba(0,0,0,0.04)"
    },
    promoBtnBg: {
      label: { en: "Promo button background", fr: "Fond bouton promo" },
      type: "Color",
      section: "settings",
      defaultValue: "#0f172a"
    },
    promoBtnColor: {
      label: { en: "Promo button text", fr: "Texte bouton promo" },
      type: "Color",
      section: "settings",
      defaultValue: "#ffffff"
    },
    searchBgColor: {
      label: { en: "Search background", fr: "Fond recherche" },
      type: "Color",
      section: "settings",
      defaultValue: "#f1f5f9"
    },

    // ========== LAYOUT ==========
    contentBorderRadius: {
      label: { en: "Content border radius", fr: "Arrondi du contenu" },
      type: "Text",
      section: "settings",
      defaultValue: "16px"
    },
    contentMarginTop: {
      label: { en: "Content margin top", fr: "Marge haute contenu" },
      type: "Text",
      section: "settings",
      defaultValue: "12px"
    }
  },

  options: {
    icons: [
      'lucide/layers',
      'lucide/layout-dashboard',
      'lucide/shopping-bag',
      'lucide/trending-up',
      'lucide/users',
      'lucide/bar-chart-2',
      'lucide/trello',
      'lucide/circle',
      'lucide/user',
      'lucide/bell',
      'lucide/log-out',
      'lucide/search',
      'lucide/sun',
      'lucide/settings',
      'lucide/panel-left',
      'lucide/more-vertical',
      'lucide/chevron-right'
    ]
  }
};
