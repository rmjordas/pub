import { ApiResponse } from '@/api/types/responses';
import { Project } from '@/api/types/project';

export const createProject: ApiResponse<Project> = {
  ok: true,
  data: {
    name: '',
    description: '',
    launchDate: new Date(),
    projectType: '',
    repositoryUrl: '',
    communicationPlatform: '',
    communicationPlatformUrl: '',
    lookingForMembers: true,
    projectTechnologies: [],
    projectUsers: [],
  },
};
