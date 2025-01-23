<template>
  <div
    class="flex flex-col items-center md:justify-center min-h-screen md:bg-blue-50 bg-white"
  >
    <div class="w-full max-w-xl md:p-10 p-6 space-y-7 bg-white rounded-2xl">
      <!-- Logo -->
      <h1
        v-if="!isForgotPasswordMode"
        class="text-5xl font-medium text-primary !font-spartan text-center"
      >
        EVA
      </h1>
      <!-- Sign In Heading -->
      <div v-if="!isForgotPasswordMode">
        <h2
          class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1"
        >
          Log In to your account
        </h2>
        <p class="text-center text-secondary font-light">
          or
          <router-link
            to="/signup"
            class="text-secondary-100 font-semibold hover:underline"
            >Sign Up</router-link
          >
          for an account
        </p>
      </div>

      <!-- Sign In Form -->
      <form v-if="!isForgotPasswordMode" @submit.prevent="handleSignIn">
        <div class="space-y-6">
          <form-input
            label="Email"
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email id"
          />
          <form-input
            label="Password"
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
          />

          <div class="text-center space-y-4">
            <div
              class="text-primary hover:underline cursor-pointer"
              @click="toggleForgotPassword"
            >
              Forgot Password?
            </div>
            <button type="submit" class="btn btn-primary">Log In</button>
          </div>
        </div>
      </form>

      <!-- Forgot Password Form (Request Reset) -->
      <form
        class="space-y-7"
        v-else-if="!isCodeSent"
        @submit.prevent="handleResetPassword"
      >
        <div>
          <div class="flex items-center justify-between mb-4 md:hidden">
            <ArrowRightIcon
              @click="
                () => {
                  isForgotPasswordMode = false;
                  successMessage = false;
                  errorMessage = false;
                }
              "
              class="rotate-180 h-3.5 w-6"
            />
            <h2
              class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1"
            >
              Reset your password
            </h2>
            <div class="w-6" />
          </div>
          <h2
            class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1 hidden md:block"
          >
            Reset your password
          </h2>
          <p class="text-center text-secondary font-light">
            Enter your email to receive a code and reset your password.
          </p>
        </div>
        <div class="space-y-6">
          <form-input
            label="Email"
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
          />
          <div class="text-center space-y-4">
            <button type="submit" class="btn btn-primary">
              Send Verification Code
            </button>
            <div
              class="text-primary hover:underline cursor-pointer"
              @click="toggleForgotPassword"
            >
              Back to Sign In
            </div>
          </div>
        </div>
      </form>

      <!-- Confirm Reset Password Form -->
      <form
        class="space-y-7"
        v-else-if="isPasswordReset"
        @submit.prevent="handleConfirmResetPassword"
      >
        <div>
          <div class="flex items-center justify-between mb-4 md:hidden">
            <ArrowRightIcon
              @click="
                () => {
                  isCodeSent = false;
                  successMessage = false;
                  errorMessage = false;
                }
              "
              class="rotate-180 h-3.5 w-6"
            />
            <h2
              class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1"
            >
              Set Your New Password
            </h2>
            <div class="w-6" />
          </div>
          <h2
            class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1 hidden md:block"
          >
            Set Your New Password
          </h2>
          <p class="text-center text-secondary font-light">
            Enter the verification code sent to your email, then create your new
            password below.
          </p>
        </div>
        <div class="space-y-6">
          <form-input
            label="Verification Code"
            id="text"
            type="text"
            v-model="resetCode"
            placeholder="Enter verification code"
          />
          <form-input
            label="New Password"
            id="password"
            type="password"
            v-model="newPassword"
            placeholder="Enter Password"
          />
          <form-input
            label="Confirm New Password"
            id="confirmNewPassword"
            type="password"
            v-model="confirmNewPassword"
            placeholder="Re-Enter Password"
          />
          <div class="text-center space-y-4">
            <div class="text-secondary font-normal">
              Don’t see a code?
              <span
                class="text-primary hover:underline cursor-pointer"
                @click="handleResetPasswordNextSteps"
                >Resend Code</span
              >
            </div>
            <button type="submit" class="btn btn-primary">
              Reset Password
            </button>
          </div>
        </div>
      </form>

      <div class="space-y-7" v-else>
        <div>
          <div class="flex items-center justify-between mb-4 md:hidden">
            <ArrowRightIcon
              @click="
                () => {
                  isPasswordReset = false;
                  successMessage = false;
                  errorMessage = false;
                }
              "
              class="rotate-180 h-3.5 w-6"
            />
            <h2
              class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1"
            >
              Your password is updated
            </h2>
            <div class="w-6" />
          </div>
          <h2
            class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1 hidden md:block"
          >
            Your password is updated
          </h2>
          <p class="text-center text-secondary font-light">
            Your password has been successfully updated. You can now log in with
            your new details.
          </p>
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-outline">
            Go back to login page
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="text-sm text-green-600 bg-green-100 border border-green-500 max-w-lg w-full rounded-lg py-3 px-4 mb-2"
      >
        {{ successMessage }}
      </div>
      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="text-sm text-red-600 bg-red-100/50 border border-red-500 max-w-lg w-full rounded-lg py-3 px-4 mb-2"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { signIn, resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "vue-router";
import FormInput from "@/components/form/Input.vue";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon.vue";

const router = useRouter();

const email = ref("");
const password = ref("");
const resetCode = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const errorMessage = ref("");
const successMessage = ref(""); // For showing success messages
const isForgotPasswordMode = ref(false); // Toggle between sign-in and forgot password form
const isCodeSent = ref(false); // Track whether the reset code is sent
const isPasswordReset = ref(false); // Track whether the password is reset

// Toggle between sign-in and forgot password form
function toggleForgotPassword() {
  isForgotPasswordMode.value = !isForgotPasswordMode.value;
  isCodeSent.value = false; // Reset form state when toggling
  isPasswordReset.value = true;
  successMessage.value = ""; // Clear success message when toggling
  errorMessage.value = ""; // Clear error message when toggling
}

// Handle Sign-In
async function handleSignIn() {
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const { isSignedIn } = await signIn({
      username: email.value,
      password: password.value,
    });
    router.push({ name: "splash" });
  } catch (error) {
    errorMessage.value = `${error}`;
  }
}

// Handle Reset Password (Request Code)
async function handleResetPassword() {
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const output = await resetPassword({ username: email.value });
    handleResetPasswordNextSteps(output);
  } catch (error) {
    errorMessage.value = `${error}`;
  }
}

// Handle the next steps after requesting a reset
function handleResetPasswordNextSteps(output) {
  const { nextStep } = output;
  if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
    isCodeSent.value = true; // Switch to code confirmation form
    successMessage.value = "Reset code sent! Please check your email.";
  } else if (nextStep.resetPasswordStep === "DONE") {
    successMessage.value = "Password reset successfully. You can now sign in.";
    toggleForgotPassword(); // Return to sign-in form
  }
}

// Handle Confirm Reset Password (Submit Code and New Password)
async function handleConfirmResetPassword() {
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await confirmResetPassword({
      username: email.value,
      confirmationCode: resetCode.value,
      newPassword: newPassword.value,
      confirmNewPassword: newPassword.value,
    });
    successMessage.value = "Password reset successfully. You can now sign in.";
    toggleForgotPassword(); // Return to sign-in form
  } catch (error) {
    errorMessage.value = `${error}`;
  }
}
</script>
