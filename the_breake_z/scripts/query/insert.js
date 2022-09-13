const query = {
    insert_local: "INSERT INTO LOCAL (ID, NAME) VALUES (@id, @name)",
    insert_spec: "INSERT INTO SPEC (ID, NAME) VALUES (@id, @name)",
    insert_image: "INSERT INTO IMAGE (ID, PATH) VALUES (@id, @path)",
    insert_type: "INSERT INTO TYPE (ID, NAME) VALUES (@id, @name)",
    insert_poketmon: `
    INSERT INTO POKETMON (ID, NAME, LOCAL_ID, IMAGE_ID, TYPE_ID, RARE) 
    VALUES (@id, @name, @local_id, @image_id, @type_id, @rare)
    `,
    insert_poketmon_spec: `
    INSERT INTO LOCAL (POKETMON_ID, SPEC_ID, HIDDEN_YN) VALUES (@poketmon_id, @spec_id, @hidden_yn)
    `,
};

module.exports = query;
