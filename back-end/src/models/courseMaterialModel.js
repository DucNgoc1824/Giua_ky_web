const db = require('../config/db');

const courseMaterialModel = {
  create: async (subject_id, title, url, added_by_user_id, file_type = null) => {
    const query = `
      INSERT INTO Course_Materials (subject_id, title, url, added_by_user_id, file_type)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [
        subject_id,
        title,
        url,
        added_by_user_id,
        file_type
      ]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  findBySubject: async (subject_id) => {
    const query = `
      SELECT cm.material_id, cm.title, cm.url, cm.file_type, cm.created_at, u.full_name as added_by
      FROM Course_Materials cm
      JOIN Users u ON cm.added_by_user_id = u.user_id
      WHERE cm.subject_id = ?
      ORDER BY cm.created_at DESC;
    `;
    try {
      const [rows] = await db.query(query, [subject_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  delete: async (material_id) => {
    const query = 'DELETE FROM Course_Materials WHERE material_id = ?';
    try {
      const [result] = await db.execute(query, [material_id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = courseMaterialModel;