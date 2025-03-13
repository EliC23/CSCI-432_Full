import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import Join from '@/views/Join.vue'
import Main from '@/views/Main.vue'
import ProfileComponent from '@/views/ProfileComponent.vue'
import DeleteConfirm from '@/views/DeleteConfirm.vue'
import DeleteAccountForm from '@/views/DeleteAccountForm.vue'
import MainWelcome from '@/views/MainWelcome.vue'
import { useUserStore } from '@/stores/userStore';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { authRequired: false }
        },
        {
            path: '/signin',
            name: 'signin',
            component: SignIn,
            meta: { authRequired: false }
        },
        {
            path: '/join',
            name: 'join',
            component: Join,
            meta: { authRequired: false }
        },
        {
            path: '/main',
            name: 'mainLayout',
            component: Main,
            meta: { authRequired: true },
            children: [
                {
                    path: '',
                    name: 'main',
                    components: { center: MainWelcome },
                    meta: { authRequired: true }
                },
                {
                    path: 'profile',
                    name: 'profile',
                    components: { center: ProfileComponent },
                    meta: { authRequired: true }
                },
                {
                    path: 'delete-confirm',
                    name: 'deleteConfirm',
                    components: { center: DeleteConfirm },
                    meta: { authRequired: true }
                },
                {
                    path: 'delete-form',
                    name: 'deleteAccountForm',
                    components: { center: DeleteConfirm, right: DeleteAccountForm },
                    meta: { authRequired: true }
                }
            ]
        },
        {
            path: '/user/:userId',
            name: 'privateMessage',
            component: () => import('@/views/PrivateMessage.vue'),
            props: true,
            meta: { authRequired: true }
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/' 
        }
    ],
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const isAuthenticated = !!userStore.token;

    if (to.meta.authRequired && !isAuthenticated) {
        next('/');
    } else {
        next();
    }
});
export default router;