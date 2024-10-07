<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list dense>
        <v-list-item>
          <v-list-item-content class="justify-center">
            <img src="@/assets/naviesglogo.svg" alt="Your Logo" height="40px">
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'Index' }" @click="updateTitle('Dashboard')" :class="isActive('Index')">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'Scope' }" @click="updateTitle('Scope')" :class="isActive('Scope')">
          <v-list-item-icon>
            <v-icon>mdi-finance</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Scope</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'Solutions' }" @click="updateTitle('ESG Solutions')" :class="isActive('Solutions')">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ESG Solutions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ name: 'Consulting' }" @click="updateTitle('ESG 컨설팅 및 인증')" :class="isActive('Consulting')">
          <v-list-item-icon>
            <v-icon>mdi-credit-card</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ESG 컨설팅 및 인증</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title style="color: #343C6A;">
        {{ selectedItemTitle }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" aria-label="Notifications">
            <v-icon>mdi-bell</v-icon>
            <v-badge v-if="hasUnreadNotifications" content=" " color="red" dot>
            </v-badge>
          </v-btn>
        </template>
        <v-list>
          <template v-if="notifications.length">
            <v-list-item v-for="(notification, index) in notifications" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ notification.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>No Notifications</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
      <v-btn text @click="logout" aria-label="Logout">
        Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      selectedItemTitle: 'Dashboard',
      notifications: [],
    }
  },
  computed: {
    hasUnreadNotifications() {
      return this.notifications.some(notification => !notification.read);
    },
  },
  methods: {
    updateTitle(title) {
      this.selectedItemTitle = title;
    },
    logout() {
      localStorage.removeItem('isLoggedIn');
      alert('로그아웃 되었습니다.');
      this.$router.push('/login');
    },
    isActive(routeName) {
      return this.$route.name === routeName ? 'active-nav-item' : '';
    },

  },
}
</script>

<style scoped>
.active-nav-item {
  background-color: #e0e0e0;
}
</style>
