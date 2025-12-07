export default {
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
      name: "search",
      label: { en: "On search", fr: "A la recherche" },
      event: { query: "" }
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
    }
  ],

  inherit: [{ type: 'ww-layout' }],

  properties: {
    // ========== CONTENT SLOT ==========
    children: {
      label: { en: 'Content', fr: 'Contenu' },
      type: 'Info',
      options: { text: { en: 'Drop elements in the content area' } },
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
        { section: "Dashboards", label: "Default", route: "/dashboard", icon: "lucide/layout-dashboard", id: "default", badge: "" },
        { section: "Dashboards", label: "E-commerce", route: "/ecommerce", icon: "lucide/shopping-bag", id: "ecommerce", badge: "" },
        { section: "Dashboards", label: "Sales", route: "/sales", icon: "lucide/trending-up", id: "sales", badge: "" },
        { section: "Dashboards", label: "CRM", route: "/crm", icon: "lucide/users", id: "crm", badge: "" },
        { section: "Dashboards", label: "Website Analytics", route: "/analytics", icon: "lucide/bar-chart-2", id: "analytics", badge: "" },
        { section: "Apps", label: "Kanban", route: "/kanban", icon: "lucide/trello", id: "kanban", badge: "New" }
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
      defaultValue: "default"
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
      defaultValue: "Download"
    },
    promoDescription: {
      label: { en: "Promo description", fr: "Description promo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "Unlock lifetime access to all dashboards, templates and components."
    },
    promoButtonText: {
      label: { en: "Promo button text", fr: "Texte bouton promo" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "Get Shadcn UI Kit"
    },

    // ========== TOPBAR ==========
    showTopbar: {
      label: { en: "Show top bar", fr: "Afficher barre supérieure" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    showSearch: {
      label: { en: "Show search", fr: "Afficher recherche" },
      type: "OnOff",
      section: "settings",
      defaultValue: true
    },
    searchPlaceholder: {
      label: { en: "Search placeholder", fr: "Placeholder recherche" },
      type: "Text",
      section: "settings",
      defaultValue: "Search..."
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
      label: { en: "Show settings button", fr: "Afficher bouton paramètres" },
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
  }
};
