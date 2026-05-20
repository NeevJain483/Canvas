import Main from "../../../../component/dashboard/projects/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Main id={id}>
        
      </Main>
    </>
  );
}
