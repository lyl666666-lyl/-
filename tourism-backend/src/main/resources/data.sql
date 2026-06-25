INSERT INTO sys_user(username,password,real_name,phone,email,role,status,create_time,update_time) VALUES
('admin','$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC','平台管理员','13800000000','admin@example.com','ADMIN','ENABLE',NOW(),NOW()),
('tourist1','$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC','游客一号','13900000001','tourist1@example.com','TOURIST','ENABLE',NOW(),NOW()),
('tourist2','$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC','游客二号','13900000002','tourist2@example.com','TOURIST','ENABLE',NOW(),NOW());

INSERT INTO traveler(user_id,name,gender,id_card,phone,remark,create_time) VALUES
(2,'张三','男','110101199001011234','13900000001','本人',NOW()),
(2,'李四','女','110101199202021235','13900000003','同行人',NOW()),
(3,'王五','男','110101199303031236','13900000002','本人',NOW()),
(3,'赵六','女','110101199404041237','13900000004','朋友',NOW());

INSERT INTO scenic_spot(name,location,level,cover_image,description,status,create_time) VALUES
('西湖','浙江杭州','5A','https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b','湖光山色与人文古迹结合的经典景区。','ENABLE',NOW()),
('黄山','安徽黄山','5A','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','以奇松、怪石、云海、温泉闻名。','ENABLE',NOW()),
('张家界','湖南张家界','5A','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429','峰林地貌与玻璃栈道体验。','ENABLE',NOW()),
('鼓浪屿','福建厦门','5A','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2','海岛风情、建筑街巷与音乐文化。','ENABLE',NOW()),
('丽江古城','云南丽江','5A','https://images.unsplash.com/photo-1507525428034-b723cf961d3e','古城民俗、雪山远眺与慢旅行。','ENABLE',NOW()),
('九寨沟','四川阿坝','5A','https://images.unsplash.com/photo-1527004013197-933c4bb611b3','以翠海、叠瀑、彩林、雪峰、藏情、蓝冰“六绝”著称于世，是人间仙境。','ENABLE',NOW()),
('北京故宫','北京东城','5A','https://images.unsplash.com/photo-1508009603885-50cf7c579365','世界保存最完整的古代皇家木结构宫殿群，中华五千年文明的瑰宝。','ENABLE',NOW()),
('桂林漓江','广西桂林','5A','https://images.unsplash.com/photo-1523731407965-2430cd12f5e4','漓江山水甲天下，碧水萦回、奇峰林立，如诗如画的喀斯特画卷。','ENABLE',NOW()),
('泰山','山东泰安','5A','https://images.unsplash.com/photo-1542601906990-b4d3fb778b09','五岳之首，中华民族的象征，气势雄伟磅礴，日出与摩崖刻石堪称一绝。','ENABLE',NOW()),
('秦始皇兵马俑','陕西西安','5A','https://images.unsplash.com/photo-1528163186890-de9b86b54b51','被誉为“世界第八大奇迹”，震撼的地下秦代军事帝陵陶俑奇观。','ENABLE',NOW());

INSERT INTO travel_route(route_name,spot_id,days,price,max_people,cover_image,itinerary,description,status,create_time,update_time) VALUES
('杭州西湖二日休闲游',1,2,699,30,'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b','D1 杭州东站接站 - 漫步断桥残雪 - 游览苏堤春晓 - 登雷峰塔俯瞰西湖全景；D2 晨间前往灵隐寺祈福 - 漫步飞来峰景区 - 龙井村品茗西湖龙井 - 杭州东站送站返程','适合周末短途休闲的经典江南水乡漫步路线。','ON_SALE',NOW(),NOW()),
('黄山三日摄影游',2,3,1299,25,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','D1 抵达屯溪老街自由行 - 享用徽菜晚餐 - 入住黄山山下特色客栈；D2 乘坐云谷索道上山 - 游览始信峰与黑虎松 - 赏黄山绝美晚霞与云海 - 入住山顶观景酒店；D3 晨起观黄山日出 - 游览宏村徽派古民居 - 漫步画桥水圳 - 下午返程送站','适合摄影和登山爱好者，尽赏奇松怪石与云海奇观。','ON_SALE',NOW(),NOW()),
('张家界四日深度游',3,4,1899,28,'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429','D1 抵达张家界接站 - 游览国家森林公园 - 漫步秀美金鞭溪 - 远眺百龙天梯；D2 游览袁家界（阿凡达哈利路亚山原型）- 天子山奇峰景区 - 入住景区特色客栈；D3 挑战天门山悬空玻璃栈道 - 乘坐世界最长高山索道 - 观天门洞传奇奇观；D4 漫步大峡谷体验震撼的玻璃桥 - 结束难忘的湘西深度之旅返回','峰林地貌深度体验，包含张家界大峡谷玻璃桥与天门山双景区。','ON_SALE',NOW(),NOW()),
('厦门鼓浪屿三日亲子游',4,3,1599,20,'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2','D1 抵达厦门接站 - 漫步七彩环岛路海滩 - 晚上逛曾厝垵体验沙茶面等特色小吃；D2 乘坐轮渡登上鼓浪屿 - 游览日光岩俯瞰全岛 - 漫步万国建筑博览群 - 感受浪漫琴岛氛围；D3 游览陈嘉庚故乡集美学村 - 参观龙舟池与嘉庚公园 - 结束愉快的亲子旅程送站','专为亲子家庭定制的慢游路线，沙滩、风琴与百年琴岛建筑交互。','ON_SALE',NOW(),NOW()),
('丽江雪山五日游',5,5,2699,22,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e','D1 抵达丽江三义机场接机 - 入住丽江古城客栈 - 晚上自由漫步大水车和四方街；D2 乘大索道直达玉龙雪山冰川公园 - 游览蓝月谷碧绿湖面 - 欣赏印象丽江实景演出；D3 前往束河古镇漫步 - 下午前往泸沽湖 - 欣赏情人滩与里格半岛美景；D4 乘坐猪槽船游泸沽湖 - 探访摩梭人家走婚桥 - 下午返回丽江；D5 丽江古镇手作鲜花饼体验 - 自由活动并根据航班时间安排送机返程','云南经典人文自然路线，带您深度打卡雪山与神秘泸沽湖。','ON_SALE',NOW(),NOW());

INSERT INTO tour_package(route_id,package_name,package_type,price,include_service,exclude_service,status,create_time) VALUES
(1,'经济套餐','ECONOMY',699,'往返大巴交通费、西湖及雷峰塔门票、标准商务快捷酒店单间1晚、基础导游讲解服务','景区内游船费（约50元/人）、龙井村品茶费、个人餐饮及其他自费项目','ENABLE',NOW()),
(1,'舒适套餐','COMFORT',899,'往返舒适商务专车接送、西湖景区VIP游船及雷峰塔门票、西湖景区旁高档四星级酒店、含自助早餐、金牌向导服务','个人正餐及晚餐、龙井茶礼盒购买费','ENABLE',NOW()),
(2,'基础套餐','ECONOMY',1299,'往返火车硬座、黄山景区大门票、山下舒适客栈1晚住宿、中文导游服务','黄山景区往返索道费用（单程80-90元/人）、山上住宿升级差价、正餐自理','ENABLE',NOW()),
(2,'摄影套餐','THEME',1699,'往返动车二等座、黄山景区大门票、宏村景区门票、山顶摄影主题观景酒店1晚、资深风光摄影导师随团指导、三餐全包（含山顶特色晚餐）','摄影器材租赁费、个人购买纪念品费用','ENABLE',NOW()),
(3,'标准套餐','STANDARD',1899,'往返旅游巴士交通、张家界森林公园+天门山双景区门票、市区精品酒店住宿、景区中文讲解','天门山扶梯及索道费、景区内百龙天梯单程票（约65元）、个人消费','ENABLE',NOW()),
(3,'精品小团','BOUTIQUE',2399,'全程7座保姆车接送、双景区VIP免排队通道门票、奢华山景民宿住宿、特色土家三下锅晚宴、全程无人机旅拍服务','一切个人自愿消费','ENABLE',NOW()),
(4,'亲子基础','FAMILY',1599,'往返动车二等座、厦门市内接送车、鼓浪屿往返轮渡船票、市区精选亲子主题酒店、专业亲子导游随行、含酒店早餐','鼓浪屿日光岩等小门票、午餐及晚餐自理、海滩水上娱乐项目费','ENABLE',NOW()),
(4,'亲子舒适','FAMILY_PLUS',1999,'全程别克GL8豪华商务专车、鼓浪屿VIP免排队轮渡门票、海景五星级酒店亲子套房、包含特色海鲜风味午餐、赠送日光岩和风琴博物馆门票、儿童手工沙画制作体验','个人购买特产、景区内的其他娱乐性消费','ENABLE',NOW()),
(5,'标准套餐','STANDARD',2699,'丽江往返旅游车费、玉龙雪山大索道票、丽江古城精品客栈、大理双廊一日游','雪山防寒服及氧气瓶租赁费（约100元）、泸沽湖游船费、个人餐饮','ENABLE',NOW()),
(5,'轻奢套餐','LUXURY',3399,'私人定制专车全程随行、雪山VIP免排队索道票（送防寒服+氧气瓶）、古城高奢网络红人民宿、网红玻璃球拍照、高端特色野生菌火锅、泸沽湖猪槽船环湖游','丽江古城维护费（部分区域选缴）、个人纪念品消费','ENABLE',NOW());

INSERT INTO guide(name,phone,level,status) VALUES
('陈导','13700000001','高级','AVAILABLE'),
('刘导','13700000002','中级','AVAILABLE'),
('周导','13700000003','高级','AVAILABLE');

INSERT INTO tour_order(order_no,user_id,route_id,package_id,travel_date,people_count,total_amount,contact_name,contact_phone,status,return_reason,create_time,update_time) VALUES
('TO202606220001',2,1,1,'2026-07-01',1,699,'张三','13900000001','PENDING_CHECK',NULL,NOW(),NOW()),
('TO202606220002',2,2,3,'2026-07-05',2,2598,'张三','13900000001','RETURNED','身份证信息需要核对',NOW(),NOW()),
('TO202606220003',3,3,5,'2026-07-08',1,1899,'王五','13900000002','CONFIRMED',NULL,NOW(),NOW()),
('TO202606220004',3,4,7,'2026-07-10',2,3198,'王五','13900000002','ARRANGED',NULL,NOW(),NOW()),
('TO202606220005',2,5,9,'2026-06-20',1,2699,'张三','13900000001','FINISHED',NULL,NOW(),NOW());

INSERT INTO order_traveler(order_id,traveler_id,traveler_name,id_card,phone) VALUES
(1,1,'张三','110101199001011234','13900000001'),
(2,1,'张三','110101199001011234','13900000001'),
(2,2,'李四','110101199202021235','13900000003'),
(3,3,'王五','110101199303031236','13900000002'),
(4,3,'王五','110101199303031236','13900000002'),
(4,4,'赵六','110101199404041237','13900000004'),
(5,1,'张三','110101199001011234','13900000001');

INSERT INTO travel_arrangement(order_id,guide_id,batch_no,depart_time,gather_place,reminder,create_time) VALUES
(4,1,'XM-20260710-A','2026-07-10 08:00:00','厦门北站南广场','请携带身份证，提前 30 分钟集合。',NOW());

INSERT INTO after_sale(order_id,user_id,type,content,status,reply,create_time,update_time) VALUES
(5,2,'CONSULT','行程结束后发票如何开具？','DONE','请在个人中心补充发票抬头后联系客服开具。',NOW(),NOW());

INSERT INTO order_log(order_id,operator_id,operator_role,action,remark,create_time) VALUES
(1,2,'TOURIST','CREATE','游客提交预订',NOW()),
(3,1,'ADMIN','CONFIRM','管理员确认订单',NOW()),
(4,1,'ADMIN','ARRANGE','管理员分配导游和批次',NOW());
