import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DepartmentsView from "@/views/DepartmentsView.vue";
import DepartmentView from "@/views/DepartmentView.vue";
import DepartmentUsersView from "@/views/DepartmentUsersView.vue";
import SplashView from "@/views/SplashView.vue";
import SignUpView from "@/views/authorization/SignUpView.vue";
import SignInView from "@/views/authorization/SignInView.vue";
import InvitationsView from "@/views/InvitationsView.vue";
import DevicesView from "@/views/DevicesView.vue";
import SessionsView from "@/views/SessionsView.vue";
import MediaListView from "@/views/MediaListView.vue";
import MediaView from "@/views/media/MediaView.vue";
import PublicSessionView from "@/views/PublicSessionView.vue";
import ProfileView from "@/views/ProfileView.vue";
import { fetchAuthSession } from "aws-amplify/auth";
import DevicesInfoView from "@/views/DevicesInfoView.vue";

// Define your routes
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/splash",
    name: "splash",
    component: SplashView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/signin",
    name: "signin",
    component: SignInView,
  },
  {
    path: "/departments",
    name: "departments",
    component: DepartmentsView,
  },
  {
    path: "/departments/:id",
    name: "department",
    component: DepartmentView,
  },
  {
    path: "/departments/:id/users",
    name: "department_users",
    component: DepartmentUsersView,
  },
  {
    path: "/invitations",
    name: "invitations",
    component: InvitationsView,
  },
  {
    path: "/devices",
    name: "devices",
    component: DevicesView,
  },
  {
    path: "/departments/:department_id/devices/:id",
    name: "device",
    component: DevicesInfoView,
  },
  {
    path: "/departments/:department_id/devices",
    name: "department_devices",
    component: DevicesView,
  },
  {
    path: "/sessions",
    name: "sessions",
    component: SessionsView,
  },
  {
    path: "/departments/:department_id/sessions",
    name: "department_sessions",
    component: SessionsView,
  },
  {
    path: "/departments/:department_id/sessions/:session_id",
    name: "media_list",
    component: MediaListView,
  },
  {
    path: "/shared_sessions",
    name: "shared_sessions",
    component: SessionsView,
  },
  {
    path: "/sessions/:session_id",
    name: "shared_media_list",
    component: MediaListView,
  },
  {
    path: "/departments/:department_id/sessions/:session_id/media/:media_id",
    name: "media",
    component: MediaView,
  },
  {
    path: "/shared/sessions/:session_id/media/:media_id",
    name: "public_media",
    component: MediaView,
  },
  {
    path: "/sessions/:session_id/media/:media_id",
    name: "shared_media",
    component: MediaView,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
  },
  {
    path: "/shared/sessions/:session_id",
    name: "public_session",
    component: PublicSessionView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Add a navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    const session = await fetchAuthSession();
    if (!session || !session.tokens) {
      if (
        to.name !== "signin" &&
        to.name !== "signup" &&
        to.name !== "public_session" &&
        to.name !== "public_media"
      ) {
        // Redirect to the signin page if not authenticated and trying to access a protected route
        return next({ name: "signin" });
      }
    }
    // Allow navigation if authenticated or navigating to signin/signup
    next();
  } catch (error) {
    console.error("Error fetching auth session:", error);
    if (to.name !== "signin" && to.name !== "signup") {
      return next({ name: "signin" });
    }
    next();
  }
});

export default router;
