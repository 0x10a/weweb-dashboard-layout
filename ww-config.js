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
    properties: {
        dashboardContent: {
            hidden: true,
            defaultValue: [],
        },
        sidebarWidth: {
            label: {
                en: "Sidebar width",
                fr: "Largeur sidebar",
            },
            type: "Length",
            options: {
                unitChoices: [
                    { value: "px", label: "px", min: 100, max: 400 },
                ],
            },
            defaultValue: "250px",
            responsive: true,
        },
        sidebarBgColor: {
            label: {
                en: "Sidebar background",
                fr: "Fond sidebar",
            },
            type: "Color",
            defaultValue: "#1e293b",
        },
        logoText: {
            label: {
                en: "Logo text",
                fr: "Texte logo",
            },
            type: "Text",
            defaultValue: "Dashboard",
        },
    },
};
