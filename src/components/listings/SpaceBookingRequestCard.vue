<script setup lang="ts">
import { ref } from 'vue'
import NikkToast from '@/app/utils/NikkToast'
import { useSpaceBookingRequestStore } from '@/stores/space-booking-request.store'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue'

import { DateTimeUtil } from '@/app/utils/DateTimeUtil'
import Obj from '@/app/models/spaceBookingRequest.model'
import type { AxiosError } from 'axios'

import NikkDatePicker from '@/components/forms/NikkDatePicker.vue'
import NikkDeleteDialog from '../crud/NikkDeleteDialog.vue'
import NikkTextArea from '@/components/forms/NikkTextArea.vue'

const emit = defineEmits(['accept', 'cancel'])
const props = defineProps<{
  obj: Obj
  isOwner: boolean // is current user the author of this space booking request
}>()

const objStore = useSpaceBookingRequestStore()
const { t } = useI18n()
const toast = useToast()

const nikkToast = new NikkToast(toast, t)

const acceptBookingLoading = ref(false)
const deleteDialogLoading = ref(false)
const isDeleteDialog = ref(false)
const rejectBookingLoading = ref(false)

async function onAcceptBookingLoading(obj: Obj) {
  acceptBookingLoading.value = true
  try {
    const response = await objStore.acceptBooking(obj.id)
    emit('accept', response.data.data)
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    acceptBookingLoading.value = false
  }
}

async function onDeleteItem() {
  try {
    deleteDialogLoading.value = true
    await objStore.destroy(props.obj.id)
    nikkToast.success('features.spaceBookingRequests.delete.successMessage')
    emit('cancel')
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    deleteDialogLoading.value = false
    isDeleteDialog.value = false
  }
}

async function onRejectBookingLoading(obj: Obj) {
  try {
    rejectBookingLoading.value = true
    await objStore.rejectBooking(obj.id)
  } catch (e) {
    nikkToast.httpError(e as AxiosError)
  } finally {
    rejectBookingLoading.value = false
  }
}
</script>

<template>
  <PrimeCard class="w-full border">
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <div>
            <PrimeAvatar :label="props.obj.user?.initials" shape="circle" class="h-8 w-8 text-sm" />
          </div>

          <div class="text-sm text-nowrap text-gray-500 dark:text-gray-400">
            {{ props.obj.user?.fullName }}
          </div>
        </div>

        <!-- <NikkInputNumber
            :modelValue="props.obj.desiredWeight"
            id="desiredWeight"
            error-help-label="''"
            :is-error="false"
            label="labels.desiredWeight"
            :min="1"
            name="desiredWeight"
            :readonly="true"
            :show-buttons="true"
          /> -->

        <NikkTextArea
          :modelValue="props.obj.shipmentItems"
          class="w-full"
          :errorHelpLabel="''"
          id="shipmentItems"
          :isError="false"
          label="labels.shipmentItems"
          name="shipmentItems"
          :readonly="true"
          :rows="2"
        />

        <NikkDatePicker
          :modelValue="DateTimeUtil.formatToLocalDateString(props.obj.itemsPickupDate, 'full')"
          :errorHelpLabel="''"
          id="requestShipmentDate"
          :isError="false"
          label="labels.shipmentItemsPickupDate"
          name="itemsPickupDate"
          :readonly="true"
          selectionMode="single"
        />

        <NikkTextArea
          :modelValue="props.obj.itemsPickupLocation"
          :errorHelpLabel="''"
          id="itemsPickupLocation"
          :isError="false"
          label="labels.shipmentItemsPickupLocation(s)"
          name="itemsPickupLocation"
          :readonly="true"
          type="text"
        />

        <div v-if="isOwner" class="flex flex-col gap-2">
          <PrimeButton
            @click="onAcceptBookingLoading(obj)"
            icon="pi pi-check-circle"
            class="w-full"
            :label="$t('labels.accept')"
            :loading="acceptBookingLoading"
            size="small"
            type="submit"
          />

          <PrimeButton
            @click="onRejectBookingLoading(obj)"
            icon="pi pi-times"
            class="w-full"
            :label="$t('labels.reject')"
            :loading="rejectBookingLoading"
            severity="danger"
            size="small"
            type="submit"
          />
        </div>

        <div v-else>
          <PrimeButton
            @click="isDeleteDialog = true"
            :loading="deleteDialogLoading"
            :disabled="deleteDialogLoading"
            :label="$t('labels.cancel')"
            class="w-full"
            severity="danger"
            icon="pi pi-trash"
            plain
            size="small"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('features.spaceBookingRequests.show.requestedOn') }}
          {{ DateTimeUtil.formatToLocaleString(props.obj.createdAt) }}
        </div>

        <NikkDeleteDialog
          v-model="isDeleteDialog"
          class="md:w-[26rem]"
          @close="isDeleteDialog = false"
          @deleted="onDeleteItem"
          :loading="deleteDialogLoading"
          message="features.spaceBookingRequests.delete.confirmMessage"
          title="features.spaceBookingRequests.delete.title"
        />
      </div>
    </template>
  </PrimeCard>
</template>
