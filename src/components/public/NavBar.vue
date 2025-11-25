<template>
  <header>
    <div class="header-area header-area1 d-none d-lg-block" id="header">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="header-elements">
              <div class="site-logo">
                <router-link to="/"
                  ><img src="@/assets/main-logo.png" alt="interview9.id"
                /></router-link>
              </div>

              <div
                class="main-menu-ex main-menu-ex1"
                style="
                  flex: 1;
                  min-width: 0;
                  overflow-x: auto;
                  overflow-y: hidden;
                  margin: 0 1.5rem;
                "
              >
                <ul style="display: flex; white-space: nowrap; gap: 0">
                  <template v-for="menu in menus" :key="menu.id">
                    <li v-if="menu.type === 'category_link'">
                      <router-link :to="menu.url">{{ menu.name }}</router-link>
                    </li>
                    <li v-else-if="menu.type === 'custom_link'">
                      <router-link v-if="isInternal(menu.url)" :to="getPath(menu.url)">{{
                        menu.name
                      }}</router-link>
                      <a v-else :href="menu.url" target="_blank">{{ menu.name }}</a>
                    </li>
                    <li
                      v-else-if="menu.type === 'parent'"
                      :ref="(el) => (dropdownParents[menu.id] = el)"
                      class="dropdown-menu-parrent"
                      style="position: relative"
                    >
                      <a href="#" @click.prevent="toggleDropdown(menu.id)"
                        >{{ menu.name }} <i class="fa-solid fa-angle-down"></i
                      ></a>
                      <Teleport to="body">
                        <ul
                          v-if="openDropdownId === menu.id"
                          ref="dropdownMenu"
                          :style="dropdownStyle"
                          class="teleported-dropdown"
                        >
                          <li v-for="child in menu.children" :key="child.id">
                            <router-link :to="child.url">{{ child.name }}</router-link>
                          </li>
                        </ul>
                      </Teleport>
                    </li>
                  </template>
                </ul>
              </div>

              <div class="header1-buttons">
                <a class="theme-btn1" @click="openSearchPopup"
                  ><i class="fa-regular fa-magnifying-glass mr-5"></i> Pencarian
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!--=====HEADER END=======-->

  <!--=====Mobile header start=======-->
  <div class="mobile-header mobile-header-main d-block d-lg-none">
    <div class="container-fluid">
      <div class="col-12">
        <div class="mobile-header-elements">
          <div class="mobile-logo">
            <router-link to="/"
              ><img src="@/assets/main-logo.png" alt="interview9.id"
            /></router-link>
          </div>
          <div class="mobile-nav-icon">
            <i class="fa-duotone fa-bars-staggered"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mobile-sidebar d-block d-lg-none">
    <div class="logo-m" :to="`/`">
      <img src="@/assets/main-logo.png" alt="interview9.id" />
    </div>
    <div class="menu-close">
      <i class="fa-solid fa-xmark"></i>
    </div>
    <div class="mobile-nav">
      <div class="input-group mt-5 mb-5" style="gap: 1rem">
        <input
          type="text"
          class="form-control minimalist-input"
          v-model="searchQuery"
          placeholder="Masukkan kata kunci yang anda cari..."
          @keyup.enter="performSearchMobile"
        />
        <button class="btn mobile-search-button" @click="performSearchMobile">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19.0002 19.0002L17.2002 17.2002"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <ul @click="handleMobileNavLinkClick">
        <template v-for="menu in menus" :key="menu.id">
          <li v-if="menu.type === 'category_link'">
            <router-link :to="menu.url">{{ menu.name }}</router-link>
          </li>
          <li v-else-if="menu.type === 'custom_link'">
            <router-link v-if="isInternal(menu.url)" :to="getPath(menu.url)">{{
              menu.name
            }}</router-link>
            <a v-else :href="menu.url" target="_blank">{{ menu.name }}</a>
          </li>
          <li
            v-else-if="menu.type === 'parent'"
            class="has-dropdown has-dropdown1"
            :class="{ 'submenu-opened': openMobileMenuId === menu.id }"
          >
            <a
              href="#"
              class="main flex justify-between"
              @click.prevent="toggleMobileSubmenu(menu.id)"
            >
              {{ menu.name }}
              <i
                class="fa-solid fa-angle-down mobile-arrow"
                :class="{ 'rotate-180': openMobileMenuId === menu.id }"
              ></i>
            </a>
            <ul class="sub-menu" :class="{ 'open-sub': openMobileMenuId === menu.id }">
              <li v-for="child in menu.children" :key="child.id">
                <router-link :to="child.url">{{ child.name }}</router-link>
              </li>
            </ul>
            <hr class="my-2" />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

export default {
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const searchQuery = ref('')
    const router = useRouter()
    const openDropdownId = ref(null)
    const dropdownParents = ref({})
    const dropdownMenu = ref(null)
    const dropdownStyle = ref({})
    const openMobileMenuId = ref(null) // NEW

    const openSearchPopup = () => {
      const searchPopup = document.querySelector('.search__popup')
      if (searchPopup) {
        searchPopup.classList.add('search-opened')
      }
    }

    const closeMobileSidebar = () => {
      const mobileSidebar = document.querySelector('.mobile-sidebar')
      if (mobileSidebar) {
        mobileSidebar.classList.remove('mobile-menu-active')
      }
    }

    const handleMobileNavLinkClick = (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href') !== '#') {
        closeMobileSidebar()
      }
    }

    const performSearchMobile = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/', query: { title: searchQuery.value } })
        closeMobileSidebar()
      }
    }

    const updateDropdownPosition = (menuId) => {
      const parentEl = dropdownParents.value[menuId]
      if (!parentEl) return
      const rect = parentEl.getBoundingClientRect()
      dropdownStyle.value = {
        position: 'absolute',
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        zIndex: 1000,
      }
    }

    const toggleDropdown = (menuId) => {
      if (openDropdownId.value === menuId) {
        openDropdownId.value = null
      } else {
        openDropdownId.value = menuId
        nextTick(() => {
          updateDropdownPosition(menuId)
        })
      }
    }

    const toggleMobileSubmenu = (menuId) => {
      // NEW
      if (openMobileMenuId.value === menuId) {
        openMobileMenuId.value = null // Close if already open
      } else {
        openMobileMenuId.value = menuId // Open this menu
      }
    }

    const closeDropdown = (event) => {
      if (openDropdownId.value === null) return

      const parentEl = dropdownParents.value[openDropdownId.value]

      // If the click is outside the parent toggle element, close the dropdown.
      // Clicks on the dropdown menu itself will also be 'outside' because it's teleported,
      // which achieves the goal of closing the dropdown when one of its links is clicked.
      if (parentEl && !parentEl.contains(event.target)) {
        openDropdownId.value = null
      }
    }

    onMounted(() => {
      document.addEventListener('click', closeDropdown)
      window.addEventListener('scroll', () => updateDropdownPosition(openDropdownId.value), true)
      window.addEventListener('resize', () => updateDropdownPosition(openDropdownId.value))
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown)
      window.removeEventListener('scroll', () => updateDropdownPosition(openDropdownId.value), true)
      window.removeEventListener('resize', () => updateDropdownPosition(openDropdownId.value))
    })

    const isInternal = (url) => {
      if (!url) return false
      const hostedUrl = window.location.origin
      return url.startsWith(hostedUrl) || url.startsWith('/')
    }

    const getPath = (url) => {
      if (!url) return '/'
      const hostedUrl = window.location.origin
      if (url.startsWith(hostedUrl)) {
        const path = url.substring(hostedUrl.length)
        return path || '/'
      }
      return url
    }

    return {
      searchQuery,
      openSearchPopup,
      performSearchMobile,
      openDropdownId,
      toggleDropdown,
      dropdownParents,
      dropdownMenu,
      dropdownStyle,
      handleMobileNavLinkClick,
      openMobileMenuId, // NEW
      toggleMobileSubmenu, // NEW
      isInternal,
      getPath,
    }
  },
  mounted() {
    // Mobile menu open/close
    const mobileNavOpen = document.querySelector('.mobile-nav-icon')
    const mobileSidebar = document.querySelector('.mobile-sidebar')
    const mobileNavClose = document.querySelector('.menu-close')

    function openSidebar() {
      mobileSidebar.classList.add('mobile-menu-active')
    }
    function closeSidebar() {
      mobileSidebar.classList.remove('mobile-menu-active')
    }

    if (mobileNavOpen) mobileNavOpen.addEventListener('click', openSidebar)
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeSidebar)

    // Mark hash nav links (This part can stay, it just adds a class)
    document.querySelectorAll('.mobile-nav a').forEach((link) => {
      if (link.getAttribute('href') === '#') {
        link.classList.add('hash-nav')
      } else {
        link.classList.remove('hash-nav')
      }
    })
  },
  beforeUnmount() {
    // Remove event listeners
    if (this._mobileNavOpen) this._mobileNavOpen.removeEventListener('click', this._openSidebar)
    if (this._mobileNavClose) this._mobileNavClose.removeEventListener('click', this._closeSidebar)
  },
}
</script>
