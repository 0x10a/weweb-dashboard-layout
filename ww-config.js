export default {
    options: {
        lazyHydrate: true,
    },
    inherit: [{ type: 'ww-layout' }],
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
            label: { en: 'Content' },
            type: 'Info',
            options: { text: 'Drop elements here' },
            hidden: true,
            defaultValue: [],
            bindable: 'repeatable',
        },
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
            defaultValue: '240px',
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
        minHeight: {
            label: { en: 'Min height' },
            type: 'Length',
            section: 'settings',
            defaultValue: '400px',
        },
        pageTitle: {
            label: { en: 'Page title' },
            type: 'Text',
            section: 'settings',
            defaultValue: 'Dashboard',
            bindable: true,
            hidden: content => !content.showTopbar,
        },
    },
};
