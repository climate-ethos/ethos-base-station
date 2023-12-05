<template>
  <q-card class="contact-card bg-primary text-white">
    <q-card-section>
      <div class="q-mb-sm">
        For assistance, please reach out to the Ethos team by sending an email
        or making a phone call using your personal device, such as a phone or
        computer:
      </div>
      <div>
        <q-icon name="email" />
        {{ email }}
      </div>
      <div class="q-mt-sm">
        <q-icon name="phone" />
        07 {{ phone }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    let email = process.env.CONTACT_EMAIL;
    let phone = process.env.CONTACT_PHONE;
    return { email, phone };
  },
});
</script>

<style lang="scss" scoped>
.contact-card {
  width: 70vw;
}
</style>
