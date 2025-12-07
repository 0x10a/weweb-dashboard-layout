<template>
    <div class="dashboard-layout" :style="layoutStyles">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ collapsed: isCollapsed }" :style="sidebarStyles">
            <!-- Logo -->
            <div class="logo-section">
                <div class="logo" :style="{ color: content.logoColor }">
                    <span class="logo-icon">◆</span>
                    <span v-if="!isCollapsed" class="logo-text">{{ content.logoText }}</span>
                </div>
                <button 
                    v-if="content.allowCollapse" 
                    class="collapse-btn" 
                    :style="{ color: content.sidebarMutedColor }"
                    @click="toggleCollapse"
                >
                    {{ isCollapsed ? '→' : '←' }}
                </button>
            </div>

            <!-- Navigation -->
            <nav class="nav-section">
                <template v-for="(section, sectionName) in groupedMenuItems" :key="sectionName">
                    <div v-if="!isCollapsed && sectionName" class="section-label" :style="{ color: content.sectionLabelColor }">
                        {{ sectionName }}
                    </div>
                    <div 
                        v-for="(item, index) in section" 
                        :key="item.id || index"
                        class="nav-item"
                        :class="{ active: activeItemId === item.id }"
                        :style="getNavItemStyles(item)"
                        @click="handleMenuClick(item, index)"
                        @mouseenter="hoveredItem = item.id"
                        @mouseleave="hoveredItem = null"
                    >
                        <span class="nav-icon">{{ getIconSymbol(item.icon) }}</span>
                        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
                        <span 
                            v-if="!isCollapsed && item.badge" 
                            class="nav-badge"
                            :style="{ backgroundColor: content.badgeBgColor, color: content.badgeTextColor }"
                        >
                            {{ item.badge }}
                        </span>
                    </div>
                </template>
            </nav>

            <!-- Promo Card -->
            <div 
                v-if="content.showPromoCard && !isCollapsed" 
                class="promo-card"
                :style="promoCardStyles"
            >
                <div class="promo-title">{{ content.promoTitle }}</div>
                <div class="promo-description" :style="{ color: content.sidebarMutedColor }">
                    {{ content.promoDescription }}
                </div>
                <button 
                    class="promo-btn"
                    :style="{ backgroundColor: content.promoButtonBg }"
                    @click="handlePromoClick"
                >
                    {{ content.promoButtonText }}
                </button>
            </div>

            <!-- User Section -->
            <div class="user-section" :style="{ borderColor: content.sectionLabelColor }">
                <div class="user-avatar">
                    <img v-if="content.userAvatar" :src="content.userAvatar" alt="Avatar" />
                    <span v-else class="avatar-placeholder">{{ userInitials }}</span>
                </div>
                <div v-if="!isCollapsed" class="user-info">
                    <div class="user-name">{{ content.userName }}</div>
                    <div class="user-email" :style="{ color: content.sidebarMutedColor }">{{ content.userEmail }}</div>
                </div>
                <button 
                    v-if="!isCollapsed" 
                    class="logout-btn" 
                    :style="{ color: content.sidebarMutedColor }"
                    @click="handleLogout"
                    title="Logout"
                >
                    ⏻
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="main-wrapper">
            <!-- Topbar -->
            <header v-if="content.showTopbar" class="topbar" :style="topbarStyles">
                <div class="topbar-left">
                    <div v-if="content.showSearch" class="search-box">
                        <span class="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            v-model="searchQuery"
                            @input="handleSearch"
                        />
                    </div>
                </div>
                <div class="topbar-right">
                    <button 
                        v-if="content.showNotifications" 
                        class="topbar-btn"
                        @click="handleNotificationClick"
                    >
                        🔔
                    </button>
                    <button 
                        v-if="content.showThemeToggle" 
                        class="topbar-btn"
                        @click="handleThemeToggle"
                    >
                        ◐
                    </button>
                    <button 
                        v-if="content.showSettings" 
                        class="topbar-btn"
                        @click="handleSettingsClick"
                    >
                        ⚙
                    </button>
                </div>
            </header>

            <!-- Content Area -->
            <main class="content-area" :style="contentAreaStyles">
                <wwLayout path="dashboardContent"></wwLayout>
            </main>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ["update:content", "trigger-event"],
    data() {
        return {
            isCollapsed: false,
            activeItemId: null,
            hoveredItem: null,
            searchQuery: "",
        };
    },
    computed: {
        layoutStyles() {
            return {
                "--sidebar-width": this.isCollapsed ? this.content.collapsedWidth : this.content.sidebarWidth,
            };
        },
        sidebarStyles() {
            return {
                width: this.isCollapsed ? this.content.collapsedWidth : this.content.sidebarWidth,
                backgroundColor: this.content.sidebarBgColor,
                color: this.content.sidebarTextColor,
            };
        },
        topbarStyles() {
            return {
                backgroundColor: this.content.topbarBgColor,
            };
        },
        contentAreaStyles() {
            return {
                backgroundColor: this.content.contentBgColor,
                borderRadius: this.content.contentBorderRadius,
                marginTop: this.content.showTopbar ? "0" : this.content.contentMarginTop,
            };
        },
        promoCardStyles() {
            return {
                backgroundColor: this.content.promoBgColor,
                borderColor: this.content.promoBorderColor,
            };
        },
        groupedMenuItems() {
            const items = this.content.menuItems || [];
            const groups = {};
            items.forEach(item => {
                const section = item.section || "";
                if (!groups[section]) groups[section] = [];
                groups[section].push(item);
            });
            return groups;
        },
        userInitials() {
            const name = this.content.userName || "";
            return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        },
    },
    methods: {
        getIconSymbol(iconName) {
            const icons = {
                "layout-dashboard": "▦",
                "bar-chart-3": "📊",
                "folder": "📁",
                "file-text": "📄",
                "image": "🖼",
                "settings": "⚙",
                "circle": "●",
                "box": "◆",
            };
            return icons[iconName] || "●";
        },
        getNavItemStyles(item) {
            const isActive = this.activeItemId === item.id;
            const isHovered = this.hoveredItem === item.id;
            return {
                backgroundColor: isActive ? this.content.activeItemBg : (isHovered ? this.content.hoverBgColor : "transparent"),
                color: isActive ? this.content.activeItemColor : this.content.sidebarTextColor,
            };
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.$emit("trigger-event", {
                name: "toggle-collapse",
                event: { collapsed: this.isCollapsed },
            });
        },
        handleMenuClick(item, index) {
            this.activeItemId = item.id;
            this.$emit("trigger-event", {
                name: "menu-item-click",
                event: { item, index, route: item.route },
            });
        },
        handleLogout() {
            this.$emit("trigger-event", { name: "logout-click", event: {} });
        },
        handleSearch() {
            this.$emit("trigger-event", {
                name: "search",
                event: { query: this.searchQuery },
            });
        },
        handleNotificationClick() {
            this.$emit("trigger-event", { name: "notification-click", event: {} });
        },
        handleThemeToggle() {
            this.$emit("trigger-event", { name: "theme-toggle", event: {} });
        },
        handleSettingsClick() {
            this.$emit("trigger-event", { name: "settings-click", event: {} });
        },
        handlePromoClick() {
            this.$emit("trigger-event", { name: "promo-click", event: {} });
        },
    },
};
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    width: 100%;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Sidebar */
.sidebar {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width 0.3s ease;
    overflow: hidden;
}

.sidebar.collapsed {
    align-items: center;
}

/* Logo */
.logo-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;
}

.logo-icon {
    font-size: 24px;
}

.collapse-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    font-size: 16px;
    transition: background 0.2s;
}

.collapse-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Navigation */
.nav-section {
    flex: 1;
    padding: 16px 8px;
    overflow-y: auto;
}

.section-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 16px 12px 8px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 2px;
}

.collapsed .nav-item {
    justify-content: center;
    padding: 12px;
}

.nav-icon {
    font-size: 18px;
    flex-shrink: 0;
}

.nav-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
}

.nav-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
}

/* Promo Card */
.promo-card {
    margin: 16px;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid;
}

.promo-title {
    font-weight: 600;
    margin-bottom: 8px;
}

.promo-description {
    font-size: 13px;
    margin-bottom: 12px;
    line-height: 1.4;
}

.promo-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.promo-btn:hover {
    opacity: 0.9;
}

/* User Section */
.user-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    color: white;
    font-weight: 600;
    font-size: 14px;
}

.user-info {
    flex: 1;
    min-width: 0;
}

.user-name {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-email {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.logout-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    font-size: 16px;
    transition: background 0.2s;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Main Wrapper */
.main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

/* Topbar */
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.topbar-left {
    flex: 1;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f1f5f9;
    padding: 8px 16px;
    border-radius: 8px;
    max-width: 400px;
}

.search-icon {
    font-size: 14px;
}

.search-box input {
    border: none;
    background: none;
    outline: none;
    flex: 1;
    font-size: 14px;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.topbar-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 16px;
    transition: background 0.2s;
}

.topbar-btn:hover {
    background: #f1f5f9;
}

/* Content Area */
.content-area {
    flex: 1;
    margin: 16px;
    padding: 24px;
    min-height: 0;
    overflow: auto;
}
</style>
