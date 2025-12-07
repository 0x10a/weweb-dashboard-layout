export default {
    options: {
        lazyHydrate: true,
    },
    editor: {
        label: {
            en: 'Dashboard Layout',
            fr: 'Layout Dashboard',
        },
        icon: 'border',
    },
    triggerEvents: [
        {
            name: 'menu-item-click',
            label: { en: 'On menu item click' },
            event: { item: {}, index: 0 },
        },
    ],
    properties: {
        children: {
            hidden: true,
            defaultValue: [],
        },
        logoText: {
            label: { en: 'Logo text' },
            type: 'Text',
            section: 'settings',
            bindable: true,
            defaultValue: 'Dashboard',
        },
        sidebarBgColor: {
            label: { en: 'Sidebar color' },
            type: 'Color',
            section: 'settings',
            defaultValue: '#1e293b',
        },
        sidebarWidth: {
            label: { en: 'Sidebar width' },
            type: 'Length',
            section: 'settings',
            defaultValue: '240px',
        },
        menuItems: {
            label: { en: 'Menu items' },
            type: 'Array',
            section: 'settings',
            bindable: true,
            defaultValue: [
                { label: 'Home', id: 'home' },
                { label: 'Settings', id: 'settings' },
            ],
            options: {
                item: {
                    type: 'Object',
                    defaultValue: { label: 'New item', id: '' },
                    options: {
                        item: {
                            label: {
                                label: { en: 'Label' },
                                type: 'Text',
                            },
                            id: {
                                label: { en: 'ID' },
                                type: 'Text',
                            },
                        },
                    },
                },
            },
        },
    },
};
