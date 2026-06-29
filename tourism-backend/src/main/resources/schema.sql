DROP TABLE IF EXISTS transit_log;
DROP TABLE IF EXISTS logistics_order;
DROP TABLE IF EXISTS transport_route;
DROP TABLE IF EXISTS logistics_outlet;
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

CREATE TABLE logistics_outlet (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  contact_phone VARCHAR(30),
  address VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME,
  update_time DATETIME
);

CREATE TABLE transport_route (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_name VARCHAR(120) NOT NULL,
  start_outlet_id BIGINT NOT NULL,
  end_outlet_id BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME,
  update_time DATETIME
);

CREATE TABLE logistics_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL,
  sender_name VARCHAR(50) NOT NULL,
  sender_phone VARCHAR(30) NOT NULL,
  sender_address VARCHAR(255) NOT NULL,
  receiver_name VARCHAR(50) NOT NULL,
  receiver_phone VARCHAR(30) NOT NULL,
  receiver_address VARCHAR(255) NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL,
  current_outlet_id BIGINT,
  is_abnormal INT DEFAULT 0,
  abnormal_reason VARCHAR(255),
  receiver_signature VARCHAR(100),
  sign_time DATETIME,
  create_time DATETIME,
  update_time DATETIME
);

CREATE TABLE transit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  operator_id BIGINT,
  operator_name VARCHAR(50),
  node_name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  create_time DATETIME
);
