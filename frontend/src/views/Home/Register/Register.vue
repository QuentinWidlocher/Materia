<template>
    <div id="Register">
        <v-btn
            flat
            class="px-0"
            v-on:click="$emit('hide', $event)"
            >
            <v-icon>arrow_back</v-icon> Go back
        </v-btn>
        <div class="form-wrap mx-3">
            <v-form
            class="ma-auto"
            ref="form"
            v-model="valid"
        >

            <h1 class="display-1 mb-4">Please create an account</h1>

            <v-text-field 
                :value="'+' + phone"
                label="Phone number"
                disabled
            ></v-text-field>

            <v-text-field 
                v-model="username"
                label="Username"
                :rules="usernameRules"
                required
            ></v-text-field>

            <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                autocomplete="current-password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                @click:append="showPassword = !showPassword"
                @input="checkPasswordStrength"
                required
                :loading="password.length > 0"
            >
                <template v-slot:progress>
                    <transition :name="'fade-transition'">
                        <v-progress-linear
                        :value="passwordStrength"
                        :color="passwordStrengthColor"
                        ></v-progress-linear>
                    </transition>
                </template>
            </v-text-field>
            
            <div class="my-3">
                <span>Satisfy at least 3 points :</span>
            <Requirement v-for="requirement in passwordRequirements" :condition="requirement.condition(password)" :label="requirement.label" />
            </div>

            <v-btn
                :loading="loading"
                type="button"
                block
                color="primary"
                class="mx-0"
                @click="register"
            >
            Register
            </v-btn>
        </v-form>
        </div>
    </div>
</template>
<style lang="scss" scoped src="./Register.scss"></style>
<script lang="ts" src="./Register.ts"></script>