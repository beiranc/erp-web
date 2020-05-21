import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 *
 * 路由元信息
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 不需要任何权限都能直接访问的页面
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },

  // 还需要加上 401 页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: {
          title: '个人中心',
          icon: 'user',
          noCache: true
        }
      }
    ]
  }

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'http://beiran.top',
  //       meta: { title: '外链', icon: 'link' }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * 需要基于用户角色动态生成的路由
 */
export const asyncRoutes = [

  {
    name: '系统管理',
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'system',
      roles: ['admin']
    },
    children: [
      {
        name: 'User',
        path: 'user',
        hidden: false,
        component: () => import('@/views/system/user/index'),
        meta: {
          title: '用户管理',
          icon: 'peoples',
          noCache: true
        }
      },
      {
        name: 'Role',
        path: 'role',
        hidden: false,
        component: () => import('@/views/system/role/index'),
        meta: {
          title: '角色管理',
          icon: 'role',
          noCache: true
        }
      },
      {
        name: 'Menu',
        path: 'menu',
        hidden: false,
        component: () => import('@/views/system/menu/index'),
        meta: {
          title: '权限管理',
          icon: 'menu',
          noCache: true
        }
      },
      {
        name: 'Dept',
        path: 'dept',
        hidden: false,
        component: () => import('@/views/system/dept/index'),
        meta: {
          title: '部门管理',
          icon: 'dept',
          noCache: true
        }
      },
      {
        name: 'Job',
        path: 'job',
        hidden: false,
        component: () => import('@/views/system/job/index'),
        meta: {
          title: '岗位管理',
          icon: 'redis',
          noCache: true
        }
      },
      {
        name: 'Log',
        path: 'log',
        hidden: false,
        component: () => import('@/views/system/log/index'),
        meta: {
          title: '日志管理',
          icon: 'log',
          noCache: true
        }
      },
      {
        name: 'Swagger',
        path: 'swagger',
        hidden: false,
        component: () => import('@/views/system/swagger/index'),
        meta: {
          title: '接口文档',
          icon: 'swagger',
          noCache: true
        }
      }
    ]
  },

  {
    name: '采购管理',
    path: '/purchase',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '采购管理',
      icon: 'purchase',
      roles: ['purchaser', 'purchaseManager']
    },
    children: [
      {
        name: 'Plan-add',
        path: 'plan-add',
        hidden: false,
        component: () => import ('@/views/purchase/plan-add'),
        meta: {
          title: '创建采购计划',
          icon: 'create',
          noCache: true
        }
      },
      {
        name: 'Plan-permit',
        path: 'plan-permit',
        hidden: false,
        component: () => import ('@/views/purchase/plan-permit'),
        meta: {
          title: '批准采购计划',
          icon: 'permit',
          noCache: true,
          roles: ['purchaseManager']
        }
      },
      {
        name: 'Plan-close',
        path: 'plan-close',
        hidden: false,
        component: () => import ('@/views/purchase/plan-close'),
        meta: {
          title: '关闭采购计划',
          icon: 'close',
          noCache: true,
          roles: ['purchaseManager']
        }
      },
      {
        name: 'PurchaseReport',
        path: 'report',
        hidden: false,
        component: () => import ('@/views/purchase/report'),
        meta: {
          title: '导出采购计划',
          icon: 'export',
          noCache: true
        }
      }
    ]
  },

  {
    name: '销售管理',
    path: '/sale',
    component: Layout,
    alwaysShow: true,
    redirect: 'noRedirect',
    meta: {
      title: '销售管理',
      icon: 'sale',
      roles: ['seller', 'saleManager']
    },
    children: [
      {
        name: 'Cust',
        path: 'cust',
        hidden: false,
        component: () => import('@/views/sale/cust/index'),
        meta: {
          title: '客户管理',
          icon: 'cust',
          noCache: true
        }
      },
      {
        name: 'Order',
        path: 'order',
        hidden: false,
        component: () => import('@/views/sale/order/index'),
        meta: {
          title: '订单管理',
          icon: 'order',
          noCache: true
        }
      },
      {
        name: 'SaleReport',
        path: 'report',
        hidden: false,
        component: () => import('@/views/sale/report'),
        meta: {
          title: '导出销售订单',
          icon: 'export',
          noCache: true
        }
      }
    ]
  },

  {
    name: '生产管理',
    path: '/produce',
    alwaysShow: true,
    redirect: 'noRedirect',
    component: Layout,
    meta: {
      title: '生产管理',
      icon: 'produce',
      noCache: true,
      roles: ['producer', 'produceManager']
    },
    children: [
      {
        name: 'Demand-add',
        path: 'demand-add',
        hidden: false,
        component: () => import ('@/views/produce/demand-add'),
        meta: {
          title: '创建生产计划',
          icon: 'create',
          noCache: true
        }
      },
      {
        name: 'Demand-permit',
        path: 'demand-permit',
        hidden: false,
        component: () => import ('@/views/produce/demand-permit'),
        meta: {
          title: '批准生产计划',
          icon: 'permit',
          noCache: true,
          roles: ['produceManager']
        }
      },
      {
        name: 'Demand-close',
        path: 'demand-close',
        hidden: false,
        component: () => import ('@/views/produce/demand-close'),
        meta: {
          title: '关闭生产计划',
          icon: 'close',
          noCache: true,
          roles: ['produceManager']
        }
      },
      {
        name: 'ProduceReport',
        path: 'report',
        hidden: false,
        component: () => import ('@/views/produce/report'),
        meta: {
          title: '导出生产计划',
          icon: 'export',
          noCache: true
        }
      }
    ]
  },

  {
    name: '库存管理',
    path: '/stock',
    component: Layout,
    alwaysShow: true,
    redirect: 'noRedirect',
    meta: {
      title: '库存管理',
      icon: 'icon',
      noCache: true,
      roles: ['stocker']
    },
    children: [
      {
        name: 'Repo',
        path: 'repo',
        hidden: false,
        component: () => import ('@/views/stock/repo/index'),
        meta: {
          title: '仓储管理',
          icon: 'repo',
          noCache: true,
          roles: ['repoer']
        }
      },
      {
        name: 'StockReport',
        path: 'report',
        hidden: false,
        component: () => import ('@/views/stock/report'),
        meta: {
          title: '导出库存报表',
          icon: 'export',
          noCache: true,
          roles: ['stocker']
        }
      }
    ]
  },

  {
    name: 'Product',
    path: '/product',
    component: Layout,
    redirect: 'index',
    meta: {
      icon: 'product',
      noCache: true,
      roles: ['stocker', 'producer', 'produceManager']
    },
    children: [
      {
        name: 'ProductIndex',
        path: 'index',
        component: () => import ('@/views/product/index'),
        meta: {
          title: '产品管理',
          noCache: true,
          hidden: false
        }
      }
    ]
  },

  {
    name: 'Material',
    path: '/material',
    component: Layout,
    redirect: 'index',
    meta: {
      icon: 'material',
      noCache: true,
      roles: ['stocker', 'purchaser', 'purchaseManager']
    },
    children: [
      {
        name: 'MaterialIndex',
        path: 'index',
        component: () => import ('@/views/material/index'),
        meta: {
          title: '物料管理',
          noCache: true,
          hidden: false
        }
      }
    ]
  },

  // 404 页面必须放在最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // history 模式需要服务端支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
