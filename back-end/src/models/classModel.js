const db = require('../config/db');

const classModel = {
  create: async (class_code, major) => { 
    const query = 'INSERT INTO Classes (class_code, major) VALUES (?, ?)';
    try {
      const [result] = await db.execute(query, [class_code, major]); 
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    const query = 'SELECT * FROM Classes ORDER BY class_code';
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getById: async (classId) => {
    const query = 'SELECT * FROM Classes WHERE class_id = ?';
    try {
      const [rows] = await db.query(query, [classId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  update: async (classId, class_code, major) => { 
    const query =
      'UPDATE Classes SET class_code = ?, major = ? WHERE class_id = ?';
    try {
      const [result] = await db.execute(query, [class_code, major, classId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  delete: async (classId) => {
    const query = 'DELETE FROM Classes WHERE class_id = ?';
    try {
      const [result] = await db.execute(query, [classId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = classModel;