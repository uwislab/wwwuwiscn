/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80037 (8.0.37)
 Source Host           : localhost:3306
 Source Schema         : robots

 Target Server Type    : MySQL
 Target Server Version : 80037 (8.0.37)
 File Encoding         : 65001

 Date: 08/06/2025 20:24:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `comment_id` int NOT NULL AUTO_INCREMENT COMMENT '评论唯一ID',
  `user_id` int NOT NULL COMMENT '评论用户ID',
  `project_id` int NOT NULL COMMENT '被评论的项目ID',
  `parent_comment_id` int NULL DEFAULT NULL COMMENT '父评论ID(用于回复功能，NULL表示顶级评论)',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论创建时间',
  PRIMARY KEY (`comment_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  INDEX `parent_comment_id`(`parent_comment_id` ASC) USING BTREE,
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '项目评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites`  (
  `favorite_id` int NOT NULL AUTO_INCREMENT COMMENT '收藏记录ID',
  `user_id` int NOT NULL COMMENT '收藏用户ID',
  `project_id` int NOT NULL COMMENT '被收藏的项目ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`favorite_id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC, `project_id` ASC) USING BTREE COMMENT '确保用户对同一项目只能收藏一次',
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户收藏项目记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of favorites
-- ----------------------------

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes`  (
  `like_id` int NOT NULL AUTO_INCREMENT COMMENT '点赞记录ID',
  `user_id` int NOT NULL COMMENT '点赞用户ID',
  `project_id` int NOT NULL COMMENT '被点赞的项目ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`like_id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC, `project_id` ASC) USING BTREE COMMENT '确保用户对同一项目只能点赞一次',
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户点赞项目记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of likes
-- ----------------------------

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '菜单名称',
  `required_role_id` int NOT NULL COMMENT '所需角色',
  `morder` int NOT NULL COMMENT '显示顺序',
  `location` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '路径',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '菜单图标',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `required_role_id`(`required_role_id` ASC) USING BTREE,
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`required_role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (0, '用户信息', 0, 2, '/user', 'el-icon-warning-outline');
INSERT INTO `menu` VALUES (1, '菜单管理', 0, 4, '/caidan', 'el-icon-edit');
INSERT INTO `menu` VALUES (2, '项目管理', 1, 3, '/project', 'el-icon-goods');
INSERT INTO `menu` VALUES (3, '个人信息', 1, 1, '/setting', 'el-icon-user');

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `notification_id` int NOT NULL AUTO_INCREMENT COMMENT '通知消息ID',
  `recipient_id` int NOT NULL COMMENT '接收通知的用户ID',
  `sender_id` int NOT NULL COMMENT '触发通知的用户ID',
  `type` int NOT NULL COMMENT '通知类型: 1:点赞, 2-收藏, 3-评论, 4-回复',
  `project_id` int NULL DEFAULT NULL COMMENT '关联的项目ID',
  `comment_id` int NULL DEFAULT NULL COMMENT '关联的评论ID(仅对comment/4类型有效)',
  `is_read` tinyint(1) NULL DEFAULT 0 COMMENT '是否已读',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '通知创建时间',
  PRIMARY KEY (`notification_id`) USING BTREE,
  INDEX `recipient_id`(`recipient_id` ASC) USING BTREE,
  INDEX `sender_id`(`sender_id` ASC) USING BTREE,
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  INDEX `comment_id`(`comment_id` ASC) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户通知消息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
  `project_id` int NOT NULL AUTO_INCREMENT COMMENT '项目唯一标识ID',
  `user_id` int NOT NULL COMMENT '项目创建者ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '项目标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '项目描述',
  `c_code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `visibility` int NOT NULL COMMENT '项目可见性:0:公开，1：私有',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '项目创建时间',
  `view_count` int NULL DEFAULT 0 COMMENT '项目被查看次数',
  `like_count` int NULL DEFAULT 0 COMMENT '项目被点赞次数',
  PRIMARY KEY (`project_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户项目表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of projects
-- ----------------------------
INSERT INTO `projects` VALUES (3, 0, '我的项目', '我的项目', 'typedef int int16_t;\nstatic int16_t Count;\nint main(void) {\n    Count = 1;\n    while (Count <= 3)\n    {\n        window.alert(\"Hello World!\");\n        Count = Count + 1;\n    }\n\n    return 0;\n}', 0, '2025-06-03 02:25:02', 0, 0);
INSERT INTO `projects` VALUES (5, 2, 'demo1', '列表', 'static void * tmp_array[3];\nint main(void) {\n    tmp_array[0] = NULL;\n    tmp_array[1] = NULL;\n    tmp_array[2] = NULL;\n    tmp_array;\n\n    return 0;\n}', 1, '2025-06-03 04:20:11', 0, 0);
INSERT INTO `projects` VALUES (6, 0, '简单的循环', '一个简单的运动', 'typedef int int16_t;\nstatic int16_t Count;\nstatic int16_t count;\nint main(void) {\n    count = 0;\n    for (;count < 10;count++)\n    {\n        Count = 0;\n        forward(5, 50);\n        turn_left(90);\n        colorful_led(1, 1);\n        stop();\n    }\n\n    return 0;\n}', 1, '2025-06-03 04:39:20', 0, 0);
INSERT INTO `projects` VALUES (7, 0, '灯光', '灯光的实现', 'static void * Count;\nint main(void) {\n    colorful_led(1, 1);\n\n    return 0;\n}', 1, '2025-06-03 04:40:24', 0, 0);
INSERT INTO `projects` VALUES (8, 0, '有关灯光的项目', '有关灯光的C代码保存项目', 'typedef int int16_t;\nstatic int16_t Count;\nstatic void * light;\nstatic void * trak2;\nint main(void) {\n    Count = 0;\n    if (Count)\n    {\n        light = lightsensor();\n        trak2 = tracker(2);\n        Count = (/* unsupported expression typeof Count == \'number\' */ ? Count : 0) + 2;\n    }\n\n    return 0;\n}', 0, '2025-06-03 04:47:30', 0, 0);
INSERT INTO `projects` VALUES (9, 5, '有关颜色的项目', '颜色', '#include <string.h>\n#include <stdlib.h>\n#include <assert.h>\n#include <limits.h>\ntypedef int int16_t;\n#define ARRAY(T) struct {\\\n    int16_t size;\\\n    int16_t capacity;\\\n    T *data;\\\n} *\n#define ARRAY_CREATE(array, init_capacity, init_size) {\\\n    array = malloc(sizeof(*array)); \\\n    array->data = malloc((init_capacity) * sizeof(*array->data)); \\\n    assert(array->data != NULL); \\\n    array->capacity = init_capacity; \\\n    array->size = init_size; \\\n}\n#define ARRAY_PUSH(array, item) {\\\n    if (array->size == array->capacity) {  \\\n        array->capacity *= 2;  \\\n        array->data = realloc(array->data, array->capacity * sizeof(*array->data)); \\\n        assert(array->data != NULL); \\\n    }  \\\n    array->data[array->size++] = item; \\\n}\n#define STR_INT16_T_BUFLEN ((CHAR_BIT * sizeof(int16_t) - 1) / 3 + 2)\nint16_t str_len(const char * str) {\n    int16_t len = 0;\n    int16_t i = 0;\n    while (*str) {\n        i = 1;\n        if ((*str & 0xE0) == 0xC0) i=2;\n        else if ((*str & 0xF0) == 0xE0) i=3;\n        else if ((*str & 0xF8) == 0xF0) i=4;\n        str += i;\n        len += i == 4 ? 2 : 1;\n    }\n    return len;\n}\nconst char * str_substring(const char * str, int16_t start, int16_t end) {\n    int16_t i, tmp, pos, len = str_len(str), byte_start = -1;\n    char *p, *buf;\n    start = start < 0 ? 0 : (start > len ? len : start);\n    end = end < 0 ? 0 : (end > len ? len : end);\n    if (end < start) {\n        tmp = start;\n        start = end;\n        end = tmp;\n    }\n    i = 0;\n    pos = 0;\n    p = (char *)str;\n    while (*p) {\n        if (start == pos)\n            byte_start = p - str;\n        if (end == pos)\n            break;\n        i = 1;\n        if ((*p & 0xE0) == 0xC0) i=2;\n        else if ((*p & 0xF0) == 0xE0) i=3;\n        else if ((*p & 0xF8) == 0xF0) i=4;\n        p += i;\n        pos += i == 4 ? 2 : 1;\n    }\n    len = byte_start == -1 ? 0 : p - str - byte_start;\n    buf = malloc(len + 1);\n    assert(buf != NULL);\n    memcpy(buf, str + byte_start, len);\n    buf[len] = \'\\0\';\n    return buf;\n}\nconst char * str_slice(const char * str, int16_t start, int16_t end) {\n    int16_t len = str_len(str);\n    start = start < 0 ? len + start : start;\n    end = end < 0 ? len + end : end;\n    if (end - start < 0)\n        end = start;\n    return str_substring(str, start, end);\n}\nvoid str_int16_t_cat(char *str, int16_t num) {\n    char numstr[STR_INT16_T_BUFLEN];\n    sprintf(numstr, \"%d\", num);\n    strcat(str, numstr);\n}\nint16_t gc_i;\nstatic ARRAY(void *) gc_main;\nstatic void * Count;\nconst char * colourRgb(int16_t r, int16_t g, int16_t b)\n{\n    const char * substr;\n    const char * substr_2;\n    const char * substr_3;\n    char * tmp_string_6 = NULL;\n    char * tmp_string_5 = NULL;\n    char * tmp_string_4 = NULL;\n    r = /* unsupported expression Math.max(Math.min(Number(r), 100), 0) * 2.55 */;\n    g = /* unsupported expression Math.max(Math.min(Number(g), 100), 0) * 2.55 */;\n    b = /* unsupported expression Math.max(Math.min(Number(b), 100), 0) * 2.55 */;\n    r = (substr = str_slice((/* unsupported expression \'0\' + (Math.round(r) || 0).toString(16) */), -2, str_len((/* unsupported expression \'0\' + (Math.round(r) || 0).toString(16) */))));\n    g = (substr_2 = str_slice((/* unsupported expression \'0\' + (Math.round(g) || 0).toString(16) */), -2, str_len((/* unsupported expression \'0\' + (Math.round(g) || 0).toString(16) */))));\n    b = (substr_3 = str_slice((/* unsupported expression \'0\' + (Math.round(b) || 0).toString(16) */), -2, str_len((/* unsupported expression \'0\' + (Math.round(b) || 0).toString(16) */))));\n    tmp_string_6 = malloc(strlen(\"#\") + STR_INT16_T_BUFLEN + 1);\n    assert(tmp_string_6 != NULL);\n    tmp_string_6[0] = \'\\0\';\n    strcat(tmp_string_6, \"#\");\n    str_int16_t_cat(tmp_string_6, r);\n    tmp_string_5 = malloc(strlen(tmp_string_6) + STR_INT16_T_BUFLEN + 1);\n    assert(tmp_string_5 != NULL);\n    tmp_string_5[0] = \'\\0\';\n    strcat(tmp_string_5, tmp_string_6);\n    str_int16_t_cat(tmp_string_5, g);\n    tmp_string_4 = malloc(strlen(tmp_string_5) + STR_INT16_T_BUFLEN + 1);\n    assert(tmp_string_4 != NULL);\n    tmp_string_4[0] = \'\\0\';\n    strcat(tmp_string_4, tmp_string_5);\n    str_int16_t_cat(tmp_string_4, b);\n    ARRAY_PUSH(gc_main, tmp_string_4);\n    free((char *)tmp_string);\n    free((char *)tmp_string_2);\n    free((char *)tmp_string_3);\n    free((char *)tmp_string_5);\n    free((char *)tmp_string_6);\n    return tmp_string_4;\n\n}\n\nint main(void) {\n    ARRAY_CREATE(gc_main, 2, 0);\n\n    colourRgb(100, 50, 0);\n    for (gc_i = 0; gc_i < gc_main->size; gc_i++)\n        free(gc_main->data[gc_i]);\n    free(gc_main->data);\n    free(gc_main);\n\n    return 0;\n}', 1, '2025-06-03 04:49:26', 0, 0);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '角色描述',
  PRIMARY KEY (`role_id`) USING BTREE,
  UNIQUE INDEX `role_name`(`role_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (0, '管理员', '管理员');
INSERT INTO `roles` VALUES (1, '普通用户', '普通用户');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户基本信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (0, 'admin', '管理员', '123', 'admin@163.com', 0);
INSERT INTO `users` VALUES (2, 'lisi', '李思', 'ls123', 'ls@163.com', 1);
INSERT INTO `users` VALUES (4, 'zhangsan', '张散', 'zs123', 'zs@163.com', 1);
INSERT INTO `users` VALUES (5, 'wll', '呜啦啦', 'wll123', 'wll@163.com', 1);

SET FOREIGN_KEY_CHECKS = 1;
