<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="4" class="d-flex flex-column">
        <div class="d-flex align-center justify-center">
          <!-- <v-img :src="logo" max-width="100"></v-img> -->
          <h1>Logo</h1>
        </div>
        <div width="100%">
          <v-alert
            dark
            border="left"
            :color="alertColor"
            elevation="2"
            v-if="submitted"
          >
            {{ message }}</v-alert
          >
          <v-form
            @submit="handleSubmitForm"
            ref="submissionForm"
            lazy-validation
            v-model="valid"
          >
            <v-container>
              <v-row>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    label="User ID"
                    :readonly="!!userId"
                    v-model="id"
                    :rules="rules.id"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    label="Full Name"
                    v-model="fullName"
                    :rules="rules.fullName"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    label="Delivery Address"
                    v-model="deliveryAddress"
                    :rules="rules.deliveryAddress"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    label="Phone Number"
                    v-model="phoneNumber"
                    :rules="rules.phoneNumber"
                  >
                  </v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                  <v-btn
                    :loading="loading"
                    dark
                    color="purple"
                    @click="handleSubmitForm"
                    >Submit!</v-btn
                  >
                </v-col>
                <v-col cols="4"></v-col>
              </v-row>
            </v-container>
          </v-form>
        </div>
      </v-col>
      <v-col cols="4"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import firestore from "@/utils/firebaseFirestore";
import { mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["products"]),
  },
  data() {
    return {
      fullName: "",
      deliveryAddress: "",
      phoneNumber: "",
      id: this.userId,
      rules: {},
      loading: false,
      alertColor: "success",
      message: "",
      submitted: false,
      valid: true,
    };
  },
  mounted() {
    document.title = "Submission Form";
    this.getProducts();
  },
  methods: {
    ...mapMutations(["addProducts"]),
    handleSubmitForm(e) {
      e.preventDefault();
      try {
        this.loading = true;
        this.rules = {
          id: [(v) => !!v || "This field is required"],
          fullName: [(v) => !!v || "This field is required"],
          deliveryAddress: [(v) => !!v || "This field is required"],
          phoneNumber: [
            (v) => !!v || "This field is required",
            (v) =>
              /(\+62|0)-?(\d{3,3})-?(\d{4,4})-?(\d{3,4})$/.test(v) ||
              "Please enter valid Phone Number",
          ],
        };
        this.$refs.submissionForm.validate();
        this.$nextTick(() => {
          if (this.valid) {
            firestore
              .collection("submissions")
              .add({
                userId: this.id,
                fullName: this.fullName,
                deliveryAddress: this.deliveryAddress,
                phoneNumber: this.phoneNumber,
                status: "",
              })
              .then(() => {
                this.submitted = true;
                this.loading = false;
                this.alertColor = "success";
                this.message = "Submitted!";
                this.$refs.submissionForm.reset();
                this.$refs.submissionForm.resetValidation();
              })
              .catch((err) => {
                throw new Error(err);
              });
          } else {
            this.loading = false;
          }
        });
      } catch (err) {
        this.submitted = true;
        this.loading = false;
        this.alertColor = "error";
        this.message = err.message;
        this.$refs.submissionForm.reset();
        this.$refs.submissionForm.resetValidation();
      }
    },
    getProducts() {
      if (this.products.length == 0) {
        firestore
          .collection("products")
          .get()
          .then((querySnapshot) => {
            const products = [];
            querySnapshot.forEach((doc) => {
              const { id } = doc;
              const data = doc.data();
              products.push({
                id,
                ...data,
              });
            });
            this.addProducts(products);
          });
      }
    },
  },
  props: ["userId"],
};
</script>

<style></style>
