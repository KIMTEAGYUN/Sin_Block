const express = require('express');
const router = express.Router();

const db = require('../../models/db');

/*HTTP Method의종류 (4가지) 
1. get- 조회
2. post- 생성 or 등록
3. put- 수정 or 갱신
4. delete 삭제
*/
//router.<method>


//GET '/', 모든 게시글을 조회한다.
router.get('/', (req, res) => {
    const sql = 'select * from board where is_deleted=?';
    db.query(sql,[0], (err, rows) => {
        if (err) {
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else {
            res.json({
                status: "Success",
                result: rows
            })
        }
    })
});

// GET '/:boardId', 게시글의 상세조회
//router에서 : 이 들어간 url은 parameter(변수)로 url을 입력받겠다.
router.get('/:boardId', function (req, res) {
    const boardId = req.params.boardId;
    const sql = 'select * from board where id=? and is_deleted=?';
    db.query(sql, [boardId,0], (err, rows) => {
        if (err) {
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else {
            if (rows.length < 1) {
                res.status(404).json({
                    status: "Fail",
                    result: "Resource is deleted"
                })
            } else {
                res.json({
                    status: "Success",
                    result: rows[0]
                })
            }
        }
    })
});

//POST '/' 게시글 생성
// 게시글을 생성.
// insert into <boardname>(<column1, column2,...>) values(<'value1, value2'...>);
router.post('/',(req,res)=>{
    const{title,content} = req.body;
    const sql = "insert into board(titile, content) values(?, ?)"
    db.query(sql,[title,content],(err,result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(201).json({
                status: "Success",
                result: result
            })
        }
    })
});

//PUT '/:boardId' 게시글 수정

router.put('/:boardId',(req,res)=>{
    const {title,content} = req.body;
    const sql="update board set titile = ?, content = ? where id =? and is_deleted=?";
    db.query(sql,[title,content,req.params.boardId,0],(err,result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(200).json({
                status: "Success",
                result: result
            })
        }
    })
});

//delete '/:boardId' 게시글 삭제

router.delete('/:boardId',(req,res)=>{
    const boardId = req.params.boardId;
    const sql = "update board set is_deleted=? where id =?";
    db.query(sql,[1,boardId],(err,result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(200).json({
                status: "Success",
                result: result
            })
        }
    })
})
module.exports = router;
