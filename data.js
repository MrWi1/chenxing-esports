/**
 * 宸星电竞 - 玩法菜单数据
 * 请根据实际图片路径修改 img 字段
 */

const MENU_DATA = {
    // ===== 三角洲陪玩 =====
    "delta-companion": {
        name: "三角洲陪玩",
        icon: "⚔️",
        color: "badge-delta",
        items: [
            {
                id: "dc001",
                name: "三角洲陪玩单",
                desc: "专业陪玩服务，带你上分带你飞",
                img: "images/三角洲陪玩.jpg",
                tags: ["陪玩", "上分"]
            }
        ]
    },

    // ===== 三角洲独家趣味单 =====
    "delta-exclusive": {
        name: "独家趣味单",
        icon: "🌟",
        color: "badge-fun",
        items: [
            { id: "de001", name: "黄金矿工", desc: "经典挖矿玩法，比比谁更肝", img: "images/黄金矿工.jpg", tags: ["独家", "趣味"] },
            { id: "de002", name: "独自升级", desc: "单人挑战极限，证明你的实力", img: "images/独自升级.jpg", tags: ["独家", "挑战"] },
            { id: "de003", name: "十二星座", desc: "星座主题趣味玩法，看看你的幸运星", img: "images/十二星座.jpg", tags: ["独家", "星座"] }
        ]
    },

    // ===== 三角洲趣味单 =====
    "delta-fun": {
        name: "常规趣味单",
        icon: "🎲",
        color: "badge-fun",
        items: [
            { id: "df001", name: "Galgame", desc: "二次元恋爱冒险，选择决定结局", img: "images/galgame.jpg", tags: ["趣味", "互动"] },
            { id: "df002", name: "大富翁", desc: "经典掷骰子走格子，谁是最后的赢家", img: "images/大富翁.jpg", tags: ["趣味", "策略"] },
            { id: "df003", name: "毒苹果", desc: "谁能吃到安全的苹果？考验运气的时候到了", img: "images/毒苹果.jpg", tags: ["趣味", "运气"] },
            { id: "df004", name: "海底捞", desc: "海底捞月，看谁能捞到最大的奖", img: "images/海底捞.jpg", tags: ["趣味", "抽奖"] },
            { id: "df005", name: "红包单", desc: "拆红包啦！看看手气如何", img: "images/红包单.jpg", tags: ["趣味", "红包"] },
            { id: "df006", name: "斤斤计较", desc: "精打细算，每一分都要花在刀刃上", img: "images/斤斤计较.jpg", tags: ["趣味", "策略"] },
            { id: "df007", name: "谁是雀神", desc: "麻将高手对决，谁是真正的雀神", img: "images/谁是雀神.jpg", tags: ["趣味", "竞技"] },
            { id: "df008", name: "全员爆仓", desc: "疯狂押注，全员爆仓的刺激体验", img: "images/全员爆仓.jpg", tags: ["趣味", "刺激"] },
            { id: "df009", name: "三角杀", desc: "三角洲特色杀人游戏，考验推理与演技", img: "images/三角杀.jpg", tags: ["趣味", "推理"] },
            { id: "df010", name: "拼好饭", desc: "拼单点餐，看谁搭配最默契", img: "images/拼好饭.jpg", tags: ["趣味", "社交"] },
            { id: "df011", name: "填填乐", desc: "填字游戏大挑战，测测你的词汇量", img: "images/填填乐.jpg", tags: ["趣味", "益智"] },
            { id: "df012", name: "宸星银行", desc: "模拟银行经营，理财大师就是你", img: "images/宸星银行.jpg", tags: ["趣味", "模拟"] },
            { id: "df013", name: "五福临门", desc: "集齐五福，好运连连", img: "images/五福临门.jpg", tags: ["趣味", "好运"] },
            { id: "df014", name: "消消乐", desc: "三消经典玩法，轻松又解压", img: "images/消消乐.jpg", tags: ["趣味", "休闲"] },
            { id: "df015", name: "小小巨人", desc: "小个子也有大能量，逆袭就在此刻", img: "images/小小巨人.jpg", tags: ["趣味", "逆袭"] },
            { id: "df016", name: "悬赏令", desc: "发布悬赏，全服通缉目标", img: "images/悬赏令.jpg", tags: ["趣味", "悬赏"] }
        ]
    },

    // ===== 三角洲活动单 =====
    "delta-event": {
        name: "基础趣味单",
        icon: "🎉",
        color: "badge-event",
        items: [
            { id: "ev001", name: "趣味单1", desc: "活动内容详情请咨询前台", img: "images/趣味单1.jpg", tags: ["活动"] },
            { id: "ev002", name: "趣味单2", desc: "活动内容详情请咨询前台", img: "images/趣味单2.jpg", tags: ["活动"] },
            { id: "ev003", name: "趣味单3", desc: "活动内容详情请咨询前台", img: "images/趣味单3.jpg", tags: ["活动"] }
        ]
    },

    // ===== 特惠单 =====
    "delta-special": {
        name: "活动单",
        icon: "🔥",
        color: "badge-event",
        items: [
            { id: "sp001", name: "盲盒单", desc: "神秘盲盒，开启未知惊喜", img: "images/盲盒单.jpg", tags: ["特惠", "盲盒"] },
            { id: "sp002", name: "暑期单", desc: "暑期特别活动，超值优惠不容错过", img: "images/暑期单.jpg", tags: ["特惠", "暑期"] },
            { id: "sp003", name: "28R陪玩单", desc: "超值28元陪玩体验，性价比之王", img: "images/28R.jpg", tags: ["特惠", "陪玩"] }
        ]
    },

    // ===== 无畏契约陪玩 =====
    "valorant": {
        name: "无畏契约陪玩",
        icon: "🔫",
        color: "badge-valorant",
        items: [
            { id: "va001", name: "无畏契约陪玩单", desc: "瓦罗兰特专业陪玩，枪枪爆头", img: "images/无畏契约.jpg", tags: ["陪玩", "FPS"] }
        ]
    },

    // ===== 老板须知 =====
    "notice": {
        name: "老板须知",
        icon: "📋",
        color: "badge-notice",
        items: [
            { id: "no001", name: "老板须知", desc: "请仔细阅读俱乐部规则与注意事项", img: "images/老板须知.jpg", tags: ["须知", "规则"] }
        ]
    }
};

// 分类配置：定义主菜单的顺序和包含的子分类
const CATEGORY_CONFIG = [
    {
        id: "all",
        name: "全部玩法",
        icon: "🎮",
        subCategories: [
            "delta-companion",
            "delta-exclusive",
            "delta-fun",
            "delta-event",
            "delta-special",
            "valorant",
            "notice"
        ]
    },
    {
        id: "delta-companion",
        name: "三角洲陪玩",
        icon: "⚔️",
        subCategories: ["delta-companion"]
    },
    {
        id: "delta-fun",
        name: "三角洲趣味单",
        icon: "🎲",
        subCategories: ["delta-exclusive", "delta-fun", "delta-event", "delta-special"]
    },
    {
        id: "delta-event",
        name: "三角洲活动单",
        icon: "🎉",
        subCategories: ["delta-event", "delta-special"]
    },
    {
        id: "valorant",
        name: "无畏契约陪玩",
        icon: "🔫",
        subCategories: ["valorant"]
    },
    {
        id: "notice",
        name: "老板须知",
        icon: "📋",
        subCategories: ["notice"]
    }
];
