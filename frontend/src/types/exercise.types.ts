export interface ExerciseDTO {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  videoUrl?: string;
  mediaType?: string; // "video" | "gif" | "image" | undefined
}

export interface ExerciseCategoryDTO {
  id: number;
  name: string;
  description: string;
}
