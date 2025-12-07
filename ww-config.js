export default {
    type: 'wwObject',
    editor: {
        label: {
            en: 'Dashboard Layout',
            fr: 'Layout Dashboard',
        },
        icon: 'view-grid',
    },
    properties: {
        logoText: {
            label: { en: 'Logo text' },
            type: 'Text',
            section: 'settings',
            defaultValue: 'My App',
            bindable: true,
        },
        menuItems: {
            label: { en: 'Menu items' },
            type: 'Array',
            section: 'settings',
            options: {
                item: {
                    type: 'Object',
                    options: {
                        item: {
                            label: { label: { en: 'Label' }, type: 'Text', defaultValue: 'Menu' },
                        },
                    },
                },
            },
            defaultValue: [
                { label: 'Dashboard' },
                { label: 'Analytics' },
                { label: 'Settings' },
            ],
            bindable: true,
        },
        sidebarWidth: {
            label: { en: 'Sidebar width' },
            type: 'Length',
            section: 'settings',
            defaultValue: '220px',
        },
        sidebarBgColor: {
            label: { en: 'Sidebar background' },
            type: 'Color',
            section: 'settings',
            defaultValue: '#1e293b',
        },
        showTopbar: {
            label: { en: 'Show topbar' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: true,
        },
        pageTitle: {
            label: { en: 'Page title' },
            type: 'Text',
            section: 'settings',
            defaultValue: 'Dashboard',
            bindable: true,
        },
    },
};
