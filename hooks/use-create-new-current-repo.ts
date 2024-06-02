const useCreateNewCurrentRepo = (repoName: string) => {
    localStorage.setItem("CURRENT_REPO", JSON.stringify({ name: repoName }));
};

export default useCreateNewCurrentRepo;
