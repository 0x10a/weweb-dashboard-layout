<template>
  <div class="ww-dashboard-layout" :style="layoutStyles">
    <!-- Sidebar -->
    <aside class="ww-sidebar" :class="{ 'ww-collapsed': isCollapsedState }" :style="sidebarStyles">
      <!-- Logo Header -->
      <div class="ww-sidebar-header">
        <div class="ww-logo-area">
          <img v-if="content.logoUrl" :src="content.logoUrl" alt="Logo" class="ww-logo-img" />
          <div v-else class="ww-logo-icon" :style="{ color: content.logoColor }">
            <span class="ww-icon" v-html="getIconSvg(content.logoIcon)"></span>
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
              <span class="ww-nav-icon" v-html="getIconSvg(item.icon)"></span>
              <span v-if="!isCollapsedState" class="ww-nav-label">{{ item.label }}</span>
              <span v-if="!isCollapsedState && item.children && item.children.length" class="ww-nav-arrow" :class="{ 'ww-rotated': expandedItems.includes(item.id) }" v-html="getIconSvg('chevron-right')"></span>
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
          <span v-if="!isCollapsedState" class="ww-user-menu-btn" :style="{ color: content.mutedTextColor }" v-html="getIconSvg('more-vertical')"></span>
          
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
              <span class="ww-dropdown-icon" v-html="getIconSvg(menuItem.icon)"></span>
              <span>{{ menuItem.label }}</span>
            </div>
            <div class="ww-dropdown-divider"></div>
            <div class="ww-dropdown-item" @click.stop="handleLogout">
              <span class="ww-dropdown-icon" v-html="getIconSvg('power')"></span>
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
            <span class="ww-icon" v-html="getIconSvg('menu')"></span>
          </button>

          <div v-if="content.showSearch" class="ww-search-container" :style="searchContainerStyle">
            <span class="ww-search-icon" v-html="getIconSvg('search')"></span>
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
            <span v-html="getIconSvg('bell')"></span>
            <span v-if="content.notificationCount > 0" class="ww-notification-badge"></span>
          </button>
          <button v-if="content.showThemeToggle" class="ww-topbar-btn" @click="handleThemeToggle">
            <span v-html="getIconSvg('sun')"></span>
          </button>
          <button v-if="content.showSettings" class="ww-topbar-btn" @click="handleSettingsClick">
            <span v-html="getIconSvg('settings')"></span>
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
                <span class="ww-dropdown-icon" v-html="getIconSvg(menuItem.icon)"></span>
                <span>{{ menuItem.label }}</span>
              </div>
              <div class="ww-dropdown-divider"></div>
              <div class="ww-dropdown-item" @click.stop="handleLogout">
                <span class="ww-dropdown-icon" v-html="getIconSvg('power')"></span>
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
    getIconSvg(iconName) {
      if (!iconName) return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg>';
      
      let name = iconName;
      if (name.includes('/')) {
        name = name.split('/').pop();
      }
      
      const svgIcons = {
        'menu': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
        'home': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
        'layout-dashboard': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
        'users': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        'user': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        'settings': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        'bell': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        'search': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
        'shopping-bag': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
        'shopping-cart': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
        'trending-up': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
        'bar-chart-2': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>',
        'bar-chart-3': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
        'layers': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
        'log-out': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
        'sun': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
        'moon': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
        'chevron-right': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
        'chevron-down': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
        'more-vertical': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
        'folder': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
        'file-text': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
        'mail': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        'calendar': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
        'check': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
        'x': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
        'plus': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
        'minus': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
        'edit': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>',
        'trash': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
        'download': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
        'upload': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
        'link': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
        'external-link': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
        'lock': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        'eye': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
        'heart': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
        'star': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        'clock': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        'map-pin': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
        'phone': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        'message-circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
        'credit-card': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
        'globe': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
        'cloud': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
        'database': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
        'zap': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
        'shield': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
        'key': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>',
        'package': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
        'briefcase': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
        'inbox': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
        'archive': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
        'circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
        'activity': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
        'power': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>',
        'trello': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="3" height="9" x="7" y="7"/><rect width="3" height="5" x="14" y="7"/></svg>',
        'info': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
        'help-circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
        'alert-circle': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
        'box': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
        'image': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
      };
      
      return svgIcons[name] || '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg>';
    },
    
    getNavItemStyle(item) {
      const isActive = this.activeItemId === item.id;
      return {
        backgroundColor: isActive ? (this.content.activeItemBg || 'rgba(0,0,0,0.06)') : 'transparent',
        color: isActive ? (this.content.activeItemColor || '#0f172a') : (this.content.textColor || '#0f172a')
      };
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
  transition: all 0.15s ease;
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
