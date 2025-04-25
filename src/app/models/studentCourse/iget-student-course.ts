export interface IGetStudentCourse {
  userId:string,
  coursesId:number,
  progressValue:number,
  rating:number,
  enrollmentDate:Date,
  isCompleted:boolean,
  completedAt:Date|null,
  courseImg:string,
  courseTitle:string
}


