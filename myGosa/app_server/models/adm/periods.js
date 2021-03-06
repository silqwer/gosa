/**
 * http://usejsdoc.org/
 */
var mysql_dbc = require('../../mysql/db_con.js')();
var connection = mysql_dbc.init();


var Periods = {
	
	list : function(word, begin, size, callback) {
		
		let sql = "";
		
		if(word !== undefined){
			sql += " WHERE SCHEDULE_NAME LIKE '%"+word+"%' ";
		}
		
		return connection.query("SELECT * FROM (SELECT " +
				"DISTINCT  (SELECT NAME FROM SCHEDULE WHERE SEQ = P.SCHEDULE_SEQ) AS SCHEDULE_NAME, " +
				"SCHEDULE_SEQ " +
				"FROM PERIOD P ORDER BY SCHEDULE_SEQ DESC) S " + sql +
				"LIMIT ?, ?", [begin, size], callback);
	},
	
	schedule : function(callback) {
		return connection.query("SELECT SEQ, NAME FROM SCHEDULE " +
				"WHERE SEQ NOT IN (SELECT DISTINCT SCHEDULE_SEQ FROM PERIOD) ORDER BY ATTENDANCE_DATE DESC", callback);
	},
	
	selected_schedule : function(seq, callback) {
		return connection.query("SELECT SEQ, NAME, " +
				"(SELECT IF((SELECT DISTINCT P.SCHEDULE_SEQ  FROM PERIOD P WHERE P.SCHEDULE_SEQ = S.SEQ AND P.SCHEDULE_SEQ = ?) IS NULL, '', 'checked')) AS CHECKED " + 
				"FROM SCHEDULE S ORDER BY ATTENDANCE_DATE DESC", [seq], callback);
	}, 
	
	selected_periods : function (seq, callback) {
		return connection.query("SELECT " +
				"DISTINCT  (SELECT NAME FROM SCHEDULE WHERE SEQ = P.SCHEDULE_SEQ) AS SCHEDULE_NAME, " +
				"P.SCHEDULE_SEQ AS SCHEDULE_SEQ " +
				"FROM PERIOD P WHERE P.SCHEDULE_SEQ = ? ", [seq], callback);
	}, 
	
	exam : function(callback) {
		return connection.query("SELECT SEQ, NAME FROM EXAM ORDER BY NAME ASC", callback);
	}, 
	
	selected_exam : function(seq, callback) {
		return connection.query("SELECT DISTINCT " +
				"E.SEQ AS SEQ, " +
				"E.NAME AS NAME, " +
				"E.SCHOOL AS SCHOOL, " +
				"(SELECT IF((SELECT DISTINCT P.SCHEDULE_SEQ  FROM PERIOD P WHERE P.EXAM_SEQ = E.SEQ AND P.SCHEDULE_SEQ = ?) IS NULL, '', 'checked')) AS CHECKED, " + 
				"(SELECT COUNT(P.CLASS) FROM PERIOD P WHERE P.SCHEDULE_SEQ = D.SCHEDULE_SEQ AND P.EXAM_SEQ = D.EXAM_SEQ) AS CLASS " + 
				"FROM EXAM E LEFT JOIN PERIOD D " +
				"ON E.SEQ = D.EXAM_SEQ " +
				"AND D.SCHEDULE_SEQ = ?" +
				"ORDER BY NAME ASC", [seq, seq], callback);
	}, 
	
	countApply : function (seq, callback) {
		return connection.query('SELECT COUNT(*) AS CNT FROM APPLY WHERE SCHEDULE_SEQ = ?',[seq], callback);
	}, 
	
	count : function (word, callback) {
		
		let sql = "SELECT COUNT(*) AS CNT FROM (SELECT " +
				"DISTINCT  (SELECT NAME FROM SCHEDULE WHERE SEQ = P.SCHEDULE_SEQ) AS SCHEDULE_NAME, " +
				"SCHEDULE_SEQ " +
				"FROM PERIOD P ORDER BY SCHEDULE_SEQ DESC) S";
		
		if(word !== undefined){
			sql += " WHERE SCHEDULE_NAME LIKE '%"+word+"%' ";
		}
		
		return connection.query(sql, callback);
	},
	
	insert : function (params, callback) {                                
		return connection.query("INSERT INTO PERIOD (SCHEDULE_SEQ, EXAM_SEQ, CLASS_NUM, CLASS)" +
				"VALUES (?, ?, ?, ?)", [params.schSeq, params.examSeq, params.examNum, params.examClass], callback);
	}, 
	
	insertExam : function (params, callback) {
		return connection.query("INSERT INTO EXAM (NAME, SCHOOL, ADDR)" +
				"VALUES (?, ?, ?)", [params.name, params.school, params.addr], callback);
	}, 
	
	read : function (seq, callback) {
		return connection.query("SELECT " +
				"SEQ, NAME, SCHOOL, ADDR " +
				"FROM EXAM " +
				"WHERE SEQ = ?", [seq], callback);
	}, 
	
	readSeq : function (params, callback) {
		return connection.query("SELECT " +
				"SEQ, NAME, SCHOOL, ADDR " +
				"FROM EXAM " +
				"WHERE NAME = ? " +
				"AND SCHOOL = ? ", [params.regionName, params.schoolName], callback);
	}, 
	
	delete : function (seq, callback ) {
		return connection.query("DELETE FROM PERIOD WHERE SCHEDULE_SEQ = ?", [seq], callback);
	},
	
};

module.exports = Periods; 