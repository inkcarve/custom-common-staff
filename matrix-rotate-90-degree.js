/*
Given input matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],

rotate the input matrix in-place such that it becomes:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
*/

var rotate = function(matrix) {
    let result = [];
    let length = matrix[0].length;
    matrix[0].forEach((o,i)=>{
        result.push([]);
    });
    matrix.map((arr,i)=>{
        arr.map((v,j)=>{
            result[j].unshift(v);
        })
    })
    return result;
};