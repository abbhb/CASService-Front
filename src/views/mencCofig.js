
export const menuData = [
    {
        optionName: "我的主页",
        iconClassName: "el-icon-eleme",
        index: '1',
        roles:['10','1','2','3'],
        childList: [
            {
                optionName: '个人信息',
                index: '1-1',
                routerName: "userinfo",
                iconClassName: "el-icon-user",
                roles:['10','1','2','3']
            },
            {
                optionName: '安全中心',
                index: '1-2',
                routerName: "safecenter",
                iconClassName: "el-icon-success",
                roles:['10','1','2','3']
            },
        ]
    },
    {
        optionName: "管理系统",
        iconClassName: "el-icon-setting",
        index: '2',
        disabled: false, // 是否禁用
        roles:['1','10'],
        childList: [
            {
                optionName: '用户管理',
                index: '2-1',
                routerName: "UserManagement",
                iconClassName: "el-icon-user",
                roles:['10','1'],
            },
            {
                optionName: '邀请码管理',
                index: '2-2',
                routerName: "InviteCode",
                iconClassName: "el-icon-setting",
                roles:['10','1'],
            }
        ]
    }

]


/* 菜单配置 描述 */
export const menuData描述 = [
    // 有子菜单 并且字菜单分组的
    {
        optionName: "导航一", // 一级菜单名
        iconClassName: "aaa", // element-ui图标名
        index: '1', // 唯一标志
        childList: [ // 分组的
            {
                groupName: '组名一',
                index: '1-1-1',
                list: [
                    {
                        optionName: '选项1',
                        routerName: "home"
                    },
                    {}
                ],
            },
            {
                groupName: '组名二',
                index: '1-1-2',
                list: [
                    {
                        optionName: '选项1',
                        routerName: "home"
                    },
                    {}
                ],
            }
        ],
    },
    // 有子菜单 字菜单不分组的
    {
        optionName: "导航二",
        iconClassName: "el-icon-menu",
        index: '2',
        disabled: false, // 是否禁用
        childList: [ // 不分组的
            {
                optionName: '选项1',
                index: '2-1',
                routerName: "home"
            },
            {}
        ]
    },
    // 无子菜单的
    {
        optionName: "导航三",
        iconClassName: "el-icon-document",
        routerName: "home",
        index: '3',
        disabled: false
    },

    "导航四"
]

