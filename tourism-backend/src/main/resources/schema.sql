DROP TABLE IF EXISTS order_log;
DROP TABLE IF EXISTS after_sale;
DROP TABLE IF EXISTS travel_arrangement;
DROP TABLE IF EXISTS guide;
DROP TABLE IF EXISTS order_traveler;
DROP TABLE IF EXISTS tour_order;
DROP TABLE IF EXISTS tour_package;
DROP TABLE IF EXISTS travel_route;
DROP TABLE IF EXISTS scenic_spot;
DROP TABLE IF EXISTS traveler;
DROP TABLE IF EXISTS sys_user;

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
