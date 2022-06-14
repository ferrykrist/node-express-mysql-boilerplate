DROP VIEW IF EXISTS  view_userModules;
CREATE VIEW view_userModules AS
SELECT um.*, m.moduleName
FROM userModules AS um, modules AS m 
WHERE um.moduleId=m.moduleId;


DROP VIEW IF EXISTS view_users;
CREATE VIEW view_users AS
SELECT u.*, GROUP_CONCAT(um.moduleName) AS moduleName
FROM users AS u LEFT JOIN view_user_modules AS um ON u.userId=um.userId;