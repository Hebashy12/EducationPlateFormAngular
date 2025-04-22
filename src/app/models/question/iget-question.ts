export interface IGetQuestion {
  id:number,
  header:string,
  order:number,
  correctAnswer:boolean,
  quizId:number,
  quiz:null|any
}
