export type ToolType = {
  name: string;
  size: number;
  min: number;
  max: number;
};

export const tools: Record<string, ToolType> = {
  brush: { name: "brush", size: 10, min: 2, max: 48 },
  eraser: { name: "eraser", size: 20, min: 2, max: 96 },
  ellipse:{name:"ellipse",size:2,min:1,max:24},
  rectrangle:{name:"rectrangle",size:2,min:1,max:24},
  line:{name:"line",size:2,min:1,max:24},
  pencil:{name:"pencil",size:3,min:1,max:24},
};