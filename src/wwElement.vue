<template>
    <div class="ww-dashboard-layout" :style="layoutStyles">
        <!-- Sidebar -->
        <aside class="ww-sidebar" :class="{ 'ww-collapsed': isCollapsedState }" :style="sidebarStyles">
            <!-- Logo Header -->
            <div class="ww-sidebar-header">
                <div class="ww-logo-area">
                    <img v-if="content.logoUrl" :src="content.logoUrl" alt="Logo" class="ww-logo-img" />
                    <div v-else class="ww-logo-icon" :style="{ color: content.logoColor }" v-html="logoIconHtml"></div>
                    <span v-if="!isCollapsedState" class="ww-logo-text" :style="{ color: content.textColor }">
                        {{ content.logoText }}
                    </span>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="ww-sidebar-nav">
                <div v-for="(section, sectionIndex) in menuSections" :key="sectionIndex" class="ww-nav-section">
                    <span v-if="!isCollapsedState && section.label" class="ww-section-label" :style="{ color: content.sectionLabelColor }">
                        {{ section.label }}
                    </span>

                    <div v-for="(item, index) in section.items" :key="item.id || index" class="ww-nav-item-wrapper">
                        <div
                            class="ww-nav-item"
                            :class="{ 'ww-active': activeItemId === item.id }"
                            :style="getNavItemStyle(item)"
                            @click="handleItemClick(item, index)"
                        >
                            <span class="ww-nav-icon" v-html="getIconHtml(item.icon)"></span>
                            <span v-if="!isCollapsedState" class="ww-nav-label">{{ item.label }}</span>
                            <span
                                v-if="!isCollapsedState && item.children && item.children.length"
                                class="ww-nav-arrow"
                                :class="{ 'ww-rotated': expandedItems.includes(item.id) }"
                                v-html="chevronIcon"
                            ></span>
                            <span v-if="!isCollapsedState && item.badge" class="ww-nav-badge" :style="badgeStyle">
                                {{ item.badge }}
                            </span>
                        </div>

                        <!-- Sub-menu -->
                        <div v-if="item.children && item.children.length && expandedItems.includes(item.id) && !isCollapsedState" class="ww-nav-submenu">
                            <div
                                v-for="(child, childIndex) in item.children"
                                :key="child.id || childIndex"
                                class="ww-nav-subitem"
                                :class="{ 'ww-active': activeItemId === child.id }"
                                :style="getSubItemStyle(child)"
                                @click.stop="handleSubItemClick(child, childIndex)"
                            >
                                {{ child.label }}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Footer -->
            <div class="ww-sidebar-footer">
                <!-- Promo Card -->
                <div v-if="!isCollapsedState && content.showPromoCard" class="ww-promo-card" :style="promoCardStyle">
                    <div class="ww-promo-content">
                        <strong :style="{ color: content.textColor }">{{ content.promoTitle }}</strong>
                        <p :style="{ color: content.mutedTextColor }">{{ content.promoDescription }}</p>
                    </div>
                    <button class="ww-promo-btn" :style="promoBtnStyle" @click="handlePromoClick">
                        {{ content.promoButtonText }}
                    </button>
                </div>

                <!-- User Profile -->
                <div class="ww-user-section" @click="toggleUserMenu">
                    <img :src="content.userAvatar" alt="User" class="ww-user-avatar" />
                    <div v-if="!isCollapsedState" class="ww-user-info">
                        <span class="ww-user-name" :style="{ color: content.textColor }">{{ content.userName }}</span>
                        <span class="ww-user-email" :style="{ color: content.mutedTextColor }">{{ content.userEmail }}</span>
                    </div>
                    <span v-if="!isCollapsedState" class="ww-user-menu-btn" :style="{ color: content.mutedTextColor }" v-html="moreIcon"></span>
                    
                    <!-- User Dropdown Menu -->
                    <div v-if="showUserMenu && !isCollapsedState" class="ww-user-dropdown">
                        <div class="ww-dropdown-header">
                            <img :src="content.userAvatar" alt="User" class="ww-dropdown-avatar" />
                            <div class="ww-dropdown-user-info">
                                <span class="ww-dropdown-name">{{ content.userName }}</span>
                                <span class="ww-dropdown-email">{{ content.userEmail }}</span>
                            </div>
                        </div>
                        <div class="ww-dropdown-divider"></div>
                        <div
                            v-for="(menuItem, idx) in content.userMenuItems"
                            :key="idx"
                            class="ww-dropdown-item"
                            @click.stop="handleUserMenuClick(menuItem)"
                        >
                            <span v-html="getIconHtml(menuItem.icon)"></span>
                            <span>{{ menuItem.label }}</span>
                        </div>
                        <div class="ww-dropdown-divider"></div>
                        <div class="ww-dropdown-item" @click.stop="handleLogout">
                            <span v-html="logoutIcon"></span>
                            <span>{{ content.logoutLabel }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Area -->
        <div class="ww-main-area" :style="mainAreaStyle">
            <!-- Top Bar -->
            <header v-if="content.showTopbar" class="ww-topbar" :style="topbarStyle">
                <div class="ww-topbar-left">
                    <button v-if="content.allowCollapse" class="ww-topbar-btn" @click="toggleCollapse" v-html="panelIcon"></button>

                    <div v-if="content.showSearch" class="ww-search-container" :style="searchContainerStyle">
                        <span class="ww-search-icon" v-html="searchIcon"></span>
                        <input
                            type="text"
                            :placeholder="content.searchPlaceholder"
                            class="ww-search-input"
                            v-model="searchQuery"
                            @input="handleSearch"
                        />
                    </div>
                </div>

                <div class="ww-topbar-right">
                    <button v-if="content.showNotifications" class="ww-topbar-btn ww-notification" @click="handleNotificationClick">
                        <span v-html="bellIcon"></span>
                        <span v-if="content.notificationCount > 0" class="ww-notification-badge"></span>
                    </button>
                    <button v-if="content.showThemeToggle" class="ww-topbar-btn" @click="handleThemeToggle" v-html="sunIcon"></button>
                    <button v-if="content.showSettings" class="ww-topbar-btn" @click="handleSettingsClick" v-html="settingsIcon"></button>
                    <div class="ww-topbar-profile" @click="showTopbarMenu = !showTopbarMenu">
                        <img :src="content.userAvatar" alt="User" class="ww-topbar-avatar" />

                        <!-- Topbar User Dropdown Menu -->
                        <div v-if="showTopbarMenu" class="ww-topbar-dropdown">
                            <div class="ww-dropdown-header">
                                <img :src="content.userAvatar" alt="User" class="ww-dropdown-avatar" />
                                <div class="ww-dropdown-user-info">
                                    <span class="ww-dropdown-name">{{ content.userName }}</span>
                                    <span class="ww-dropdown-email">{{ content.userEmail }}</span>
                                </div>
                            </div>
                            <div class="ww-dropdown-divider"></div>
                            <div
                                v-for="(menuItem, idx) in content.userMenuItems"
                                :key="idx"
                                class="ww-dropdown-item"
                                @click.stop="handleUserMenuClick(menuItem)"
                            >
                                <span v-html="getIconHtml(menuItem.icon)"></span>
                                <span>{{ menuItem.label }}</span>
                            </div>
                            <div class="ww-dropdown-divider"></div>
                            <div class="ww-dropdown-item" @click.stop="handleLogout">
                                <span v-html="logoutIcon"></span>
                                <span>{{ content.logoutLabel }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content Area (WeWeb Drop Zone) -->
            <main class="ww-content-area" :style="contentAreaStyle">
                <wwLayout path="dashboardContent"></wwLayout>
            </main>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

const ICONS = {
    'layout-dashboard': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    'layers': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    'shopping-bag': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    'trending-up': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    'users': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'bar-chart-2': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>',
    'trello': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="3" height="9" x="7" y="7"/><rect width="3" height="5" x="14" y="7"/></svg>',
    'circle': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
    'chevron-right': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    'more-vertical': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
    'log-out': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
    'panel-left': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>',
    'search': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    'bell': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    'sun': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    'settings': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    'user': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'credit-card': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
    'help-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
};

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event', 'update:content'],
    setup(props, { emit }) {
        const isCollapsedState = ref(false);
        const activeItemId = ref('');
        const expandedItems = ref([]);
        const showUserMenu = ref(false);
        const showTopbarMenu = ref(false);
        const searchQuery = ref('');

        const chevronIcon = ICONS['chevron-right'];
        const moreIcon = ICONS['more-vertical'];
        const logoutIcon = ICONS['log-out'];
        const panelIcon = ICONS['panel-left'];
        const searchIcon = ICONS['search'];
        const bellIcon = ICONS['bell'];
        const sunIcon = ICONS['sun'];
        const settingsIcon = ICONS['settings'];

        const getIconHtml = (name) => {
            if (!name) return ICONS['circle'];
            let iconName = name;
            if (name.includes('/')) {
                iconName = name.split('/').pop();
            }
            return ICONS[iconName] || ICONS['circle'];
        };

        const logoIconHtml = computed(() => getIconHtml(props.content.logoIcon || 'layers'));

        const layoutStyles = computed(() => ({
            '--layout-bg': props.content.sidebarBgColor || '#F4F4F6'
        }));

        const sidebarStyles = computed(() => ({
            backgroundColor: props.content.sidebarBgColor || '#F4F4F6',
            width: isCollapsedState.value ? (props.content.collapsedWidth || '60px') : (props.content.sidebarWidth || '240px')
        }));

        const mainAreaStyle = computed(() => ({
            borderTopLeftRadius: props.content.contentBorderRadius || '12px',
            marginTop: props.content.contentMarginTop || '0px',
            backgroundColor: '#fff'
        }));

        const contentAreaStyle = computed(() => ({
            backgroundColor: props.content.contentBgColor || '#fff'
        }));

        const topbarStyle = computed(() => ({
            borderTopLeftRadius: props.content.contentBorderRadius || '12px'
        }));

        const searchContainerStyle = computed(() => ({
            backgroundColor: props.content.searchBgColor || '#f1f5f9'
        }));

        const badgeStyle = computed(() => ({
            backgroundColor: props.content.badgeBgColor || '#0f172a',
            color: props.content.badgeTextColor || '#fff'
        }));

        const promoCardStyle = computed(() => ({
            backgroundColor: props.content.promoCardBg || '#fff'
        }));

        const promoBtnStyle = computed(() => ({
            backgroundColor: props.content.promoBtnBg || '#0f172a',
            color: props.content.promoBtnColor || '#fff'
        }));

        const menuSections = computed(() => {
            const items = props.content.menuItems || [];
            const sections = {};
            items.forEach(item => {
                const sectionLabel = item.section || 'Menu';
                if (!sections[sectionLabel]) {
                    sections[sectionLabel] = { label: sectionLabel, items: [] };
                }
                sections[sectionLabel].items.push(item);
            });
            return Object.values(sections);
        });

        watch(() => props.content.isCollapsed, (newVal) => {
            isCollapsedState.value = newVal;
        }, { immediate: true });

        watch(() => props.content.activeItemId, (newVal) => {
            activeItemId.value = newVal;
        }, { immediate: true });

        const getNavItemStyle = (item) => {
            const isActive = activeItemId.value === item.id;
            return {
                backgroundColor: isActive ? (props.content.activeItemBg || 'rgba(0,0,0,0.06)') : 'transparent',
                color: isActive ? (props.content.activeItemColor || '#0f172a') : (props.content.textColor || '#0f172a')
            };
        };

        const getSubItemStyle = (child) => {
            const isActive = activeItemId.value === child.id;
            return {
                color: isActive ? (props.content.activeItemColor || '#0f172a') : (props.content.mutedTextColor || '#64748b'),
                backgroundColor: isActive ? (props.content.activeItemBg || 'rgba(0,0,0,0.06)') : 'transparent',
                borderLeftColor: isActive ? (props.content.activeItemColor || '#0f172a') : 'transparent'
            };
        };

        const toggleCollapse = () => {
            isCollapsedState.value = !isCollapsedState.value;
            emit('trigger-event', { name: 'toggle-collapse', event: { collapsed: isCollapsedState.value } });
        };

        const handleItemClick = (item, index) => {
            if (item.children && item.children.length) {
                const idx = expandedItems.value.indexOf(item.id);
                if (idx > -1) expandedItems.value.splice(idx, 1);
                else expandedItems.value.push(item.id);
            } else {
                activeItemId.value = item.id;
                emit('trigger-event', { name: 'menu-item-click', event: { item, index, route: item.route || '' } });
            }
        };

        const handleSubItemClick = (child, index) => {
            activeItemId.value = child.id;
            emit('trigger-event', { name: 'menu-item-click', event: { item: child, index, route: child.route || '' } });
        };

        const toggleUserMenu = () => {
            showUserMenu.value = !showUserMenu.value;
            showTopbarMenu.value = false;
        };

        const handleUserMenuClick = (menuItem) => {
            showUserMenu.value = false;
            showTopbarMenu.value = false;
            emit('trigger-event', { name: 'user-menu-click', event: { item: menuItem, action: menuItem.action || '' } });
        };

        const handleLogout = () => {
            showUserMenu.value = false;
            showTopbarMenu.value = false;
            emit('trigger-event', { name: 'logout-click', event: {} });
        };

        const handlePromoClick = () => {
            emit('trigger-event', { name: 'promo-click', event: {} });
        };

        const handleSearch = () => {
            emit('trigger-event', { name: 'search', event: { query: searchQuery.value } });
        };

        const handleNotificationClick = () => {
            emit('trigger-event', { name: 'notification-click', event: {} });
        };

        const handleThemeToggle = () => {
            emit('trigger-event', { name: 'theme-toggle', event: {} });
        };

        const handleSettingsClick = () => {
            emit('trigger-event', { name: 'settings-click', event: {} });
        };

        return {
            isCollapsedState, activeItemId, expandedItems, showUserMenu, showTopbarMenu, searchQuery,
            chevronIcon, moreIcon, logoutIcon, panelIcon, searchIcon, bellIcon, sunIcon, settingsIcon,
            getIconHtml, logoIconHtml, layoutStyles, sidebarStyles, mainAreaStyle, contentAreaStyle,
            topbarStyle, searchContainerStyle, badgeStyle, promoCardStyle, promoBtnStyle, menuSections,
            getNavItemStyle, getSubItemStyle, toggleCollapse, handleItemClick, handleSubItemClick,
            toggleUserMenu, handleUserMenuClick, handleLogout, handlePromoClick, handleSearch,
            handleNotificationClick, handleThemeToggle, handleSettingsClick,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-dashboard-layout {
    display: grid !important;
    grid-template-columns: auto 1fr;
    width: 100% !important;
    min-height: 100vh;
    background-color: var(--layout-bg, #F4F4F6) !important;
}
.ww-sidebar {
    grid-column: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: width 0.2s ease;
    overflow: hidden;
    &:hover { overflow-y: auto; }
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
}
.ww-sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 16px 8px 16px;
    min-height: 49px;
}
.ww-logo-area { display: flex; align-items: center; gap: 10px; }
.ww-logo-img { width: 28px; height: 28px; object-fit: contain; }
.ww-logo-icon { display: flex; align-items: center; justify-content: center; }
.ww-logo-text { font-size: 15px; font-weight: 600; white-space: nowrap; }
.ww-sidebar-nav { flex: 1; padding: 8px 12px; }
.ww-nav-section { margin-bottom: 8px; }
.ww-section-label { display: block; padding: 8px 16px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.ww-nav-item-wrapper { position: relative; }
.ww-nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 16px;
    cursor: pointer; transition: all 0.15s ease; font-size: 13px; border-radius: 6px;
    &:hover { background: rgba(0,0,0,0.04); }
}
.ww-nav-icon { flex-shrink: 0; display: flex; align-items: center; }
.ww-nav-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ww-nav-arrow { transition: transform 0.2s ease; display: flex; align-items: center; &.ww-rotated { transform: rotate(90deg); } }
.ww-nav-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
.ww-nav-submenu { padding-left: 44px; }
.ww-nav-subitem { position: relative; padding: 8px 16px 8px 12px; font-size: 13px; cursor: pointer; border-left: 2px solid transparent; margin-left: -2px; transition: all 0.15s ease; &:hover { color: #0f172a; } }
.ww-sidebar-footer { margin-top: auto; padding: 12px; }
.ww-promo-card { padding: 14px; border-radius: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.ww-promo-content { margin-bottom: 12px; strong { display: block; font-size: 13px; margin-bottom: 4px; } p { font-size: 11px; margin: 0; line-height: 1.4; } }
.ww-promo-btn { width: 100%; padding: 8px 12px; border: none; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: opacity 0.15s; &:hover { opacity: 0.9; } }
.ww-user-section { position: relative; display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; transition: background 0.15s; &:hover { background: rgba(0,0,0,0.04); } }
.ww-user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.ww-user-info { flex: 1; min-width: 0; }
.ww-user-name { display: block; font-size: 13px; font-weight: 500; }
.ww-user-email { display: block; font-size: 11px; overflow: hidden; text-overflow: ellipsis; }
.ww-user-menu-btn { cursor: pointer; display: flex; align-items: center; }
.ww-user-dropdown, .ww-topbar-dropdown { position: absolute; background: #fff; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 8px 0; z-index: 1000; min-width: 220px; }
.ww-user-dropdown { bottom: 100%; left: 0; right: 0; margin-bottom: 8px; }
.ww-topbar-dropdown { top: 100%; right: 0; margin-top: 8px; }
.ww-dropdown-header { display: flex; align-items: center; gap: 10px; padding: 12px 14px; }
.ww-dropdown-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.ww-dropdown-user-info { flex: 1; }
.ww-dropdown-name { display: block; color: #0f172a; font-size: 13px; font-weight: 500; }
.ww-dropdown-email { display: block; color: #64748b; font-size: 11px; }
.ww-dropdown-divider { height: 1px; background: #e2e8f0; margin: 4px 0; }
.ww-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; color: #64748b; font-size: 13px; cursor: pointer; transition: background 0.15s; &:hover { background: #f8fafc; color: #0f172a; } }
.ww-sidebar.ww-collapsed {
    .ww-logo-text, .ww-section-label, .ww-nav-label, .ww-nav-arrow, .ww-nav-badge, .ww-nav-submenu, .ww-promo-card, .ww-user-info, .ww-user-menu-btn { display: none; }
    .ww-nav-item { justify-content: center; padding: 12px; }
    .ww-user-section { justify-content: center; }
    .ww-sidebar-header { justify-content: center; }
}
.ww-main-area { grid-column: 2; display: flex !important; flex-direction: column !important; min-height: 100vh; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
.ww-topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
.ww-topbar-left { display: flex; align-items: center; gap: 16px; }
.ww-topbar-btn { position: relative; background: none; border: none; color: #64748b; padding: 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover { background: #f1f5f9; color: #0f172a; } &.ww-notification .ww-notification-badge { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid #fff; } }
.ww-search-container { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; min-width: 280px; }
.ww-search-icon { color: #94a3b8; flex-shrink: 0; display: flex; align-items: center; }
.ww-search-input { flex: 1; border: none; background: none; outline: none; font-size: 13px; color: #0f172a; &::placeholder { color: #94a3b8; } }
.ww-topbar-right { display: flex; align-items: center; gap: 4px; }
.ww-topbar-profile { position: relative; cursor: pointer; margin-left: 8px; }
.ww-topbar-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.ww-content-area { flex: 1; overflow-y: auto; padding: 24px; }
</style>
