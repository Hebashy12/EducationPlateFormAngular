export interface ICreateVideo {
  title: string;
  description: string;
  // videoDuration: string;
  isFree: boolean;
  sectionId: number;
  videoFile: File|null;
  videoImage: File|null;
}
