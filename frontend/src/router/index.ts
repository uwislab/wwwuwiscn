import { createRouter, createWebHistory } from "vue-router";
import login from '../views/login.vue';
import navigation from "../views/navigation.vue";
import home from "../views/home.vue";
import userManage from "../views/userManage.vue";
import historyManage from "../views/historyManage.vue";
import sensitiveManage from "../views/sensitiveManage.vue";
import knowledgeManage from "../views/knowledgeManage.vue";
import avaterManage from "../views/avaterManage.vue";
import admin from "../views/admin.vue";
import backManage from "../views/backManage.vue";
import userDetail from "../views/userDetail.vue";
import chatDetail from "../views/chatDetail.vue";
import adminManage from "../views/adminManage.vue";

const routes = [
	{
		path: "/",
		component: navigation,
		redirect: "/home",
		children: [
			{
				path: "home",
				name: "home",	
				component: home,
			},
			{
				path: "admin",
				name: "admin",	
				component: admin,
			},
			{
				path: "userManage",
				name: "userManage",	
				component: userManage,
			},
			{
				path: "historyManage",
				name: "historyManage",	
				component: historyManage,
			},
			{
				path: "sensitiveManage",
				name: "sensitiveManage",	
				component: sensitiveManage,
			},
			{
				path: "knowledgeManage",
				name: "knowledgeManage",	
				component: knowledgeManage,
			},
			{
				path: "avaterManage",
				name: "avaterManage",	
				component: avaterManage,
			},
			{
				path: "backManage",
				name: "backManage",	
				component: backManage,
			},
			{
				path: "userDetail",
				name: "userDetail",	
				component: userDetail,
			},
			{
				path: "chatDetail",
				name: "chatDetail",	
				component: chatDetail,
			},
			{
				path: "adminManage",
				name: "adminManage",	
				component: adminManage,
			},
		]
	},
	{
		path: "/login",
		name: "login",	
		component: login,
	},
];
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
