<template>
  <div class="ww-dashboard-layout" :style="layoutStyles">
    <!-- Sidebar -->
    <aside class="ww-sidebar" :class="{ 'ww-collapsed': isCollapsedState }" :style="sidebarStyles">
      <!-- Logo Header -->
      <div class="ww-sidebar-header">
        <div class="ww-logo-area">
          <img v-if="content.logoUrl" :src="content.logoUrl" alt="Logo" class="ww-logo-img" />
          <component v-else :is="getIconComponent(content.logoIcon)" :size="24" class="ww-logo-icon" :style="{ color: content.logoColor }" />
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
              <component :is="getIconComponent(item.icon)" :size="18" class="ww-nav-icon" />
              <span v-if="!isCollapsedState" class="ww-nav-label">{{ item.label }}</span>
              <component v-if="!isCollapsedState && item.children && item.children.length" :is="'ChevronRight'" :size="14" class="ww-nav-arrow" :class="{ 'ww-rotated': expandedItems.includes(item.id) }" />
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
          <component v-if="!isCollapsedState" :is="'MoreVertical'" :size="16" class="ww-user-menu-btn" :style="{ color: content.mutedTextColor }" />
          
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
              <component :is="getIconComponent(menuItem.icon)" :size="16" class="ww-dropdown-icon" />
              <span>{{ menuItem.label }}</span>
            </div>
            <div class="ww-dropdown-divider"></div>
            <div class="ww-dropdown-item" @click.stop="handleLogout">
              <component :is="'LogOut'" :size="16" class="ww-dropdown-icon" />
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
            <PanelLeft :size="18" />
          </button>

          <div v-if="content.showSearch" class="ww-search-container" :style="searchContainerStyle">
            <Search :size="16" class="ww-search-icon" />
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
            <Bell :size="18" />
            <span v-if="content.notificationCount > 0" class="ww-notification-badge"></span>
          </button>
          <button v-if="content.showThemeToggle" class="ww-topbar-btn" @click="handleThemeToggle">
            <Sun :size="18" />
          </button>
          <button v-if="content.showSettings" class="ww-topbar-btn" @click="handleSettingsClick">
            <Settings :size="18" />
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
                <component :is="getIconComponent(menuItem.icon)" :size="16" class="ww-dropdown-icon" />
                <span>{{ menuItem.label }}</span>
              </div>
              <div class="ww-dropdown-divider"></div>
              <div class="ww-dropdown-item" @click.stop="handleLogout">
                <LogOut :size="16" class="ww-dropdown-icon" />
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
export default {
  name: 'DashboardLayout',

  components: {},

  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    uid: {
      type: String,
      default: ''
    }
  },

  emits: ['trigger-event', 'update:content'],

  data() {
    return {
      isCollapsedState: false,
      activeItemId: '',
      expandedItems: [],
      showUserMenu: false,
      showTopbarMenu: false,
      searchQuery: ''
    };
  },

  computed: {
    layoutStyles() {
      return {
        '--layout-bg': this.content.sidebarBgColor || '#F4F4F6'
      };
    },
    sidebarStyles() {
      return {
        backgroundColor: this.content.sidebarBgColor || '#F4F4F6',
        width: this.isCollapsedState ? (this.content.collapsedWidth || '60px') : (this.content.sidebarWidth || '240px')
      };
    },
    mainAreaStyle() {
      return {
        borderTopLeftRadius: this.content.contentBorderRadius || '12px',
        marginTop: this.content.contentMarginTop || '0px',
        backgroundColor: '#fff'
      };
    },
    contentAreaStyle() {
      return {
        backgroundColor: this.content.contentBgColor || '#fff'
      };
    },
    topbarStyle() {
      return {
        borderTopLeftRadius: this.content.contentBorderRadius || '12px'
      };
    },
    searchContainerStyle() {
      return {
        backgroundColor: this.content.searchBgColor || '#f1f5f9'
      };
    },
    badgeStyle() {
      return {
        backgroundColor: this.content.badgeBgColor || '#0f172a',
        color: this.content.badgeTextColor || '#fff'
      };
    },
    promoCardStyle() {
      return {
        backgroundColor: this.content.promoCardBg || '#fff'
      };
    },
    promoBtnStyle() {
      return {
        backgroundColor: this.content.promoBtnBg || '#0f172a',
        color: this.content.promoBtnColor || '#fff'
      };
    },
    menuSections() {
      const items = this.content.menuItems || [];
      const sections = {};

      items.forEach(item => {
        const sectionLabel = item.section || 'Menu';
        if (!sections[sectionLabel]) {
          sections[sectionLabel] = {
            label: sectionLabel,
            items: []
          };
        }
        sections[sectionLabel].items.push(item);
      });

      return Object.values(sections);
    }
  },

  watch: {
    'content.isCollapsed': {
      handler(newVal) {
        this.isCollapsedState = newVal;
      },
      immediate: true
    },
    'content.activeItemId': {
      handler(newVal) {
        this.activeItemId = newVal;
      },
      immediate: true
    }
  },

  methods: {
    getIconComponent(iconName) {
      if (!iconName) return 'Circle';
      
      // Supprimer le préfixe lucide/ si présent
      const cleanName = iconName.replace('lucide/', '');
      
      // Convertir en PascalCase (kebab-case -> PascalCase)
      const componentName = cleanName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      
      // Retourner le nom du composant s'il existe, sinon fallback
      return this.$options.components[componentName] ? componentName : 'Circle';
    },
    
    getNavItemStyle(item) {
      const isActive = this.activeItemId === item.id;
      const style = {
        color: isActive ? (this.content.activeItemColor || '#0f172a') : (this.content.textColor || '#0f172a')
      };
      
      if (isActive) {
        style.backgroundColor = this.content.activeItemBg || 'rgba(0,0,0,0.06)';
      }
      
      return style;
    },
    
    getSubItemStyle(child) {
      const isActive = this.activeItemId === child.id;
      return {
        color: isActive ? (this.content.activeItemColor || '#0f172a') : (this.content.mutedTextColor || '#64748b'),
        backgroundColor: isActive ? (this.content.activeItemBg || 'rgba(0,0,0,0.06)') : 'transparent',
        borderLeftColor: isActive ? (this.content.activeItemColor || '#0f172a') : 'transparent'
      };
    },
    
    toggleCollapse() {
      this.isCollapsedState = !this.isCollapsedState;
      this.$emit('trigger-event', {
        name: 'toggle-collapse',
        event: { collapsed: this.isCollapsedState }
      });
    },
    
    handleItemClick(item, index) {
      if (item.children && item.children.length) {
        const idx = this.expandedItems.indexOf(item.id);
        if (idx > -1) {
          this.expandedItems.splice(idx, 1);
        } else {
          this.expandedItems.push(item.id);
        }
      } else {
        this.activeItemId = item.id;
        this.$emit('trigger-event', {
          name: 'menu-item-click',
          event: { item, index, route: item.route || '' }
        });
      }
    },
    
    handleSubItemClick(child, index) {
      this.activeItemId = child.id;
      this.$emit('trigger-event', {
        name: 'menu-item-click',
        event: { item: child, index, route: child.route || '' }
      });
    },
    
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
      this.showTopbarMenu = false;
    },
    
    handleUserMenuClick(menuItem) {
      this.showUserMenu = false;
      this.showTopbarMenu = false;
      this.$emit('trigger-event', {
        name: 'user-menu-click',
        event: { item: menuItem, action: menuItem.action || '' }
      });
    },
    
    handleLogout() {
      this.showUserMenu = false;
      this.showTopbarMenu = false;
      this.$emit('trigger-event', {
        name: 'logout-click',
        event: {}
      });
    },
    
    handlePromoClick() {
      this.$emit('trigger-event', {
        name: 'promo-click',
        event: {}
      });
    },
    
    handleSearch() {
      this.$emit('trigger-event', {
        name: 'search',
        event: { query: this.searchQuery }
      });
    },
    
    handleNotificationClick() {
      this.$emit('trigger-event', {
        name: 'notification-click',
        event: {}
      });
    },
    
    handleThemeToggle() {
      this.$emit('trigger-event', {
        name: 'theme-toggle',
        event: {}
      });
    },
    
    handleSettingsClick() {
      this.$emit('trigger-event', {
        name: 'settings-click',
        event: {}
      });
    }
  }
};
</script>

<style scoped>
/* ========== LAYOUT ========== */
.ww-dashboard-layout {
  display: grid !important;
  grid-template-columns: auto 1fr;
  width: 100% !important;
  min-height: 100vh;
  background-color: var(--layout-bg, #F4F4F6) !important;
}

/* ========== SIDEBAR ========== */
.ww-sidebar {
  grid-column: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  overflow: hidden;
}

.ww-sidebar:hover {
  overflow-y: auto;
}

.ww-sidebar::-webkit-scrollbar {
  width: 4px;
}

.ww-sidebar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

/* Header */
.ww-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 16px 8px 16px;
  min-height: 49px;
}

.ww-logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ww-logo-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.ww-logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ww-icon {
  font-size: 24px;
  line-height: 1;
}

.ww-logo-text {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

/* Navigation */
.ww-sidebar-nav {
  flex: 1;
  padding: 8px 12px;
}

.ww-nav-section {
  margin-bottom: 8px;
}

.ww-section-label {
  display: block;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ww-nav-item-wrapper {
  position: relative;
}

.ww-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  border-radius: 6px;
}

.ww-nav-item:hover {
  background: rgba(0,0,0,0.04);
}

.ww-nav-icon {
  flex-shrink: 0;
  font-size: 18px;
}

.ww-nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ww-nav-arrow {
  transition: transform 0.2s ease;
}

.ww-nav-arrow.ww-rotated {
  transform: rotate(90deg);
}

.ww-nav-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

/* Submenu */
.ww-nav-submenu {
  padding-left: 44px;
}

.ww-nav-subitem {
  position: relative;
  padding: 8px 16px 8px 12px;
  font-size: 13px;
  cursor: pointer;
  border-left: 2px solid transparent;
  margin-left: -2px;
  transition: all 0.15s ease;
}

.ww-nav-subitem:hover {
  color: #0f172a;
}

/* Footer */
.ww-sidebar-footer {
  margin-top: auto;
  padding: 12px;
}

/* Promo Card */
.ww-promo-card {
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.ww-promo-content {
  margin-bottom: 12px;
}

.ww-promo-content strong {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}

.ww-promo-content p {
  font-size: 11px;
  margin: 0;
  line-height: 1.4;
}

.ww-promo-btn {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.ww-promo-btn:hover {
  opacity: 0.9;
}

/* User Section */
.ww-user-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.ww-user-section:hover {
  background: rgba(0,0,0,0.04);
}

.ww-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.ww-user-info {
  flex: 1;
  min-width: 0;
}

.ww-user-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
}

.ww-user-email {
  display: block;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ww-user-menu-btn {
  cursor: pointer;
  font-size: 18px;
}

/* User Dropdown Menu */
.ww-user-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  margin-bottom: 8px;
  padding: 8px 0;
  z-index: 1000;
}

.ww-dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}

.ww-dropdown-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.ww-dropdown-user-info {
  flex: 1;
}

.ww-dropdown-name {
  display: block;
  color: #0f172a;
  font-size: 13px;
  font-weight: 500;
}

.ww-dropdown-email {
  display: block;
  color: #64748b;
  font-size: 11px;
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
  padding: 10px 14px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.ww-dropdown-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.ww-dropdown-icon {
  font-size: 16px;
}

/* Collapsed State */
.ww-sidebar.ww-collapsed .ww-logo-text,
.ww-sidebar.ww-collapsed .ww-section-label,
.ww-sidebar.ww-collapsed .ww-nav-label,
.ww-sidebar.ww-collapsed .ww-nav-arrow,
.ww-sidebar.ww-collapsed .ww-nav-badge,
.ww-sidebar.ww-collapsed .ww-nav-submenu,
.ww-sidebar.ww-collapsed .ww-promo-card,
.ww-sidebar.ww-collapsed .ww-user-info,
.ww-sidebar.ww-collapsed .ww-user-menu-btn {
  display: none;
}

.ww-sidebar.ww-collapsed .ww-nav-item {
  justify-content: center;
  padding: 12px;
}

.ww-sidebar.ww-collapsed .ww-user-section {
  justify-content: center;
}

.ww-sidebar.ww-collapsed .ww-sidebar-header {
  justify-content: center;
}

/* ========== MAIN AREA ========== */
.ww-main-area {
  grid-column: 2;
  display: flex !important;
  flex-direction: column !important;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

/* Top Bar */
.ww-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.ww-topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ww-topbar-btn {
  position: relative;
  background: none;
  border: none;
  color: #64748b;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.ww-topbar-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.ww-topbar-btn.ww-notification .ww-notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
}

.ww-search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 280px;
}

.ww-search-icon {
  color: #94a3b8;
  flex-shrink: 0;
  font-size: 14px;
}

.ww-search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  color: #0f172a;
}

.ww-search-input::placeholder {
  color: #94a3b8;
}

.ww-topbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ww-topbar-profile {
  position: relative;
  cursor: pointer;
  margin-left: 8px;
}

.ww-topbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.ww-topbar-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  margin-top: 8px;
  padding: 8px 0;
  z-index: 1000;
  min-width: 220px;
}

/* ========== CONTENT AREA ========== */
.ww-content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>
