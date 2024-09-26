const query = {
  create: {
    user: "CREATE TABLE IF NOT EXISTS user (userid TEXT PRIMARY KEY, userpw TEXT, username1 TEXT, username2 TEXT, job TEXT, addinfo1 TEXT, addinfo2 TEXT, usertab_baseinfo TEXT, usertab_detailinfo TEXT, usertab_first_word TEXT, usertab_second_word TEXT, user_hp TEXT, user_atk TEXT, user_def TEXT, user_wis TEXT, user_agi TEXT, user_luk TEXT, user_money TEXT, user_skill1 TEXT, user_skill2 TEXT, user_skill3 TEXT, user_skill4 TEXT, user_skill5 TEXT, user_img_0 TEXT, user_img_1 TEXT, user_img_2 TEXT, user_img_3 TEXT, updated INTEGER)",
    images: "CREATE TABLE IF NOT EXISTS images (name TEXT PRIMARY KEY, basename TEXT, path TEXT, lastModified INTEGER, size INTEGER, updated INTEGER)",
    items: "CREATE TABLE IF NOT EXISTS items (userid TEXT, item TEXT, updated INTEGER)",
    skill: `CREATE TABLE IF NOT EXISTS skill (skill_name TEXT PRIMARY KEY, skill_desc TEXT, skill_rate TEXT, skill_control_rate TEXT, skill_effect_usage TEXT, skill_type TEXT, skill_range TEXT, skill_stat TEXT, skill_cost_stat TEXT, skill_cost TEXT, skill_control_cost TEXT, skill_img_0 TEXT, skill_img_1 TEXT, updated INTEGER)`,
    skill_detail: "CREATE TABLE IF NOT EXISTS skill_detail (skill_detail_type TEXT, skill_detail_range TEXT, skill_detail_stat TEXT, skill_detail_cost TEXT, updated INTEGER)",
  },
};
export default query;
