<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-4 md:p-8"
  >
    <!-- Title Section -->
    <div class="w-full mb-8 md:mb-12">
      <h1 class="text-white text-3xl md:text-4xl lg:text-5xl font-light text-center tracking-wide">
        Silahkan Ambil Nomor Antrian
      </h1>
    </div>

    <!-- Organizations Grid with Scrolling -->
    <div class="flex-1 w-full max-w-6xl mx-auto overflow-hidden">
      <!-- Scrollable Container -->
      <div
        ref="scrollContainer"
        class="h-[calc(100vh-200px)] md:h-[calc(100vh-220px)] overflow-y-auto pr-1 auto-hide-scrollbar"
        @scroll="handleScroll"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
          <div
            v-for="org in organizations"
            :key="org.id"
            @click="selectOrganization(org)"
            class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-xl cursor-pointer flex items-center gap-4 group min-h-[80px] md:min-h-[100px] active:scale-[0.98] touch-manipulation"
          >
            <!-- Organization Logo -->
            <div
              class="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center group-hover:border-emerald-400/40 transition-all"
            >
              <img :src="org.logo" :alt="org.name" class="w-8 h-8 md:w-12 md:h-12 object-contain" />
            </div>

            <!-- Organization Info -->
            <div class="flex-1 min-w-0">
              <h2
                class="text-white text-lg md:text-xl lg:text-2xl font-light group-hover:text-emerald-400 transition-colors truncate"
              >
                {{ org.name }}
              </h2>
              <p
                v-if="org.description"
                class="text-white/60 text-sm md:text-base mt-1 line-clamp-2"
              >
                {{ org.description }}
              </p>
            </div>

            <!-- Arrow Icon -->
            <div class="flex-shrink-0 text-white/40 group-hover:text-emerald-400 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="w-full mt-6 md:mt-8">
      <div
        class="flex flex-col sm:flex-row justify-between items-center text-white/60 text-sm md:text-base px-2 gap-4 sm:gap-0"
      >
        <span class="font-light">{{ currentDateTime }}</span>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span class="text-sm">Touch to select</span>
        </div>
      </div>
    </div>

    <!-- Ticket Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeModal"></div>
        <div
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 w-full max-w-sm md:max-w-md relative z-10 shadow-2xl"
        >
          <div class="text-center">
            <h3 class="text-white text-xl md:text-2xl lg:text-3xl font-light mb-6">
              Your Queue Ticket
            </h3>

            <div
              class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8"
            >
              <p class="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-2">
                Ticket Number
              </p>
              <div class="text-emerald-400 text-4xl md:text-5xl lg:text-6xl font-light mb-4">
                {{ ticketNumber }}
              </div>
              <p class="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-2">
                Organization
              </p>
              <div class="text-white text-lg md:text-xl font-light">{{ selectedOrg?.name }}</div>
            </div>

            <button
              @click="closeModal"
              class="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 border border-emerald-400/50 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium transition-all duration-300 hover:bg-emerald-500/40 hover:scale-105 w-full active:scale-95 touch-manipulation"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDateTime = ref('')
const showModal = ref(false)
const selectedOrg = ref(null)
const ticketNumber = ref('')
const scrollContainer = ref(null)

// Scroll handling for auto-hide scrollbar
let scrollTimeout = null

const handleScroll = () => {
  if (scrollContainer.value) {
    // Show scrollbar when scrolling
    scrollContainer.value.classList.add('scrolling')

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // Hide scrollbar after 1.5 seconds of no scrolling
    scrollTimeout = setTimeout(() => {
      if (scrollContainer.value) {
        scrollContainer.value.classList.remove('scrolling')
      }
    }, 1500)
  }
}

// Generate 20 organizations for scrolling test
const generateOrganizations = () => {
  const orgTypes = [
    'Customer Service',
    'Account Management',
    'Technical Support',
    'Billing Department',
    'New Applications',
    'Returns & Exchanges',
    'Consultations',
    'Appointments',
    'Information Desk',
    'VIP Services',
    'Product Support',
    'Sales Department',
    'Warranty Claims',
    'Membership Services',
    'Financial Services',
    'Insurance Claims',
    'Legal Department',
    'Human Resources',
    'Training Services',
    'Executive Office',
  ]

  const descriptions = [
    'General inquiries and support',
    'Account updates and changes',
    'Technical issues and troubleshooting',
    'Payments and invoices',
    'Apply for new services',
    'Process returns or exchanges',
    'One-on-one consultation services',
    'Schedule or manage appointments',
    'General information',
    'Premium customer services',
    'Product-related questions and issues',
    'Purchase new products or services',
    'Submit and track warranty claims',
    'Membership benefits and inquiries',
    'Financial advice and services',
    'Submit and process insurance claims',
    'Legal advice and documentation',
    'Employment and benefits inquiries',
    'Training programs and resources',
    'Executive assistance and inquiries',
  ]

  return orgTypes.map((name, index) => ({
    id: index + 1,
    name,
    logo: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(name.substring(0, 2))}`,
    description: descriptions[index],
  }))
}

// Sample organization data - 20 items for scrolling test
const organizations = ref(generateOrganizations())

// Function to select organization and generate ticket
const selectOrganization = (org) => {
  selectedOrg.value = org
  // Generate random ticket number (in real app, this would come from backend)
  const prefix = org.id.toString().padStart(2, '0')
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  ticketNumber.value = `${prefix}-${number}`
  showModal.value = true
}

// Close the modal
const closeModal = () => {
  showModal.value = false
  // In a real app, you might want to print the ticket or send it to a device
}

const updateDateTime = () => {
  const now = new Date()
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  currentDateTime.value = now.toLocaleDateString('en-US', options)
}

let intervalId

onMounted(() => {
  updateDateTime()
  intervalId = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Touch optimization */
.touch-manipulation {
  touch-action: manipulation;
}

/* Auto-hide scrollbar styling */
.auto-hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.auto-hide-scrollbar::-webkit-scrollbar {
  width: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.auto-hide-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.auto-hide-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.auto-hide-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Show scrollbar when scrolling */
.auto-hide-scrollbar.scrolling::-webkit-scrollbar {
  opacity: 1;
}

.auto-hide-scrollbar.scrolling::-webkit-scrollbar-thumb {
  opacity: 1;
}

/* Show scrollbar on hover for desktop */
@media (hover: hover) and (pointer: fine) {
  .auto-hide-scrollbar:hover::-webkit-scrollbar {
    opacity: 1;
  }

  .auto-hide-scrollbar:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
}

/* Ensure proper scaling on touch devices */
@media (max-width: 768px) {
  .hover\:scale-\[1\.02\]:hover {
    transform: none;
  }

  .active\:scale-\[0\.98\]:active {
    transform: scale(0.98);
  }
}

/* Desktop hover effects */
@media (hover: hover) and (pointer: fine) {
  .hover\:scale-\[1\.02\]:hover {
    transform: scale(1.02);
  }
}
</style>
