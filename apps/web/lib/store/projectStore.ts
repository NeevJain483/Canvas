import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  CreateProjectType,
  CurrentProjectType,
  ProjectDataType,
  UUID,
} from "@repo/common/types";
import apiClient from "@lib/api/client";
import {
  UUIDSchema,
  CreateProjectSchema,
  ProjectResponseSchema,
  UserProjectResonseSchema,
  CurrentProjectSchema,
} from "@repo/common/schema";

interface FilterOptions {
  id: string;
}

interface ProjectStore {
  // project data
  projects: ProjectDataType[];
  currentProject: CurrentProjectType | null;
  projectsLoading: boolean;
  projectError: null | any;

  // pagination & filtering
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  publicProjects: number;
  privateProjects: number;
  searchQuery: string;
  filterBy: "recent" | "oldest" | "name" | "size";

  //Auto-save State
  autoSaveEnabled: boolean;
  lastAutoSaveTime: number;
  autoSaveInterval: number;
  isSaving: boolean;

  //Fetch Actions
  fetchProjects(
    page: number,
    limit: number,
    filters?: FilterOptions,
  ): Promise<void>;
  fetchProjectsByUser(
    userId: UUID,
    page: number,
    limit: number,
    filters?: FilterOptions,
  ): Promise<void>;
  fetchProjectById(id: UUID, data: Partial<ProjectDataType>): Promise<void>;
  setCurrentProject(project: CurrentProjectType): void;
  clearProjectMessage(): void;

  // CRUD Actions
  createProject(data: CreateProjectType): Promise<UUID>;
  // updateProject(id: UUID, data: Partial<ProjectDataType>): Promise<void>;
  deleteProject(id: UUID): Promise<void>;
  // duplicateProject(id: UUID): Promise<UUID>;

  // Save Actions
  saveProject(force?: boolean): Promise<void>;
  // autoSave(): Promise<void>;
  // discardChanges(): void;

  // Search & Filter
  // setSearchQuery(query: string): void;
  // setFilterBy(filter: FilterType): void;
  // searchProjects(): Project[];
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    immer<ProjectStore>((set, get) => ({
      // project data
      projects: [],
      currentProject: null,
      projectsLoading: false,
      projectError: null,

      // pagination & filter
      currentPage: 1,
      totalPages: 1,
      totalProjects: 0,
      publicProjects: 0,
      privateProjects: 0,
      searchQuery: "",
      filterBy: "recent",

      // auto-save
      autoSaveEnabled: true,
      lastAutoSaveTime: Date.now(),
      autoSaveInterval: 15000,
      isSaving: false,

      //fetch action
      fetchProjects: async (
        page: number,
        limit: number,
        filters?: FilterOptions,
      ) => {
        set((state) => {
          state.projectsLoading = true;
        });
        try {
          const response = await apiClient.get(
            `/projects?page=${page}&limit=${limit}`,
          );

          const { projects } = ProjectResponseSchema.parse(response.data);
          set((state) => {
            state.projectsLoading = false;
            state.projects = projects;
          });
        } catch (error: any) {
          set((state) => {
            state.projectError = error;
            state.projectsLoading = false;
          });
        }
      },
      fetchProjectsByUser: async (
        userId: UUID,
        page: number,
        limit: number,
        filters?: FilterOptions,
      ) => {
        set((state) => {
          state.projectsLoading = true;
        });
        try {
          const response = await apiClient.get(
            `/users/${userId}/projects?page=${page}&limit=${limit}`,
          );
          const { projects, meta } = UserProjectResonseSchema.parse(
            response.data,
          );
          set((state) => {
            state.projectsLoading = false;
            state.projects = projects || [];
            state.totalProjects = meta.total;
            state.publicProjects = meta.publicCount;
            state.privateProjects = meta.privateCount;
            state.totalPages = meta.totalPages;
          });
        } catch (error: any) {
          set((state) => {
            state.projectError = error;
            state.projectsLoading = false;
          });
        }
      },
      fetchProjectById: async (id: UUID, data: Partial<ProjectDataType>) => {
        set((state) => {
          state.currentProject = null;
          state.projectsLoading = true;
        });
        try {
          const verifiedId = UUIDSchema.parse({ id: id as UUID });
          const response = await apiClient.get(`/projects/${verifiedId.id}`);
          const verifiedData = CurrentProjectSchema.parse(response.data);
          set((state) => {
            state.currentProject = verifiedData;
            state.projectsLoading = false;
          });
        } catch (error: any) {
          set((state) => {
            state.projectError = error;
            state.projectsLoading = false;
          });
        }
      },
      setCurrentProject: (project: CurrentProjectType) => {
        set((state) => {
          state.currentProject = project;
        });
      },
      clearProjectMessage: () => {
        set((state) => {
          state.projectError = null;
        });
      },

      // CRUD Actions
      createProject: async (data: CreateProjectType): Promise<UUID> => {
        set((state) => {
          state.projectsLoading = true;
          state.projectError = null;
        });

        try {
          const verifiedData = CreateProjectSchema.parse(data);
          const res = await apiClient.post("/projects/", verifiedData);

          const { id } = UUIDSchema.parse(res.data);

          set((state) => {
            state.projectsLoading = false;
          });
          return id as UUID;
        } catch (error: any) {
          set((state) => {
            state.projectError = error.message || "Failed to create project";
            state.projectsLoading = false;
          });
          throw error;
        }
      },
      deleteProject: async (id: UUID) => {
        set((state) => {
          state.projectError = null;
          state.projectsLoading = true;
        });

        try {
          const response = await apiClient.delete(`/projects/${id}`);
          set((state) => {
            state.projectsLoading = false;
            state.projects = get().projects.filter((el) => el.id != id);
          });
        } catch (error: any) {
          set((state) => {
            state.projectError = error;
            state.projectsLoading = false;
          });
        }
      },
      // Save Action
      saveProject: async (force?: boolean) => {
        set((state) => {
          state.projectsLoading = true;
        });
        try {
          await apiClient.put(``, {});
        } catch (error) {
          console.log(error);
        }
        set((state) => {
          state.projectsLoading = false;
        });
      },
    })),
    {
      name: "project-store",
      partialize: (state) => ({
        currentProject: state.currentProject,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        totalProjects: state.totalProjects,
        publicProjects: state.publicProjects,
        privateProjects: state.privateProjects,
        searchQuery: state.searchQuery,
        filterBy: state.filterBy,
        autoSaveEnabled: state.autoSaveEnabled,
        lastAutoSaveTime: state.lastAutoSaveTime,
        autoSaveInterval: state.autoSaveInterval,
      }),
    },
  ),
);
