DROP VIEW IF EXISTS  view_userModules;
CREATE VIEW view_userModules AS
SELECT um.*, m.moduleName, u.fullname
FROM userModules AS um, modules AS m, users As u 
WHERE um.moduleId=m.moduleId
AND u.userId=um.userId;

DROP VIEW IF EXISTS view_users;
CREATE VIEW view_users AS
SELECT u.*, um2.moduleName, ud2.departement
FROM users as u LEFT JOIN
(SELECT um.userId, GROUP_CONCAT(m.moduleName ORDER BY m.moduleName SEPARATOR ', ' ) As moduleName 
FROM userModules As um, modules AS m WHERE um.moduleId=m.moduleId 
GROUP BY um.userId
) AS um2 ON u.userId=um2.userId
LEFT JOIN
(SELECT ud.userId, GROUP_CONCAT(d.departement ORDER BY d.departement  SEPARATOR ', ') As departement 
FROM userDepartement As ud, departement AS d WHERE ud.departementId=d.departementId 
GROUP BY ud.userId
) AS ud2 ON u.userId=ud2.userId
ORDER BY u.fullname;

DROP VIEW IF EXISTS view_departement;
CREATE VIEW view_departement AS
SELECT d.*, GROUP_CONCAT(ud2.fullname) AS users
FROM departement AS d LEFT JOIN 
(SELECT ud.departementId, u.fullname
FROM userDepartement AS ud, users AS u WHERE ud.userId=u.userId ORDER BY ud.departementId, u.fullname) AS ud2 ON d.departementId=ud2.departementId
GROUP BY d.departementId;

DROP VIEW IF EXISTS view_userDepartement;
CREATE VIEW view_userDepartement AS
SELECT ud.*, d.departement, u.fullname
FROM userDepartement AS ud, departement As d, users AS u
WHERE ud.departementId=d.departementId AND ud.userId=u.userId;
