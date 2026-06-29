INSERT INTO sys_user(id, username, password, real_name, phone, email, role, status, create_time, update_time) VALUES
(1, 'admin', '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC', '系统管理员', '13800000000', 'admin@example.com', 'ADMIN', 'ENABLE', NOW(), NOW()),
(2, 'sender1', '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC', '张三', '13800000001', 'sender1@example.com', 'SENDER', 'ENABLE', NOW(), NOW()),
(3, 'sender2', '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC', '李四', '13900000002', 'sender2@example.com', 'SENDER', 'ENABLE', NOW(), NOW()),
(4, 'specialist1', '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC', '王专员', '13700000001', 'specialist1@example.com', 'SPECIALIST', 'ENABLE', NOW(), NOW()),
(5, 'specialist2', '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC', '赵专员', '13700000002', 'specialist2@example.com', 'SPECIALIST', 'ENABLE', NOW(), NOW());

INSERT INTO logistics_outlet(id, name, contact_phone, address, status, create_time, update_time) VALUES
(1, '北京分拨中心', '010-88888888', '北京市朝阳区物流园路1号', 'ENABLE', NOW(), NOW()),
(2, '上海分拨中心', '021-66666666', '上海市青浦区物流园路2号', 'ENABLE', NOW(), NOW()),
(3, '杭州运转网点', '0571-55555555', '浙江省杭州市西湖区网点路3号', 'ENABLE', NOW(), NOW()),
(4, '深圳运转网点', '0755-44444444', '广东省深圳市宝安区网点路4号', 'ENABLE', NOW(), NOW());

INSERT INTO transport_route(id, route_name, start_outlet_id, end_outlet_id, status, create_time, update_time) VALUES
(1, '北京-上海干线', 1, 2, 'ENABLE', NOW(), NOW()),
(2, '上海-杭州干线', 2, 3, 'ENABLE', NOW(), NOW()),
(3, '北京-深圳干线', 1, 4, 'ENABLE', NOW(), NOW());

INSERT INTO logistics_order(id, order_no, user_id, sender_name, sender_phone, sender_address, receiver_name, receiver_phone, receiver_address, item_type, weight, price, status, current_outlet_id, is_abnormal, abnormal_reason, receiver_signature, sign_time, create_time, update_time) VALUES
(1, 'WL202606290001', 2, '张三', '13800000001', '北京市朝阳区天安门路10号', '李四', '13900000002', '上海市黄浦区南京东路20号', '文件', 1.5, 16.50, 'SIGNED', 2, 0, NULL, '李四', '2026-06-29 18:00:00', '2026-06-29 09:00:00', '2026-06-29 18:00:00'),
(2, 'WL202606290002', 2, '张三', '13800000001', '北京市朝阳区天安门路10号', '王五', '13700000003', '杭州市西湖区灵隐路5号', '电子产品', 5.0, 27.00, 'IN_TRANSIT', 2, 0, NULL, NULL, NULL, '2026-06-29 09:10:00', '2026-06-29 15:00:00'),
(3, 'WL202606290003', 3, '李四', '13900000002', '上海市黄浦区南京东路20号', '赵六', '13600000004', '深圳市南山区科技园30号', '日用品', 10.0, 42.00, 'PENDING_COLLECT', NULL, 0, NULL, NULL, NULL, '2026-06-29 09:20:00', '2026-06-29 09:20:00');

INSERT INTO transit_log(id, order_id, operator_id, operator_name, node_name, description, create_time) VALUES
(1, 1, 2, '张三', '已下单', '寄件人已提交订单，等待物流专员揽收。', '2026-06-29 09:00:00'),
(2, 1, 4, '王专员', '已揽收', '物流专员已上门揽收快件，正运往首站网点。', '2026-06-29 10:00:00'),
(3, 1, 4, '王专员', '分拣中', '快件已到达北京分拨中心分拣完成，准备运往上海分拨中心。', '2026-06-29 14:00:00'),
(4, 1, 5, '赵专员', '派送中', '快件已到达上海分拨中心，由赵专员正在为您派送。', '2026-06-29 17:00:00'),
(5, 1, 5, '赵专员', '已签收', '收件人已签收，签收人姓名：李四。', '2026-06-29 18:00:00'),
(6, 2, 2, '张三', '已下单', '寄件人已提交订单，等待物流专员揽收。', '2026-06-29 09:10:00'),
(7, 2, 4, '王专员', '已揽收', '物流专员已上门揽收快件，并完成北京分拨中心分拣。', '2026-06-29 10:30:00'),
(8, 2, 4, '王专员', '运输中', '快件已从北京分拨中心发出，正发往上海分拨中心。', '2026-06-29 15:00:00'),
(9, 3, 3, '李四', '已下单', '寄件人已提交订单，等待物流专员揽收。', '2026-06-29 09:20:00');
