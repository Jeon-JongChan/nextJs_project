const query = {
  /* prettier-ignore */
  create: {
    // admin manager 페이지에서 사용하는 테이블
    images: "CREATE TABLE IF NOT EXISTS images (name TEXT PRIMARY KEY, basename TEXT, path TEXT, lastModified INTEGER, size INTEGER, updated INTEGER)",
    user: "CREATE TABLE IF NOT EXISTS user (userid TEXT PRIMARY KEY, userpw TEXT, username1 TEXT, username2 TEXT, job TEXT, addinfo1 TEXT, addinfo2 TEXT, usertab_baseinfo TEXT, usertab_detailinfo TEXT, usertab_first_word TEXT, usertab_second_word TEXT, user_hp TEXT, user_atk TEXT, user_def TEXT, user_wis TEXT, user_agi TEXT, user_luk TEXT, user_money TEXT, user_skill1 TEXT, user_skill2 TEXT, user_skill3 TEXT, user_skill4 TEXT, user_skill5 TEXT, user_img_0 TEXT, user_img_1 TEXT, user_img_2 TEXT, user_img_3 TEXT, updated INTEGER)",
    user_item: "CREATE TABLE IF NOT EXISTS user_item (userid TEXT, item TEXT, updated INTEGER)",
    job: "CREATE TABLE IF NOT EXISTS job (job_name TEXT PRIMARY KEY, job_hp TEXT, job_atk TEXT, job_def TEXT, job_wis TEXT, job_agi TEXT, job_luk TEXT, job_img_0 TEXT, updated INTEGER)",
    job_skill: "CREATE TABLE IF NOT EXISTS job_skill (job_name TEXT, skill TEXT, updated INTEGER, PRIMARY KEY (job_name, skill))",
    monster: "CREATE TABLE monster (monster_name TEXT PRIMARY KEY, monster_hp TEXT, monster_atk TEXT, monster_def TEXT, monster_wis TEXT, monster_agi TEXT, monster_luk TEXT, monster_skill_rate_0 TEXT, monster_skill_rate_1 TEXT, monster_skill_rate_2 TEXT, monster_skill_rate_3 TEXT, monster_skill_rate_4 TEXT, monster_skill_0 TEXT, monster_skill_1 TEXT, monster_skill_2 TEXT, monster_skill_3 TEXT, monster_skill_4 TEXT, monster_img_0 TEXT, updated INTEGER)",
    monster_event: "CREATE TABLE monster_event (monster_name TEXT, monster_event_idx INTEGER, monster_event_rate TEXT, monster_event_stat_rate TEXT, monster_event_msg TEXT, monster_event_cost_stat TEXT, monster_event_type TEXT, monster_event_range TEXT, monster_event_stat TEXT, updated INTEGER , PRIMARY KEY (monster_name, monster_event_idx))",
    skill: `CREATE TABLE IF NOT EXISTS skill (skill_name TEXT PRIMARY KEY, skill_desc TEXT, skill_rate TEXT, skill_control_rate TEXT, skill_effect_usage TEXT, skill_type TEXT, skill_range TEXT, skill_stat TEXT, skill_cost_stat TEXT, skill_cost TEXT, skill_control_cost TEXT, skill_img_0 TEXT, skill_img_1 TEXT, updated INTEGER)`,
    skill_detail: "CREATE TABLE IF NOT EXISTS skill_detail (skill_detail_type TEXT, skill_detail_range TEXT, skill_detail_stat TEXT, skill_detail_cost TEXT, updated INTEGER)",
    item: "CREATE TABLE item (item_name TEXT PRIMARY KEY, item_cost TEXT, item_statmin TEXT, item_statmax TEXT, item_type TEXT, item_consumable TEXT, item_addstat TEXT, item_msg TEXT, item_desc TEXT, item_img_0 TEXT, updated INTEGER)",
    item_option: "CREATE TABLE item_option (item_option_type TEXT, item_option_addstat TEXT, updated INTEGER)",
    patrol: "CREATE TABLE patrol (patrol_name TEXT, patrol_type TEXT, patrol_atk TEXT, patrol_def TEXT, patrol_wis TEXT, patrol_agi TEXT, patrol_luk TEXT, patrol_fail_type TEXT, patrol_fail_money TEXT, patrol_fail_count TEXT, patrol_fail_msg TEXT, patrol_desc TEXT, patrol_img TEXT, patrol_img_fail TEXT, updated INTEGER, PRIMARY KEY(patrol_name, patrol_type))",
    patrol_result: "CREATE TABLE patrol_result (patrol_name TEXT, patrol_ret_type TEXT, patrol_ret_idx INTEGER, patrol_select TEXT, patrol_ret_money TEXT, patrol_ret_count TEXT, patrol_ret_img TEXT, patrol_ret_msg TEXT, updated INTEGER, PRIMARY KEY(patrol_name, patrol_ret_type, patrol_ret_idx))",
    // admin page 페이지 에서 사용하는 테이블
    page: "CREATE TABLE IF NOT EXISTS page (page_name TEXT, id TEXT, value TEXT, updated INTEGER, PRIMARY KEY(page_name, id))",
  },
};
export default query;
