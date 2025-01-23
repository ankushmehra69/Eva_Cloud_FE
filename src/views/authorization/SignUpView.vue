<template>
  <div>
    <div
      v-if="!confirmationRequired"
      class="flex flex-col items-center md:justify-center min-h-screen md:bg-blue-50 bg-white md:p-8 lg:p-10"
    >
      <!-- Sign Up Form -->
      <div class="w-full max-w-xl md:p-10 p-6 space-y-7 bg-white rounded-2xl">
        <!-- Logo -->
        <h1 class="text-5xl font-medium text-primary !font-spartan text-center">
          EVA
        </h1>

        <!-- Sign Up Heading -->
        <div>
          <h2
            class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1"
          >
            Sign up for an account
          </h2>
          <p class="text-center text-secondary font-light">
            or
            <router-link
              to="/signin"
              class="text-secondary-100 font-semibold hover:underline"
              >Log In</router-link
            >
            to your account
          </p>
        </div>

        <!-- Sign Up Form -->
        <form class="space-y-6" @submit.prevent="handleSignUp">
          <form-input
            label="Full Name"
            id="fullname"
            type="text"
            v-model="fullname"
            placeholder="Enter your Name"
          />
          <form-input
            label="Email"
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email id"
          />
          <form-input
            label="Mobile(optional)"
            id="phoneNumber"
            type="tel"
            v-model="phoneNumber"
            placeholder="Enter your mobile no. (+91-8877665544)"
          />
          <form-input
            label="Password"
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
          />
          <form-input
            label="Confirm Password"
            id="password"
            type="password"
            v-model="confirmPassword"
            placeholder="Enter your password again"
          />
          <div class="text-center">
            <button type="submit" class="btn btn-primary">
              Create Account
            </button>
          </div>
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
        </form>
      </div>
    </div>

    <!-- Email Verification -->
    <div
      v-if="confirmationRequired"
      class="flex flex-col items-center md:justify-center min-h-screen md:bg-blue-50 bg-white md:p-8 lg:p-10"
    >
      <div class="w-full max-w-xl md:p-10 p-6 space-y-7 bg-white rounded-2xl">
        <div>
          <div class="flex items-center justify-between mb-4 md:hidden">
            <ArrowRightIcon
              @click="confirmationRequired = false"
              class="rotate-180 h-3.5 w-6"
            />
            <h2
              class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1"
            >
              Verify your email
            </h2>
            <div class="w-6" />
          </div>
          <h2
            class="md:text-3xl text-2xl font-bold text-center text-secondary md:mb-1 hidden md:block"
          >
            Verify your email
          </h2>
          <p class="text-center text-secondary font-light">
            Enter the OTP to verify the email address
          </p>
        </div>

        <!-- OTP Form -->
        <form class="space-y-6" @submit.prevent="handleSignUpConfirmation">
          <div class="flex justify-center space-x-2.5 pb-2">
            <input
              v-model="otp[0]"
              :ref="otpRefs[0]"
              type="text"
              maxlength="1"
              placeholder="_"
              class="w-11 h-12 px-2 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light text-center border-transparent focus:border-primary rounded-lg focus:outline-none bg-primary-100"
              @input="moveToNext($event, 0)"
            />
            <input
              v-model="otp[1]"
              :ref="otpRefs[1]"
              type="text"
              maxlength="1"
              placeholder="_"
              class="w-11 h-12 px-2 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light text-center border-transparent focus:border-primary rounded-lg focus:outline-none bg-primary-100"
              @input="moveToNext($event, 1)"
            />
            <input
              v-model="otp[2]"
              :ref="otpRefs[2]"
              type="text"
              maxlength="1"
              placeholder="_"
              class="w-11 h-12 px-2 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light text-center border-transparent focus:border-primary rounded-lg focus:outline-none bg-primary-100"
              @input="moveToNext($event, 2)"
            />
            <input
              v-model="otp[3]"
              :ref="otpRefs[3]"
              type="text"
              maxlength="1"
              placeholder="_"
              class="w-11 h-12 px-2 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light text-center border-transparent focus:border-primary rounded-lg focus:outline-none bg-primary-100"
              @input="moveToNext($event, 3)"
            />
            <input
              v-model="otp[4]"
              :ref="otpRefs[4]"
              type="text"
              maxlength="1"
              placeholder="_"
              class="w-11 h-12 px-2 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light text-center border-transparent focus:border-primary rounded-lg focus:outline-none bg-primary-100"
              @input="moveToNext($event, 4)"
            />
            <input
              v-model="otp[5]"
              :ref="otpRefs[5]"
              type="text"
              maxlength="1"
              placeholder="_"
              class="w-11 h-12 px-2 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light text-center border-transparent focus:border-primary rounded-lg focus:outline-none bg-primary-100"
              @input="moveToNext($event, 5)"
            />
          </div>

          <div class="text-center">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="otp.some((digit) => digit === '')"
            >
              Verify Now
            </button>
          </div>
          <!-- Timer for resend code -->
          <p class="text-center text-grey-100 font-normal">
            Wait <span class="font-medium text-secondary">2:00</span> before
            requesting another verification code
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { signUp, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter } from "vue-router";
import FormInput from "@/components/form/Input.vue";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon.vue";

const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const fullname = ref("");
const phoneNumber = ref("");
const otp = ref(["", "", "", "", "", ""]); // To hold each OTP digit
const confirmationRequired = ref(false);
const errorMessage = ref("");
const otpRefs = Array.from({ length: 6 }, () => ref(null));

const moveToNext = (event, index) => {
  if (event.target.value.length === 1 && index < otp.value.length - 1) {
    // Move focus to the next OTP input field
    otpRefs[index + 1].value.focus();
  }
};

// Format phone number to E.164
function formatPhoneNumberToE164(phoneNumber, countryCode) {
  const phoneNumberParsed = parsePhoneNumberFromString(
    phoneNumber,
    countryCode
  );
  if (phoneNumberParsed) {
    return phoneNumberParsed.format("E.164");
  } else {
    throw new Error("Invalid phone number");
  }
}

// Resend confirmation code if the user exists
async function handleUserExists() {
  try {
    await resendSignUpCode({ username: email.value });
    confirmationRequired.value = true;
  } catch (error) {
    errorMessage.value = `${error.message}`;
  }
}

// Handle sign up
async function handleSignUp() {
  errorMessage.value = "";
  try {
    // Format phone number only if it has a value
    const e164PhoneNumber = phoneNumber.value
      ? formatPhoneNumberToE164(phoneNumber.value, "IN")
      : undefined;

    // Construct userAttributes dynamically
    const userAttributes = {
      email: email.value,
      name: fullname.value,
    };

    // Add phone_number only if it is not undefined
    if (e164PhoneNumber) {
      userAttributes.phone_number = e164PhoneNumber;
    }

    const { nextStep } = await signUp({
      username: email.value,
      password: password.value,
      options: {
        userAttributes,
      },
    });

    if (nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
      confirmationRequired.value = true;
    }
  } catch (error) {
    if (`${error.message}`.includes("exists")) {
      handleUserExists();
    } else {
      errorMessage.value = `${error.message}`;
    }
  }
}

// Handle OTP confirmation
const handleSignUpConfirmation = async () => {
  errorMessage.value = "";
  try {
    const confirmationCode = otp.value.join(""); // Join the 6 OTP digits
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: email.value,
      confirmationCode: confirmationCode,
    });

    if (isSignUpComplete || nextStep === "DONE") {
      router.push("/signin"); // Redirect to sign-in after successful confirmation
    }
  } catch (error) {
    if (`${error.message}`.includes("Current status is CONFIRMED")) {
      router.push("/signin");
    } else {
      errorMessage.value = `${error.message}`;
    }
  }
};
</script>
