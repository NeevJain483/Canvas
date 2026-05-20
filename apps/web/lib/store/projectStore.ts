import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CreateProjectType, ProjectDataType, UUID } from "@repo/common/types";
import apiClient from "@lib/api/client";
import {
  UUIDSchema,
  CreateProjectSchema,
  ProjectResponseSchema,
  ProjectDataSchema,
} from "@repo/common/schema";

interface FilterOptions {
  id: string;
}

interface ProjectStore {
  // project data
  projects: ProjectDataType[];
  currentProject: ProjectDataType | null;
  projectsLoading: boolean;
  projectError: string | null;

  // pagination & filtering
  currentPage: number;
  pageSize: number;
  totalProjects: number;
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
  fetchProjectById(id: UUID, data: Partial<ProjectDataType>): Promise<void>;
  setCurrentProject(project: ProjectDataType): void;

  // CRUD Actions
  createProject(data: CreateProjectType): Promise<UUID>;
  // updateProject(id: UUID, data: Partial<Project>): Promise<void>;
  // deleteProject(id: UUID): Promise<void>;
  // duplicateProject(id: UUID): Promise<UUID>;

  // Save Actions
  // saveProject(force?: boolean): Promise<void>;
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
      pageSize: 1,
      totalProjects: 0,
      searchQuery: "",
      filterBy: "recent",

      // auto-save
      autoSaveEnabled: true,
      lastAutoSaveTime: Date.now(),
      autoSaveInterval: 30000,
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
      fetchProjectById: async (id: UUID, data: Partial<ProjectDataType>) => {
        set((state) => {
          state.currentProject = null;
          state.projectsLoading = true;
        });
        try {
          const verifiedData = UUIDSchema.parse({ id: id as UUID });
          const response = await apiClient.get(`/projects/${verifiedData.id}`);
          const project = ProjectDataSchema.parse(response.data.project);
          set((state)=>{
            state.currentProject = project;
            state.projectsLoading = false;
          })
        } catch (error) {
          set((state)=>{
            state.projectsLoading = false;
          })
        }
      },
      setCurrentProject: (project: ProjectDataType) => {
        set((state) => {
          state.projectsLoading = true;
          state.currentProject = project;
        });
      },

      // CRUD Actions
      createProject: async (data: CreateProjectType): Promise<UUID> => {
        set((state) => ({
          projectsLoading: true,
          projectError: null,
        }));

        try {
          const verifiedData = CreateProjectSchema.parse(data);
          const res = await apiClient.post("/projects/", verifiedData);

          const { id } = UUIDSchema.parse(res.data);

          set((state) => ({ projectsLoading: false }));
          return id as UUID;
        } catch (error: any) {
          console.error("Project creation failed:", error);

          set((state) => ({
            projectError: error.message || "Failed to create project",
            projectsLoading: false,
          }));
          throw error;
        }
      },
    })),
    {
      name: "project-store",
      partialize: (state) => ({
        projects:state.projects,
        currentProject: state.currentProject,
      }),
    },
  ),
);
