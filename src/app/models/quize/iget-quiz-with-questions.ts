import { IGetQuestion } from "../question/iget-question";

export interface IGetQuizWithQuestions {
  id:number,
  title:string,
  passingScore:number,
  sectionId:number,
  numOfQuestion:number,
  questions:IGetQuestion[]|null,
  section: null,
  userQuizzes: any[]|null
}

