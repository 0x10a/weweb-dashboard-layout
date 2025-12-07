<template>
    <div class="ww-dashboard-layout" :style="layoutStyles">
        <!-- Sidebar -->
        <aside class="ww-sidebar" :class="{ 'ww-collapsed': isCollapsedState }" :style="sidebarStyles">
            <!-- Logo Header -->
            <div class="ww-sidebar-header">
                <div class="ww-logo-area">
                    <img v-if="content.logoUrl" :src="content.logoUrl" alt="Logo" class="ww-logo-img" />
                    <div v-else class="ww-logo-icon" :style="{ color: content.logoColor }">
                        <component :is="getIcon(content.logoIcon)" :size="24" />
                    </div>
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
                            <component :is="getIcon(item.icon)" :size="18" class="ww-nav-icon" />
                            <span v-if="!isCollapsedState" class="ww-nav-label">{{ item.label }}</span>
                            <component
                                v-if="!isCollapsedState && item.children && item.children.length"
                                :is="ChevronRight"
                                :size="14"
                                class="ww-nav-arrow"
                                :class="{ 'ww-rotated': expandedItems.includes(item.id) }"
                            />
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
                    <component v-if="!isCollapsedState" :is="MoreVertical" :size="16" class="ww-user-menu-btn" :style="{ color: content.mutedTextColor }" />
                    
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
                            <component :is="getIcon(menuItem.icon)" :size="16" />
                            <span>{{ menuItem.label }}</span>
                        </div>
                        <div class="ww-dropdown-divider"></div>
                        <div class="ww-dropdown-item" @click.stop="handleLogout">
                            <component :is="LogOut" :size="16" />
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
                    <button v-if="content.allowCollapse" class="ww-topbar-btn" @click="toggleCollapse">
                        <component :is="PanelLeft" :size="18" />
                    </button>

                    <div v-if="content.showSearch" class="ww-search-container" :style="searchContainerStyle">
                        <component :is="Search" :size="16" class="ww-search-icon" />
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
                        <component :is="Bell" :size="18" />
                        <span v-if="content.notificationCount > 0" class="ww-notification-badge"></span>
                    </button>
                    <button v-if="content.showThemeToggle" class="ww-topbar-btn" @click="handleThemeToggle">
                        <component :is="Sun" :size="18" />
                    </button>
                    <button v-if="content.showSettings" class="ww-topbar-btn" @click="handleSettingsClick">
                        <component :is="Settings" :size="18" />
                    </button>
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
                                <component :is="getIcon(menuItem.icon)" :size="16" />
                                <span>{{ menuItem.label }}</span>
                            </div>
                            <div class="ww-dropdown-divider"></div>
                            <div class="ww-dropdown-item" @click.stop="handleLogout">
                                <component :is="LogOut" :size="16" />
                                <span>{{ content.logoutLabel }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content Area (WeWeb Drop Zone) -->
            <main class="ww-content-area" :style="contentAreaStyle">
                <wwLayout path="dashboardContent" />
            </main>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import {
    Layers, LayoutDashboard, ShoppingBag, TrendingUp, Users, BarChart2, Trello, Circle,
    ChevronRight, MoreVertical, LogOut, PanelLeft, Search, Bell, Sun, Settings,
    User, CreditCard, HelpCircle, Home, FileText, Calendar, Mail, MessageSquare,
    Folder, Image, Video, Music, Database, Server, Cloud, Lock, Key, Shield,
    Zap, Activity, PieChart, LineChart, Target, Award, Gift, Heart, Star,
    Bookmark, Flag, Tag, Hash, AtSign, Link, Paperclip, Download, Upload,
    Share, Send, Phone, MapPin, Navigation, Compass, Globe, Map
} from 'lucide-vue-next';

const iconMap = {
    'layers': Layers,
    'layout-dashboard': LayoutDashboard,
    'shopping-bag': ShoppingBag,
    'trending-up': TrendingUp,
    'users': Users,
    'bar-chart-2': BarChart2,
    'trello': Trello,
    'circle': Circle,
    'chevron-right': ChevronRight,
    'more-vertical': MoreVertical,
    'log-out': LogOut,
    'panel-left': PanelLeft,
    'search': Search,
    'bell': Bell,
    'sun': Sun,
    'settings': Settings,
    'user': User,
    'credit-card': CreditCard,
    'help-circle': HelpCircle,
    'home': Home,
    'file-text': FileText,
    'calendar': Calendar,
    'mail': Mail,
    'message-square': MessageSquare,
    'folder': Folder,
    'image': Image,
    'video': Video,
    'music': Music,
    'database': Database,
    'server': Server,
    'cloud': Cloud,
    'lock': Lock,
    'key': Key,
    'shield': Shield,
    'zap': Zap,
    'activity': Activity,
    'pie-chart': PieChart,
    'line-chart': LineChart,
    'target': Target,
    'award': Award,
    'gift': Gift,
    'heart': Heart,
    'star': Star,
    'bookmark': Bookmark,
    'flag': Flag,
    'tag': Tag,
    'hash': Hash,
    'at-sign': AtSign,
    'link': Link,
    'paperclip': Paperclip,
    'download': Download,
    'upload': Upload,
    'share': Share,
    'send': Send,
    'phone': Phone,
    'map-pin': MapPin,
    'navigation': Navigation,
    'compass': Compass,
    'globe': Globe,
    'map': Map,
};

export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event'],
    setup(props, { emit }) {
        const isEditing = computed(() => {
            /* wwEditor:start */
            return props.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        });

        const isCollapsedState = ref(false);
        const activeItemId = ref('');
        const expandedItems = ref([]);
        const showUserMenu = ref(false);
        const showTopbarMenu = ref(false);
        const searchQuery = ref('');

        const getIcon = (name) => {
            if (!name) return Circle;
            let iconName = name;
            if (name.includes('/')) {
                iconName = name.split('/').pop();
            }
            return iconMap[iconName] || Circle;
        };

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
                backgroundColor: isActive ? (props.content.activeItemBg || '#fff') : 'transparent',
                color: isActive ? (props.content.activeItemColor || '#0f172a') : (props.content.itemColor || '#64748b'),
                borderRadius: props.content.itemBorderRadius || '6px'
            };
        };

        const getSubItemStyle = (child) => {
            const isActive = activeItemId.value === child.id;
            return {
                color: isActive ? (props.content.activeItemColor || '#0f172a') : (props.content.itemColor || '#64748b')
            };
        };

        const toggleCollapse = () => {
            isCollapsedState.value = !isCollapsedState.value;
            emit('trigger-event', { name: 'toggle-collapse', event: { collapsed: isCollapsedState.value } });
        };

        const handleItemClick = (item, index) => {
            if (item.children && item.children.length) {
                const idx = expandedItems.value.indexOf(item.id);
                if (idx > -1) {
                    expandedItems.value.splice(idx, 1);
                } else {
                    expandedItems.value.push(item.id);
                }
            } else {
                activeItemId.value = item.id;
                emit('trigger-event', { name: 'menu-item-click', event: { item, index, route: item.route } });
            }
        };

        const handleSubItemClick = (child, childIndex) => {
            activeItemId.value = child.id;
            emit('trigger-event', { name: 'menu-item-click', event: { item: child, index: childIndex, route: child.route } });
        };

        const toggleUserMenu = () => {
            showUserMenu.value = !showUserMenu.value;
        };

        const handleUserMenuClick = (menuItem) => {
            showUserMenu.value = false;
            showTopbarMenu.value = false;
            emit('trigger-event', { name: 'user-menu-click', event: { item: menuItem, action: menuItem.action } });
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
            isEditing,
            isCollapsedState,
            activeItemId,
            expandedItems,
            showUserMenu,
            showTopbarMenu,
            searchQuery,
            layoutStyles,
            sidebarStyles,
            mainAreaStyle,
            contentAreaStyle,
            topbarStyle,
            searchContainerStyle,
            badgeStyle,
            promoCardStyle,
            promoBtnStyle,
            menuSections,
            getNavItemStyle,
            getSubItemStyle,
            toggleCollapse,
            handleItemClick,
            handleSubItemClick,
            toggleUserMenu,
            handleUserMenuClick,
            handleLogout,
            handlePromoClick,
            handleSearch,
            handleNotificationClick,
            handleThemeToggle,
            handleSettingsClick,
            getIcon,
            // Export icon components for template
            ChevronRight,
            MoreVertical,
            LogOut,
            PanelLeft,
            Search,
            Bell,
            Sun,
            Settings,
        };
    },
};
</script>

<style lang="scss" scoped>
.ww-dashboard-layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.ww-sidebar {
    display: flex;
    flex-direction: column;
    transition: width 0.2s ease;
    overflow: hidden;
    flex-shrink: 0;
}

.ww-collapsed {
    align-items: center;
}

.ww-sidebar-header {
    padding: 16px;
}

.ww-logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
}

.ww-logo-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.ww-logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.ww-logo-text {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
}

.ww-sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px;
}

.ww-nav-section {
    margin-bottom: 16px;
}

.ww-section-label {
    font-size: 11px;
    text-transform: uppercase;
    padding: 8px 12px;
    display: block;
    letter-spacing: 0.5px;
}

.ww-nav-item-wrapper {
    margin-bottom: 2px;
}

.ww-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 13px;
}

.ww-nav-item:hover {
    opacity: 0.8;
}

.ww-nav-icon {
    flex-shrink: 0;
}

.ww-nav-label {
    flex: 1;
    white-space: nowrap;
}

.ww-nav-arrow {
    transition: transform 0.2s ease;
}

.ww-nav-arrow.ww-rotated {
    transform: rotate(90deg);
}

.ww-nav-badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 500;
}

.ww-nav-submenu {
    margin-left: 28px;
    padding-left: 12px;
    border-left: 1px solid #e2e8f0;
}

.ww-nav-subitem {
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.ww-nav-subitem:hover {
    opacity: 0.8;
}

.ww-sidebar-footer {
    padding: 16px;
    margin-top: auto;
}

.ww-promo-card {
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ww-promo-content strong {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
}

.ww-promo-content p {
    font-size: 12px;
    margin: 0 0 12px 0;
    line-height: 1.4;
}

.ww-promo-btn {
    width: 100%;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.ww-promo-btn:hover {
    opacity: 0.9;
}

.ww-user-section {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.15s ease;
}

.ww-user-section:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.ww-user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
}

.ww-user-info {
    flex: 1;
    min-width: 0;
}

.ww-user-name {
    display: block;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ww-user-email {
    display: block;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ww-user-menu-btn {
    flex-shrink: 0;
}

.ww-user-dropdown,
.ww-topbar-dropdown {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 200px;
}

.ww-topbar-dropdown {
    top: calc(100% + 8px);
    bottom: auto;
    left: auto;
    right: 0;
}

.ww-dropdown-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
}

.ww-dropdown-avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
}

.ww-dropdown-user-info {
    flex: 1;
}

.ww-dropdown-name {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
}

.ww-dropdown-email {
    display: block;
    font-size: 11px;
    color: #64748b;
}

.ww-dropdown-divider {
    height: 1px;
    background: #e2e8f0;
    margin: 4px 0;
}

.ww-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    font-size: 13px;
    color: #475569;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.ww-dropdown-item:hover {
    background-color: #f1f5f9;
}

.ww-main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.ww-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
}

.ww-topbar-left,
.ww-topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.ww-topbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: #64748b;
    transition: all 0.15s ease;
}

.ww-topbar-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
}

.ww-notification {
    position: relative;
}

.ww-notification-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
}

.ww-search-container {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    min-width: 200px;
}

.ww-search-icon {
    color: #94a3b8;
}

.ww-search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    outline: none;
    color: #0f172a;
}

.ww-search-input::placeholder {
    color: #94a3b8;
}

.ww-topbar-profile {
    position: relative;
    cursor: pointer;
}

.ww-topbar-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: cover;
}

.ww-content-area {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}
</style>
