const query = {
  /* prettier-ignore */
  create: {
    // admin manager 페이지에서 사용하는 테이블
    images: "CREATE TABLE IF NOT EXISTS images (name TEXT PRIMARY KEY, basename TEXT, path TEXT, lastModified INTEGER, size INTEGER, updated INTEGER)",
    user: "CREATE TABLE IF NOT EXISTS user (userid TEXT PRIMARY KEY, username1 TEXT, username2 TEXT, user_stamina INTEGER DEFAULT 5, job TEXT, addinfo1 TEXT, addinfo2 TEXT, usertab_baseinfo TEXT, usertab_detailinfo TEXT, usertab_first_word TEXT, usertab_second_word TEXT, user_hp INTEGER, user_atk INTEGER, user_def INTEGER, user_wis INTEGER, user_agi INTEGER, user_luk INTEGER, user_money INTEGER, user_skill1 TEXT, user_skill2 TEXT, user_skill3 TEXT, user_skill4 TEXT, user_skill5 TEXT, user_img_0 TEXT, user_img_1 TEXT, user_img_2 TEXT, user_img_3 TEXT, user_img_4 TEXT, updated INTEGER)",
    user_item: "CREATE TABLE IF NOT EXISTS user_item (userid TEXT, item TEXT, updated INTEGER)",
    user_skill: "CREATE TABLE IF NOT EXISTS user_skill (userid TEXT, skill_name TEXT, skill_desc	TEXT, updated INTEGER , PRIMARY KEY(userid, skill_name))",
    user_auth: "CREATE TABLE IF NOT EXISTS user_auth (userid TEXT, userpw TEXT, role TEXT DEFAULT 'user', updated INTEGER, PRIMARY KEY(userid))",
    user_mail: "CREATE TABLE IF NOT EXISTS user_mail (userid TEXT, recipient TEXT, item_name TEXT, mail TEXT, status TEXT, updated INTEGER)",
    job: "CREATE TABLE IF NOT EXISTS job (job_name TEXT PRIMARY KEY, job_hp TEXT, job_atk TEXT, job_def TEXT, job_wis TEXT, job_agi TEXT, job_luk TEXT, job_img_0 TEXT, updated INTEGER)",
    job_skill: "CREATE TABLE IF NOT EXISTS job_skill (job_name TEXT, skill_name TEXT, updated INTEGER, PRIMARY KEY (job_name, skill_name))",
    monster: "CREATE TABLE monster (monster_name TEXT PRIMARY KEY, monster_hp TEXT, monster_atk TEXT, monster_def TEXT, monster_wis TEXT, monster_agi TEXT, monster_luk TEXT, monster_skill_rate_0 TEXT, monster_skill_rate_1 TEXT, monster_skill_rate_2 TEXT, monster_skill_rate_3 TEXT, monster_skill_rate_4 TEXT, monster_skill_0 TEXT, monster_skill_1 TEXT, monster_skill_2 TEXT, monster_skill_3 TEXT, monster_skill_4 TEXT, monster_img_0 TEXT, updated INTEGER)",
    // monster_event: "CREATE TABLE monster_event (monster_name TEXT, monster_event_idx INTEGER, monster_event_rate TEXT, monster_event_stat_rate TEXT, monster_event_msg TEXT, monster_event_cost_stat TEXT, monster_event_type TEXT, monster_event_range TEXT, monster_event_stat TEXT, monster_event_img	TEXT, updated INTEGER , PRIMARY KEY (monster_name, monster_event_idx))",
    monster_event: "CREATE TABLE monster_event (monster_name TEXT, monster_event_idx INTEGER, monster_event_rate TEXT, monster_event_skill TEXT, monster_event_msg TEXT, monster_event_img TEXT, updated INTEGER , PRIMARY KEY (monster_name, monster_event_idx))",
    // skill: `CREATE TABLE IF NOT EXISTS skill (skill_name TEXT PRIMARY KEY, skill_desc TEXT, skill_rate TEXT, skill_control_rate TEXT, skill_effect_usage TEXT, skill_type TEXT, skill_range TEXT, skill_stat TEXT, skill_operator TEXT, skill_cost_stat TEXT, skill_cost TEXT, skill_control_cost TEXT, skill_min INTEGER, skill_max INTEGER, skill_img_0 TEXT, skill_img_1 TEXT, updated INTEGER)`,
    skill: `CREATE TABLE IF NOT EXISTS skill (skill_name TEXT PRIMARY KEY, skill_desc TEXT, skill_effect_usage TEXT, skill_type TEXT, skill_range TEXT, skill_start_turn INTEGER, skill_duration_turn INTEGER, skill_img_0 TEXT, skill_img_1 TEXT, updated INTEGER)`,
    skill_operator: "CREATE TABLE IF NOT EXISTS skill_operator (skill_name TEXT, skill_operator_order INTEGER, skill_operator_type TEXT, skill_operator_value INTEGER, skill_operator_etc TEXT, updated INTEGER)",
    skill_option: "CREATE TABLE IF NOT EXISTS skill_option (skill_option_type TEXT, skill_option_range TEXT, skill_option_stat TEXT, skill_option_cost TEXT, updated INTEGER)",
    item: "CREATE TABLE item (item_name TEXT PRIMARY KEY, item_cost TEXT, item_statmin TEXT, item_statmax TEXT, item_type TEXT, item_consumable TEXT, item_addstat TEXT, item_etc TEXT, item_desc TEXT, item_img_0 TEXT, updated INTEGER)",
    item_option: "CREATE TABLE item_option (item_option_type TEXT, item_option_addstat TEXT, updated INTEGER)",
    patrol: "CREATE TABLE patrol (patrol_name TEXT, patrol_type TEXT, patrol_atk INTEGER, patrol_def INTEGER, patrol_wis INTEGER, patrol_agi INTEGER, patrol_luk INTEGER, patrol_fail_type TEXT, patrol_fail_money INTEGER, patrol_fail_count INTEGER, patrol_fail_msg TEXT, patrol_desc TEXT, patrol_img TEXT, patrol_img_fail TEXT, updated INTEGER, PRIMARY KEY(patrol_name, patrol_type))",
    patrol_result: "CREATE TABLE patrol_result (patrol_name TEXT, patrol_ret_type TEXT, patrol_ret_idx INTEGER, patrol_select TEXT, patrol_ret_money TEXT, patrol_ret_count TEXT, patrol_ret_img TEXT, patrol_ret_msg TEXT, updated INTEGER, PRIMARY KEY(patrol_name, patrol_ret_type, patrol_ret_idx))",
    // admin page 페이지 에서 사용하는 테이블
    page: "CREATE TABLE IF NOT EXISTS page (page_name TEXT, id TEXT, value TEXT, updated INTEGER, PRIMARY KEY(page_name, id))",
    log: "CREATE TABLE IF NOT EXISTS log (user_name TEXT, page TEXT, level TEXT, log TEXT, updated INTEGER)",
    system_log: "CREATE TABLE IF NOT EXISTS system_log (log TEXT, updated INTEGER)",
    raid: 'CREATE TABLE IF NOT EXISTS raid (raid_name TEXT PRIMARY KEY, monster_name TEXT, raid_reader TEXT, total_user INTEGER, status INTEGER, updated INTEGER)',
    raid_list: 'CREATE TABLE IF NOT EXISTS raid_list (raid_name TEXT, raid_user TEXT, raid_order INTEGER, status INTEGER, updated INTEGER, PRIMARY KEY(raid_user))',
    raid_item: 'CREATE TABLE IF NOT EXISTS raid_item (raid_name TEXT, item_name TEXT, updated INTEGER)'
  },
  select: {
    user_skill: "SELECT B.*, A.skill_desc user_skill_desc FROM (SELECT * FROM user_skill WHERE userid = ?) A INNER JOIN skill B ON A.skill_name = B.skill_name order by A.skill_name",
    user_item: "SELECT B.* FROM (SELECT * FROM user_item WHERE userid = ?) A INNER JOIN item B ON A.item = B.item_name order by a.updated",
    using_item: "SELECT B.* FROM (SELECT * FROM user_item WHERE userid = ? AND item = ?) A INNER JOIN item B ON A.item = B.item_name LIMIT 1",
    member_skill: "SELECT B.* FROM (SELECT * FROM user_skill WHERE userid = ?) A INNER JOIN skill B ON A.skill_name = B.skill_name order by a.updated",
    patrol_item: "SELECT * FROM item WHERE item_name = '에고'",
    log: "SELECT * FROM log WHERE user_name = ? AND page = ?",
    log_time: "SELECT * FROM log WHERE user_name = ? AND page = ? AND updated >= ?",
    user_patrol: "SELECT user_hp, user_atk, user_def, user_wis, user_agi, user_luk, user_stamina FROM user WHERE userid = ?",
    user_money: "SELECT user_money FROM user WHERE userid = ?",
    user_job: "SELECT job_name, job_img_0 FROM (SELECT job FROM user WHERE userid = ?) a INNER JOIN job b ON a.job = b.job_name",
    check_user_skill: "SELECT * FROM user_skill WHERE userid = ? and skill_name = ?",
    user_mail: "SELECT A.*, B.item_img_0, '사용된우편' item_type FROM (SELECT * FROM user_mail WHERE userid = ?) A INNER JOIN item B ON A.item_name = B.item_name",
    raid_reader: "SELECT raid_reader FROM raid WHERE raid_name = ?",
    raid_user: "SELECT IFNULL((SELECT 1 FROM raid WHERE raid_reader=? LIMIT 1), 0) isreader, IFNULL((SELECT 1 FROM raid_list WHERE raid_user=? LIMIT 1), 0) isuser",
    raid_create_user: "SELECT IFNULL((SELECT 1 FROM raid WHERE raid_name=? and raid_reader = ?), 0) isreader",
    raid_last_order: "SELECT MAX(total_user) total_user, MAX(raid_order) last_order FROM (SELECT raid_name, total_user FROM raid WHERE raid_name = ?) a INNER JOIN raid_list b ON a.raid_name = b.raid_name",
    raid_user_list: "SELECT B.* , raid_order FROM ( SELECT * FROM raid_list WHERE raid_name=? ) A INNER JOIN user B ON B.userid=A.raid_user ORDER BY A.raid_order",
    raid_monster: "SELECT A.raid_reader, total_user, B.* FROM ( SELECT * FROM raid WHERE raid_name = ? ) A INNER JOIN monster B ON B.monster_name=A.monster_name",
    raid_items: "SELECT B.* FROM (SELECT * FROM raid_item WHERE raid_name = ?) A INNER JOIN item B ON A.item_name = B.item_name",
  },
  update: {
    user_patrol_result: "UPDATE user SET user_stamina = ?, user_money = user_money + ? WHERE userid = ?",
    user_stamina: "UPDATE user SET user_stamina = ? WHERE userid = ?",
    user_money: "UPDATE user SET user_money = ? WHERE userid = ?",
    user_skill: "UPDATE user_skill SET skill_desc = ? WHERE userid = ? AND skill_name = ?",
    raid_create: "UPDATE raid SET raid_reader=?,total_user = ? WHERE raid_name = ?",
    raid_init: "UPDATE raid SET raid_reader=NULL,total_user=NULL WHERE raid_name = ?",
  },
  delete: {
    user_item_one: "DELETE FROM user_item WHERE userid = ? AND item = ? LIMIT 1",
    user_mail_one: "DELETE FROM user_mail WHERE userid = ? AND item_name = ? AND updated = ? LIMIT 1",
    user_log: "DELETE FROM log WHERE user_name = ?",
    user_log_page: "DELETE FROM log WHERE user_name = ? AND page = ?",
    raid_list: "DELETE FROM raid_list WHERE raid_name = ?",
    raid_list_user: "DELETE FROM raid_list WHERE raid_name = ? AND raid_user = ?",
  },
};
// export default query;
if (typeof require !== "undefined") {
  module.exports = query;
} else {
  window.query = query; // ES 모듈 방식에서 사용할 경우
}
