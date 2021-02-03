<template>
    <router-link
            v-if="projectOpened"
            title="ER Diagram"
            :to="{ name: 'er-diagram' }"
            active-class="bg-invoker-purple bg-opacity-25 text-invoker-purple"
            class="mt-2 group flex items-center px-2 py-2 text-sm leading-5 font-medium rounded-md text-gray-500 hover:text-invoker-purple hover:bg-invoker-purple hover:bg-opacity-25 focus:outline-none transition ease-in-out duration-150"
    >
        <svg 
            class="h-5 w-5 transition ease-in-out duration-150"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </router-link>
</template>
<script>
export default {
    computed: {
        // You can use this property to only show the plugin, when a project is opened
        projectOpened() {
            return !!this.$store.state.project.id;
        }
    }
};
</script>