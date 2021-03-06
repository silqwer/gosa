var exam =  require('../../models/gsv/exam');

//출석고사 고사장 후기 목록
module.exports.hstList = (req, res) => {
	let examSeq = req.params.exam;
	res.redirect('/gsv/main/exam/history/list/'+examSeq+'/1');
};

//고사장 참여이력 관리 리스트 페이지 
module.exports.hstListPage = (req, res) => {
	
	let page = req.params.page;
	let examSeq = req.params.exam;
	
	exam.hstCount(examSeq, function(err, rows){
		
		let result = false;
		
		if(rows === undefined){
			//조회 결과 없음 
			res.render('gsv/exam/list', { 
				'title' : '고사장 참여이력',
				'userInfo' : req.user,
				'page' : page,
				'result' : result
			});
		
			return;
		
		}else{
			result = true;
		}
		page = parseInt(page, 10);					// 십진수 만들기 
		let size = 5; 								// 한 페이지에 보여줄 개수		
		let begin = (page - 1) * size;				// 시작 번호
		let cnt = rows[0].CNT;						// 전체 글 개수 
		let totalPage = Math.ceil(cnt / size);		// 전체 페이지 수 
		let pageSize = 10;							// 페이지 링크 갯수 
		
		let startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
		let endPage = startPage + (pageSize - 1);
		
		if(endPage > totalPage){
			endPage = totalPage;
		}
		
		let max = cnt - ((page-1) * size);			// 전체 글이 존재하는 개수
		
		exam.hstList(examSeq, begin, size, function(err, rows){
			
			if (err) {
				console.error(err);
				throw err;
			}
			
			res.render('gsv/exam/list', { 
				'title' : '고사장 참여이력',
				'userInfo' : req.user,
				'list' : rows, 
				'page' : page, 
				'pageSize' : pageSize,
				'startPage' : startPage,
				'endPage' : endPage,
				'totalPage' : totalPage,
				'max' : max,
				'exam' : examSeq,
				'result' : result
			}); 
		});
	});
};

//참여이력
module.exports.selectApply = (req, res) => {
	
	let examSeq = req.body.examSeq;
	let userSeq = req.user.SEQ;
	
	exam.countApply(examSeq, userSeq, function(err, rows){
		if(rows[0].CNT > 0){
			exam.selectApply(examSeq, userSeq, function(err, rows){
				if (err) {
					console.error(err);
					throw err;
				}
				res.send({             
					applySeq : rows[0].APPLY_SEQ
				});
			});
		}else{
			res.send({             
				applySeq : 0
			});
		}
	});
	
};

//출석고사 고사장 후기 등록
module.exports.insertComment = (req, res) => {
	
	let examSeq = req.body.examSeq;
	let applySeq = req.body.applySeq;
	let contents = req.body.contents;
	let userSeq = req.user.SEQ;
	let params = {
		'examSeq':examSeq,
		'applySeq':applySeq,
		'contents':contents,
		'userSeq':userSeq,
	};
	
	exam.insertComment(params, function(err, rows){
		
		if (err) {
			console.error(err);
			throw err;
		}
		
		res.send({
			result : true
		});
		
	});
};

//출석고사 고사장 후기 삭제
module.exports.deleteComment = (req, res) => {
	
	let cmtSeq = req.body.cmtSeq;
	let examSeq = req.body.examSeq;
	
	exam.deleteComment(cmtSeq, function(err, rows){
		
		if (err) {
			console.error(err);
			throw err;
		}
		
		res.send({
			'result' : true,
			'examSeq': examSeq
		});
		
	});
};

//출석고사 고사장 후기 수정
module.exports.updateComment = (req, res) => {
	
	let examSeq = req.body.examSeq;
	let cmtSeq = req.body.cmtSeq;
	let cmtCts = req.body.cmtCts;
	
	exam.updateComment(cmtCts, cmtSeq, function(err, rows){
		
		if (err) {
			console.error(err);
			throw err;
		}
		
		res.send({
			'result' : true, 
			'examSeq': examSeq
		});
		
	});
};


//출석고사 고사장 후기 목록
module.exports.cmtList = (req, res) => {
	let examSeq = req.params.exam;
	res.redirect('/gsv/main/exam/comment/list/'+examSeq+'/0');
};


//고사장 후기 리스트 페이지 
module.exports.cmtListPage = (req, res) => {
	
	let start = req.params.start;
	start = parseInt(start, 10);
	let examSeq = req.params.exam;
	
	exam.cmtList(examSeq, start, function(err, rows){
		
		if (err) {
			console.error(err);
			throw err;
		}
		
		if(rows.length <= 0){
			//조회 결과 없음 
			res.render('gsv/exam/cmtList', { 
				'title' : '고사장 후기',
				'userInfo' : req.user,
				'start' : start,
				'result' : false
			});
		
		}else{
			res.render('gsv/exam/cmtList', { 
				'title' : '고사장 참여이력',
				'userInfo' : req.user,
				'list' : rows, 
				'start' : start + 5, 
				'exam' : examSeq,
				'result' : true
			}); 
		}
	});
};

//고사장 후기 리스트 페이지 더 가져오기  
module.exports.cmtListMore = (req, res) => {
	
	let start = req.body.start;
	start = parseInt(start, 10);
	let examSeq = req.body.exam;
	
	exam.cmtList(examSeq, start, function(err, rows){
		if (err) {
			console.error(err);
			throw err;
			
		}

		if(rows.length > 0){
			res.send({
				'title' : '고사장 후기',
				'userInfo' : req.user,
				'list' : rows, 
				'start' : start + 5, 
				'exam' : examSeq,
				'result' : true
			}); 
		}else{
			//조회 결과 없음 
			res.send({
				'title' : '고사장 후기',
				'userInfo' : req.user,
				'start' : start,
				'result' : false
			});
		}
	});
};


