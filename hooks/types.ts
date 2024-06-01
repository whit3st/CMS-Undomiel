import { Endpoints } from "@octokit/types";

type listUserReposResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];
export type ResponseData =
    Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];

export type SingleFile = Extract<ResponseData, { type: "file" }>;
export type MultipleFiles = Extract<ResponseData, { type: "file" }>[];
export type ResponseArray = Extract<
    ResponseData,
    { type: "dir" | "file" | "symlink" | "submodule" }[]
>;

export type ResponseSingle = Extract<
    ResponseData,
    { type: "dir" | "file" | "symlink" | "submodule" }
>;
