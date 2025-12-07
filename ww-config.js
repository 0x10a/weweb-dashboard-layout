export default {
    inherit: { type: "ww-layout" },
    options: {
        sizable: true,
    },
    editor: {
        label: {
            en: "Dashboard Layout",
            fr: "Layout Dashboard",
        },
        icon: "view-grid",
    },
    triggerEvents: [
        {
            name: "menu-item-click",
            label: { en: "On menu item click" },
            event: { item: {}, index: 0, route: "" },
        },
        {
            name: "toggle-collapse",
            label: { en: "On sidebar collapse toggle" },
            event: { collapsed: false },
        },
        {
            name: "logout-click",
            label: { en: "On logout click" },
            event: {},
        },
        {
            name: "search",
            label: { en: "On search" },
            event: { query: "" },
        },
        {
            name: "notification-click",
            label: { en: "On notification click" },
            event: {},
        },
        {
            name: "theme-toggle",
            label: { en: "On theme toggle" },
            event: {},
        },
        {
            name: "settings-click",
            label: { en: "On settings click" },
            event: {},
        },
        {
            name: "promo-click",
            label: { en: "On promo click" },
            event: {},
        },
    ],
    properties: {
        dashboardContent: {
            hidden: true,
            defaultValue: [],
        },

        logoText: {
            label: { en: "Logo text", fr: "Texte logo" },
            type: "Text",
            defaultValue: "Dashboard",
            section: "settings",
            bindable: true,
        },
        logoColor: {
            label: { en: "Logo color", fr: "Couleur logo" },
            type: "Color",
            defaultValue: "#3b82f6",
            section: "settings",
        },

        menuItems: {
            label: { en: "Menu items", fr: "Éléments du menu" },
            type: "Array",
            section: "settings",
            bindable: true,
            defaultValue: [
                { section: "Main", label: "Dashboard", route: "/dashboard", icon: "layout-dashboard", id: "dashboard" },
                { section: "Main", label: "Analytics", route: "/analytics", icon: "bar-chart-3", id: "analytics" },
                { section: "Main", label: "Projects", route: "/projects", icon: "folder", id: "projects", badge: "12" },
                { section: "Content", label: "Documents", route: "/documents", icon: "file-text", id: "documents" },
                { section: "Content", label: "Media", route: "/media", icon: "image", id: "media" },
                { section: "Settings", label: "Settings", route: "/settings", icon: "settings", id: "settings" },
            ],
            options: {
                item: {
                    type: "Object",
                    defaultValue: { section: "", label: "New Item", route: "/", icon: "circle", id: "" },
                    options: {
                        item: {
                            section: { label: "Section", type: "Text" },
                            label: { label: "Label", type: "Text" },
                            route: { label: "Route", type: "Text" },
                            icon: { label: "Icon", type: "Text" },
                            id: { label: "ID", type: "Text" },
                            badge: { label: "Badge", type: "Text" },
                        },
                    },
                },
            },
        },

        userName: {
            label: { en: "User name", fr: "Nom utilisateur" },
            type: "Text",
            defaultValue: "John Doe",
            section: "settings",
            bindable: true,
        },
        userEmail: {
            label: { en: "User email", fr: "Email utilisateur" },
            type: "Text",
            defaultValue: "john@example.com",
            section: "settings",
            bindable: true,
        },
        userAvatar: {
            label: { en: "User avatar URL", fr: "URL avatar" },
            type: "Text",
            defaultValue: "",
            section: "settings",
            bindable: true,
        },

        promoTitle: {
            label: { en: "Promo title", fr: "Titre promo" },
            type: "Text",
            defaultValue: "Upgrade to Pro",
            section: "settings",
            bindable: true,
        },
        promoDescription: {
            label: { en: "Promo description", fr: "Description promo" },
            type: "Text",
            defaultValue: "Unlock all features and get unlimited access.",
            section: "settings",
            bindable: true,
        },
        promoButtonText: {
            label: { en: "Promo button text", fr: "Texte bouton promo" },
            type: "Text",
            defaultValue: "Upgrade",
            section: "settings",
            bindable: true,
        },

        sidebarBgColor: {
            label: { en: "Sidebar background", fr: "Fond sidebar" },
            type: "Color",
            defaultValue: "#0f172a",
            section: "style",
        },
        sidebarTextColor: {
            label: { en: "Text color", fr: "Couleur texte" },
            type: "Color",
            defaultValue: "#e2e8f0",
            section: "style",
        },
        sidebarMutedColor: {
            label: { en: "Muted color", fr: "Couleur atténuée" },
            type: "Color",
            defaultValue: "#64748b",
            section: "style",
        },
        sectionLabelColor: {
            label: { en: "Section label color", fr: "Couleur section" },
            type: "Color",
            defaultValue: "#475569",
            section: "style",
        },
        activeItemBg: {
            label: { en: "Active item background", fr: "Fond item actif" },
            type: "Color",
            defaultValue: "#1e293b",
            section: "style",
        },
        activeItemColor: {
            label: { en: "Active item color", fr: "Couleur item actif" },
            type: "Color",
            defaultValue: "#3b82f6",
            section: "style",
        },
        hoverBgColor: {
            label: { en: "Hover background", fr: "Fond survol" },
            type: "Color",
            defaultValue: "#1e293b",
            section: "style",
        },
        badgeBgColor: {
            label: { en: "Badge background", fr: "Fond badge" },
            type: "Color",
            defaultValue: "#3b82f6",
            section: "style",
        },
        badgeTextColor: {
            label: { en: "Badge text color", fr: "Couleur texte badge" },
            type: "Color",
            defaultValue: "#ffffff",
            section: "style",
        },
        promoBgColor: {
            label: { en: "Promo background", fr: "Fond promo" },
            type: "Color",
            defaultValue: "#1e293b",
            section: "style",
        },
        promoBorderColor: {
            label: { en: "Promo border", fr: "Bordure promo" },
            type: "Color",
            defaultValue: "#334155",
            section: "style",
        },
        promoButtonBg: {
            label: { en: "Promo button background", fr: "Fond bouton promo" },
            type: "Color",
            defaultValue: "#3b82f6",
            section: "style",
        },
        contentBgColor: {
            label: { en: "Content background", fr: "Fond contenu" },
            type: "Color",
            defaultValue: "#f1f5f9",
            section: "style",
        },
        topbarBgColor: {
            label: { en: "Topbar background", fr: "Fond topbar" },
            type: "Color",
            defaultValue: "#ffffff",
            section: "style",
        },

        sidebarWidth: {
            label: { en: "Sidebar width", fr: "Largeur sidebar" },
            type: "Length",
            options: {
                unitChoices: [{ value: "px", label: "px", min: 200, max: 400 }],
            },
            defaultValue: "280px",
            responsive: true,
            section: "style",
        },
        collapsedWidth: {
            label: { en: "Collapsed width", fr: "Largeur réduite" },
            type: "Length",
            options: {
                unitChoices: [{ value: "px", label: "px", min: 50, max: 100 }],
            },
            defaultValue: "68px",
            section: "style",
        },
        contentBorderRadius: {
            label: { en: "Content border radius", fr: "Rayon bordure contenu" },
            type: "Length",
            options: {
                unitChoices: [{ value: "px", label: "px", min: 0, max: 32 }],
            },
            defaultValue: "16px",
            section: "style",
        },
        contentMarginTop: {
            label: { en: "Content margin top", fr: "Marge haut contenu" },
            type: "Length",
            options: {
                unitChoices: [{ value: "px", label: "px", min: 0, max: 100 }],
            },
            defaultValue: "16px",
            section: "style",
        },

        showTopbar: {
            label: { en: "Show topbar", fr: "Afficher topbar" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
        showSearch: {
            label: { en: "Show search", fr: "Afficher recherche" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
        showNotifications: {
            label: { en: "Show notifications", fr: "Afficher notifications" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
        showThemeToggle: {
            label: { en: "Show theme toggle", fr: "Afficher thème" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
        showSettings: {
            label: { en: "Show settings", fr: "Afficher paramètres" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
        showPromoCard: {
            label: { en: "Show promo card", fr: "Afficher carte promo" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
        allowCollapse: {
            label: { en: "Allow collapse", fr: "Autoriser réduction" },
            type: "OnOff",
            defaultValue: true,
            section: "settings",
        },
    },
};
