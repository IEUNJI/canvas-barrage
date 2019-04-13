let fs = require('fs');

function getRandom(m, n) {
    return Math.round(Math.random() * (n - m) + m);
}

let str1 = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章",
    str2 = "辉强有霆润旭越瀚岚生翰峰阳中钊璇超琛光朋煊萱龙良诚泽炜玮章佳帅宁殿童连英易逸吉璨",
    str3 = "安河希忠沛苒坚涛智涵磊旺君珸信学利鸣哲为振芮雄齐风飞元子策彰灿震永若兵贤之江民沺";

let ary = [];
for (let i = 1; i <= 2500; i++) {
    let obj = {};
    obj.value = '测试弹幕 by ' + str1[getRandom(0, 39)] + str2[getRandom(0, 39)] + str3[getRandom(0, 39)];
    obj.time = getRandom(0, 500);
    obj.fontSize = getRandom(20, 30);
    obj.color = `rgba(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)})`;
    obj.speed = getRandom(2, 6);
    ary.push(obj);
}

fs.writeFileSync('barrages.json', JSON.stringify(ary), 'utf-8');