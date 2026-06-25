DROP DATABASE IF EXISTS tourism_system;
CREATE DATABASE tourism_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tourism_system;

CREATE TABLE sys_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  real_name VARCHAR(50),
  phone VARCHAR(30),
  email VARCHAR(80),
  role VARCHAR(20) NOT NULL,
  avatar VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE traveler (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(10),
  id_card VARCHAR(30),
  phone VARCHAR(30),
  remark VARCHAR(255),
  create_time DATETIME
);
CREATE TABLE scenic_spot (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  level VARCHAR(20),
  cover_image VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME
);
CREATE TABLE travel_route (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_name VARCHAR(120) NOT NULL,
  spot_id BIGINT NOT NULL,
  days INT,
  price DECIMAL(10,2),
  max_people INT,
  cover_image VARCHAR(255),
  itinerary TEXT,
  description TEXT,
  status VARCHAR(20) DEFAULT 'ON_SALE',
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE tour_package (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id BIGINT NOT NULL,
  package_name VARCHAR(100) NOT NULL,
  package_type VARCHAR(50),
  price DECIMAL(10,2),
  include_service TEXT,
  exclude_service TEXT,
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME
);
CREATE TABLE tour_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL,
  route_id BIGINT NOT NULL,
  package_id BIGINT,
  travel_date DATE,
  people_count INT,
  total_amount DECIMAL(10,2),
  contact_name VARCHAR(50),
  contact_phone VARCHAR(30),
  status VARCHAR(30),
  return_reason VARCHAR(255),
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE order_traveler (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  traveler_id BIGINT,
  traveler_name VARCHAR(50),
  id_card VARCHAR(30),
  phone VARCHAR(30)
);
CREATE TABLE guide (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(30),
  level VARCHAR(30),
  status VARCHAR(20)
);
CREATE TABLE travel_arrangement (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL UNIQUE,
  guide_id BIGINT,
  batch_no VARCHAR(50),
  depart_time DATETIME,
  gather_place VARCHAR(255),
  reminder TEXT,
  create_time DATETIME
);
CREATE TABLE after_sale (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  type VARCHAR(30),
  content TEXT,
  status VARCHAR(30),
  reply TEXT,
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE order_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  operator_id BIGINT,
  operator_role VARCHAR(20),
  action VARCHAR(50),
  remark VARCHAR(255),
  create_time DATETIME
);

SET @pwd = '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC';
INSERT INTO sys_user(username,password,real_name,phone,email,role,status,create_time,update_time) VALUES
('admin',@pwd,'平台管理员','13800000000','admin@example.com','ADMIN','ENABLE',NOW(),NOW()),
('tourist1',@pwd,'游客一号','13900000001','tourist1@example.com','TOURIST','ENABLE',NOW(),NOW()),
('tourist2',@pwd,'游客二号','13900000002','tourist2@example.com','TOURIST','ENABLE',NOW(),NOW());

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
('丽江古城','云南丽江','5A','https://images.unsplash.com/photo-1507525428034-b723cf961d3e','古城民俗、雪山远眺与慢旅行。','ENABLE',NOW());

INSERT INTO travel_route(route_name,spot_id,days,price,max_people,cover_image,itinerary,description,status,create_time,update_time) VALUES
('杭州西湖二日休闲游',1,2,699,30,'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b','D1 断桥-苏堤-雷峰塔；D2 灵隐寺-龙井村','适合周末短途休闲。','ON_SALE',NOW(),NOW()),
('黄山三日摄影游',2,3,1299,25,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','D1 抵达屯溪；D2 黄山云海；D3 宏村返程','适合摄影和登山爱好者。','ON_SALE',NOW(),NOW()),
('张家界四日深度游',3,4,1899,28,'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429','D1 森林公园；D2 袁家界；D3 天门山；D4 返程','峰林地貌深度体验。','ON_SALE',NOW(),NOW()),
('厦门鼓浪屿三日亲子游',4,3,1599,20,'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2','D1 环岛路；D2 鼓浪屿；D3 集美学村','亲子慢游路线。','ON_SALE',NOW(),NOW()),
('丽江雪山五日游',5,5,2699,22,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e','D1 古城；D2 玉龙雪山；D3 束河；D4 泸沽湖；D5 返程','云南经典人文自然路线。','ON_SALE',NOW(),NOW());

INSERT INTO tour_package(route_id,package_name,package_type,price,include_service,exclude_service,status,create_time) VALUES
(1,'经济套餐','ECONOMY',699,'交通、门票、经济酒店','个人消费','ENABLE',NOW()),(1,'舒适套餐','COMFORT',899,'交通、门票、四星酒店、早餐','个人消费','ENABLE',NOW()),
(2,'基础套餐','ECONOMY',1299,'交通、门票、山下住宿','索道自费','ENABLE',NOW()),(2,'摄影套餐','THEME',1699,'交通、门票、摄影向导、精选住宿','个人器材','ENABLE',NOW()),
(3,'标准套餐','STANDARD',1899,'交通、门票、酒店','个人消费','ENABLE',NOW()),(3,'精品小团','BOUTIQUE',2399,'精品小团、特色餐、优先入园','个人消费','ENABLE',NOW()),
(4,'亲子基础','FAMILY',1599,'交通、门票、亲子酒店','个人消费','ENABLE',NOW()),(4,'亲子舒适','FAMILY_PLUS',1999,'亲子酒店、特色体验、早餐','个人消费','ENABLE',NOW()),
(5,'标准套餐','STANDARD',2699,'交通、酒店、门票','个人消费','ENABLE',NOW()),(5,'轻奢套餐','LUXURY',3399,'高端酒店、专车、特色餐','个人消费','ENABLE',NOW());

INSERT INTO guide(name,phone,level,status) VALUES
('陈导','13700000001','高级','AVAILABLE'),('刘导','13700000002','中级','AVAILABLE'),('周导','13700000003','高级','AVAILABLE');

INSERT INTO tour_order(order_no,user_id,route_id,package_id,travel_date,people_count,total_amount,contact_name,contact_phone,status,return_reason,create_time,update_time) VALUES
('TO202606220001',2,1,1,'2026-07-01',1,699,'张三','13900000001','PENDING_CHECK',NULL,NOW(),NOW()),
('TO202606220002',2,2,3,'2026-07-05',2,2598,'张三','13900000001','RETURNED','身份证信息需要核对',NOW(),NOW()),
('TO202606220003',3,3,5,'2026-07-08',1,1899,'王五','13900000002','CONFIRMED',NULL,NOW(),NOW()),
('TO202606220004',3,4,7,'2026-07-10',2,3198,'王五','13900000002','ARRANGED',NULL,NOW(),NOW()),
('TO202606220005',2,5,9,'2026-06-20',1,2699,'张三','13900000001','FINISHED',NULL,NOW(),NOW());
INSERT INTO order_traveler(order_id,traveler_id,traveler_name,id_card,phone) VALUES
(1,1,'张三','110101199001011234','13900000001'),(2,1,'张三','110101199001011234','13900000001'),(2,2,'李四','110101199202021235','13900000003'),
(3,3,'王五','110101199303031236','13900000002'),(4,3,'王五','110101199303031236','13900000002'),(4,4,'赵六','110101199404041237','13900000004'),(5,1,'张三','110101199001011234','13900000001');
INSERT INTO travel_arrangement(order_id,guide_id,batch_no,depart_time,gather_place,reminder,create_time) VALUES
(4,1,'XM-20260710-A','2026-07-10 08:00:00','厦门北站南广场','请携带身份证，提前 30 分钟集合。',NOW());
INSERT INTO after_sale(order_id,user_id,type,content,status,reply,create_time,update_time) VALUES
(5,2,'CONSULT','行程结束后发票如何开具？','DONE','请在个人中心补充发票抬头后联系客服开具。',NOW(),NOW());
INSERT INTO order_log(order_id,operator_id,operator_role,action,remark,create_time) VALUES
(1,2,'TOURIST','CREATE','游客提交预订',NOW()),(3,1,'ADMIN','CONFIRM','管理员确认订单',NOW()),(4,1,'ADMIN','ARRANGE','管理员分配导游和批次',NOW());
