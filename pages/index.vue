
<template>
    <div class="m-4 max-w-3xl mx-auto">
        <div class="text-3xl text-black font-semibold p-8" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-t-20 animate-duration-1000' }">
            Inbox
        </div>
        <div v-if="tasks.length != 0" class="card">
            <DataView :value="tasks">
                <template #list="slotProps">
                    <div class="flex flex-col">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="flex flex-col sm:flex-row gap-4 mx-6 py-2" v-animateonscroll="{ enterClass: 'animate-enter fade-in-10 slide-in-from-b-20 animate-duration-1000' }"
                            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
                            @mouseover="item.displayEditOptions = true"
                            @mouseleave="item.displayEditOptions = false">
                                <div>
                                    <Checkbox v-model="item.isCompleted" binary class="rounded-full!"
                                    @update:modelValue="deleteTask(item.id)"/>
                                </div>
                                <Badge v-if="item.priorityType != 'p4'" class="mt-2" size="small" :severity="getSeverity(item.priorityType)"></Badge>
                                <div class="flex flex-col md:flex-row justify-between flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col items-start">
                                        <div>
                                            <div class="text-sm">{{ item.name }}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs text-gray-400">{{ item.description }}</div>
                                        </div>
                                        <div>
                                            <div v-if="item.completionTime == 'Today'" class="flex items-center justify-center gap-1 py-1 pr-2">
                                                <i class="pi pi-calendar text-green-500" style="font-size: 0.75rem"></i>
                                                <span class="text-green-500 text-xs">{{ item.completionTime }}</span>
                                            </div>
                                            <div v-else-if="item.completionTime == 'Tomorrow'" class="flex items-center justify-center gap-1 py-1 pr-2">
                                                <i class="pi pi-calendar text-yellow-500" style="font-size: 0.75rem"></i>
                                                <span class="text-yellow-500 text-xs">{{ item.completionTime }}</span>
                                            </div>
                                            <div v-else-if="item.completionTime == 'This weekend'" class="flex items-center justify-center gap-1 py-1 pr-2">
                                                <i class="pi pi-calendar text-blue-500" style="font-size: 0.75rem"></i>
                                                <span class="text-blue-500 text-xs">Saturday</span>
                                            </div>
                                            <div v-else-if="item.completionTime == 'Next Week'" class="flex items-center justify-center gap-1 py-1 pr-2">
                                                <i class="pi pi-calendar text-purple-500" style="font-size: 0.75rem"></i>
                                                <span class="text-purple-500 text-xs">Monday</span>
                                            </div>
                                            <div v-else>
                                                <div v-if="selectedDateOption" class="flex items-center justify-center gap-1 py-1 pr-2">
                                                    <i class="pi pi-calendar text-purple-500" style="font-size: 0.75rem"></i>
                                                    <span class="text-purple-500 text-xs">{{ item.completionTime }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="item.displayEditOptions" class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row">
                                            <SecondaryButton icon="pi pi-pencil" variant="text" @click="updateTask(item)"></SecondaryButton>
                                            <SecondaryButton icon="pi pi-calendar" variant="text"></SecondaryButton>
                                            <SecondaryButton icon="pi pi-comment" variant="text"></SecondaryButton>
                                            <SecondaryButton icon="pi pi-ellipsis-h" variant="text"></SecondaryButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <div v-else class="flex flex-col gap-4 mx-8">
            <div class="flex mb-4 border-b border-gray-300 pb-3">
                <Skeleton size="2rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <div class="flex mb-4 border-b border-gray-300 pb-3">
                <Skeleton size="2rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <div class="flex mb-4 border-b border-gray-300 pb-3">
                <Skeleton size="2rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
        </div>
        <Button v-if="!showTaskCard" label="Add task" icon="pi pi-plus" class="mx-4 border-0! bg-white! text-sm! font-normal! text-gray-500! hover:text-[#dc4c3e]!" @click="showTaskCard = true"/>

        <Card class="mx-4 border border-gray-200 shadow-none! p-2!" v-else>
            <template #content>
                <div class="border-b border-gray-300 pb-3">
                    <div class="flex items-center gap-2">
                        <div v-if="selectedPriorityType && selectedPriorityType.value != 'p4'" class="bg-red-100 p-1 text-black text-sm font-semibold rounded-md">{{ selectedPriorityType.value }}</div>
                        <div v-if='selectedDate' class="bg-red-100 p-1 text-black text-sm font-semibold rounded-md w-12">{{ selectedDate }}</div>
                        <InputText v-model="newTask" type="text" placeholder="" class="flex-1 w-full! border-0!" />
                    </div>
                    <InputText v-model="descriptionText" type="text" size="small" placeholder="Description" class="w-full! border-0! px-0!" />
                    <div class="flex gap-3 items-center">
                        <SecondaryButton icon="pi pi-calendar" label="Date" variant="outlined" class="h-8! text-sm! font-normal!" @click="toggle($event,'first')" />
                        <Select v-model="selectedPriorityType" :options="priorityOptions" optionLabel="name" class="h-8!" checkmark showClear />
                        <SecondaryButton icon="pi pi-clock" label="Reminders" variant="outlined" class="h-8! text-sm! font-normal!" @click="toggle($event,'second')" />
                        <SecondaryButton icon="pi pi-ellipsis-h" severity="secondary" aria-label="ellipsis-h" variant="outlined" />
                    </div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <Select v-model="selectedProjectType" :options="projectsList" class="h-8!">
                        <template #footer>
                            <div class="p-3">
                                <SecondaryButton label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" @click="toggle($event,'newItem')" />
                            </div>
                        </template>
                    </Select>
                    <div class="flex items-center gap-4">
                        <SecondaryButton label="Cancel" class="h-8! text-sm!" @click="showTaskCard = false"/>
                        <Button label="Add task" variant="outlined" class="h-8! text-sm! bg-[#dc4c3e]! text-white! disabled:cursor-not-allowed!" 
                        :disabled="newTask == null || newTask ==''" @click="addNewTask"/>
                    </div>
                </div>
            </template>
        </Card>

        <Popover ref="op">
            <div class="flex flex-col w-[18rem]">
                <div v-for="option in dateOptions" :key="option.name">
                    <div class="flex items-center justify-between hover:cursor-pointer hover:bg-surface-100 p-2" @click="calculateDate($event,option.name)">
                        <div class="flex gap-3 items-center">
                            <i :class="`${option.icon} ${option.color}`" style="font-size: 1rem"></i>
                            <div class="text-sm font-semibold">{{ option.name }}</div>
                        </div>
                        <div class="text-xs text-gray-400">{{ option.text }}</div>
                    </div>
                </div>
                <DatePicker v-model="date" inline showWeek class="w-full" @update:modelValue="getDateValue($event)"/>
                <SecondaryButton icon="pi pi-clock" class="my-4" label="Time" variant="outlined" />
                <SecondaryButton icon="pi pi-refresh" label="Repeat" variant="outlined" />
            </div>
        </Popover>

        <Popover ref="op1">
            <div class="flex flex-col w-[18rem]">
                <span class="font-medium block mb-2">Share this document</span>
                <SelectButton v-model="selectedReminder" :options="options" />
                <div class="flex gap-2 items-center my-2">
                    <i class="pi pi-info-circle" style="font-size: 1rem"></i>
                    <span class="text-xs">Add a time to the task first</span>
                </div>
                <div class="flex items-center justify-between mt-2">
                    <i class="pi pi-question-circle" style="font-size: 1rem"></i>
                    <Button label="Add reminder" variant="outlined" class="h-8! text-sm! bg-[#dc4c3e]! text-white!" disabled />
                </div>
            </div>
        </Popover>

        <Popover ref="op2">
            <div class="flex flex-col w-[18rem]">
                <span class="font-medium block mb-2">Add new project</span>
                <div class="flex items-center gap-4 mt-2">
                    <InputText v-model="newProject" />
                    <Button label="Add" variant="outlined" class="text-sm! bg-[#dc4c3e]! text-white!" />
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup> 
import DataView from '../src/volt/DataView.vue';
import SecondaryButton from '../src/volt/SecondaryButton'
import Checkbox from '~/src/volt/Checkbox.vue';
import Card from '~/src/volt/Card.vue';
import InputText from '~/src/volt/InputText.vue'
import Popover from '~/src/volt/Popover.vue';
import DatePicker from '~/src/volt/DatePicker.vue';
import Select from '~/src/volt/Select.vue';
import SelectButton from '~/src/volt/SelectButton.vue';
import Button from '~/src/volt/Button.vue';
import Badge from '~/src/volt/Badge.vue'
import Skeleton from '~/src/volt/Skeleton.vue';

const storeData = Apistore()
const defaultData = DefaultDataStore()
const dateOptions = defaultData.getDateOptions()
const priorityOptions = defaultData.getPriorityOptions()
const options = defaultData.getReminderOptions()
const tasks = ref([])
let newTask = ref(null)
let selectedDate = ref(null)
let showTaskCard = ref(false)
let descriptionText = ref('')
const op = ref();
const op1 = ref();
const op2 = ref();
const date = ref();
const newProject = ref();
const selectedReminder = ref('Before task');
const selectedProjectType = ref('Inbox');
const selectedDateOption = ref(null);
const isUpdate = ref(false);
const selectedPriorityType = ref({
        name:'Priority 4',
        value: 'p4'
});
const projectsList = ref(['Inbox'])
let tempId = null

onMounted(async () => {
    const data = await storeData.getTasks();
    if (data) tasks.value = data;
    if(tasks.value.length == 0) showTaskCard.value = true
});

const addNewTask = async () => {
    let tempObj = {
        name: newTask.value,
        description: descriptionText.value,
        completionTime: selectedDateOption.value,
        displayEditOptions: false,
        priorityType : selectedPriorityType.value.value,
        isCompleted: false,
        selectedDate: selectedDate.value
    }
    if(isUpdate.value) {
        tempObj.id = tempId
        await storeData.updateTask(tempObj);
        const data = await storeData.getTasks();
        if (data) tasks.value = data;
    }else {
        const created = await storeData.createTask(tempObj);
        if (created) tasks.value.push(created);
    }
    newTask.value = null
    descriptionText.value = null
    selectedDateOption.value = null
    selectedPriorityType.value = {
        name:'Priority 4',
        value: 'p4'
    }
    selectedDate.value = null
    tempId = null
}

const updateTask = (item) => {
    newTask.value = item.name
    descriptionText.value = item.description
    selectedPriorityType.value = priorityOptions.find((obj) => obj.value === item.priorityType) 
    selectedDate.value = item.selectedDate
    selectedDateOption.value = item.completionTime
    showTaskCard.value = true
    tempId = item.id
    isUpdate.value = true
}

const deleteTask = async (id) => {
    await storeData.deleteTask(id);
    const data = await storeData.getTasks();
    if (data) tasks.value = data;
}

// Utility functions from here....

const getDateValue = (event) => {
    if(date.value) {
        let value = describeDateIST(date.value)
        selectedDate.value = value.display
        selectedDateOption.value = value.label
        op.value.toggle(event)
    }
}

function describeDateIST(date) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const toYMD = (d) => {
    return {
      y: d.getFullYear(),
      m: d.getMonth() + 1,
      d: d.getDate()
    }
  }

  const sameDate = (a, b) => a.y === b.y && a.m === b.m && a.d === b.d

  const inputYMD = toYMD(date)
  const todayYMD = toYMD(new Date())
  const tomorrowYMD = toYMD(new Date(Date.now() + 86400000))

  let label
  if (sameDate(inputYMD, todayYMD)) {
    label = 'Today'
  } else if (sameDate(inputYMD, tomorrowYMD)) {
    label = 'Tomorrow'
  } else {
    label = date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  const display = `${inputYMD.d} ${months[inputYMD.m - 1]}`
  return { label, display }
}

const getSeverity = (type) => {
    if (type == 'p1') return 'danger'
    else if (type == 'p2') return 'warn'
    else if (type == 'p3') return 'info'
    else return ''
}

const toggle = (event,type) => {
    if(type == 'first') op.value.toggle(event);
    else if(type == 'second') op1.value.toggle(event);
    else op2.value.toggle(event)
};

const calculateDate = (event,option) => {
    switch (option) {
        case 'Today' : selectedDate.value = getTodayDate();
            selectedDateOption.value = option
            op.value.toggle(event);
            break;
        case 'Tomorrow' : selectedDate.value = getTomorrowDate();
            selectedDateOption.value = option
            op.value.toggle(event);
            break;
        case 'This weekend' : selectedDate.value = getWeekendDate();
            selectedDateOption.value = option
            op.value.toggle(event);
            break;
        case 'Next week' : selectedDate.value = getNextMondayDate();
            selectedDateOption.value = option
            op.value.toggle(event);
            break;
    }
}

function formatDate(date) {
  const options = { day: '2-digit', month: 'short' };
  return date.toLocaleDateString('en-GB', options);
}

function getTodayDate() {
  const today = new Date();
  return formatDate(today);
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

function getWeekendDate() {
  const today = new Date();
  const day = today.getDay();
  const diff = (6 - day + 7) % 7;
  const saturday = new Date();
  saturday.setDate(today.getDate() + diff);
  return formatDate(saturday);
}

function getNextMondayDate() {
  const today = new Date();
  const day = today.getDay();
  const diff = (8 - day) % 7 || 7;
  const nextMonday = new Date();
  nextMonday.setDate(today.getDate() + diff);
  return formatDate(nextMonday);
}
</script>
