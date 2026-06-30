const MENU_DATA = {
    // ===== 三角洲陪玩 =====
    "delta-escort": {
        name: "三角洲陪玩",
        icon: "🎮",
        color: "badge-escort",
        items: [
            {
                id: "dc001",
                name: "三角洲陪玩单",
                desc: "专业陪玩服务，带你上分带你飞",
                img: "images/sanpeiwan.jpg",
                tags: ["陪玩", "上分"]
            }
        ]
    },
    // ===== 独家趣味单 =====
    "delta-exclusive": {
        name: "独家趣味单",
        icon: "⭐",
        color: "badge-exclusive",
        items: [
            { id: "ex-001", name: "黄金矿工", desc: "经典挖矿玩法，比比谁更肝", img: "images/kuanggong.jpg", tags: ["独家", "趣味"] },
            { id: "ex-002", name: "独自升级", desc: "单人挑战极限，证明你的实力", img: "images/duzishengji.jpg", tags: ["独家", "挑战"] },
            { id: "ex-003", name: "十二星座", desc: "星座主题趣味玩法，看看你的幸运星", img: "images/12xingzuo.jpg", tags: ["独家", "星座"] }
        ]
    },
    // ===== 常规趣味单 =====
    "delta-fun": {
        name: "常规趣味单",
        icon: "🎲",
        color: "badge-fun",
        items: [
            { id: "df001", name: "Galgame", desc: "二次元恋爱冒险，选择决定结局", img: "images/galgame.jpg", tags: ["趣味", "互动"] },
            { id: "df002", name: "大富翁", desc: "经典掷骰子走格子，谁是最后的赢家", img: "images/fuweng.jpg", tags: ["趣味", "策略"] },
            { id: "df003", name: "毒苹果", desc: "谁能吃到安全的苹果？考验运气的时候到了", img: "images/pingguo.jpg", tags: ["趣味", "运气"] },
            { id: "df004", name: "海底捞", desc: "海底捞月，看谁能捞到最大的奖", img: "images/haidilao.jpg", tags: ["趣味", "抽奖"] },
            { id: "df005", name: "红包单", desc: "拆红包啦！看看手气如何", img: "images/hongbaodan.jpg", tags: ["趣味", "红包"] },
            { id: "df006", name: "斤斤计较", desc: "精打细算，每一分都要花在刀刃上", img: "images/jijiao.jpg", tags: ["趣味", "策略"] },
            { id: "df007", name: "谁是雀神", desc: "麻将高手对决，谁是真正的雀神", img: "images/queshen.jpg", tags: ["趣味", "竞技"] },
            { id: "df008", name: "全员爆仓", desc: "疯狂押注，全员爆仓的刺激体验", img: "images/quanyuanbc.jpg", tags: ["趣味", "刺激"] },
            { id: "df009", name: "三角杀", desc: "三角洲特色杀人游戏，考验推理与演技", img: "images/sanjiaosha.jpg", tags: ["趣味", "推理"] },
            { id: "df010", name: "拼好饭", desc: "拼单点餐，看谁搭配最默契", img: "images/pinhaofan.jpg", tags: ["趣味", "社交"] },
            { id: "df011", name: "填填乐", desc: "填字游戏大挑战，测测你的词汇量", img: "images/tiantianle.jpg", tags: ["趣味", "益智"] },
            { id: "df012", name: "宸星银行", desc: "模拟银行经营，理财大师就是你", img: "images/yinghang.jpg", tags: ["趣味", "模拟"] },
            { id: "df013", name: "五福临门", desc: "集齐五福，好运连连", img: "images/wufulinmen.jpg", tags: ["趣味", "好运"] },
            { id: "df014", name: "消消乐", desc: "三消经典玩法，轻松又解压", img: "images/xaioxaiole.jpg", tags: ["趣味", "休闲"] },
            { id: "df015", name: "小小巨人", desc: "小个子也有大能量，逆袭就在此刻", img: "images/juren.jpg", tags: ["趣味", "逆袭"] },
            { id: "df016", name: "悬赏令", desc: "发布悬赏，全服通缉目标", img: "images/xaunshang.jpg", tags: ["趣味", "悬赏"] }
        ]
    },
    // ===== 基础趣味单 =====
    "basic-fun": {
        name: "基础趣味单",
        icon: "🔰",
        color: "badge-basic",
        items: [
            { id: "bf-001", name: "趣味单1", desc: "基础趣味玩法1", img: "images/quweidan1.jpg", tags: ["基础", "趣味"] },
            { id: "bf-002", name: "趣味单2", desc: "基础趣味玩法2", img: "images/quweidan2.jpg", tags: ["基础", "趣味"] },
            { id: "bf-003", name: "趣味单3", desc: "基础趣味玩法3", img: "images/quweidan3.jpg", tags: ["基础", "趣味"] }
        ]
    },
    // ===== 三角洲活动单 =====
    "delta-event": {
        name: "三角洲活动单",
        icon: "🎁",
        color: "badge-event",
        items: [
            { id: "ev-001", name: "盲盒单", desc: "神秘盲盒，开启未知惊喜", img: "images/manghe.jpg", tags: ["活动", "惊喜"] },
            { id: "ev-002", name: "暑期单", desc: "暑期特别活动，超值优惠不容错过", img: "images/shuqidan.jpg", tags: ["活动", "暑期"] },
            { id: "ev-003", name: "28R陪玩单", desc: "超值28元陪玩体验，性价比之王", img: "images/28R.jpg", tags: ["活动", "特价"] }
        ]
    },
    // ===== 无畏契约陪玩 =====
    "valo-escort": {
        name: "无畏契约陪玩",
        icon: "🎯",
        color: "badge-valo",
        items: [
            { id: "va001", name: "无畏契约陪玩单", desc: "瓦罗兰特专业陪玩，枪枪爆头", img: "images/weweiqiyue.jpg", tags: ["陪玩", "FPS"] }
        ]
    },
    // ===== 老板须知 =====
    "boss-notice": {
        name: "老板须知",
        icon: "📜",
        color: "badge-notice",
        items: [
            { id: "bn-001", name: "老板须知", desc: "本俱乐部服务条款与注意事项", img: "images/xuzhi.jpg", tags: ["须知", "规则"] }
        ]
    },
    // ===== 客服微信 =====
    "customer-service": {
        name: "客服微信",
        icon: "💬",
        color: "badge-service",
        items: [
            { id: "cs-001", name: "客服微信", desc: "添加客服微信，随时联系我们", img: "images/wechat1.jpg", tags: ["客服", "联系"] }
        ]
    }
};
